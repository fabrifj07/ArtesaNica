// Variables globales
let carrito = [];
let favoritos = [];
let productos = [];
let tiendas = [];
let usuario = null; // Almacenará la información del usuario autenticado

// Elementos del DOM
const productosContainer = document.getElementById('productos-container');
const tiendasContainer = document.getElementById('tiendas-container');
const searchInput = document.getElementById('searchInput');
const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileMenu = document.getElementById('mobileMenu');

// Elementos de la barra de navegación inferior
const navInicio = document.getElementById('nav-inicio');
const navBuscar = document.getElementById('nav-buscar');
const navFavoritos = document.getElementById('nav-favoritos');
const navCarrito = document.getElementById('nav-carrito');
const navPerfil = document.getElementById('nav-perfil');
const contadorFavoritos = document.getElementById('contador-favoritos');
const contadorCarrito = document.getElementById('contador-carrito');

// Estado de la aplicación
let currentSection = 'inicio'; // Puede ser: 'inicio', 'buscar', 'favoritos', 'carrito', 'perfil'

// Mover el contenido principal a la sección de inicio
function inicializarSecciones() {
    const seccionInicio = document.getElementById('seccion-inicio');
    const contenidoPrincipal = document.querySelector('main') || document.querySelector('.contenido-principal');
    
    if (contenidoPrincipal && seccionInicio) {
        // Mover todo el contenido principal a la sección de inicio
        while (contenidoPrincipal.firstChild) {
            seccionInicio.appendChild(contenidoPrincipal.firstChild);
        }
    }
    
    // Ocultar todas las secciones excepto la de inicio
    document.querySelectorAll('.seccion-principal').forEach(seccion => {
        if (seccion.id !== 'seccion-inicio') {
            seccion.style.display = 'none';
        } else {
            seccion.style.display = 'block';
        }
    });
}

// Elementos del modal de autenticación
const authModal = document.getElementById('auth-modal');
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginContent = document.getElementById('login-content');
const registerContent = document.getElementById('register-content');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const closeAuthModal = document.getElementById('close-auth-modal');

// Función para mostrar el modal de autenticación
function mostrarModalAutenticacion(tab = 'login') {
    // Mostrar el modal
    authModal.classList.remove('hidden');
    
    // Mostrar la pestaña correspondiente
    if (tab === 'login') {
        loginTab.classList.add('text-primary', 'border-primary');
        loginTab.classList.remove('text-gray-500');
        registerTab.classList.remove('text-primary', 'border-primary');
        registerTab.classList.add('text-gray-500');
        loginContent.classList.remove('hidden');
        registerContent.classList.add('hidden');
    } else {
        registerTab.classList.add('text-primary', 'border-primary');
        registerTab.classList.remove('text-gray-500');
        loginTab.classList.remove('text-primary', 'border-primary');
        loginTab.classList.add('text-gray-500');
        registerContent.classList.remove('hidden');
        loginContent.classList.add('hidden');
    }
}

// Función para ocultar el modal de autenticación
function ocultarModalAutenticacion() {
    authModal.classList.add('hidden');
}

