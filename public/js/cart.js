// cart.js

// Configuration
const WHATSAPP_PHONE_NUMBER = "76450952";

// Cart System with Invoice Generation and User Order History
class CartSystem {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('artesanica_cart')) || [];
        this.selectedPaymentMethod = null;
        this.init();
    }

    init() {
        this.updateCartUI();
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.product.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                product: product,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.product.id !== productId);
        this.saveCart();
        this.updateCartUI();
        showNotification('Producto removido del carrito', 'info');
    }

    updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const item = this.cart.find(item => item.product.id === productId);
        if (item) {
            item.quantity = quantity;
            this.saveCart();
            this.updateCartUI();
        }
    }

    getTotal() {
        return this.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }

    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    saveCart() {
        localStorage.setItem('artesanica_cart', JSON.stringify(this.cart));
    }

    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        if (!cartCount || !cartItems || !cartTotal) return;

        cartCount.textContent = this.getItemCount();
        cartItems.innerHTML = '';

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500">Tu carrito está vacío</p>
                </div>
            `;
        } else {
            this.cart.forEach(item => {
                const cartItemElement = this.createCartItemElement(item);
                cartItems.appendChild(cartItemElement);
            });
        }

        cartTotal.textContent = `C$ ${this.getTotal().toFixed(2)}`;
    }

    createCartItemElement(item) {
        const div = document.createElement('div');
        div.className = 'flex items-center space-x-4 py-4 border-b border-gray-200';
        
        div.innerHTML = `
            <img src="${item.product.image}" alt="${item.product.name}" class="w-16 h-16 object-cover rounded-lg">
            <div class="flex-1">
                <h4 class="font-semibold text-gray-800">${item.product.name}</h4>
                <p class="text-green-600 font-bold">C$ ${item.product.price}</p>
                <div class="flex items-center space-x-2 mt-2">
                    <button onclick="cartSystem.updateQuantity('${item.product.id}', ${item.quantity - 1})" 
                            class="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300">
                        <i class="fas fa-minus text-xs"></i>
                    </button>
                    <span class="font-semibold">${item.quantity}</span>
                    <button onclick="cartSystem.updateQuantity('${item.product.id}', ${item.quantity + 1})" 
                            class="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300">
                        <i class="fas fa-plus text-xs"></i>
                    </button>
                </div>
            </div>
            <button onclick="cartSystem.removeFromCart('${item.product.id}')" 
                    class="text-red-500 hover:text-red-700">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        return div;
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
    }

    generateInvoice() {
        const user = auth.getCurrentUser();
        const invoice = {
            id: 'INV-' + Date.now().toString().slice(-6),
            date: new Date().toLocaleDateString('es-NI'),
            time: new Date().toLocaleTimeString('es-NI'),
            customer: user ? user.name : 'Cliente',
            items: [...this.cart],
            subtotal: this.getTotal(),
            tax: this.getTotal() * 0.15,
            total: this.getTotal() * 1.15,
            paymentMethod: this.selectedPaymentMethod || 'efectivo',
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        return invoice;
    }

    saveOrderToUserProfile(order) {
        if (!auth.isAuthenticated()) return;
        
        const user = auth.getCurrentUser();
        const users = JSON.parse(localStorage.getItem('artesanica_users')) || [];
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex !== -1) {
            if (!users[userIndex].orders) {
                users[userIndex].orders = [];
            }
            users[userIndex].orders.unshift(order);
            localStorage.setItem('artesanica_users', JSON.stringify(users));
            
            auth.users = users;
            if (auth.currentUser.id === user.id) {
                auth.currentUser = users[userIndex];
                localStorage.setItem('artesanica_current_user', JSON.stringify(users[userIndex]));
            }
        }
    }

    showInvoiceModal() {
        const invoice = this.generateInvoice();
        const modal = document.getElementById('invoice-modal');
        const invoiceContent = document.getElementById('invoice-content');
        
        invoiceContent.innerHTML = `
            <div class="invoice-container bg-white p-4 rounded-lg">
                <div class="text-center mb-4 border-b pb-4">
                    <div class="flex items-center justify-center mb-2">
                        <i class="fas fa-hands-helping text-blue-600 text-2xl mr-2"></i>
                        <h2 class="text-2xl font-bold text-blue-600">ArtesaNica</h2>
                    </div>
                    <p class="text-gray-600 font-semibold text-sm">Factura de Venta</p>
                </div>
                
                <div class="grid grid-cols-2 gap-3 mb-4 bg-gray-50 p-3 rounded-lg text-sm">
                    <div><p class="text-gray-700 font-semibold">Factura:</p><p class="text-blue-600 font-bold">${invoice.id}</p></div>
                    <div><p class="text-gray-700 font-semibold">Fecha:</p><p>${invoice.date}</p></div>
                    <div><p class="text-gray-700 font-semibold">Cliente:</p><p>${invoice.customer}</p></div>
                    <div><p class="text-gray-700 font-semibold">Hora:</p><p>${invoice.time}</p></div>
                </div>
                
                <div class="mb-4">
                    <h3 class="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Detalles del Pedido</h3>
                    <div class="space-y-3 max-h-40 overflow-y-auto">
                        ${invoice.items.map(item => `
                            <div class="flex justify-between items-start border-b pb-2">
                                <div class="flex-1">
                                    <p class="font-semibold text-gray-800 text-sm">${item.product.name}</p>
                                    <p class="text-xs text-gray-600">C$ ${item.product.price} x ${item.quantity}</p>
                                </div>
                                <span class="font-bold text-green-600 text-sm">C$ ${(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-3 mb-4">
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between"><span class="text-gray-700">Subtotal:</span><span class="font-semibold">C$ ${invoice.subtotal.toFixed(2)}</span></div>
                        <div class="flex justify-between"><span class="text-gray-700">IVA (15%):</span><span class="font-semibold">C$ ${invoice.tax.toFixed(2)}</span></div>
                        <div class="flex justify-between text-base font-bold border-t pt-2 mt-2"><span class="text-gray-800">Total:</span><span class="text-green-600">C$ ${invoice.total.toFixed(2)}</span></div>
                    </div>
                </div>
                
                <div class="mb-4">
                    <h3 class="text-lg font-bold text-gray-800 mb-2">Método de Pago</h3>
                    <div class="grid grid-cols-2 gap-3 mb-3">
                        <div class="payment-option border-2 border-gray-300 rounded-lg p-3 cursor-pointer transition-all duration-300" 
                             onclick="selectPaymentMethod(this, 'efectivo')">
                            <div class="flex items-center space-x-2"><i class="fas fa-money-bill-wave text-green-500"></i><span class="font-semibold text-sm">Efectivo</span></div>
                        </div>
                        <div class="payment-option border-2 border-gray-300 rounded-lg p-3 cursor-pointer transition-all duration-300" 
                             onclick="selectPaymentMethod(this, 'tarjeta')">
                            <div class="flex items-center space-x-2"><i class="fas fa-credit-card text-blue-500"></i><span class="font-semibold text-sm">Tarjeta</span></div>
                        </div>
                    </div>
                </div>
                
                <div class="flex space-x-3 mt-4">
                    <button onclick="hideInvoiceModal()" class="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition duration-300 text-sm">Cancelar</button>
                    <button id="pay-button" onclick="processPayment()" 
                            class="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                            disabled>
                        <i class="fab fa-whatsapp mr-2"></i> Pagar
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
        this.selectedPaymentMethod = null;
        updatePayButton();
    }
}

// Initialize cart system
const cartSystem = new CartSystem();

// --- UI Functions ---
function showCart() {
    document.getElementById('cart-sidebar').classList.remove('translate-x-full');
    document.getElementById('cart-overlay').classList.remove('hidden');
}

function hideCart() {
    document.getElementById('cart-sidebar').classList.add('translate-x-full');
    document.getElementById('cart-overlay').classList.add('hidden');
}

function checkout() {
    if (!auth.isAuthenticated()) {
        showNotification('Debes iniciar sesión para realizar una compra', 'warning');
        showAuthModal('login');
        return;
    }

    if (cartSystem.cart.length === 0) {
        showNotification('Tu carrito está vacío', 'warning');
        return;
    }

    cartSystem.showInvoiceModal();
    hideCart();
}

// --- Payment Functions ---
function selectPaymentMethod(element, method) {
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('border-blue-500', 'bg-blue-50');
        option.classList.add('border-gray-300');
    });
    
    element.classList.add('border-blue-500', 'bg-blue-50');
    element.classList.remove('border-gray-300');
    
    cartSystem.selectedPaymentMethod = method;
    updatePayButton();
}

