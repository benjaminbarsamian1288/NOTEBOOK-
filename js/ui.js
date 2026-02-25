/**
 * UI Module - Handles all UI interactions, modals, context menus, toasts
 */
const UI = (() => {
    // ===== Toast Notifications =====
    function showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-triangle'
        };

        toast.innerHTML = `<i class="${icons[type] || icons.info}"></i><span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(50px)';
            toast.style.transition = '0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // ===== Modal Management =====
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            const firstInput = modal.querySelector('input');
            if (firstInput) setTimeout(() => firstInput.focus(), 100);
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('hidden');
    }

    function closeAllModals() {
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    }

    function initModals() {
        // Close button handlers
        document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                if (modal) modal.classList.add('hidden');
            });
        });

        // Click outside to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.add('hidden');
            });
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAllModals();
                hideContextMenu();
            }
        });
    }

    // ===== Input Modal (generic) =====
    function showInputModal(title, label, defaultValue, showColorPicker) {
        return new Promise((resolve) => {
            document.getElementById('input-modal-title').textContent = title;
            document.getElementById('input-modal-label').textContent = label;
            const input = document.getElementById('input-modal-value');
            input.value = defaultValue || '';

            const colorGroup = document.getElementById('input-modal-color-group');
            let selectedColor = '#4a90d9';

            if (showColorPicker) {
                colorGroup.classList.remove('hidden');
                const colorBtns = colorGroup.querySelectorAll('.color-option');
                colorBtns.forEach(btn => {
                    btn.classList.remove('selected');
                    if (btn.dataset.color === selectedColor) btn.classList.add('selected');
                    btn.onclick = () => {
                        colorBtns.forEach(b => b.classList.remove('selected'));
                        btn.classList.add('selected');
                        selectedColor = btn.dataset.color;
                    };
                });
            } else {
                colorGroup.classList.add('hidden');
            }

            openModal('modal-input');

            const confirmBtn = document.getElementById('btn-input-confirm');
            const handler = () => {
                confirmBtn.removeEventListener('click', handler);
                closeModal('modal-input');
                resolve({ value: input.value.trim(), color: selectedColor });
            };
            confirmBtn.addEventListener('click', handler);

            // Enter key
            const keyHandler = (e) => {
                if (e.key === 'Enter') {
                    input.removeEventListener('keydown', keyHandler);
                    handler();
                }
            };
            input.addEventListener('keydown', keyHandler);
        });
    }

    // ===== Context Menu =====
    let contextMenuTarget = null;
    let contextMenuType = null;

    function showContextMenu(e, type, target) {
        e.preventDefault();
        contextMenuTarget = target;
        contextMenuType = type;

        const menu = document.getElementById('context-menu');
        menu.classList.remove('hidden');

        // Position
        const x = Math.min(e.clientX, window.innerWidth - 200);
        const y = Math.min(e.clientY, window.innerHeight - 200);
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
    }

    function hideContextMenu() {
        const menu = document.getElementById('context-menu');
        if (menu) menu.classList.add('hidden');
        contextMenuTarget = null;
        contextMenuType = null;
    }

    function getContextMenuInfo() {
        return { target: contextMenuTarget, type: contextMenuType };
    }

    function initContextMenu() {
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#context-menu')) {
                hideContextMenu();
            }
        });
    }

    // ===== Sidebar Toggle =====
    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('collapsed');
    }

    // ===== Toolbar Tabs =====
    function initToolbarTabs() {
        document.querySelectorAll('.toolbar-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.toolbar-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.toolbar-panel').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                const panel = document.getElementById('tab-' + tab.dataset.tab);
                if (panel) panel.classList.add('active');
            });
        });
    }

    // ===== Format Date =====
    function formatDate(isoString) {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function formatDateShort(isoString) {
        if (!isoString) return '';
        const date = new Date(isoString);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / 86400000);

        if (days === 0) return 'Heute';
        if (days === 1) return 'Gestern';
        if (days < 7) return `Vor ${days} Tagen`;
        return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
    }

    // ===== Confirm Dialog =====
    function confirm(message) {
        return window.confirm(message);
    }

    return {
        showToast, openModal, closeModal, closeAllModals, initModals,
        showInputModal,
        showContextMenu, hideContextMenu, getContextMenuInfo, initContextMenu,
        toggleSidebar, initToolbarTabs,
        formatDate, formatDateShort, confirm
    };
})();