// Función para alternar la visibilidad de la contraseña
function togglePasswordVisibility(inputId, buttonId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = document.getElementById(buttonId);
    
    if (passwordInput && toggleButton) {
        toggleButton.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Cambiar el ícono del botón
            const icon = toggleButton.querySelector('i');
            if (type === 'password') {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    }
}

// Event Listeners para el modal
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar las secciones
    inicializarSecciones();
    
    // Cargar datos
    cargarDatosIniciales();
    
    // Configurar menú móvil
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }
    
    // Inicializar la funcionalidad de mostrar/ocultar contraseña
    togglePasswordVisibility('login-password', 'toggle-login-password');
    togglePasswordVisibility('register-password', 'toggle-register-password');
    togglePasswordVisibility('register-confirm-password', 'toggle-register-confirm-password');
    
    // Configurar búsqueda
    if (searchInput) {
        searchInput.addEventListener('input', filtrarProductos);
    }
    
    // Configurar navegación de escritorio
    configurarNavegacionEscritorio();
    
    // Configurar navegación inferior móvil
    configurarNavegacionInferior();
    
    // Verificar si hay un usuario autenticado
    verificarAutenticacion();
    
    // Mostrar la sección actual
    mostrarSeccion(currentSection);
    
    // Actualizar navegación
    actualizarNavegacion(currentSection);

    // Configurar eventos del modal de autenticación
    if (loginTab && registerTab) {
        // Cambiar entre pestañas de login y registro
        loginTab.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarModalAutenticacion('login');
        });

        registerTab.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarModalAutenticacion('register');
        });
    }

    // Enlaces para cambiar entre login y registro
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarModalAutenticacion('register');
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarModalAutenticacion('login');
        });
    }

    // Cerrar modal
    if (closeAuthModal) {
        closeAuthModal.addEventListener('click', (e) => {
            e.preventDefault();
            ocultarModalAutenticacion();
        });
    }

    // Cerrar modal al hacer clic fuera del contenido
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                ocultarModalAutenticacion();
            }
        });
    }

    // Manejar envío del formulario de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Aquí iría la lógica de autenticación
            iniciarSesion(email, password);
            ocultarModalAutenticacion();
        });
    }

    // Manejar envío del formulario de registro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const phone = document.getElementById('register-phone').value;
            const address = document.getElementById('register-address').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            
            // Validar que las contraseñas coincidan
            if (password !== confirmPassword) {
                mostrarNotificacion('Las contraseñas no coinciden', 'error');
                return;
            }
            
            // Aquí iría la lógica de registro
            // Por ahora, simulamos un registro exitoso
            usuario = {
                id: Date.now().toString(),
                nombre: name,
                email: email,
                telefono: phone,
                direccion: address,
                fechaRegistro: new Date().toISOString()
            };
            
            localStorage.setItem('usuario', JSON.stringify(usuario));
            actualizarVistaPerfil();
            mostrarNotificacion('¡Registro exitoso! Ahora puedes iniciar sesión', 'exito');
            mostrarModalAutenticacion('login');
        });
    }
});

// Funciones
function cargarDatosIniciales() {
    // Cargar productos
    if (window.productosData) {
        productos = window.productosData;
        mostrarProductos(productos);
    }
    
    // Cargar tiendas
    if (window.tiendasData) {
        tiendas = window.tiendasData;
        mostrarTiendas(tiendas);
    }
    
    // Cargar carrito y favoritos del localStorage
    cargarCarrito();
    cargarFavoritos();
}

function mostrarProductos(productosAMostrar) {
    if (!productosContainer) return;
    
    productosContainer.innerHTML = '';
    
    if (productosAMostrar.length === 0) {
        productosContainer.innerHTML = '<p class="col-span-full text-center text-gray-500">No se encontraron productos.</p>';
        return;
    }
    
    productosAMostrar.forEach(producto => {
        const productoElement = document.createElement('div');
        productoElement.className = 'bg-white rounded-lg overflow-hidden shadow-md product-card transition duration-300';
        productoElement.innerHTML = `
            <div class="relative">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="w-full h-48 object-cover">
                <button class="absolute top-2 right-2 bg-white rounded-full p-2 text-gray-700 hover:text-red-500" 
                        onclick="toggleFavorito('${producto.id}')">
                    <i class="${favoritos.includes(producto.id) ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
            <div class="p-4">
                <h3 class="font-semibold text-lg mb-1">${producto.nombre}</h3>
                <p class="text-gray-600 text-sm mb-2">${producto.tienda.nombre}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-primary">$${producto.precio.toFixed(2)}</span>
                    <button class="bg-primary text-white px-3 py-1 rounded-full text-sm hover:bg-green-600 transition"
                            onclick="agregarAlCarrito('${producto.id}')">
                        Agregar
                    </button>
                </div>
            </div>
        `;
        productosContainer.appendChild(productoElement);
    });
}

function mostrarTiendas(tiendasAMostrar) {
    if (!tiendasContainer) return;
    
    tiendasContainer.innerHTML = '';
    
    tiendasAMostrar.forEach(tienda => {
        const tiendaElement = document.createElement('div');
        tiendaElement.className = 'bg-white rounded-lg overflow-hidden shadow-md';
        tiendaElement.innerHTML = `
            <img src="${tienda.imagen}" alt="${tienda.nombre}" class="w-full h-40 object-cover">
            <div class="p-4">
                <h3 class="font-semibold text-lg mb-1">${tienda.nombre}</h3>
                <div class="flex items-center text-gray-600 text-sm mb-2">
                    <i class="fas fa-map-marker-alt mr-1"></i>
                    <span>${tienda.ubicacion}</span>
                </div>
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">${tienda.descripcion}</p>
                <div class="flex justify-between items-center">
                    <div class="flex text-yellow-400 text-sm">
                        ${generarEstrellas(tienda.calificacion)}
                        <span class="text-gray-600 ml-1">(${tienda.resenas})</span>
                    </div>
                    <a href="#" class="text-primary text-sm font-medium hover:underline">Ver tienda</a>
                </div>
            </div>
        `;
        tiendasContainer.appendChild(tiendaElement);
    });
}

