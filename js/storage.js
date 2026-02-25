/**
 * Storage Module - LocalStorage-based persistence for notebooks, sections, pages
 */
const Storage = (() => {
    const STORAGE_KEY = 'voicenote_data';
    const TRASH_KEY = 'voicenote_trash';
    const SETTINGS_KEY = 'voicenote_settings';

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    function now() {
        return new Date().toISOString();
    }

    // ===== Data Access =====
    function getData() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : { notebooks: [] };
        } catch {
            return { notebooks: [] };
        }
    }

    function saveData(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Storage save failed:', e);
            return false;
        }
    }

    function getTrash() {
        try {
            const data = localStorage.getItem(TRASH_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    function saveTrash(trash) {
        localStorage.setItem(TRASH_KEY, JSON.stringify(trash));
    }

    function getSettings() {
        try {
            const data = localStorage.getItem(SETTINGS_KEY);
            return data ? JSON.parse(data) : { darkMode: false, zoom: 100 };
        } catch {
            return { darkMode: false, zoom: 100 };
        }
    }

    function saveSettings(settings) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }

    // ===== Notebooks =====
    function createNotebook(name) {
        const data = getData();
        const notebook = {
            id: generateId(),
            name: name || 'Neues Notizbuch',
            createdAt: now(),
            updatedAt: now(),
            sections: []
        };
        data.notebooks.push(notebook);
        saveData(data);
        return notebook;
    }

    function getNotebooks() {
        return getData().notebooks;
    }

    function getNotebook(id) {
        return getData().notebooks.find(n => n.id === id);
    }

    function updateNotebook(id, updates) {
        const data = getData();
        const idx = data.notebooks.findIndex(n => n.id === id);
        if (idx !== -1) {
            Object.assign(data.notebooks[idx], updates, { updatedAt: now() });
            saveData(data);
            return data.notebooks[idx];
        }
        return null;
    }

    function deleteNotebook(id) {
        const data = getData();
        const idx = data.notebooks.findIndex(n => n.id === id);
        if (idx !== -1) {
            const deleted = data.notebooks.splice(idx, 1)[0];
            deleted.deletedAt = now();
            deleted.type = 'notebook';
            const trash = getTrash();
            trash.push(deleted);
            saveTrash(trash);
            saveData(data);
            return true;
        }
        return false;
    }

    // ===== Sections =====
    function createSection(notebookId, name, color) {
        const data = getData();
        const notebook = data.notebooks.find(n => n.id === notebookId);
        if (!notebook) return null;

        const section = {
            id: generateId(),
            name: name || 'Neuer Abschnitt',
            color: color || '#4a90d9',
            createdAt: now(),
            updatedAt: now(),
            pages: []
        };
        notebook.sections.push(section);
        notebook.updatedAt = now();
        saveData(data);
        return section;
    }

    function getSections(notebookId) {
        const notebook = getNotebook(notebookId);
        return notebook ? notebook.sections : [];
    }

    function getSection(notebookId, sectionId) {
        const sections = getSections(notebookId);
        return sections.find(s => s.id === sectionId);
    }

    function updateSection(notebookId, sectionId, updates) {
        const data = getData();
        const notebook = data.notebooks.find(n => n.id === notebookId);
        if (!notebook) return null;
        const section = notebook.sections.find(s => s.id === sectionId);
        if (!section) return null;
        Object.assign(section, updates, { updatedAt: now() });
        notebook.updatedAt = now();
        saveData(data);
        return section;
    }

    function deleteSection(notebookId, sectionId) {
        const data = getData();
        const notebook = data.notebooks.find(n => n.id === notebookId);
        if (!notebook) return false;
        const idx = notebook.sections.findIndex(s => s.id === sectionId);
        if (idx !== -1) {
            const deleted = notebook.sections.splice(idx, 1)[0];
            deleted.deletedAt = now();
            deleted.type = 'section';
            deleted.parentNotebook = notebookId;
            const trash = getTrash();
            trash.push(deleted);
            saveTrash(trash);
            saveData(data);
            return true;
        }
        return false;
    }

    // ===== Pages =====
    function createPage(notebookId, sectionId, title) {
        const data = getData();
        const notebook = data.notebooks.find(n => n.id === notebookId);
        if (!notebook) return null;
        const section = notebook.sections.find(s => s.id === sectionId);
        if (!section) return null;

        const page = {
            id: generateId(),
            title: title || 'Neue Seite',
            content: '',
            tags: [],
            favorite: false,
            recordings: [],
            drawing: null,
            createdAt: now(),
            updatedAt: now()
        };
        section.pages.push(page);
        section.updatedAt = now();
        notebook.updatedAt = now();
        saveData(data);
        return page;
    }

    function getPages(notebookId, sectionId) {
        const section = getSection(notebookId, sectionId);
        return section ? section.pages : [];
    }

    function getPage(notebookId, sectionId, pageId) {
        const pages = getPages(notebookId, sectionId);
        return pages.find(p => p.id === pageId);
    }

    function updatePage(notebookId, sectionId, pageId, updates) {
        const data = getData();
        const notebook = data.notebooks.find(n => n.id === notebookId);
        if (!notebook) return null;
        const section = notebook.sections.find(s => s.id === sectionId);
        if (!section) return null;
        const page = section.pages.find(p => p.id === pageId);
        if (!page) return null;
        Object.assign(page, updates, { updatedAt: now() });
        section.updatedAt = now();
        notebook.updatedAt = now();
        saveData(data);
        return page;
    }

    function deletePage(notebookId, sectionId, pageId) {
        const data = getData();
        const notebook = data.notebooks.find(n => n.id === notebookId);
        if (!notebook) return false;
        const section = notebook.sections.find(s => s.id === sectionId);
        if (!section) return false;
        const idx = section.pages.findIndex(p => p.id === pageId);
        if (idx !== -1) {
            const deleted = section.pages.splice(idx, 1)[0];
            deleted.deletedAt = now();
            deleted.type = 'page';
            deleted.parentNotebook = notebookId;
            deleted.parentSection = sectionId;
            const trash = getTrash();
            trash.push(deleted);
            saveTrash(trash);
            saveData(data);
            return true;
        }
        return false;
    }

    // ===== Search =====
    function search(query) {
        const q = query.toLowerCase();
        const results = [];
        const data = getData();
        data.notebooks.forEach(notebook => {
            notebook.sections.forEach(section => {
                section.pages.forEach(page => {
                    const titleMatch = page.title.toLowerCase().includes(q);
                    const contentMatch = page.content && stripHtml(page.content).toLowerCase().includes(q);
                    const tagMatch = page.tags && page.tags.some(t => t.toLowerCase().includes(q));
                    if (titleMatch || contentMatch || tagMatch) {
                        results.push({
                            notebookId: notebook.id,
                            notebookName: notebook.name,
                            sectionId: section.id,
                            sectionName: section.name,
                            page: page
                        });
                    }
                });
            });
        });
        return results;
    }

    function stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    // ===== Favorites =====
    function getFavorites() {
        const results = [];
        const data = getData();
        data.notebooks.forEach(notebook => {
            notebook.sections.forEach(section => {
                section.pages.forEach(page => {
                    if (page.favorite) {
                        results.push({
                            notebookId: notebook.id,
                            sectionId: section.id,
                            page: page
                        });
                    }
                });
            });
        });
        return results;
    }

    // ===== Recent =====
    function getRecent(limit = 10) {
        const results = [];
        const data = getData();
        data.notebooks.forEach(notebook => {
            notebook.sections.forEach(section => {
                section.pages.forEach(page => {
                    results.push({
                        notebookId: notebook.id,
                        sectionId: section.id,
                        page: page
                    });
                });
            });
        });
        results.sort((a, b) => new Date(b.page.updatedAt) - new Date(a.page.updatedAt));
        return results.slice(0, limit);
    }

    // ===== All Recordings =====
    function getAllRecordings() {
        const results = [];
        const data = getData();
        data.notebooks.forEach(notebook => {
            notebook.sections.forEach(section => {
                section.pages.forEach(page => {
                    if (page.recordings && page.recordings.length > 0) {
                        page.recordings.forEach(rec => {
                            results.push({
                                notebookId: notebook.id,
                                sectionId: section.id,
                                pageId: page.id,
                                pageTitle: page.title,
                                recording: rec
                            });
                        });
                    }
                });
            });
        });
        return results;
    }

    // ===== Trash =====
    function restoreFromTrash(index) {
        const trash = getTrash();
        if (index < 0 || index >= trash.length) return false;
        const item = trash.splice(index, 1)[0];
        saveTrash(trash);
        // Attempt to restore based on type
        // Simplified: just return the item for the UI to handle
        return item;
    }

    function emptyTrash() {
        saveTrash([]);
    }

    // ===== Move Page =====
    function movePage(fromNotebookId, fromSectionId, pageId, toNotebookId, toSectionId) {
        const data = getData();
        const fromNb = data.notebooks.find(n => n.id === fromNotebookId);
        if (!fromNb) return false;
        const fromSec = fromNb.sections.find(s => s.id === fromSectionId);
        if (!fromSec) return false;
        const idx = fromSec.pages.findIndex(p => p.id === pageId);
        if (idx === -1) return false;
        const toNb = data.notebooks.find(n => n.id === toNotebookId);
        if (!toNb) return false;
        const toSec = toNb.sections.find(s => s.id === toSectionId);
        if (!toSec) return false;
        const [page] = fromSec.pages.splice(idx, 1);
        page.updatedAt = now();
        toSec.pages.push(page);
        toSec.updatedAt = now();
        toNb.updatedAt = now();
        fromSec.updatedAt = now();
        fromNb.updatedAt = now();
        saveData(data);
        return true;
    }

    // ===== Export / Import =====
    function exportAll() {
        return {
            data: getData(),
            trash: getTrash(),
            settings: getSettings(),
            exportDate: now(),
            version: '1.0'
        };
    }

    function importAll(json) {
        try {
            const imported = typeof json === 'string' ? JSON.parse(json) : json;
            if (imported.data) saveData(imported.data);
            if (imported.trash) saveTrash(imported.trash);
            if (imported.settings) saveSettings(imported.settings);
            return true;
        } catch (e) {
            console.error('Import failed:', e);
            return false;
        }
    }

    // ===== Initialize with default data if empty =====
    function initDefaults() {
        const data = getData();
        if (data.notebooks.length === 0) {
            const nb = createNotebook('Mein Notizbuch');
            const section = createSection(nb.id, 'Allgemein', '#4a90d9');
            createPage(nb.id, section.id, 'Willkommen');
            // Update the welcome page with content
            const pages = getPages(nb.id, section.id);
            if (pages.length > 0) {
                updatePage(nb.id, section.id, pages[0].id, {
                    content: '<h2>Willkommen bei VoiceNote! 🎙️</h2>' +
                        '<p>Dein persönliches Sprachnotizbuch mit allen Funktionen.</p>' +
                        '<h3>Funktionen:</h3>' +
                        '<ul>' +
                        '<li><strong>Sprachaufnahmen</strong> - Nimm Notizen per Sprache auf</li>' +
                        '<li><strong>Rich-Text-Editor</strong> - Formatiere Text wie in OneNote</li>' +
                        '<li><strong>Zeichnen</strong> - Zeichne direkt auf deinen Seiten</li>' +
                        '<li><strong>Organisation</strong> - Notizbücher, Abschnitte und Seiten</li>' +
                        '<li><strong>Tags & Favoriten</strong> - Organisiere und finde Notizen schnell</li>' +
                        '<li><strong>Suche</strong> - Durchsuche alle Notizen</li>' +
                        '<li><strong>Export/Import</strong> - Sichere deine Daten</li>' +
                        '<li><strong>Dunkelmodus</strong> - Augenschonend arbeiten</li>' +
                        '</ul>' +
                        '<p>Klicke auf <strong>Einfügen → Aufnahme</strong> um deine erste Sprachnotiz aufzunehmen!</p>'
                });
            }
            return { notebookId: nb.id, sectionId: section.id, pageId: pages[0]?.id };
        }
        return null;
    }

    return {
        generateId, getData, saveData,
        getSettings, saveSettings,
        createNotebook, getNotebooks, getNotebook, updateNotebook, deleteNotebook,
        createSection, getSections, getSection, updateSection, deleteSection,
        createPage, getPages, getPage, updatePage, deletePage, movePage,
        search, getFavorites, getRecent, getAllRecordings,
        getTrash, restoreFromTrash, emptyTrash,
        exportAll, importAll, initDefaults
    };
})();
