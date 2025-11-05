
// auth.js

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('artesanica_users')) || [];
        this.init();
    }

    init() {
        const savedUser = localStorage.getItem('artesanica_current_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
        this.updateUI();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        document.getElementById('register-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.register();
        });

        const userMenuButton = document.getElementById('user-menu-button');
        const userMenuDropdown = document.getElementById('user-menu-dropdown');
        userMenuButton?.addEventListener('click', () => {
            userMenuDropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (userMenuButton && userMenuDropdown && !userMenuButton.contains(e.target) && !userMenuDropdown.contains(e.target)) {
                userMenuDropdown.classList.add('hidden');
            }
        });
    }

    login() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const hashedPassword = this._hashPassword(password);

        const user = this.users.find(u => u.email === email && u.password === hashedPassword);
        
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
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const phone = document.getElementById('register-phone').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;

        if (password !== confirmPassword) {
            showNotification('Las contraseñas no coinciden', 'error');
            return;
        }

        if (this.users.find(u => u.email === email)) {
            showNotification('Este email ya está registrado', 'error');
            return;
        }

        const hashedPassword = this._hashPassword(password);
        const newUser = {
            id: Date.now().toString(),
            name, email, phone,
            password: hashedPassword,
            role: 'buyer',
            createdAt: new Date().toISOString(),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0067C0&color=fff`,
            orders: []
        };

        this.users.push(newUser);
        localStorage.setItem('artesanica_users', JSON.stringify(this.users));

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
        if(typeof hideUserProfile === 'function') hideUserProfile();
        showNotification('Sesión cerrada', 'info');
    }

    updateUI() {
        const authButtons = document.getElementById('auth-buttons');
        const userMenu = document.getElementById('user-menu');
        const mobileAuthSection = document.getElementById('mobile-auth-section');

        if (this.currentUser) {
            // --- Logged IN state ---
            // Hide the login/register buttons on desktop by removing the class that makes them visible on larger screens.
            // The base 'hidden' class will then take effect.
            authButtons?.classList.remove('sm:flex');

            // Show the user menu on desktop by removing the 'hidden' class.
            userMenu?.classList.remove('hidden');

            // Populate user info
            const userNameEl = document.getElementById('user-name');
            const userAvatarEl = document.getElementById('user-avatar');
            if(userNameEl) userNameEl.textContent = this.currentUser.name;
            if(userAvatarEl) userAvatarEl.src = this.currentUser.avatar;

            // Update mobile menu to show user info and logout
            if (mobileAuthSection) {
                mobileAuthSection.innerHTML = `
                    <div class="flex items-center space-x-3 mb-4">
                        <img src="${this.currentUser.avatar}" class="w-10 h-10 rounded-full border-2 border-blue-500">
                        <div>
                            <p class="font-semibold text-gray-800">${this.currentUser.name}</p>
                            <a href="#" onclick="showUserProfile()" class="text-sm text-blue-600">Ver Perfil</a>
                        </div>
                    </div>
                    <button onclick="logout()" class="btn btn-slim btn-slim--outline w-full">Cerrar Sesión</button>
                `;
            }
        } else {
            // --- Logged OUT state ---
            // Show the login/register buttons on desktop by adding the responsive class back.
            authButtons?.classList.add('sm:flex');
            
            // Hide the user menu on desktop.
            userMenu?.classList.add('hidden');

            // Update mobile menu to show login/register buttons.
            if (mobileAuthSection) {
                mobileAuthSection.innerHTML = `
                    <div class="flex gap-3">
                        <button onclick="showAuthModal('login')" class="btn btn-slim btn-slim--outline w-full">Iniciar Sesión</button>
                        <button onclick="showAuthModal('register')" class="btn btn-slim btn-slim--accent w-full">Registrarse</button>
                    </div>
                `;
            }
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    _hashPassword(password) {
        return CryptoJS.SHA256(password).toString();
    }
}

const auth = new AuthSystem();

// --- Modal and Notification Functions ---
function showAuthModal(type) {
    const modal = document.getElementById('auth-modal');
    modal.classList.remove('hidden');
    document.getElementById('login-form').classList.toggle('hidden', type !== 'login');
    document.getElementById('register-form').classList.toggle('hidden', type !== 'register');
    document.getElementById('auth-title').textContent = type === 'login' ? 'Iniciar Sesión' : 'Registrarse';
}

function hideAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
    document.getElementById('login-form').reset();
    document.getElementById('register-form').reset();
}

function logout() {
    auth.logout();
}

function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };
    notification.className = `notification fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transform translate-x-full transition-transform duration-300 ${colors[type] || colors.info}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.remove('translate-x-full'), 100);
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showUserProfile() {
    if (!auth.isAuthenticated()) {
        showNotification('Debes iniciar sesión para ver tu perfil', 'warning');
        return;
    }
    // Implementation to show the profile modal is in app.js or another relevant script
    const userProfileModal = document.getElementById('user-profile-modal');
    const userProfileContent = document.getElementById('user-profile-content');
    
    if (userProfileModal && userProfileContent) {
        const user = auth.getCurrentUser();
        // This is a basic profile, you can expand it
        userProfileContent.innerHTML = `
            <div class="text-center">
                <img src="${user.avatar}" class="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-500">
                <h3 class="text-2xl font-bold">${user.name}</h3>
                <p class="text-gray-600">${user.email}</p>
                <p class="text-gray-600">${user.phone}</p>
                <p class="text-sm text-gray-500 mt-2">Miembro desde: ${new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
        `;
        userProfileModal.classList.remove('hidden');
    }
}

function hideUserProfile() {
    const userProfileModal = document.getElementById('user-profile-modal');
    if (userProfileModal) {
        userProfileModal.classList.add('hidden');
    }
}