function generarEstrellas(puntuacion) {
    let estrellas = '';
    const estrellasLlenas = Math.floor(puntuacion);
    const tieneMediaEstrella = puntuacion % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= estrellasLlenas) {
            estrellas += '<i class="fas fa-star"></i>';
        } else if (i === estrellasLlenas + 1 && tieneMediaEstrella) {
            estrellas += '<i class="fas fa-star-half-alt"></i>';
        } else {
            estrellas += '<i class="far fa-star"></i>';
        }
    }
    
    return estrellas;
}

function filtrarProductos() {
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm.length === 0) {
        mostrarProductos(productos);
        return;
    }
    
    const productosFiltrados = productos.filter(producto => 
        producto.nombre.toLowerCase().includes(searchTerm) ||
        producto.descripcion.toLowerCase().includes(searchTerm) ||
        producto.categoria.toLowerCase().includes(searchTerm) ||
        producto.tienda.nombre.toLowerCase().includes(searchTerm)
    );
    
    mostrarProductos(productosFiltrados);
}

function toggleMobileMenu() {
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

// Funciones del carrito
function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;
    
    const itemExistente = carrito.find(item => item.producto.id === productoId);
    
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({
            producto: producto,
            cantidad: 1
        });
    }
    
    guardarCarrito();
    mostrarNotificacion(`"${producto.nombre}" se ha añadido al carrito`);
    actualizarContadorCarrito();
}

function quitarDelCarrito(productoId) {
    const index = carrito.findIndex(item => item.producto.id === productoId);
    
    if (index !== -1) {
        const item = carrito[index];
        
        if (item.cantidad > 1) {
            item.cantidad -= 1;
        } else {
            carrito.splice(index, 1);
        }
        
        guardarCarrito();
        actualizarContadorCarrito();
    }
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    actualizarContadorCarrito();
}

function guardarCarrito() {
    try {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    } catch (error) {
        console.error('Error al guardar el carrito:', error);
    }
}

function cargarCarrito() {
    try {
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
            actualizarContadorCarrito();
        }
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
    }
}

function actualizarContadorCarrito() {
    const contadores = document.querySelectorAll('#contador-carrito, .contador-carrito');
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    
    contadores.forEach(contador => {
        if (contador) {
            contador.textContent = totalItems;
            contador.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    });
}

// Funciones de favoritos
function toggleFavorito(productoId) {
    const index = favoritos.indexOf(productoId);
    
    if (index === -1) {
        favoritos.push(productoId);
    } else {
        favoritos.splice(index, 1);
    }
    
    guardarFavoritos();
    actualizarContadorFavoritos();
    
    // Actualizar el ícono del corazón
    const botonFavorito = document.querySelector(`[onclick="toggleFavorito('${productoId}')"] i`);
    if (botonFavorito) {
        if (index === -1) {
            botonFavorito.classList.remove('far');
            botonFavorito.classList.add('fas', 'text-red-500');
            mostrarNotificacion('Producto añadido a favoritos');
        } else {
            botonFavorito.classList.remove('fas', 'text-red-500');
            botonFavorito.classList.add('far');
            mostrarNotificacion('Producto eliminado de favoritos');
        }
    }
}

function guardarFavoritos() {
    try {
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
    } catch (error) {
        console.error('Error al guardar favoritos:', error);
    }
}

function cargarFavoritos() {
    try {
        const favoritosGuardados = localStorage.getItem('favoritos');
        if (favoritosGuardados) {
            favoritos = JSON.parse(favoritosGuardados);
            actualizarContadorFavoritos();
        }
    } catch (error) {
        console.error('Error al cargar favoritos:', error);
    }
}

function actualizarContadorFavoritos() {
    const contadores = document.querySelectorAll('#contador-favoritos, .contador-favoritos');
    contadores.forEach(contador => {
        if (contador) {
            contador.textContent = favoritos.length;
            contador.style.display = favoritos.length > 0 ? 'flex' : 'none';
        }
    });
}

// Autenticación
function verificarAutenticacion() {
    // Si ya tenemos el usuario en memoria, retornar true
    if (usuario && usuario.id) {
        return true;
    }
    
    // Si no está en memoria, verificar en localStorage
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
        try {
            const usuarioParseado = JSON.parse(usuarioGuardado);
            // Verificar que el usuario tenga los campos mínimos requeridos
            if (usuarioParseado && usuarioParseado.id && usuarioParseado.email) {
                usuario = usuarioParseado;
                actualizarVistaPerfil();
                return true;
            }
        } catch (e) {
            console.error('Error al parsear datos de usuario:', e);
            localStorage.removeItem('usuario');
        }
    }
    
    // Si llegamos aquí, no hay usuario autenticado
    return false;
}

