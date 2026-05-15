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
    galerie: (d) => GALLERY.view(d),
    zwiebel3d: (d) => ZWIEBEL3D.view(d),
    gesetze: (d) => GESETZE.view(d),
    vergleich: V.vergleich,
    quiz: () => TOOLS.quiz(),
    glossar: () => TOOLS.glossar(),
    projects: () => TOOLS.projects(),
    diagramme: V.diagramme,
    dokumente: V.dokumente,
  };

  let currentView = 'home';

  function navigate(view) {
    if (!ROUTES[view]) view = 'home';
    currentView = view;
    $$('.navitem').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    const host = $('#view-host');
    host.innerHTML = '';
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
