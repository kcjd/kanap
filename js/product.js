// DOM elements
const productImage = document.querySelector('.item__img');
const productName = document.querySelector('#title');
const productPrice = document.querySelector('#price');
const productDesc = document.querySelector('#description');
const colorsSelect = document.querySelector('#colors');
const quantityInput = document.querySelector('#quantity');
const addButton = document.querySelector('#addToCart');

// Get product ID from URL
const url = new URL(window.location.href);
const productId = url.searchParams.get('id');

// Get product data from API
const getProduct = async (id) => {
  const response = await fetch(`http://localhost:3000/api/products/${id}`);
  if (!response.ok) throw new Error(`${response.status} : ${response.statusText}`);
  return response.json();
};

// Show product details on page
const showProductDetails = async () => {
  try {
    const product = await getProduct(productId);

    document.title = product.name;
    productImage.innerHTML = `<img src=${product.imageUrl} alt=${product.altTxt} />`;
    productName.textContent = product.name;
    productPrice.textContent = product.price;
    productDesc.textContent = product.description;

    const colorOptions = product.colors.map((color) => `<option value=${color}>${color}</option>`).join(' ');
    colorsSelect.insertAdjacentHTML('beforeend', colorOptions);
  } catch (error) {
    console.error(error.message);
  }
};

// Add a new item to cart or update an existing one
const addCartItem = ({ id, color, quantity }) => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const index = cart.findIndex((i) => i.id === id && i.color === color);

  if (index !== -1) cart[index].quantity = quantity;
  else cart.push({ id, color, quantity });

  localStorage.setItem('cart', JSON.stringify(cart));
};

// Get and validate user selection then add product to cart
const handleAddButton = () => {
  const color = colorsSelect.value;
  const quantity = +quantityInput.value;

  if (!color || quantity < 1 || quantity > 100) return;

  addCartItem({ id: productId, color, quantity });
};

// Events
document.addEventListener('DOMContentLoaded', showProductDetails);
addButton.addEventListener('click', handleAddButton);
