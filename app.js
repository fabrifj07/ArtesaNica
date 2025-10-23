// Main Application with Enhanced Features
class ArtesaNicaApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeForms();
        console.log('ArtesaNica App initialized successfully!');
    }

    setupEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 100) {
                navbar.classList.add('bg-blue-600', 'shadow-lg');
            } else {
                navbar.classList.remove('bg-blue-600', 'shadow-lg');
            }
        });

        // Close modals on background click
        document.addEventListener('click', (e) => {
            if (e.target.id === 'auth-modal') {
                hideAuthModal();
            }
            if (e.target.id === 'cart-overlay') {
                hideCart();
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideAuthModal();
                hideCart();
                const modals = document.querySelectorAll('.fixed.inset-0');
                modals.forEach(modal => {
                    if (modal.id !== 'auth-modal' && modal.id !== 'cart-overlay') {
                        modal.remove();
                    }
                });
            }
        });
    }

    initializeForms() {
        // Seller application form
        const sellerForm = document.getElementById('seller-application-form');
        if (sellerForm) {
            sellerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSellerApplication(e.target);
            });
        }

        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(e.target);
            });
        }
    }

    handleSellerApplication(form) {
        const formData = new FormData(form);
        const application = {
            id: 'APP-' + Date.now(),
            timestamp: new Date().toISOString(),
            status: 'pending',
            ...Object.fromEntries(formData)
        };

        // Save to localStorage
        const applications = JSON.parse(localStorage.getItem('artesanica_applications')) || [];
        applications.push(application);
        localStorage.setItem('artesanica_applications', JSON.stringify(applications));

        // Show success message
        showNotification('¡Solicitud enviada exitosamente! Te contactaremos pronto.', 'success');
        form.reset();

        // Simulate admin notification
        setTimeout(() => {
            showNotification('Tu solicitud está siendo revisada por nuestro equipo.', 'info');
        }, 2000);
    }

    handleContactForm(form) {
        const formData = new FormData(form);
        const contact = {
            id: 'CONTACT-' + Date.now(),
            timestamp: new Date().toISOString(),
            ...Object.fromEntries(formData)
        };

        // Save to localStorage
        const contacts = JSON.parse(localStorage.getItem('artesanica_contacts')) || [];
        contacts.push(contact);
        localStorage.setItem('artesanica_contacts', JSON.stringify(contacts));

        // Show success message
        showNotification('¡Mensaje enviado! Te responderemos pronto.', 'success');
        form.reset();
    }
}

// Initialize the application
const app = new ArtesaNicaApp();

// Make functions globally available
window.showAuthModal = showAuthModal;
window.hideAuthModal = hideAuthModal;
window.logout = logout;
window.showCart = showCart;
window.hideCart = hideCart;
window.addToCart = addToCart;
window.showDashboard = showDashboard;
window.hideDashboard = hideDashboard;
window.scrollToSection = scrollToSection;

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}