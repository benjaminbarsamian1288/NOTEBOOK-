/**
 * AI - Smart Assistant
 * Funktioniert offline (regelbasiert + Volltextsuche)
 * Optional: Eigene API-Key fuer echte LLM-Antworten
 */
const AI = (function() {

    const STORAGE_KEY = 'sima_ai_settings';

    function getSettings() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        } catch (e) {
            return {};
        }
    }

    function saveSettings(s) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    }

    const SUGGESTIONS = [
        'Was sagt § 3 DGUV V1?',
        'Erklaere mir PSA',
        'Was ist Sachkundepruefung?',
        'Wer braucht einen Dienstausweis?',
        'Wann muss unterwiesen werden?',
        'Was bedeutet Gefaehrdungsbeurteilung?',
        'Welche Bewachungsformen gibt es?',
        'Was steht in DIN 77200?'
    ];

    // Regelbasierte Mustererkennung
    function parseQuery(query) {
        const q = query.toLowerCase().trim();

        // §-Suche
        const paragraphMatch = q.match(/(?:§|paragraph|paragraf)\s*(\d+)/);
        if (paragraphMatch) {
            return { type: 'paragraph_number', num: paragraphMatch[1] };
        }

        // Greeting
        if (/^(hi|hallo|hey|servus|moin|guten)/.test(q)) {
            return { type: 'greeting' };
        }

        // Hilfe
        if (/(hilfe|help|was kannst du|wie funktioniert)/.test(q)) {
            return { type: 'help' };
        }

        // Erklaerung
        if (/^(was ist|was bedeutet|erklaer|erklare|definiere|definition)/.test(q)) {
            return { type: 'definition', term: q.replace(/^(was ist|was bedeutet|erklaer|erklare|definiere|definition)\s*/, '').replace(/[?!.]/g, '').trim() };
        }

        // Quiz
        if (/quiz|frage mich|teste mich/.test(q)) {
            return { type: 'quiz' };
        }

        // Default: Search
        return { type: 'search', query: q };
    }

    function findParagraphenByNumber(num) {
        return Data.getAllParagraphen().filter(p => {
            const n = (p.nummer || '').match(/\d+/);
            return n && n[0] === num;
        });
    }

    function makeResultCard(p) {
        const rw = Data.getRegelwerk(p.regelwerkId);
        return `<button class="result-card" data-paragraph="${escape(p.id)}" style="--rk-color:${escape(rw.farbe)}">
            <span class="nummer-pill" style="background:${escape(rw.farbe)}">${escape(rw.kuerzel)} ${escape(p.nummer)}</span>
            <span class="titel">${escape(p.titel)}</span>
            <div class="kurz">${escape(p.kurz || '')}</div>
        </button>`;
    }

    function escape(s) {
        if (s == null) return '';
        return s.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // Offline-Antwortgenerator
    function answerOffline(query) {
        const parsed = parseQuery(query);

        if (parsed.type === 'greeting') {
            return {
                text: `Hallo! 👋 Ich bin deine KI-Assistentin fuer Sicherheitsvorschriften.<br><br>Frag mich z.B.:<br>• <em>"Was sagt § 3 DGUV V1?"</em><br>• <em>"Erklaer mir PSA"</em><br>• <em>"Was ist eine Gefaehrdungsbeurteilung?"</em>`
            };
        }

        if (parsed.type === 'help') {
            return {
                text: `Ich kann dir helfen mit:<br>📖 <strong>Paragraphen nachschlagen</strong> - "§ 3 DGUV V1"<br>🔍 <strong>Themen erklaeren</strong> - "Was ist PSA?"<br>🎯 <strong>Suchen</strong> - "Unterweisung"<br>🎓 <strong>Quiz</strong> - "Stell mir eine Frage"<br><br>Du kannst auch unten in der Eingabe einfach Stichwoerter eintippen.`
            };
        }

        if (parsed.type === 'paragraph_number') {
            const found = findParagraphenByNumber(parsed.num);
            if (found.length === 0) {
                return { text: `Ich habe keinen § ${escape(parsed.num)} gefunden. Tipp: Du kannst auch den Regelwerk-Namen mit angeben, z.B. "§ 3 DGUV V1".` };
            }
            if (found.length === 1) {
                const p = found[0];
                return {
                    text: `Hier ist <strong>§ ${escape(parsed.num)}</strong> aus <strong>${escape(p.regelwerkKuerzel)}</strong>:<br><br>${makeResultCard(p)}`
                };
            }
            return {
                text: `Ich habe <strong>${found.length} Paragraphen</strong> mit Nummer ${escape(parsed.num)} gefunden:<br>${found.map(makeResultCard).join('')}`
            };
        }

        if (parsed.type === 'quiz') {
            const all = Data.getAllParagraphen().filter(p => !p.platzhalter);
            if (!all.length) return { text: 'Keine Inhalte fuer Quiz verfuegbar.' };
            const p = all[Math.floor(Math.random() * all.length)];
            return {
                text: `<strong>🎓 Quiz!</strong><br><br>Aus welchem Regelwerk und Paragraph stammt diese Beschreibung?<br><br><em>"${escape(p.kurz || (p.text || '').substring(0, 120) + '...')}"</em><br><br>Tipp auf "Aufloesen", wenn du es wissen willst:<br>${makeResultCard(p)}`
            };
        }

        if (parsed.type === 'definition' || parsed.type === 'search') {
            const term = parsed.term || parsed.query;
            const results = Search.suche(term).slice(0, 5);

            if (results.length === 0) {
                return {
                    text: `Ich habe nichts zu <em>"${escape(term)}"</em> gefunden. 🤔<br><br>Versuche andere Stichworte oder schau in den <strong>4 Regelwerken</strong> nach.`
                };
            }

            const intro = parsed.type === 'definition'
                ? `Hier sind die Stellen, die <em>"${escape(term)}"</em> erklaeren:`
                : `Ich habe <strong>${results.length} Treffer</strong> fuer <em>"${escape(term)}"</em> gefunden:`;

            return {
                text: `${intro}<br>${results.map(makeResultCard).join('')}`
            };
        }

        return { text: 'Ich verstehe deine Frage leider nicht. Versuche es einfacher, z.B. "PSA" oder "§ 3".' };
    }

    // Mit API (Claude / OpenAI) - optional
    async function answerOnline(query, settings) {
        if (!settings.apiKey || !settings.provider) {
            return answerOffline(query);
        }

        // Kontext aus relevanten Paragraphen
        const relevant = Search.suche(query).slice(0, 5);
        const context = relevant.map(p =>
            `[${p.regelwerkKuerzel} ${p.nummer} - ${p.titel}]\n${p.kurz || ''}\n${p.text || ''}`
        ).join('\n\n---\n\n');

        const system = `Du bist eine deutsche KI-Assistentin fuer Sicherheitsvorschriften (DGUV V1, DGUV V23, BewachV, DIN 77200). Antworte praezise und nur basierend auf dem gegebenen Kontext. Wenn etwas nicht im Kontext steht, sage das ehrlich.

KONTEXT:
${context || '(keine spezifischen Paragraphen gefunden)'}`;

        try {
            if (settings.provider === 'anthropic') {
                const res = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': settings.apiKey,
                        'anthropic-version': '2023-06-01',
                        'anthropic-dangerous-direct-browser-access': 'true'
                    },
                    body: JSON.stringify({
                        model: settings.model || 'claude-haiku-4-5-20251001',
                        max_tokens: 600,
                        system,
                        messages: [{ role: 'user', content: query }]
                    })
                });
                if (!res.ok) throw new Error('API-Fehler: ' + res.status);
                const data = await res.json();
                const text = (data.content || []).map(c => c.text).join('\n');
                return { text: formatAnswer(text, relevant) };
            } else if (settings.provider === 'openai') {
                const res = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + settings.apiKey
                    },
                    body: JSON.stringify({
                        model: settings.model || 'gpt-4o-mini',
                        messages: [
                            { role: 'system', content: system },
                            { role: 'user', content: query }
                        ],
                        max_tokens: 600
                    })
                });
                if (!res.ok) throw new Error('API-Fehler: ' + res.status);
                const data = await res.json();
                const text = data.choices?.[0]?.message?.content || '';
                return { text: formatAnswer(text, relevant) };
            }
        } catch (e) {
            console.warn('AI online failed:', e);
            return {
                text: `<em>API-Fehler - nutze Offline-Modus.</em><br><br>${answerOffline(query).text}`
            };
        }

        return answerOffline(query);
    }

    function formatAnswer(text, relevant) {
        // Einfaches Markdown
        let html = escape(text)
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');

        if (relevant.length) {
            html += `<br><br><strong>📚 Quellen:</strong><br>${relevant.slice(0, 3).map(makeResultCard).join('')}`;
        }
        return html;
    }

    async function answer(query) {
        const settings = getSettings();
        if (settings.apiKey && settings.provider && !settings.disabled) {
            return await answerOnline(query, settings);
        }
        return answerOffline(query);
    }

    function getRandomSuggestions(n = 4) {
        const shuffled = SUGGESTIONS.slice().sort(() => Math.random() - 0.5);
        return shuffled.slice(0, n);
    }

    return {
        answer,
        getSettings,
        saveSettings,
        getRandomSuggestions
    };
})();