function iniciarSesion(email, contrasena) {
    // Aquí iría la lógica para autenticar con el servidor
    // Por ahora, simulamos un inicio de sesión exitoso
    usuario = {
        id: '1',
        nombre: 'Usuario de Prueba',
        email: email,
        telefono: '1234-5678',
        direccion: 'Niquinohomo, Masaya, Nicaragua',
        fechaRegistro: new Date().toISOString()
    };
    
    localStorage.setItem('usuario', JSON.stringify(usuario));
    actualizarVistaPerfil();
    mostrarNotificacion('¡Bienvenido de nuevo!');
    mostrarSeccion('inicio');
}

function cerrarSesion() {
    usuario = null;
    localStorage.removeItem('usuario');
    actualizarVistaPerfil();
    mostrarNotificacion('Has cerrado sesión correctamente');
    mostrarSeccion('inicio');
}

// Función para formatear la fecha
function formatearFecha(fechaISO) {
    if (!fechaISO) return 'No disponible';
    const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(fechaISO).toLocaleDateString('es-ES', opciones);
}

// Función para generar el historial de compras
function generarHistorialCompras() {
    // Datos de ejemplo para el historial de compras
    const historial = [
        { id: 1, fecha: '2023-11-01T14:30:00', total: 150.00, estado: 'Completado', productos: ['Collar de plata', 'Pulsera de hilo'] },
        { id: 2, fecha: '2023-10-15T10:15:00', total: 89.99, estado: 'Enviado', productos: ['Anillo de oro'] },
        { id: 3, fecha: '2023-09-20T16:45:00', total: 120.50, estado: 'Entregado', productos: ['Aretes de perlas', 'Dije de plata'] }
    ];

    return historial.map(compra => `
        <div class="border-b border-gray-200 py-4">
            <div class="flex justify-between items-center mb-2">
                <div>
                    <h4 class="font-medium">Pedido #${compra.id}</h4>
                    <p class="text-sm text-gray-500">${formatearFecha(compra.fecha)}</p>
                </div>
                <span class="px-3 py-1 text-xs rounded-full ${
                    compra.estado === 'Completado' ? 'bg-green-100 text-green-800' :
                    compra.estado === 'Enviado' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                }">
                    ${compra.estado}
                </span>
            </div>
            <p class="text-sm text-gray-700 mb-2">${compra.productos.join(', ')}</p>
            <p class="text-right font-medium">Total: $${compra.total.toFixed(2)}</p>
        </div>
    `).join('');
}

// Función para formatear la fecha
function formatearFecha(fechaISO) {
    if (!fechaISO) return 'No disponible';
    const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(fechaISO).toLocaleDateString('es-ES', opciones);
}

// Función para generar el historial de compras
function generarHistorialCompras() {
    // Datos de ejemplo para el historial de compras
    const historial = [
        { id: 1, fecha: '2023-11-01T14:30:00', total: 150.00, estado: 'Completado', productos: ['Collar de plata', 'Pulsera de hilo'] },
        { id: 2, fecha: '2023-10-15T10:15:00', total: 89.99, estado: 'Enviado', productos: ['Anillo de oro'] },
        { id: 3, fecha: '2023-09-20T16:45:00', total: 120.50, estado: 'Entregado', productos: ['Aretes de perlas', 'Dije de plata'] }
    ];

    return historial.map(compra => `
        <div class="border-b border-gray-200 py-4">
            <div class="flex justify-between items-center mb-2">
                <div>
                    <h4 class="font-medium">Pedido #${compra.id}</h4>
                    <p class="text-sm text-gray-500">${formatearFecha(compra.fecha)}</p>
                </div>
                <span class="px-3 py-1 text-xs rounded-full ${
                    compra.estado === 'Completado' ? 'bg-green-100 text-green-800' :
                    compra.estado === 'Enviado' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                }">
                    ${compra.estado}
                </span>
            </div>
            <p class="text-sm text-gray-700 mb-2">${compra.productos.join(', ')}</p>
            <p class="text-right font-medium">Total: $${compra.total.toFixed(2)}</p>
        </div>
    `).join('');
}

