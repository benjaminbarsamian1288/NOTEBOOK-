/**
 * Logbook Module - Elektronisches Wachbuch
 * Strukturierte Eintraege mit Zeitstempel, Wachperson, Ort, Ereignistyp,
 * Beschreibung und Foto. KI-Erkennung: Sprache->Text via Web Speech API.
 * Speicherung lokal (localStorage), Export als PDF (Druckdialog).
 */
const Logbook = (() => {
    const STORAGE_KEY = 'voicenote_logbook';
    const SETTINGS_KEY = 'voicenote_logbook_settings';

    const EVENT_TYPES = [
        'Rundgang',
        'Vorfall',
        'Uebergabe',
        'Schluesselausgabe',
        'Besucher',
        'Alarm',
        'Stoerung',
        'Sonstiges'
    ];

    const SEVERITY_LEVELS = [
        { value: 'info',     label: 'Info',     color: '#3498db' },
        { value: 'niedrig',  label: 'Niedrig',  color: '#2ecc71' },
        { value: 'mittel',   label: 'Mittel',   color: '#f39c12' },
        { value: 'hoch',     label: 'Hoch',     color: '#e67e22' },
        { value: 'kritisch', label: 'Kritisch', color: '#e74c3c' }
    ];

    let recognition = null;
    let recognitionActive = false;
    let recognitionTarget = null;
    let recognitionBaseText = '';

    // ===== Storage =====
    function getEntries() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    function saveEntries(entries) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }

    function getSettings() {
        try {
            const raw = localStorage.getItem(SETTINGS_KEY);
            return raw ? JSON.parse(raw) : { guard: '', location: '' };
        } catch {
            return { guard: '', location: '' };
        }
    }

    function saveSettings(s) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    }

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
    }

    function addEntry(entry) {
        const entries = getEntries();
        const e = {
            id: generateId(),
            timestamp: entry.timestamp || new Date().toISOString(),
            guard: entry.guard || '',
            location: entry.location || '',
            type: entry.type || 'Sonstiges',
            severity: entry.severity || 'info',
            description: entry.description || '',
            photo: entry.photo || null,
            gps: entry.gps || null,
            createdAt: new Date().toISOString()
        };
        entries.push(e);
        saveEntries(entries);
        return e;
    }

    function deleteEntry(id) {
        const entries = getEntries().filter(e => e.id !== id);
        saveEntries(entries);
    }

    function clearAll() {
        saveEntries([]);
    }

    // ===== Filtering =====
    function entriesForDate(dateString) {
        const target = dateString || new Date().toISOString().slice(0, 10);
        return getEntries()
            .filter(e => (e.timestamp || '').slice(0, 10) === target)
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }

    function searchEntries({ query = '', type = '', severity = '', dateFrom = '', dateTo = '' } = {}) {
        const q = query.trim().toLowerCase();
        return getEntries().filter(e => {
            if (type && e.type !== type) return false;
            if (severity && (e.severity || 'info') !== severity) return false;
            const day = (e.timestamp || '').slice(0, 10);
            if (dateFrom && day < dateFrom) return false;
            if (dateTo && day > dateTo) return false;
            if (!q) return true;
            const haystack = [
                e.guard, e.location, e.type, e.severity, e.description
            ].join(' ').toLowerCase();
            return haystack.includes(q);
        }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    function shiftStats(dateString) {
        const entries = entriesForDate(dateString);
        const byType = {};
        const bySeverity = {};
        entries.forEach(e => {
            byType[e.type] = (byType[e.type] || 0) + 1;
            const sev = e.severity || 'info';
            bySeverity[sev] = (bySeverity[sev] || 0) + 1;
        });
        return {
            total: entries.length,
            firstAt: entries[0] ? entries[0].timestamp : null,
            lastAt: entries.length ? entries[entries.length - 1].timestamp : null,
            byType,
            bySeverity
        };
    }

    // ===== GPS =====
    function captureGPS(timeoutMs = 8000) {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve(null);
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    accuracy: pos.coords.accuracy,
                    capturedAt: new Date().toISOString()
                }),
                () => resolve(null),
                { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 30000 }
            );
        });
    }

    // ===== Speech Recognition (KI-Erkennung) =====
    function isSpeechSupported() {
        return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    }

    function startSpeech(targetEl, onStatus) {
        if (!isSpeechSupported()) {
            onStatus && onStatus('not-supported');
            return false;
        }
        if (recognitionActive) {
            stopSpeech();
            return false;
        }
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SR();
        recognition.lang = 'de-DE';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognitionTarget = targetEl;
        recognitionBaseText = targetEl.value || '';

        recognition.onresult = (event) => {
            let interim = '';
            let finalText = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const res = event.results[i];
                if (res.isFinal) finalText += res[0].transcript;
                else interim += res[0].transcript;
            }
            if (finalText) {
                recognitionBaseText = (recognitionBaseText
                    ? recognitionBaseText.replace(/\s+$/, '') + ' '
                    : '') + finalText.trim() + ' ';
                recognitionTarget.value = recognitionBaseText;
            } else {
                recognitionTarget.value = recognitionBaseText + interim;
            }
            recognitionTarget.dispatchEvent(new Event('input'));
        };

        recognition.onerror = (e) => {
            recognitionActive = false;
            onStatus && onStatus('error', e.error);
        };

        recognition.onend = () => {
            recognitionActive = false;
            onStatus && onStatus('ended');
        };

        try {
            recognition.start();
            recognitionActive = true;
            onStatus && onStatus('started');
            return true;
        } catch (err) {
            recognitionActive = false;
            onStatus && onStatus('error', err.message);
            return false;
        }
    }

    function stopSpeech() {
        if (recognition && recognitionActive) {
            try { recognition.stop(); } catch { /* ignore */ }
        }
        recognitionActive = false;
    }

    function isSpeechActive() {
        return recognitionActive;
    }

    // ===== Photo =====
    function fileToDataURL(file, maxW = 1280) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                    const scale = Math.min(1, maxW / img.width);
                    const w = Math.round(img.width * scale);
                    const h = Math.round(img.height * scale);
                    const canvas = document.createElement('canvas');
                    canvas.width = w;
                    canvas.height = h;
                    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                    resolve(canvas.toDataURL('image/jpeg', 0.82));
                };
                img.onerror = reject;
                img.src = reader.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // ===== PDF Export (via Druckdialog) =====
    function escapeHtml(s) {
        return String(s || '').replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    function exportShiftPDF(dateString) {
        const date = dateString || new Date().toISOString().slice(0, 10);
        const entries = entriesForDate(date);
        const settings = getSettings();
        const dateFmt = new Date(date + 'T00:00:00').toLocaleDateString('de-DE', {
            weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
        });

        const sevColor = (s) => {
            const found = SEVERITY_LEVELS.find(x => x.value === s);
            return found ? found.color : '#666';
        };
        const sevLabel = (s) => {
            const found = SEVERITY_LEVELS.find(x => x.value === s);
            return found ? found.label : (s || 'Info');
        };

        const rows = entries.map((e, i) => {
            const time = new Date(e.timestamp).toLocaleTimeString('de-DE', {
                hour: '2-digit', minute: '2-digit'
            });
            const photo = e.photo
                ? `<img src="${e.photo}" alt="Foto" />`
                : '';
            const sev = e.severity || 'info';
            const sevTag = `<span class="sev" style="background:${sevColor(sev)}">${escapeHtml(sevLabel(sev))}</span>`;
            const gps = e.gps
                ? `<div class="gps">GPS: ${e.gps.latitude.toFixed(5)}, ${e.gps.longitude.toFixed(5)} (&plusmn;${Math.round(e.gps.accuracy)} m)</div>`
                : '';
            return `<tr>
                <td>${i + 1}</td>
                <td>${time}</td>
                <td>${escapeHtml(e.guard)}</td>
                <td>${escapeHtml(e.location)}</td>
                <td><strong>${escapeHtml(e.type)}</strong><br>${sevTag}</td>
                <td>${escapeHtml(e.description).replace(/\n/g, '<br>')}${gps}${photo ? '<div class="photo">' + photo + '</div>' : ''}</td>
            </tr>`;
        }).join('');

        const html = `<!DOCTYPE html>
<html lang="de"><head><meta charset="UTF-8"><title>Wachbuch ${dateFmt}</title>
<style>
    body { font-family: Arial, sans-serif; margin: 20mm; color: #000; }
    h1 { margin: 0 0 4px 0; font-size: 18pt; }
    .meta { font-size: 10pt; color: #444; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 10pt; }
    th, td { border: 1px solid #333; padding: 6px; vertical-align: top; }
    th { background: #eee; text-align: left; }
    td:nth-child(1) { width: 30px; text-align: center; }
    td:nth-child(2) { width: 60px; }
    td:nth-child(3), td:nth-child(4) { width: 110px; }
    td:nth-child(5) { width: 110px; }
    .photo img { max-width: 200px; max-height: 150px; margin-top: 6px; border: 1px solid #999; }
    .sev { display: inline-block; color: #fff; padding: 1px 6px; border-radius: 8px; font-size: 9pt; font-weight: 600; margin-top: 2px; }
    .gps { margin-top: 4px; font-size: 9pt; color: #555; font-family: monospace; }
    .signature { margin-top: 40px; display: flex; justify-content: space-between; font-size: 10pt; }
    .signature div { width: 45%; border-top: 1px solid #000; padding-top: 4px; }
    @media print { body { margin: 10mm; } }
</style></head><body>
<h1>Elektronisches Wachbuch</h1>
<div class="meta">Schicht: <strong>${dateFmt}</strong> &middot; Wachperson: <strong>${escapeHtml(settings.guard) || '&mdash;'}</strong> &middot; ${entries.length} Eintr&auml;ge</div>
<table>
    <thead><tr>
        <th>#</th><th>Zeit</th><th>Wachperson</th><th>Ort</th><th>Typ</th><th>Beschreibung</th>
    </tr></thead>
    <tbody>${rows || '<tr><td colspan="6" style="text-align:center;color:#888">Keine Eintr&auml;ge</td></tr>'}</tbody>
</table>
<div class="signature">
    <div>Unterschrift Wachperson</div>
    <div>Unterschrift Schichtleitung</div>
</div>
<script>window.onload = () => setTimeout(() => window.print(), 300);</script>
</body></html>`;

        const w = window.open('', '_blank');
        if (!w) return false;
        w.document.open();
        w.document.write(html);
        w.document.close();
        return true;
    }

    // ===== JSON Backup =====
    function exportJSON() {
        const data = {
            app: 'wachbuch',
            version: 1,
            exportedAt: new Date().toISOString(),
            settings: getSettings(),
            entries: getEntries()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wachbuch-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function importJSON(file, { mode = 'merge' } = {}) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const data = JSON.parse(reader.result);
                    if (!data || !Array.isArray(data.entries)) {
                        reject(new Error('Ungueltiges Backup-Format'));
                        return;
                    }
                    const incoming = data.entries.filter(e => e && e.id && e.timestamp);
                    let merged;
                    if (mode === 'replace') {
                        merged = incoming;
                    } else {
                        const existing = getEntries();
                        const ids = new Set(existing.map(e => e.id));
                        merged = existing.concat(incoming.filter(e => !ids.has(e.id)));
                    }
                    merged.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                    saveEntries(merged);
                    if (data.settings && mode === 'replace') saveSettings(data.settings);
                    resolve({ imported: incoming.length, total: merged.length });
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden'));
            reader.readAsText(file);
        });
    }

    return {
        EVENT_TYPES, SEVERITY_LEVELS,
        getEntries, addEntry, deleteEntry, clearAll, entriesForDate,
        searchEntries, shiftStats,
        getSettings, saveSettings,
        isSpeechSupported, startSpeech, stopSpeech, isSpeechActive,
        fileToDataURL, exportShiftPDF,
        captureGPS,
        exportJSON, importJSON
    };
})();
