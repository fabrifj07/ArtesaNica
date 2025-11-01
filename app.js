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
                const modals = document.querySelectorAll('.fixed.inset-0');
                modals.forEach(modal => {
                    if (modal.id !== 'auth-modal' && modal.id !== 'cart-overlay') {
                        modal.remove();
                    }
                });
            }
        });

        // Additional UI initializers
        this.setupCarouselControls();
        this.setupGlobalSearchToggle();
        this.setupStoresModal();
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
                // Use a small tolerance to account for fractional scrolling and smooth scroll timing
                const tolerance = 5;
                const atStart = container.scrollLeft <= tolerance;
                const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - tolerance;

                leftBtn.disabled = atStart;
                rightBtn.disabled = atEnd;

                // Sync aria-disabled for accessibility
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
                // Ensure update runs after smooth scroll finishes (best-effort)
                setTimeout(() => { isAnimating = false; update(); }, 420);
            });

            rightBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (rightBtn.disabled) return;
                isAnimating = true;
                container.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
                setTimeout(() => { isAnimating = false; update(); }, 420);
            });

            // Update on manual scroll as well
            container.addEventListener('scroll', () => {
                if (isAnimating) return; // avoid thrash during programmatic scroll
                requestAnimationFrame(update);
            });

            // Also update on resize (layout changes)
            window.addEventListener('resize', () => requestAnimationFrame(update));

            // Initial state
            requestAnimationFrame(update);

            // Add pointer drag (desktop & touch) to make the carousel tactile
            let isDown = false;
            let startX = 0;
            let startScroll = 0;

            container.addEventListener('pointerdown', (e) => {
                isDown = true;
                container.classList.add('dragging');
                startX = e.clientX;
                startScroll = container.scrollLeft;
                // capture pointer so we still get events
                try { e.target.setPointerCapture && e.target.setPointerCapture(e.pointerId); } catch (err) {}
            });

            container.addEventListener('pointermove', (e) => {
                if (!isDown) return;
                const x = e.clientX;
                const walk = x - startX; // positive when moving right
                container.scrollLeft = startScroll - walk;
            });

            const upHandler = (e) => {
                if (!isDown) return;
                isDown = false;
                container.classList.remove('dragging');
                try { e.target.releasePointerCapture && e.target.releasePointerCapture(e.pointerId); } catch (err) {}
                // call update after the manual drag
                requestAnimationFrame(update);
            };

            container.addEventListener('pointerup', upHandler);
            container.addEventListener('pointercancel', upHandler);
        });
    }

    // Modal and 'Ver más' behavior for stores
    setupStoresModal() {
        const viewMore = document.getElementById('stores-view-more');
        const modal = document.getElementById('stores-modal');
        const overlay = document.getElementById('stores-modal-overlay');
        const closeBtn = document.getElementById('stores-modal-close');
        const modalContent = document.getElementById('stores-modal-content');
        const storesContainer = document.getElementById('stores-container');
        if (!viewMore || !modal || !overlay || !closeBtn || !modalContent || !storesContainer) return;

        const openModal = (e) => {
            e && e.preventDefault();
            // Clone current store cards into modal content (deep clone)
            modalContent.innerHTML = '';
            Array.from(storesContainer.children).forEach(node => {
                const clone = node.cloneNode(true);
                // remove any inline width/min-width to allow grid sizing
                clone.style.minWidth = '';
                clone.style.maxWidth = '';
                modalContent.appendChild(clone);
            });
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            // focus first item for accessibility
            const first = modalContent.querySelector('.store-card');
            if (first) first.focus && first.focus();
        };

        const closeModal = () => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            modalContent.innerHTML = '';
        };

        viewMore.addEventListener('click', openModal);
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        // close with Escape
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal(); });
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

        // Run once and on resize
        toggle();
        window.addEventListener('resize', toggle);
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