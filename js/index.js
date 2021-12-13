import fetchApi from './utils/fetchApi.js';

// DOM elements
const productsElem = document.querySelector('#items');

// Create product card element
const createProductCard = ({ _id, name, description, imageUrl, altTxt }) => `
  <a href="./product.html?id=${_id}">
    <article>
      <img src=${imageUrl} alt=${altTxt}>
      <h3 class="productName">${name}</h3>
      <p class="productDescription">${description}</p>
    </article>
  </a>
`;

// Display product cards
const displayProductCards = async () => {
  try {
    const products = await fetchApi('/products');
    const productThumbs = products.map(createProductCard).join('');
    productsElem.innerHTML = productThumbs;
  } catch (e) {
    productsElem.innerHTML = `<p class="alert">${e.message}</p>`;
  }
};

displayProductCards();
