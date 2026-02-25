/**
 * VoiceNote App - Main application logic
 * Ties together Storage, Recorder, Editor, Drawing, and UI modules
 */
const App = (() => {
    // Current state
    let currentNotebookId = null;
    let currentSectionId = null;
    let currentPageId = null;
    let zoomLevel = 100;
    let searchResults = null;
    let viewMode = null; // null, 'favorites', 'recent', 'recordings', 'trash'

    // ===== Initialization =====
    function init() {
        // Initialize UI
        UI.initModals();
        UI.initContextMenu();
        UI.initToolbarTabs();

        // Initialize Editor
        Editor.init('editor', (content) => {
            savePage({ content });
            updateSaveStatus();
        });

        // Initialize Drawing
        Drawing.init('drawing-canvas', 'drawing-canvas-container', (data) => {
            savePage({ drawing: data });
        });

        // Initialize Recorder
        Recorder.setCallbacks({
            onStateChange: handleRecorderStateChange,
            onComplete: handleRecordingComplete
        });

        // Load settings
        const settings = Storage.getSettings();
        if (settings.darkMode) document.body.classList.add('dark-mode');
        zoomLevel = settings.zoom || 100;
        applyZoom();

        // Initialize or load default data
        const defaults = Storage.initDefaults();
        if (defaults) {
            currentNotebookId = defaults.notebookId;
            currentSectionId = defaults.sectionId;
            currentPageId = defaults.pageId;
        } else {
            const notebooks = Storage.getNotebooks();
            if (notebooks.length > 0) {
                currentNotebookId = notebooks[0].id;
                const sections = Storage.getSections(currentNotebookId);
                if (sections.length > 0) {
                    currentSectionId = sections[0].id;
                    const pages = Storage.getPages(currentNotebookId, currentSectionId);
                    if (pages.length > 0) {
                        currentPageId = pages[0].id;
                    }
                }
            }
        }

        // Render everything
        renderNotebooks();
        renderSections();
        renderPages();
        loadCurrentPage();

        // Bind events
        bindEvents();

        // Auto-save periodically
        setInterval(autoSave, 30000);
    }

    // ===== Event Binding =====
    function bindEvents() {
        // Sidebar
        document.getElementById('btn-toggle-sidebar').addEventListener('click', UI.toggleSidebar);
        document.getElementById('btn-add-notebook').addEventListener('click', addNotebook);
        document.getElementById('btn-add-section').addEventListener('click', addSection);
        document.getElementById('btn-add-page').addEventListener('click', addPage);

        // Search
        document.getElementById('search-input').addEventListener('input', debounce(handleSearch, 300));

        // Quick access
        document.getElementById('btn-favorites').addEventListener('click', showFavorites);
        document.getElementById('btn-recent').addEventListener('click', showRecent);
        document.getElementById('btn-all-recordings').addEventListener('click', showAllRecordings);
        document.getElementById('btn-trash').addEventListener('click', showTrash);

        // Page header
        document.getElementById('page-title').addEventListener('input', debounce(() => {
            savePage({ title: document.getElementById('page-title').value });
            renderPages();
        }, 500));

        document.getElementById('btn-add-tag').addEventListener('click', openTagModal);
        document.getElementById('btn-toggle-favorite').addEventListener('click', toggleFavorite);

        // Toolbar - Home tab
        document.querySelectorAll('[data-command]').forEach(btn => {
            btn.addEventListener('click', () => {
                const cmd = btn.dataset.command;
                if (cmd === 'insertCheckbox') {
                    Editor.insertCheckbox();
                } else if (cmd === 'highlight') {
                    Editor.setHighlightColor(document.getElementById('bg-color').value);
                } else {
                    Editor.execCommand(cmd);
                }
            });
        });

        document.getElementById('font-family').addEventListener('change', (e) => {
            Editor.setFontFamily(e.target.value);
        });

        document.getElementById('font-size').addEventListener('change', (e) => {
            Editor.setFontSize(e.target.value);
        });

        document.getElementById('text-color').addEventListener('input', (e) => {
            Editor.setTextColor(e.target.value);
        });

        document.getElementById('bg-color').addEventListener('input', (e) => {
            Editor.setHighlightColor(e.target.value);
        });

        // Toolbar - Insert tab
        document.getElementById('btn-record').addEventListener('click', toggleRecorder);
        document.getElementById('btn-insert-table').addEventListener('click', () => UI.openModal('modal-table'));
        document.getElementById('btn-insert-image').addEventListener('click', () => {
            document.getElementById('file-input-image').click();
        });
        document.getElementById('btn-insert-link').addEventListener('click', () => UI.openModal('modal-link'));
        document.getElementById('btn-insert-file').addEventListener('click', () => {
            document.getElementById('file-input-file').click();
        });
        document.getElementById('btn-insert-divider').addEventListener('click', () => Editor.insertDivider());
        document.getElementById('btn-insert-code').addEventListener('click', () => Editor.insertCodeBlock());

        // File inputs
        document.getElementById('file-input-image').addEventListener('change', (e) => {
            if (e.target.files[0]) {
                Editor.insertImageFromFile(e.target.files[0]);
                e.target.value = '';
            }
        });

        document.getElementById('file-input-file').addEventListener('change', (e) => {
            if (e.target.files[0]) {
                Editor.insertFile(e.target.files[0]);
                e.target.value = '';
            }
        });

        // Table modal
        document.getElementById('btn-create-table').addEventListener('click', () => {
            const rows = parseInt(document.getElementById('table-rows').value) || 3;
            const cols = parseInt(document.getElementById('table-cols').value) || 3;
            Editor.insertTable(rows, cols);
            UI.closeModal('modal-table');
        });

        // Link modal
        document.getElementById('btn-create-link').addEventListener('click', () => {
            const url = document.getElementById('link-url').value;
            const text = document.getElementById('link-text').value;
            if (url) {
                Editor.insertLink(url, text);
                UI.closeModal('modal-link');
                document.getElementById('link-url').value = '';
                document.getElementById('link-text').value = '';
            }
        });

        // Tag modal
        document.getElementById('btn-create-tag').addEventListener('click', addTag);
        document.getElementById('tag-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') addTag();
        });

        // Toolbar - Draw tab
        document.querySelectorAll('.draw-tool').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.draw-tool').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                Drawing.setTool(btn.dataset.tool);
            });
        });

        document.getElementById('draw-color').addEventListener('input', (e) => {
            Drawing.setColor(e.target.value);
        });

        document.getElementById('draw-size').addEventListener('change', (e) => {
            Drawing.setSize(e.target.value);
        });

        document.getElementById('btn-toggle-canvas').addEventListener('click', () => {
            const active = Drawing.toggle();
            document.getElementById('btn-toggle-canvas').classList.toggle('active', active);
        });

        document.getElementById('btn-clear-canvas').addEventListener('click', () => {
            if (UI.confirm('Zeichnung wirklich löschen?')) {
                Drawing.clear();
            }
        });

        document.getElementById('btn-save-drawing').addEventListener('click', () => {
            const dataUrl = Drawing.toDataURL();
            if (dataUrl) {
                Editor.insertImage(dataUrl);
                UI.showToast('Zeichnung als Bild eingefügt', 'success');
            }
        });

        // Toolbar - View tab
        document.getElementById('btn-fullscreen').addEventListener('click', toggleFullscreen);
        document.getElementById('btn-dark-mode').addEventListener('click', toggleDarkMode);
        document.getElementById('btn-zoom-in').addEventListener('click', () => changeZoom(10));
        document.getElementById('btn-zoom-out').addEventListener('click', () => changeZoom(-10));
        document.getElementById('btn-export').addEventListener('click', () => UI.openModal('modal-export'));
        document.getElementById('btn-import').addEventListener('click', () => {
            document.getElementById('file-input-import').click();
        });
        document.getElementById('btn-print').addEventListener('click', () => window.print());

        // Export options
        document.querySelectorAll('.export-option').forEach(btn => {
            btn.addEventListener('click', () => handleExport(btn.dataset.format));
        });

        // Import
        document.getElementById('file-input-import').addEventListener('change', handleImport);

        // Voice recorder
        document.getElementById('btn-rec-start').addEventListener('click', startRecording);
        document.getElementById('btn-rec-pause').addEventListener('click', () => Recorder.pauseRecording());
        document.getElementById('btn-rec-resume').addEventListener('click', () => Recorder.resumeRecording());
        document.getElementById('btn-rec-stop').addEventListener('click', () => Recorder.stopRecording());
        document.getElementById('btn-close-recordings').addEventListener('click', () => {
            document.getElementById('recordings-panel').classList.add('hidden');
        });

        // Context menu actions
        document.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', () => handleContextAction(item.dataset.action));
        });
    }

    // ===== Notebook Management =====
    async function addNotebook() {
        const result = await UI.showInputModal('Neues Notizbuch', 'Name:', '', false);
        if (result.value) {
            const nb = Storage.createNotebook(result.value);
            currentNotebookId = nb.id;
            currentSectionId = null;
            currentPageId = null;
            renderNotebooks();
            renderSections();
            renderPages();
            loadCurrentPage();
            UI.showToast(`Notizbuch "${result.value}" erstellt`, 'success');
        }
    }

    function selectNotebook(id) {
        viewMode = null;
        currentNotebookId = id;
        const sections = Storage.getSections(id);
        currentSectionId = sections.length > 0 ? sections[0].id : null;
        if (currentSectionId) {
            const pages = Storage.getPages(id, currentSectionId);
            currentPageId = pages.length > 0 ? pages[0].id : null;
        } else {
            currentPageId = null;
        }
        renderNotebooks();
        renderSections();
        renderPages();
        loadCurrentPage();
    }

    function renderNotebooks() {
        const list = document.getElementById('notebooks-list');
        const notebooks = Storage.getNotebooks();
        list.innerHTML = '';

        notebooks.forEach(nb => {
            const el = document.createElement('div');
            el.className = `notebook-item ${nb.id === currentNotebookId ? 'active' : ''}`;
            el.innerHTML = `
                <span class="item-icon"><i class="fas fa-book"></i></span>
                <span>${escapeHtml(nb.name)}</span>
            `;
            el.addEventListener('click', () => selectNotebook(nb.id));
            el.addEventListener('contextmenu', (e) => {
                UI.showContextMenu(e, 'notebook', { id: nb.id, name: nb.name });
            });
            list.appendChild(el);
        });
    }

    // ===== Section Management =====
    async function addSection() {
        if (!currentNotebookId) {
            UI.showToast('Bitte zuerst ein Notizbuch auswählen', 'warning');
            return;
        }
        const result = await UI.showInputModal('Neuer Abschnitt', 'Name:', '', true);
        if (result.value) {
            const section = Storage.createSection(currentNotebookId, result.value, result.color);
            currentSectionId = section.id;
            currentPageId = null;
            renderSections();
            renderPages();
            loadCurrentPage();
            UI.showToast(`Abschnitt "${result.value}" erstellt`, 'success');
        }
    }

    function selectSection(id) {
        viewMode = null;
        currentSectionId = id;
        const pages = Storage.getPages(currentNotebookId, id);
        currentPageId = pages.length > 0 ? pages[0].id : null;
        renderSections();
        renderPages();
        loadCurrentPage();
    }

    function renderSections() {
        const list = document.getElementById('sections-list');
        if (!currentNotebookId) {
            list.innerHTML = '<div style="padding:8px 16px;color:var(--text-muted);font-size:0.85rem">Kein Notizbuch ausgewählt</div>';
            return;
        }

        const sections = Storage.getSections(currentNotebookId);
        list.innerHTML = '';

        sections.forEach(sec => {
            const el = document.createElement('div');
            el.className = `section-item ${sec.id === currentSectionId ? 'active' : ''}`;
            el.innerHTML = `
                <span class="item-color" style="background:${sec.color}"></span>
                <span>${escapeHtml(sec.name)}</span>
            `;
            el.addEventListener('click', () => selectSection(sec.id));
            el.addEventListener('contextmenu', (e) => {
                UI.showContextMenu(e, 'section', { id: sec.id, name: sec.name, color: sec.color });
            });
            list.appendChild(el);
        });
    }

    // ===== Page Management =====
    async function addPage() {
        if (!currentNotebookId || !currentSectionId) {
            UI.showToast('Bitte zuerst Notizbuch und Abschnitt auswählen', 'warning');
            return;
        }
        const page = Storage.createPage(currentNotebookId, currentSectionId, 'Neue Seite');
        currentPageId = page.id;
        renderPages();
        loadCurrentPage();
        // Focus title for editing
        setTimeout(() => {
            const titleInput = document.getElementById('page-title');
            titleInput.focus();
            titleInput.select();
        }, 100);
    }

    function selectPage(notebookId, sectionId, pageId) {
        viewMode = null;
        if (notebookId !== currentNotebookId) {
            currentNotebookId = notebookId;
            renderNotebooks();
        }
        if (sectionId !== currentSectionId) {
            currentSectionId = sectionId;
            renderSections();
        }
        currentPageId = pageId;
        renderPages();
        loadCurrentPage();
    }

    function renderPages() {
        const list = document.getElementById('pages-list');
        if (!currentNotebookId || !currentSectionId) {
            list.innerHTML = '<div style="padding:8px 16px;color:var(--text-muted);font-size:0.85rem">Kein Abschnitt ausgewählt</div>';
            return;
        }

        const pages = Storage.getPages(currentNotebookId, currentSectionId);
        list.innerHTML = '';

        pages.forEach(page => {
            const el = document.createElement('div');
            el.className = `page-item ${page.id === currentPageId ? 'active' : ''}`;

            const preview = page.content ? stripHtml(page.content).substring(0, 40) : '';
            const icons = [];
            if (page.favorite) icons.push('<i class="fas fa-star" style="color:var(--warning)"></i>');
            if (page.recordings && page.recordings.length > 0) icons.push('<i class="fas fa-microphone"></i>');

            el.innerHTML = `
                <div class="page-info">
                    <span class="page-name">${escapeHtml(page.title)}</span>
                    <span class="page-preview">${UI.formatDateShort(page.updatedAt)}${preview ? ' - ' + escapeHtml(preview) : ''}</span>
                </div>
                <div class="page-icons">${icons.join('')}</div>
            `;
            el.addEventListener('click', () => {
                currentPageId = page.id;
                renderPages();
                loadCurrentPage();
            });
            el.addEventListener('contextmenu', (e) => {
                UI.showContextMenu(e, 'page', { id: page.id, title: page.title });
            });
            list.appendChild(el);
        });
    }

    function loadCurrentPage() {
        const titleEl = document.getElementById('page-title');
        const dateEl = document.getElementById('page-date');
        const tagsEl = document.getElementById('page-tags-display');
        const favBtn = document.getElementById('btn-toggle-favorite');

        if (!currentPageId || !currentNotebookId || !currentSectionId) {
            titleEl.value = '';
            dateEl.textContent = '';
            tagsEl.innerHTML = '';
            Editor.setContent('');
            favBtn.innerHTML = '<i class="far fa-star"></i>';
            Drawing.loadDrawing(null);
            return;
        }

        const page = Storage.getPage(currentNotebookId, currentSectionId, currentPageId);
        if (!page) return;

        titleEl.value = page.title || '';
        dateEl.textContent = UI.formatDate(page.updatedAt);
        Editor.setContent(page.content || '');
        Drawing.loadDrawing(page.drawing);

        // Tags
        tagsEl.innerHTML = '';
        if (page.tags && page.tags.length > 0) {
            page.tags.forEach(tag => {
                const span = document.createElement('span');
                span.className = 'tag';
                span.textContent = tag;
                tagsEl.appendChild(span);
            });
        }

        // Favorite
        favBtn.innerHTML = page.favorite
            ? '<i class="fas fa-star" style="color:var(--warning)"></i>'
            : '<i class="far fa-star"></i>';

        // Recordings
        renderPageRecordings(page);
    }

    function savePage(updates) {
        if (!currentPageId || !currentNotebookId || !currentSectionId) return;
        Storage.updatePage(currentNotebookId, currentSectionId, currentPageId, updates);
    }

    function autoSave() {
        if (!currentPageId) return;
        savePage({ content: Editor.getContent() });
        updateSaveStatus();
    }

    function updateSaveStatus() {
        const el = document.getElementById('save-status');
        el.textContent = 'Gespeichert';
        el.style.color = '';
        setTimeout(() => {
            el.textContent = 'Gespeichert';
        }, 2000);
    }

    // ===== Voice Recording =====
    function toggleRecorder() {
        const recorder = document.getElementById('voice-recorder');
        recorder.classList.toggle('hidden');
    }

    async function startRecording() {
        const success = await Recorder.startRecording();
        if (!success) {
            UI.showToast('Mikrofon-Zugriff verweigert. Bitte erlaube den Zugriff in den Browser-Einstellungen.', 'error');
        }
    }

    function handleRecorderStateChange(state, error) {
        const statusEl = document.getElementById('rec-status');
        const startBtn = document.getElementById('btn-rec-start');
        const pauseBtn = document.getElementById('btn-rec-pause');
        const resumeBtn = document.getElementById('btn-rec-resume');
        const stopBtn = document.getElementById('btn-rec-stop');

        switch (state) {
            case 'recording':
                statusEl.textContent = 'Aufnahme...';
                statusEl.classList.add('recording');
                startBtn.classList.add('hidden');
                pauseBtn.classList.remove('hidden');
                resumeBtn.classList.add('hidden');
                stopBtn.classList.remove('hidden');
                break;
            case 'paused':
                statusEl.textContent = 'Pausiert';
                statusEl.classList.remove('recording');
                pauseBtn.classList.add('hidden');
                resumeBtn.classList.remove('hidden');
                break;
            case 'stopped':
                statusEl.textContent = 'Bereit';
                statusEl.classList.remove('recording');
                startBtn.classList.remove('hidden');
                pauseBtn.classList.add('hidden');
                resumeBtn.classList.add('hidden');
                stopBtn.classList.add('hidden');
                document.getElementById('rec-timer').textContent = '00:00';
                break;
            case 'error':
                statusEl.textContent = 'Fehler';
                statusEl.classList.remove('recording');
                UI.showToast(`Aufnahmefehler: ${error}`, 'error');
                break;
        }
    }

    function handleRecordingComplete(recording) {
        if (!currentPageId) {
            UI.showToast('Bitte zuerst eine Seite auswählen', 'warning');
            return;
        }

        // Save recording to page
        const page = Storage.getPage(currentNotebookId, currentSectionId, currentPageId);
        if (!page) return;

        const recordings = page.recordings || [];
        recordings.push({
            id: recording.id,
            name: recording.name,
            data: recording.data,
            duration: recording.duration,
            durationMs: recording.durationMs,
            createdAt: recording.createdAt
        });

        savePage({ recordings });

        // Insert audio player into editor
        Editor.insertAudioAttachment(recording);

        renderPages();
        renderPageRecordings(page);
        UI.showToast('Sprachaufnahme gespeichert!', 'success');
    }

    function renderPageRecordings(page) {
        const panel = document.getElementById('recordings-panel');
        const list = document.getElementById('recordings-list');

        if (!page || !page.recordings || page.recordings.length === 0) {
            panel.classList.add('hidden');
            return;
        }

        list.innerHTML = '';
        page.recordings.forEach((rec, idx) => {
            const el = document.createElement('div');
            el.className = 'recording-item';
            el.innerHTML = `
                <div class="audio-icon" style="width:28px;height:28px;font-size:0.75rem;background:var(--primary);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;">
                    <i class="fas fa-play"></i>
                </div>
                <div style="flex:1">
                    <div style="font-size:0.85rem;font-weight:500">${escapeHtml(rec.name)}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted)">${rec.duration} - ${UI.formatDate(rec.createdAt)}</div>
                </div>
                <audio controls src="${rec.data}" preload="none" style="max-width:180px;height:28px"></audio>
                <button class="btn-icon-sm" title="Löschen" data-idx="${idx}">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            // Delete recording
            el.querySelector('button').addEventListener('click', () => {
                if (UI.confirm('Aufnahme löschen?')) {
                    const p = Storage.getPage(currentNotebookId, currentSectionId, currentPageId);
                    p.recordings.splice(idx, 1);
                    savePage({ recordings: p.recordings });
                    renderPageRecordings(p);
                    renderPages();
                    UI.showToast('Aufnahme gelöscht', 'info');
                }
            });

            list.appendChild(el);
        });

        panel.classList.remove('hidden');
    }

    // ===== Tags =====
    function openTagModal() {
        if (!currentPageId) return;
        const page = Storage.getPage(currentNotebookId, currentSectionId, currentPageId);
        if (!page) return;

        renderTagList(page.tags || []);
        UI.openModal('modal-tag');
    }

    function addTag() {
        const input = document.getElementById('tag-input');
        const tag = input.value.trim();
        if (!tag || !currentPageId) return;

        const page = Storage.getPage(currentNotebookId, currentSectionId, currentPageId);
        if (!page) return;

        const tags = page.tags || [];
        if (!tags.includes(tag)) {
            tags.push(tag);
            savePage({ tags });
            renderTagList(tags);
            loadCurrentPage();
            UI.showToast(`Tag "${tag}" hinzugefügt`, 'success');
        }
        input.value = '';
    }

    function removeTag(tag) {
        const page = Storage.getPage(currentNotebookId, currentSectionId, currentPageId);
        if (!page) return;

        const tags = (page.tags || []).filter(t => t !== tag);
        savePage({ tags });
        renderTagList(tags);
        loadCurrentPage();
    }

    function renderTagList(tags) {
        const list = document.getElementById('tag-list');
        list.innerHTML = '';
        tags.forEach(tag => {
            const el = document.createElement('div');
            el.className = 'tag-item';
            el.innerHTML = `
                <span>${escapeHtml(tag)}</span>
                <button class="tag-remove" title="Entfernen">&times;</button>
            `;
            el.querySelector('.tag-remove').addEventListener('click', () => removeTag(tag));
            list.appendChild(el);
        });
    }

    // ===== Favorite =====
    function toggleFavorite() {
        if (!currentPageId) return;
        const page = Storage.getPage(currentNotebookId, currentSectionId, currentPageId);
        if (!page) return;
        savePage({ favorite: !page.favorite });
        loadCurrentPage();
        renderPages();
        UI.showToast(page.favorite ? 'Favorit entfernt' : 'Als Favorit markiert', 'info');
    }

    // ===== Search =====
    function handleSearch(e) {
        const query = e.target.value.trim();
        if (!query) {
            viewMode = null;
            renderPages();
            return;
        }

        const results = Storage.search(query);
        renderSearchResults(results);
    }

    function renderSearchResults(results) {
        const list = document.getElementById('pages-list');
        list.innerHTML = '';

        if (results.length === 0) {
            list.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:0.85rem">Keine Ergebnisse</div>';
            return;
        }

        results.forEach(r => {
            const el = document.createElement('div');
            el.className = 'page-item';
            el.innerHTML = `
                <div class="page-info">
                    <span class="page-name">${escapeHtml(r.page.title)}</span>
                    <span class="page-preview">${escapeHtml(r.notebookName)} / ${escapeHtml(r.sectionName)}</span>
                </div>
            `;
            el.addEventListener('click', () => selectPage(r.notebookId, r.sectionId, r.page.id));
            list.appendChild(el);
        });
    }

    // ===== Quick Access Views =====
    function showFavorites() {
        viewMode = 'favorites';
        const results = Storage.getFavorites();
        const list = document.getElementById('pages-list');
        list.innerHTML = '';

        if (results.length === 0) {
            list.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:0.85rem">Keine Favoriten</div>';
            return;
        }

        results.forEach(r => {
            const el = document.createElement('div');
            el.className = `page-item ${r.page.id === currentPageId ? 'active' : ''}`;
            el.innerHTML = `
                <div class="page-info">
                    <span class="page-name"><i class="fas fa-star" style="color:var(--warning);margin-right:6px"></i>${escapeHtml(r.page.title)}</span>
                    <span class="page-preview">${UI.formatDateShort(r.page.updatedAt)}</span>
                </div>
            `;
            el.addEventListener('click', () => selectPage(r.notebookId, r.sectionId, r.page.id));
            list.appendChild(el);
        });
    }

    function showRecent() {
        viewMode = 'recent';
        const results = Storage.getRecent(15);
        const list = document.getElementById('pages-list');
        list.innerHTML = '';

        if (results.length === 0) {
            list.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:0.85rem">Keine Seiten</div>';
            return;
        }

        results.forEach(r => {
            const el = document.createElement('div');
            el.className = `page-item ${r.page.id === currentPageId ? 'active' : ''}`;
            el.innerHTML = `
                <div class="page-info">
                    <span class="page-name">${escapeHtml(r.page.title)}</span>
                    <span class="page-preview">${UI.formatDate(r.page.updatedAt)}</span>
                </div>
            `;
            el.addEventListener('click', () => selectPage(r.notebookId, r.sectionId, r.page.id));
            list.appendChild(el);
        });
    }

    function showAllRecordings() {
        viewMode = 'recordings';
        const results = Storage.getAllRecordings();
        const list = document.getElementById('pages-list');
        list.innerHTML = '';

        if (results.length === 0) {
            list.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:0.85rem">Keine Aufnahmen</div>';
            return;
        }

        results.forEach(r => {
            const el = document.createElement('div');
            el.className = 'page-item';
            el.innerHTML = `
                <div class="page-info">
                    <span class="page-name"><i class="fas fa-microphone" style="margin-right:6px"></i>${escapeHtml(r.recording.name)}</span>
                    <span class="page-preview">${escapeHtml(r.pageTitle)} - ${r.recording.duration}</span>
                </div>
            `;
            el.addEventListener('click', () => selectPage(r.notebookId, r.sectionId, r.pageId));
            list.appendChild(el);
        });
    }

    function showTrash() {
        viewMode = 'trash';
        const trash = Storage.getTrash();
        const list = document.getElementById('pages-list');
        list.innerHTML = '';

        if (trash.length === 0) {
            list.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:0.85rem">Papierkorb ist leer</div>';
            return;
        }

        trash.forEach((item, idx) => {
            const el = document.createElement('div');
            el.className = 'page-item';
            const icon = item.type === 'notebook' ? 'fa-book' : item.type === 'section' ? 'fa-folder' : 'fa-file';
            el.innerHTML = `
                <div class="page-info">
                    <span class="page-name"><i class="fas ${icon}" style="margin-right:6px"></i>${escapeHtml(item.title || item.name)}</span>
                    <span class="page-preview">Gelöscht: ${UI.formatDate(item.deletedAt)}</span>
                </div>
            `;
            list.appendChild(el);
        });

        // Empty trash button
        if (trash.length > 0) {
            const btn = document.createElement('div');
            btn.style.padding = '12px 16px';
            btn.innerHTML = '<button class="btn-secondary" style="width:100%"><i class="fas fa-trash"></i> Papierkorb leeren</button>';
            btn.querySelector('button').addEventListener('click', () => {
                if (UI.confirm('Papierkorb wirklich leeren? Dies kann nicht rückgängig gemacht werden.')) {
                    Storage.emptyTrash();
                    showTrash();
                    UI.showToast('Papierkorb geleert', 'info');
                }
            });
            list.appendChild(btn);
        }
    }

    // ===== Context Menu Actions =====
    async function handleContextAction(action) {
        UI.hideContextMenu();
        const info = UI.getContextMenuInfo();
        if (!info.target) return;

        switch (action) {
            case 'rename': {
                const result = await UI.showInputModal(
                    'Umbenennen',
                    'Neuer Name:',
                    info.target.name || info.target.title,
                    info.type === 'section'
                );
                if (result.value) {
                    if (info.type === 'notebook') {
                        Storage.updateNotebook(info.target.id, { name: result.value });
                        renderNotebooks();
                    } else if (info.type === 'section') {
                        Storage.updateSection(currentNotebookId, info.target.id, {
                            name: result.value,
                            color: result.color
                        });
                        renderSections();
                    } else if (info.type === 'page') {
                        Storage.updatePage(currentNotebookId, currentSectionId, info.target.id, {
                            title: result.value
                        });
                        renderPages();
                        if (info.target.id === currentPageId) loadCurrentPage();
                    }
                    UI.showToast('Umbenannt', 'success');
                }
                break;
            }
            case 'duplicate': {
                if (info.type === 'page') {
                    const original = Storage.getPage(currentNotebookId, currentSectionId, info.target.id);
                    if (original) {
                        const newPage = Storage.createPage(currentNotebookId, currentSectionId, original.title + ' (Kopie)');
                        Storage.updatePage(currentNotebookId, currentSectionId, newPage.id, {
                            content: original.content,
                            tags: [...(original.tags || [])],
                            recordings: [...(original.recordings || [])]
                        });
                        renderPages();
                        UI.showToast('Seite dupliziert', 'success');
                    }
                }
                break;
            }
            case 'favorite': {
                if (info.type === 'page') {
                    const page = Storage.getPage(currentNotebookId, currentSectionId, info.target.id);
                    if (page) {
                        Storage.updatePage(currentNotebookId, currentSectionId, info.target.id, {
                            favorite: !page.favorite
                        });
                        renderPages();
                        if (info.target.id === currentPageId) loadCurrentPage();
                        UI.showToast(page.favorite ? 'Favorit entfernt' : 'Als Favorit markiert', 'info');
                    }
                }
                break;
            }
            case 'delete': {
                const name = info.target.name || info.target.title;
                if (UI.confirm(`"${name}" wirklich löschen?`)) {
                    if (info.type === 'notebook') {
                        Storage.deleteNotebook(info.target.id);
                        if (currentNotebookId === info.target.id) {
                            const notebooks = Storage.getNotebooks();
                            currentNotebookId = notebooks.length > 0 ? notebooks[0].id : null;
                            currentSectionId = null;
                            currentPageId = null;
                        }
                        renderNotebooks();
                        renderSections();
                        renderPages();
                        loadCurrentPage();
                    } else if (info.type === 'section') {
                        Storage.deleteSection(currentNotebookId, info.target.id);
                        if (currentSectionId === info.target.id) {
                            const sections = Storage.getSections(currentNotebookId);
                            currentSectionId = sections.length > 0 ? sections[0].id : null;
                            currentPageId = null;
                        }
                        renderSections();
                        renderPages();
                        loadCurrentPage();
                    } else if (info.type === 'page') {
                        Storage.deletePage(currentNotebookId, currentSectionId, info.target.id);
                        if (currentPageId === info.target.id) {
                            const pages = Storage.getPages(currentNotebookId, currentSectionId);
                            currentPageId = pages.length > 0 ? pages[0].id : null;
                        }
                        renderPages();
                        loadCurrentPage();
                    }
                    UI.showToast(`"${name}" gelöscht`, 'info');
                }
                break;
            }
        }
    }

    // ===== View Controls =====
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        const settings = Storage.getSettings();
        settings.darkMode = isDark;
        Storage.saveSettings(settings);
        UI.showToast(isDark ? 'Dunkelmodus aktiviert' : 'Hellmodus aktiviert', 'info');
    }

    function changeZoom(delta) {
        zoomLevel = Math.max(50, Math.min(200, zoomLevel + delta));
        applyZoom();
        const settings = Storage.getSettings();
        settings.zoom = zoomLevel;
        Storage.saveSettings(settings);
    }

    function applyZoom() {
        const editor = document.querySelector('.editor-wrapper');
        if (editor) {
            editor.style.fontSize = `${zoomLevel}%`;
        }
        document.getElementById('zoom-level').textContent = `${zoomLevel}%`;
    }

    // ===== Export / Import =====
    function handleExport(format) {
        UI.closeModal('modal-export');

        switch (format) {
            case 'html': {
                const page = Storage.getPage(currentNotebookId, currentSectionId, currentPageId);
                if (!page) return;
                const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${escapeHtml(page.title)}</title>
                    <style>body{font-family:Segoe UI,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#1a1a2e}
                    h1{border-bottom:2px solid #4a90d9;padding-bottom:8px}table{border-collapse:collapse;width:100%}
                    td,th{border:1px solid #ddd;padding:8px}img{max-width:100%}</style></head>
                    <body><h1>${escapeHtml(page.title)}</h1>${page.content}</body></html>`;
                downloadFile(`${page.title}.html`, html, 'text/html');
                UI.showToast('Als HTML exportiert', 'success');
                break;
            }
            case 'text': {
                const page = Storage.getPage(currentNotebookId, currentSectionId, currentPageId);
                if (!page) return;
                const text = `${page.title}\n${'='.repeat(page.title.length)}\n\n${Editor.getPlainText()}`;
                downloadFile(`${page.title}.txt`, text, 'text/plain');
                UI.showToast('Als Text exportiert', 'success');
                break;
            }
            case 'json': {
                const allData = Storage.exportAll();
                const json = JSON.stringify(allData, null, 2);
                downloadFile('voicenote-backup.json', json, 'application/json');
                UI.showToast('Backup erstellt', 'success');
                break;
            }
            case 'pdf': {
                window.print();
                break;
            }
        }
    }

    function handleImport(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const success = Storage.importAll(ev.target.result);
                if (success) {
                    // Reload everything
                    const notebooks = Storage.getNotebooks();
                    if (notebooks.length > 0) {
                        currentNotebookId = notebooks[0].id;
                        const sections = Storage.getSections(currentNotebookId);
                        currentSectionId = sections.length > 0 ? sections[0].id : null;
                        if (currentSectionId) {
                            const pages = Storage.getPages(currentNotebookId, currentSectionId);
                            currentPageId = pages.length > 0 ? pages[0].id : null;
                        }
                    }
                    const settings = Storage.getSettings();
                    if (settings.darkMode) document.body.classList.add('dark-mode');
                    else document.body.classList.remove('dark-mode');

                    renderNotebooks();
                    renderSections();
                    renderPages();
                    loadCurrentPage();
                    UI.showToast('Daten erfolgreich importiert!', 'success');
                } else {
                    UI.showToast('Import fehlgeschlagen', 'error');
                }
            } catch {
                UI.showToast('Ungültige Datei', 'error');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    // ===== Utilities =====
    function downloadFile(filename, content, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    function debounce(fn, ms) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), ms);
        };
    }

    return { init };
})();

// Launch the app
document.addEventListener('DOMContentLoaded', App.init);
