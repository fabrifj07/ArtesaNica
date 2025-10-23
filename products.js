// Products System with Search and Filtering
class ProductSystem {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('artesanica_products')) || this.getDefaultProducts();
        this.stores = JSON.parse(localStorage.getItem('artesanica_stores')) || this.getDefaultStores();
        this.currentCategory = 'all';
        this.searchTerm = '';
        this.init();
    }

    init() {
        this.loadProducts();
        this.loadStores();
        this.setupEventListeners();
    }

    getDefaultProducts() {
        return [
            {
                id: '1',
                name: 'Hamaca Artesanal Colorida',
                description: 'Hamaca tejida a mano con hilos de colores vibrantes, perfecta para descansar',
                price: 850,
                originalPrice: 1000,
                image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                category: 'textiles',
                storeId: '1',
                stock: 15,
                rating: 4.8,
                reviews: 23,
                featured: true
            },
            {
                id: '2',
                name: 'Quesillo Tradicional',
                description: 'Quesillo nicaragüense recién hecho con crema y cebolla, auténtico savor local',
                price: 45,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                category: 'comida',
                storeId: '2',
                stock: 8,
                rating: 4.9,
                reviews: 31,
                featured: true
            },
            {
                id: '3',
                name: 'Mochila de Tela Artesanal',
                description: 'Mochila tejida a mano con diseños tradicionales nicaragüenses',
                price: 320,
                originalPrice: 400,
                image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                category: 'textiles',
                storeId: '1',
                stock: 12,
                rating: 4.6,
                reviews: 18,
                featured: false
            },
            {
                id: '4',
                name: 'Café de Altura Orgánico',
                description: 'Café orgánico cultivado en las montañas de Niquinohomo, sabor intenso y aromático',
                price: 120,
                image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                category: 'comida',
                storeId: '3',
                stock: 25,
                rating: 4.7,
                reviews: 42,
                featured: true
            },
            {
                id: '5',
                name: 'Jarra de Barro Tradicional',
                description: 'Jarra artesanal de barro rojo, perfecta para mantener frescas las bebidas',
                price: 280,
                image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                category: 'artesanias',
                storeId: '4',
                stock: 10,
                rating: 4.5,
                reviews: 15,
                featured: true
            },
            {
                id: '6',
                name: 'Máscara de Madera Tallada',
                description: 'Máscara tradicional nicaragüense tallada a mano en madera de cedro',
                price: 450,
                image: 'https://images.unsplash.com/photo-1562778612-e1e0cda9915c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                category: 'madera',
                storeId: '5',
                stock: 7,
                rating: 4.8,
                reviews: 22,
                featured: false
            },
            {
                id: '7',
                name: 'Cesta de Mimbre',
                description: 'Cesta tejida a mano con mimbre natural, ideal para almacenamiento',
                price: 180,
                image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                category: 'artesanias',
                storeId: '4',
                stock: 20,
                rating: 4.4,
                reviews: 11,
                featured: false
            },
            {
                id: '8',
                name: 'Dulce de Coco Casero',
                description: 'Dulce de coco tradicional hecho con receta familiar de generaciones',
                price: 75,
                image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                category: 'comida',
                storeId: '2',
                stock: 15,
                rating: 4.9,
                reviews: 28,
                featured: true
            }
        ];
    }

    getDefaultStores() {
        return [
            {
                id: '1',
                name: 'Textiles Niquinohomo',
                description: 'Especialistas en tejidos tradicionales y hamacas artesanales',
                owner: 'María González',
                rating: 4.8,
                products: ['1', '3'],
                image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                category: 'textiles',
                location: 'Centro de Niquinohomo',
                joined: '2023-01-15',
                featured: true
            },
            {
                id: '2',
                name: 'Delicias Tradicionales',
                description: 'Comida típica nicaragüense preparada con ingredientes locales',
                owner: 'Carlos Ruiz',
                rating: 4.9,
                products: ['2', '8'],
                image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                category: 'comida',
                location: 'Mercado Municipal',
                joined: '2023-02-20',
                featured: true
            },
            {
                id: '3',
                name: 'Café de la Montaña',
                description: 'Café orgánico cultivado en las laderas del volcán',
                owner: 'Ana Martínez',
                rating: 4.7,
                products: ['4'],
                image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                category: 'comida',
                location: 'Sierra de Niquinohomo',
                joined: '2023-03-10',
                featured: false
            },
            {
                id: '4',
                name: 'Artesanías en Barro',
                description: 'Alfarería tradicional con técnicas ancestrales',
                owner: 'José Pérez',
                rating: 4.5,
                products: ['5', '7'],
                image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                category: 'artesanias',
                location: 'Barrio El Calvario',
                joined: '2023-01-08',
                featured: true
            },
            {
                id: '5',
                name: 'Taller de Madera',
                description: 'Trabajos en madera tallada con diseños autóctonos',
                owner: 'Roberto Silva',
                rating: 4.8,
                products: ['6'],
                image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                category: 'madera',
                location: 'Calle Central',
                joined: '2023-04-05',
                featured: false
            }
        ];
    }

    setupEventListeners() {
        // Category filters
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterProducts(category);
                
                // Update active state
                document.querySelectorAll('.category-btn').forEach(b => {
                    b.classList.remove('active', 'scale-105', 'shadow-lg');
                });
                e.target.classList.add('active', 'scale-105', 'shadow-lg');
            });
        });

        // Search functionality
        const searchInput = document.getElementById('search-input');
        const mobileSearchInput = document.getElementById('mobile-search-input');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.performSearch();
            });
        }
        
        if (mobileSearchInput) {
            mobileSearchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.performSearch();
            });
        }
    }

    performSearch() {
        if (this.searchTerm.length === 0) {
            this.hideSearchResults();
            this.loadProducts();
            return;
        }

        if (this.searchTerm.length < 2) {
            return;
        }

        const filteredProducts = this.products.filter(product => 
            product.name.toLowerCase().includes(this.searchTerm) ||
            product.description.toLowerCase().includes(this.searchTerm) ||
            product.category.toLowerCase().includes(this.searchTerm)
        );

        const filteredStores = this.stores.filter(store =>
            store.name.toLowerCase().includes(this.searchTerm) ||
            store.description.toLowerCase().includes(this.searchTerm) ||
            store.owner.toLowerCase().includes(this.searchTerm)
        );

        this.showSearchResults(filteredProducts, filteredStores);
    }

    showSearchResults(products, stores) {
        const searchResults = document.getElementById('search-results');
        if (!searchResults) return;

        let resultsHTML = '';

        if (products.length === 0 && stores.length === 0) {
            resultsHTML = `
                <div class="p-4 text-center text-gray-500">
                    <i class="fas fa-search mb-2 text-2xl"></i>
                    <p>No se encontraron resultados</p>
                </div>
            `;
        } else {
            if (products.length > 0) {
                resultsHTML += `
                    <div class="p-3 border-b border-gray-200">
                        <h4 class="font-bold text-gray-700">Productos (${products.length})</h4>
                    </div>
                    <div class="max-h-48 overflow-y-auto">
                        ${products.slice(0, 5).map(product => `
                            <div class="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer search-result-item"
                                 onclick="selectSearchResult('product', '${product.id}')">
                                <div class="flex items-center space-x-3">
                                    <img src="${product.image}" alt="${product.name}" class="w-10 h-10 object-cover rounded">
                                    <div class="flex-1">
                                        <p class="font-semibold text-sm">${product.name}</p>
                                        <p class="text-green-600 font-bold text-sm">C$ ${product.price}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            if (stores.length > 0) {
                resultsHTML += `
                    <div class="p-3 border-b border-gray-200">
                        <h4 class="font-bold text-gray-700">Tiendas (${stores.length})</h4>
                    </div>
                    <div class="max-h-48 overflow-y-auto">
                        ${stores.slice(0, 5).map(store => `
                            <div class="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer search-result-item"
                                 onclick="selectSearchResult('store', '${store.id}')">
                                <div class="flex items-center space-x-3">
                                    <img src="${store.image}" alt="${store.name}" class="w-10 h-10 object-cover rounded">
                                    <div class="flex-1">
                                        <p class="font-semibold text-sm">${store.name}</p>
                                        <p class="text-gray-600 text-sm">${store.owner}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        }

        searchResults.innerHTML = resultsHTML;
        searchResults.classList.remove('hidden');
    }

    hideSearchResults() {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.classList.add('hidden');
        }
    }

    filterProducts(category) {
        this.currentCategory = category;
        this.loadProducts();
    }

    loadProducts() {
        const container = document.getElementById('products-container');
        if (!container) return;

        container.innerHTML = '';

        let filteredProducts = this.products;

        if (this.currentCategory !== 'all') {
            filteredProducts = this.products.filter(product => product.category === this.currentCategory);
        }

        if (this.searchTerm) {
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(this.searchTerm) ||
                product.description.toLowerCase().includes(this.searchTerm)
            );
        }

        if (filteredProducts.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500 text-lg">No se encontraron productos</p>
                    <button onclick="clearSearch()" class="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                        Mostrar Todos los Productos
                    </button>
                </div>
            `;
            return;
        }

        filteredProducts.forEach(product => {
            const productElement = this.createProductCard(product);
            container.appendChild(productElement);
        });
    }

    loadStores() {
        const container = document.getElementById('stores-container');
        if (!container) return;

        container.innerHTML = '';

        this.stores.forEach(store => {
            const storeElement = this.createStoreCard(store);
            container.appendChild(storeElement);
        });
    }

    createProductCard(product) {
        const div = document.createElement('div');
        div.className = 'product-card bg-white rounded-xl overflow-hidden shadow-lg animate-slide-up';
        
        const store = this.stores.find(s => s.id === product.storeId);
        
        div.innerHTML = `
            <div class="relative">
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                ${product.originalPrice ? `
                    <div class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
                        -${Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </div>
                ` : ''}
                ${product.featured ? `
                    <div class="absolute top-2 left-2 bg-yellow-400 text-blue-800 px-2 py-1 rounded-lg text-sm font-bold">
                        <i class="fas fa-star mr-1"></i>Destacado
                    </div>
                ` : ''}
            </div>
            <div class="p-4">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-lg text-gray-800">${product.name}</h3>
                    <span class="text-green-600 font-bold">C$ ${product.price}</span>
                </div>
                ${product.originalPrice ? `
                    <div class="text-sm text-gray-500 line-through mb-1">C$ ${product.originalPrice}</div>
                ` : ''}
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">${product.description}</p>
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                        <span class="text-yellow-400 mr-1">
                            <i class="fas fa-star"></i>
                        </span>
                        <span class="text-sm text-gray-600">${product.rating} (${product.reviews})</span>
                    </div>
                    <span class="text-sm text-gray-500 truncate">${store?.name}</span>
                </div>
                <div class="flex space-x-2">
                    <button onclick="addToCart('${product.id}')" 
                            class="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 flex items-center justify-center">
                        <i class="fas fa-cart-plus mr-2"></i>Agregar
                    </button>
                    <button class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition duration-300">
                        <i class="fas fa-heart text-gray-600"></i>
                    </button>
                </div>
            </div>
        `;
        
        return div;
    }

    createStoreCard(store) {
        const div = document.createElement('div');
        div.className = 'store-card rounded-xl overflow-hidden shadow-lg animate-slide-up cursor-pointer';
        div.onclick = () => this.showStoreDetails(store.id);
        
        const storeProducts = this.products.filter(p => p.storeId === store.id);
        
        div.innerHTML = `
            <img src="${store.image}" alt="${store.name}" class="w-full h-48 object-cover">
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-xl text-gray-800">${store.name}</h3>
                    <div class="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded">
                        <i class="fas fa-star mr-1"></i>
                        <span>${store.rating}</span>
                    </div>
                </div>
                <p class="text-gray-600 mb-4 line-clamp-2">${store.description}</p>
                <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span><i class="fas fa-user mr-1"></i>${store.owner}</span>
                    <span><i class="fas fa-box mr-1"></i>${storeProducts.length} productos</span>
                </div>
                <div class="bg-blue-50 p-3 rounded-lg">
                    <p class="text-sm text-blue-700">
                        <i class="fas fa-map-marker-alt mr-1"></i>${store.location}
                    </p>
                </div>
            </div>
        `;
        
        return div;
    }

    showStoreDetails(storeId) {
        const store = this.stores.find(s => s.id === storeId);
        const storeProducts = this.products.filter(p => p.storeId === storeId);
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-90vh overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-start mb-6">
                        <div class="flex items-center space-x-4">
                            <img src="${store.image}" alt="${store.name}" class="w-20 h-20 rounded-xl object-cover">
                            <div>
                                <h2 class="text-2xl font-bold text-gray-800">${store.name}</h2>
                                <p class="text-gray-600">${store.owner}</p>
                                <div class="flex items-center mt-1">
                                    <span class="text-yellow-400 mr-1">
                                        <i class="fas fa-star"></i>
                                    </span>
                                    <span>${store.rating} • ${storeProducts.length} productos</span>
                                </div>
                            </div>
                        </div>
                        <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div class="lg:col-span-2">
                            <h3 class="text-xl font-bold text-gray-800 mb-4">Productos de la Tienda</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${storeProducts.map(product => `
                                    <div class="border border-gray-200 rounded-lg p-4">
                                        <img src="${product.image}" alt="${product.name}" class="w-full h-32 object-cover rounded-lg mb-3">
                                        <h4 class="font-semibold text-gray-800">${product.name}</h4>
                                        <p class="text-green-600 font-bold">C$ ${product.price}</p>
                                        <button onclick="addToCart('${product.id}')" 
                                                class="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition duration-300">
                                            Agregar al Carrito
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="space-y-4">
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h4 class="font-bold text-gray-800 mb-2">Información de la Tienda</h4>
                                <div class="space-y-2 text-sm">
                                    <p><strong>Ubicación:</strong> ${store.location}</p>
                                    <p><strong>Categoría:</strong> ${this.getCategoryName(store.category)}</p>
                                    <p><strong>Miembro desde:</strong> ${new Date(store.joined).toLocaleDateString()}</p>
                                </div>
                            </div>
                            
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h4 class="font-bold text-gray-800 mb-2">Descripción</h4>
                                <p class="text-sm text-gray-600">${store.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    getCategoryName(category) {
        const categories = {
            'artesanias': 'Artesanías',
            'comida': 'Comida Tradicional',
            'textiles': 'Textiles',
            'madera': 'Trabajos en Madera'
        };
        return categories[category] || category;
    }

    getProductsByStore(storeId) {
        return this.products.filter(product => product.storeId === storeId);
    }

    getStoreById(storeId) {
        return this.stores.find(store => store.id === storeId);
    }
}

// Initialize product system
const productSystem = new ProductSystem();

// Global functions
function addToCart(productId) {
    if (!auth.isAuthenticated()) {
        showNotification('Debes iniciar sesión para agregar productos al carrito', 'warning');
        showAuthModal('login');
        return;
    }

    const product = productSystem.products.find(p => p.id === productId);
    if (product) {
        cartSystem.addToCart(product);
        showNotification('Producto agregado al carrito', 'success');
    }
}

function selectSearchResult(type, id) {
    if (type === 'product') {
        // Scroll to products and highlight the product
        document.getElementById('search-input').value = '';
        document.getElementById('mobile-search-input').value = '';
        productSystem.hideSearchResults();
        productSystem.searchTerm = '';
        productSystem.loadProducts();
        
        // You could add smooth scroll to products section here
        document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
    } else if (type === 'store') {
        productSystem.showStoreDetails(id);
        productSystem.hideSearchResults();
    }
}

function clearSearch() {
    productSystem.searchTerm = '';
    productSystem.currentCategory = 'all';
    document.getElementById('search-input').value = '';
    document.getElementById('mobile-search-input').value = '';
    productSystem.hideSearchResults();
    
    // Reset category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active', 'scale-105', 'shadow-lg');
    });
    document.querySelector('[data-category="all"]').classList.add('active', 'scale-105', 'shadow-lg');
    
    productSystem.loadProducts();
}

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('#search-input') && !e.target.closest('#search-results')) {
        productSystem.hideSearchResults();
    }
});