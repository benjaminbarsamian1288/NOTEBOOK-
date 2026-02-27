(function () {
    'use strict';

    const STORAGE_KEY = 'tagebuch_entries';

    const moodLabels = {
        gluecklich: 'Gluecklich',
        zufrieden: 'Zufrieden',
        nachdenklich: 'Nachdenklich',
        traurig: 'Traurig',
        wuetend: 'Wuetend',
        aufgeregt: 'Aufgeregt',
        muede: 'Muede',
        dankbar: 'Dankbar'
    };

    // DOM elements
    const entryDate = document.getElementById('entry-date');
    const moodSelect = document.getElementById('mood-select');
    const entryTitle = document.getElementById('entry-title');
    const entryText = document.getElementById('entry-text');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const entriesList = document.getElementById('entries-list');
    const searchInput = document.getElementById('search-input');
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalMeta = document.getElementById('modal-meta');
    const modalBody = document.getElementById('modal-body');
    const modalEditBtn = document.getElementById('modal-edit-btn');
    const modalDeleteBtn = document.getElementById('modal-delete-btn');

    let entries = [];
    let editingId = null;
    let viewingId = null;

    // Initialize
    function init() {
        loadEntries();
        setTodayDate();
        renderEntries();
        bindEvents();
    }

    function setTodayDate() {
        const today = new Date().toISOString().split('T')[0];
        entryDate.value = today;
    }

    function bindEvents() {
        saveBtn.addEventListener('click', saveEntry);
        cancelBtn.addEventListener('click', clearEditor);
        searchInput.addEventListener('input', renderEntries);
        modalClose.addEventListener('click', closeModal);
        modalEditBtn.addEventListener('click', editFromModal);
        modalDeleteBtn.addEventListener('click', deleteFromModal);
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });
    }

    // Storage
    function loadEntries() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            entries = data ? JSON.parse(data) : [];
        } catch (e) {
            entries = [];
        }
    }

    function persistEntries() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }

    // Save / Update
    function saveEntry() {
        const title = entryTitle.value.trim();
        const text = entryText.value.trim();
        const date = entryDate.value;
        const mood = moodSelect.value;

        if (!title && !text) {
            entryTitle.focus();
            return;
        }

        if (editingId) {
            const entry = entries.find(function (e) { return e.id === editingId; });
            if (entry) {
                entry.title = title;
                entry.text = text;
                entry.date = date;
                entry.mood = mood;
                entry.updatedAt = Date.now();
            }
            editingId = null;
        } else {
            entries.push({
                id: generateId(),
                title: title,
                text: text,
                date: date,
                mood: mood,
                createdAt: Date.now(),
                updatedAt: Date.now()
            });
        }

        persistEntries();
        clearEditor();
        renderEntries();
    }

    function clearEditor() {
        entryTitle.value = '';
        entryText.value = '';
        moodSelect.value = '';
        setTodayDate();
        editingId = null;
        saveBtn.textContent = 'Speichern';
    }

    // Render
    function renderEntries() {
        var query = searchInput.value.toLowerCase().trim();
        var filtered = entries.filter(function (e) {
            if (!query) return true;
            return (
                (e.title && e.title.toLowerCase().indexOf(query) !== -1) ||
                (e.text && e.text.toLowerCase().indexOf(query) !== -1) ||
                (e.date && e.date.indexOf(query) !== -1)
            );
        });

        // Sort by date descending, then createdAt descending
        filtered.sort(function (a, b) {
            if (a.date !== b.date) return b.date.localeCompare(a.date);
            return b.createdAt - a.createdAt;
        });

        if (filtered.length === 0) {
            entriesList.innerHTML = query
                ? '<p class="empty-state">Keine Eintraege gefunden.</p>'
                : '<p class="empty-state">Noch keine Eintraege. Schreib deinen ersten Eintrag!</p>';
            return;
        }

        entriesList.innerHTML = filtered.map(function (entry) {
            var dateStr = formatDate(entry.date);
            var moodBadge = entry.mood
                ? '<span class="mood-badge mood-' + entry.mood + '">' + moodLabels[entry.mood] + '</span>'
                : '';
            var preview = entry.text.length > 120
                ? entry.text.substring(0, 120) + '...'
                : entry.text;

            return (
                '<div class="entry-card" data-id="' + entry.id + '">' +
                    moodBadge +
                    '<div class="card-date">' + dateStr + '</div>' +
                    '<div class="card-title">' + escapeHtml(entry.title || 'Ohne Titel') + '</div>' +
                    '<div class="card-preview">' + escapeHtml(preview) + '</div>' +
                '</div>'
            );
        }).join('');

        // Click handlers for cards
        var cards = entriesList.querySelectorAll('.entry-card');
        for (var i = 0; i < cards.length; i++) {
            cards[i].addEventListener('click', function () {
                openModal(this.getAttribute('data-id'));
            });
        }
    }

    // Modal
    function openModal(id) {
        var entry = entries.find(function (e) { return e.id === id; });
        if (!entry) return;

        viewingId = id;
        modalTitle.textContent = entry.title || 'Ohne Titel';

        var meta = formatDate(entry.date);
        if (entry.mood) meta += ' \u00B7 ' + moodLabels[entry.mood];
        modalMeta.textContent = meta;

        modalBody.textContent = entry.text;
        modal.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
        viewingId = null;
    }

    function editFromModal() {
        var entry = entries.find(function (e) { return e.id === viewingId; });
        if (!entry) return;

        editingId = entry.id;
        entryTitle.value = entry.title;
        entryText.value = entry.text;
        entryDate.value = entry.date;
        moodSelect.value = entry.mood || '';
        saveBtn.textContent = 'Aktualisieren';

        closeModal();
        entryTitle.focus();
    }

    function deleteFromModal() {
        if (!confirm('Diesen Eintrag wirklich loeschen?')) return;

        entries = entries.filter(function (e) { return e.id !== viewingId; });
        persistEntries();
        closeModal();
        renderEntries();
    }

    // Helpers
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        var parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        var months = [
            'Januar', 'Februar', 'Maerz', 'April', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
        ];
        var day = parseInt(parts[2], 10);
        var month = months[parseInt(parts[1], 10) - 1];
        var year = parts[0];
        return day + '. ' + month + ' ' + year;
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    init();
})();
