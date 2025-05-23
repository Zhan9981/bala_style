document.addEventListener('DOMContentLoaded', function() {
    // Загрузка популярных товаров
    loadFeaturedProducts();
    
    // Загрузка новых поступлений
    loadNewArrivals();
    
    // Загрузка категорий для меню
    loadCategories();
    
    // Инициализация корзины
    initializeCart();
    
    // Обработчик формы подписки
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            showAlert('Рақмет сіз жазылдыңыз! Жаңалықтарды біздің хаттардан аласыз.', 'success');
            this.reset();
        });
    }
    
    // Обработчик кликов по Instagram постам
    document.querySelectorAll('.instagram-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.open(this.getAttribute('href'), '_blank');
        });
    });
});

// Загрузка категорий
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();
        
        const categoriesContainer = document.getElementById('categories-menu');
        if (categoriesContainer) {
            categories.forEach(category => {
                const li = document.createElement('li');
                li.innerHTML = `<a class="dropdown-item" href="products.html?category=${encodeURIComponent(category)}">${category}</a>`;
                categoriesContainer.appendChild(li);
            });
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Загрузка популярных товаров
async function loadFeaturedProducts() {
    const container = document.getElementById('featured-products-container');
    if (!container) return;
    
    try {
        const response = await fetch('/api/products/sale');
        let products = await response.json();
        
        // Ограничиваем количество товаров до 4
        products = products.slice(0, 4);
        
        let html = '';
        if (products.length === 0) {
            html = '<div class="col-12 text-center"><p>Жеңілдіктегі тауарлар табылмады</p></div>';
        } else {
            products.forEach(product => {
                html += `
                <div class="col-md-3 mb-4">
                    <div class="product-card">
                        ${product.is_sale ? '<div class="sale-badge">Жеңілдік</div>' : ''}
                        ${product.is_free_shipping ? '<div class="free-shipping-badge">Тегін жеткізу</div>' : ''}
                        <img src="images/products/${product.image_url}" alt="${product.name}" class="product-img img-fluid">
                        <div class="product-info">
                            <h3 class="product-title">${product.name}</h3>
                            <div class="price-container">
                                ${product.old_price ? `<span class="old-price">${product.old_price} ₸</span>` : ''}
                                <span class="product-price">${product.price} ₸</span>
                            </div>
                            <button class="btn btn-primary add-to-cart" data-id="${product.id}">Себетке қосу</button>
                        </div>
                    </div>
                </div>
                `;
            });
        }
        
        container.innerHTML = html;
        
        // Добавление обработчиков событий для кнопок "Добавить в корзину"
        addCartEventListeners();
    } catch (error) {
        console.error('Error loading featured products:', error);
        container.innerHTML = '<div class="col-12 text-center"><p>Өкінішке орай, тауарларды жүктеу кезінде қате пайда болды.</p></div>';
    }
}

// Загрузка новых поступлений
async function loadNewArrivals() {
    const container = document.getElementById('new-arrivals-container');
    if (!container) return;
    
    try {
        const response = await fetch('/api/products?sort=newest&limit=4');
        const products = await response.json();
        
        let html = '';
        if (products.length === 0) {
            html = '<div class="col-12 text-center"><p>Жаңа тауарлар табылмады</p></div>';
        } else {
            products.forEach(product => {
                html += `
                <div class="col-md-3 mb-4">
                    <div class="product-card">
                        ${product.is_sale ? '<div class="sale-badge">Жаңа</div>' : ''}
                        ${product.is_free_shipping ? '<div class="free-shipping-badge">Тегін жеткізу</div>' : ''}
                        <img src="images/products/${product.image_url}" alt="${product.name}" class="product-img img-fluid">
                        <div class="product-info">
                            <h3 class="product-title">${product.name}</h3>
                            <div class="price-container">
                                ${product.old_price ? `<span class="old-price">${product.old_price} ₸</span>` : ''}
                                <span class="product-price">${product.price} ₸</span>
                            </div>
                            <button class="btn btn-primary add-to-cart" data-id="${product.id}">Себетке қосу</button>
                        </div>
                    </div>
                </div>
                `;
            });
        }
        
        container.innerHTML = html;
        
        // Добавление обработчиков событий для кнопок "Добавить в корзину"
        addCartEventListeners();
    } catch (error) {
        console.error('Error loading new arrivals:', error);
        container.innerHTML = '<div class="col-12 text-center"><p>Өкінішке орай, тауарларды жүктеу кезінде қате пайда болды.</p></div>';
    }
}

// Добавление обработчиков событий для кнопок корзины
function addCartEventListeners() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            addToCart(productId);
        });
    });
}

// Инициализация корзины
function initializeCart() {
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    updateCartCounter();
}

// Добавление товара в корзину
async function addToCart(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`);
        const product = await response.json();
        
        const cart = JSON.parse(localStorage.getItem('cart'));
        const existingItem = cart.find(item => item.id == product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
        showCartNotification(product.name);
    } catch (error) {
        console.error('Error adding to cart:', error);
        showAlert('Тауарды себетке қосу кезінде қате пайда болды.', 'error');
    }
}

// Обновление счетчика корзины
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const counter = document.querySelector('.cart-counter');
    
    if (counter) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}

// Показ уведомления о добавлении в корзину
function showCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span>${productName}</span>
            <span>Себетке қосылды!</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Показ общего уведомления
function showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} fixed-alert`;
    alert.textContent = message;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(alert);
        }, 300);
    }, 3000);
}