document.addEventListener('DOMContentLoaded', async () => {
  // Себет санын жаңарту функциясы
  const updateCartCounter = async () => {
    const { getCartItems } = await import('./cart-utils.js');
    const cartItems = getCartItems();
    document.querySelectorAll('.cart-counter').forEach(el => {
      el.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    });
  };

  // Бастапқыда себет санын жаңарту
  await updateCartCounter();

  const container = document.getElementById('detail');
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    container.innerHTML = '<div class="alert alert-danger text-center">Өнім ID табылмады.</div>';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`);
    if (!response.ok) throw new Error(`Қате: ${response.status}`);
    
    const product = await response.json();
    renderProduct(product);
  } catch (error) {
    console.error(error);
    container.innerHTML = `
      <div class="alert alert-danger text-center">
        Өнім жүктелу кезінде қате орын алды: ${error.message}
      </div>
    `;
  }

  function renderProduct(p) {
    container.innerHTML = `
      <div class="row">
        <div class="col-md-6 mb-4">
          <img src="/images/${p.image_url}" alt="${p.name}" 
               class="img-fluid rounded shadow">
        </div>
        <div class="col-md-6">
          <h1 class="mb-3">${p.name}</h1>
          
          <div class="mb-4">
            <span class="price">${Number(p.price).toLocaleString()} ₸</span>
            ${p.old_price ? `<span class="old">${Number(p.old_price).toLocaleString()} ₸</span>` : ''}
          </div>
          
          <div class="mb-4 product-description">
            ${p.description || 'Өнім сипаттамасы жоқ'}
          </div>
          
          <div class="mb-4">
            <h5>Сипаттамалар:</h5>
            <ul class="list-group list-group-flush">
              ${p.size ? `<li class="list-group-item"><strong>Өлшемі:</strong> ${p.size}</li>` : ''}
              ${p.color ? `<li class="list-group-item"><strong>Түсі:</strong> ${p.color}</li>` : ''}
              ${p.material ? `<li class="list-group-item"><strong>Материалы:</strong> ${p.material}</li>` : ''}
            </ul>
          </div>
          
          <button class="btn btn-primary btn-lg add-to-cart"
                  data-id="${p.id}"
                  data-name="${p.name}"
                  data-price="${p.price}"
                  data-image="${p.image_url}">
            <i class="fas fa-cart-plus me-2"></i>Себетке қосу
          </button>
        </div>
      </div>
    `;

    // Себетке қосу батырмасына оқиға орнату
    const addBtn = container.querySelector('.add-to-cart');
    addBtn.addEventListener('click', async () => {
      const product = {
        id: p.id,
        name: p.name,
        price: p.price,
        image_url: p.image_url,
        quantity: 1
      };

      try {
        const { addToCart } = await import('./cart-utils.js');
        addToCart(product);
        await updateCartCounter();
        
        // Өзгертулер туралы хабарлау
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show mt-3';
        alertDiv.innerHTML = `
          <strong>${p.name}</strong> себетке қосылды!
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        container.insertBefore(alertDiv, container.firstChild);
      } catch (error) {
        console.error('Себетке қосу қатесі:', error);
        alert('Себетке қосу кезінде қате орын алды');
      }
    });
  }
});
const updateCartCounter = () => {
  const cartItems = getCartItems();
  document.querySelectorAll('.cart-counter').forEach(el => {
    el.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  });
};
