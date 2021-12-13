import fetchApi from './utils/fetchApi.js';
import { schemas, validateInput } from './utils/validation.js';

// DOM elements
const cartElem = document.querySelector('#cart__items');
const totalQuantityElem = document.querySelector('#totalQuantity');
const totalPriceElem = document.querySelector('#totalPrice');
const orderFormElem = document.querySelector('.cart__order__form');
const firstNameInputElem = document.querySelector('#firstName');
const lastNameInputElem = document.querySelector('#lastName');
const addressInputElem = document.querySelector('#address');
const cityInputElem = document.querySelector('#city');
const emailInputElem = document.querySelector('#email');

// Get cart from local storage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Get cart item with product data
const getCartItemData = async ({ _id, color, quantity }) => {
  const product = await fetchApi(`/products/${_id}`);
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

  totalQuantityElem.textContent = `${quantity} ${quantity <= 1 ? 'article' : 'articles'}`;
  totalPriceElem.textContent = price;
};

// Get selected item then delete it from cart
const handleDeleteButton = (e) => {
  const selectedItemElem = e.target.closest('[data-id]');
  const { id, color } = selectedItemElem.dataset;

  selectedItemElem.remove();

  deleteCartItem({ id, color });
  displayCartTotal();
};

// Get selected item and new quantity then update it in cart
const handleQuantityInput = (e) => {
  const selectedItemElem = e.target.closest('[data-id]');
  const { id, color } = selectedItemElem.dataset;
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

// Display cart items
const displayCart = async () => {
  try {
    cart = await Promise.all(cart.map(async (item) => getCartItemData(item)));

    cartElem.innerHTML = cart.map(createCartItem).join('');

    displayCartTotal();

    const deleteButtonElems = document.querySelectorAll('.deleteItem');
    deleteButtonElems.forEach((elem) => elem.addEventListener('click', handleDeleteButton));

    const quantityInputElems = document.querySelectorAll('.itemQuantity');
    quantityInputElems.forEach((elem) => elem.addEventListener('input', handleQuantityInput));
  } catch (e) {
    cartElem.innerHTML = `<p class="alert">${e.message}</p>`;
  }
};

displayCart();

// Get product IDs from cart and contact information from user input
const getOrderData = () => {
  const products = cart.map((i) => i._id);
  const contact = {
    firstName: firstNameInputElem.value.trim(),
    lastName: lastNameInputElem.value.trim(),
    address: addressInputElem.value.trim(),
    city: cityInputElem.value.trim(),
    email: emailInputElem.value.trim(),
  };
  return { products, contact };
};

// Send order then redirect to confirmation page
const sendOrder = async () => {
  try {
    const order = getOrderData();

    if (order.products.length < 1) throw Error('Attention, votre panier doit contenir au moins 1 article');

    const { orderId } = await fetchApi('/products/order', { method: 'POST', body: order });

    localStorage.removeItem('cart');
    window.location.replace(`confirmation.html?order=${orderId}`);
  } catch (e) {
    alert(e.message);
  }
};

// Validate form then send order
const handleorderFormElem = (e) => {
  e.preventDefault();

  const inputElems = Array.from(e.target.querySelectorAll('input:not([type=submit])'));
  const hasErrors = inputElems.map((i) => i.valid).includes(false);

  if (hasErrors) return;

  sendOrder();
};

// Events
orderFormElem.addEventListener('submit', handleorderFormElem);
firstNameInputElem.addEventListener('input', (e) => validateInput(e, schemas.letters));
lastNameInputElem.addEventListener('input', (e) => validateInput(e, schemas.letters));
addressInputElem.addEventListener('input', (e) => validateInput(e, schemas.lettersDigits));
cityInputElem.addEventListener('input', (e) => validateInput(e, schemas.letters));
emailInputElem.addEventListener('input', (e) => validateInput(e, schemas.email));
