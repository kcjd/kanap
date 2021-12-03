// DOM elements
const container = document.querySelector('#orderId');

// Get order ID from URL
const url = new URL(window.location.href);
const orderId = url.searchParams.get('order') || null;

// Show order ID on page
const showOrderId = () => {
  container.textContent = orderId;
};

// Events
document.addEventListener('DOMContentLoaded', showOrderId);
