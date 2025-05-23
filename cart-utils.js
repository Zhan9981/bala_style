// /js/cart-utils.js

export function getCartItems() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

export function addToCart(product) {
  const cart = getCartItems();
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += product.quantity;
  } else {
    cart.push(product);
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function getCartTotal() {
  const cart = getCartItems();
  return cart.reduce((total, item) => total + item.quantity, 0);
}