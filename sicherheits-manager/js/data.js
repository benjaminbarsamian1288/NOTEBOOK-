/**
 * Data - Laedt und verwaltet alle Regelwerke
 */
const Data = (function() {
    let regelwerke = [];
    let allParagraphen = []; // Flache Liste fuer Suche
    let paragraphIndex = {}; // id -> {paragraph, regelwerk}

    async function loadAll() {
        try {
            const indexRes = await fetch('./data/index.json');
            const index = await indexRes.json();

            const loaded = await Promise.all(
                index.regelwerke.map(file =>
                    fetch('./data/' + file).then(r => r.json()).catch(err => {
                        console.warn('Konnte Regelwerk nicht laden:', file, err);
                        return null;
                    })
                )
            );

            regelwerke = loaded.filter(r => r !== null);
            buildIndex();
            return regelwerke;
        } catch (e) {
            console.error('Data load failed:', e);
            return [];
        }
    }

    function buildIndex() {
        allParagraphen = [];
        paragraphIndex = {};

        regelwerke.forEach(rw => {
            (rw.kapitel || []).forEach(kap => {
                (kap.paragraphen || []).forEach(p => {
                    const entry = {
                        ...p,
                        regelwerkId: rw.id,
                        regelwerkKuerzel: rw.kuerzel,
                        regelwerkTitle: rw.title,
                        regelwerkFarbe: rw.farbe,
                        kapitelTitle: kap.title
                    };
                    allParagraphen.push(entry);
                    paragraphIndex[p.id] = entry;
                });
            });
        });
    }

    function getRegelwerke() { return regelwerke; }

    function getRegelwerk(id) {
        return regelwerke.find(r => r.id === id);
    }

    function getParagraph(id) {
        return paragraphIndex[id] || null;
    }

    function getAllParagraphen() { return allParagraphen; }

    function countByRegelwerk(id) {
        const rw = getRegelwerk(id);
        if (!rw) return 0;
        return (rw.kapitel || []).reduce(
            (sum, k) => sum + (k.paragraphen || []).length, 0
        );
    }

    return {
        loadAll,
        getRegelwerke,
        getRegelwerk,
        getParagraph,
        getAllParagraphen,
        countByRegelwerk
    };
})();
