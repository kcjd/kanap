// DOM elements
const container = document.querySelector('#items');

// Get products data from API
const getProducts = async () => {
  const response = await fetch('http://localhost:3000/api/products');
  if (!response.ok) throw new Error(`${response.status} : ${response.statusText}`);
  return response.json();
};

// Render product cart HTML
const renderProductCard = ({ _id, name, description, imageUrl, altTxt }) => `
  <a href="./product.html?id=${_id}">
    <article>
      <img src=${imageUrl} alt=${altTxt}>
      <h3 class="productName">${name}</h3>
      <p class="productDescription">${description}</p>
    </article>
  </a>
`;

// Show products on page
const showProducts = async () => {
  try {
    const products = await getProducts();
    const productCards = products.map(renderProductCard).join(' ');
    container.innerHTML = productCards;
  } catch (error) {
    console.error(error.message);
  }
};

// Events
document.addEventListener('DOMContentLoaded', showProducts);