function actualizarVistaPerfil() {
    const perfilContainer = document.getElementById('seccion-perfil');
    if (!perfilContainer) return;
    
    if (usuario) {
        // Usuario autenticado
        perfilContainer.innerHTML = `
            <div class="container mx-auto px-4 py-8 max-w-4xl">
                <!-- Información del perfil -->
                <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div class="w-32 h-32 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                            <i class="fas fa-user text-4xl text-primary"></i>
                        </div>
                        <div class="flex-1 text-center md:text-left">
                            <h2 class="text-2xl font-bold text-gray-800">${usuario.nombre || 'Usuario'}</h2>
                            <p class="text-gray-600 mb-4">${usuario.email || ''}</p>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div class="bg-gray-50 p-3 rounded-lg">
                                    <p class="text-sm text-gray-500">Teléfono</p>
                                    <p class="font-medium">${usuario.telefono || 'No especificado'}</p>
                                </div>
                                <div class="bg-gray-50 p-3 rounded-lg">
                                    <p class="text-sm text-gray-500">Miembro desde</p>
                                    <p class="font-medium">${usuario.fechaRegistro ? formatearFecha(usuario.fechaRegistro) : 'No disponible'}</p>
                                </div>
                                <div class="bg-gray-50 p-3 rounded-lg md:col-span-2">
                                    <p class="text-sm text-gray-500">Dirección</p>
                                    <p class="font-medium">${usuario.direccion || 'No especificada'}</p>
                                </div>
                            </div>
                            
                            <div class="mt-6 flex flex-col sm:flex-row gap-3">
                                <button onclick="mostrarModalAutenticacion('editar')" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-600 transition flex-1">
                                    <i class="fas fa-edit mr-2"></i> Editar perfil
                                </button>
                                <button onclick="cerrarSesion()" class="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition flex-1">
                                    <i class="fas fa-sign-out-alt mr-2"></i> Cerrar sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Historial de compras -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-bold text-gray-800">Historial de compras</h3>
                        <span class="text-sm text-gray-500">3 pedidos</span>
                    </div>
                    
                    <div id="historial-compras" class="space-y-4">
                        ${generarHistorialCompras()}
                    </div>
                    
                    <div class="mt-6 text-center">
                        <button class="text-primary hover:underline flex items-center justify-center mx-auto">
                            Ver historial completo <i class="fas fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </div>
                        <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                            <i class="fas fa-calendar-alt text-gray-500 w-6"></i>
                            <span class="ml-3">Miembro desde ${new Date(usuario.fechaRegistro).toLocaleDateString()}</span>
                        </div>
                    </div>
                    
                    <div class="border-t border-gray-200 pt-4">
                        <button onclick="mostrarSeccion('mis-pedidos')" class="w-full flex items-center justify-between py-2 px-3 text-left hover:bg-gray-50 rounded-lg">
                            <span><i class="fas fa-box-open text-gray-500 mr-3"></i> Mis pedidos</span>
                            <i class="fas fa-chevron-right text-gray-400"></i>
                        </button>
                        <button onclick="mostrarSeccion('direcciones')" class="w-full flex items-center justify-between py-2 px-3 text-left hover:bg-gray-50 rounded-lg">
                            <span><i class="fas fa-map-marked-alt text-gray-500 mr-3"></i> Mis direcciones</span>
                            <i class="fas fa-chevron-right text-gray-400"></i>
                        </button>
                        <button onclick="mostrarSeccion('configuracion')" class="w-full flex items-center justify-between py-2 px-3 text-left hover:bg-gray-50 rounded-lg">
                            <span><i class="fas fa-cog text-gray-500 mr-3"></i> Configuración</span>
                            <i class="fas fa-chevron-right text-gray-400"></i>
                        </button>
                    </div>
                    
                    <div class="mt-6">
                        <button onclick="cerrarSesion()" class="w-full py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition">
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        // Formulario de inicio de sesión
        perfilContainer.innerHTML = `
            <div class="container mx-auto px-4 py-8">
                <div class="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
                    <div class="text-center mb-6">
                        <div class="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                            <i class="fas fa-user text-4xl text-gray-400 mt-5"></i>
                        </div>
                        <h2 class="text-xl font-semibold">Iniciar sesión</h2>
                        <p class="text-gray-500 text-sm">Ingresa tus datos para continuar</p>
                    </div>
                    
                    <form id="formulario-login" class="space-y-4">
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                            <input type="email" id="email" required
                                   class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                        </div>
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                            <input type="password" id="password" required
                                   class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                        </div>
                        <div class="text-right">
                            <a href="#" class="text-sm text-primary hover:underline">¿Olvidaste tu contraseña?</a>
                        </div>
                        <button type="submit" class="w-full bg-primary text-white py-2 rounded-md font-medium hover:bg-green-600 transition">
                            Iniciar sesión
                        </button>
                    </form>
                    
                    <div class="mt-4 text-center">
                        <p class="text-sm text-gray-600">¿No tienes una cuenta? <a href="#" onclick="mostrarRegistro()" class="text-primary font-medium hover:underline">Regístrate</a></p>
                    </div>
                    
                    <div class="mt-6 pt-4 border-t border-gray-200">
                        <p class="text-sm text-gray-500 text-center mb-3">O inicia sesión con</p>
                        <div class="grid grid-cols-2 gap-3">
                            <button class="flex items-center justify-center py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                <i class="fab fa-google text-red-500 mr-2"></i>
                                <span>Google</span>
                            </button>
                            <button class="flex items-center justify-center py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                <i class="fab fa-facebook-f text-blue-600 mr-2"></i>
                                <span>Facebook</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Configurar el formulario de inicio de sesión
        const formularioLogin = document.getElementById('formulario-login');
        if (formularioLogin) {
            formularioLogin.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                if (email && password) {
                    if (iniciarSesion(email, password)) {
                        mostrarSeccion('inicio');
                    }
                }
            });
        }
    }
}

