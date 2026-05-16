/* Globale Suche · Cmd/Ctrl-K · durchsucht alle Komponenten + Views */

window.GSEARCH = (() => {

  function gather() {
    const items = [];

    // Melder
    if (window.ENCY && ENCY.list) {
      ENCY.list.forEach(m => items.push({
        name: m.name, kat: m.kat || 'Melder',
        icon: m.icon || 'fa-wave-square', color:'#22d3ee',
        meta: `${m.type} · ${m.principle || ''}`,
        view: 'enzyklopaedie', tag: 'Melder',
      }));
    }
    // Mechanik
    if (window.MECH_ENCY && MECH_ENCY.LIST) {
      MECH_ENCY.LIST.forEach(m => items.push({
        name: m.name, kat: m.kat,
        icon: m.icon || 'fa-shield-halved', color:'#a855f7',
        meta: `${m.klasse} · ${m.principle.slice(0, 80)}`,
        view: 'mechency', tag: 'Mechanik',
      }));
    }
    // Video / Brand / ZKA / EMA
    if (window.KATALOG) {
      ['VIDEO_DB', 'BRAND_DB', 'ZKA_DB', 'EMA_DB'].forEach(dbKey => {
        const db = KATALOG[dbKey];
        if (!db) return;
        const view = dbKey === 'VIDEO_DB' ? 'kat-video' : dbKey === 'BRAND_DB' ? 'kat-brand' : dbKey === 'ZKA_DB' ? 'kat-zka' : 'kat-ema';
        const tag = dbKey === 'VIDEO_DB' ? 'Video' : dbKey === 'BRAND_DB' ? 'Brandschutz' : dbKey === 'ZKA_DB' ? 'Zutritt' : 'Alarmierung';
        const color = dbKey === 'VIDEO_DB' ? '#06b6d4' : dbKey === 'BRAND_DB' ? '#ea580c' : dbKey === 'ZKA_DB' ? '#7c3aed' : '#dc2626';
        db.forEach(m => items.push({
          name: m.name, kat: m.kat,
          icon: dbKey === 'VIDEO_DB' ? 'fa-video' : dbKey === 'BRAND_DB' ? 'fa-fire' : dbKey === 'ZKA_DB' ? 'fa-id-card' : 'fa-bell',
          color: color,
          meta: `${m.klasse} · ${m.principle.slice(0, 80)}`,
          view: view, tag: tag,
        }));
      });
    }

    // Views
    const viewsList = [
      { name:'KATALOG · Alles sortiert', kat:'Hub', icon:'fa-folder-tree', color:'#a855f7', meta:'Master-Übersicht aller Bereiche', view:'katalog', tag:'View' },
      { name:'Engineering-Lab', kat:'Hub', icon:'fa-calculator', color:'#22d3ee', meta:'8 physikalische Live-Rechner', view:'lab', tag:'View' },
      { name:'WWD Video-Türme', kat:'Hub', icon:'fa-tower-cell', color:'#dc2626', meta:'KWS Video Control · KI-Leitstelle', view:'wwd', tag:'View' },
      { name:'Sicherheits-Haus 3D', kat:'Hub', icon:'fa-house-chimney', color:'#fbbf24', meta:'Vom Außenzaun zum Tresor', view:'haus3d', tag:'View' },
      { name:'3D-Zwiebelmodell', kat:'Hub', icon:'fa-circle-dot', color:'#22c55e', meta:'4 Schutzzonen', view:'zwiebel3d', tag:'View' },
      { name:'Mech.-Enzyklopädie', kat:'Hub', icon:'fa-flask-vial', color:'#22d3ee', meta:'50+ Mechanik-Komponenten', view:'mechency', tag:'View' },
      { name:'Sicherheits-Assistent', kat:'Hub', icon:'fa-wand-magic-sparkles', color:'#7c3aed', meta:'7-Schritte-Analyse', view:'wizard', tag:'View' },
      { name:'Konfigurator', kat:'Hub', icon:'fa-sliders', color:'#0891b2', meta:'Komplette Stack-Empfehlung', view:'konfigurator', tag:'View' },
      { name:'Calculator-Suite', kat:'Hub', icon:'fa-calculator', color:'#3b82f6', meta:'8 Live-Rechner', view:'calculators', tag:'View' },
      { name:'Quiz · Wissens-Test', kat:'Hub', icon:'fa-graduation-cap', color:'#fbbf24', meta:'15 Fragen', view:'quiz', tag:'View' },
      { name:'Glossar', kat:'Hub', icon:'fa-book', color:'#94a3b8', meta:'37 Fachbegriffe', view:'glossar', tag:'View' },
      { name:'Gesetze · KRITIS · NIS2', kat:'Hub', icon:'fa-gavel', color:'#a855f7', meta:'BewachV · DGUV · VdS', view:'gesetze', tag:'View' },
      { name:'Mediathek', kat:'Hub', icon:'fa-photo-film', color:'#22d3ee', meta:'Bilder + Videos', view:'mediathek', tag:'View' },
      { name:'Produkt-Galerie', kat:'Hub', icon:'fa-images', color:'#22d3ee', meta:'Hersteller-Fotos', view:'galerie', tag:'View' },
    ];
    viewsList.forEach(v => items.push(v));

    return items;
  }

  let ALL = null;
  function getAll() {
    if (!ALL) ALL = gather();
    return ALL;
  }

  function open() {
    const all = getAll();
    const bg = document.createElement('div');
    bg.className = 'global-search-bg';
    bg.innerHTML = `
      <div class="global-search-box">
        <div class="global-search-input">
          <i class="fas fa-search"></i>
          <input type="search" placeholder="Suche durch ${all.length} Komponenten, Views, Begriffe..." autofocus>
          <span class="kbd-esc">ESC</span>
        </div>
        <div class="global-search-results"></div>
        <div class="gs-hint">↑↓ navigieren · ⏎ öffnen · <kbd>ESC</kbd> schließen</div>
      </div>
    `;
    document.body.appendChild(bg);
    requestAnimationFrame(() => bg.classList.add('open'));

    const input = bg.querySelector('input');
    const results = bg.querySelector('.global-search-results');
    let activeIdx = 0;
    let visible = [];

    function render() {
      const q = input.value.toLowerCase().trim();
      if (!q) {
        visible = all.slice(0, 30);
      } else {
        visible = all.filter(item => {
          const hay = `${item.name} ${item.kat} ${item.meta || ''} ${item.tag || ''}`.toLowerCase();
          return hay.includes(q);
        }).slice(0, 50);
      }
      if (!visible.length) {
        results.innerHTML = '<div class="gs-empty">Keine Treffer für „' + q + '"</div>';
        return;
      }
      // Group by tag
      const groups = {};
      visible.forEach(item => {
        if (!groups[item.tag]) groups[item.tag] = [];
        groups[item.tag].push(item);
      });
      results.innerHTML = Object.entries(groups).map(([tag, items]) => `
        <div class="gs-group-head">${tag} (${items.length})</div>
        ${items.map((item, i) => `
          <div class="gs-result" data-idx="${items.indexOf(item)}" style="--c:${item.color}">
            <div class="gs-result-icon"><i class="fas ${item.icon}"></i></div>
            <div class="gs-result-text">
              <div class="gs-result-name">${highlight(item.name, q)}</div>
              <div class="gs-result-meta">${item.meta || ''}</div>
            </div>
            <span class="gs-result-kat">${item.kat}</span>
          </div>
        `).join('')}
      `).join('');
      activeIdx = 0;
      updateActive();
      results.querySelectorAll('.gs-result').forEach((el, i) => {
        el.onclick = () => navigateTo(visible[i]);
        el.onmouseenter = () => { activeIdx = i; updateActive(); };
      });
    }

    function highlight(text, q) {
      if (!q) return text;
      const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      return text.replace(re, '<strong style="color:#22d3ee">$1</strong>');
    }

    function updateActive() {
      const els = results.querySelectorAll('.gs-result');
      els.forEach((el, i) => el.classList.toggle('active', i === activeIdx));
      const activeEl = els[activeIdx];
      if (activeEl) activeEl.scrollIntoView({ block:'nearest' });
    }

    function navigateTo(item) {
      close();
      const btn = document.querySelector(`.navitem[data-view="${item.view}"]`);
      if (btn) btn.click();
    }

    function close() {
      bg.classList.remove('open');
      setTimeout(() => bg.remove(), 200);
      document.removeEventListener('keydown', keyHandler);
    }

    function keyHandler(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(visible.length - 1, activeIdx + 1); updateActive(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); activeIdx = Math.max(0, activeIdx - 1); updateActive(); }
      if (e.key === 'Enter')     { e.preventDefault(); if (visible[activeIdx]) navigateTo(visible[activeIdx]); }
    }

    input.addEventListener('input', render);
    document.addEventListener('keydown', keyHandler);
    bg.addEventListener('click', (e) => { if (e.target === bg) close(); });
    render();
  }

  // Cmd/Ctrl-K Shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      open();
    }
  });

  return { open, gather: getAll };
})();
