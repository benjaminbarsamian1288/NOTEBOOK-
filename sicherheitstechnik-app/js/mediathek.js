/* Mediathek-View — alle Produktbilder + alle Animationsvideos in einer Übersicht.
   Tabs: Alle / Nur Bilder / Nur Videos / Nach Kategorie */

window.MEDIATHEK = (() => {
  const { el, drawer } = U;

  const KAT_COLOR = {
    'Türen':'#7c3aed', 'Fenster':'#0891b2', 'Verglasung':'#22d3ee',
    'Tresore':'#a855f7', 'Zäune':'#22c55e', 'Tore':'#0891b2',
    'Poller':'#ea580c', 'Beschläge':'#3b82f6',
    'Video':'#06b6d4', 'Brandschutz':'#ea580c', 'Zutritt':'#7c3aed', 'Alarmierung':'#dc2626',
  };

  function view(d) {
    const root = el('div');
    root.appendChild(el('div', { class:'view-head' }, [
      el('span', { class:'crumb', text:'Medien · Bilder · Videos' }),
      el('h1', { text:'Mediathek' }),
      el('p', { text:'Alle Produktbilder und Animationsvideos der Sensoren in einer Übersicht. Filter nach Typ oder Kategorie. Klick für Detail-Player.' })
    ]));

    // Build complete item list — alle Komponenten aus allen DBs
    const items = [];

    // 1) Melder (ENCY)
    if (window.ENCY && window.PHOTOS && window.EXPL) {
      ENCY.list.forEach(m => {
        const hasPhoto = PHOTOS.MAP[m.key] != null;
        const hasVideo = EXPL.hasExplainer(m.key);
        if (hasPhoto || hasVideo) {
          items.push({
            sensor: m,
            hasPhoto, hasVideo,
            color: getSensorColor(m),
            kategorie: m.kat || 'Melder',
            source: 'melder',
          });
        }
      });
    }

    // 2) Mechanik (MECH_ENCY)
    if (window.MECH_ENCY && MECH_ENCY.LIST) {
      MECH_ENCY.LIST.forEach(m => {
        const hasVideo = window.EXPL && EXPL.hasExplainer(m.key);
        items.push({
          sensor: {
            key: m.key, kat: m.kat, name: m.name,
            type: m.typ, principle: m.principle, physik: m.physik,
            range: m.klasse, sue: '', preis: m.preis,
          },
          hasPhoto: !!m.svg,
          hasVideo,
          color: KAT_COLOR[m.kat] || '#a855f7',
          kategorie: m.kat,
          source: 'mechanik',
          svgInline: m.svg,
        });
      });
    }

    // 3) Katalog (Video/Brand/ZKA/EMA)
    if (window.KATALOG) {
      const dbs = [
        { key:'VIDEO_DB',  kat:'Video',         color:'#06b6d4' },
        { key:'BRAND_DB',  kat:'Brandschutz',   color:'#ea580c' },
        { key:'ZKA_DB',    kat:'Zutritt',       color:'#7c3aed' },
        { key:'EMA_DB',    kat:'Alarmierung',   color:'#dc2626' },
      ];
      dbs.forEach(({ key, kat, color }) => {
        const db = KATALOG[key];
        if (!db) return;
        db.forEach(m => {
          const hasVideo = window.EXPL && EXPL.hasExplainer(m.key);
          items.push({
            sensor: {
              key: m.key, kat: kat, name: m.name,
              type: m.typ, principle: m.principle, physik: m.physik,
              range: m.klasse, sue: '', preis: m.preis,
            },
            hasPhoto: !!m.svg,
            hasVideo,
            color: color,
            kategorie: kat,
            source: kat.toLowerCase(),
            svgInline: m.svg,
          });
        });
      });
    }

    // Filter state
    let activeFilter = 'all';
    let activeKat = 'Alle';
    let q = '';

    const fbar = el('div', { class:'filterbar' });
    // Filter type
    const typeChips = el('div', { class:'mtk-typechips' });
    [
      { v:'all', l:'Alle', i:'fa-layer-group' },
      { v:'photo', l:'Bilder', i:'fa-image' },
      { v:'video', l:'Animationsvideos', i:'fa-circle-play' },
    ].forEach(t => {
      const c = el('button', {
        class:'chip' + (t.v === activeFilter ? ' active' : ''),
        html: `<i class="fas ${t.i}"></i> ${t.l}`
      });
      c.dataset.v = t.v;
      c.addEventListener('click', () => {
        activeFilter = t.v;
        typeChips.querySelectorAll('.chip').forEach(x => x.classList.toggle('active', x.dataset.v === t.v));
        rerender();
      });
      typeChips.appendChild(c);
    });
    fbar.appendChild(typeChips);
    root.appendChild(fbar);

    // Category chips
    const cats = ['Alle', ...new Set(items.map(x => x.sensor.kat).filter(Boolean))];
    const catBar = el('div', { class:'filterbar' });
    cats.forEach(k => {
      const c = el('button', { class:'chip' + (k === activeKat ? ' active' : ''), text: k });
      c.addEventListener('click', () => {
        activeKat = k;
        catBar.querySelectorAll('.chip').forEach(x => x.classList.toggle('active', x.textContent === k));
        rerender();
      });
      catBar.appendChild(c);
    });
    const inp = el('input', { class:'input', placeholder:'Suche: PIR, Doppler, Glas, ...', style:'flex:1; min-width:200px' });
    inp.addEventListener('input', () => { q = inp.value.toLowerCase().trim(); rerender(); });
    catBar.appendChild(inp);
    root.appendChild(catBar);

    // Stats
    const stats = el('div', { class:'mtk-stats' });
    const photoCount = items.filter(x => x.hasPhoto).length;
    const videoCount = items.filter(x => x.hasVideo).length;
    stats.innerHTML = `
      <div class="mtk-stat"><i class="fas fa-image"></i> <strong>${photoCount}</strong> Produktbilder</div>
      <div class="mtk-stat"><i class="fas fa-circle-play"></i> <strong>${videoCount}</strong> Animationsvideos</div>
      <div class="mtk-stat"><i class="fas fa-layer-group"></i> <strong>${cats.length - 1}</strong> Kategorien</div>
      <div class="mtk-stat"><i class="fas fa-cubes"></i> <strong>${items.length}</strong> Komponenten gesamt</div>
    `;
    root.appendChild(stats);

    const grid = el('div', { class:'mtk-grid' });
    root.appendChild(grid);

    function rerender() {
      grid.innerHTML = '';
      const list = items.filter(it => {
        if (activeFilter === 'photo' && !it.hasPhoto) return false;
        if (activeFilter === 'video' && !it.hasVideo) return false;
        if (activeKat !== 'Alle' && it.sensor.kat !== activeKat) return false;
        if (q) {
          const hay = (it.sensor.name + ' ' + it.sensor.kat + ' ' + it.sensor.principle).toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
      if (!list.length) { grid.appendChild(el('p', { class:'muted', text:'Keine Treffer.' })); return; }
      list.forEach(it => grid.appendChild(mediaCard(it)));
    }
    rerender();
    return root;
  }

  function getSensorColor(m) {
    const COL = {
      'Bewegung':'#fbbf24', 'Öffnung':'#c084fc', 'Glasbruch':'#38bdf8',
      'Erschütterung':'#fb923c', 'Spezial':'#a78bfa', 'Brand':'#ef4444',
      'Perimeter':'#22c55e', 'Aktiv-IR':'#0ea5e9', 'Wandschutz':'#a3e635',
      'Objektschutz':'#ec4899', 'Tresorschutz':'#7c3aed', 'Vitrinenschutz':'#0d9488',
      'Geldautomat':'#dc2626', 'Sondermelder':'#0d9488', 'Sabotageschutz':'#a3e635',
    };
    return COL[m.kat] || '#22d3ee';
  }

  function mediaCard(it) {
    const m = it.sensor;
    const c = el('div', { class:'mtk-card' });
    c.style.setProperty('--c', it.color);

    // Photo
    const photo = el('div', { class:'mtk-photo' });
    if (it.svgInline) {
      photo.innerHTML = it.svgInline;
    } else if (it.hasPhoto && window.PHOTOS && PHOTOS.MAP[m.key]) {
      photo.innerHTML = PHOTOS.render(m.key);
    } else {
      photo.innerHTML = `<i class="fas fa-image-slash" style="font-size:48px; opacity:.3"></i>`;
    }
    c.appendChild(photo);

    // Badges
    const badges = el('div', { class:'mtk-badges' });
    if (it.hasPhoto) badges.appendChild(el('span', { class:'mtk-badge photo', html:'<i class="fas fa-image"></i> Bild' }));
    if (it.hasVideo) badges.appendChild(el('span', { class:'mtk-badge video', html:'<i class="fas fa-circle-play"></i> Video' }));
    c.appendChild(badges);

    // Info
    const info = el('div', { class:'mtk-info' });
    info.innerHTML = `
      <div class="mtk-kat">${m.kat}</div>
      <div class="mtk-name">${m.name}</div>
      <div class="mtk-principle">${m.principle}</div>
    `;
    c.appendChild(info);

    c.addEventListener('click', () => openMedia(it));
    return c;
  }

  function openMedia(it) {
    const m = it.sensor;
    const body = el('div');
    // Big photo
    if (it.svgInline) {
      body.appendChild(el('div', { class:'mtk-detail-photo', html: it.svgInline }));
    } else if (it.hasPhoto && window.PHOTOS && PHOTOS.MAP[m.key]) {
      body.appendChild(el('div', { class:'mtk-detail-photo', html: PHOTOS.render(m.key) }));
    }
    // Tab header
    if (it.hasVideo) {
      body.appendChild(el('h3', { html:'<i class="fas fa-circle-play" style="color:#fbbf24"></i> Animations-Video' }));
      EXPL.player(m.key, body);
    } else if (it.hasPhoto) {
      body.appendChild(el('div', { class:'muted small mt-12', text:'Kein Animationsvideo verfügbar.' }));
    }
    // Quick info
    body.appendChild(el('h3', { html:'<i class="fas fa-circle-info" style="color:#22d3ee"></i> Funktionsprinzip' }));
    body.appendChild(el('p', { class:'muted', text: m.physik || m.principle }));
    body.appendChild(el('div', { class:'row mt-12' }, [
      el('span', { class:'pill', text: m.kat }),
      el('span', { class:'pill', text: m.type }),
      m.range ? el('span', { class:'pill b', text: m.range }) : null,
      m.sue ? el('span', { class:'pill', text:'SÜ '+m.sue }) : null,
      m.preis ? el('span', { class:'pill g', text: m.preis }) : null,
    ]));
    drawer(m.name, body);
  }

  return { view };
})();