function updatePayButton() {
    const payButton = document.getElementById('pay-button');
    if (!payButton) return;
    
    if (cartSystem.selectedPaymentMethod) {
        payButton.disabled = false;
        payButton.classList.remove('disabled:bg-gray-400', 'disabled:cursor-not-allowed');
    } else {
        payButton.disabled = true;
        payButton.classList.add('disabled:bg-gray-400', 'disabled:cursor-not-allowed');
    }
}

async function processPayment() {
    if (!cartSystem.selectedPaymentMethod) {
        showNotification('Por favor selecciona un método de pago', 'warning');
        return;
    }

    showNotification('Generando factura...', 'info');

    try {
        const invoice = cartSystem.generateInvoice();
        cartSystem.saveOrderToUserProfile(invoice);
        const invoiceImage = await generateInvoiceImage();
        await sendWhatsAppWithInvoice(invoice, invoiceImage);
        
    } catch (error) {
        console.error('Error procesando pago:', error);
        showNotification('Error generando la factura. Se enviará solo el texto.', 'error');
        sendWhatsAppTextOnly();
    }
}

async function generateInvoiceImage() {
    const invoiceElement = document.querySelector('.invoice-container');
    if (!invoiceElement) throw new Error('Contenedor de factura no encontrado');

    const buttons = invoiceElement.querySelectorAll('button');
    const originalDisplay = [];
    buttons.forEach(btn => {
        originalDisplay.push(btn.style.display);
        btn.style.display = 'none';
    });

    const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: invoiceElement.scrollWidth,
        height: invoiceElement.scrollHeight
    });

    buttons.forEach((btn, index) => {
        btn.style.display = originalDisplay[index];
    });

    return canvas.toDataURL('image/jpeg', 0.9);
}

