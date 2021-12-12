// DOM elements
const orderIdElem = document.querySelector('#orderId');

// Get order ID from URL
const url = new URL(window.location.href);
const orderId = url.searchParams.get('order') || null;

// Redirect to home page if no order ID
const redirectIfNoOrderId = () => {
  if (!orderId) window.location.replace('/');
};

redirectIfNoOrderId();

// Display order ID on page
const displayOrderId = () => {
  orderIdElem.textContent = orderId;
};

displayOrderId();
