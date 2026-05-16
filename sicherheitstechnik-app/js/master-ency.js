/* Master-Enzyklopädie · ALLE Komponenten in einem Katalog
   Aggregiert ENCY (Melder) + MECH_ENCY (Mechanik) + KATALOG (Video/Brand/ZKA/EMA)
   Gestaltet wie die Melder-Enzyklopädie, mit Animationen pro Komponente */

window.MASTER_ENCY = (() => {
  const { el } = U;

  /* ====== KATEGORIE-KONFIGURATION ====== */
  const KATS = {
    'Melder':       { c:'#22d3ee', icon:'fa-wave-square', group:'Detektion' },
    'Bewegung':     { c:'#22d3ee', icon:'fa-broadcast-tower', group:'Detektion' },
    'Glas':         { c:'#06b6d4', icon:'fa-window-maximize', group:'Detektion' },
    'Schock':       { c:'#0ea5e9', icon:'fa-wave-square', group:'Detektion' },
    'Öffnung':      { c:'#0891b2', icon:'fa-door-open', group:'Detektion' },
    'Boden':        { c:'#155e75', icon:'fa-shoe-prints', group:'Detektion' },
    'Spezial':      { c:'#3b82f6', icon:'fa-microscope', group:'Detektion' },
    'Linie':        { c:'#22d3ee', icon:'fa-broadcast-tower', group:'Detektion' },
    'Türen':        { c:'#7c3aed', icon:'fa-door-closed', group:'Mechanik' },
    'Fenster':      { c:'#0891b2', icon:'fa-window-maximize', group:'Mechanik' },
    'Verglasung':   { c:'#22d3ee', icon:'fa-layer-group', group:'Mechanik' },
    'Tresore':      { c:'#a855f7', icon:'fa-vault', group:'Mechanik' },
    'Zäune':        { c:'#22c55e', icon:'fa-border-all', group:'Mechanik' },
    'Tore':         { c:'#0891b2', icon:'fa-grip-lines-vertical', group:'Mechanik' },
    'Poller':       { c:'#ea580c', icon:'fa-circle-stop', group:'Mechanik' },
    'Beschläge':    { c:'#3b82f6', icon:'fa-key', group:'Mechanik' },
    'Video':        { c:'#06b6d4', icon:'fa-video', group:'Video' },
    'Brandschutz':  { c:'#ea580c', icon:'fa-fire', group:'Brand' },
    'Zutritt':      { c:'#7c3aed', icon:'fa-id-card', group:'Zutritt' },
    'Alarmierung':  { c:'#dc2626', icon:'fa-bell', group:'EMA' },
  };

  const GROUPS = {
    'Detektion':  { c:'#22d3ee', icon:'fa-wave-square', label:'Detektion · Melder' },
    'Mechanik':   { c:'#a855f7', icon:'fa-shield-halved', label:'Mechanische Sicherheit' },
    'Video':      { c:'#06b6d4', icon:'fa-video', label:'Videotechnik · KI' },
    'Brand':      { c:'#ea580c', icon:'fa-fire', label:'Brandschutz · BMA' },
    'Zutritt':    { c:'#7c3aed', icon:'fa-id-card', label:'Zutrittskontrolle' },
    'EMA':        { c:'#dc2626', icon:'fa-bell', label:'Alarmierung · EMA' },
  };

  /* ====== SCHEMA-NORMALISIERUNG ====== */
  function normalizeAll() {
    const all = [];

    // Melder (ENCY.list)
    if (window.ENCY && ENCY.list) {
      ENCY.list.forEach(m => {
        all.push({
          source: 'melder',
          key: m.key,
          name: m.name,
          kategorie: m.kat || 'Melder',
          typ: m.type || 'passiv',
          klasse: m.range || m.coverage || '—',
          norm: (m.normen && m.normen.join(', ')) || '—',
          preis: m.preis || '—',
          einsatz: 'Zone ' + (m.zone || []).join(', '),
          principle: m.principle || '',
          physik: m.physik || '',
          staerken: m.staerken || [],
          schwaechen: m.schwaechen || [],
          angriffe: m.fehlalarm || [],
          hersteller: m.hersteller || [],
          icon: m.icon,
          svg: null, // wird über PHOTOS aufgebaut
          photoKey: m.key,
        });
      });
    }

    // Mechanik (MECH_ENCY.LIST)
    if (window.MECH_ENCY && MECH_ENCY.LIST) {
      MECH_ENCY.LIST.forEach(m => {
        all.push({
          source: 'mechanik',
          key: m.key,
          name: m.name,
          kategorie: m.kat,
          typ: m.typ || 'passiv',
          klasse: m.klasse,
          wzeit: m.wzeit,
          norm: m.norm,
          preis: m.preis,
          einsatz: m.einsatz,
          principle: m.principle,
          physik: m.physik,
          staerken: m.staerken,
          schwaechen: m.schwaechen,
          angriffe: m.angriffe,
          hersteller: m.hersteller,
          icon: m.icon,
          svg: m.svg,
        });
      });
    }

    // Katalog (Video/Brand/ZKA/EMA)
    if (window.KATALOG) {
      const dbs = [
        { key:'VIDEO_DB',  kat:'Video' },
        { key:'BRAND_DB',  kat:'Brandschutz' },
        { key:'ZKA_DB',    kat:'Zutritt' },
        { key:'EMA_DB',    kat:'Alarmierung' },
      ];
      dbs.forEach(({ key, kat }) => {
        const list = KATALOG[key] || [];
        list.forEach(m => {
          all.push({
            source: kat.toLowerCase(),
            key: m.key,
            name: m.name,
            kategorie: m.kat || kat,
            typ: m.typ || 'aktiv',
            klasse: m.klasse,
            wzeit: m.wzeit,
            norm: m.norm,
            preis: m.preis,
            einsatz: m.einsatz,
            principle: m.principle,
            physik: m.physik,
            staerken: m.staerken,
            schwaechen: m.schwaechen,
            angriffe: m.angriffe,
            hersteller: m.hersteller,
            svg: m.svg,
          });
        });
      });
    }

    return all;
  }

  /* ====== VIEW ====== */
  function view(d) {
    const root = el('div');
    const all = normalizeAll();

    // Kompakter Hero
    const hero = el('div', { class:'me-hero me-hero-compact' });
    hero.innerHTML = `
      <div class="me-hero-content">
        <h1>📚 Komplett-Katalog</h1>
        <p><strong>${all.length}</strong> Komponenten · ${Object.keys(GROUPS).length} Kategorien · ${all.filter(x => window.EXPL && EXPL.hasExplainer(x.key)).length} mit Live-Animation</p>
      </div>
    `;
    root.appendChild(hero);

    // === Mini-Stat-Charts ===
    const passivCntStat = all.filter(x => x.typ === 'passiv').length;
    const aktivCntStat = all.filter(x => x.typ === 'aktiv').length;
    const videoCntStat = all.filter(x => window.EXPL && EXPL.hasExplainer(x.key)).length;
    const stats = el('div', { class:'me-mini-charts' });
    stats.innerHTML = `
      <div class="me-mini-chart" style="--c:#22d3ee">
        <div class="me-mini-chart-icon"><i class="fas fa-cubes"></i></div>
        <div class="me-mini-chart-body">
          <div class="me-mini-chart-val">${all.length}</div>
          <div class="me-mini-chart-lbl">Komponenten gesamt</div>
        </div>
      </div>
      <div class="me-mini-chart" style="--c:#fbbf24">
        <div class="me-mini-chart-icon"><i class="fas fa-shield-halved"></i></div>
        <div class="me-mini-chart-body">
          <div class="me-mini-chart-val">${passivCntStat}</div>
          <div class="me-mini-chart-lbl">Passive Komponenten</div>
        </div>
      </div>
      <div class="me-mini-chart" style="--c:#06b6d4">
        <div class="me-mini-chart-icon"><i class="fas fa-bolt"></i></div>
        <div class="me-mini-chart-body">
          <div class="me-mini-chart-val">${aktivCntStat}</div>
          <div class="me-mini-chart-lbl">Aktive Komponenten</div>
        </div>
      </div>
      <div class="me-mini-chart" style="--c:#ef4444">
        <div class="me-mini-chart-icon"><i class="fas fa-circle-play"></i></div>
        <div class="me-mini-chart-body">
          <div class="me-mini-chart-val">${videoCntStat}</div>
          <div class="me-mini-chart-lbl">Mit Live-Animation</div>
        </div>
      </div>
    `;
    root.appendChild(stats);

    // === FEATURED-Bereich · Top-Highlights ===
    const featured = pickFeatured(all);
    if (featured.length) {
      const fb = el('div', { class:'me-featured' });
      const itemsHTML = featured.map(m => {
        const info = KATS[m.kategorie] || { c:'#22d3ee' };
        return `
          <div class="me-featured-item" data-key="${m.key}" style="--c:${info.c}">
            <div class="me-featured-item-cat">${m.kategorie}</div>
            <div class="me-featured-item-name">${m.name}</div>
            <div class="me-featured-item-desc">${(m.principle || '').slice(0, 100)}</div>
            <span class="me-featured-item-klass">${m.klasse || ''}</span>
          </div>
        `;
      }).join('');
      fb.innerHTML = `
        <div class="me-featured-head"><i class="fas fa-star"></i><h3>Top-Highlights · Polizei-Empfehlungen + KRITIS</h3></div>
        <div class="me-featured-row">${itemsHTML}</div>
      `;
      fb.querySelectorAll('.me-featured-item').forEach(item => {
        item.onclick = () => {
          const m = all.find(x => x.key === item.dataset.key);
          if (m) openDrawer(m, KATS[m.kategorie] || { c:'#22d3ee' });
        };
      });
      root.appendChild(fb);
    }

    function pickFeatured(list) {
      // Wähle 8 wichtigste Komponenten verschiedener Kategorien
      const keys = [
        'tuer-rc2', 'fenster-rc2', 'tresor-1', 'poller-versenk-hydr',
        'cam-ptz', 'pir-standard', 'ema-zentrale', 'sprinkler-nass',
        'rfid-mifare', 'glas-p4a',
      ];
      const featured = [];
      keys.forEach(k => {
        const m = list.find(x => x.key === k);
        if (m) featured.push(m);
      });
      return featured;
    }

    const state = { gruppe:'Alle', kat:'Alle', typ:'Alle', q:'', onlyVideo:false };

    // ============ KATEGORIE-KACHELN (Hauptfilter) ============
    const kachelGrid = el('div', { class:'me-kacheln' });

    const passivCount = all.filter(x => x.typ === 'passiv').length;
    const aktivCount = all.filter(x => x.typ === 'aktiv').length;

    // "Alle"-Kachel
    const allKachel = el('button', { class:'me-kachel me-kachel-all active' });
    allKachel.innerHTML = `
      <div class="me-kachel-icon"><i class="fas fa-layer-group"></i></div>
      <div class="me-kachel-body">
        <div class="me-kachel-title">Alle Komponenten</div>
        <div class="me-kachel-count">${all.length}</div>
      </div>
    `;
    allKachel.onclick = () => activate('gruppe', 'Alle');
    kachelGrid.appendChild(allKachel);

    Object.entries(GROUPS).forEach(([gid, g]) => {
      const inGroup = all.filter(x => (KATS[x.kategorie]||{}).group === gid);
      const count = inGroup.length;
      const kachel = el('button', { class:'me-kachel', style:`--c:${g.c}` });
      kachel.innerHTML = `
        <div class="me-kachel-icon"><i class="fas ${g.icon}"></i></div>
        <div class="me-kachel-body">
          <div class="me-kachel-title">${g.label}</div>
          <div class="me-kachel-count">${count}</div>
        </div>
      `;
      kachel.onclick = () => activate('gruppe', gid);
      kachelGrid.appendChild(kachel);
    });
    root.appendChild(kachelGrid);

    // FILTER-BAR (sehr schlank: nur Sub-Kat + Typ + Suche)
    const filterBar = el('div', { class:'me-filter' });

    // Hidden Group-Bar als Fallback (Code-Kompatibilität)
    const groupBar = el('div', { class:'me-tabs me-tabs-groups', style:'display:none' });
    const allGroupBtn = el('button', { class:'me-tab active' });
    groupBar.appendChild(allGroupBtn);
    filterBar.appendChild(groupBar);

    // Sub-Kategorie + Typ + Suche
    const ctrl = el('div', { class:'me-controls' });
    const katBar = el('div', { class:'me-katbar' });
    ctrl.appendChild(katBar);

    const typBar = el('div', { class:'mency-typebar' });
    ['Alle','passiv','aktiv','hybrid'].forEach(t => {
      const b = el('button', { class:'mency-typebtn'+(t===state.typ?' active':'')+(t==='passiv'?' passiv':t==='aktiv'?' aktiv':'') });
      b.textContent = t === 'Alle' ? 'Alle' : t.charAt(0).toUpperCase()+t.slice(1);
      b.onclick = () => {
        state.typ = t;
        ctrl.querySelectorAll('.mency-typebtn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        render();
      };
      typBar.appendChild(b);
    });
    ctrl.appendChild(typBar);

    const videoFilter = el('button', { class:'me-videofilter' });
    videoFilter.innerHTML = '<i class="fas fa-circle-play"></i> Nur mit Animation';
    videoFilter.onclick = () => {
      state.onlyVideo = !state.onlyVideo;
      videoFilter.classList.toggle('active', state.onlyVideo);
      render();
    };
    ctrl.appendChild(videoFilter);

    // Sortier-Dropdown
    const sortSel = el('select', { class:'me-sort' });
    sortSel.innerHTML = `
      <option value="default">↕ Standard</option>
      <option value="name">A → Z (Name)</option>
      <option value="name-desc">Z → A</option>
      <option value="kat">Kategorie</option>
      <option value="klasse">Klasse</option>
    `;
    state.sort = 'default';
    sortSel.onchange = () => { state.sort = sortSel.value; render(); };
    ctrl.appendChild(sortSel);

    // View-Mode Toggle
    state.view = 'grid';
    const viewToggle = el('div', { class:'me-viewtoggle' });
    viewToggle.innerHTML = `
      <button data-v="grid" class="active" title="Karten"><i class="fas fa-table-cells-large"></i></button>
      <button data-v="list" title="Liste"><i class="fas fa-list"></i></button>
    `;
    viewToggle.querySelectorAll('button').forEach(b => {
      b.onclick = () => {
        state.view = b.dataset.v;
        viewToggle.querySelectorAll('button').forEach(x => x.classList.toggle('active', x === b));
        grid.className = 'mency-grid view-' + state.view;
        render();
      };
    });
    ctrl.appendChild(viewToggle);

    const search = el('input', { class:'mency-search' });
    search.type = 'search';
    search.placeholder = '🔍 Suche durch alle Komponenten...';
    search.oninput = () => { state.q = search.value.toLowerCase().trim(); render(); };
    ctrl.appendChild(search);

    // Quick-Filter Chips (beliebte Suchen)
    const quickRow = el('div', { class:'me-quickfilter' });
    const quickItems = [
      { label:'RC2 Polizei-Empfehlung', q:'rc2', icon:'fa-shield-halved' },
      { label:'Tresor Klasse III', q:'klasse iii', icon:'fa-vault' },
      { label:'PTZ-Kameras', q:'ptz', icon:'fa-video' },
      { label:'VdS-zertifiziert', q:'vds', icon:'fa-certificate' },
      { label:'KRITIS-relevant', q:'kritis', icon:'fa-shield-virus' },
      { label:'WaffG-konform', q:'waff', icon:'fa-gun' },
    ];
    quickItems.forEach(qi => {
      const b = el('button', { class:'me-qchip' });
      b.innerHTML = `<i class="fas ${qi.icon}"></i> ${qi.label}`;
      b.onclick = () => {
        search.value = qi.q;
        state.q = qi.q.toLowerCase();
        render();
      };
      quickRow.appendChild(b);
    });
    filterBar.appendChild(ctrl);
    filterBar.appendChild(quickRow);
    root.appendChild(filterBar);

    function activate(key, val) {
      state[key] = val;
      if (key === 'gruppe') state.kat = 'Alle';
      // Update KACHELN (Hauptfilter)
      const kacheln = kachelGrid.querySelectorAll('.me-kachel');
      kacheln.forEach(k => k.classList.remove('active'));
      if (state.gruppe === 'Alle') {
        kacheln[0].classList.add('active');
      } else {
        const idx = Object.keys(GROUPS).indexOf(state.gruppe) + 1;
        if (kacheln[idx]) kacheln[idx].classList.add('active');
      }
      // Scroll zum Grid
      setTimeout(() => {
        const grid = root.querySelector('.mency-grid');
        if (grid && key === 'gruppe' && val !== 'Alle') {
          grid.scrollIntoView({ behavior:'smooth', block:'start' });
        }
      }, 100);
      rebuildKatBar();
      render();
    }

    function rebuildKatBar() {
      katBar.innerHTML = '';
      if (state.gruppe === 'Alle') return;
      // Zeige alle Sub-Kategorien dieser Gruppe
      const subKats = Array.from(new Set(
        all.filter(x => (KATS[x.kategorie]||{}).group === state.gruppe).map(x => x.kategorie)
      ));
      if (subKats.length <= 1) return;
      const allBtn = el('button', { class:'me-katchip'+(state.kat==='Alle'?' active':'') });
      allBtn.textContent = 'Alle';
      allBtn.onclick = () => { state.kat = 'Alle'; rebuildKatBar(); render(); };
      katBar.appendChild(allBtn);
      subKats.forEach(k => {
        const info = KATS[k] || { c:'#22d3ee' };
        const b = el('button', { class:'me-katchip'+(state.kat===k?' active':''), style:`--c:${info.c}` });
        const cnt = all.filter(x => x.kategorie === k).length;
        b.innerHTML = `<i class="fas ${info.icon}"></i> ${k} <em>${cnt}</em>`;
        b.onclick = () => { state.kat = k; rebuildKatBar(); render(); };
        katBar.appendChild(b);
      });
    }

    // Stats + Grid
    const stats = el('div', { class:'mency-stats' });
    root.appendChild(stats);
    const grid = el('div', { class:'mency-grid' });
    root.appendChild(grid);

    function render() {
      let filtered = all.filter(m => {
        if (state.gruppe !== 'Alle' && (KATS[m.kategorie]||{}).group !== state.gruppe) return false;
        if (state.kat !== 'Alle' && m.kategorie !== state.kat) return false;
        if (state.typ !== 'Alle' && !m.typ.toLowerCase().startsWith(state.typ)) return false;
        if (state.onlyVideo && !(window.EXPL && EXPL.hasExplainer(m.key))) return false;
        if (state.q) {
          const hay = `${m.name} ${m.kategorie} ${m.klasse} ${m.norm||''} ${m.einsatz||''} ${m.principle||''} ${(m.hersteller||[]).join(' ')}`.toLowerCase();
          if (!hay.includes(state.q)) return false;
        }
        return true;
      });

      // Sortierung
      if (state.sort === 'name') filtered.sort((a,b) => a.name.localeCompare(b.name));
      if (state.sort === 'name-desc') filtered.sort((a,b) => b.name.localeCompare(a.name));
      if (state.sort === 'kat') filtered.sort((a,b) => (a.kategorie||'').localeCompare(b.kategorie||''));
      if (state.sort === 'klasse') filtered.sort((a,b) => (a.klasse||'').localeCompare(b.klasse||''));

      stats.innerHTML = `
        <span class="mency-stats-count"><strong>${filtered.length}</strong> ${filtered.length === 1 ? 'Komponente' : 'Komponenten'}</span>
        ${state.gruppe !== 'Alle' ? `<span class="mency-stats-pill" style="--c:${GROUPS[state.gruppe].c}">${GROUPS[state.gruppe].label}</span>` : ''}
        ${state.kat !== 'Alle' ? `<span class="mency-stats-pill" style="--c:${(KATS[state.kat]||{}).c}">${state.kat}</span>` : ''}
        ${state.typ !== 'Alle' ? `<span class="mency-stats-pill" style="--c:${state.typ==='aktiv'?'#22d3ee':'#fbbf24'}">${state.typ}</span>` : ''}
        ${state.onlyVideo ? `<span class="mency-stats-pill" style="--c:#dc2626">▶ mit Animation</span>` : ''}
        ${state.q ? `<span class="mency-stats-pill" style="--c:#22d3ee">"${state.q}"</span>` : ''}
      `;

      grid.innerHTML = '';
      if (!filtered.length) {
        grid.appendChild(el('p', { class:'muted', style:'grid-column:1/-1; text-align:center; padding:40px', text:'Keine Komponenten gefunden.' }));
        return;
      }
      filtered.forEach(m => grid.appendChild(buildCard(m)));
    }

    function buildCard(m) {
      const info = KATS[m.kategorie] || { c:'#22d3ee', icon:'fa-cube' };
      const hasVideo = window.EXPL && EXPL.hasExplainer(m.key);
      const c = el('div', { class:'mency-card', style:`--c:${info.c}` });
      const svgContent = m.svg || svgFromPhotoOrIcon(m, info);
      c.innerHTML = `
        ${hasVideo ? '<div class="mency-video-badge"><i class="fas fa-circle-play"></i> Video</div>' : ''}
        <div class="mency-card-typebadge ${m.typ}">${m.typ}</div>
        <div class="mency-card-img">${svgContent}</div>
        <div class="mency-card-body">
          <div class="mency-card-kat"><i class="fas ${info.icon}"></i> ${m.kategorie}</div>
          <h4>${m.name}</h4>
          <div class="mency-card-klass">${m.klasse}</div>
          <p class="mency-card-prinz">${m.principle ? m.principle.slice(0, 140) : ''}</p>
          <div class="mency-card-meta">
            <span class="mency-card-norm" title="Norm">${m.norm || '—'}</span>
            <span class="mency-card-preis">${m.preis || '—'}</span>
          </div>
        </div>
        <div class="mency-card-cta">
          <i class="fas fa-circle-info"></i> Details ${hasVideo ? '+ Animation' : 'anzeigen'}
        </div>
      `;
      c.onclick = () => openDrawer(m, info);
      return c;
    }

    function svgFromPhotoOrIcon(m, info) {
      // Melder: aus PHOTOS rendern
      if (m.source === 'melder' && window.PHOTOS && PHOTOS.MAP[m.photoKey]) {
        return PHOTOS.render(m.photoKey);
      }
      // Fallback: Icon
      return `<svg viewBox="0 0 200 200">
        <rect width="200" height="200" fill="#0a0f1a"/>
        <circle cx="100" cy="100" r="60" fill="#1e293b" stroke="${info.c}" stroke-width="2"/>
        <g transform="translate(100,100)">
          <foreignObject x="-30" y="-30" width="60" height="60">
            <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;align-items:center;justify-content:center;width:60px;height:60px;color:${info.c};font-size:32px">
              <i class="fas ${m.icon || info.icon}"></i>
            </div>
          </foreignObject>
        </g>
      </svg>`;
    }

    function openDrawer(m, info) {
      const drawer = el('div', { class:'mency-drawer-bg' });
      const inner = el('div', { class:'mency-drawer' });
      const hasVideo = window.EXPL && EXPL.hasExplainer(m.key);
      const simple = window.SIMPLE_EXPLAIN ? SIMPLE_EXPLAIN.get(m) : null;

      inner.innerHTML = `
        <div class="mency-drawer-head" style="--c:${info.c}">
          <button class="mency-drawer-close"><i class="fas fa-xmark"></i></button>
          <div class="mency-drawer-typebadge ${m.typ}">${(m.typ || 'passiv').toUpperCase()}</div>
          <div class="mency-drawer-kat"><i class="fas ${info.icon}"></i> ${m.kategorie}</div>
          <h2>${m.name}</h2>
          <div class="mency-drawer-headstats">
            <div class="mency-drawer-stat"><strong>${m.klasse}</strong><span>Klasse</span></div>
            ${m.wzeit ? `<div class="mency-drawer-stat"><strong>${m.wzeit}</strong><span>Widerstand</span></div>` : ''}
            <div class="mency-drawer-stat"><strong>${m.preis}</strong><span>Preis</span></div>
          </div>
        </div>

        <!-- TABS -->
        <div class="mency-drawer-tabs">
          <button class="mency-dtab active" data-tab="einfach"><i class="fas fa-lightbulb"></i> Einfach erklärt</button>
          <button class="mency-dtab" data-tab="technik"><i class="fas fa-microchip"></i> Technik</button>
          <button class="mency-dtab" data-tab="praxis"><i class="fas fa-briefcase"></i> Praxis</button>
        </div>

        <div class="mency-drawer-img">${m.svg || svgFromPhotoOrIcon(m, info)}</div>

        <div id="me-anim-mount"></div>

        <!-- TAB-PANELS -->
        <div class="mency-drawer-body">
          <!-- EINFACH ERKLÄRT -->
          <div class="mency-dpanel active" data-panel="einfach">
            ${simple ? `
              <section class="me-simple-card">
                <h3><i class="fas fa-lightbulb"></i> Was ist das einfach erklärt?</h3>
                <p class="me-simple-text">${simple.einfach}</p>
              </section>
              ${simple.vergleich ? `<section class="me-vergleich">
                <h3><i class="fas fa-equals"></i> Vergleich</h3>
                <p>${simple.vergleich}</p>
              </section>` : ''}
              ${simple.tipp ? `<section class="me-tipp">
                <h3><i class="fas fa-circle-info"></i> Profi-Tipp</h3>
                <p>${simple.tipp}</p>
              </section>` : ''}
            ` : `<p class="muted">Keine vereinfachte Erklärung verfügbar.</p>`}
          </div>

          <!-- TECHNIK -->
          <div class="mency-dpanel" data-panel="technik">
            ${m.principle ? `<section><h3><i class="fas fa-atom"></i> Wirkprinzip</h3><p>${m.principle}</p></section>` : ''}
            ${m.physik ? `<section><h3><i class="fas fa-microscope"></i> Aufbau & Physik</h3><p>${m.physik}</p></section>` : ''}
            ${(m.staerken && m.staerken.length) || (m.schwaechen && m.schwaechen.length) ? `
              <div class="mency-drawer-grid">
                ${m.staerken && m.staerken.length ? `<section class="ok"><h3><i class="fas fa-circle-check"></i> Stärken</h3><ul>${m.staerken.map(s=>`<li>${s}</li>`).join('')}</ul></section>` : ''}
                ${m.schwaechen && m.schwaechen.length ? `<section class="warn"><h3><i class="fas fa-triangle-exclamation"></i> Schwächen</h3><ul>${m.schwaechen.map(s=>`<li>${s}</li>`).join('')}</ul></section>` : ''}
              </div>
            ` : ''}
            ${m.angriffe && m.angriffe.length ? `<section><h3><i class="fas fa-hammer"></i> Typische Angriffe / Fehlalarme</h3><div class="mency-drawer-angriffe">${m.angriffe.map(a=>`<span class="mency-angriff-chip"><i class="fas fa-bolt"></i> ${a}</span>`).join('')}</div></section>` : ''}
            <section>
              <h3><i class="fas fa-scroll"></i> Norm & Einsatzgebiet</h3>
              <div class="mency-drawer-meta">
                <div><strong>Norm:</strong> ${m.norm || '—'}</div>
                <div><strong>Einsatz:</strong> ${m.einsatz || '—'}</div>
              </div>
            </section>
          </div>

          <!-- PRAXIS -->
          <div class="mency-dpanel" data-panel="praxis">
            ${simple && simple.beispiele && simple.beispiele.length ? `
              <section>
                <h3><i class="fas fa-list-check"></i> Praxis-Beispiele</h3>
                <div class="me-praxis-list">
                  ${simple.beispiele.map(b => `<div class="me-praxis-item">${b}</div>`).join('')}
                </div>
              </section>
            ` : ''}
            ${m.hersteller && m.hersteller.length ? `
              <section>
                <h3><i class="fas fa-industry"></i> Hersteller (bewährt)</h3>
                <div class="mency-drawer-hst">${m.hersteller.map(h => `<span class="mency-hst-chip">${h}</span>`).join('')}</div>
              </section>
            ` : ''}
            <section class="me-fakten">
              <h3><i class="fas fa-table-list"></i> Steckbrief</h3>
              <table class="me-stecktbl">
                <tr><th>Kategorie</th><td>${m.kategorie}</td></tr>
                <tr><th>Typ</th><td>${m.typ}</td></tr>
                <tr><th>Klasse</th><td>${m.klasse}</td></tr>
                ${m.wzeit ? `<tr><th>Widerstand</th><td>${m.wzeit}</td></tr>` : ''}
                <tr><th>Norm</th><td>${m.norm || '—'}</td></tr>
                <tr><th>Preisrahmen</th><td>${m.preis || '—'}</td></tr>
                <tr><th>Einsatz</th><td>${m.einsatz || '—'}</td></tr>
              </table>
            </section>
          </div>
        </div>
      `;
      drawer.appendChild(inner);
      document.body.appendChild(drawer);
      requestAnimationFrame(() => drawer.classList.add('open'));

      // Tab-Switch
      inner.querySelectorAll('.mency-dtab').forEach(btn => {
        btn.onclick = () => {
          const t = btn.dataset.tab;
          inner.querySelectorAll('.mency-dtab').forEach(b => b.classList.toggle('active', b === btn));
          inner.querySelectorAll('.mency-dpanel').forEach(p => p.classList.toggle('active', p.dataset.panel === t));
        };
      });

      if (hasVideo) {
        const mount = inner.querySelector('#me-anim-mount');
        const animCard = el('section', { class:'mency-anim-section' });
        animCard.innerHTML = `<h3><i class="fas fa-circle-play"></i> Live-Animation · Wirkprinzip</h3>`;
        EXPL.player(m.key, animCard);
        mount.appendChild(animCard);
      }

      const close = () => {
        drawer.classList.remove('open');
        setTimeout(() => drawer.remove(), 250);
      };
      drawer.querySelector('.mency-drawer-close').onclick = close;
      drawer.onclick = (e) => { if (e.target === drawer) close(); };
      document.addEventListener('keydown', function esc(e) {
        if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
      });
    }

    render();
    return root;
  }

  return { view, normalizeAll };
})();