// Mostrar formulario de registro
function mostrarRegistro() {
    const perfilContainer = document.getElementById('seccion-perfil');
    if (!perfilContainer) return;
    
    perfilContainer.innerHTML = `
        <div class="container mx-auto px-4 py-8">
            <div class="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
                <div class="text-center mb-6">
                    <h2 class="text-xl font-semibold">Crear cuenta</h2>
                    <p class="text-gray-500 text-sm">Regístrate para una mejor experiencia</p>
                </div>
                
                <form id="formulario-registro" class="space-y-4">
                    <div>
                        <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                        <input type="text" id="nombre" required
                               class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    </div>
                    <div>
                        <label for="email-registro" class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                        <input type="email" id="email-registro" required
                               class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    </div>
                    <div>
                        <label for="telefono" class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input type="tel" id="telefono"
                               class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    </div>
                    <div>
                        <label for="direccion" class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                        <textarea id="direccion" rows="2"
                                 class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"></textarea>
                    </div>
                    <div>
                        <label for="password-registro" class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <input type="password" id="password-registro" required
                               class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    </div>
                    <div>
                        <label for="confirmar-password" class="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
                        <input type="password" id="confirmar-password" required
                               class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    </div>
                    <div class="flex items-start">
                        <input type="checkbox" id="terminos" required
                               class="mt-1 mr-2 rounded border-gray-300 text-primary focus:ring-primary">
                        <label for="terminos" class="text-sm text-gray-600">Acepto los <a href="#" class="text-primary hover:underline">Términos y condiciones</a> y la <a href="#" class="text-primary hover:underline">Política de privacidad</a></label>
                    </div>
                    <button type="submit" class="w-full bg-primary text-white py-2 rounded-md font-medium hover:bg-green-600 transition">
                        Registrarme
                    </button>
                </form>
                
                <div class="mt-4 text-center">
                    <p class="text-sm text-gray-600">¿Ya tienes una cuenta? <a href="#" onclick="actualizarVistaPerfil()" class="text-primary font-medium hover:underline">Inicia sesión</a></p>
                </div>
            </div>
        </div>
    `;
    
    // Configurar el formulario de registro
    const formularioRegistro = document.getElementById('formulario-registro');
    if (formularioRegistro) {
        formularioRegistro.addEventListener('submit', function(e) {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email-registro').value;
            const telefono = document.getElementById('telefono').value;
            const direccion = document.getElementById('direccion').value;
            const password = document.getElementById('password-registro').value;
            const confirmarPassword = document.getElementById('confirmar-password').value;
            
            if (password !== confirmarPassword) {
                mostrarNotificacion('Las contraseñas no coinciden', 'error');
                return;
            }
            
            // Aquí iría la lógica para registrar al usuario en el servidor
            // Por ahora, simulamos un registro exitoso
            usuario = {
                id: '1',
                nombre: nombre,
                email: email,
                telefono: telefono,
                direccion: direccion,
                fechaRegistro: new Date().toISOString()
            };
            
            localStorage.setItem('usuario', JSON.stringify(usuario));
            actualizarVistaPerfil();
            mostrarNotificacion('¡Bienvenido a Artesanica!');
            mostrarSeccion('inicio');
        });
    }
}

