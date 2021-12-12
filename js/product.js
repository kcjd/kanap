// DOM elements
const productElem = document.querySelector('.item');
const imageElem = document.querySelector('.item__img');
const nameElem = document.querySelector('#title');
const priceElem = document.querySelector('#price');
const descriptionElem = document.querySelector('#description');
const colorSelectElem = document.querySelector('#colors');
const quantityInputElem = document.querySelector('#quantity');
const addButtonElem = document.querySelector('#addToCart');

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
const addCartItem = ({ id, color, quantity }) => {
  const index = cart.findIndex((i) => i._id === id && i.color === color);

  if (index !== -1) cart[index].quantity = quantity;
  else cart.push({ _id: id, color, quantity });

  localStorage.setItem('cart', JSON.stringify(cart));
};

// Get and validate user selection then add product to cart
const handleaddButton = () => {
  const color = colorSelectElem.value;
  const quantity = +quantityInputElem.value;

  if (!color) return alert('Attention, vous devez sélectionner une couleur');
  if (quantity < 1 || quantity > 100) return alert('Attention, vous devez sélectionner une quantité (1-100)');

  addCartItem({ id: productId, color, quantity });
  return alert('Le produit a été ajouté au panier');
};

// Events
addButtonElem.addEventListener('click', handleaddButton);
