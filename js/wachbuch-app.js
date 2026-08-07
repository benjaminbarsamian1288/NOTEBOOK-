/**
 * Wachbuch Standalone-App
 * Bindet das Logbook-Modul an eine eigenstaendige UI mit Tabs:
 * Eintrag / Schicht / Suche / Einstellungen.
 */
(function () {
    let currentPhotoData = null;
    let currentGPS = null;

    function $(id) { return document.getElementById(id); }
    function qs(sel, root) { return (root || document).querySelector(sel); }
    function qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

    function todayLocalDate() {
        const d = new Date();
        const tz = d.getTimezoneOffset() * 60000;
        return new Date(d - tz).toISOString().slice(0, 10);
    }

    function nowLocalDateTime() {
        const d = new Date();
        const tz = d.getTimezoneOffset() * 60000;
        return new Date(d - tz).toISOString().slice(0, 16);
    }

    function fmtTime(iso) {
        return new Date(iso).toLocaleTimeString('de-DE', {
            hour: '2-digit', minute: '2-digit'
        });
    }

    function fmtDateTime(iso) {
        return new Date(iso).toLocaleString('de-DE', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }

    function escapeHtml(s) {
        return String(s || '').replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    // ===== Toast =====
    let toastTimer = null;
    function toast(msg, kind = 'info') {
        const el = $('wb-toast');
        el.textContent = msg;
        el.className = 'wb-toast wb-toast-' + kind;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.classList.add('hidden'), 3200);
    }

    // ===== Tabs =====
    function initTabs() {
        qsa('.wb-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                qsa('.wb-tab').forEach(b => b.classList.toggle('active', b === btn));
                qsa('.wb-panel').forEach(p => {
                    p.classList.toggle('active', p.dataset.panel === tab);
                });
                if (tab === 'shift') renderShift();
                if (tab === 'search') runSearch();
                if (tab === 'settings') renderSettings();
            });
        });
    }

    // ===== Selects =====
    function fillSelect(sel, items, { includeEmpty = false, emptyLabel = 'Alle' } = {}) {
        if (!sel) return;
        sel.innerHTML = '';
        if (includeEmpty) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = emptyLabel;
            sel.appendChild(opt);
        }
        items.forEach(item => {
            const opt = document.createElement('option');
            if (typeof item === 'string') {
                opt.value = item;
                opt.textContent = item;
            } else {
                opt.value = item.value;
                opt.textContent = item.label;
            }
            sel.appendChild(opt);
        });
    }

    function fillEventTypes() {
        fillSelect($('wb-type'), Logbook.EVENT_TYPES);
        fillSelect($('wb-severity'), Logbook.SEVERITY_LEVELS);
        fillSelect($('wb-q-type'), Logbook.EVENT_TYPES, { includeEmpty: true, emptyLabel: 'Alle Ereignistypen' });
        fillSelect($('wb-q-severity'), Logbook.SEVERITY_LEVELS, { includeEmpty: true, emptyLabel: 'Alle Schweregrade' });
    }

    // ===== Speech =====
    function setMicState(active) {
        const btn = $('btn-wb-mic');
        const label = $('wb-mic-label');
        const status = $('wb-mic-status');
        if (active) {
            btn.classList.add('active');
            label.textContent = 'Stop';
            status.textContent = 'Hoere zu...';
        } else {
            btn.classList.remove('active');
            label.textContent = 'Diktat';
            status.textContent = '';
        }
    }

    function handleMic() {
        const ta = $('wb-description');
        if (Logbook.isSpeechActive()) {
            Logbook.stopSpeech();
            setMicState(false);
            return;
        }
        const ok = Logbook.startSpeech(ta, (state, info) => {
            if (state === 'started') setMicState(true);
            else if (state === 'ended') setMicState(false);
            else if (state === 'error') {
                setMicState(false);
                toast('Spracherkennung Fehler: ' + (info || 'unbekannt'), 'error');
            } else if (state === 'not-supported') {
                toast('Spracherkennung in diesem Browser nicht verfuegbar', 'warn');
            }
        });
        if (!ok && !Logbook.isSpeechActive()) setMicState(false);
    }

    // ===== Photo =====
    async function handlePhoto(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        try {
            currentPhotoData = await Logbook.fileToDataURL(file);
            const img = $('wb-photo-preview');
            img.src = currentPhotoData;
            img.classList.remove('hidden');
            $('btn-wb-photo-clear').classList.remove('hidden');
        } catch {
            toast('Foto konnte nicht geladen werden', 'error');
        }
    }

    function clearPhoto() {
        currentPhotoData = null;
        $('wb-photo-input').value = '';
        const img = $('wb-photo-preview');
        img.src = '';
        img.classList.add('hidden');
        $('btn-wb-photo-clear').classList.add('hidden');
    }

    // ===== GPS =====
    function setGPSDisplay(gps) {
        const el = $('wb-gps-display');
        if (!gps) {
            el.textContent = 'Keine Position erfasst';
            el.classList.remove('has-gps');
            return;
        }
        el.classList.add('has-gps');
        el.innerHTML = `<i class="fas fa-location-dot"></i> `
            + `${gps.latitude.toFixed(5)}, ${gps.longitude.toFixed(5)} `
            + `<span class="wb-gps-acc">&plusmn;${Math.round(gps.accuracy)} m</span>`;
    }

    async function handleGPS() {
        const btn = $('btn-wb-gps');
        const label = $('wb-gps-label');
        btn.disabled = true;
        label.textContent = 'Suche...';
        try {
            const gps = await Logbook.captureGPS();
            if (!gps) {
                toast('Standort nicht verfuegbar (Berechtigung pruefen)', 'warn');
                currentGPS = null;
                setGPSDisplay(null);
            } else {
                currentGPS = gps;
                setGPSDisplay(gps);
                toast('Position erfasst', 'success');
            }
        } finally {
            btn.disabled = false;
            label.textContent = currentGPS ? 'Aktualisieren' : 'Erfassen';
        }
    }

    // ===== Submit =====
    function handleSubmit(e) {
        e.preventDefault();
        const guard = $('wb-guard').value.trim();
        const location = $('wb-location').value.trim();
        const type = $('wb-type').value;
        const severity = $('wb-severity').value || 'info';
        const description = $('wb-description').value.trim();
        const timeVal = $('wb-time').value;
        const timestamp = timeVal ? new Date(timeVal).toISOString() : new Date().toISOString();

        if (!guard || !location || !description) {
            toast('Bitte Pflichtfelder ausfuellen', 'warn');
            return;
        }

        Logbook.addEntry({
            guard, location, type, severity, description, timestamp,
            photo: currentPhotoData,
            gps: currentGPS
        });

        Logbook.saveSettings({ guard, location });

        $('wb-description').value = '';
        clearPhoto();
        currentGPS = null;
        setGPSDisplay(null);
        $('wb-time').value = nowLocalDateTime();
        Logbook.stopSpeech();
        setMicState(false);

        toast('Wachbuch-Eintrag gespeichert', 'success');
    }

    function handleReset() {
        clearPhoto();
        currentGPS = null;
        setGPSDisplay(null);
        Logbook.stopSpeech();
        setMicState(false);
    }

    // ===== Render entry list =====
    function severityBadge(sev) {
        const found = (Logbook.SEVERITY_LEVELS || []).find(x => x.value === sev) || { label: sev || 'Info', color: '#666' };
        return `<span class="entry-sev" style="background:${found.color}">${escapeHtml(found.label)}</span>`;
    }

    function entryRowHTML(e) {
        const sev = e.severity || 'info';
        const gps = e.gps
            ? `<div class="entry-gps"><i class="fas fa-location-dot"></i> ${e.gps.latitude.toFixed(5)}, ${e.gps.longitude.toFixed(5)}</div>`
            : '';
        return `
            <div class="logbook-entry" data-id="${e.id}">
                <div class="entry-time">
                    <i class="far fa-clock"></i> ${fmtTime(e.timestamp)}
                </div>
                <div class="entry-body">
                    <div class="entry-meta">
                        <span class="entry-type">${escapeHtml(e.type)}</span>
                        ${severityBadge(sev)}
                        <span class="entry-guard"><i class="fas fa-user-shield"></i> ${escapeHtml(e.guard)}</span>
                        <span class="entry-location"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(e.location)}</span>
                    </div>
                    <div class="entry-desc">${escapeHtml(e.description).replace(/\n/g, '<br>')}</div>
                    ${gps}
                    ${e.photo ? `<img class="entry-photo" src="${e.photo}" alt="Foto" />` : ''}
                </div>
                <div class="entry-actions">
                    <button class="btn-icon-sm entry-delete" title="Loeschen">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    function attachDeleteHandlers(container, afterDelete) {
        qsa('.entry-delete', container).forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.closest('.logbook-entry').dataset.id;
                if (window.confirm('Eintrag wirklich loeschen?')) {
                    Logbook.deleteEntry(id);
                    afterDelete && afterDelete();
                    toast('Eintrag geloescht', 'info');
                }
            });
        });
    }

    // ===== Shift Panel =====
    function renderShift() {
        const dateInput = $('wb-shift-date');
        if (!dateInput.value) dateInput.value = todayLocalDate();
        const date = dateInput.value;
        const list = $('wb-shift-list');
        const entries = Logbook.entriesForDate(date);

        const stats = Logbook.shiftStats(date);
        const statsEl = $('wb-stats');
        if (entries.length === 0) {
            statsEl.innerHTML = '';
        } else {
            const sevHTML = (Logbook.SEVERITY_LEVELS || [])
                .filter(s => stats.bySeverity[s.value])
                .map(s => `<span class="wb-stat-chip" style="background:${s.color}">${s.label}: ${stats.bySeverity[s.value]}</span>`)
                .join('');
            statsEl.innerHTML = `
                <div class="wb-stat-card">
                    <div class="wb-stat-num">${stats.total}</div>
                    <div class="wb-stat-label">Eintraege</div>
                </div>
                <div class="wb-stat-card">
                    <div class="wb-stat-num">${stats.firstAt ? fmtTime(stats.firstAt) : '&mdash;'}</div>
                    <div class="wb-stat-label">Erster Eintrag</div>
                </div>
                <div class="wb-stat-card">
                    <div class="wb-stat-num">${stats.lastAt ? fmtTime(stats.lastAt) : '&mdash;'}</div>
                    <div class="wb-stat-label">Letzter Eintrag</div>
                </div>
                <div class="wb-stat-chips">${sevHTML}</div>
            `;
        }

        if (!entries.length) {
            list.innerHTML = '<div class="logbook-empty">Keine Eintraege fuer diesen Tag.</div>';
            return;
        }
        list.innerHTML = entries.map(entryRowHTML).join('');
        attachDeleteHandlers(list, renderShift);
    }

    // ===== Search Panel =====
    function runSearch() {
        const query = $('wb-q').value;
        const type = $('wb-q-type').value;
        const severity = $('wb-q-severity').value;
        const dateFrom = $('wb-q-from').value;
        const dateTo = $('wb-q-to').value;

        const entries = Logbook.searchEntries({ query, type, severity, dateFrom, dateTo });
        const meta = $('wb-search-meta');
        const list = $('wb-search-list');

        meta.textContent = entries.length === 0
            ? 'Keine Treffer'
            : `${entries.length} Treffer`;

        if (!entries.length) {
            list.innerHTML = '<div class="logbook-empty">Keine Eintraege gefunden.</div>';
            return;
        }
        list.innerHTML = entries.map(e => `
            <div class="logbook-entry" data-id="${e.id}">
                <div class="entry-time">
                    <i class="far fa-calendar"></i> ${fmtDateTime(e.timestamp)}
                </div>
                <div class="entry-body">
                    <div class="entry-meta">
                        <span class="entry-type">${escapeHtml(e.type)}</span>
                        ${severityBadge(e.severity || 'info')}
                        <span class="entry-guard"><i class="fas fa-user-shield"></i> ${escapeHtml(e.guard)}</span>
                        <span class="entry-location"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(e.location)}</span>
                    </div>
                    <div class="entry-desc">${escapeHtml(e.description).replace(/\n/g, '<br>')}</div>
                    ${e.gps ? `<div class="entry-gps"><i class="fas fa-location-dot"></i> ${e.gps.latitude.toFixed(5)}, ${e.gps.longitude.toFixed(5)}</div>` : ''}
                    ${e.photo ? `<img class="entry-photo" src="${e.photo}" alt="Foto" />` : ''}
                </div>
                <div class="entry-actions">
                    <button class="btn-icon-sm entry-delete" title="Loeschen">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        attachDeleteHandlers(list, runSearch);
    }

    function clearSearch() {
        $('wb-q').value = '';
        $('wb-q-type').value = '';
        $('wb-q-severity').value = '';
        $('wb-q-from').value = '';
        $('wb-q-to').value = '';
        runSearch();
    }

    // ===== Settings =====
    function renderSettings() {
        const s = Logbook.getSettings();
        $('wb-default-guard').value = s.guard || '';
        $('wb-default-location').value = s.location || '';
        $('wb-entry-total').textContent = Logbook.getEntries().length;
    }

    function saveDefaults() {
        Logbook.saveSettings({
            guard: $('wb-default-guard').value.trim(),
            location: $('wb-default-location').value.trim()
        });
        toast('Standardwerte gespeichert', 'success');
    }

    async function importFile(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const replace = window.confirm(
            'Backup importieren:\n\n'
            + 'OK = Bestehende Eintraege ERSETZEN\n'
            + 'Abbrechen = Eintraege ZUSAMMENFUEHREN (empfohlen)'
        );
        try {
            const result = await Logbook.importJSON(file, { mode: replace ? 'replace' : 'merge' });
            toast(`Import erfolgreich: ${result.imported} importiert, ${result.total} gesamt`, 'success');
            renderSettings();
        } catch (err) {
            toast('Import fehlgeschlagen: ' + (err.message || 'unbekannt'), 'error');
        } finally {
            e.target.value = '';
        }
    }

    function clearAll() {
        const total = Logbook.getEntries().length;
        if (total === 0) {
            toast('Keine Eintraege vorhanden', 'info');
            return;
        }
        const a = window.prompt(
            `${total} Eintraege werden UNWIDERRUFLICH geloescht.\n\n`
            + 'Tippe LOESCHEN zur Bestaetigung:'
        );
        if (a !== 'LOESCHEN') {
            toast('Abgebrochen', 'info');
            return;
        }
        Logbook.clearAll();
        renderSettings();
        toast('Alle Eintraege geloescht', 'success');
    }

    // ===== Init =====
    function init() {
        fillEventTypes();

        // Defaults
        const s = Logbook.getSettings();
        if (s.guard) $('wb-guard').value = s.guard;
        if (s.location) $('wb-location').value = s.location;
        $('wb-time').value = nowLocalDateTime();
        $('wb-shift-date').value = todayLocalDate();

        // KI-Badge
        if (!Logbook.isSpeechSupported()) {
            $('wb-ai-badge').classList.add('disabled');
            $('wb-ai-badge').title = 'KI-Spracherkennung im Browser nicht verfuegbar';
            $('btn-wb-mic').disabled = true;
            $('btn-wb-mic').title = 'Spracherkennung nicht unterstuetzt';
        }

        // GPS support check
        if (!navigator.geolocation) {
            $('btn-wb-gps').disabled = true;
            $('btn-wb-gps').title = 'GPS in diesem Browser nicht verfuegbar';
        }

        initTabs();

        // Entry tab events
        $('wb-form').addEventListener('submit', handleSubmit);
        $('wb-form').addEventListener('reset', handleReset);
        $('btn-wb-mic').addEventListener('click', handleMic);
        $('btn-wb-photo').addEventListener('click', () => $('wb-photo-input').click());
        $('wb-photo-input').addEventListener('change', handlePhoto);
        $('btn-wb-photo-clear').addEventListener('click', clearPhoto);
        $('btn-wb-gps').addEventListener('click', handleGPS);

        // Shift tab
        $('wb-shift-date').addEventListener('change', renderShift);
        $('btn-wb-pdf').addEventListener('click', () => {
            const ok = Logbook.exportShiftPDF($('wb-shift-date').value);
            if (!ok) toast('Popup-Blocker verhindert Export. Bitte erlauben.', 'warn');
        });

        // Search tab
        ['wb-q', 'wb-q-type', 'wb-q-severity', 'wb-q-from', 'wb-q-to'].forEach(id => {
            const el = $(id);
            el.addEventListener('input', runSearch);
            el.addEventListener('change', runSearch);
        });
        $('btn-wb-q-clear').addEventListener('click', clearSearch);

        // Settings tab
        $('btn-wb-export-json').addEventListener('click', Logbook.exportJSON);
        $('btn-wb-import-json').addEventListener('click', () => $('wb-import-file').click());
        $('wb-import-file').addEventListener('change', importFile);
        $('btn-wb-save-defaults').addEventListener('click', saveDefaults);
        $('btn-wb-clear-all').addEventListener('click', clearAll);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
