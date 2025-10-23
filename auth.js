// Authentication System with User Profile
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('artesanica_users')) || [];
        this.init();
    }

    init() {
        // Check if user is logged in
        const savedUser = localStorage.getItem('artesanica_current_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUI();
        }

        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        // Register form
        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.register();
        });
    }

    login() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('artesanica_current_user', JSON.stringify(user));
            this.updateUI();
            hideAuthModal();
            showNotification('¡Bienvenido de vuelta!', 'success');
        } else {
            showNotification('Credenciales incorrectas', 'error');
        }
    }

    register() {
        const formData = {
            name: document.getElementById('register-name').value,
            email: document.getElementById('register-email').value,
            phone: document.getElementById('register-phone').value,
            role: 'buyer',
            password: document.getElementById('register-password').value,
            confirmPassword: document.getElementById('register-confirm').value
        };

        // Validation
        if (formData.password !== formData.confirmPassword) {
            showNotification('Las contraseñas no coinciden', 'error');
            return;
        }

        if (this.users.find(u => u.email === formData.email)) {
            showNotification('Este email ya está registrado', 'error');
            return;
        }

        // Create user object
        const newUser = {
            id: Date.now().toString(),
            ...formData,
            createdAt: new Date().toISOString(),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=0067C0&color=fff`,
            orders: []
        };

        // Remove confirmPassword from stored data
        delete newUser.confirmPassword;

        this.users.push(newUser);
        localStorage.setItem('artesanica_users', JSON.stringify(this.users));

        // Auto login
        this.currentUser = newUser;
        localStorage.setItem('artesanica_current_user', JSON.stringify(newUser));
        
        this.updateUI();
        hideAuthModal();
        showNotification('¡Registro exitoso!', 'success');
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('artesanica_current_user');
        this.updateUI();
        hideUserProfile();
        showNotification('Sesión cerrada', 'info');
    }

    updateUI() {
        const authButtons = document.getElementById('auth-buttons');
        const userMenu = document.getElementById('user-menu');
        const cartBtn = document.getElementById('cart-btn');
        const userName = document.getElementById('user-name');
        const userAvatar = document.getElementById('user-avatar');

        if (this.currentUser) {
            authButtons.classList.add('hidden');
            userMenu.classList.remove('hidden');
            cartBtn.classList.remove('hidden');
            
            userName.textContent = this.currentUser.name;
            userAvatar.src = this.currentUser.avatar;
        } else {
            authButtons.classList.remove('hidden');
            userMenu.classList.add('hidden');
            cartBtn.classList.add('hidden');
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    isSeller() {
        return this.currentUser && this.currentUser.role === 'seller';
    }

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }
}

// Initialize auth system
const auth = new AuthSystem();

// Auth Modal Functions
function showAuthModal(type) {
    const modal = document.getElementById('auth-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authTitle = document.getElementById('auth-title');

    modal.classList.remove('hidden');
    
    if (type === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        authTitle.textContent = 'Iniciar Sesión';
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        authTitle.textContent = 'Registrarse';
    }
}

function hideAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
    document.getElementById('login-form').reset();
    document.getElementById('register-form').reset();
}

function logout() {
    auth.logout();
}

// User Profile Functions
function showUserProfile() {
    if (!auth.isAuthenticated()) {
        showNotification('Debes iniciar sesión para ver tu perfil', 'warning');
        return;
    }
    // Esta función está implementada en cart.js
}

function hideUserProfile() {
    document.getElementById('user-profile-modal').classList.add('hidden');
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        type === 'warning' ? 'bg-yellow-500' :
        'bg-blue-500'
    }`;
    
    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}