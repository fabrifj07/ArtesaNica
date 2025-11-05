// mobile-menu.js
// Inicializa el menú hamburguesa (mobile) de forma reutilizable en cualquier página.
(function () {
    function initMobileMenu(options) {
        options = options || {};
        const btnId = options.btnId || 'mobile-menu-btn';
        const overlayId = options.overlayId || 'mobile-menu-overlay';
        const closeId = options.closeId || 'mobile-menu-close';

        const mobileBtn = document.getElementById(btnId);
        const mobileOverlay = document.getElementById(overlayId);
        const mobileClose = document.getElementById(closeId);

        if (!mobileBtn || !mobileOverlay) return false;

        // Prevent double initialization
        if (mobileBtn.dataset.mobileMenuInit === '1') return true;
        mobileBtn.dataset.mobileMenuInit = '1';

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

        if (mobileClose) {
            mobileClose.addEventListener('click', () => {
                mobileOverlay.classList.add('hidden');
                document.body.style.overflow = '';
                mobileBtn.setAttribute('aria-expanded', 'false');
            });
        }

        mobileOverlay.addEventListener('click', (e) => {
            if (e.target === mobileOverlay) {
                mobileOverlay.classList.add('hidden');
                document.body.style.overflow = '';
                mobileBtn.setAttribute('aria-expanded', 'false');
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && !mobileOverlay.classList.contains('hidden')) {
                mobileOverlay.classList.add('hidden');
                document.body.style.overflow = '';
                mobileBtn.setAttribute('aria-expanded', 'false');
            }
        });

        return true;
    }

    // Auto-init on DOMContentLoaded for default IDs
    function autoInit() {
        try { initMobileMenu(); } catch (e) { /* ignore */ }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInit);
    } else {
        setTimeout(autoInit, 0);
    }

    window.initMobileMenu = initMobileMenu;
})();
