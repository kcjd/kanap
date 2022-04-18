import fetchApi from './utils/fetchApi.js';

// DOM elements
const productElem = document.querySelector('.item');
const imageElem = document.querySelector('.item__img');
const nameElem = document.querySelector('#title');
const priceElem = document.querySelector('#price');
const descriptionElem = document.querySelector('#description');
const colorSelectElem = document.querySelector('#colors');
const quantityInputElem = document.querySelector('#quantity');
const addButtonElem = document.querySelector('#addToCart');

let product;

// Get product ID from URL
const url = new URL(window.location.href);
const productId = url.searchParams.get('id') || null;

// Display product details
const displayProductDetails = async () => {
  try {
    product = await fetchApi(`/products/${productId}`);

    document.title = product.name;
    imageElem.innerHTML = `<img src=${product.imageUrl} alt=${product.altTxt} />`;
    nameElem.textContent = product.name;
    priceElem.textContent = product.price;
    descriptionElem.textContent = product.description;

    const colorOptions = product.colors.map((color) => `<option value=${color}>${color}</option>`).join('');
    colorSelectElem.insertAdjacentHTML('beforeend', colorOptions);
  } catch (e) {
    document.title = e.message;
    productElem.innerHTML = `<p class="alert">${e.message}</p>`;
  }
};

displayProductDetails();

// Add a new item to cart or update an existing one
const addCartItem = ({ _id, name, price, imageUrl, altTxt, color, quantity }) => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const index = cart.findIndex((i) => i._id === _id && i.color === color);

  if (index !== -1) cart[index].quantity = quantity;
  else cart.push({ _id, name, price, imageUrl, altTxt, color, quantity });

  localStorage.setItem('cart', JSON.stringify(cart));
};

// Get and validate user selection then add product to cart
const handleAddButton = () => {
  const color = colorSelectElem.value;
  const quantity = +quantityInputElem.value;

  if (!color) return alert('Attention, vous devez sélectionner une couleur');
  if (quantity < 1 || quantity > 100) return alert('Attention, vous devez sélectionner une quantité (1-100)');

  addCartItem({ ...product, color, quantity });
  return alert('Le produit a été ajouté au panier');
};

// Events
addButtonElem.addEventListener('click', handleAddButton);
