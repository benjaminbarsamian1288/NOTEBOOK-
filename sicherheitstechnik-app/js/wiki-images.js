/* Wiki-Images · holt echte Bilder von Wikipedia zur Laufzeit
   Nutzt die REST-API: https://de.wikipedia.org/api/rest_v1/page/summary/{title}
   Lizenz: CC-BY-SA / Public Domain
   Cache in localStorage damit nicht bei jedem App-Start neu */

window.WIKI_IMG = (() => {
  const CACHE_KEY = 'wiki_img_cache_v1';
  const PENDING = new Map();

  /* Handgepflegte Wikipedia-Page-Titles pro Komponenten-Key
     Wenn key in dieser Tabelle steht, wird genau diese Seite angefragt.
     Sonst Fallback auf Suche nach Komponenten-Name. */
  const WIKI_TITLES = {
    // Melder
    'pir-standard':       'Passiver Infrarotmelder',
    'pir-deckenmelder':   'Passiver Infrarotmelder',
    'mw-doppler':         'Mikrowellensensor',
    'glasbruch-akustisch':'Glasbruchmelder',
    'magnet-kontakt':     'Reedschalter',
    'rauchmelder-optisch':'Rauchwarnmelder',
    'thermo-diff':        'Brandmelder',
    'flamm-uv-ir':        'Flammenmelder',

    // Mechanik
    'tuer-rc2':           'Einbruchhemmung',
    'tuer-rc3':           'Einbruchhemmung',
    'tresor-1':           'Wertschutzschrank',
    'tresor-2':           'Wertschutzschrank',
    'tresor-3':           'Wertschutzschrank',
    'fenster-rc2':        'Einbruchhemmung',
    'zaun-maschen':       'Maschendrahtzaun',
    'zaun-dopstab':       'Doppelstabmatte',
    'zaun-palisade':      'Palisade',
    'zaun-nato':          'Stacheldraht',
    'zaun-elektro':       'Elektrozaun',
    'poller-versenk-hydr':'Poller',
    'poller-fest':        'Poller',
    'tor-schiebe':        'Schiebetor',
    'tor-dreh':           'Drehflügeltor',
    'tor-schranke':       'Schranke (Verkehr)',
    'tor-sektional':      'Sektionaltor',
    'drehkreuz':          'Drehkreuz',
    'profilzylinder':     'Profilzylinder',
    'mehrfachverr':       'Mehrfachverriegelung',
    'glas-vsg':           'Verbundsicherheitsglas',
    'glas-p4a':           'Verbundsicherheitsglas',
    'glas-br3':           'Panzerglas',
    'glas-br6':           'Panzerglas',

    // Video
    'cam-bullet':         'Überwachungskamera',
    'cam-dome':           'Überwachungskamera',
    'cam-ptz':            'Schwenk-Neige-Kamera',
    'cam-thermal':        'Wärmebildkamera',
    'cam-fisheye':        '360°-Kamera',
    'cam-anpr':           'Automatische Nummernschilderkennung',
    'nvr':                'Videoaufzeichnungssystem',

    // Brand
    'sprinkler-nass':     'Sprinkleranlage',
    'sprinkler-trocken':  'Sprinkleranlage',
    'co2-anlage':         'Kohlendioxid-Löschanlage',
    'novec1230':          'FM-200',
    'schaum-anlage':      'Schaumlöschanlage',
    'wandhydrant':        'Hydrant',
    'feuerloescher':      'Feuerlöscher',
    'asd':                'Rauchansaugsystem',

    // Zutritt
    'rfid-mifare':        'Mifare',
    'fingerprint':        'Fingerabdruckerkennung',
    'gesichtserkennung':  'Gesichtserkennung',
    'iris-scan':          'Iriserkennung',
    'pin-tastatur':       'Codeschloss',
    'bluetooth-lock':     'Schloss (Technik)',
    'drehkreuz-hh':       'Drehkreuz',

    // Alarmierung
    'ema-zentrale':       'Einbruchmeldeanlage',
    'sirene-aussen':      'Alarmsirene',
    'sirene-innen':       'Alarmsirene',
    'gsm-uebertragung':   'GSM',
    'notruf-knopf':       'Notrufmelder',
    'erschuett-melder':   'Erschütterungssensor',
  };

  /* Cache laden */
  function loadCache() {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; }
    catch { return {}; }
  }
  function saveCache(c) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch {}
  }
  const cache = loadCache();

  /* Wiki-Title für Komponente bestimmen */
  function titleFor(comp) {
    if (WIKI_TITLES[comp.key]) return WIKI_TITLES[comp.key];
    // Fallback: erstes Wort des Namens (oft das relevante)
    return comp.name.split(/[\s·(]/)[0].replace(/[^\wäöüÄÖÜß]/g, '');
  }

  /* Wikipedia REST API anfragen */
  async function fetchSummary(title) {
    const url = `https://de.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    try {
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) return null;
      const data = await res.json();
      return data;
    } catch {
      return null;
    }
  }

  /* Bild-URL für eine Komponente holen (mit Cache) */
  async function getImageUrl(comp) {
    const key = comp.key;
    if (cache[key]) return cache[key];      // Cache-Hit (auch null = kein Bild verfügbar)
    if (PENDING.has(key)) return PENDING.get(key);
    const title = titleFor(comp);
    const promise = (async () => {
      const data = await fetchSummary(title);
      let imgUrl = null;
      if (data) {
        imgUrl = (data.thumbnail && data.thumbnail.source)
              || (data.originalimage && data.originalimage.source)
              || null;
        // Upscale für bessere Qualität (Wikipedia liefert oft 320px Thumbs)
        if (imgUrl && imgUrl.includes('/thumb/')) {
          imgUrl = imgUrl.replace(/\/\d+px-[^/]+$/, '/600px-' + imgUrl.split('/').pop().replace(/^\d+px-/, ''));
        }
      }
      cache[key] = imgUrl;
      saveCache(cache);
      PENDING.delete(key);
      return imgUrl;
    })();
    PENDING.set(key, promise);
    return promise;
  }

  /* Komplette Vorab-Ladung (im Hintergrund) für sichtbare Komponenten */
  async function preloadFor(components) {
    const queue = components.filter(c => !(c.key in cache));
    // 4 parallel
    const workers = Array(4).fill(null).map(async () => {
      while (queue.length) {
        const c = queue.shift();
        if (c) await getImageUrl(c);
      }
    });
    await Promise.all(workers);
  }

  /* Bild-Tag rendern mit Lazy-Load + Fallback */
  function imgTag(comp, opts = {}) {
    const { className = '', alt = '' } = opts;
    const cached = cache[comp.key];
    if (cached === null) return ''; // bekannt: kein Bild
    if (cached) return `<img src="${cached}" alt="${alt || comp.name}" class="${className}" loading="lazy" referrerpolicy="no-referrer">`;
    // noch nicht im Cache → leeres Element + nachladen
    const id = 'wiki-img-' + comp.key.replace(/[^\w]/g, '');
    setTimeout(async () => {
      const url = await getImageUrl(comp);
      const el = document.getElementById(id);
      if (el && url) {
        el.outerHTML = `<img id="${id}" src="${url}" alt="${alt || comp.name}" class="${className}" loading="lazy" referrerpolicy="no-referrer">`;
      } else if (el) {
        el.remove();
      }
    }, 50);
    return `<span id="${id}" class="${className} wiki-img-placeholder" data-key="${comp.key}"></span>`;
  }

  function clearCache() {
    Object.keys(cache).forEach(k => delete cache[k]);
    localStorage.removeItem(CACHE_KEY);
  }

  return {
    getImageUrl, imgTag, preloadFor, titleFor, clearCache,
    WIKI_TITLES, cache,
  };
})();
