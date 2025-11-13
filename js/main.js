document.addEventListener('DOMContentLoaded', () => {
    // --- ESTADO DE LA APLICACIÓN ---
    let currentUser = null;
    let users = [];
    let products = [];
    let stores = [];
    let currentSection = 'inicio';
    let currentStoreId = null; 
    let currentStoreForPayment = null; // Para rastrear qué tienda se está procesando
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
        initializeExtendedProducts();
        syncKnownProductsAndExtendNew();
        checkActiveSession();
        setupEventListeners();
        
        // Manejar el evento de retroceso/avance del navegador
        window.addEventListener('popstate', (event) => {
            const url = new URL(window.location);
            const section = url.searchParams.get('section') || 'inicio';
            const storeId = url.searchParams.get('store');
            
            if (section === 'tienda' && storeId) {
                navigateToStore(storeId, false);
            } else {
                navigateTo(section, false);
            }
        });

        // Restaurar el estado desde la URL
        const url = new URL(window.location);
        const section = url.searchParams.get('section');
        const storeId = url.searchParams.get('store');
        
        if (section === 'tienda' && storeId) {
            // Restaurar la vista de la tienda específica
            navigateToStore(storeId, false);
        } else if (section) {
            // Navegar a la sección guardada
            navigateTo(section, false);
        } else {
            // Por defecto, ir al inicio
            navigateTo('inicio', false);
        }
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

    // ---------------------------------------------------------------------------------
    // Productos extendidos (persistencia de los movidos a la nueva vista)
    // ---------------------------------------------------------------------------------
    let extendedProductIds = new Set();
    let knownProductIds = new Set();

    function initializeExtendedProducts() {
        try {
            const saved = JSON.parse(localStorage.getItem('artesanica_extended_products')) || [];
            if (Array.isArray(saved) && saved.length > 0) {
                extendedProductIds = new Set(saved);
                // Saneamiento: si por error se guardaron casi todos los productos como extendidos,
                // restablecer a los últimos 4 para no vaciar la página de inicio
                const total = (products || []).length;
                if (total > 0 && extendedProductIds.size >= total) {
                    const lastFourFix = (products || []).slice(-4).map(p => p.id);
                    extendedProductIds = new Set(lastFourFix);
                    syncExtendedProductsStorage();
                }
            } else {
                // Inicial: tomar los últimos 4 productos actuales
                const lastFour = (products || []).slice(-4).map(p => p.id);
                extendedProductIds = new Set(lastFour);
                syncExtendedProductsStorage();
            }
        } catch (e) {
            // En caso de error, fallback a últimos 4
            const lastFour = (products || []).slice(-4).map(p => p.id);
            extendedProductIds = new Set(lastFour);
            syncExtendedProductsStorage();
        }
    }

    function syncExtendedProductsStorage() {
        localStorage.setItem('artesanica_extended_products', JSON.stringify(Array.from(extendedProductIds)));
    }

    function syncKnownProductsAndExtendNew() {
        const currentIds = (products || []).map(p => p.id);

        // Si es la primera vez, solo inicializamos known con los actuales y no movemos nada
        if (savedKnownNeedsInit()) {
            knownProductIds = new Set(currentIds);
            localStorage.setItem('artesanica_known_products', JSON.stringify(currentIds));
            return;
        }

        // Cargar conocidos previamente
        try {
            const savedKnown = JSON.parse(localStorage.getItem('artesanica_known_products')) || [];
            knownProductIds = new Set(Array.isArray(savedKnown) ? savedKnown : []);
        } catch (_) {
            knownProductIds = new Set(currentIds);
        }

        // Detectar solo productos realmente nuevos para moverlos a extendidos
        let changed = false;
        currentIds.forEach(id => {
            if (!knownProductIds.has(id)) {
                extendedProductIds.add(id);
                knownProductIds.add(id);
                changed = true;
            }
        });

        if (changed) {
            syncExtendedProductsStorage();
            localStorage.setItem('artesanica_known_products', JSON.stringify(Array.from(knownProductIds)));
        }
    }

    function savedKnownNeedsInit() {
        try {
            return !localStorage.getItem('artesanica_known_products');
        } catch (_) {
            return true;
        }
    }

    function getHomeProducts() {
        return (products || []).filter(p => !extendedProductIds.has(p.id));
    }

    function getExtendedProducts() {
        return (products || []).filter(p => extendedProductIds.has(p.id));
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

    function processPayment(storeId = null) {
        if (!currentUser) {
            showNotification('Debes iniciar sesión para realizar un pago', 'error');
            showAuthModal();
            return;
        }

        // Validar dirección de envío si es necesario
        if (deliveryMethod === 'domicilio' && !deliveryAddress.trim()) {
            showNotification('Por favor ingresa una dirección de envío', 'error');
            document.getElementById('direccion-envio')?.focus();
            return;
        }

        // Obtener los productos a pagar
        let itemsToPay;
        if (storeId) {
            // Pagar solo los productos de la tienda especificada
            itemsToPay = currentUser.carrito.filter(item => {
                const product = products.find(p => p.id === item.id);
                return product && product.tienda.id === storeId;
            });
        } else {
            // Pagar todos los productos (comportamiento anterior)
            itemsToPay = [...currentUser.carrito];
        }

        if (itemsToPay.length === 0) {
            showNotification('No hay productos para pagar', 'error');
            return;
        }

        // Obtener información de la tienda
        let storeInfo = {};
        if (storeId) {
            const firstItem = itemsToPay[0];
            const product = products.find(p => p.id === firstItem.id);
            if (product && product.tienda) {
                storeInfo = {
                    storeId: product.tienda.id,
                    storeName: product.tienda.nombre
                };
            }
        }

        // Calcular totales
        const subtotal = itemsToPay.reduce((sum, item) => {
            const product = products.find(p => p.id === item.id);
            return sum + (product ? product.precio * item.cantidad : 0);
        }, 0);

        const envio = deliveryMethod === 'domicilio' ? 150.00 : 0;
        const total = subtotal + envio;

        // Crear orden con información detallada
        const order = {
            id: `order_${Date.now()}`,
            userId: currentUser.id,
            items: itemsToPay.map(item => {
                const product = products.find(p => p.id === item.id);
                return {
                    ...item,
                    productName: product?.nombre || 'Producto no disponible',
                    productPrice: product?.precio || 0,
                    productImage: product?.imagen || ''
                };
            }),
            ...storeInfo,  // Añadir información de la tienda
            subtotal,
            envio,
            total,
            fecha: new Date().toISOString(),
            estado: 'pendiente',
            direccionEnvio: deliveryMethod === 'domicilio' ? deliveryAddress : 'Retiro en local',
            metodoEntrega: deliveryMethod,
            facturaId: `FAC-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
        };

        // Aquí iría la lógica de procesamiento de pago
        // Por ahora, simulamos un pago exitoso después de 1.5 segundos
        showNotification('Procesando pago...', 'info');
        
        setTimeout(() => {
            // 1. Agregar la orden al historial
            if (!currentUser.historialCompras) {
                currentUser.historialCompras = [];
            }
            currentUser.historialCompras.push(order);
            
            // 2. Eliminar solo los productos pagados del carrito
            currentUser.carrito = currentUser.carrito.filter(cartItem => 
                !itemsToPay.some(orderItem => orderItem.id === cartItem.id)
            );
            
            // 3. Guardar cambios
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex] = currentUser;
                saveUsersToStorage();
            }
            
            // 4. Actualizar la interfaz de usuario
            updateCartCounter();
            
            // 5. Mostrar notificación de éxito
            showNotification('¡Pago exitoso! Tu pedido ha sido procesado.', 'exito');
            
            // 6. Actualizar la vista actual
            if (currentSection === 'carrito' || currentSection === 'tienda') {
                // Si estamos en el carrito o en una tienda, actualizar la vista
                if (storeId) {
                    // Si es un pago de tienda específica, volver a la vista del carrito
                    navigateTo('carrito');
                } else {
                    // Si es un pago general, actualizar la vista actual
                    updateUI();
                }
            } else {
                // Si estamos en otra sección, solo actualizar el contador
                updateCartCounter();
            }
            
            // 7. Resetear estado de pago
            currentStoreForPayment = null;
        }, 1500);
    }

    // =================================================================================
    // NAVEGACIÓN Y RENDERIZADO
    // =================================================================================
    function navigateTo(sectionId, updateHistory = true) {
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

        // Actualizar la URL sin recargar la página
        if (updateHistory) {
            const url = new URL(window.location);
            if (sectionId === 'inicio') {
                history.pushState({ section: 'inicio' }, '', url.pathname);
            } else {
                url.searchParams.set('section', sectionId);
                history.pushState({ section: sectionId }, '', url);
            }
        }

        window.scrollTo(0, 0);
        updateUI();
    }
    
    function navigateToStore(storeId, updateHistory = true) {
        currentStoreId = storeId;
        if (updateHistory) {
            const url = new URL(window.location);
            url.searchParams.set('store', storeId);
            history.pushState({ section: 'tienda', storeId: storeId }, '', url);
        }
        navigateTo('tienda', updateHistory);
    }

    function updateUI() {
        switch(currentSection) {
            case 'inicio':
                renderCategoriesAndFilters();
                const homeProducts = getHomeProducts();
                renderProducts(homeProducts, 'productos-container');
                renderStores(stores);
                break;
            case 'productos':
                const extended = getExtendedProducts();
                renderProducts(extended, 'todos-productos');
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
            case 'mas-tiendas':
                const moreStoresContainer = document.getElementById('mas-tiendas-container');
                if (moreStoresContainer) {
                    moreStoresContainer.innerHTML = '';
                }
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
            <div class="product-card" onclick="app.navigateToProduct('${product.id}')">
                <div class="product-image-container">
                    <img src="${product.imagen}" alt="${product.nombre}" class="product-image">
                    <button class="favorite-btn" onclick="event.stopPropagation(); app.toggleFavorite('${product.id}')">
                        <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
                <div class="product-content">
                    <h3 class="product-name">${product.nombre}</h3>
                    <p class="store-name">${product.tienda?.nombre || 'Tienda'}</p>
                    <p class="product-price">C$${product.precio.toFixed(2)}</p>
                    <button class="btn btn-primary add-to-cart" 
                            onclick="event.stopPropagation(); app.addToCart('${product.id}')">
                        <i class="fas fa-shopping-cart"></i> Agregar
                    </button>
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
        
        // Asegurarse de que el contenedor tenga la clase correcta
        container.className = 'stores-grid';
        
        container.innerHTML = (storesToDisplay || []).map(store => `
            <div class="store-card" onclick="app.navigateToStore('${store.id}')">
                <div class="store-image-container">
                    <img src="${store.imagen || 'img/default-store.jpg'}" 
                         alt="${store.nombre}" 
                         class="store-image">
                </div>
                <div class="store-content">
                    <h3 class="store-name">${store.nombre}</h3>
                    <p class="store-description">${store.descripcion || 'Tienda de artesanías'}</p>
                    <div class="store-button">
                        <span>Ver Tienda</span>
                        <i class="fas fa-arrow-right" style="margin-left: 0.5rem;"></i>
                    </div>
                </div>
            </div>`).join('');
            
        // Si no hay tiendas para mostrar
        if ((!storesToDisplay || storesToDisplay.length === 0) && container) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <i class="fas fa-store-slash" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <p>No hay tiendas disponibles en este momento.</p>
                </div>`;
        }
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
        
        // Agrupar órdenes por tienda
        const ordersByStore = {};
        currentUser.historialCompras.forEach(order => {
            const storeKey = order.storeId || 'varios';
            if (!ordersByStore[storeKey]) {
                ordersByStore[storeKey] = {
                    storeName: order.storeName || 'Varios vendedores',
                    orders: []
                };
            }
            ordersByStore[storeKey].orders.push(order);
        });

        // Ordenar las tiendas por fecha (más reciente primero)
        const sortedStoreOrders = Object.values(ordersByStore).map(store => ({
            ...store,
            orders: store.orders.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        })).sort((a, b) => {
            if (a.orders.length === 0 || b.orders.length === 0) return 0;
            return new Date(b.orders[0].fecha) - new Date(a.orders[0].fecha);
        });

        // Generar el HTML para las órdenes agrupadas por tienda
        const ordersHtml = sortedStoreOrders.length > 0 
            ? sortedStoreOrders.map(store => `
                <div class="card" style="margin-bottom: 2rem; border: 1px solid var(--color-borde);">
                    <div class="card-header" style="background-color: #f8f9fa; padding: 1rem; border-bottom: 1px solid var(--color-borde);">
                        <h4 style="margin: 0; font-size: 1.1rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-store" style="color: var(--color-primary);"></i>
                            ${store.storeName}
                        </h4>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        ${store.orders.map(order => `
                            <div class="order-item" style="padding: 1rem; border-bottom: 1px solid #eee;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <div style="font-weight: 600; margin-bottom: 0.5rem;">
                                            Factura #${order.facturaId || order.id.slice(-6)}
                                        </div>
                                        <div style="font-size: 0.9rem; color: var(--color-texto-secundario);">
                                            ${new Date(order.fecha).toLocaleDateString('es-ES', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="font-weight: 600; color: var(--color-primary);">
                                            C$${order.total.toFixed(2)}
                                        </div>
                                        <div style="font-size: 0.8rem; margin-top: 0.25rem;">
                                            <span class="status-badge" style="
                                                background-color: ${getStatusColor(order.estado)};
                                                color: white;
                                                padding: 0.25rem 0.5rem;
                                                border-radius: 12px;
                                                font-size: 0.75rem;
                                            ">${order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Botón para ver detalles del pedido -->
                                <div style="margin-top: 1rem; text-align: right;">
                                    <button class="btn btn-text" 
                                            onclick="app.showOrderDetails('${order.id}')"
                                            style="font-size: 0.85rem; padding: 0.25rem 0.5rem;">
                                        Ver detalles <i class="fas fa-chevron-right" style="margin-left: 0.25rem;"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')
            : '<div class="card" style="padding: 2rem; text-align: center;">No tienes compras anteriores.</div>';

        // Renderizar la sección de perfil
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr; gap: 2rem; max-width: 1200px; margin: 0 auto;">
                <!-- Tarjeta de perfil del usuario -->
                <div class="card" style="padding: 1.5rem; text-align: center; height: fit-content;">
                    <i class="fas fa-user-circle" style="font-size: 4rem; color: var(--color-primary);"></i>
                    <h2 style="font-size: 1.5rem; font-weight: 600; margin-top: 1rem;">${currentUser.nombre}</h2>
                    <p>${currentUser.email}</p>
                    <p style="font-size: 0.8rem; color: var(--color-texto-secundario); margin-top: 0.5rem;">
                        Miembro desde: ${new Date(currentUser.fechaRegistro).toLocaleDateString('es-ES', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </p>
                    <button class="btn btn-secondary" style="margin-top: 1.5rem; width: 100%;" onclick="app.logout()">
                        <i class="fas fa-sign-out-alt" style="margin-right: 0.5rem;"></i> Cerrar sesión
                    </button>
                </div>

                <!-- Historial de compras -->
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <h3 style="font-size: 1.5rem; font-weight: 600; margin: 0;">Mis Compras</h3>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-outline" style="font-size: 0.85rem; padding: 0.5rem 1rem;">
                                <i class="fas fa-filter" style="margin-right: 0.5rem;"></i> Filtrar
                            </button>
                            <button class="btn btn-outline" style="font-size: 0.85rem; padding: 0.5rem 1rem;">
                                <i class="fas fa-sort" style="margin-right: 0.5rem;"></i> Ordenar
                            </button>
                        </div>
                    </div>
                    
                    ${ordersHtml}
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
            currentStoreForPayment = null; // Resetear la tienda seleccionada
            return;
        }

        summaryContainer.classList.remove('hidden');

        // Agrupar productos por tienda
        const cartByStore = currentUser.carrito.reduce((acc, item) => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const storeId = product.tienda.id;
                if (!acc[storeId]) {
                    acc[storeId] = {
                        storeId: storeId,
                        storeName: product.tienda.nombre,
                        items: []
                    };
                }
                acc[storeId].items.push({...item, productData: product});
            }
            return acc;
        }, {});

        // Si hay una tienda seleccionada, mostrar solo los productos de esa tienda
        if (currentStoreForPayment && cartByStore[currentStoreForPayment]) {
            const storeOrder = cartByStore[currentStoreForPayment];
            renderStoreCheckout(storeOrder);
            return;
        }

        // Si no hay tienda seleccionada, mostrar todos los productos agrupados por tienda
        let itemsHtml = Object.values(cartByStore).map(storeOrder => {
            let storeSubtotal = storeOrder.items.reduce((sum, item) => 
                sum + (item.productData.precio * item.cantidad), 0);

            const storeItemsHtml = storeOrder.items.map(item => `
                <div class="card" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; margin-bottom: 1rem;">
                    <img src="${item.productData.imagen}" alt="${item.productData.nombre}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 0.25rem;">
                    <div style="flex: 1;">
                        <h3 style="font-weight: 600;">${item.productData.nombre}</h3>
                        <p class="price">C$${item.productData.precio.toFixed(2)}</p>
                    </div>
                    <div style="text-align: right;">
                        <input type="number" min="1" value="${item.cantidad}" 
                               onchange="app.updateCartQuantity('${item.id}', this.valueAsNumber)" 
                               class="form-input" style="width: 70px; text-align: center; margin-bottom: 0.5rem;">
                        <button onclick="app.updateCartQuantity('${item.id}', 0)" class="btn-icon" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>`
            ).join('');

            return `
                <div class="store-cart-group" style="margin-bottom: 2rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--color-borde);">
                        <h3 style="font-size: 1.2rem; font-weight: 600; margin: 0;">${storeOrder.storeName}</h3>
                        <button class="btn btn-primary" onclick="app.payForStore('${storeOrder.storeId}')">
                            Pagar Pedido (C$${storeSubtotal.toFixed(2)})
                        </button>
                    </div>
                    ${storeItemsHtml}
                    <div style="text-align: right; font-weight: bold; margin-top: 1rem;">
                        Subtotal Tienda: C$${storeSubtotal.toFixed(2)}
                    </div>
                </div>
            `;
        }).join('');

        itemsContainer.innerHTML = itemsHtml;
        summaryContainer.classList.add('hidden'); // Ocultar resumen general cuando se muestran todas las tiendas
    }

    // Función para renderizar el checkout de una tienda específica
    function renderStoreCheckout(storeOrder) {
        const itemsContainer = document.getElementById('contenido-carrito');
        const summaryContainer = document.getElementById('resumen-carrito');
        
        // Renderizar productos de la tienda
        const storeItemsHtml = storeOrder.items.map(item => `
            <div class="card" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; margin-bottom: 1rem;">
                <img src="${item.productData.imagen}" alt="${item.productData.nombre}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 0.25rem;">
                <div style="flex: 1;">
                    <h3 style="font-weight: 600;">${item.productData.nombre}</h3>
                    <p class="price">C$${item.productData.precio.toFixed(2)}</p>
                </div>
                <div style="text-align: right;">
                    <input type="number" min="1" value="${item.cantidad}" 
                           onchange="app.updateCartQuantity('${item.id}', this.valueAsNumber)" 
                           class="form-input" style="width: 70px; text-align: center; margin-bottom: 0.5rem;">
                    <button onclick="app.updateCartQuantity('${item.id}', 0)" class="btn-icon" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>`
        ).join('');

        // Calcular subtotal
        const subtotal = storeOrder.items.reduce((sum, item) => 
            sum + (item.productData.precio * item.cantidad), 0);
        
        const envio = deliveryMethod === 'domicilio' ? 150.00 : 0;
        const total = subtotal + envio;

        // Actualizar la interfaz
        itemsContainer.innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <button class="btn btn-text" onclick="app.returnToCartView()">
                    <i class="fas fa-arrow-left"></i> Volver al carrito
                </button>
            </div>
            <div class="store-cart-group">
                <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1.5rem;">
                    Pedido de ${storeOrder.storeName}
                </h2>
                ${storeItemsHtml}
            </div>
        `;

        // Actualizar el resumen del pedido
        summaryContainer.innerHTML = `
            <div style="padding: 1.5rem;">
                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Resumen del Pedido</h3>
                
                <!-- Opciones de Entrega -->
                <div class="form-group">
                    <label class="form-label">Método de Entrega</label>
                    <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="radio" name="deliveryMethod" value="retiro" 
                                   onchange="app.setDeliveryMethod('retiro')" ${deliveryMethod === 'retiro' ? 'checked' : ''}>
                            <span style="margin-left: 0.5rem;">Retiro en Local</span>
                        </label>
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="radio" name="deliveryMethod" value="domicilio" 
                                   onchange="app.setDeliveryMethod('domicilio')" ${deliveryMethod === 'domicilio' ? 'checked' : ''}>
                            <span style="margin-left: 0.5rem;">A Domicilio</span>
                        </label>
                    </div>
                </div>
                
                <div id="direccion-container" class="form-group" style="margin-top: 1rem; ${deliveryMethod !== 'domicilio' ? 'display: none;' : ''}">
                    <label for="direccion-envio" class="form-label">Dirección de Envío</label>
                    <input type="text" id="direccion-envio" class="form-input" 
                           value="${deliveryAddress}" 
                           oninput="app.setDeliveryAddress(this.value)" 
                           placeholder="Escribe tu dirección completa">
                </div>

                <!-- Resumen de Costos -->
                <div style="margin-top: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Subtotal (${storeOrder.items.length} productos):</span>
                        <span>C$${subtotal.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; border-bottom: 1px solid var(--color-borde); padding-bottom: 1rem;">
                        <span>Envío:</span>
                        <span id="costo-envio">C$${envio.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.25rem;">
                        <span>Total:</span>
                        <span id="total-pedido">C$${total.toFixed(2)}</span>
                    </div>
                </div>
                
                <button class="btn btn-primary" style="width: 100%; margin-top: 1.5rem;" 
                        onclick="app.processPayment('${storeOrder.storeId}')">
                    Proceder al Pago
                </button>
            </div>
        `;
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
        container.innerHTML = categories.map(cat => {
            // Ícono especial para hamacas
            if (cat.id === 'hamacas') {
                return `
                    <a href="#" class="card category-card" data-categoria="${cat.id}">
                        <svg class="category-icon hammock-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 7C4 5.34315 5.34315 4 7 4H17C18.6569 4 20 5.34315 20 7V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M8 8V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M16 8V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="category-name">${cat.nombre}</span>
                    </a>
                `;
            }
            
            // Para las demás categorías
            return `
                <a href="#" class="card category-card" data-categoria="${cat.id}">
                    <i class="${cat.icono} category-icon"></i>
                    <span class="category-name">${cat.nombre}</span>
                </a>
            `;
        }).join('') + `
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

    function returnToCartView() {
        currentStoreForPayment = null;
        renderCartSection();
    }

    function payForStore(storeId) {
        currentStoreForPayment = storeId;
        renderCartSection();
    }

    function markAsDelivered(orderId) {
        if (!currentUser) {
            showNotification('Debes iniciar sesión para marcar el pedido como recibido', 'error');
            return;
        }

        // Encontrar el pedido en el historial del usuario
        const orderIndex = currentUser.historialCompras.findIndex(o => o.id === orderId);
        if (orderIndex === -1) {
            showNotification('No se encontró el pedido', 'error');
            return;
        }

        // Actualizar el estado del pedido
        currentUser.historialCompras[orderIndex].estado = 'completado';
        
        // Guardar cambios
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            saveUsersToStorage();
            
            // Cerrar el modal actual
            const modal = document.querySelector('.modal');
            if (modal) {
                document.body.removeChild(modal);
            }
            
            // Mostrar notificación
            showNotification('¡Producto marcado como recibido correctamente!', 'exito');
            
            // Actualizar la vista del perfil
            if (currentSection === 'perfil') {
                renderProfileSection();
            }
        }
    }

    function getStatusColor(status, type = 'background') {
        const statusColors = {
            'pendiente': {
                background: '#ffc107',  // Amarillo
                text: '#000',
                buttonBg: '#ffc107',
                buttonText: '#000'
            },
            'procesando': {
                background: '#17a2b8', // Azul claro
                text: '#fff',
                buttonBg: '#17a2b8',
                buttonText: '#fff'
            },
            'enviado': {
                background: '#007bff',  // Azul
                text: '#fff',
                buttonBg: '#007bff',
                buttonText: '#fff'
            },
            'entregado': {
                background: '#28a745',  // Verde
                text: '#fff',
                buttonBg: '#6c757d',   // Gris para botón
                buttonText: '#fff'
            },
            'completado': {
                background: '#28a745',  // Verde
                text: '#fff',
                buttonBg: '#6c757d',   // Gris para botón
                buttonText: '#fff'
            },
            'cancelado': {
                background: '#dc3545',  // Rojo
                text: '#fff',
                buttonBg: '#dc3545',
                buttonText: '#fff',
                disabled: true
            }
        };
        
        const statusLower = status.toLowerCase();
        const colorInfo = statusColors[statusLower] || {
            background: '#6c757d',
            text: '#fff',
            buttonBg: '#6c757d',
            buttonText: '#fff'
        };
        
        return type === 'buttonBg' ? colorInfo.buttonBg : 
               type === 'buttonText' ? colorInfo.buttonText :
               type === 'text' ? colorInfo.text :
               type === 'background' ? colorInfo.background :
               colorInfo.background;
    }

    function showOrderDetails(orderId) {
        const order = currentUser.historialCompras.find(o => o.id === orderId);
        if (!order) {
            showNotification('No se encontró el pedido solicitado', 'error');
            return;
        }

        // Crear un modal para mostrar los detalles del pedido
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 2rem;
            z-index: 1000;
            overflow-y: auto;
        `;

        // Contenido del modal
        modal.innerHTML = `
            <div class="modal-content" style="
                background-color: white;
                border-radius: 8px;
                width: 100%;
                max-width: 800px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                overflow: hidden;
            ">
                <!-- Encabezado del modal -->
                <div style="
                    padding: 1.5rem;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h3 style="margin: 0; font-size: 1.5rem; font-weight: 600;">
                        <i class="fas fa-receipt" style="margin-right: 0.5rem; color: var(--color-primary);"></i>
                        Factura #${order.facturaId || order.id.slice(-6)}
                    </h3>
                    <button id="closeModal" class="btn-icon" style="font-size: 1.25rem; color: #6c757d;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Cuerpo del modal -->
                <div style="padding: 1.5rem;">
                    <!-- Información de la tienda -->
                    <div style="margin-bottom: 2rem; padding: 1rem; background-color: #f8f9fa; border-radius: 6px;">
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                            <div style="
                                width: 50px;
                                height: 50px;
                                border-radius: 50%;
                                background-color: var(--color-primary);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: white;
                                font-size: 1.5rem;
                            ">
                                <i class="fas fa-store"></i>
                            </div>
                            <div>
                                <h4 style="margin: 0 0 0.25rem 0; font-size: 1.1rem; font-weight: 600;">
                                    ${order.storeName || 'Tienda'}
                                </h4>
                                <p style="margin: 0; font-size: 0.9rem; color: var(--color-texto-secundario);">
                                    ${order.storeId ? `ID: ${order.storeId}` : ''}
                                </p>
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
                            <div>
                                <div style="font-size: 0.8rem; color: var(--color-texto-secundario); margin-bottom: 0.25rem;">Fecha</div>
                                <div>${new Date(order.fecha).toLocaleDateString('es-ES', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.8rem; color: var(--color-texto-secundario); margin-bottom: 0.25rem;">Estado</div>
                                <div>
                                    <span class="status-badge" style="
                                        background-color: ${getStatusColor(order.estado)};
                                        color: white;
                                        padding: 0.25rem 0.75rem;
                                        border-radius: 12px;
                                        font-size: 0.8rem;
                                        display: inline-block;
                                    ">${order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}</span>
                                </div>
                            </div>
                            <div>
                                <div style="font-size: 0.8rem; color: var(--color-texto-secundario); margin-bottom: 0.25rem;">Método de entrega</div>
                                <div>${order.metodoEntrega === 'domicilio' ? 'A domicilio' : 'Retiro en local'}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Productos del pedido -->
                    <h4 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">
                        Productos
                    </h4>
                    
                    <div style="margin-bottom: 2rem;">
                        ${order.items && order.items.length > 0 
                            ? order.items.map(item => `
                                <div style="display: flex; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid #f0f0f0;">
                                    <img src="${item.productData?.imagen || 'https://via.placeholder.com/80'}" 
                                         alt="${item.productData?.nombre || 'Producto'}" 
                                         style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
                                    <div style="flex: 1;">
                                        <div style="font-weight: 600; margin-bottom: 0.25rem;">
                                            ${item.productData?.nombre || 'Producto no disponible'}
                                        </div>
                                        <div style="font-size: 0.9rem; color: var(--color-texto-secundario); margin-bottom: 0.5rem;">
                                            Cantidad: ${item.cantidad} x C$${item.productData?.precio?.toFixed(2) || '0.00'}
                                        </div>
                                        <div style="font-weight: 600; color: var(--color-primary);">
                                            C$${(item.productData?.precio * item.cantidad).toFixed(2) || '0.00'}
                                        </div>
                                    </div>
                                </div>
                            `).join('')
                            : '<p>No se encontraron productos en este pedido.</p>'
                        }
                    </div>

                    <!-- Resumen del pedido -->
                    <div style="background-color: #f8f9fa; border-radius: 6px; padding: 1.5rem; margin-top: 2rem;">
                        <h4 style="font-size: 1.1rem; font-weight: 600; margin-top: 0; margin-bottom: 1.5rem; text-align: center;">
                            Resumen del Pedido
                        </h4>
                        
                        <div style="margin-bottom: 1.5rem;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                                <span>Subtotal (${order.items?.length || 0} productos):</span>
                                <span>C$${order.subtotal?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid #ddd;">
                                <span>Envío:</span>
                                <span>C$${order.envio?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: 600; margin-top: 1rem;">
                                <span>Total:</span>
                                <span style="color: var(--color-primary);">C$${order.total?.toFixed(2) || '0.00'}</span>
                            </div>
                        </div>

                        <!-- Información de envío si aplica -->
                        ${order.metodoEntrega === 'domicilio' ? `
                            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #eee;">
                                <h5 style="font-size: 1rem; font-weight: 600; margin-top: 0; margin-bottom: 0.75rem;">
                                    <i class="fas fa-truck" style="margin-right: 0.5rem; color: var(--color-primary);"></i>
                                    Dirección de Envío
                                </h5>
                                <p style="margin: 0; line-height: 1.5;">
                                    ${order.direccionEnvio || 'No especificada'}
                                </p>
                            </div>
                        ` : `
                            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #eee; text-align: center;">
                                <i class="fas fa-store" style="font-size: 1.5rem; color: var(--color-primary); margin-bottom: 0.5rem; display: block;"></i>
                                <p style="margin: 0; font-weight: 500;">Recogerás tu pedido en la tienda</p>
                                <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: var(--color-texto-secundario);">
                                    Te notificaremos cuando tu pedido esté listo
                                </p>
                            </div>
                        `}
                    </div>

                    <!-- Botones de acción -->
                    <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #eee; flex-wrap: wrap;">
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: flex-end; width: 100%;">
                            <button id="printReceipt" class="btn btn-outline" style="display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-print"></i> Imprimir Recibo
                            </button>
                            ${['enviado', 'pendiente', 'procesando'].includes(order.estado) ? `
                            <button id="markAsDelivered" class="btn btn-success" style="display: flex; align-items: center; gap: 0.5rem; background-color: #28a745; color: white; border: none;">
                                <i class="fas fa-check-circle"></i> Marcar como Recibido
                            </button>
                            ` : ''}
                            <button id="contactSeller" class="btn" style="display: flex; align-items: center; gap: 0.5rem; 
                                background-color: ${getStatusColor(order.estado, 'buttonBg')}; 
                                color: ${getStatusColor(order.estado, 'buttonText')}; 
                                border: none;
                                ${['entregado', 'completado'].includes(order.estado) ? 'opacity: 0.8;' : ''}">
                                <i class="fab fa-whatsapp"></i> Contactar al Vendedor
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Agregar el modal al documento
        document.body.appendChild(modal);

        // Configurar eventos del modal
        const closeButton = modal.querySelector('#closeModal');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        }

        // Cerrar al hacer clic fuera del contenido
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        // Configurar botón de impresión
        const printButton = modal.querySelector('#printReceipt');
        if (printButton) {
            printButton.addEventListener('click', () => {
                window.print();
            });
        }

        // Configurar botón de contacto
        const contactButton = modal.querySelector('#contactSeller');
        if (contactButton) {
            contactButton.addEventListener('click', () => {
                if (!order || !order.storeId) {
                    showNotification('No se encontró la información del vendedor', 'error');
                    return;
                }

                // Obtener información del vendedor
                const store = window.tiendasData.find(t => t.id === order.storeId);
                if (!store || !store.contacto) {
                    console.error('No se encontró la tienda o el contacto:', { storeId: order.storeId, store });
                    showNotification('No se encontró la información de contacto del vendedor', 'error');
                    return;
                }

                let message = `*¡Hola!* 👋\n\n`;
                message += `Soy *${currentUser.nombre || 'Cliente'}* `;
                
                // Personalizar mensaje según el estado del pedido
                const estado = order.estado.toLowerCase();
                
                if (estado === 'pendiente') {
                    message += `y quiero confirmar mi pedido.\n\n`;
                    message += `*📋 Detalles del Pedido*\n\n`;
                    message += `*N° de Factura:* ${order.facturaId || order.id.slice(-6)}\n`;
                    message += `*Estado:* ${order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}\n\n`;
                    
                    // Productos
                    message += `*🛍️ Productos Solicitados:*\n\n`;
                    order.items.forEach((item, index) => {
                        const productName = item.productData?.nombre || 'Producto';
                        message += `${index + 1}. *${productName}* (${item.cantidad} x C$${item.productData?.precio?.toFixed(2) || '0.00'})\n`;
                    });
                    
                    message += `\n*💰 Total: C$${order.total?.toFixed(2) || '0.00'}*\n\n`;
                    message += `Por favor, confírmame la disponibilidad de los productos y las opciones de pago.`;
                    
                } else if (estado === 'procesando') {
                    message += `y quiero consultar el estado de mi pedido.\n\n`;
                    message += `*N° de Pedido:* ${order.facturaId || order.id.slice(-6)}\n`;
                    message += `*Realizado el:* ${new Date(order.fecha).toLocaleDateString('es-ES', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric'
                    })}\n\n`;
                    message += `¿Podrían indicarme en qué estado se encuentra mi pedido y cuándo podría estar listo para envío?`;
                    
                } else if (estado === 'enviado') {
                    message += `y necesito información sobre el envío de mi pedido.\n\n`;
                    message += `*N° de Pedido:* ${order.facturaId || order.id.slice(-6)}\n`;
                    message += `*Método de envío:* ${order.metodoEntrega === 'domicilio' ? 'A domicilio' : 'Recoger en tienda'}\n\n`;
                    
                    if (order.metodoEntrega === 'domicilio') {
                        message += `¿Podrían proporcionarme el número de seguimiento o información sobre la entrega?\n\n`;
                        if (order.direccionEnvio) {
                            message += `*Dirección de envío:*\n${order.direccionEnvio}\n\n`;
                        }
                    } else {
                        message += `¿Podrían indicarme si ya está listo para ser recogido en tienda?\n\n`;
                    }
                    
                } else if (['entregado', 'completado'].includes(estado)) {
                    message += `¡Espero que se encuentre bien! \n\n`;
                    message += `Me comunico para realizar una consulta sobre un pedido anterior.\n\n`;
                    message += `¿Podrían ayudarme por favor?`;
                }
                
                // Información de contacto del cliente
                message += `\n\n*Mis datos de contacto:*\n`;
                message += `📱 ${currentUser.telefono || 'Sin teléfono registrado'}\n`;
                message += `📧 ${currentUser.email || 'Sin correo registrado'}`;
                
                // Codificar el mensaje para URL
                const encodedMessage = encodeURIComponent(message);
                
                // Formatear número de teléfono (eliminar cualquier carácter que no sea dígito)
                const phoneNumber = store.contacto.replace(/\D/g, '');
                
                // Verificar si el número tiene el formato correcto (al menos 8 dígitos)
                if (!phoneNumber || phoneNumber.length < 8) {
                    console.error('Número de teléfono no válido:', store.contacto);
                    showNotification('El número de teléfono del vendedor no es válido', 'error');
                    return;
                }
                
                // Agregar el código de país si no está presente (asumiendo Nicaragua +505)
                const fullPhoneNumber = phoneNumber.startsWith('505') ? phoneNumber : 
                                      (phoneNumber.startsWith('8') ? '505' + phoneNumber : phoneNumber);
                
                // Crear la URL de WhatsApp
                const whatsappUrl = `https://wa.me/${fullPhoneNumber}?text=${encodedMessage}`;
                console.log('Abriendo WhatsApp con URL:', whatsappUrl);
                
                // Abrir en una nueva pestaña
                const newWindow = window.open(whatsappUrl, '_blank');
                
                // Si la ventana no se abrió (posible bloqueador de ventanas emergentes)
                if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                    showNotification('No se pudo abrir WhatsApp. Por favor, verifica si tienes un bloqueador de ventanas emergentes.', 'error');
                }
            });
        }

        // Configurar botón de marcar como recibido
        const markDeliveredButton = modal.querySelector('#markAsDelivered');
        if (markDeliveredButton) {
            markDeliveredButton.addEventListener('click', () => {
                markAsDelivered(order.id);
            });
        }
    }

    window.app = {
        toggleFavorite,
        addToCart,
        updateCartQuantity,
        logout,
        processPayment,
        navigateTo,
        navigateToStore,
        login,
        register,
        setDeliveryMethod,
        setDeliveryAddress,
        payForStore,
        returnToCartView,
        showOrderDetails,
        markAsDelivered
    };

    initialize();
});
