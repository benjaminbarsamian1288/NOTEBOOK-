/**
 * App - Einstiegspunkt, Event-Wiring
 */
(async function init() {

    // Theme initial setzen
    UI.applyTheme(Storage.getTheme());

    // Daten laden
    await Data.loadAll();

    // Sidebar mit Regelwerken fuellen
    UI.renderSidebarRegelwerke();

    // Startansicht (URL-Parameter pruefen)
    const params = new URLSearchParams(location.search);
    const view = params.get('view');
    const action = params.get('action');

    if (view === 'favoriten') UI.showView('favoriten');
    else if (action === 'search') {
        UI.showView('search');
        setTimeout(() => document.getElementById('search-input').focus(), 200);
    } else {
        UI.showView('home');
    }

    // ============ EVENT-LISTENER ============

    // Sidebar
    document.getElementById('btn-menu').addEventListener('click', UI.openSidebar);
    document.getElementById('btn-close-sidebar').addEventListener('click', UI.closeSidebar);
    document.getElementById('sidebar-overlay').addEventListener('click', UI.closeSidebar);

    // Nav-Items
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const v = btn.dataset.view;
            UI.showView(v);
            if (window.innerWidth < 1024) UI.closeSidebar();
            if (v === 'search') {
                setTimeout(() => document.getElementById('search-input').focus(), 100);
            }
        });
    });

    // Theme-Toggle
    document.getElementById('btn-theme').addEventListener('click', UI.toggleTheme);

    // Suche
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('btn-clear-search');
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        const q = e.target.value;
        clearBtn.style.display = q ? 'flex' : 'none';
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            UI.showView('search');
            UI.renderSearch(q);
        }, 150);
    });
    searchInput.addEventListener('focus', () => {
        if (searchInput.value) UI.renderSearch(searchInput.value);
    });
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        UI.renderSearch('');
        searchInput.focus();
    });

    // Dialog schliessen
    document.querySelectorAll('[data-close]').forEach(el => {
        el.addEventListener('click', () => {
            const dialog = el.closest('.dialog');
            if (dialog) UI.closeDialog(dialog.id);
        });
    });

    // ESC schliesst Dialoge
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.dialog:not([hidden])').forEach(d => UI.closeDialog(d.id));
        }
    });

    // Favorit toggle
    document.getElementById('btn-favorite').addEventListener('click', () => {
        const p = UI.getCurrentParagraph();
        if (!p) return;
        const nowFav = Storage.toggleFavorit(p.id);
        document.getElementById('btn-favorite').innerHTML = nowFav
            ? '<i class="fas fa-star" style="color: #f59e0b"></i>'
            : '<i class="far fa-star"></i>';
        UI.toast(nowFav ? 'Zu Favoriten hinzugefuegt' : 'Aus Favoriten entfernt');
        UI.refreshCurrent();
    });

    // Notiz bearbeiten
    document.getElementById('btn-edit-notes').addEventListener('click', () => {
        const p = UI.getCurrentParagraph();
        if (!p) return;
        document.getElementById('notes-textarea').value = Storage.getNotiz(p.id);
        UI.openDialog('notes-dialog');
        setTimeout(() => document.getElementById('notes-textarea').focus(), 100);
    });

    // Notiz speichern
    document.getElementById('btn-save-notes').addEventListener('click', () => {
        const p = UI.getCurrentParagraph();
        if (!p) return;
        const text = document.getElementById('notes-textarea').value;
        Storage.saveNotiz(p.id, text);
        UI.closeDialog('notes-dialog');
        UI.toast(text.trim() ? 'Notiz gespeichert' : 'Notiz geloescht');
        UI.showParagraph(p.id);
    });

    // Teilen
    document.getElementById('btn-share').addEventListener('click', async () => {
        const p = UI.getCurrentParagraph();
        if (!p) return;
        const text = `${p.regelwerkKuerzel} ${p.nummer} - ${p.titel}\n\n${p.text}`;
        if (navigator.share) {
            try {
                await navigator.share({ title: `${p.regelwerkKuerzel} ${p.nummer}`, text });
            } catch (e) { /* user cancelled */ }
        } else {
            try {
                await navigator.clipboard.writeText(text);
                UI.toast('Text in Zwischenablage kopiert');
            } catch (e) {
                UI.toast('Teilen nicht moeglich');
            }
        }
    });

    // System-Theme-Wechsel beachten
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (Storage.getTheme() === 'auto') UI.applyTheme('auto');
    });

})();
