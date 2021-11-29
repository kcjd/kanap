// DOM elements
const container = document.querySelector('#cart__items');
const cartQuantity = document.querySelector('#totalQuantity');
const cartPrice = document.querySelector('#totalPrice');

// Get product data from API
const getProduct = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`);
    return response.json();
  } catch {
    throw Error('Le serveur ne répond pas');
  }
};

// Get product data about a cart item
const getCartItemData = async ({ id, color, quantity }) => {
  const product = await getProduct(id);
  return { ...product, color, quantity };
};

// Delete an item from cart
const deleteCartItem = ({ id, color }) => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const index = cart.findIndex((i) => i.id === id && i.color === color);
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Update an item in cart
const editCartItem = ({ id, color, quantity }) => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const index = cart.findIndex((i) => i.id === id && i.color === color);
  cart[index].quantity = quantity;
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Show cart total on page
const showCartTotal = async () => {
  try {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = await Promise.all(cart.map(async (i) => getCartItemData(i)));

    const totalQuantity = cartItems.reduce((total, i) => total + i.quantity, 0);
    cartQuantity.textContent = `${totalQuantity} ${totalQuantity <= 1 ? 'article' : 'articles'}`;

    const totalPrice = cartItems.reduce((total, i) => total + i.price * i.quantity, 0);
    cartPrice.textContent = totalPrice;
  } catch (error) {
    console.error(error.message);
  }
};

// Get selected item then delete it from cart
const handleDeleteButton = (e) => {
  const selectedItem = e.target.closest('[data-id]');
  const { id, color } = selectedItem.dataset;

  selectedItem.remove();
  deleteCartItem({ id, color });

  showCartTotal();
};

// Get selected item and new quantity then update it in cart
const handleQuantityInput = (e) => {
  const selectedItem = e.target.closest('[data-id]');
  const { id, color } = selectedItem.dataset;
  const quantity = +e.target.value;
  const itemQuantity = e.target.previousElementSibling;

  itemQuantity.textContent = `Qté : ${quantity}`;
  editCartItem({ id, color, quantity });

  showCartTotal();
};

// Render cart item HTML
const renderCartItem = ({ _id, name, color, price, quantity, imageUrl, altTxt }) => `
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
const showCartItems = async () => {
  try {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = await Promise.all(cart.map(async (item) => getCartItemData(item)));

    container.innerHTML = cartItems.map(renderCartItem).join(' ');

    const deleteButtons = document.querySelectorAll('.deleteItem');
    deleteButtons.forEach((button) => button.addEventListener('click', handleDeleteButton));

    const quantityInputs = document.querySelectorAll('.itemQuantity');
    quantityInputs.forEach((input) => input.addEventListener('input', handleQuantityInput));
  } catch (error) {
    console.error(error.message);
  }
};

document.addEventListener('DOMContentLoaded', showCartItems);
document.addEventListener('DOMContentLoaded', showCartTotal);
