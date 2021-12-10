// DOM elements
const container = document.querySelector('.item');
const productImage = document.querySelector('.item__img');
const productName = document.querySelector('#title');
const productPrice = document.querySelector('#price');
const productDesc = document.querySelector('#description');
const colorSelect = document.querySelector('#colors');
const quantityInput = document.querySelector('#quantity');
const addButton = document.querySelector('#addToCart');

// Get product ID from URL
const url = new URL(window.location.href);
const productId = url.searchParams.get('id') || null;

// Get cart from local storage
const cart = JSON.parse(localStorage.getItem('cart')) || [];

// Get product data from API
const getProduct = async (id) => {
  try {
    const response = await fetch(`https://kanap-back.herokuapp.com/api/products/${id}`);
    if (!response.ok) throw response;
    return response.json();
  } catch (e) {
    throw Error(e.status ? `${e.status} ${e.statusText}` : 'Le serveur ne répond pas');
  }
};

// Display product details
const displayProductDetails = async () => {
  try {
    const product = await getProduct(productId);

    document.title = product.name;
    productImage.innerHTML = `<img src=${product.imageUrl} alt=${product.altTxt} />`;
    productName.textContent = product.name;
    productPrice.textContent = product.price;
    productDesc.textContent = product.description;

    const colorOptions = product.colors.map((color) => `<option value=${color}>${color}</option>`).join(' ');
    colorSelect.insertAdjacentHTML('beforeend', colorOptions);
  } catch (e) {
    document.title = e.message;
    container.innerHTML = `<p class="alert">${e.message}</p>`;
  }
};

// Add a new item to cart or update an existing one
const addCartItem = ({ id, color, quantity }) => {
  const index = cart.findIndex((i) => i._id === id && i.color === color);

  if (index !== -1) cart[index].quantity = quantity;
  else cart.push({ _id: id, color, quantity });

  localStorage.setItem('cart', JSON.stringify(cart));
};

// Get and validate user selection then add product to cart
const handleAddButton = () => {
  const color = colorSelect.value;
  const quantity = +quantityInput.value;

  if (!color) {
    alert('Attention, vous devez sélectionner une couleur');
    return;
  }

  if (quantity < 1 || quantity > 100) {
    alert('Attention, vous devez sélectionner une quantité valide (1-100)');
    return;
  }

  addCartItem({ id: productId, color, quantity });
  alert('Le produit a été ajouté au panier');
};

// Events
document.addEventListener('DOMContentLoaded', displayProductDetails);
addButton.addEventListener('click', handleAddButton);
