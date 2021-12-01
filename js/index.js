// DOM elements
const container = document.querySelector('#items');

// Get products data from API
const getProducts = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    return response.json();
  } catch {
    throw Error('Le serveur ne répond pas');
  }
};

// Create product thumb element
const createProductThumb = ({ _id, name, description, imageUrl, altTxt }) => `
  <a href="./product.html?id=${_id}">
    <article>
      <img src=${imageUrl} alt=${altTxt}>
      <h3 class="productName">${name}</h3>
      <p class="productDescription">${description}</p>
    </article>
  </a>
`;

// Display product list
const displayProductList = async () => {
  try {
    const products = await getProducts();
    const productThumbs = products.map(createProductThumb).join(' ');
    container.innerHTML = productThumbs;
  } catch (error) {
    console.error(error.message);
  }
};

// Events
document.addEventListener('DOMContentLoaded', displayProductList);
