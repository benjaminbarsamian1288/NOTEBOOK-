(function () {
    'use strict';

    var STORAGE_KEY = 'tagebuch_entries';
    var THEME_KEY = 'tagebuch_theme';

    var moodLabels = {
        gluecklich: 'Gluecklich',
        zufrieden: 'Zufrieden',
        nachdenklich: 'Nachdenklich',
        traurig: 'Traurig',
        wuetend: 'Wuetend',
        aufgeregt: 'Aufgeregt',
        muede: 'Muede',
        dankbar: 'Dankbar'
    };

    var moodColors = {
        gluecklich: 'var(--mood-gluecklich)',
        zufrieden: 'var(--mood-zufrieden)',
        nachdenklich: 'var(--mood-nachdenklich)',
        traurig: 'var(--mood-traurig)',
        wuetend: 'var(--mood-wuetend)',
        aufgeregt: 'var(--mood-aufgeregt)',
        muede: 'var(--mood-muede)',
        dankbar: 'var(--mood-dankbar)'
    };

    // DOM elements
    var entryDate = document.getElementById('entry-date');
    var moodSelect = document.getElementById('mood-select');
    var entryTitle = document.getElementById('entry-title');
    var entryText = document.getElementById('entry-text');
    var saveBtn = document.getElementById('save-btn');
    var cancelBtn = document.getElementById('cancel-btn');
    var charCount = document.getElementById('char-count');
    var entriesList = document.getElementById('entries-list');
    var searchInput = document.getElementById('search-input');
    var moodFilter = document.getElementById('mood-filter');
    var modal = document.getElementById('modal');
    var modalClose = document.getElementById('modal-close');
    var modalTitle = document.getElementById('modal-title');
    var modalMeta = document.getElementById('modal-meta');
    var modalBody = document.getElementById('modal-body');
    var modalEditBtn = document.getElementById('modal-edit-btn');
    var modalDeleteBtn = document.getElementById('modal-delete-btn');
    var exportBtn = document.getElementById('export-btn');
    var importInput = document.getElementById('import-input');
    var themeToggle = document.getElementById('theme-toggle');
    var themeIcon = document.getElementById('theme-icon');
    var headerStats = document.getElementById('header-stats');
    var statsContainer = document.getElementById('stats-container');
    var toast = document.getElementById('toast');

    var entries = [];
    var editingId = null;
    var viewingId = null;
    var toastTimer = null;

    // Initialize
    function init() {
        loadTheme();
        loadEntries();
        setTodayDate();
        renderEntries();
        renderHeaderStats();
        renderStats();
        updateCharCount();
        bindEvents();
    }

    function setTodayDate() {
        var today = new Date().toISOString().split('T')[0];
        entryDate.value = today;
    }

    function bindEvents() {
        saveBtn.addEventListener('click', saveEntry);
        cancelBtn.addEventListener('click', clearEditor);
        searchInput.addEventListener('input', renderEntries);
        moodFilter.addEventListener('change', renderEntries);
        modalClose.addEventListener('click', closeModal);
        modalEditBtn.addEventListener('click', editFromModal);
        modalDeleteBtn.addEventListener('click', deleteFromModal);
        exportBtn.addEventListener('click', exportEntries);
        importInput.addEventListener('change', importEntries);
        themeToggle.addEventListener('click', toggleTheme);

        entryText.addEventListener('input', updateCharCount);
        entryTitle.addEventListener('input', updateCharCount);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', function (e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                var activeTab = document.querySelector('.tab.active');
                if (activeTab && activeTab.getAttribute('data-tab') === 'write') {
                    e.preventDefault();
                    saveEntry();
                }
            }
            if (e.key === 'Escape') {
                if (!modal.classList.contains('hidden')) {
                    closeModal();
                }
            }
        });

        // Tabs
        var tabs = document.querySelectorAll('.tab');
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener('click', function () {
                switchTab(this.getAttribute('data-tab'));
            });
        }
    }

    // Tabs
    function switchTab(tabName) {
        var tabs = document.querySelectorAll('.tab');
        var contents = document.querySelectorAll('.tab-content');

        for (var i = 0; i < tabs.length; i++) {
            tabs[i].classList.toggle('active', tabs[i].getAttribute('data-tab') === tabName);
        }
        for (var j = 0; j < contents.length; j++) {
            contents[j].classList.toggle('active', contents[j].id === 'tab-' + tabName);
        }

        if (tabName === 'stats') {
            renderStats();
        }
        if (tabName === 'entries') {
            renderEntries();
        }
    }

    // Theme
    function loadTheme() {
        var saved = localStorage.getItem(THEME_KEY);
        if (saved === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.innerHTML = '&#9728;';
        }
    }

    function toggleTheme() {
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem(THEME_KEY, 'light');
            themeIcon.innerHTML = '&#9790;';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem(THEME_KEY, 'dark');
            themeIcon.innerHTML = '&#9728;';
        }
    }

    // Toast
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('visible');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toast.classList.remove('visible');
        }, 2500);
    }

    // Character count
    function updateCharCount() {
        var count = entryText.value.length;
        charCount.textContent = count + ' Zeichen';
    }

    // Storage
    function loadEntries() {
        try {
            var data = localStorage.getItem(STORAGE_KEY);
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
        var title = entryTitle.value.trim();
        var text = entryText.value.trim();
        var date = entryDate.value;
        var mood = moodSelect.value;

        if (!title && !text) {
            entryTitle.focus();
            showToast('Bitte Titel oder Text eingeben');
            return;
        }

        if (editingId) {
            var entry = entries.find(function (e) { return e.id === editingId; });
            if (entry) {
                entry.title = title;
                entry.text = text;
                entry.date = date;
                entry.mood = mood;
                entry.updatedAt = Date.now();
            }
            editingId = null;
            showToast('Eintrag aktualisiert');
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
            showToast('Eintrag gespeichert');
        }

        persistEntries();
        clearEditor();
        renderEntries();
        renderHeaderStats();
        renderStats();
    }

    function clearEditor() {
        entryTitle.value = '';
        entryText.value = '';
        moodSelect.value = '';
        setTodayDate();
        editingId = null;
        saveBtn.textContent = 'Speichern';
        updateCharCount();
    }

    // Header Stats
    function renderHeaderStats() {
        if (entries.length === 0) {
            headerStats.innerHTML = '';
            return;
        }

        var totalEntries = entries.length;
        var streak = calculateStreak();
        var totalWords = entries.reduce(function (sum, e) {
            return sum + (e.text ? e.text.split(/\s+/).filter(function (w) { return w.length > 0; }).length : 0);
        }, 0);

        headerStats.innerHTML =
            '<span class="stat"><span class="stat-number">' + totalEntries + '</span> Eintraege</span>' +
            '<span class="stat"><span class="stat-number">' + streak + '</span> Tage Streak</span>' +
            '<span class="stat"><span class="stat-number">' + totalWords + '</span> Woerter</span>';
    }

    function calculateStreak() {
        if (entries.length === 0) return 0;

        var dates = {};
        entries.forEach(function (e) {
            if (e.date) dates[e.date] = true;
        });

        var sorted = Object.keys(dates).sort().reverse();
        if (sorted.length === 0) return 0;

        var today = new Date().toISOString().split('T')[0];
        var yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

        var streak = 1;
        for (var i = 0; i < sorted.length - 1; i++) {
            var current = new Date(sorted[i]);
            var prev = new Date(sorted[i + 1]);
            var diff = (current - prev) / 86400000;
            if (diff === 1) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    // Render Entries
    function renderEntries() {
        var query = searchInput.value.toLowerCase().trim();
        var moodFilterValue = moodFilter.value;

        var filtered = entries.filter(function (e) {
            var matchesQuery = !query || (
                (e.title && e.title.toLowerCase().indexOf(query) !== -1) ||
                (e.text && e.text.toLowerCase().indexOf(query) !== -1) ||
                (e.date && e.date.indexOf(query) !== -1)
            );
            var matchesMood = !moodFilterValue || e.mood === moodFilterValue;
            return matchesQuery && matchesMood;
        });

        filtered.sort(function (a, b) {
            if (a.date !== b.date) return b.date.localeCompare(a.date);
            return b.createdAt - a.createdAt;
        });

        if (filtered.length === 0) {
            var msg = query || moodFilterValue
                ? '<div class="empty-state"><div class="empty-icon">&#128269;</div><p>Keine Eintraege gefunden.</p></div>'
                : '<div class="empty-state"><div class="empty-icon">&#128221;</div><p>Noch keine Eintraege.</p><p>Wechsle zum Tab "Schreiben" und verfasse deinen ersten Eintrag!</p></div>';
            entriesList.innerHTML = msg;
            return;
        }

        entriesList.innerHTML = filtered.map(function (entry, index) {
            var dateStr = formatDate(entry.date);
            var moodBadge = entry.mood
                ? '<span class="mood-badge mood-' + entry.mood + '">' + moodLabels[entry.mood] + '</span>'
                : '';
            var preview = entry.text.length > 120
                ? entry.text.substring(0, 120) + '...'
                : entry.text;

            return (
                '<div class="entry-card" data-id="' + entry.id + '" style="animation-delay:' + (index * 0.04) + 's">' +
                    moodBadge +
                    '<div class="card-date">' + dateStr + '</div>' +
                    '<div class="card-title">' + escapeHtml(entry.title || 'Ohne Titel') + '</div>' +
                    '<div class="card-preview">' + escapeHtml(preview) + '</div>' +
                '</div>'
            );
        }).join('');

        var cards = entriesList.querySelectorAll('.entry-card');
        for (var i = 0; i < cards.length; i++) {
            cards[i].addEventListener('click', function () {
                openModal(this.getAttribute('data-id'));
            });
        }
    }

    // Statistics
    function renderStats() {
        if (entries.length === 0) {
            statsContainer.innerHTML =
                '<div class="empty-state"><div class="empty-icon">&#128202;</div>' +
                '<p>Noch keine Daten fuer Statistiken.</p>' +
                '<p>Schreib ein paar Eintraege, um deine Stimmungsuebersicht zu sehen!</p></div>';
            return;
        }

        var moodCounts = {};
        var maxCount = 0;
        entries.forEach(function (e) {
            if (e.mood) {
                moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
                if (moodCounts[e.mood] > maxCount) maxCount = moodCounts[e.mood];
            }
        });

        // Mood chart
        var moodKeys = Object.keys(moodLabels);
        var moodRows = moodKeys.map(function (key) {
            var count = moodCounts[key] || 0;
            var pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
            return (
                '<div class="mood-row">' +
                    '<span class="mood-label">' + moodLabels[key] + '</span>' +
                    '<div class="mood-bar-bg">' +
                        '<div class="mood-bar mood-' + key + '" style="width:' + pct + '%"></div>' +
                    '</div>' +
                    '<span class="mood-count">' + count + '</span>' +
                '</div>'
            );
        }).join('');

        // Overview numbers
        var totalEntries = entries.length;
        var streak = calculateStreak();
        var totalWords = entries.reduce(function (sum, e) {
            return sum + (e.text ? e.text.split(/\s+/).filter(function (w) { return w.length > 0; }).length : 0);
        }, 0);

        var dates = {};
        entries.forEach(function (e) { if (e.date) dates[e.date] = true; });
        var uniqueDays = Object.keys(dates).length;

        var avgWordsPerEntry = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;

        // Find most common mood
        var topMood = '';
        var topMoodCount = 0;
        Object.keys(moodCounts).forEach(function (key) {
            if (moodCounts[key] > topMoodCount) {
                topMoodCount = moodCounts[key];
                topMood = key;
            }
        });

        statsContainer.innerHTML =
            '<div class="stats-card">' +
                '<h3>Uebersicht</h3>' +
                '<div class="streak-grid">' +
                    '<div class="streak-item"><div class="streak-value">' + totalEntries + '</div><div class="streak-label">Eintraege</div></div>' +
                    '<div class="streak-item"><div class="streak-value">' + uniqueDays + '</div><div class="streak-label">Aktive Tage</div></div>' +
                    '<div class="streak-item"><div class="streak-value">' + streak + '</div><div class="streak-label">Tage Streak</div></div>' +
                    '<div class="streak-item"><div class="streak-value">' + totalWords + '</div><div class="streak-label">Woerter gesamt</div></div>' +
                    '<div class="streak-item"><div class="streak-value">' + avgWordsPerEntry + '</div><div class="streak-label">Woerter / Eintrag</div></div>' +
                    (topMood ? '<div class="streak-item"><div class="streak-value" style="font-size:1.2rem">' + moodLabels[topMood] + '</div><div class="streak-label">Haeufigste Stimmung</div></div>' : '') +
                '</div>' +
            '</div>' +
            '<div class="stats-card">' +
                '<h3>Stimmungsverteilung</h3>' +
                '<div class="mood-stats">' + moodRows + '</div>' +
            '</div>';
    }

    // Export / Import
    function exportEntries() {
        if (entries.length === 0) {
            showToast('Keine Eintraege zum Exportieren');
            return;
        }

        var data = JSON.stringify(entries, null, 2);
        var blob = new Blob([data], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'tagebuch_' + new Date().toISOString().split('T')[0] + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(entries.length + ' Eintraege exportiert');
    }

    function importEntries(e) {
        var file = e.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function (evt) {
            try {
                var imported = JSON.parse(evt.target.result);
                if (!Array.isArray(imported)) {
                    showToast('Ungueltige Datei');
                    return;
                }

                // Validate structure
                var valid = imported.filter(function (item) {
                    return item && typeof item.id === 'string' && typeof item.date === 'string';
                });

                if (valid.length === 0) {
                    showToast('Keine gueltigen Eintraege gefunden');
                    return;
                }

                // Merge: skip duplicates by id
                var existingIds = {};
                entries.forEach(function (en) { existingIds[en.id] = true; });
                var added = 0;
                valid.forEach(function (item) {
                    if (!existingIds[item.id]) {
                        entries.push(item);
                        added++;
                    }
                });

                persistEntries();
                renderEntries();
                renderHeaderStats();
                renderStats();
                showToast(added + ' neue Eintraege importiert');
            } catch (err) {
                showToast('Fehler beim Importieren');
            }
        };
        reader.readAsText(file);
        importInput.value = '';
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
        updateCharCount();

        closeModal();
        switchTab('write');
        entryTitle.focus();
    }

    function deleteFromModal() {
        if (!confirm('Diesen Eintrag wirklich loeschen?')) return;

        entries = entries.filter(function (e) { return e.id !== viewingId; });
        persistEntries();
        closeModal();
        renderEntries();
        renderHeaderStats();
        renderStats();
        showToast('Eintrag geloescht');
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
