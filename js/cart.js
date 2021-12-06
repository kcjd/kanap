// DOM elements
const container = document.querySelector('#cart__items');
const totalQuantity = document.querySelector('#totalQuantity');
const totalPrice = document.querySelector('#totalPrice');
const orderForm = document.querySelector('.cart__order__form');
const firstNameInput = document.querySelector('#firstName');
const lastNameInput = document.querySelector('#lastName');
const addressInput = document.querySelector('#address');
const cityInput = document.querySelector('#city');
const emailInput = document.querySelector('#email');

// Get cart from local storage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Get product data from API
const getProduct = async (id) => {
  const response = await fetch(`https://kanap-back.herokuapp.com/api/products/${id}`);
  if (!response.ok) throw Error(`${response.status} : ${response.statusText}`);
  return response.json();
};

// Get cart item with product data
const getCartItemData = async ({ _id, color, quantity }) => {
  const product = await getProduct(_id);
  return { ...product, color, quantity };
};

// Delete an item from cart
const deleteCartItem = ({ id, color }) => {
  const index = cart.findIndex((i) => i._id === id && i.color === color);
  cart.splice(index, 1);
  const cartStorage = cart.map((i) => ({ _id: i._id, color: i.color, quantity: i.quantity }));
  localStorage.setItem('cart', JSON.stringify(cartStorage));
};

// Update an item in cart
const editCartItemQuantity = ({ id, color, quantity }) => {
  const index = cart.findIndex((i) => i._id === id && i.color === color);
  cart[index].quantity = quantity;
  const cartStorage = cart.map((i) => ({ _id: i._id, color: i.color, quantity: i.quantity }));
  localStorage.setItem('cart', JSON.stringify(cartStorage));
};

// Display cart total
const displayCartTotal = () => {
  const { quantity, price } = cart.reduce(
    (total, i) => ({
      ...total,
      quantity: total.quantity + i.quantity,
      price: total.price + i.price * i.quantity,
    }),
    { quantity: 0, price: 0 },
  );

  totalQuantity.textContent = `${quantity} ${quantity <= 1 ? 'article' : 'articles'}`;
  totalPrice.textContent = price;
};

// Get selected item then delete it from cart
const handleDeleteButton = (e) => {
  const selectedItem = e.target.closest('[data-id]');
  const { id, color } = selectedItem.dataset;

  selectedItem.remove();

  deleteCartItem({ id, color });
  displayCartTotal();
};

// Get selected item and new quantity then update it in cart
const handleQuantityInput = (e) => {
  const selectedItem = e.target.closest('[data-id]');
  const { id, color } = selectedItem.dataset;
  const quantity = Math.min(Math.max(+e.target.value, 1), 100);

  e.target.previousElementSibling.textContent = `Qté : ${quantity}`;

  editCartItemQuantity({ id, color, quantity });
  displayCartTotal();
};

// Create cart item element
const createCartItem = ({ _id, name, color, price, quantity, imageUrl, altTxt }) => `
  <article class="cart__item" data-id="${_id}" data-color="${color}">
    <div class="cart__item__img">
      <img src=${imageUrl} alt=${altTxt}>
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${name}</h2>
        <p>${color}</p>
        <p>${price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : ${quantity}</p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${quantity}>
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>
`;

// Show cart items on page
const displayCart = async () => {
  try {
    cart = await Promise.all(cart.map(async (item) => getCartItemData(item)));

    container.innerHTML = cart.map(createCartItem).join(' ');

    displayCartTotal();

    const deleteButtons = document.querySelectorAll('.deleteItem');
    deleteButtons.forEach((button) => button.addEventListener('click', handleDeleteButton));

    const quantityInputs = document.querySelectorAll('.itemQuantity');
    quantityInputs.forEach((input) => input.addEventListener('input', handleQuantityInput));
  } catch (error) {
    container.innerHTML = `<p class="alert">${error.message}</p>`;
  }
};

// Post an order to API
const postOrder = async (order) => {
  const response = await fetch('https://kanap-back.herokuapp.com/api/products/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!response.ok) throw Error(`${response.status} : ${response.statusText}`);
  return response.json();
};

// Get product IDs from cart and contact information from user input
const getOrderData = () => {
  const products = cart.map((i) => i._id);
  const contact = {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    address: addressInput.value.trim(),
    city: cityInput.value.trim(),
    email: emailInput.value.trim(),
  };
  return { products, contact };
};

// Send order then redirect to confirmation page
const sendOrder = async () => {
  try {
    const order = getOrderData();

    if (order.products.length < 1) throw Error('Attention, votre panier doit contenir au moins 1 article');

    const { orderId } = await postOrder(order);

    localStorage.removeItem('cart');
    window.location.replace(`confirmation.html?order=${orderId}`);
  } catch (error) {
    alert(error.message);
  }
};

// Validate form then send order
const handleOrderForm = (e) => {
  e.preventDefault();

  const inputs = Array.from(e.target.querySelectorAll('input:not([type=submit])'));
  const hasErrors = inputs.map((i) => Boolean(i.dataset.error)).includes(true);

  if (hasErrors) return;

  sendOrder();
};

// Input validation rules
const validation = {
  letters: {
    regex: /^[A-Za-zÀ-ÿ-' ]{3,}$/g,
    message: 'Minimum 3 caractères, lettres uniquement',
  },
  lettersDigits: {
    regex: /^[0-9A-Za-zÀ-ÿ-', ]{3,}$/g,
    message: 'Minimum 3 caractères, chiffres et lettres uniquement',
  },
  email: {
    regex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    message: 'Adresse email non valide',
  },
};

// Validate an input and show message if error
const validateInput = (e, rule) => {
  const input = e.target;
  const value = input.value.trim();
  const inputError = input.nextElementSibling;

  if (!value.match(rule.regex)) {
    input.dataset.error = true;
    inputError.textContent = rule.message;
    return;
  }

  delete input.dataset.error;
  inputError.textContent = '';
};

// Events
document.addEventListener('DOMContentLoaded', displayCart);
orderForm.addEventListener('submit', handleOrderForm);
firstNameInput.addEventListener('input', (e) => validateInput(e, validation.letters));
lastNameInput.addEventListener('input', (e) => validateInput(e, validation.letters));
addressInput.addEventListener('input', (e) => validateInput(e, validation.lettersDigits));
cityInput.addEventListener('input', (e) => validateInput(e, validation.letters));
emailInput.addEventListener('input', (e) => validateInput(e, validation.email));
