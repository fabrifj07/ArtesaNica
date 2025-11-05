// Renderer reutilizable para mostrar tarjetas de tiendas en diferentes contenedores
(function () {
    function createStoreElement(store) {
        const div = document.createElement('article');
        div.className = 'store-card rounded-xl overflow-hidden shadow-lg animate-slide-up cursor-pointer';
        div.setAttribute('data-store-id', store.id);
        div.tabIndex = 0;

        div.innerHTML = `
            <img src="${store.image}" alt="${escapeHtml(store.name)}" class="w-full h-48 object-cover">
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-xl text-gray-800">${escapeHtml(store.name)}</h3>
                    <div class="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded">
                        <i class="fas fa-star mr-1"></i>
                        <span>${store.rating}</span>
                    </div>
                </div>
                <p class="text-gray-600 mb-4 line-clamp-2">${escapeHtml(store.description)}</p>
                <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span><i class="fas fa-user mr-1"></i>${escapeHtml(store.owner)}</span>
                    <span><i class="fas fa-box mr-1"></i>${(store.products||[]).length} productos</span>
                </div>
                <div class="bg-blue-50 p-3 rounded-lg">
                    <p class="text-sm text-blue-700">
                        <i class="fas fa-map-marker-alt mr-1"></i>${escapeHtml(store.location)}
                    </p>
                </div>
            </div>
        `;

        // Click naviga a la página dedicada de tienda
        div.addEventListener('click', () => {
            window.location.href = `store.html?id=${encodeURIComponent(store.id)}`;
        });

        return div;
    }

    function escapeHtml(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/[&<>"']/g, function (c) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[c];
        });
    }

    window.renderStores = function (containerSelector, options) {
        options = options || {};
        const container = (typeof containerSelector === 'string') ? document.querySelector(containerSelector) : containerSelector;
        if (!container) return;

        // Source of stores: prefer productSystem (if exists), otherwise use shared data
        const storesSource = (window.productSystem && Array.isArray(window.productSystem.stores)) ? window.productSystem.stores : window.artesanicaStores || [];

        let stores = storesSource.slice();
        if (options.featuredOnly) {
            stores = stores.filter(s => s.featured);
        }

        container.innerHTML = '';

        stores.forEach(store => {
            let el = null;
            if (window.productSystem && typeof productSystem.createStoreCard === 'function') {
                // reuse existing generator if available
                try {
                    el = productSystem.createStoreCard(store);
                    el.tabIndex = 0;
                } catch (err) {
                    el = createStoreElement(store);
                }
            } else {
                el = createStoreElement(store);
            }

            if (options.onItemRendered && typeof options.onItemRendered === 'function') {
                options.onItemRendered(el, store);
            }

            container.appendChild(el);
        });

        // If carousel arrows exist, ensure buttons are not disabled incorrectly (app.js has logic)
        if (container.classList.contains('stores-track')) {
            container.dispatchEvent(new Event('scroll'));
        }
    };

})();
