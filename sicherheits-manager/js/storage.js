/**
 * Storage - LocalStorage Wrapper fuer Notizen, Favoriten, Verlauf
 */
const Storage = (function() {
    const KEYS = {
        favoriten: 'sima_favoriten',
        notizen: 'sima_notizen',
        verlauf: 'sima_verlauf',
        theme: 'sima_theme'
    };

    function load(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            console.warn('Storage load failed:', key, e);
            return fallback;
        }
    }

    function save(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('Storage save failed:', key, e);
        }
    }

    return {
        // Favoriten
        getFavoriten() { return load(KEYS.favoriten, []); },
        isFavorit(paragraphId) {
            return this.getFavoriten().includes(paragraphId);
        },
        toggleFavorit(paragraphId) {
            const favs = this.getFavoriten();
            const idx = favs.indexOf(paragraphId);
            if (idx >= 0) favs.splice(idx, 1);
            else favs.push(paragraphId);
            save(KEYS.favoriten, favs);
            return idx < 0; // true wenn jetzt favorit
        },

        // Notizen
        getNotizen() { return load(KEYS.notizen, {}); },
        getNotiz(paragraphId) {
            return this.getNotizen()[paragraphId] || '';
        },
        saveNotiz(paragraphId, text) {
            const notizen = this.getNotizen();
            if (text && text.trim()) {
                notizen[paragraphId] = text;
            } else {
                delete notizen[paragraphId];
            }
            save(KEYS.notizen, notizen);
        },
        hatNotiz(paragraphId) {
            const n = this.getNotiz(paragraphId);
            return !!(n && n.trim());
        },

        // Verlauf
        getVerlauf() { return load(KEYS.verlauf, []); },
        addToVerlauf(paragraphId) {
            const v = this.getVerlauf().filter(id => id !== paragraphId);
            v.unshift(paragraphId);
            if (v.length > 50) v.length = 50;
            save(KEYS.verlauf, v);
        },
        clearVerlauf() { save(KEYS.verlauf, []); },

        // Theme
        getTheme() { return load(KEYS.theme, 'auto'); },
        setTheme(theme) { save(KEYS.theme, theme); }
    };
})();
