/* App bootstrap – routing, theme, mobile menu, install prompt, global search */
(function() {
  const { $, $$, el, toast, debounce, closeDrawer } = U;

  const ROUTES = {
    home: V.home,
    konzept: V.konzept,
    klassen: V.klassen,
    perimeter: V.perimeter,
    aussenhaut: V.aussenhaut,
    melder: V.melder,
    enzyklopaedie: (d) => ENCYVIEW.view(d),
    ema: V.ema,
    preisliste: V.preisliste,
    wizard: (d) => WIZARD.render(d),
    konfigurator: V.konfigurator,
    calculators: (d) => TOOLS.calculators(d),
    simulator: V.simulator,
    building3d: (d) => BLDG3D.view(d),
    spektrum: () => SPEK.view(),
    physik: () => PHYSIK.view(),
    spiel: () => SPIEL.view(),
    sandbox: () => SANDBOX.view(),
    galerie: (d) => GALLERY.view(d),
    zwiebel3d: (d) => ZWIEBEL3D.view(d),
    haus3d: (d) => HAUS3D.view(d),
    wwd: (d) => WWD.view(d),
    mechanik: (d) => MECHANIK.view(d),
    mechency: (d) => MECH_ENCY_VIEW.view(d),
    katalog:    (d) => KATALOG_VIEW.masterHub(d),
    'kat-video':(d) => KATALOG_VIEW.videoView(d),
    'kat-brand':(d) => KATALOG_VIEW.brandView(d),
    'kat-zka':  (d) => KATALOG_VIEW.zkaView(d),
    'kat-ema':  (d) => KATALOG_VIEW.emaView(d),
    lab:        (d) => LAB.view(d),
    fp:         (d) => FLOORPLAN.view(d),
    masterency: (d) => MASTER_ENCY.view(d),
    werk:       (d) => WERK.view(d),
    gesetze: (d) => GESETZE_VIEW.view(d),
    mediathek: (d) => MEDIATHEK.view(d),
    vergleich: V.vergleich,
    quiz: () => TOOLS.quiz(),
    glossar: () => TOOLS.glossar(),
    projects: () => TOOLS.projects(),
    diagramme: V.diagramme,
    dokumente: V.dokumente,
  };

  // Klartext-Erklärung pro Ansicht ("Was ist das? Was kann ich hier?")
  const VIEW_INFO = {
    masterency:   { icon:'fa-book-open-reader', t:'Komplett-Katalog', d:'Alle Komponenten der Sicherheitstechnik an einem Ort – durchsuchbar und filterbar. Klick auf einen Eintrag öffnet die Details.' },
    gesetze:      { icon:'fa-gavel', t:'Gesetze & Normen', d:'Die wichtigsten Gesetze und Normen der Branche, nach Paragraphen sortiert. Oben suchen, ein Gesetz wählen, Paragraph anklicken.' },
    wizard:       { icon:'fa-wand-magic-sparkles', t:'Sicherheits-Assistent', d:'Beantworte ein paar Fragen zu deinem Objekt – am Ende bekommst du eine passende Schutz-Empfehlung (Sicherungsklasse + Maßnahmen).' },
    konfigurator: { icon:'fa-sliders', t:'Konfigurator', d:'Stell dir per Schieber dein Schutzniveau zusammen – die App schlägt passende Komponenten mit Richtpreis vor.' },
    lab:          { icon:'fa-flask', t:'Engineering-Lab', d:'Fach-Rechner für die Planung: Reichweiten, Winkel, Akku, Kabel, Linsen u.v.m. Werte eingeben, Ergebnis sofort.' },
    fp:           { icon:'fa-vector-square', t:'Plan-Designer', d:'Zeichne einen Grundriss und platziere Melder, Kameras & Zonen per Drag-and-Drop – sieh sofort die Erfassungsbereiche.' },
    simulator:    { icon:'fa-vector-square', t:'Floor-Plan Simulator', d:'Sensoren drehen, verschieben und planen – die Erfassungsbereiche werden live angezeigt.' },
    calculators:  { icon:'fa-calculator', t:'Calculator-Suite', d:'Schnelle Live-Rechner für Mengen und Preise – ideal für ein erstes Angebot.' },
    haus3d:       { icon:'fa-house-chimney', t:'Sicherheits-Haus 3D', d:'Ein Haus in 3D vom Zaun bis zum Tresor – drehen und sehen, wie die 4 Schutzzonen ineinandergreifen.' },
    zwiebel3d:    { icon:'fa-circle-dot', t:'3D-Zwiebelmodell', d:'Das Zwiebelprinzip interaktiv: 4 Schalen Schutz von außen nach innen. Klick eine Schale für Details.' },
    building3d:   { icon:'fa-cube', t:'3D-Gebäudeplaner', d:'Isometrisches 3D-Haus mit Etagen, frei rotierbar.' },
    spektrum:     { icon:'fa-wave-square', t:'Frequenz-Spektrum', d:'Welche Wellen nutzt welche Technik? Vom Infrarot über Funk bis Mikrowelle – als anschauliches Spektrum.' },
    werk:         { icon:'fa-industry', t:'Sicherheits-Werk', d:'Ein virtueller Industriestandort – sieh, wie alle Gewerke der Sicherheitstechnik zusammenspielen.' },
    ema:          { icon:'fa-broadcast-tower', t:'EMA · ZKA · NSL', d:'Einbruchmeldeanlage, Zutrittskontrolle und Notruf-Leitstelle erklärt – mit Grade-Stufen nach DIN EN 50131.' },
    klassen:      { icon:'fa-medal', t:'Klassen & Grade', d:'Die Schutzklassen im Überblick: Sicherungsklassen (SÜ), EMA-Grade und Widerstandsklassen RC 1–6 nach DIN EN 1627.' },
    wwd:          { icon:'fa-tower-cell', t:'WWD Video-Türme', d:'Mobile Videotürme mit KI-Auswertung und 24/7-Leitstelle – temporäre Überwachung großer Flächen.' },
    enzyklopaedie:{ icon:'fa-flask', t:'Melder-Enzyklopädie', d:'Alle Detektor-Typen erklärt: aktiv/passiv, Funktionsweise, Einsatz – mit Bildern und Videos.' },
    mechency:     { icon:'fa-flask-vial', t:'Mechanik-Enzyklopädie', d:'50+ mechanische Komponenten mit Bildern, Filter und Vergleich.' },
    mechanik:     { icon:'fa-shield-halved', t:'Mechanik', d:'Mechanischer Schutz in 6 Kategorien: Türen, Tore, Zäune, Poller, Tresore, Fenster.' },
    vergleich:    { icon:'fa-table-cells-large', t:'Melder-Vergleich', d:'PIR, Mikrowelle, Dual und Lichtschranke direkt gegenübergestellt.' },
    galerie:      { icon:'fa-images', t:'Produkt-Galerie', d:'Echte Produktbilder nach Hersteller und Kategorie – zum Wiedererkennen der Geräte.' },
    mediathek:    { icon:'fa-photo-film', t:'Mediathek', d:'Alle Bilder und Animationsvideos der App gesammelt an einem Ort.' },
    quiz:         { icon:'fa-graduation-cap', t:'Quiz · Lernmodus', d:'Teste dein Wissen mit kurzen Fragen – ideal zur Prüfungsvorbereitung.' },
    glossar:      { icon:'fa-book', t:'Glossar', d:'Fachbegriffe von A–Z kurz und verständlich erklärt.' },
    preisliste:   { icon:'fa-euro-sign', t:'Preisliste', d:'Richtpreise der Komponenten – durchsuchbar, als Kalkulationsgrundlage.' },
    projects:     { icon:'fa-folder', t:'Meine Projekte', d:'Speichere Konfigurationen und Pläne lokal, um später weiterzuarbeiten.' },
    diagramme:    { icon:'fa-chart-column', t:'Diagramme', d:'Kennzahlen und Vergleiche der Sicherheitstechnik als Grafiken.' },
    dokumente:    { icon:'fa-folder-open', t:'Dokumente · Normen', d:'Übersicht der relevanten Normen und Dokumente mit Kurzbeschreibung.' },
  };

  function viewIntro(info) {
    const box = el('div', { class:'view-intro' });
    box.innerHTML = `<div class="vi-ico"><i class="fas ${info.icon}"></i></div>
      <div class="vi-body"><div class="vi-t">${info.t}</div><div class="vi-d">${info.d}</div></div>`;
    return box;
  }

  let currentView = 'home';

  function navigate(view) {
    if (!ROUTES[view]) view = 'home';
    currentView = view;
    $$('.navitem').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    const host = $('#view-host');
    host.innerHTML = '';
    if (VIEW_INFO[view]) host.appendChild(viewIntro(VIEW_INFO[view]));
    const node = ROUTES[view](ST.data);
    host.appendChild(node);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // close mobile sidebar
    $('#sidebar').classList.remove('open');
    location.hash = '#'+view;
  }

  // Sidebar nav
  $$('.navitem').forEach(b => b.addEventListener('click', () => navigate(b.dataset.view)));
  $('#btn-menu').addEventListener('click', () => $('#sidebar').classList.toggle('open'));

  // Drawer close
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-close="drawer"]');
    if (t) closeDrawer();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeDrawer();
      const ov = $('#search-overlay');
      if (ov) ov.remove();
    }
    if (e.key === '/' && document.activeElement !== $('#global-search')) {
      e.preventDefault();
      $('#global-search').focus();
    }
  });

  // Theme toggle
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    const icon = $('#btn-theme i');
    icon.className = t === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('st-theme', t);
  }
  applyTheme(localStorage.getItem('st-theme') || 'dark');
  $('#btn-theme').addEventListener('click', () => {
    const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(t);
    if (currentView === 'diagramme') navigate('diagramme'); // re-render canvases
  });

  // Install prompt
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    $('#btn-install').classList.remove('hidden');
  });
  $('#btn-install').addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const c = await deferredPrompt.userChoice;
    if (c.outcome === 'accepted') toast('App installiert!');
    deferredPrompt = null;
    $('#btn-install').classList.add('hidden');
  });

  // Global search
  const searchInput = $('#global-search');
  const runSearch = debounce(() => {
    const q = searchInput.value.trim();
    closeOverlay();
    if (q.length < 2) return;
    const results = SEARCH.search(q);
    const ov = el('div', { class: 'search-overlay', id: 'search-overlay' });
    const panel = SEARCH.renderResults(q, results, (item) => {
      navigate(item.view);
      closeOverlay();
      searchInput.value = '';
    });
    ov.appendChild(panel);
    ov.addEventListener('click', e => { if (e.target === ov) closeOverlay(); });
    document.body.appendChild(ov);
  }, 150);
  function closeOverlay() {
    const ov = $('#search-overlay'); if (ov) ov.remove();
  }
  searchInput.addEventListener('input', runSearch);
  searchInput.addEventListener('keydown', e => { if (e.key==='Escape') { searchInput.value=''; closeOverlay(); }});

  // React to hash changes (e.g. hero buttons setting location.hash, shortcuts)
  window.addEventListener('hashchange', () => {
    const v = (location.hash || '#home').replace(/^#/, '');
    if (v !== currentView) navigate(v);
  });

  // Boot
  ST.load().then(d => {
    SEARCH.buildIndex(d);
    const initial = (location.hash || '#home').replace(/^#/, '');
    navigate(initial);
  }).catch(err => {
    console.error(err);
    $('#view-host').innerHTML = '<div class="card"><h3>Fehler beim Laden der Daten</h3><p>data/data.json konnte nicht geladen werden.</p></div>';
  });
})();