async function sendWhatsAppWithInvoice(invoice, invoiceImage) {
    let message = `¡Hola! Quiero realizar un pedido en ArtesaNica%0A%0A`;
    message += `*Factura:* ${invoice.id}%0A`;
    message += `*Cliente:* ${invoice.customer}%0A`;
    message += `*Fecha:* ${invoice.date}%0A`;
    message += `*Método de Pago:* ${invoice.paymentMethod === 'efectivo' ? 'Efectivo' : 'Tarjeta'}%0A`;
    message += `*Total:* C$ ${invoice.total.toFixed(2)}%0A%0A`;
    message += `Ver detalles en la imagen adjunta.%0A%0A¡Gracias!`;

    downloadInvoiceImage(invoiceImage, `factura-${invoice.id}.jpg`);
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    showNotification('Factura generada. Por favor adjunta la imagen descargada.', 'success');
    
    setTimeout(() => {
        cartSystem.clearCart();
        hideInvoiceModal();
    }, 3000);
}

function downloadInvoiceImage(dataUrl, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function sendWhatsAppTextOnly() {
    const invoice = cartSystem.generateInvoice();
    
    let message = `¡Hola! Quiero realizar un pedido en ArtesaNica%0A%0A`;
    message += `*Factura:* ${invoice.id}%0A`;
    message += `*Cliente:* ${invoice.customer}%0A`;
    message += `*Fecha:* ${invoice.date} ${invoice.time}%0A`;
    message += `*Método de Pago:* ${invoice.paymentMethod === 'efectivo' ? 'Efectivo' : 'Tarjeta'}%0A%0A`;
    
    message += `*Productos:*%0A`;
    invoice.items.forEach(item => {
        message += `• ${item.product.name} (x${item.quantity}) - C$ ${(item.product.price * item.quantity).toFixed(2)}%0A`;
    });
    
    message += `%0A*Resumen de Pago:*%0A`;
    message += `Subtotal: C$ ${invoice.subtotal.toFixed(2)}%0A`;
    message += `IVA (15%): C$ ${invoice.tax.toFixed(2)}%0A`;
    message += `*TOTAL A PAGAR: C$ ${invoice.total.toFixed(2)}*%0A%0A¡Gracias!`;
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    cartSystem.saveOrderToUserProfile(invoice);
    
    setTimeout(() => {
        cartSystem.clearCart();
        hideInvoiceModal();
        showNotification('Pedido enviado por WhatsApp', 'success');
    }, 1000);
}

function hideInvoiceModal() {
    document.getElementById('invoice-modal').classList.add('hidden');
    cartSystem.selectedPaymentMethod = null;
}

// --- User Profile Functions ---
function showUserProfile() {
    if (!auth.isAuthenticated()) {
        showNotification('Debes iniciar sesión para ver tu perfil', 'warning');
        return;
    }

    const user = auth.getCurrentUser();
    const modal = document.getElementById('user-profile-modal');
    const profileContent = document.getElementById('user-profile-content');
    
    const orders = user.orders || [];
    
    profileContent.innerHTML = `
        <div class="space-y-6">
            <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center space-x-4 mb-4">
                    <img src="${user.avatar}" alt="${user.name}" class="w-16 h-16 rounded-full border-2 border-blue-500">
                    <div>
                        <h3 class="text-xl font-bold text-gray-800">${user.name}</h3>
                        <p class="text-gray-600">${user.email}</p>
                        <p class="text-sm text-gray-500">Miembro desde: ${new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
            
            <div>
                <h3 class="text-xl font-bold text-gray-800 mb-4">Mis Pedidos</h3>
                ${orders.length > 0 ? `
                    <div class="space-y-4 max-h-96 overflow-y-auto">
                        ${orders.map(order => `
                            <div class="border border-gray-200 rounded-lg p-4">
                                <div class="flex justify-between items-start mb-2">
                                    <div>
                                        <p class="font-semibold">${order.id}</p>
                                        <p class="text-sm text-gray-600">${order.date} ${order.time}</p>
                                    </div>
                                    <span class="px-2 py-1 text-xs rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">${order.status}</span>
                                </div>
                                <div class="text-sm text-gray-600 mb-2">${order.items.length} productos • C$ ${order.total.toFixed(2)}</div>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-500">${order.paymentMethod}</span>
                                    <button onclick="downloadOrderInvoice('${order.id}')" class="text-blue-600 hover:text-blue-800 text-sm">
                                        <i class="fas fa-download mr-1"></i>Factura
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="text-center py-8 bg-gray-50 rounded-lg">
                        <i class="fas fa-receipt text-4xl text-gray-300 mb-3"></i>
                        <p class="text-gray-500">No tienes pedidos aún</p>
                    </div>
                `}
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function hideUserProfile() {
    document.getElementById('user-profile-modal').classList.add('hidden');
}

// NOTE: This function is a placeholder for future development.
function downloadOrderInvoice(orderId) {
    showNotification('Funcionalidad para descargar facturas antiguas aún en desarrollo.', 'info');
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    const cartBtn = document.getElementById('cart-btn');
    const cartOverlay = document.getElementById('cart-overlay');

    if(cartBtn) cartBtn.addEventListener('click', showCart);
    if(cartOverlay) cartOverlay.addEventListener('click', hideCart);
});
