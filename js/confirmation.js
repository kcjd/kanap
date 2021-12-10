// DOM elements
const container = document.querySelector('#orderId');

// Get order ID from URL
const url = new URL(window.location.href);
const orderId = url.searchParams.get('order') || null;

// Show order ID on page
const showOrderId = () => {
  container.textContent = orderId;
};

// Redirect to home page if no order ID
const redirectIfNoOrderId = () => {
  if (!orderId) window.location.replace('/');
};

// Events
document.addEventListener('DOMContentLoaded', () => {
  showOrderId();
  redirectIfNoOrderId();
});
