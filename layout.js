// layout.js
// Inserta la barra de navegación y el footer compartidos usados en index.html
(function () {
    function isIndexPage() {
        const p = window.location.pathname;
        return p === '/' || p.endsWith('/index.html') || p.endsWith('index.html');
    }

    function getHref(anchor) {
        // Si estamos en index, usar anclas locales; si no, enlazar a index.html#anchor
        return isIndexPage() ? `#${anchor}` : `index.html#${anchor}`;
    }

    const navHtml = `
    <nav id="navbar" class="bg-gradient-to-r from-blue-600 to-green-600 shadow-lg sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center space-x-4">
                    <a href="${getHref('home')}" class="text-white font-bold text-lg nav-logo">ArtesaNica</a>
                </div>
                <div class="hidden md:flex md:space-x-6 lg:space-x-8 items-center">
                    <a href="${getHref('home')}" class="nav-link text-white">Inicio</a>
                    <a href="${getHref('tiendas')}" class="nav-link text-white">Tiendas</a>
                    <a href="${getHref('productos')}" class="nav-link text-white">Productos</a>
                    <a href="${getHref('vendedores')}" class="nav-link text-white">Ser Vendedor</a>
                    <a href="${getHref('contacto')}" class="nav-link text-white">Contacto</a>
                    <a href="${getHref('nosotros')}" class="nav-link text-white">Nosotros</a>
                </div>
                <div class="flex items-center space-x-3">
                    <button id="cart-btn" class="text-white hover:text-yellow-300 relative" aria-label="Abrir carrito">
                        <i class="fas fa-shopping-cart text-xl"></i>
                        <span id="cart-count" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">0</span>
                    </button>

                    <div id="auth-buttons" class="hidden sm:flex items-center space-x-2">
                        <button onclick="showAuthModal('login')" class="btn btn-slim btn-slim--outline" aria-haspopup="dialog" aria-controls="auth-modal" aria-label="Iniciar sesión">
                            <i class="fas fa-sign-in-alt"></i><span>Iniciar Sesión</span>
                        </button>
                        <button onclick="showAuthModal('register')" class="btn btn-slim btn-slim--accent" aria-haspopup="dialog" aria-controls="auth-modal" aria-label="Registrarse">
                            <i class="fas fa-user-plus"></i><span>Registrarse</span>
                        </button>
                    </div>
                    <button id="mobile-menu-btn" class="md:hidden text-white p-2 rounded-md focus:outline-none" aria-label="Abrir menú" aria-expanded="false">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <div id="mobile-menu-overlay" class="fixed inset-0 z-50 hidden">
        <div id="mobile-menu-panel" class="absolute inset-0 bg-white overflow-auto">
            <div class="px-5 py-6">
                <div class="flex items-center justify-between mb-4">
                    <a href="${getHref('home')}" class="text-lg font-bold">ArtesaNica</a>
                    <button id="mobile-menu-close" class="text-gray-600 p-2 rounded-md" aria-label="Cerrar menú">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <nav class="grid gap-3">
                    <a href="${getHref('home')}" class="py-3 px-3 rounded-md nav-link text-gray-800">Inicio</a>
                    <a href="${getHref('vendedores')}" class="py-3 px-3 rounded-md nav-link text-gray-800">Ser Vendedor</a>
                    <a href="${getHref('contacto')}" class="py-3 px-3 rounded-md nav-link text-gray-800">Contacto</a>
                    <a href="${getHref('nosotros')}" class="py-3 px-3 rounded-md nav-link text-gray-800">Nosotros</a>
                </nav>

                <div class="mt-6">
                    <div class="flex gap-3">
                        <button onclick="showAuthModal('login')" class="btn btn-slim btn-slim--outline w-full">Iniciar Sesión</button>
                        <button onclick="showAuthModal('register')" class="btn btn-slim btn-slim--accent w-full">Registrarse</button>
                    </div>
                    <div class="mt-4 grid gap-2">
                        <a href="${getHref('productos')}" class="py-3 px-3 rounded-md nav-link text-gray-800 border border-gray-100">Productos</a>
                        <a href="${getHref('tiendas')}" class="py-3 px-3 rounded-md nav-link text-gray-800 border border-gray-100">Tiendas</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    const footerHtml = `
    <footer class="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-xl font-bold mb-4">ArtesaNica</h3>
                    <p class="text-blue-100">Mercado digital de los emprendedores de Niquinohomo. Conectamos tradición con innovación.</p>
                </div>
                <div>
                    <h4 class="font-bold mb-4">Enlaces Rápidos</h4>
                    <ul class="space-y-2">
                        <li><a href="${getHref('home')}" class="text-blue-100 hover:text-white transition duration-300">Inicio</a></li>
                        <li><a href="${getHref('tiendas')}" class="text-blue-100 hover:text-white transition duration-300">Tiendas</a></li>
                        <li><a href="${getHref('productos')}" class="text-blue-100 hover:text-white transition duration-300">Productos</a></li>
                        <li><a href="${getHref('vendedores')}" class="text-blue-100 hover:text-white transition duration-300">Ser Vendedor</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-bold mb-4">Soporte</h4>
                    <ul class="space-y-2">
                        <li><a href="${getHref('contacto')}" class="text-blue-100 hover:text-white transition duration-300">Contacto</a></li>
                        <li><a href="#" class="text-blue-100 hover:text-white transition duration-300">Preguntas Frecuentes</a></li>
                        <li><a href="#" class="text-blue-100 hover:text-white transition duration-300">Términos de Servicio</a></li>
                        <li><a href="#" class="text-blue-100 hover:text-white transition duration-300">Política de Privacidad</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-bold mb-4">Síguenos</h4>
                    <div class="flex space-x-4">
                        <a href="#" class="text-blue-100 hover:text-white transition duration-300"><i class="fab fa-facebook text-xl"></i></a>
                        <a href="#" class="text-blue-100 hover:text-white transition duration-300"><i class="fab fa-instagram text-xl"></i></a>
                        <a href="#" class="text-blue-100 hover:text-white transition duration-300"><i class="fab fa-whatsapp text-xl"></i></a>
                    </div>
                </div>
            </div>
            <div class="border-t border-blue-500 mt-8 pt-8 text-center">
                <p>&copy; 2024 ArtesaNica. Todos los derechos reservados. Niquinohomo, Masaya, Nicaragua</p>
            </div>
        </div>
    </footer>
    `;

    function insertLayout() {
        // Insert/replace navbar
        const existingNav = document.getElementById('navbar');
        if (existingNav) {
            // replace
            const temp = document.createElement('div');
            temp.innerHTML = navHtml.trim();
            existingNav.replaceWith(temp.firstElementChild);
        } else {
            // insert at top of body
            const temp = document.createElement('div');
            temp.innerHTML = navHtml.trim();
            document.body.insertBefore(temp.firstElementChild, document.body.firstChild);
        }

        // Insert footer: replace if exists, else append
        const existingFooter = document.querySelector('footer');
        if (existingFooter) {
            const tempF = document.createElement('div');
            tempF.innerHTML = footerHtml.trim();
            existingFooter.replaceWith(tempF.firstElementChild);
        } else {
            const tempF = document.createElement('div');
            tempF.innerHTML = footerHtml.trim();
            document.body.appendChild(tempF.firstElementChild);
        }

        // Ensure cart and invoice modals exist (inject only if absent)
        if (!document.getElementById('cart-overlay')) {
            const cartHtml = `
            <div id="cart-overlay" class="fixed inset-0 bg-black bg-opacity-50 hidden z-40"></div>
            <div id="cart-sidebar" class="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform translate-x-full transition-transform duration-300 z-50">
                <div class="p-6 h-full flex flex-col">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-gray-800">Tu Carrito</h2>
                        <button onclick="hideCart && hideCart()" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <div id="cart-items" class="flex-1 overflow-y-auto">
                        <!-- Cart items will be populated here -->
                    </div>
                    <div class="border-t pt-4">
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-lg font-bold">Total:</span>
                            <span id="cart-total" class="text-lg font-bold text-green-600">C$ 0.00</span>
                        </div>
                        <button onclick="checkout && checkout()" class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300">
                            Procesar Pago
                        </button>
                    </div>
                </div>
            </div>

            <div id="invoice-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-2 invoice-modal">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
                    <div class="p-4">
                        <div id="invoice-content">
                            <!-- Invoice content will be populated here -->
                        </div>
                    </div>
                </div>
            </div>

            <div id="user-profile-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">Mi Perfil</h2>
                            <button onclick="hideUserProfile && hideUserProfile()" class="text-gray-500 hover:text-gray-700">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <div id="user-profile-content">
                            <!-- Profile content will be populated here -->
                        </div>
                    </div>
                </div>
            </div>
            `;

            const tmp = document.createElement('div');
            tmp.innerHTML = cartHtml;
            // append overlays and modals to body
            while (tmp.firstElementChild) {
                document.body.appendChild(tmp.firstElementChild);
            }
        }
    }

    // Export
    window.insertLayout = insertLayout;
    // Auto-insert if the DOM is already parsed
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        try { insertLayout(); } catch (e) { /* ignore */ }
    }

    // Load helper scripts if needed and initialize mobile menu + cart handlers
    function ensureScript(src, globalName, cb) {
        if (globalName && window[globalName]) {
            if (cb) cb();
            return;
        }
        // avoid adding same script twice
        if (document.querySelector(`script[src="${src}"]`)) {
            // wait for it to load
            const s = document.querySelector(`script[src="${src}"]`);
            s.addEventListener('load', () => { if (cb) cb(); });
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        script.onload = () => { if (cb) cb(); };
        document.body.appendChild(script);
    }

    function initHelpers() {
        // mobile menu: prefer existing initMobileMenu, otherwise load mobile-menu.js then init
        if (window.initMobileMenu) {
            try { window.initMobileMenu(); } catch (e) { /* ignore */ }
        } else {
            ensureScript('mobile-menu.js', 'initMobileMenu', () => { try { window.initMobileMenu(); } catch (e) {} });
        }

        // Ensure cart.js is loaded so showCart/hideCart exist
        if (!window.showCart || !window.cartSystem) {
            ensureScript('cart.js', 'cartSystem', () => { /* cart.js loaded */ });
        }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initHelpers, 50);
    } else {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initHelpers, 50));
    }

})();
