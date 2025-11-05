// Main Application with Enhanced Features
class ArtesaNicaApp {
    constructor() {
        // Cache key DOM elements for performance and clarity
        this.navbar = document.getElementById('navbar');
        this.mobileBtn = document.getElementById('mobile-menu-btn');
        this.mobileOverlay = document.getElementById('mobile-menu-overlay');
        this.mobileClose = document.getElementById('mobile-menu-close');
        this.mobilePanel = document.getElementById('mobile-menu-panel');

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeForms();
        console.log('ArtesaNica App initialized successfully!');
    }

    // --- Mobile Menu Methods ---
    closeMobileMenu() {
        if (!this.mobileOverlay || this.mobileOverlay.classList.contains('hidden')) return;
        this.mobileOverlay.classList.add('hidden');
        document.body.style.overflow = '';
        if (this.mobileBtn) this.mobileBtn.setAttribute('aria-expanded', 'false');
    }

    openMobileMenu() {
        if (!this.mobileOverlay || !this.mobileOverlay.classList.contains('hidden')) return;
        this.mobileOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        if (this.mobileBtn) this.mobileBtn.setAttribute('aria-expanded', 'true');
    }

    // --- Main Event Listener Setup ---
    setupEventListeners() {
        // --- SMOOTH SCROLL & MOBILE MENU LINK HANDLER ---
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

                // If the clicked link is inside the mobile panel, close the menu
                if (anchor.closest('#mobile-menu-panel')) {
                    this.closeMobileMenu();
                }
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.classList.add('bg-blue-600', 'shadow-lg');
            } else {
                this.navbar.classList.remove('bg-blue-600', 'shadow-lg');
            }
        });

        // Mobile menu button controls
        if (this.mobileBtn) {
            this.mobileBtn.addEventListener('click', () => {
                const isHidden = this.mobileOverlay.classList.contains('hidden');
                if (isHidden) this.openMobileMenu();
                else this.closeMobileMenu();
            });
        }
        if (this.mobileClose) {
            this.mobileClose.addEventListener('click', () => this.closeMobileMenu());
        }

        // Close modals/menus with background click or Escape key
        document.addEventListener('click', (e) => {
            if (e.target.id === 'auth-modal') hideAuthModal();
            if (e.target.id === 'cart-overlay') hideCart();
            if (e.target === this.mobileOverlay) this.closeMobileMenu();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideAuthModal();
                hideCart();
                this.closeMobileMenu();
            }
        });
        
        // Close menu on resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                this.closeMobileMenu();
            }
        });

        // Initialize other UI components
        this.setupCarouselControls();
        this.setupGlobalSearchToggle();
        this.setupStoresModal();
    }

    // --- Other UI Component Methods ---
    setupCarouselControls() {
        document.querySelectorAll('.stores-carousel').forEach(carousel => {
            const container = carousel.querySelector('.stores-track');
            const leftBtn = carousel.querySelector('.carousel-arrow.left');
            const rightBtn = carousel.querySelector('.carousel-arrow.right');
            if (!container || !leftBtn || !rightBtn) return;

            const scrollAmount = () => Math.round(container.clientWidth * 0.8) || 300;
            const update = () => {
                const tolerance = 5;
                const atStart = container.scrollLeft <= tolerance;
                const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - tolerance;
                leftBtn.disabled = atStart;
                rightBtn.disabled = atEnd;
            };

            leftBtn.addEventListener('click', () => container.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
            rightBtn.addEventListener('click', () => container.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
            
            container.addEventListener('scroll', () => requestAnimationFrame(update));
            window.addEventListener('resize', () => requestAnimationFrame(update), { passive: true });
            update();
        });
    }

    setupStoresModal() {
        // Logic for 'Ver más' and stores modal
    }

    setupGlobalSearchToggle() {
        const globalSearch = document.getElementById('global-search-container');
        if (!globalSearch) return;
        const toggle = () => globalSearch.classList.toggle('hidden', window.innerWidth < 768);
        toggle();
        window.addEventListener('resize', toggle);
    }

    initializeForms() {
        const sellerForm = document.getElementById('seller-application-form');
        if (sellerForm) sellerForm.addEventListener('submit', e => { e.preventDefault(); this.handleSellerApplication(e.target); });

        const contactForm = document.getElementById('contact-form');
        if (contactForm) contactForm.addEventListener('submit', e => { e.preventDefault(); this.handleContactForm(e.target); });
    }

    handleSellerApplication(form) {
        // Logic for seller application
    }

    handleContactForm(form) {
        // Logic for contact form
    }
}

// Initialize the application
new ArtesaNicaApp();

// Placeholder for global functions if needed (auth, cart, etc.)
// window.showAuthModal = ...