// Utilidades
function mostrarNotificacion(mensaje, tipo = 'exito') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    const tipos = {
        exito: 'bg-green-100 border-green-500 text-green-700',
        error: 'bg-red-100 border-red-500 text-red-700',
        info: 'bg-blue-100 border-blue-500 text-blue-700',
        advertencia: 'bg-yellow-100 border-yellow-500 text-yellow-700'
    };
    
    notificacion.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg border-l-4 ${tipos[tipo] || tipos.info} shadow-lg z-50 max-w-sm`;
    notificacion.textContent = mensaje;
    
    // Agregar a la página
    document.body.appendChild(notificacion);
    
    // Eliminar después de 5 segundos
    setTimeout(() => {
        notificacion.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => {
            if (notificacion.parentNode) {
                document.body.removeChild(notificacion);
            }
        }, 500);
    }, 5000);
}

// Funciones de navegación
function configurarNavegacionInferior() {
    // Obtener elementos de navegación
    const navInicio = document.getElementById('nav-inicio');
    const navBuscar = document.getElementById('nav-buscar');
    const navFavoritos = document.getElementById('nav-favoritos');
    const navCarrito = document.getElementById('nav-carrito');
    const navPerfil = document.getElementById('nav-perfil');

    // Función para manejar la navegación
    const navegarA = (seccion) => {
        // Si es la sección de perfil, mostrarla directamente sin verificar autenticación
        if (seccion === 'perfil') {
            mostrarSeccion('perfil');
            actualizarNavegacion('perfil');
            return;
        }
        
        // Para otras secciones que requieren autenticación
        if ((seccion === 'favoritos' || seccion === 'carrito') && !verificarAutenticacion()) {
            mostrarNotificacion('Por favor inicia sesión para continuar', 'info');
            mostrarSeccion('perfil');
            actualizarNavegacion('perfil');
            return;
        }
        
        mostrarSeccion(seccion);
        actualizarNavegacion(seccion);
    };

    // Configurar eventos de clic
    if (navInicio) {
        navInicio.addEventListener('click', (e) => {
            e.preventDefault();
            navegarA('inicio');
        });
    }

    if (navBuscar) {
        navBuscar.addEventListener('click', (e) => {
            e.preventDefault();
            navegarA('buscar');
        });
    }

    if (navFavoritos) {
        navFavoritos.addEventListener('click', (e) => {
            e.preventDefault();
            navegarA('favoritos');
        });
    }

    if (navCarrito) {
        navCarrito.addEventListener('click', (e) => {
            e.preventDefault();
            navegarA('carrito');
        });
    }

    if (navPerfil) {
        navPerfil.addEventListener('click', (e) => {
            e.preventDefault();
            // Mostrar el modal de autenticación en lugar de la sección de perfil
            if (usuario) {
                // Si el usuario está autenticado, mostrar el perfil
                mostrarSeccion('perfil');
                actualizarNavegacion('perfil');
            } else {
                // Si no está autenticado, mostrar el modal de autenticación
                mostrarModalAutenticacion('login');
            }
        });
    }
}

function mostrarSeccion(seccion) {
    console.log(`Mostrando sección: ${seccion}`);
    
    // Obtener todas las secciones
    const secciones = document.querySelectorAll('.seccion-principal');
    
    // Ocultar todas las secciones con transición
    secciones.forEach(s => {
        if (!s.classList.contains('hidden')) {
            s.style.opacity = '0';
            setTimeout(() => {
                s.classList.add('hidden');
            }, 200);
        }
    });
    
    // Mostrar la sección seleccionada con transición
    const seccionAMostrar = document.getElementById(`seccion-${seccion}`);
    if (seccionAMostrar) {
        console.log(`Sección encontrada: seccion-${seccion}`);
        seccionAMostrar.classList.remove('hidden');
        // Forzar un reflow para que la transición funcione
        void seccionAMostrar.offsetWidth;
        seccionAMostrar.style.opacity = '1';
        
        // Desplazar al inicio de la página
        window.scrollTo(0, 0);
    } else {
        console.error(`No se encontró la sección: seccion-${seccion}`);
    }
    
    // Actualizar el estado actual
    currentSection = seccion;
    
    // Actualizar la navegación
    actualizarNavegacion(seccion);
    
    // Ejecutar acciones específicas de cada sección
    switch(seccion) {
        case 'favoritos':
            actualizarContadorFavoritos();
            cargarFavoritosVista();
            break;
        case 'carrito':
            actualizarContadorCarrito();
            cargarCarritoVista();
            break;
        case 'buscar':
            const buscarInput = document.getElementById('buscar-productos');
            if (buscarInput) buscarInput.focus();
            break;
        case 'perfil':
            // Asegurarse de que la vista del perfil esté actualizada
            actualizarVistaPerfil();
            break;
    }
}

function actualizarNavegacion(seccionActiva) {
    // Remover la clase activa de todos los elementos de navegación
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('text-primary');
        item.classList.add('text-gray-600');
    });
    
    // Agregar la clase activa al elemento seleccionado
    const elementoActivo = document.getElementById(`nav-${seccionActiva}`);
    if (elementoActivo) {
        elementoActivo.classList.remove('text-gray-600');
        elementoActivo.classList.add('text-primary');
    }
}

// Funciones para cargar las vistas
function cargarFavoritosVista() {
    const listaFavoritos = document.getElementById('lista-favoritos');
    if (!listaFavoritos) return;
    
    if (favoritos.length === 0) {
        listaFavoritos.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-heart text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">Aún no tienes productos en favoritos</p>
            </div>
        `;
        return;
    }
    
    // Aquí iría la lógica para mostrar los productos favoritos
    // Por ahora, mostramos un mensaje temporal
    listaFavoritos.innerHTML = `
        <div class="col-span-full">
            <p class="text-center py-8">Cargando tus productos favoritos...</p>
        </div>
    `;
}

