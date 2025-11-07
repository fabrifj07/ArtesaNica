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

        dashboardContent.innerHTML = `...`;
    }

    loadAdminDashboard() {
        const dashboardContent = document.getElementById('dashboard-content');
        const allUsers = auth.users || [];
        const allOrders = this.orders;
        const allStores = productSystem.stores;

        dashboardContent.innerHTML = `...`;
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

const dashboardSystem = new DashboardSystem();

function showDashboard() {
    if (!auth.isAuthenticated()) {
        showNotification('Debes iniciar sesión para acceder al dashboard', 'warning');
        showAuthModal('login');
        return;
    }

    document.querySelector('main').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');

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
