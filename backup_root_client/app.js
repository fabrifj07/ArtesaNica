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

        // Mobile menu overlay toggle (new): show/hide full-screen overlay
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const mobileOverlay = document.getElementById('mobile-menu-overlay');
        const mobileClose = document.getElementById('mobile-menu-close');
        if (mobileBtn && mobileOverlay) {
            mobileBtn.addEventListener('click', (e) => {
                const isHidden = mobileOverlay.classList.contains('hidden');
                if (isHidden) {
                    mobileOverlay.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                    mobileBtn.setAttribute('aria-expanded', 'true');
                } else {
                    mobileOverlay.classList.add('hidden');
                    document.body.style.overflow = '';
                    mobileBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }
        if (mobileClose && mobileOverlay) {
            mobileClose.addEventListener('click', () => {
                mobileOverlay.classList.add('hidden');
                document.body.style.overflow = '';
                if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
            });
        }

        // Close overlay by clicking on the overlay background (not panel)
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', (e) => {
                if (e.target === mobileOverlay) {
                    mobileOverlay.classList.add('hidden');
                    document.body.style.overflow = '';
                    if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // Ensure overlay closes when resizing to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && mobileOverlay && !mobileOverlay.classList.contains('hidden')) {
                mobileOverlay.classList.add('hidden');
                document.body.style.overflow = '';
                if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideAuthModal();
                hideCart();
                closeStoresModal();
            }
        });

        // Additional UI initializers
        this.setupCarouselControls();
        this.setupGlobalSearchToggle();
        this.setupStoresModalEventListeners();
    }

    // Carousel arrow controls for stores carousel (supports multiple instances, tolerant thresholds)
    setupCarouselControls() {
        const carousels = document.querySelectorAll('.stores-carousel');
        if (!carousels || carousels.length === 0) return;

        carousels.forEach((carousel) => {
            const container = document.getElementById('stores-container') || carousel.querySelector('.stores-track');
            const leftBtn = carousel.querySelector('.carousel-arrow.left');
            const rightBtn = carousel.querySelector('.carousel-arrow.right');
            if (!container || !leftBtn || !rightBtn) return;

            const scrollAmount = () => Math.round(container.clientWidth * 0.8) || 300;
            let isAnimating = false;

            const update = () => {
                const tolerance = 5;
                const atStart = container.scrollLeft <= tolerance;
                const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - tolerance;

                leftBtn.disabled = atStart;
                rightBtn.disabled = atEnd;

                leftBtn.setAttribute('aria-disabled', atStart ? 'true' : 'false');
                rightBtn.setAttribute('aria-disabled', atEnd ? 'true' : 'false');

                leftBtn.classList.toggle('opacity-50', atStart);
                rightBtn.classList.toggle('opacity-50', atEnd);
            };

            leftBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (leftBtn.disabled) return;
                isAnimating = true;
                container.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
                setTimeout(() => { isAnimating = false; update(); }, 420);
            });

            rightBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (rightBtn.disabled) return;
                isAnimating = true;
                container.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
                setTimeout(() => { isAnimating = false; update(); }, 420);
            });

            container.addEventListener('scroll', () => {
                if (isAnimating) return;
                requestAnimationFrame(update);
            });

            window.addEventListener('resize', () => requestAnimationFrame(update));

            requestAnimationFrame(update);

            let isDown = false;
            let startX = 0;
            let startScroll = 0;

            container.addEventListener('pointerdown', (e) => {
                isDown = true;
                container.classList.add('dragging');
                startX = e.clientX;
                startScroll = container.scrollLeft;
                try { e.target.setPointerCapture && e.target.setPointerCapture(e.pointerId); } catch (err) {}
            });

            container.addEventListener('pointermove', (e) => {
                if (!isDown) return;
                const x = e.clientX;
                const walk = x - startX;
                container.scrollLeft = startScroll - walk;
            });

            const upHandler = (e) => {
                if (!isDown) return;
                isDown = false;
                container.classList.remove('dragging');
                try { e.target.releasePointerCapture && e.target.releasePointerCapture(e.pointerId); } catch (err) {}
                requestAnimationFrame(update);
            };

            container.addEventListener('pointerup', upHandler);
            container.addEventListener('pointercancel', upHandler);
        });
    }

    // Show desktop/global search under hero on wider viewports and hide on small screens
    setupGlobalSearchToggle() {
        const globalSearch = document.getElementById('global-search-container');
        if (!globalSearch) return;

        const toggle = () => {
            if (window.innerWidth >= 768) {
                globalSearch.classList.remove('hidden');
            } else {
                globalSearch.classList.add('hidden');
            }
        };

        toggle();
        window.addEventListener('resize', toggle);
    }

    setupStoresModalEventListeners() {
        const openBtn = document.getElementById('stores-view-more');
        const openBtn2 = document.getElementById('stores-view-more-2');
        const closeBtn = document.getElementById('stores-modal-close');

        if (openBtn) {
            openBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openStoresModal();
            });
        }

        if (openBtn2) {
            openBtn2.addEventListener('click', (e) => {
                e.preventDefault();
                openStoresModal();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                closeStoresModal();
            });
        }
    }

    initializeForms() {
        const sellerForm = document.getElementById('seller-application-form');
        if (sellerForm) sellerForm.addEventListener('submit', e => { e.preventDefault(); this.handleSellerApplication(e.target); });

        const contactForm = document.getElementById('contact-form');
        if (contactForm) contactForm.addEventListener('submit', e => { e.preventDefault(); this.handleContactForm(e.target); });
    }

    handleSellerApplication(form) {
        // Implementation
    }

    handleContactForm(form) {
        // Implementation
    }
}

// Initialize the application
const app = new ArtesaNicaApp();
