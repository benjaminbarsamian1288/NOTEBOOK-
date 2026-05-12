/**
 * Search - Volltext-Suche ueber alle Paragraphen
 */
const Search = (function() {

    function normalize(s) {
        return (s || '').toString().toLowerCase()
            .replace(/[äÄ]/g, 'a').replace(/[öÖ]/g, 'o')
            .replace(/[üÜ]/g, 'u').replace(/[ß]/g, 'ss');
    }

    function score(paragraph, query) {
        const q = normalize(query);
        if (!q) return 0;

        const nummer = normalize(paragraph.nummer);
        const titel = normalize(paragraph.titel);
        const kurz = normalize(paragraph.kurz);
        const text = normalize(paragraph.text);
        const tags = (paragraph.tags || []).map(normalize).join(' ');
        const kuerzel = normalize(paragraph.regelwerkKuerzel);

        let s = 0;
        if (nummer.includes(q)) s += 50;
        if (titel.includes(q)) s += 30;
        if (kuerzel.includes(q)) s += 15;
        if (tags.includes(q)) s += 20;
        if (kurz.includes(q)) s += 10;
        if (text.includes(q)) s += 5;

        // Bonus fuer Match am Wortanfang
        const words = (titel + ' ' + tags).split(/\s+/);
        if (words.some(w => w.startsWith(q))) s += 8;

        return s;
    }

    function suche(query, options = {}) {
        const all = Data.getAllParagraphen();
        if (!query || !query.trim()) {
            if (options.regelwerkFilter) {
                return all.filter(p => p.regelwerkId === options.regelwerkFilter);
            }
            return [];
        }

        const results = all.map(p => ({
            paragraph: p,
            score: score(p, query)
        })).filter(r => r.score > 0);

        if (options.regelwerkFilter) {
            return results
                .filter(r => r.paragraph.regelwerkId === options.regelwerkFilter)
                .sort((a, b) => b.score - a.score)
                .map(r => r.paragraph);
        }

        results.sort((a, b) => b.score - a.score);
        return results.map(r => r.paragraph);
    }

    function highlight(text, query) {
        if (!text || !query || !query.trim()) return escapeHtml(text);
        const safe = escapeHtml(text);
        try {
            const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const re = new RegExp('(' + escapedQuery + ')', 'gi');
            return safe.replace(re, '<mark>$1</mark>');
        } catch (e) {
            return safe;
        }
    }

    function escapeHtml(s) {
        if (s == null) return '';
        return s.toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    return { suche, highlight, escapeHtml };
})();
