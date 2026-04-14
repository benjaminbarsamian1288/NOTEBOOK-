/**
 * PWA Module - Service Worker registration, install prompt, offline detection,
 * mobile navigation, and app-like behavior
 */
const PWA = (() => {
    let deferredPrompt = null;
    let isStandalone = false;

    function init() {
        registerServiceWorker();
        detectStandaloneMode();
        setupInstallPrompt();
        setupOfflineDetection();
        setupMobileNavigation();
        setupSwipeGestures();
        handleAppShortcuts();
        generateIcons();
    }

    // ===== Service Worker =====
    async function registerServiceWorker() {
        if (!('serviceWorker' in navigator)) return;

        try {
            const registration = await navigator.serviceWorker.register('./sw.js');
            console.log('Service Worker registered:', registration.scope);

            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'activated') {
                        UI.showToast('App wurde aktualisiert! Seite wird neu geladen.', 'info');
                        setTimeout(() => window.location.reload(), 2000);
                    }
                });
            });
        } catch (err) {
            console.error('Service Worker registration failed:', err);
        }
    }

    // ===== Standalone Mode Detection =====
    function detectStandaloneMode() {
        isStandalone = window.matchMedia('(display-mode: standalone)').matches
            || window.navigator.standalone === true;

        if (isStandalone) {
            document.body.classList.add('pwa-standalone');
        }
    }

    // ===== Install Prompt =====
    function setupInstallPrompt() {
        // Capture the install prompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;

            // Only show banner if not previously dismissed
            const dismissed = localStorage.getItem('voicenote_install_dismissed');
            if (!dismissed) {
                setTimeout(() => showInstallBanner(), 3000);
            }
        });

        // Install button handler
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) {
            installBtn.addEventListener('click', async () => {
                if (!deferredPrompt) return;

                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;

                if (outcome === 'accepted') {
                    UI.showToast('VoiceNote wird installiert!', 'success');
                }

                deferredPrompt = null;
                hideInstallBanner();
            });
        }

        // Dismiss button
        const dismissBtn = document.getElementById('pwa-install-dismiss');
        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                hideInstallBanner();
                localStorage.setItem('voicenote_install_dismissed', Date.now().toString());
            });
        }

        // Detect successful install
        window.addEventListener('appinstalled', () => {
            hideInstallBanner();
            deferredPrompt = null;
            UI.showToast('VoiceNote erfolgreich installiert!', 'success');
        });
    }

    function showInstallBanner() {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) banner.classList.remove('hidden');
    }

    function hideInstallBanner() {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) banner.classList.add('hidden');
    }

    // ===== Offline Detection =====
    function setupOfflineDetection() {
        const indicator = document.getElementById('offline-indicator');

        function updateOnlineStatus() {
            if (!navigator.onLine) {
                if (indicator) indicator.classList.remove('hidden');
                UI.showToast('Du bist offline. Aenderungen werden lokal gespeichert.', 'warning');
            } else {
                if (indicator) indicator.classList.add('hidden');
            }
        }

        window.addEventListener('online', () => {
            if (indicator) indicator.classList.add('hidden');
            UI.showToast('Wieder online!', 'success');
        });

        window.addEventListener('offline', () => {
            if (indicator) indicator.classList.remove('hidden');
            UI.showToast('Keine Internetverbindung. Offline-Modus aktiv.', 'warning');
        });

        // Initial check
        updateOnlineStatus();
    }

    // ===== Mobile Navigation =====
    function setupMobileNavigation() {
        const isMobile = window.innerWidth <= 768;
        if (!isMobile && !isStandalone) return;

        // Notes tab - toggle sidebar
        const notesBtn = document.getElementById('mob-nav-notes');
        if (notesBtn) {
            notesBtn.addEventListener('click', () => {
                setActiveNav('notes');
                const sidebar = document.getElementById('sidebar');
                if (sidebar.classList.contains('collapsed')) {
                    sidebar.classList.remove('collapsed');
                    showOverlay();
                } else {
                    sidebar.classList.add('collapsed');
                    hideOverlay();
                }
            });
        }

        // Record tab
        const recordBtn = document.getElementById('mob-nav-record');
        if (recordBtn) {
            recordBtn.addEventListener('click', () => {
                setActiveNav('record');
                closeSidebar();
                // Toggle recorder
                const recorder = document.getElementById('voice-recorder');
                recorder.classList.toggle('hidden');
                if (!recorder.classList.contains('hidden')) {
                    // Auto-switch to Insert tab
                    document.querySelectorAll('.toolbar-tab').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.toolbar-panel').forEach(p => p.classList.remove('active'));
                    const insertTab = document.querySelector('[data-tab="insert"]');
                    if (insertTab) {
                        insertTab.classList.add('active');
                        document.getElementById('tab-insert').classList.add('active');
                    }
                }
                vibrate();
            });
        }

        // Add new page
        const addBtn = document.getElementById('mob-nav-add');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                closeSidebar();
                document.getElementById('btn-add-page').click();
                vibrate();
            });
        }

        // Draw tab
        const drawBtn = document.getElementById('mob-nav-draw');
        if (drawBtn) {
            drawBtn.addEventListener('click', () => {
                setActiveNav('draw');
                closeSidebar();
                // Switch to draw toolbar
                document.querySelectorAll('.toolbar-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.toolbar-panel').forEach(p => p.classList.remove('active'));
                const drawTab = document.querySelector('[data-tab="draw"]');
                if (drawTab) {
                    drawTab.classList.add('active');
                    document.getElementById('tab-draw').classList.add('active');
                }
                // Activate drawing canvas
                if (!Drawing.getIsActive()) {
                    Drawing.toggle();
                    document.getElementById('btn-toggle-canvas').classList.add('active');
                }
                vibrate();
            });
        }

        // Menu tab - show sidebar
        const menuBtn = document.getElementById('mob-nav-menu');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                setActiveNav('menu');
                const sidebar = document.getElementById('sidebar');
                sidebar.classList.remove('collapsed');
                showOverlay();
                vibrate();
            });
        }

        // Start with sidebar collapsed on mobile
        const sidebar = document.getElementById('sidebar');
        if (sidebar && isMobile) {
            sidebar.classList.add('collapsed');
        }
    }

    function setActiveNav(nav) {
        document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.nav === nav);
        });
    }

    function closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.add('collapsed');
        hideOverlay();
    }

    function showOverlay() {
        let overlay = document.querySelector('.sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.addEventListener('click', () => {
                closeSidebar();
                setActiveNav('notes');
            });
            document.body.appendChild(overlay);
        } else {
            overlay.style.display = 'block';
        }
    }

    function hideOverlay() {
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) overlay.style.display = 'none';
    }

    // ===== Swipe Gestures =====
    function setupSwipeGestures() {
        if (window.innerWidth > 768) return;

        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        const swipeThreshold = 80;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;

            const diffX = touchEndX - touchStartX;
            const diffY = Math.abs(touchEndY - touchStartY);

            // Only handle horizontal swipes (not vertical scrolling)
            if (diffY > Math.abs(diffX) * 0.5) return;

            // Don't interfere with drawing canvas
            if (Drawing.getIsActive()) return;

            // Swipe right from left edge -> open sidebar
            if (diffX > swipeThreshold && touchStartX < 30) {
                const sidebar = document.getElementById('sidebar');
                sidebar.classList.remove('collapsed');
                showOverlay();
                vibrate();
            }

            // Swipe left -> close sidebar
            if (diffX < -swipeThreshold) {
                const sidebar = document.getElementById('sidebar');
                if (!sidebar.classList.contains('collapsed')) {
                    sidebar.classList.add('collapsed');
                    hideOverlay();
                    vibrate();
                }
            }
        }, { passive: true });
    }

    // ===== App Shortcuts =====
    function handleAppShortcuts() {
        const params = new URLSearchParams(window.location.search);
        const action = params.get('action');

        if (action === 'new-page') {
            // Wait for app to initialize, then create new page
            setTimeout(() => {
                document.getElementById('btn-add-page')?.click();
            }, 500);
        } else if (action === 'record') {
            // Open recorder
            setTimeout(() => {
                const recorder = document.getElementById('voice-recorder');
                if (recorder) recorder.classList.remove('hidden');
            }, 500);
        }
    }

    // ===== Icon Generation =====
    async function generateIcons() {
        if (typeof IconGenerator !== 'undefined') {
            try {
                await IconGenerator.generateAndCacheIcons();
            } catch (e) {
                // Icons generation is non-critical
                console.warn('Icon generation skipped:', e);
            }
        }
    }

    // ===== Haptic Feedback =====
    function vibrate(pattern) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern || 10);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        isStandalone: () => isStandalone,
        vibrate
    };
})();
