/**
 * UI - Rendering und DOM-Interaktion
 */
const UI = (function() {
    const $ = sel => document.querySelector(sel);
    const $$ = sel => Array.from(document.querySelectorAll(sel));
    const esc = Search.escapeHtml;

    let currentView = 'home';
    let currentRegelwerk = null;
    let currentParagraph = null;
    let currentQuery = '';
    let activeRegelwerkFilter = null;

    // ============ TOAST ============
    let toastTimer;
    function toast(msg, ms = 2000) {
        const el = $('#toast');
        el.textContent = msg;
        el.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.classList.remove('show'), ms);
    }

    // ============ SIDEBAR ============
    function openSidebar() {
        $('#sidebar').classList.add('open');
        $('#sidebar-overlay').classList.add('open');
    }
    function closeSidebar() {
        $('#sidebar').classList.remove('open');
        $('#sidebar-overlay').classList.remove('open');
    }

    function renderSidebarRegelwerke() {
        const list = $('#regelwerke-list');
        const regelwerke = Data.getRegelwerke();
        list.innerHTML = regelwerke.map(rw => `
            <button class="regelwerk-btn"
                    data-regelwerk="${esc(rw.id)}"
                    style="--regelwerk-color: ${esc(rw.farbe)}">
                <strong>${esc(rw.kuerzel)}</strong>
                <small>${esc(rw.untertitel || '')}</small>
            </button>
        `).join('');
        list.querySelectorAll('.regelwerk-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                showRegelwerk(btn.dataset.regelwerk);
                if (window.innerWidth < 1024) closeSidebar();
            });
        });
    }

    // ============ THEME ============
    function applyTheme(theme) {
        if (theme === 'dark' || (theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.dataset.theme = 'dark';
            $('#btn-theme').innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.documentElement.dataset.theme = 'light';
            $('#btn-theme').innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    function toggleTheme() {
        const cur = Storage.getTheme();
        const isDark = document.documentElement.dataset.theme === 'dark';
        const next = isDark ? 'light' : 'dark';
        Storage.setTheme(next);
        applyTheme(next);
    }

    // ============ NAV / VIEWS ============
    function setActiveNav(view) {
        $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    }

    function showView(view) {
        currentView = view;
        currentRegelwerk = null;
        setActiveNav(view);
        $('#search-input').value = '';
        currentQuery = '';
        activeRegelwerkFilter = null;
        renderFilterChips();
        $('#btn-clear-search').style.display = 'none';

        if (view === 'home') renderHome();
        else if (view === 'search') renderSearch('');
        else if (view === 'favoriten') renderFavoriten();
        else if (view === 'notizen') renderNotizen();
        else if (view === 'verlauf') renderVerlauf();
    }

    // ============ RENDER: HOME ============
    function renderHome() {
        const area = $('#content-area');
        const regelwerke = Data.getRegelwerke();
        area.innerHTML = `
            <section class="welcome">
                <div class="welcome-icon"><i class="fas fa-shield-halved"></i></div>
                <h2>Sicherheits-Manager</h2>
                <p>Dein interaktives Nachschlagewerk fuer Sicherheitsvorschriften. Tippe auf ein Regelwerk oder nutze die Suche.</p>
            </section>
            <h3 style="margin: 20px 4px 8px; color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">
                Regelwerke
            </h3>
            <div class="regelwerke-grid">
                ${regelwerke.map(rw => `
                    <button class="regelwerk-card"
                            data-regelwerk="${esc(rw.id)}"
                            style="--card-color: ${esc(rw.farbe)}">
                        <h3>${esc(rw.kuerzel)}</h3>
                        <p class="untertitel">${esc(rw.untertitel || '')}</p>
                        <div class="stats">
                            <span><i class="fas fa-list"></i> ${Data.countByRegelwerk(rw.id)} Paragraphen</span>
                        </div>
                        <p class="meta">${esc(rw.stand || '')}</p>
                    </button>
                `).join('')}
            </div>
        `;
        area.querySelectorAll('[data-regelwerk]').forEach(btn => {
            btn.addEventListener('click', () => showRegelwerk(btn.dataset.regelwerk));
        });
    }

    // ============ RENDER: REGELWERK ============
    function showRegelwerk(id) {
        const rw = Data.getRegelwerk(id);
        if (!rw) return;
        currentRegelwerk = rw;
        currentView = 'regelwerk';
        setActiveNav(null);

        const area = $('#content-area');
        area.innerHTML = `
            <div class="back-bar">
                <button class="icon-btn" id="btn-back-home"><i class="fas fa-arrow-left"></i></button>
                <div style="flex:1; min-width: 0;">
                    <h2 style="color: ${esc(rw.farbe)}">${esc(rw.kuerzel)}</h2>
                    <div class="untertitel">${esc(rw.untertitel || '')}</div>
                </div>
            </div>
            ${rw.hinweis ? `<div class="warning-box">${esc(rw.hinweis)}</div>` : ''}
            ${rw.beschreibung ? `<div class="info-box">${esc(rw.beschreibung)}</div>` : ''}
            ${(rw.kapitel || []).map(kap => `
                <div class="kapitel-block">
                    <h3>${esc(kap.title)}</h3>
                    ${(kap.paragraphen || []).map(p => renderParagraphCard(p, rw)).join('')}
                </div>
            `).join('')}
        `;
        $('#btn-back-home').addEventListener('click', () => showView('home'));
        area.querySelectorAll('[data-paragraph]').forEach(btn => {
            btn.addEventListener('click', () => showParagraph(btn.dataset.paragraph));
        });
    }

    function renderParagraphCard(p, rw, query = '') {
        const isFav = Storage.isFavorit(p.id);
        const hasNote = Storage.hatNotiz(p.id);
        const titel = query ? Search.highlight(p.titel, query) : esc(p.titel);
        const kurz = query ? Search.highlight(p.kurz || '', query) : esc(p.kurz || '');
        const nummer = query ? Search.highlight(p.nummer, query) : esc(p.nummer);

        return `
            <button class="paragraph-card"
                    data-paragraph="${esc(p.id)}"
                    style="--regelwerk-color: ${esc(rw.farbe)}">
                <div class="nummer">${nummer}</div>
                <div class="info">
                    <div class="titel">
                        ${titel}
                        ${isFav ? '<i class="fas fa-star fav-indicator"></i>' : ''}
                        ${hasNote ? '<i class="fas fa-pen-to-square has-notes-indicator"></i>' : ''}
                    </div>
                    <div class="kurz">${kurz}</div>
                    ${(p.tags || []).length ? `
                        <div class="tags">
                            ${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </button>
        `;
    }

    // ============ RENDER: PARAGRAPH DIALOG ============
    function showParagraph(id) {
        const p = Data.getParagraph(id);
        if (!p) return;
        currentParagraph = p;
        Storage.addToVerlauf(id);

        const rw = Data.getRegelwerk(p.regelwerkId);
        const isFav = Storage.isFavorit(id);
        const userNote = Storage.getNotiz(id);

        $('#dialog-breadcrumb').innerHTML = `
            <span style="color:${esc(rw.farbe)}">${esc(rw.kuerzel)}</span>
            <span style="color: var(--text-muted)"> &middot; ${esc(p.nummer)}</span>
        `;
        $('#btn-favorite').innerHTML = isFav
            ? '<i class="fas fa-star" style="color: #f59e0b"></i>'
            : '<i class="far fa-star"></i>';

        const body = $('#dialog-body');
        body.innerHTML = `
            <div class="detail-header">
                <span class="detail-nummer" style="background:${esc(rw.farbe)}">${esc(p.nummer)}</span>
                <h2 class="detail-title">${esc(p.titel)}</h2>
            </div>

            ${p.platzhalter ? `
                <div class="platzhalter-warnung">
                    <i class="fas fa-triangle-exclamation"></i>
                    Dies ist ein Platzhalter. Inhalt bitte selbst ergaenzen (Originaltext darf nicht oeffentlich veroeffentlicht werden).
                </div>
            ` : ''}

            ${p.kurz ? `<div class="detail-kurz">${esc(p.kurz)}</div>` : ''}

            <div class="detail-text">${esc(p.text || '')}</div>

            ${(p.tags || []).length ? `
                <div class="detail-section">
                    <h4><i class="fas fa-tags"></i> Tags</h4>
                    <div class="tags">
                        ${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}
                    </div>
                </div>
            ` : ''}

            ${(p.bilder || []).length ? `
                <div class="detail-section">
                    <h4><i class="fas fa-image"></i> Schaubilder</h4>
                    <div class="bilder-grid">
                        ${p.bilder.map(b => `
                            <div class="bild-card">
                                <img src="images/${esc(b)}" alt="${esc(b)}" loading="lazy"
                                     onerror="this.parentElement.innerHTML='<div class=bild-placeholder>Bild nicht gefunden: ${esc(b)}</div>'">
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : `
                <div class="detail-section">
                    <h4><i class="fas fa-image"></i> Schaubilder</h4>
                    <div class="bild-placeholder" style="border:1px dashed var(--border); padding: 20px; border-radius: var(--radius-sm);">
                        Noch keine Schaubilder. Lade Bilder in den Ordner <code>images/</code> hoch.
                    </div>
                </div>
            `}

            ${(p.querverweise || []).length ? `
                <div class="detail-section">
                    <h4><i class="fas fa-link"></i> Querverweise</h4>
                    <div>
                        ${p.querverweise.map(refId => {
                            const ref = Data.getParagraph(refId);
                            if (!ref) return `<span class="querverweis-link" style="opacity:0.5">${esc(refId)} (nicht gefunden)</span>`;
                            return `<button class="querverweis-link" data-querverweis="${esc(refId)}">
                                <span style="color:${esc(ref.regelwerkFarbe)}; font-weight: 700">${esc(ref.regelwerkKuerzel)}</span>
                                ${esc(ref.nummer)} - ${esc(ref.titel)}
                            </button>`;
                        }).join('')}
                    </div>
                </div>
            ` : ''}

            ${userNote ? `
                <div class="detail-section">
                    <h4><i class="fas fa-pen-to-square"></i> Meine Notiz</h4>
                    <div class="user-note">${esc(userNote)}</div>
                </div>
            ` : ''}
        `;

        body.querySelectorAll('[data-querverweis]').forEach(b => {
            b.addEventListener('click', () => {
                closeDialog('paragraph-dialog');
                setTimeout(() => showParagraph(b.dataset.querverweis), 100);
            });
        });

        openDialog('paragraph-dialog');
    }

    // ============ RENDER: SEARCH ============
    function renderFilterChips() {
        const chips = $('#filter-chips');
        const regelwerke = Data.getRegelwerke();
        chips.innerHTML = regelwerke.map(rw => `
            <button class="chip ${activeRegelwerkFilter === rw.id ? 'active' : ''}"
                    data-filter="${esc(rw.id)}"
                    style="${activeRegelwerkFilter === rw.id ? `background:${esc(rw.farbe)}; border-color:${esc(rw.farbe)}` : ''}">
                ${esc(rw.kuerzel)}
            </button>
        `).join('');
        chips.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.filter;
                activeRegelwerkFilter = activeRegelwerkFilter === id ? null : id;
                renderFilterChips();
                renderSearch(currentQuery);
            });
        });
    }

    function renderSearch(query) {
        currentQuery = query;
        const area = $('#content-area');
        const results = Search.suche(query, {
            regelwerkFilter: activeRegelwerkFilter
        });

        if (!query && !activeRegelwerkFilter) {
            area.innerHTML = `
                <div class="empty">
                    <i class="fas fa-search"></i>
                    <p>Tippe einen Suchbegriff ein, um in allen Regelwerken zu suchen.</p>
                    <p style="font-size: 0.85rem;">Beispiele: "PSA", "Unterweisung", "&sect; 3", "Dienstausweis"</p>
                </div>
            `;
            return;
        }

        if (results.length === 0) {
            area.innerHTML = `
                <div class="empty">
                    <i class="fas fa-circle-question"></i>
                    <p>Keine Treffer fuer "${esc(query)}".</p>
                </div>
            `;
            return;
        }

        area.innerHTML = `
            <p style="color: var(--text-muted); padding: 4px;">
                ${results.length} ${results.length === 1 ? 'Treffer' : 'Treffer'}
            </p>
            ${results.map(p => {
                const rw = Data.getRegelwerk(p.regelwerkId);
                return renderParagraphCard(p, rw, query);
            }).join('')}
        `;

        area.querySelectorAll('[data-paragraph]').forEach(btn => {
            btn.addEventListener('click', () => showParagraph(btn.dataset.paragraph));
        });
    }

    // ============ RENDER: FAVORITEN ============
    function renderFavoriten() {
        const area = $('#content-area');
        const favIds = Storage.getFavoriten();
        const favs = favIds.map(id => Data.getParagraph(id)).filter(Boolean);

        if (favs.length === 0) {
            area.innerHTML = `
                <div class="empty">
                    <i class="fas fa-star"></i>
                    <p>Noch keine Favoriten.</p>
                    <p style="font-size: 0.85rem;">Tippe in einem Paragraphen oben rechts auf den Stern.</p>
                </div>
            `;
            return;
        }

        area.innerHTML = `
            <h2 style="margin: 8px 4px;"><i class="fas fa-star"></i> Favoriten (${favs.length})</h2>
            ${favs.map(p => {
                const rw = Data.getRegelwerk(p.regelwerkId);
                return renderParagraphCard(p, rw);
            }).join('')}
        `;
        area.querySelectorAll('[data-paragraph]').forEach(btn => {
            btn.addEventListener('click', () => showParagraph(btn.dataset.paragraph));
        });
    }

    // ============ RENDER: NOTIZEN ============
    function renderNotizen() {
        const area = $('#content-area');
        const notizen = Storage.getNotizen();
        const ids = Object.keys(notizen);
        const items = ids.map(id => Data.getParagraph(id)).filter(Boolean);

        if (items.length === 0) {
            area.innerHTML = `
                <div class="empty">
                    <i class="fas fa-pen-to-square"></i>
                    <p>Noch keine Notizen.</p>
                    <p style="font-size: 0.85rem;">Oeffne einen Paragraphen und tippe auf "Notiz bearbeiten".</p>
                </div>
            `;
            return;
        }

        area.innerHTML = `
            <h2 style="margin: 8px 4px;"><i class="fas fa-pen-to-square"></i> Meine Notizen (${items.length})</h2>
            ${items.map(p => {
                const rw = Data.getRegelwerk(p.regelwerkId);
                return renderParagraphCard(p, rw);
            }).join('')}
        `;
        area.querySelectorAll('[data-paragraph]').forEach(btn => {
            btn.addEventListener('click', () => showParagraph(btn.dataset.paragraph));
        });
    }

    // ============ RENDER: VERLAUF ============
    function renderVerlauf() {
        const area = $('#content-area');
        const verlauf = Storage.getVerlauf();
        const items = verlauf.map(id => Data.getParagraph(id)).filter(Boolean);

        if (items.length === 0) {
            area.innerHTML = `
                <div class="empty">
                    <i class="fas fa-clock-rotate-left"></i>
                    <p>Noch kein Verlauf.</p>
                </div>
            `;
            return;
        }

        area.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; margin: 8px 4px;">
                <h2><i class="fas fa-clock-rotate-left"></i> Verlauf</h2>
                <button class="secondary-btn" id="btn-clear-verlauf" style="flex:0; padding: 0 12px;">
                    <i class="fas fa-trash"></i> Leeren
                </button>
            </div>
            ${items.map(p => {
                const rw = Data.getRegelwerk(p.regelwerkId);
                return renderParagraphCard(p, rw);
            }).join('')}
        `;
        $('#btn-clear-verlauf').addEventListener('click', () => {
            Storage.clearVerlauf();
            renderVerlauf();
            toast('Verlauf geleert');
        });
        area.querySelectorAll('[data-paragraph]').forEach(btn => {
            btn.addEventListener('click', () => showParagraph(btn.dataset.paragraph));
        });
    }

    // ============ DIALOG ============
    function openDialog(id) {
        const el = document.getElementById(id);
        if (el) {
            el.hidden = false;
            document.body.style.overflow = 'hidden';
        }
    }
    function closeDialog(id) {
        const el = document.getElementById(id);
        if (el) el.hidden = true;
        document.body.style.overflow = '';
    }

    return {
        toast, openSidebar, closeSidebar, renderSidebarRegelwerke,
        applyTheme, toggleTheme,
        showView, showRegelwerk, showParagraph, renderSearch, renderFilterChips,
        openDialog, closeDialog,
        getCurrentParagraph: () => currentParagraph,
        refreshCurrent() {
            if (currentView === 'favoriten') renderFavoriten();
            else if (currentView === 'notizen') renderNotizen();
            else if (currentView === 'verlauf') renderVerlauf();
            else if (currentView === 'regelwerk' && currentRegelwerk) showRegelwerk(currentRegelwerk.id);
        }
    };
})();
