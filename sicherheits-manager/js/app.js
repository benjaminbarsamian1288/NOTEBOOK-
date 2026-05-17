/**
 * App - Einstiegspunkt, Event-Wiring
 */
(async function init() {

    UI.applyTheme(Storage.getTheme());

    await Data.loadAll();
    UI.renderSidebarRegelwerke();

    const params = new URLSearchParams(location.search);
    const view = params.get('view');
    const action = params.get('action');

    if (view === 'favoriten') UI.showView('favoriten');
    else if (action === 'search') {
        UI.showView('search');
        setTimeout(() => document.getElementById('search-input').focus(), 200);
    } else if (action === 'ai') {
        UI.showView('home');
        setTimeout(() => openAI(), 200);
    } else {
        UI.showView('home');
    }

    // ============ EVENTS ============
    document.getElementById('btn-menu').addEventListener('click', UI.openSidebar);
    document.getElementById('btn-close-sidebar').addEventListener('click', UI.closeSidebar);
    document.getElementById('sidebar-overlay').addEventListener('click', UI.closeSidebar);

    // Nav-Items (Sidebar + Bottom)
    document.querySelectorAll('.nav-item, .bottom-nav-item[data-view]').forEach(btn => {
        btn.addEventListener('click', () => {
            const v = btn.dataset.view;
            if (!v) return;
            UI.showView(v);
            if (window.innerWidth < 1024) UI.closeSidebar();
            if (v === 'search') {
                setTimeout(() => document.getElementById('search-input').focus(), 100);
            }
        });
    });

    document.getElementById('btn-theme').addEventListener('click', UI.toggleTheme);

    // Search
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

    // Dialog close
    document.querySelectorAll('[data-close]').forEach(el => {
        el.addEventListener('click', () => {
            const dialog = el.closest('.dialog');
            if (dialog) UI.closeDialog(dialog.id);
        });
    });

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

    document.getElementById('btn-edit-notes').addEventListener('click', () => {
        const p = UI.getCurrentParagraph();
        if (!p) return;
        document.getElementById('notes-textarea').value = Storage.getNotiz(p.id);
        UI.openDialog('notes-dialog');
        setTimeout(() => document.getElementById('notes-textarea').focus(), 100);
    });

    document.getElementById('btn-save-notes').addEventListener('click', () => {
        const p = UI.getCurrentParagraph();
        if (!p) return;
        const text = document.getElementById('notes-textarea').value;
        Storage.saveNotiz(p.id, text);
        UI.closeDialog('notes-dialog');
        UI.toast(text.trim() ? 'Notiz gespeichert' : 'Notiz geloescht');
        UI.showParagraph(p.id);
    });

    document.getElementById('btn-share').addEventListener('click', async () => {
        const p = UI.getCurrentParagraph();
        if (!p) return;
        const text = `${p.regelwerkKuerzel} ${p.nummer} - ${p.titel}\n\n${p.text}`;
        if (navigator.share) {
            try { await navigator.share({ title: `${p.regelwerkKuerzel} ${p.nummer}`, text }); } catch (e) {}
        } else {
            try {
                await navigator.clipboard.writeText(text);
                UI.toast('Text in Zwischenablage kopiert');
            } catch (e) { UI.toast('Teilen nicht moeglich'); }
        }
    });

    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (Storage.getTheme() === 'auto') UI.applyTheme('auto');
    });

    // ============ AI ASSISTENTIN ============
    const aiChat = document.getElementById('ai-chat');
    const aiInput = document.getElementById('ai-input');
    const aiSend = document.getElementById('ai-send');
    const aiSuggestions = document.getElementById('ai-suggestions');
    const aiStatus = document.getElementById('ai-status');
    const aiSettingsBtn = document.getElementById('btn-ai-settings');
    const aiSettingsPanel = document.getElementById('ai-settings-panel');
    const aiKeyInput = document.getElementById('ai-key');
    const aiSaveBtn = document.getElementById('btn-ai-save');

    function updateAiStatus() {
        const s = AI.getSettings();
        if (s.apiKey && s.provider) {
            aiStatus.textContent = s.provider === 'anthropic' ? 'Claude verbunden' : 'OpenAI verbunden';
        } else {
            aiStatus.textContent = 'Offline-Modus';
        }
    }

    function loadAiSettingsIntoForm() {
        const s = AI.getSettings();
        const provider = s.provider || '';
        document.querySelectorAll('input[name="ai-provider"]').forEach(r => {
            r.checked = r.value === provider;
        });
        aiKeyInput.value = s.apiKey || '';
    }

    aiSettingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (aiSettingsPanel.hasAttribute('hidden')) {
            loadAiSettingsIntoForm();
            aiSettingsPanel.removeAttribute('hidden');
        } else {
            aiSettingsPanel.setAttribute('hidden', '');
        }
    });

    document.addEventListener('click', (e) => {
        if (!aiSettingsPanel.contains(e.target) && e.target !== aiSettingsBtn && !aiSettingsBtn.contains(e.target)) {
            aiSettingsPanel.setAttribute('hidden', '');
        }
    });

    aiSaveBtn.addEventListener('click', () => {
        const provider = document.querySelector('input[name="ai-provider"]:checked').value;
        const apiKey = aiKeyInput.value.trim();
        AI.saveSettings({ provider, apiKey });
        aiSettingsPanel.setAttribute('hidden', '');
        updateAiStatus();
        UI.toast(provider ? 'API verbunden' : 'Offline-Modus aktiv');
    });

    function renderSuggestions() {
        const suggestions = AI.getRandomSuggestions(4);
        aiSuggestions.innerHTML = suggestions.map(s =>
            `<button class="ai-suggestion" data-q="${escAttr(s)}">${esc(s)}</button>`
        ).join('');
        aiSuggestions.querySelectorAll('.ai-suggestion').forEach(b => {
            b.addEventListener('click', () => sendAi(b.dataset.q));
        });
    }

    function renderWelcome() {
        aiChat.innerHTML = `
            <div class="ai-welcome">
                <div class="big-emoji"><i class="fas fa-sparkles"></i></div>
                <h3>Hallo! Wie kann ich helfen?</h3>
                <p>Ich kenne <strong>DGUV V1, V23, BewachV</strong> und <strong>DIN 77200</strong>.</p>
                <p style="font-size: 0.78rem; margin-top: 12px; opacity: 0.7;">
                    Tippe unten eine Frage ein oder waehle einen Vorschlag.
                </p>
            </div>
        `;
    }

    function appendMsg(role, html) {
        const msg = document.createElement('div');
        msg.className = 'ai-msg ' + role;
        const avatar = role === 'bot'
            ? '<div class="avatar"><i class="fas fa-sparkles"></i></div>'
            : '<div class="avatar"><i class="fas fa-user"></i></div>';
        msg.innerHTML = `${avatar}<div class="bubble">${html}</div>`;
        aiChat.appendChild(msg);

        // Karten klickbar machen
        msg.querySelectorAll('[data-paragraph]').forEach(card => {
            card.addEventListener('click', () => {
                UI.closeDialog('ai-dialog');
                setTimeout(() => UI.showParagraph(card.dataset.paragraph), 150);
            });
        });

        aiChat.scrollTop = aiChat.scrollHeight;
    }

    function appendTyping() {
        const msg = document.createElement('div');
        msg.className = 'ai-msg bot typing-msg';
        msg.innerHTML = `<div class="avatar"><i class="fas fa-sparkles"></i></div>
            <div class="bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
        aiChat.appendChild(msg);
        aiChat.scrollTop = aiChat.scrollHeight;
        return msg;
    }

    async function sendAi(text) {
        const q = (text || aiInput.value).trim();
        if (!q) return;

        if (aiChat.querySelector('.ai-welcome')) aiChat.innerHTML = '';

        appendMsg('user', esc(q));
        aiInput.value = '';
        autoResize();
        aiSend.disabled = true;

        const typing = appendTyping();

        try {
            const result = await AI.answer(q);
            typing.remove();
            appendMsg('bot', result.text);
            renderSuggestions();
        } catch (e) {
            typing.remove();
            appendMsg('bot', '<em>Fehler: ' + esc(e.message || 'Unbekannt') + '</em>');
        } finally {
            aiSend.disabled = false;
            aiInput.focus();
        }
    }

    function openAI() {
        if (!aiChat.children.length) {
            renderWelcome();
            renderSuggestions();
        }
        updateAiStatus();
        UI.openDialog('ai-dialog');
        setTimeout(() => aiInput.focus(), 200);
    }

    document.getElementById('btn-ai').addEventListener('click', openAI);

    aiSend.addEventListener('click', () => sendAi());
    aiInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendAi();
        }
    });

    function autoResize() {
        aiInput.style.height = 'auto';
        aiInput.style.height = Math.min(aiInput.scrollHeight, 120) + 'px';
    }
    aiInput.addEventListener('input', autoResize);

    function esc(s) {
        if (s == null) return '';
        return s.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }
    function escAttr(s) { return esc(s); }

    updateAiStatus();

})();
