// DOM elements
const container = document.querySelector('#items');

// Get products data from API
const getProducts = async () => {
  const response = await fetch('https://kanap-back.herokuapp.com/api/products');
  if (!response.ok) throw Error(`${response.status} : ${response.statusText}`);
  return response.json();
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
    container.innerHTML = `<p class="alert">${error.message}</p>`;
  }
};

// Events
document.addEventListener('DOMContentLoaded', displayProductList);
