document.addEventListener('DOMContentLoaded', () => {
    // --- ESTADO DE LA APLICACIÓN ---
    let currentUser = null;
    let users = [];
    let products = [];
    let stores = [];
    let currentSection = 'inicio';
    let currentStoreId = null; 
    let deliveryMethod = 'retiro'; // 'retiro' o 'domicilio'
    let deliveryAddress = '';

    // --- SELECTORES CACHEADOS ---
    const logoLink = document.getElementById('logo-link');
    const backButton = document.getElementById('back-button');
    const searchInputSection = document.getElementById('buscar-productos');

    // =================================================================================
    // INICIALIZACIÓN
    // =================================================================================
    function initialize() {
        loadMasterData();
        checkActiveSession();
        setupEventListeners();
        navigateTo('inicio');
    }

    // =================================================================================
    // GESTIÓN DE DATOS (LocalStorage)
    // =================================================================================
    function loadMasterData() {
        products = window.productosData || [];
        stores = window.tiendasData || [];
        const storedUsers = JSON.parse(localStorage.getItem('artesanica_users')) || [];
        users = [...(window.usersData || [])];
        storedUsers.forEach(storedUser => {
            const index = users.findIndex(u => u.id === storedUser.id);
            if (index !== -1) {
                users[index] = storedUser;
            } else {
                users.push(storedUser);
            }
        });
    }

    function saveUsersToStorage() {
        localStorage.setItem('artesanica_users', JSON.stringify(users));
        if (currentUser) {
            const updatedUser = users.find(u => u.id === currentUser.id);
            if (updatedUser) {
                currentUser = updatedUser;
                localStorage.setItem('artesanica_session', JSON.stringify(currentUser));
            }
        }
    }

    function checkActiveSession() {
        const sessionUser = JSON.parse(localStorage.getItem('artesanica_session'));
        if (sessionUser) {
            const foundUser = users.find(u => u.id === sessionUser.id);
            currentUser = foundUser ? foundUser : null;
        }
    }

    // =================================================================================
    // LÓGICA DE AUTENTICACIÓN
    // =================================================================================
    function register(name, email, password) {
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            showNotification('Ya existe una cuenta con este correo', 'error');
            return;
        }
        const newUser = { id: `user_${Date.now()}`, nombre: name, email, password, fechaRegistro: new Date().toISOString(), favoritos: [], carrito: [], historialCompras: [] };
        users.push(newUser);
        saveUsersToStorage();
        showNotification('¡Registro exitoso! Iniciando sesión...', 'exito');
        login(email, password);
    }

    function login(email, password) {
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (user) {
            currentUser = user;
            localStorage.setItem('artesanica_session', JSON.stringify(currentUser));
            hideAuthModal();
            showNotification(`¡Bienvenido de nuevo, ${currentUser.nombre}!`, 'exito');
            navigateTo('inicio');
            return true;
        }
        showNotification('Correo o contraseña incorrectos', 'error');
        return false;
    }

    function logout() {
        showNotification(`Hasta pronto, ${currentUser.nombre}`, 'info');
        currentUser = null;
        localStorage.removeItem('artesanica_session');
        navigateTo('inicio');
    }

    function ensureAuth() {
        if (currentUser) return true;
        showNotification('Por favor, inicia sesión para continuar', 'info');
        showAuthModal('login');
        return false;
    }

    // =================================================================================
    // LÓGICA DE NEGOCIO
    // =================================================================================
     function setDeliveryMethod(method) {
        deliveryMethod = method;
        updateUI();
    }

    function setDeliveryAddress(address) {
        deliveryAddress = address;
    }
    
    function performSearch(query) {
        const lowerCaseQuery = query.trim().toLowerCase();
        if (lowerCaseQuery) {
            const results = products.filter(p =>
                p.nombre.toLowerCase().includes(lowerCaseQuery) ||
                p.descripcion.toLowerCase().includes(lowerCaseQuery) ||
                p.tienda.nombre.toLowerCase().includes(lowerCaseQuery)
            );
            renderProducts(results, 'resultados-busqueda');
        } else {
            renderProducts([], 'resultados-busqueda');
        }
    }

    function toggleFavorite(productId) {
        if (!ensureAuth()) return;
        const index = currentUser.favoritos.indexOf(productId);
        if (index === -1) {
            currentUser.favoritos.push(productId);
            showNotification('Añadido a favoritos');
        } else {
            currentUser.favoritos.splice(index, 1);
            showNotification('Eliminado de favoritos');
        }
        saveUsersToStorage();
        updateUI();
    }

    function addToCart(productId) {
        if (!ensureAuth()) return;
        const product = products.find(p => p.id === productId);
        if (!product) return;
        const existingItem = currentUser.carrito.find(item => item.id === productId);
        if (existingItem) {
            existingItem.cantidad++;
        } else {
            currentUser.carrito.push({ id: productId, cantidad: 1 });
        }
        saveUsersToStorage();
        showNotification(`'${product.nombre}' fue añadido al carrito.`, 'exito');
        updateUI();
    }
    
    function updateCartQuantity(productId, newQuantity) {
        if (!ensureAuth()) return;
        const item = currentUser.carrito.find(i => i.id === productId);
        if (item) {
            if (newQuantity > 0) {
                item.cantidad = newQuantity;
            } else {
                currentUser.carrito = currentUser.carrito.filter(i => i.id !== productId);
            }
            saveUsersToStorage();
            updateUI();
        }
    }

    function processPayment() {
        if (!ensureAuth() || currentUser.carrito.length === 0) return;
         if (deliveryMethod === 'domicilio' && !deliveryAddress.trim()) {
            showNotification('Por favor, introduce una dirección de envío.', 'error');
            return;
        }
        const subtotal = currentUser.carrito.reduce((sum, item) => {
            const product = products.find(p => p.id === item.id);
            return sum + (product ? product.precio * item.cantidad : 0);
        }, 0);
        const envio = deliveryMethod === 'domicilio' ? 150 : 0;
        const newOrder = { id: `order_${Date.now()}`, fecha: new Date().toISOString(), items: [...currentUser.carrito], total: subtotal + envio, estado: 'Completado', deliveryMethod, deliveryAddress };
        currentUser.historialCompras.unshift(newOrder);
        currentUser.carrito = [];
        saveUsersToStorage();
        showNotification('¡Gracias por tu compra!', 'exito');
        navigateTo('perfil');
    }

    // =================================================================================
    // NAVEGACIÓN Y RENDERIZADO
    // =================================================================================
    function navigateTo(sectionId) {
        const protectedSections = ['favoritos', 'carrito', 'perfil'];
        if (protectedSections.includes(sectionId) && !ensureAuth()) return;

        currentSection = sectionId;
        document.querySelectorAll('.seccion-principal').forEach(s => s.classList.add('hidden'));
        const sectionToShow = document.getElementById(`seccion-${sectionId}`);
        if (sectionToShow) {
            sectionToShow.classList.remove('hidden');
        }
        
        const isHomePage = sectionId === 'inicio';
        logoLink?.classList.toggle('hidden', !isHomePage);
        backButton?.classList.toggle('hidden', isHomePage);

        window.scrollTo(0, 0);
        updateUI();
    }
    
    function navigateToStore(storeId) {
        currentStoreId = storeId;
        navigateTo('tienda');
    }

    function updateUI() {
        switch(currentSection) {
            case 'inicio':
                renderCategoriesAndFilters();
                renderProducts(products, 'productos-container');
                renderStores(stores);
                break;
            case 'buscar':
                performSearch(searchInputSection.value || '');
                break;
            case 'perfil':
                renderProfileSection();
                break;
            case 'favoritos':
                renderFavoritesSection();
                break;
            case 'carrito':
                renderCartSection();
                break;
            case 'tienda':
                renderStorePage(currentStoreId);
                break;
        }
        updateAuthUI();
        updateActiveNav(currentSection);
    }

    function renderProducts(productsToDisplay, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const productsHtml = (productsToDisplay || []).map(product => {
            const isFavorite = currentUser?.favoritos.includes(product.id);
            return `
            <div class="card product-card">
                <div class="card-image">
                    <img src="${product.imagen}" alt="${product.nombre}">
                    <button class="favorite-btn" onclick="app.toggleFavorite('${product.id}')">
                        <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
                <div class="card-content">
                    <h3>${product.nombre}</h3>
                    <p class="store-name">${product.tienda.nombre}</p>
                    <div class="card-footer">
                        <span class="price">C$${product.precio.toFixed(2)}</span>
                        <button class="btn btn-primary btn-sm" onclick="app.addToCart('${product.id}')">Agregar</button>
                    </div>
                </div>
            </div>`;
        }).join('');

        let emptyMessage = '<p>No hay productos para mostrar.</p>';
        if (containerId === 'resultados-busqueda') {
            emptyMessage = '<p style="text-align:center; grid-column: 1 / -1;">Busca productos o artesanos.</p>';
            if (searchInputSection.value) {
                 emptyMessage = '<p style="text-align:center; grid-column: 1 / -1;">No se encontraron productos.</p>';
            }
        }

        container.innerHTML = productsHtml || emptyMessage;
    }

    function renderStores(storesToDisplay) {
        const container = document.getElementById('tiendas-container');
        if (!container) return;
        container.innerHTML = (storesToDisplay || []).map(store => `
        <div class="card" onclick="app.navigateToStore('${store.id}')" style="cursor: pointer;">
            <img src="${store.imagen}" alt="${store.nombre}" style="height: 10rem; object-fit: cover;">
            <div style="padding: 1rem;">
                <h3 style="font-weight: 600;">${store.nombre}</h3>
                 <p style="color: var(--color-primary); font-weight: 500; margin-top: 0.5rem;">Ver Tienda</p>
            </div>
        </div>`).join('');
    }

    function renderStorePage(storeId) {
        const store = stores.find(s => s.id === storeId);
        if (!store) {
            navigateTo('inicio');
            showNotification('Tienda no encontrada', 'error');
            return;
        }

        // Renderizar encabezado de la tienda
        const headerContainer = document.getElementById('tienda-detalle-header');
        if (headerContainer) {
            headerContainer.innerHTML = `
            <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
                <img src="${store.foto_perfil}" alt="${store.nombre}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 50%;">
                <div style="flex: 1;">
                    <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">${store.nombre}</h2>
                    <p style="margin-bottom: 1rem;">${store.descripcion}</p>
                    <p><i class="fas fa-map-marker-alt fa-fw"></i> ${store.direccion}, ${store.ubicacion}</p>
                    <p><i class="fas fa-phone fa-fw"></i> ${store.contacto}</p>
                    <p><i class="fas fa-clock fa-fw"></i> ${store.horarios}</p>
                </div>
            </div>`;
        }

        const storeProducts = products.filter(p => p.tienda.id === storeId);
        const categories = ['Todas', ...new Set(storeProducts.map(p => p.categoria))];
        
        // Renderizar filtros
        const filtersContainer = document.getElementById('tienda-filtros-container');
        if (filtersContainer) {
            filtersContainer.innerHTML = categories.map((cat, index) => `
                <button class="btn ${index === 0 ? 'btn-primary' : 'btn-secondary'} btn-sm filter-btn" data-category="${cat}">${cat}</button>
            `).join('');
        }

        // Renderizar productos de la tienda
        renderProducts(storeProducts, 'tienda-productos-grid');
        
        // Añadir event listeners a los filtros
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                // Actualizar estilo de botones de filtro
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.replace('btn-primary', 'btn-secondary'));
                e.target.classList.replace('btn-secondary', 'btn-primary');

                const filteredProducts = category === 'Todas' 
                    ? storeProducts 
                    : storeProducts.filter(p => p.categoria === category);
                renderProducts(filteredProducts, 'tienda-productos-grid');
            });
        });
    }

    function renderProfileSection() {
        const container = document.getElementById('perfil-contenido');
        if (!container || !currentUser) return;
        const ordersHtml = currentUser.historialCompras.length > 0 
            ? currentUser.historialCompras.map(order => `
                <div class="card" style="padding: 1rem; margin-bottom: 1rem;">
                    <div style="display:flex; justify-content: space-between; font-weight: bold;">
                        <span>Pedido #${order.id.slice(-6)}</span>
                        <span>C$${order.total.toFixed(2)}</span>
                    </div>
                    <p style="font-size: 0.8rem; color: var(--color-texto-secundario);">${new Date(order.fecha).toLocaleDateString()}</p>
                    <p style="font-size: 0.9rem; margin-top: 0.5rem;">Estado: ${order.estado}</p>
                </div>`).join('') 
            : '<p>No tienes compras anteriores.</p>';

        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr; gap: 2rem;">
                <div class="card" style="padding: 1.5rem; text-align: center;">
                    <i class="fas fa-user-circle" style="font-size: 4rem; color: var(--color-primary);"></i>
                    <h2 style="font-size: 1.5rem; font-weight: 600; margin-top: 1rem;">${currentUser.nombre}</h2>
                    <p>${currentUser.email}</p>
                    <p style="font-size: 0.8rem; color: var(--color-texto-secundario); margin-top: 0.5rem;">Miembro desde: ${new Date(currentUser.fechaRegistro).toLocaleDateString()}</p>
                    <button class="btn btn-secondary" style="margin-top: 1.5rem;" onclick="app.logout()">Cerrar sesión</button>
                </div>
                <div>
                    <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">Historial de Compras</h3>
                    <div id="order-history-container">${ordersHtml}</div>
                </div>
            </div>`;
    }

    function renderFavoritesSection() {
        const container = document.getElementById('lista-favoritos');
        if (!container || !currentUser) return;
        const favoriteProducts = currentUser.favoritos.map(id => products.find(p => p.id === id)).filter(Boolean);
        if (favoriteProducts.length > 0) {
            renderProducts(favoriteProducts, 'lista-favoritos');
        } else {
            container.innerHTML = '<p class="text-center" style="grid-column: 1 / -1;">Tu lista de favoritos está vacía.</p>';
        }
    }

function renderCartSection() {
    const itemsContainer = document.getElementById('contenido-carrito');
    const summaryContainer = document.getElementById('resumen-carrito');
    if (!itemsContainer || !summaryContainer || !currentUser) return;

    if (currentUser.carrito.length === 0) {
        itemsContainer.innerHTML = '<div class="card" style="padding: 2rem; text-align: center;">Tu carrito está vacío.</div>';
        summaryContainer.classList.add('hidden');
        return;
    }

    summaryContainer.classList.remove('hidden');
    let subtotal = 0;
    const itemsHtml = currentUser.carrito.map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return '';
        subtotal += product.precio * item.cantidad;
        return `
        <div class="card" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; margin-bottom: 1rem;">
            <img src="${product.imagen}" alt="${product.nombre}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 0.25rem;">
            <div style="flex: 1;">
                <h3 style="font-weight: 600;">${product.nombre}</h3>
                <p class="price">C$${product.precio.toFixed(2)}</p>
            </div>
            <div style="text-align: right;">
                 <input type="number" min="1" value="${item.cantidad}" onchange="app.updateCartQuantity('${item.id}', this.valueAsNumber)" class="form-input" style="width: 70px; text-align: center; margin-bottom: 0.5rem;">
                 <button onclick="app.updateCartQuantity('${item.id}', 0)" class="btn-icon" title="Eliminar"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    }).join('');
    itemsContainer.innerHTML = itemsHtml;

    const envio = deliveryMethod === 'domicilio' ? 150.00 : 0;
    const addressInputHTML = `
        <div id="direccion-container" class="form-group" style="margin-top: 1rem; ${deliveryMethod !== 'domicilio' ? 'display: none;' : ''}">
            <label for="direccion-envio" class="form-label">Dirección de Envío</label>
            <input type="text" id="direccion-envio" class="form-input" value="${deliveryAddress}" oninput="app.setDeliveryAddress(this.value)" placeholder="Escribe tu dirección completa">
        </div>`;

    summaryContainer.innerHTML = `
        <div style="padding: 1.5rem;">
            <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Resumen del Pedido</h3>
            
            <!-- Opciones de Entrega -->
            <div class="form-group">
                <label class="form-label">Método de Entrega</label>
                <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="radio" name="deliveryMethod" value="retiro" onchange="app.setDeliveryMethod('retiro')" ${deliveryMethod === 'retiro' ? 'checked' : ''}>
                        <span style="margin-left: 0.5rem;">Retiro en Local</span>
                    </label>
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="radio" name="deliveryMethod" value="domicilio" onchange="app.setDeliveryMethod('domicilio')" ${deliveryMethod === 'domicilio' ? 'checked' : ''}>
                        <span style="margin-left: 0.5rem;">A Domicilio</span>
                    </label>
                </div>
            </div>
            ${addressInputHTML}

            <!-- Resumen de Costos -->
            <div style="margin-top: 1.5rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span>Subtotal:</span><span>C$${subtotal.toFixed(2)}</span></div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; border-bottom: 1px solid var(--color-borde); padding-bottom: 1rem;"><span>Envío:</span><span id="costo-envio">C$${envio.toFixed(2)}</span></div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.25rem;"><span>Total:</span><span id="total-pedido">C$${(subtotal + envio).toFixed(2)}</span></div>
            </div>
            <button class="btn btn-primary" style="width: 100%; margin-top: 1.5rem;" onclick="app.processPayment()">Proceder al Pago</button>
        </div>`;
}


    // =================================================================================
    // MANEJADORES DE EVENTOS
    // =================================================================================
    function setupEventListeners() {
        const navMapping = {
            'nav-inicio': 'inicio', 'nav-buscar': 'buscar', 'nav-favoritos': 'favoritos', 'nav-carrito': 'carrito', 'desktop-buscar': 'buscar', 'desktop-favoritos': 'favoritos', 'desktop-carrito': 'carrito'
        };
        Object.keys(navMapping).forEach(id => {
            document.getElementById(id)?.addEventListener('click', e => { e.preventDefault(); navigateTo(navMapping[id]); });
        });

        ['nav-perfil', 'desktop-perfil'].forEach(id => {
            document.getElementById(id)?.addEventListener('click', e => {
                e.preventDefault();
                if (currentUser) {
                    navigateTo('perfil');
                } else {
                    showAuthModal('login');
                }
            });
        });

        logoLink?.addEventListener('click', (e) => { e.preventDefault(); navigateTo('inicio'); });
        backButton?.addEventListener('click', (e) => { e.preventDefault(); navigateTo('inicio'); });
        searchInputSection?.addEventListener('input', (e) => performSearch(e.target.value));
        
        document.getElementById('login-form')?.addEventListener('submit', e => { e.preventDefault(); login(e.target.elements[0].value, e.target.elements[1].value); });
        document.getElementById('register-form')?.addEventListener('submit', e => { e.preventDefault(); register(e.target.elements[0].value, e.target.elements[1].value, e.target.elements[2].value); });
        document.getElementById('close-auth-modal')?.addEventListener('click', hideAuthModal);
        document.getElementById('auth-modal')?.addEventListener('click', e => { if (e.target.id === 'auth-modal') hideAuthModal(); });
        document.getElementById('login-tab')?.addEventListener('click', () => showAuthModal('login'));
        document.getElementById('register-tab')?.addEventListener('click', () => showAuthModal('register'));
    }

    // =================================================================================
    // UI HELPERS
    // =================================================================================
    function showAuthModal(tab = 'login') {
        const modal = document.getElementById('auth-modal');
        if (!modal) return;
        modal.classList.add('show');
        document.getElementById('login-tab').classList.toggle('active', tab === 'login');
        document.getElementById('register-tab').classList.toggle('active', tab !== 'login');
        document.getElementById('login-content').classList.toggle('hidden', tab !== 'login');
        document.getElementById('register-content').classList.toggle('hidden', tab === 'login');
    }

    function hideAuthModal() { 
        document.getElementById('auth-modal')?.classList.remove('show');
        document.getElementById('login-form')?.reset();
        document.getElementById('register-form')?.reset();
    }

    function updateAuthUI() {
        const favCount = currentUser?.favoritos.length || 0;
        const cartCount = currentUser?.carrito.reduce((sum, item) => sum + item.cantidad, 0) || 0;

        document.querySelectorAll('#contador-favoritos, #contador-favoritos-desk').forEach(el => {
            el.textContent = favCount;
            el.classList.toggle('hidden', favCount === 0);
        });
        document.querySelectorAll('#contador-carrito, #contador-carrito-desk').forEach(el => {
            el.textContent = cartCount;
            el.classList.toggle('hidden', cartCount === 0);
        });
    }

    function updateActiveNav(activeSection) {
        document.querySelectorAll('.bottom-nav .nav-item a').forEach(a => a.classList.remove('active'));
        const activeEl = document.getElementById(`nav-${activeSection}`);
        if (activeEl) activeEl.classList.add('active');
    }

    function showNotification(message, type = 'info') {
        const notif = document.createElement('div');
        notif.className = `notification ${type}`;
        notif.textContent = message;
        document.body.appendChild(notif);
        setTimeout(() => { notif.classList.add('show'); }, 10);
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 500);
        }, 3000);
    }

    function renderCategoriesAndFilters() {
        const container = document.getElementById('categorias-container');
        if (!container) return;

        const categories = window.categoriasData || [];
        container.innerHTML = categories.map(cat => `
            <a href="#" class="card category-card" data-categoria="${cat.id}">
                <i class="${cat.icono} category-icon"></i>
                <span class="category-name">${cat.nombre}</span>
            </a>
        `).join('') + `
            <a href="#" class="card category-card active" data-categoria="todas">
                <i class="fas fa-border-all category-icon"></i>
                <span class="category-name">Todas</span>
            </a>
        `;

        container.addEventListener('click', e => {
            e.preventDefault();
            const targetCard = e.target.closest('.category-card');
            if (!targetCard) return;

            container.querySelectorAll('.category-card').forEach(card => card.classList.remove('active'));
            targetCard.classList.add('active');

            const categoryId = targetCard.dataset.categoria;
            const filteredProducts = categoryId === 'todas'
                ? products
                : products.filter(p => p.categoria === categoryId);
            
            renderProducts(filteredProducts, 'productos-container');
        });
    }

    window.app = { toggleFavorite, addToCart, updateCartQuantity, logout, processPayment, navigateTo, navigateToStore, login, register, setDeliveryMethod, setDeliveryAddress };

    initialize();
});
