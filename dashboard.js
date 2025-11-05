// Dashboard System
class DashboardSystem {
    constructor() {
        this.orders = JSON.parse(localStorage.getItem('artesanica_orders')) || [];
        this.init();
    }

    init() {
        // Dashboard will be loaded when user logs in
    }

    loadSellerDashboard() {
        const user = auth.getCurrentUser();
        if (!user || !user.store) return;

        const dashboardContent = document.getElementById('dashboard-content');
        
        const sellerProducts = productSystem.getProductsByStore(user.store.id);
        const sellerOrders = this.getSellerOrders(user.store.id);

        dashboardContent.innerHTML = `
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-800 mb-2">Dashboard del Vendedor</h1>
                <p class="text-gray-600">Bienvenido, ${user.name}</p>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="stat-card rounded-xl p-6 text-white">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-lg opacity-90">Productos</p>
                            <p class="text-3xl font-bold">${sellerProducts.length}</p>
                        </div>
                        <i class="fas fa-box text-3xl opacity-80"></i>
                    </div>
                </div>
                <div class="stat-card rounded-xl p-6 text-white">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-lg opacity-90">Ventas</p>
                            <p class="text-3xl font-bold">${sellerOrders.length}</p>
                        </div>
                        <i class="fas fa-chart-line text-3xl opacity-80"></i>
                    </div>
                </div>
                <div class="stat-card rounded-xl p-6 text-white">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-lg opacity-90">Ingresos</p>
                            <p class="text-3xl font-bold">C$ ${this.getSellerRevenue(sellerOrders)}</p>
                        </div>
                        <i class="fas fa-money-bill-wave text-3xl opacity-80"></i>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Add Product Form -->
                <div class="dashboard-card p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-4">Agregar Nuevo Producto</h3>
                    <form id="add-product-form" class="space-y-4">
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2">Nombre del Producto</label>
                            <input type="text" id="product-name" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
                            <textarea id="product-description" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2">Precio (C$)</label>
                                <input type="number" id="product-price" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2">Stock</label>
                                <input type="number" id="product-stock" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2">Categoría</label>
                            <select id="product-category" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="artesanias">Artesanías</option>
                                <option value="comida">Comida</option>
                                <option value="textiles">Textiles</option>
                                <option value="otros">Otros</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2">URL de la Imagen</label>
                            <input type="url" id="product-image" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://...">
                        </div>
                        <button type="submit" class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300">
                            Agregar Producto
                        </button>
                    </form>
                </div>

                <!-- Recent Orders -->
                <div class="dashboard-card p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-4">Órdenes Recientes</h3>
                    <div class="space-y-4">
                        ${sellerOrders.length > 0 ? 
                            sellerOrders.slice(0, 5).map(order => `
                                <div class="border border-gray-200 rounded-lg p-4">
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="font-semibold">Orden #${order.id.slice(-6)}</span>
                                        <span class="text-green-600 font-bold">C$ ${order.total}</span>
                                    </div>
                                    <div class="text-sm text-gray-600">
                                        ${order.items.length} productos • ${new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                    <div class="mt-2">
                                        <span class="inline-block px-2 py-1 text-xs rounded-full ${
                                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'
                                        }">${order.status}</span>
                                    </div>
                                </div>
                            `).join('') :
                            '<p class="text-gray-500 text-center py-4">No hay órdenes recientes</p>'
                        }
                    </div>
                </div>
            </div>

            <!-- Products Management -->
            <div class="dashboard-card p-6 mt-8">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Mis Productos</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${sellerProducts.map(product => `
                        <div class="border border-gray-200 rounded-lg p-4">
                            <img src="${product.image}" alt="${product.name}" class="w-full h-32 object-cover rounded-lg mb-3">
                            <h4 class="font-semibold text-gray-800">${product.name}</h4>
                            <p class="text-green-600 font-bold">C$ ${product.price}</p>
                            <div class="flex justify-between items-center mt-2">
                                <span class="text-sm text-gray-500">Stock: ${product.stock}</span>
                                <button onclick="editProduct('${product.id}')" class="text-blue-600 hover:text-blue-800 text-sm">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Add event listener for product form
        document.getElementById('add-product-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewProduct(user.store.id);
        });
    }

    loadAdminDashboard() {
        const dashboardContent = document.getElementById('dashboard-content');
        const allUsers = auth.users || [];
        const allOrders = this.orders;
        const allStores = productSystem.stores;

        dashboardContent.innerHTML = `
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-800 mb-2">Panel de Administración</h1>
                <p class="text-gray-600">Gestión completa de ArtesaNica</p>
            </div>

            <!-- Admin Stats -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-blue-600 rounded-xl p-6 text-white">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-lg opacity-90">Usuarios</p>
                            <p class="text-3xl font-bold">${allUsers.length}</p>
                        </div>
                        <i class="fas fa-users text-3xl opacity-80"></i>
                    </div>
                </div>
                <div class="bg-green-600 rounded-xl p-6 text-white">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-lg opacity-90">Tiendas</p>
                            <p class="text-3xl font-bold">${allStores.length}</p>
                        </div>
                        <i class="fas fa-store text-3xl opacity-80"></i>
                    </div>
                </div>
                <div class="bg-yellow-600 rounded-xl p-6 text-white">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-lg opacity-90">Productos</p>
                            <p class="text-3xl font-bold">${productSystem.products.length}</p>
                        </div>
                        <i class="fas fa-boxes text-3xl opacity-80"></i>
                    </div>
                </div>
                <div class="bg-red-600 rounded-xl p-6 text-white">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-lg opacity-90">Órdenes</p>
                            <p class="text-3xl font-bold">${allOrders.length}</p>
                        </div>
                        <i class="fas fa-shopping-bag text-3xl opacity-80"></i>
                    </div>
                </div>
            </div>

            <!-- Management Sections -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- User Management -->
                <div class="dashboard-card p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-4">Gestión de Usuarios</h3>
                    <div class="space-y-3 max-h-96 overflow-y-auto">
                        ${allUsers.map(user => `
                            <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                <div class="flex items-center space-x-3">
                                    <img src="${user.avatar}" alt="${user.name}" class="w-8 h-8 rounded-full">
                                    <div>
                                        <p class="font-semibold">${user.name}</p>
                                        <p class="text-sm text-gray-500">${user.email}</p>
                                    </div>
                                </div>
                                <span class="px-2 py-1 text-xs rounded-full ${
                                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                    user.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'
                                }">${user.role}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Store Management -->
                <div class="dashboard-card p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-4">Gestión de Tiendas</h3>
                    <div class="space-y-3 max-h-96 overflow-y-auto">
                        ${allStores.map(store => `
                            <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                <div class="flex items-center space-x-3">
                                    <img src="${store.image}" alt="${store.name}" class="w-10 h-10 rounded-lg object-cover">
                                    <div>
                                        <p class="font-semibold">${store.name}</p>
                                        <p class="text-sm text-gray-500">${store.owner}</p>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <span class="flex items-center text-yellow-500">
                                        <i class="fas fa-star mr-1"></i>
                                        ${store.rating}
                                    </span>
                                    <button class="text-blue-600 hover:text-blue-800">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    addNewProduct(storeId) {
        const formData = {
            name: document.getElementById('product-name').value,
            description: document.getElementById('product-description').value,
            price: parseFloat(document.getElementById('product-price').value),
            stock: parseInt(document.getElementById('product-stock').value),
            category: document.getElementById('product-category').value,
            image: document.getElementById('product-image').value || 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            storeId: storeId
        };

        productSystem.addProduct(formData);
        document.getElementById('add-product-form').reset();
    }

    getSellerOrders(storeId) {
        return this.orders.filter(order => 
            order.items.some(item => 
                productSystem.products.find(p => p.id === item.product.id)?.storeId === storeId
            )
        );
    }

    getSellerRevenue(orders) {
        return orders.reduce((total, order) => total + order.total, 0).toFixed(2);
    }
}

// Initialize dashboard system
const dashboardSystem = new DashboardSystem();

// Dashboard UI Functions
function showDashboard() {
    if (!auth.isAuthenticated()) {
        showNotification('Debes iniciar sesión para acceder al dashboard', 'warning');
        showAuthModal('login');
        return;
    }

    // Hide main content, show dashboard
    document.querySelector('main').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');

    // Load appropriate dashboard
    if (auth.isAdmin()) {
        dashboardSystem.loadAdminDashboard();
    } else if (auth.isSeller()) {
        dashboardSystem.loadSellerDashboard();
    } else {
        showNotification('No tienes permisos para acceder al dashboard', 'error');
        hideDashboard();
    }
}

function hideDashboard() {
    document.querySelector('main').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

function editProduct(productId) {
    showNotification('Funcionalidad de edición en desarrollo', 'info');
}