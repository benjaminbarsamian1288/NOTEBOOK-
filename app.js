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

    // ===== KI-ASSISTENTIN =====
    var aiChat = document.getElementById('ai-chat');
    var aiInput = document.getElementById('ai-input');
    var aiSendBtn = document.getElementById('ai-send-btn');
    var aiQuickBtns = document.querySelectorAll('.ai-quick-btn');

    var writingPrompts = [
        'Was war der schoenste Moment deines heutigen Tages?',
        'Wenn du deinem frueheren Ich einen Rat geben koenntest, welcher waere das?',
        'Beschreibe einen Ort, an dem du dich voellig sicher fuehlst.',
        'Was hat dich heute zum Laecheln gebracht?',
        'Welche drei Dinge moechtest du in den naechsten Wochen erreichen?',
        'Schreib einen Brief an dein zukuenftiges Ich in einem Jahr.',
        'Was wuerdest du tun, wenn du wuesstest, dass du nicht scheitern kannst?',
        'Welche Person hat dein Leben am meisten beeinflusst und warum?',
        'Beschreibe deinen perfekten Tag von morgens bis abends.',
        'Was ist eine Lektion, die du dieses Jahr gelernt hast?',
        'Welche Gewohnheit moechtest du veraendern und warum?',
        'Was bedeutet Glueck fuer dich?',
        'Schreib ueber etwas, das dich nervoes macht, und warum.',
        'Welches Buch, Film oder Lied hat dich zuletzt bewegt?',
        'Was wuerdest du an deinem heutigen Tag aendern, wenn du koenntest?',
        'Welche kleinen Freuden im Alltag uebersehen wir oft?',
        'Schreib ueber jemanden, dem du dankbar bist.',
        'Was wuerdest du tun, wenn du einen ganzen Tag nur fuer dich haettest?',
        'Welche Veraenderung wuenschst du dir in der Welt?',
        'Was macht dich einzigartig?'
    ];

    var reflectionQuestions = [
        'Wie hast du dich heute Morgen gefuehlt und hat sich das im Laufe des Tages veraendert?',
        'Was hat heute die meiste Energie gekostet? Was hat dir Energie gegeben?',
        'Gab es heute einen Moment, in dem du stolz auf dich warst?',
        'Was haettest du heute anders machen koennen? Was nimmst du dir fuer morgen vor?',
        'Mit wem hast du heute gesprochen und wie hat es sich angefuehlt?',
        'Was hast du heute Neues ueber dich selbst gelernt?',
        'Welches Gefuehl war heute am staerksten praesent?',
        'Hast du heute etwas aufgeschoben? Warum?',
        'Was wuerdest du dir selbst raten, wenn du dein bester Freund waerst?',
        'Wie gut hast du heute auf deine Beduerfnisse geachtet?',
        'Gab es einen Moment der Dankbarkeit heute?',
        'Was hat dich heute ueberrascht?'
    ];

    var gratitudePrompts = [
        'Nenne drei Dinge, fuer die du heute dankbar bist.',
        'Welche Person in deinem Leben schaetzt du besonders und warum?',
        'Was ist eine Kleinigkeit, die dein Leben schoener macht?',
        'Wofuer an deinem Koerper bist du dankbar?',
        'Welche Faehigkeit besitzt du, die du manchmal als selbstverstaendlich nimmst?',
        'Was ist das Beste, das dir diese Woche passiert ist?',
        'Welche Erinnerung macht dich gluecklich, wenn du daran denkst?',
        'Fuer welchen Fehler bist du rueckblickend dankbar?',
        'Was an deinem Zuhause schaetzt du besonders?',
        'Welcher Sinneseindruck hat dich heute erfreut (Geruch, Klang, Geschmack)?'
    ];

    var motivationMessages = [
        'Du bist staerker als du denkst. Jeder kleine Schritt zaehlt.',
        'Perfekt gibt es nicht - aber dein Bestes zu geben ist genug.',
        'Erinnere dich: Du hast schon so viel geschafft, auch wenn es sich nicht immer so anfuehlt.',
        'Heute ist ein neuer Tag voller Moeglichkeiten. Nutze ihn.',
        'Sei geduldig mit dir selbst. Wachstum braucht Zeit.',
        'Du musst nicht alles auf einmal schaffen. Ein Schritt nach dem anderen.',
        'Deine Gefuehle sind berechtigt. Es ist okay, nicht okay zu sein.',
        'Vergleiche dich nicht mit anderen - dein Weg ist einzigartig.',
        'Mutig zu sein heisst nicht, keine Angst zu haben, sondern trotzdem weiterzugehen.',
        'Du verdienst die gleiche Freundlichkeit, die du anderen schenkst.',
        'Jeder Tag ist eine neue Chance, die Version von dir zu werden, die du sein moechtest.',
        'Atme tief durch. Du bist genau da, wo du sein sollst.'
    ];

    var moodResponses = {
        gluecklich: [
            'Wie wunderbar! Was hat dieses Gluecksgefuehl ausgeloest?',
            'Freut mich zu hoeren! Halte dieses Gefuehl fest - beschreibe es genau.',
            'Glueckliche Momente verdienen es, festgehalten zu werden. Was genau macht dich gerade gluecklich?'
        ],
        traurig: [
            'Es ist okay, traurig zu sein. Moechtest du darueber schreiben, was dich belastet?',
            'Traurigkeit ist ein Teil des Lebens. Sei sanft zu dir. Was brauchst du gerade?',
            'Manchmal hilft es, die Traurigkeit in Worte zu fassen. Was liegt dir auf dem Herzen?'
        ],
        wuetend: [
            'Wut ist eine starke Emotion. Was hat sie ausgeloest?',
            'Es ist berechtigt, wuetend zu sein. Schreib es dir von der Seele.',
            'Was brauchst du gerade, um dich besser zu fuehlen? Manchmal hilft es, alles aufzuschreiben.'
        ],
        nachdenklich: [
            'Nachdenklichkeit ist wertvoll. Welche Gedanken beschaeftigen dich?',
            'Was geht dir durch den Kopf? Schreiben kann helfen, Klarheit zu finden.',
            'In stillen Momenten finden wir oft die besten Einsichten. Was bewegt dich?'
        ],
        muede: [
            'Hoer auf deinen Koerper. Hast du dir heute genug Ruhe gegoennt?',
            'Muedigkeit ist ein Signal. Was hat heute besonders viel Kraft gekostet?',
            'Vielleicht ist heute ein Tag zum Ausruhen. Was wuerde dir jetzt gut tun?'
        ],
        aufgeregt: [
            'Aufregung ist wundervoll! Was steht an oder was ist passiert?',
            'Diese Energie ist toll! Beschreibe, worueber du dich so freust.',
            'Aufregung zeigt, dass etwas Bedeutsames passiert. Erzaehl mir mehr!'
        ],
        zufrieden: [
            'Zufriedenheit ist ein schoenes Gefuehl. Was traegt gerade dazu bei?',
            'Schoen, dass du zufrieden bist. Was laeuft gerade gut in deinem Leben?',
            'Genieße diesen Moment der Zufriedenheit. Was schaetzt du gerade besonders?'
        ],
        dankbar: [
            'Dankbarkeit oeffnet das Herz. Wofuer bist du gerade besonders dankbar?',
            'Wie schoen! Dankbarkeit ist eine Superkraft. Wem oder was gilt sie?',
            'Dankbare Menschen sind oft gluecklicher. Was hat dieses Gefuehl ausgeloest?'
        ]
    };

    function initAI() {
        aiSendBtn.addEventListener('click', handleAIInput);
        aiInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleAIInput();
            }
        });

        for (var i = 0; i < aiQuickBtns.length; i++) {
            aiQuickBtns[i].addEventListener('click', function () {
                handleQuickAction(this.getAttribute('data-action'));
            });
        }
    }

    function handleAIInput() {
        var input = aiInput.value.trim();
        if (!input) return;

        addMessage(input, 'user');
        aiInput.value = '';

        showTyping();
        setTimeout(function () {
            removeTyping();
            var response = generateResponse(input);
            addMessage(response, 'bot');
        }, 800 + Math.random() * 700);
    }

    function handleQuickAction(action) {
        var response = '';
        var userMsg = '';

        switch (action) {
            case 'prompt':
                userMsg = 'Gib mir einen Schreibimpuls';
                response = pickRandom(writingPrompts);
                break;
            case 'reflect':
                userMsg = 'Stell mir eine Reflexionsfrage';
                response = pickRandom(reflectionQuestions);
                break;
            case 'mood-analysis':
                userMsg = 'Analysiere meine Stimmung';
                response = analyzeMood();
                break;
            case 'summary':
                userMsg = 'Fasse meine letzten Eintraege zusammen';
                response = summarizeEntries();
                break;
            case 'gratitude':
                userMsg = 'Hilf mir bei der Dankbarkeit';
                response = pickRandom(gratitudePrompts);
                break;
            case 'motivation':
                userMsg = 'Ich brauche Motivation';
                response = pickRandom(motivationMessages);
                break;
        }

        addMessage(userMsg, 'user');
        showTyping();
        setTimeout(function () {
            removeTyping();
            addMessage(response, 'bot');
        }, 600 + Math.random() * 800);
    }

    function generateResponse(input) {
        var lower = input.toLowerCase();

        // Greetings
        if (lower.match(/^(hallo|hi|hey|guten|moin|servus)/)) {
            return pickRandom([
                'Hallo! Schoen, dass du da bist. Wie geht es dir heute?',
                'Hey! Wie kann ich dir heute helfen? Moechtest du schreiben, reflektieren oder einfach reden?',
                'Hallo! Ich bin fuer dich da. Was bewegt dich gerade?'
            ]);
        }

        // How are you
        if (lower.match(/(wie geht|wie fuehls|wie bist du)/)) {
            return 'Mir geht es gut, danke! Aber viel wichtiger: Wie geht es DIR? Magst du mir erzaehlen, wie dein Tag war?';
        }

        // Sad / negative
        if (lower.match(/(traurig|schlecht|mies|down|depri|einsam|allein)/)) {
            return pickRandom([
                'Es tut mir leid, dass du dich so fuehlst. Das ist voellig in Ordnung. Moechtest du darueber schreiben? Manchmal hilft es, Gefuehle in Worte zu fassen.',
                'Ich hoere dich. Traurige Tage gehoeren dazu, auch wenn sie schwer sind. Was wuerde dir jetzt gut tun? Vielleicht einen Eintrag schreiben oder eine Reflexionsuebung?',
                'Du bist nicht allein mit diesen Gefuehlen. Nimm dir Zeit fuer dich. Soll ich dir eine sanfte Reflexionsfrage stellen?'
            ]);
        }

        // Happy / positive
        if (lower.match(/(gluecklich|gut|super|toll|fantastisch|wunderbar|freude|froh)/)) {
            return pickRandom([
                'Das freut mich so sehr! Halte diesen Moment fest - schreib einen Eintrag darueber, damit du dich spaeter daran erinnern kannst.',
                'Wunderbar! Positive Momente verdienen es, aufgeschrieben zu werden. Was genau macht dich heute so gluecklich?',
                'Toll! Solche Tage sind kostbar. Moechtest du einen Dankbarkeits-Eintrag schreiben?'
            ]);
        }

        // Stress
        if (lower.match(/(stress|ueberfordert|viel zu tun|zu viel|druck|anstrengend)/)) {
            return pickRandom([
                'Stress kann sehr belastend sein. Atme dreimal tief durch. Was ist gerade die eine wichtigste Sache, auf die du dich konzentrieren kannst?',
                'Ich verstehe. Vielleicht hilft es, alles aufzuschreiben, was dich gerade belastet. Dann kannst du priorisieren, was wirklich wichtig ist.',
                'Nimm dir einen Moment. Du musst nicht alles auf einmal loesen. Was brauchst du gerade am meisten: Ruhe, Struktur oder Ablenkung?'
            ]);
        }

        // Ask for writing prompt
        if (lower.match(/(schreib|impuls|idee|inspiration|thema|worueber|was soll)/)) {
            return pickRandom(writingPrompts);
        }

        // Mood related
        if (lower.match(/(stimmung|mood|gefuehl|fuehle|emotion)/)) {
            var lastMood = getLastMood();
            if (lastMood) {
                return pickRandom(moodResponses[lastMood] || []) + '\n\nDein letzter Eintrag hatte die Stimmung: ' + moodLabels[lastMood];
            }
            return 'Wie fuehst du dich gerade? Waehle eine Stimmung im Editor-Tab aus und schreib dir alles von der Seele.';
        }

        // Gratitude
        if (lower.match(/(dankbar|dankbarkeit|danke|grateful)/)) {
            return pickRandom(gratitudePrompts);
        }

        // Motivation
        if (lower.match(/(motivation|mut|aufgeben|keine lust|antrieb|kraft)/)) {
            return pickRandom(motivationMessages);
        }

        // Help
        if (lower.match(/(hilf|help|was kannst|funktionen)/)) {
            return 'Ich kann dir helfen mit:\n\n- Schreibimpulse fuer neue Eintraege\n- Reflexionsfragen fuer mehr Achtsamkeit\n- Analyse deiner Stimmungsmuster\n- Zusammenfassung deiner Eintraege\n- Dankbarkeitsuebungen\n- Motivierende Worte\n\nNutze die Schnelltasten unten oder frag mich einfach!';
        }

        // Default
        return pickRandom([
            'Interessant! Magst du mir mehr darueber erzaehlen? Ich hoere zu.',
            'Danke fuers Teilen. Hast du schon ueberlegt, das in einem Tagebucheintrag festzuhalten?',
            'Das klingt bedeutsam. Moechtest du einen Schreibimpuls dazu, oder lieber eine Reflexionsfrage?',
            'Ich bin hier, um dir zuzuhoeren. Wenn du Inspiration brauchst, probier eine der Schnelltasten unten!',
            'Manchmal hilft es, Gedanken einfach aufzuschreiben - ohne Perfektion. Einfach fliessen lassen.'
        ]);
    }

    function analyzeMood() {
        if (entries.length === 0) {
            return 'Du hast noch keine Eintraege. Sobald du ein paar Eintraege mit Stimmungen geschrieben hast, kann ich deine Muster analysieren!';
        }

        var moodCounts = {};
        var recentMoods = [];
        var sorted = entries.slice().sort(function (a, b) { return b.createdAt - a.createdAt; });

        entries.forEach(function (e) {
            if (e.mood) moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
        });

        var recent = sorted.slice(0, 5);
        recent.forEach(function (e) {
            if (e.mood) recentMoods.push(moodLabels[e.mood]);
        });

        var topMood = '';
        var topCount = 0;
        Object.keys(moodCounts).forEach(function (key) {
            if (moodCounts[key] > topCount) {
                topCount = moodCounts[key];
                topMood = key;
            }
        });

        var result = 'Hier ist deine Stimmungsanalyse:\n\n';
        result += 'Insgesamt: ' + entries.length + ' Eintraege\n';

        if (topMood) {
            result += 'Haeufigste Stimmung: ' + moodLabels[topMood] + ' (' + topCount + 'x)\n';
        }

        if (recentMoods.length > 0) {
            result += 'Letzte Stimmungen: ' + recentMoods.join(', ') + '\n';
        }

        result += '\n';

        var positiveMoods = (moodCounts.gluecklich || 0) + (moodCounts.zufrieden || 0) + (moodCounts.dankbar || 0) + (moodCounts.aufgeregt || 0);
        var totalMoods = Object.keys(moodCounts).reduce(function (s, k) { return s + moodCounts[k]; }, 0);

        if (totalMoods > 0) {
            var posPercent = Math.round((positiveMoods / totalMoods) * 100);
            if (posPercent >= 60) {
                result += 'Du hast ueberwiegend positive Stimmungen (' + posPercent + '%). Weiter so!';
            } else if (posPercent >= 40) {
                result += 'Deine Stimmungen sind ausgeglichen (' + posPercent + '% positiv). Das ist normal und gesund.';
            } else {
                result += 'Du hattest viele herausfordernde Tage. Denk daran: Schreiben kann helfen, schwierige Zeiten zu verarbeiten. Du machst das gut!';
            }
        }

        return result;
    }

    function summarizeEntries() {
        if (entries.length === 0) {
            return 'Du hast noch keine Eintraege. Schreib deinen ersten Eintrag und ich fasse ihn fuer dich zusammen!';
        }

        var sorted = entries.slice().sort(function (a, b) { return b.createdAt - a.createdAt; });
        var recent = sorted.slice(0, 5);

        var result = 'Hier sind deine letzten Eintraege:\n\n';

        recent.forEach(function (e, i) {
            var title = e.title || 'Ohne Titel';
            var mood = e.mood ? ' (' + moodLabels[e.mood] + ')' : '';
            var date = formatDate(e.date);
            var preview = e.text.length > 60 ? e.text.substring(0, 60) + '...' : e.text;
            result += (i + 1) + '. ' + date + ' - "' + title + '"' + mood + '\n   ' + preview + '\n\n';
        });

        if (entries.length > 5) {
            result += '... und ' + (entries.length - 5) + ' weitere Eintraege.';
        }

        result += '\nMoechtest du einen bestimmten Eintrag naeher betrachten? Geh zum Eintraege-Tab!';
        return result;
    }

    function getLastMood() {
        var sorted = entries.slice().sort(function (a, b) { return b.createdAt - a.createdAt; });
        for (var i = 0; i < sorted.length; i++) {
            if (sorted[i].mood) return sorted[i].mood;
        }
        return null;
    }

    function addMessage(text, type) {
        var div = document.createElement('div');
        div.className = 'ai-message ai-' + type;
        div.innerHTML = text.replace(/\n/g, '<br>');
        aiChat.appendChild(div);
        aiChat.scrollTop = aiChat.scrollHeight;
    }

    function showTyping() {
        var div = document.createElement('div');
        div.className = 'ai-typing';
        div.id = 'ai-typing-indicator';
        div.innerHTML = '<div class="ai-typing-dots"><span></span><span></span><span></span></div>';
        aiChat.appendChild(div);
        aiChat.scrollTop = aiChat.scrollHeight;
    }

    function removeTyping() {
        var typing = document.getElementById('ai-typing-indicator');
        if (typing) typing.remove();
    }

    function pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    initAI();

    init();
})();