function cargarCarritoVista() {
    const contenidoCarrito = document.getElementById('contenido-carrito');
    const resumenCarrito = document.getElementById('resumen-carrito');
    
    if (!contenidoCarrito) return;
    
    if (carrito.length === 0) {
        contenidoCarrito.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">Tu carrito está vacío</p>
                <a href="#" class="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-full hover:bg-green-600 transition"
                   onclick="event.preventDefault(); mostrarSeccion('inicio'); actualizarNavegacion('inicio');">
                    Seguir comprando
                </a>
            </div>
        `;
        if (resumenCarrito) resumenCarrito.classList.add('hidden');
    } else {
        // Aquí iría la lógica para mostrar los productos del carrito
        // Por ahora, mostramos un mensaje temporal
        contenidoCarrito.innerHTML = `
            <div class="text-center py-8">
                <p>Cargando tu carrito de compras...</p>
            </div>
        `;
        if (resumenCarrito) resumenCarrito.classList.remove('hidden');
    }
}

// Función para actualizar la cantidad de un producto en el carrito
function actualizarCantidadCarrito(productoId, nuevaCantidad) {
    if (nuevaCantidad < 1) {
        quitarDelCarrito(productoId);
        return;
    }
    
    const itemIndex = carrito.findIndex(item => item.productoId === productoId);
    if (itemIndex !== -1) {
        carrito[itemIndex].cantidad = nuevaCantidad;
        guardarCarrito();
        actualizarContadorCarrito();
        cargarCarritoVista();
    }
}

// Configurar navegación de escritorio
function configurarNavegacionEscritorio() {
    // Elementos de la barra de navegación de escritorio
    const desktopPerfil = document.getElementById('desktop-perfil');
    const desktopFavoritos = document.getElementById('desktop-favoritos');
    const desktopCarrito = document.getElementById('desktop-carrito');
    const desktopBuscar = document.querySelector('.search-bar input[type="text"]');

    // Configurar eventos de clic para escritorio
    if (desktopPerfil) {
        desktopPerfil.addEventListener('click', (e) => {
            e.preventDefault();
            if (usuario) {
                // Si el usuario está autenticado, mostrar el perfil
                mostrarSeccion('perfil');
                actualizarNavegacion('perfil');
            } else {
                // Si no está autenticado, mostrar el modal de autenticación
                mostrarModalAutenticacion('login');
            }
        });
    }

    if (desktopFavoritos) {
        desktopFavoritos.addEventListener('click', (e) => {
            e.preventDefault();
            if (verificarAutenticacion()) {
                mostrarSeccion('favoritos');
                actualizarNavegacion('favoritos');
            }
        });
    }

    if (desktopCarrito) {
        desktopCarrito.addEventListener('click', (e) => {
            e.preventDefault();
            if (verificarAutenticacion()) {
                mostrarSeccion('carrito');
                actualizarNavegacion('carrito');
            }
        });
    }

    // Configurar búsqueda en escritorio
    if (desktopBuscar) {
        desktopBuscar.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    filtrarProductos();
                    mostrarSeccion('buscar');
                    actualizarNavegacion('buscar');
                }
            }
        });
    }
}

// Hacer funciones accesibles globalmente
window.agregarAlCarrito = agregarAlCarrito;
window.toggleFavorito = toggleFavorito;
window.mostrarSeccion = mostrarSeccion;
window.actualizarVistaPerfil = actualizarVistaPerfil;
window.mostrarRegistro = mostrarRegistro;
window.cerrarSesion = cerrarSesion;
