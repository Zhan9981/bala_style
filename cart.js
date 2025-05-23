let currentLang = 'kk';

function setLanguage(lang) {
  currentLang = lang;

  // Тілді ауыстыру
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key] && translations[key][lang]) {
      el.textContent = translations[key][lang];
    }
  });

  // Актив батырмаларды жаңарту
  document.querySelectorAll('.language-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.toLowerCase().startsWith(lang.substring(0, 2)));
  });
}

function showToast(message) {
  const container = document.querySelector('.toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast align-items-center text-white bg-success border-0 show';
  toast.role = 'alert';
  toast.innerHTML = `<div class="d-flex">
    <div class="toast-body">${message}</div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
  </div>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCounter() {
  const cart = getCart();
  const counter = document.querySelector('.cart-counter');
  if (cart.length > 0) {
    counter.style.display = 'inline-block';
    counter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  } else {
    counter.style.display = 'none';
  }
}

function renderCart() {
  const itemsContainer = document.getElementById('cart-items');
  itemsContainer.innerHTML = '';
  const cart = getCart();

  if (cart.length === 0) {
    itemsContainer.innerHTML = `<p class="text-muted">${translations['empty_cart_message'][currentLang]}</p>`;
    updateTotals();
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'cart-item row align-items-center';

    div.innerHTML = `
      <div class="col-md-2">
        <img src="${item.image}" class="img-fluid rounded" alt="${item.name}">
      </div>
      <div class="col-md-4">
        <h5>${item.name}</h5>
        <p>${item.price} ₸</p>
      </div>
      <div class="col-md-3 d-flex align-items-center">
        <button class="btn btn-outline-secondary btn-sm me-2" onclick="changeQuantity(${index}, -1)">−</button>
        <input type="text" class="form-control qty-input" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)">
        <button class="btn btn-outline-secondary btn-sm ms-2" onclick="changeQuantity(${index}, 1)">+</button>
      </div>
      <div class="col-md-2 item-total">${item.price * item.quantity} ₸</div>
      <div class="col-md-1 text-end">
        <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    itemsContainer.appendChild(div);
  });

  updateTotals();
  updateCartCounter();
}

function updateTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 0 : 0;

  document.getElementById('subtotal').textContent = subtotal + ' ₸';
  document.getElementById('shipping').textContent = translations['free_shipping'][currentLang];
  document.getElementById('total').textContent = subtotal + shipping + ' ₸';
}

function changeQuantity(index, change) {
  const cart = getCart();
  cart[index].quantity += change;
  if (cart[index].quantity < 1) cart[index].quantity = 1;
  saveCart(cart);
  renderCart();
  showToast(change > 0 ? translations['quantity_increased'][currentLang] : translations['quantity_decreased'][currentLang]);
}

function updateQuantity(index, value) {
  const quantity = parseInt(value);
  if (!isNaN(quantity) && quantity > 0) {
    const cart = getCart();
    cart[index].quantity = quantity;
    saveCart(cart);
    renderCart();
    showToast(translations['quantity_updated'][currentLang]);
  }
}

function removeItem(index) {
  if (confirm(translations['confirm_remove'][currentLang])) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
    showToast(translations['item_removed'][currentLang]);
  }
}

document.getElementById('empty-cart').addEventListener('click', () => {
  if (confirm(translations['confirm_clear'][currentLang])) {
    localStorage.removeItem('cart');
    renderCart();
    updateCartCounter();
    showToast(translations['cart_cleared'][currentLang]);
  }
});

document.getElementById('checkout-btn').addEventListener('click', () => {
  const cart = getCart();
  if (cart.length === 0) {
    alert(translations['empty_cart_message'][currentLang]);
    return;
  }

  // Мұнда тапсырысты өңдеу логикасын қоса аласыз
  localStorage.removeItem('cart');
  renderCart();
  updateCartCounter();
  showToast(translations['order_accepted'][currentLang]);
});

window.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
  renderCart();
});
