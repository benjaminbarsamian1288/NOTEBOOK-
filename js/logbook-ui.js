/**
 * Logbook UI - bindet das Wachbuch-Panel an Logbook-Modul.
 * Erwartet Logbook + UI Module global verfuegbar.
 */
(function () {
    let currentPhotoData = null;

    function $(id) { return document.getElementById(id); }

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

    function fillEventTypes() {
        const sel = $('lb-type');
        if (!sel || sel.options.length > 0) return;
        Logbook.EVENT_TYPES.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t;
            opt.textContent = t;
            sel.appendChild(opt);
        });
    }

    function renderEntries() {
        const date = $('logbook-date').value || todayLocalDate();
        const entries = Logbook.entriesForDate(date);
        $('lb-count').textContent = entries.length;

        const list = $('logbook-entries-list');
        if (!entries.length) {
            list.innerHTML = '<div class="logbook-empty">Keine Eintraege fuer diesen Tag.</div>';
            return;
        }

        list.innerHTML = entries.map(e => `
            <div class="logbook-entry" data-id="${e.id}">
                <div class="entry-time">
                    <i class="far fa-clock"></i> ${fmtTime(e.timestamp)}
                </div>
                <div class="entry-body">
                    <div class="entry-meta">
                        <span class="entry-type">${escapeHtml(e.type)}</span>
                        <span class="entry-guard"><i class="fas fa-user-shield"></i> ${escapeHtml(e.guard)}</span>
                        <span class="entry-location"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(e.location)}</span>
                    </div>
                    <div class="entry-desc">${escapeHtml(e.description).replace(/\n/g, '<br>')}</div>
                    ${e.photo ? `<img class="entry-photo" src="${e.photo}" alt="Foto" />` : ''}
                </div>
                <div class="entry-actions">
                    <button class="btn-icon-sm entry-delete" title="Loeschen">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        list.querySelectorAll('.entry-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.closest('.logbook-entry').dataset.id;
                if (window.confirm('Eintrag wirklich loeschen?')) {
                    Logbook.deleteEntry(id);
                    renderEntries();
                    UI && UI.showToast && UI.showToast('Eintrag geloescht', 'info');
                }
            });
        });
    }

    function escapeHtml(s) {
        return String(s || '').replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    function open() {
        const panel = $('logbook-panel');
        panel.classList.remove('hidden');
        fillEventTypes();

        const settings = Logbook.getSettings();
        if (settings.guard) $('lb-guard').value = settings.guard;
        if (settings.location) $('lb-location').value = settings.location;

        $('logbook-date').value = todayLocalDate();
        $('lb-time').value = nowLocalDateTime();

        const aiBadge = $('logbook-ai-badge');
        if (!Logbook.isSpeechSupported()) {
            aiBadge.classList.add('disabled');
            aiBadge.title = 'KI-Spracherkennung im Browser nicht verfuegbar';
            $('btn-lb-mic').disabled = true;
            $('btn-lb-mic').title = 'Spracherkennung nicht unterstuetzt';
        }

        renderEntries();
    }

    function close() {
        Logbook.stopSpeech();
        $('logbook-panel').classList.add('hidden');
    }

    function setMicState(active) {
        const btn = $('btn-lb-mic');
        const label = $('lb-mic-label');
        const status = $('lb-mic-status');
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
        const ta = $('lb-description');
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
                UI && UI.showToast && UI.showToast(
                    'Spracherkennung Fehler: ' + (info || 'unbekannt'), 'error'
                );
            } else if (state === 'not-supported') {
                UI && UI.showToast && UI.showToast(
                    'Spracherkennung in diesem Browser nicht verfuegbar', 'warning'
                );
            }
        });
        if (!ok && !Logbook.isSpeechActive()) setMicState(false);
    }

    async function handlePhoto(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        try {
            currentPhotoData = await Logbook.fileToDataURL(file);
            const img = $('lb-photo-preview');
            img.src = currentPhotoData;
            img.classList.remove('hidden');
            $('btn-lb-photo-clear').classList.remove('hidden');
        } catch {
            UI && UI.showToast && UI.showToast('Foto konnte nicht geladen werden', 'error');
        }
    }

    function clearPhoto() {
        currentPhotoData = null;
        $('lb-photo-input').value = '';
        const img = $('lb-photo-preview');
        img.src = '';
        img.classList.add('hidden');
        $('btn-lb-photo-clear').classList.add('hidden');
    }

    function handleSubmit(e) {
        e.preventDefault();
        const guard = $('lb-guard').value.trim();
        const location = $('lb-location').value.trim();
        const type = $('lb-type').value;
        const description = $('lb-description').value.trim();
        const timeVal = $('lb-time').value;
        const timestamp = timeVal ? new Date(timeVal).toISOString() : new Date().toISOString();

        if (!guard || !location || !description) {
            UI && UI.showToast && UI.showToast('Bitte Pflichtfelder ausfuellen', 'warning');
            return;
        }

        Logbook.addEntry({
            guard, location, type, description, timestamp,
            photo: currentPhotoData
        });

        Logbook.saveSettings({ guard, location });

        $('lb-description').value = '';
        clearPhoto();
        $('lb-time').value = nowLocalDateTime();
        Logbook.stopSpeech();
        setMicState(false);

        renderEntries();
        UI && UI.showToast && UI.showToast('Wachbuch-Eintrag gespeichert', 'success');
    }

    function bind() {
        const openBtn = $('btn-logbook');
        if (openBtn) openBtn.addEventListener('click', open);
        const closeBtn = $('btn-logbook-close');
        if (closeBtn) closeBtn.addEventListener('click', close);

        const dateInput = $('logbook-date');
        if (dateInput) dateInput.addEventListener('change', renderEntries);

        const exportBtn = $('btn-logbook-export');
        if (exportBtn) exportBtn.addEventListener('click', () => {
            const ok = Logbook.exportShiftPDF($('logbook-date').value);
            if (!ok) {
                UI && UI.showToast && UI.showToast(
                    'Popup-Blocker verhindert Export. Bitte erlauben.', 'warning'
                );
            }
        });

        const micBtn = $('btn-lb-mic');
        if (micBtn) micBtn.addEventListener('click', handleMic);

        const photoBtn = $('btn-lb-photo');
        const photoInput = $('lb-photo-input');
        const photoClear = $('btn-lb-photo-clear');
        if (photoBtn) photoBtn.addEventListener('click', () => photoInput.click());
        if (photoInput) photoInput.addEventListener('change', handlePhoto);
        if (photoClear) photoClear.addEventListener('click', clearPhoto);

        const form = $('logbook-form');
        if (form) {
            form.addEventListener('submit', handleSubmit);
            form.addEventListener('reset', () => {
                clearPhoto();
                Logbook.stopSpeech();
                setMicState(false);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
    } else {
        bind();
    }
})();
