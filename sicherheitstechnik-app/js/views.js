/* All views – pure render functions that return an HTMLElement */
window.V = (() => {

  const { $, $$, el, fmtEUR, parsePriceRange, pillFor, drawer, buildTable, escapeHtml } = U;

  // ---------- HOME -----------
  function home(d) {
    const root = el('div');

    // --- HERO ---
    const hero = el('div', { class: 'hero' });
    const heroGrid = el('div', { class: 'hero-grid' });
    const heroLeft = el('div');
    heroLeft.innerHTML = `
      <span class="tag">Sicherheitstechnik · Komplett · V4</span>
      <h1>Zwiebelprinzip – 4 Schutzzonen</h1>
      <p class="lead">Mechanik · Elektronik · Organisation – ineinander geschachtelt nach VdS 2333, DIN EN 50131-1 und DIN EN 1627. Vom Zaun bis zum Tresor.</p>
    `;
    const cta = el('div', { class: 'hero-cta' });
    const ctaA = el('button', { class:'btn primary', html:'<i class="fas fa-wand-magic-sparkles"></i> Sicherheitsassistent' });
    ctaA.addEventListener('click', () => location.hash = '#wizard');
    const ctaP = el('button', { class:'btn primary', html:'<i class="fas fa-atom"></i> Physik Live' });
    ctaP.addEventListener('click', () => location.hash = '#physik');
    const ctaB = el('button', { class:'btn', html:'<i class="fas fa-sliders"></i> Konfigurator' });
    ctaB.addEventListener('click', () => location.hash = '#konfigurator');
    const ctaC = el('button', { class:'btn', html:'<i class="fas fa-vector-square"></i> Simulator' });
    ctaC.addEventListener('click', () => location.hash = '#simulator');
    const ctaD = el('button', { class:'btn', html:'<i class="fas fa-calculator"></i> Rechner' });
    ctaD.addEventListener('click', () => location.hash = '#calculators');
    cta.appendChild(ctaA); cta.appendChild(ctaP); cta.appendChild(ctaB); cta.appendChild(ctaC); cta.appendChild(ctaD);
    heroLeft.appendChild(cta);
    heroGrid.appendChild(heroLeft);

    const heroRight = el('div', { class: 'onion-side' });
    // 3D-Onion when available, fallback to SVG
    if (window.ENCYVIEW && ENCYVIEW.onion3d) heroRight.appendChild(ENCYVIEW.onion3d());
    else heroRight.innerHTML = ILL.onionAnim();
    heroGrid.appendChild(heroRight);
    hero.appendChild(heroGrid);
    root.appendChild(hero);

    // --- BIG STATS (animated) ---
    const total = d.preisliste.rows.length;
    const meldVar = d.melder.tables.reduce((s,t)=>s+t.rows.length, 0);
    const docs = d.dokumente.length;
    const bigstats = el('div', { class:'bigstats' });
    [
      { icon:'fa-layer-group', n: 4,       l:'Schutzzonen' },
      { icon:'fa-medal',       n: 6,       l:'Sicherungsklassen SÜ' },
      { icon:'fa-bell',        n: 4,       l:'EMA-Grade · EN 50131' },
      { icon:'fa-shield-halved',n:6,       l:'RC-Klassen' },
      { icon:'fa-wave-square', n: meldVar, l:'Meldervarianten' },
      { icon:'fa-euro-sign',   n: total,   l:'Produkte mit Preis' },
      { icon:'fa-folder-open', n: docs,    l:'Normen & Dokumente' },
    ].forEach(s => {
      const c = el('div', { class:'bigstat' });
      c.appendChild(el('div', { class:'icon', html:`<i class="fas ${s.icon}"></i>` }));
      const n = el('div', { class:'num', text:'0' });
      c.appendChild(n);
      c.appendChild(el('div', { class:'lbl', text:s.l }));
      bigstats.appendChild(c);
      // animate when in viewport
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { VIZ.animateCounter(n, s.n); obs.disconnect(); }
        });
      });
      obs.observe(c);
    });
    root.appendChild(bigstats);

    // --- Quick interactive house map ---
    const mapCard = el('div', { class:'card' });
    mapCard.appendChild(el('div', { class:'card-h' }, [
      el('div', { class:'ico', html:'<i class="fas fa-house-chimney"></i>' }),
      el('h3', { text: 'Sicherheitszonen am Objekt – Klick auf eine Zone' })
    ]));
    const mapWrap = el('div', { html: ILL.houseMap() });
    mapCard.appendChild(mapWrap);
    setTimeout(() => {
      mapWrap.querySelectorAll('.z-clk').forEach(g => {
        g.addEventListener('click', () => {
          const zn = +g.dataset.zone;
          const zone = d.sicherheitskonzept.zones[zn-1];
          if (zone) zoneDrawer(zone);
        });
      });
    }, 50);
    root.appendChild(mapCard);

    // --- Quick-Action Tiles, in klare Gruppen sortiert ---
    const qaWrap = el('div');
    const qaGroups = [
      { label:'Verstehen', tiles:[
        { v:'physik',       icon:'fa-atom',            t:'Physik Live',            d:'18 Sims: Leitstand, CCTV, Zutritt, Sound u.v.m.' },
        { v:'gesetze',      icon:'fa-gavel',           t:'Gesetze & Normen',       d:'BeWachV · DGUV · KRITIS · DIN SPEC 14027' },
        { v:'enzyklopaedie',icon:'fa-flask',           t:'Melder-Enzyklopädie',    d:'Detektoren erklärt · aktiv/passiv' },
        { v:'mechency',     icon:'fa-flask-vial',      t:'Mechanik-Enzyklopädie',  d:'50+ Komponenten · Bilder · Vergleich' },
      ]},
      { label:'Planen & Berechnen', tiles:[
        { v:'wizard',       icon:'fa-wand-magic-sparkles', t:'Sicherheits-Assistent', d:'Fragen beantworten → SÜ-Empfehlung' },
        { v:'konfigurator', icon:'fa-sliders',         t:'Konfigurator',           d:'Schutz-Stack mit Richtpreis' },
        { v:'calculators',  icon:'fa-calculator',      t:'Calculator-Suite',       d:'Live-Rechner für Mengen + Preis' },
        { v:'simulator',    icon:'fa-vector-square',   t:'Plan-Simulator',         d:'Sensoren platzieren & planen' },
        { v:'vergleich',    icon:'fa-table-cells-large', t:'Melder-Vergleich',     d:'PIR vs MW vs Dual vs Schranke' },
      ]},
      { label:'In 3D ansehen', tiles:[
        { v:'haus3d',       icon:'fa-house-chimney',   t:'Sicherheits-Haus 3D',    d:'Vom Zaun bis zum Tresor · 4 Zonen' },
        { v:'zwiebel3d',    icon:'fa-circle-dot',      t:'3D-Zwiebelmodell',       d:'4-Zonen-Schutzkonzept interaktiv' },
        { v:'building3d',   icon:'fa-cube',            t:'3D-Gebäudeplaner',       d:'Isometrisches Haus · rotierbar' },
        { v:'spektrum',     icon:'fa-wave-square',     t:'Frequenz-Spektrum',      d:'EM-Spektrum · Wellenformen' },
      ]},
      { label:'Technik · Bilder · Lernen', tiles:[
        { v:'mechanik',     icon:'fa-shield-halved',   t:'Mechanik · 6 Kategorien', d:'Türen · Tore · Zäune · Poller · Tresore' },
        { v:'galerie',      icon:'fa-images',          t:'Produkt-Galerie',        d:'Echte Produktfotos nach Hersteller' },
        { v:'mediathek',    icon:'fa-photo-film',      t:'Mediathek',              d:'Alle Bilder + Animationen' },
        { v:'wwd',          icon:'fa-tower-cell',      t:'WWD Video-Türme',        d:'KI · 24/7-Leitstelle' },
        { v:'quiz',         icon:'fa-graduation-cap',  t:'Quiz',                   d:'Teste dein Wissen' },
        { v:'glossar',      icon:'fa-book',            t:'Glossar',                d:'Fachbegriffe erklärt' },
      ]},
    ];
    qaGroups.forEach(g => {
      qaWrap.appendChild(el('div', { class:'qa-section-label', text:g.label }));
      const grid = el('div', { class:'quick-actions' });
      g.tiles.forEach(a => {
        const t = el('button', { class:'qa-tile' });
        t.innerHTML = `<div class="qa-i"><i class="fas ${a.icon}"></i></div>
                       <div class="qa-t">${a.t}</div>
                       <div class="qa-d">${a.d}</div>`;
        t.addEventListener('click', () => location.hash = '#'+a.v);
        grid.appendChild(t);
      });
      qaWrap.appendChild(grid);
    });
    root.appendChild(qaWrap);

    // --- Zonen-Karten (Inline-Grid, kompakt) ---
    const zoneCard = el('div', { class:'card' });
    zoneCard.appendChild(el('div', { class:'card-h' }, [
      el('div', { class:'ico', html:'<i class="fas fa-layer-group"></i>' }),
      el('h3', { text:'Schutzzonen 1 → 4 · Klick für Details' })
    ]));
    const zg = el('div', { class: 'zone-grid' });
    d.sicherheitskonzept.zones.forEach((z, i) => {
      const c = el('div', { class: 'zone-card', dataset:{ zone: String(i+1) } });
      c.appendChild(el('span', { class: 'glyph', html: ['<i class="fas fa-tower-broadcast"></i>','<i class="fas fa-door-closed"></i>','<i class="fas fa-people-roof"></i>','<i class="fas fa-vault"></i>'][i] }));
      c.appendChild(el('div', { class: 'num', text: String(i+1) }));
      c.appendChild(el('h3', { text: z['Bezeichnung'] || '' }));
      c.appendChild(el('div', { class: 'area', text: z['Schutzbereich'] || '' }));
      c.appendChild(el('div', { class: 'mt-12 row' }, [
        pillFor(z['Risikobewertung']) || el('span'),
      ]));
      c.addEventListener('click', () => zoneDrawer(z));
      zg.appendChild(c);
    });
    zoneCard.appendChild(zg);
    root.appendChild(zoneCard);

    const wrap = el('div', { class: 'grid', style: 'grid-template-columns: minmax(0, 1fr); gap: 16px;' });

    // Übergeordnete Systeme
    const sysCard = el('div', { class: 'card' });
    sysCard.appendChild(el('div', { class: 'card-h' }, [
      el('div', { class: 'ico', html: '<i class="fas fa-sitemap"></i>' }),
      el('h3', { text: 'Übergeordnete Systeme' })
    ]));
    const sysG = el('div', { class: 'grid cols-2' });
    d.sicherheitskonzept.systems.forEach(s => {
      const c = el('div', { class: 'card', style: 'background: var(--surface-2);' });
      c.appendChild(el('div', { class: 'card-h' }, [
        el('div', { class: 'ico', html: ({EMA:'<i class="fas fa-bell"></i>',BMA:'<i class="fas fa-fire"></i>',ZKA:'<i class="fas fa-id-card"></i>',VSS:'<i class="fas fa-video"></i>'})[s.system.split(' ')[0]] || '<i class="fas fa-sitemap"></i>' }),
        el('h3', { text: s.system })
      ]));
      c.appendChild(el('p', { text: s.elektronisch }));
      c.appendChild(el('div', { class: 'mt-12 row' }, [
        s.normen ? el('span', { class: 'pill', text: s.normen.split(',')[0] }) : null,
        s.vds && s.vds !== '—' ? el('span', { class: 'pill b', text: s.vds.split(',')[0] }) : null
      ]));
      c.addEventListener('click', () => systemDrawer(s));
      c.style.cursor = 'pointer';
      sysG.appendChild(c);
    });
    sysCard.appendChild(sysG);
    wrap.appendChild(sysCard);

    root.appendChild(wrap);
    return root;
  }

  function stat(n, l) {
    return el('div', { class: 'stat' }, [
      el('div', { class: 'n', text: n }),
      el('div', { class: 'l', text: l }),
    ]);
  }

  function zoneDrawer(z) {
    const body = el('div');
    body.appendChild(el('h4', { text: 'Schutzbereich' }));
    body.appendChild(el('p', { text: z['Schutzbereich'] || '' }));
    body.appendChild(el('h4', { text: 'Mechanische Maßnahmen' }));
    body.appendChild(el('p', { text: z['Mechanische Maßnahmen'] || '' }));
    body.appendChild(el('h4', { text: 'Elektronische Maßnahmen' }));
    body.appendChild(el('p', { text: z['Elektronische Maßnahmen'] || '' }));
    body.appendChild(el('h4', { text: 'Organisatorische Maßnahmen' }));
    body.appendChild(el('p', { text: z['Organisatorische Maßnahmen'] || '' }));
    body.appendChild(el('h4', { text: 'Normen & Richtlinien' }));
    body.appendChild(el('div', { class: 'row' }, [
      ...(z['Relevante Normen']||'').split(',').map(s => s.trim()).filter(Boolean).map(s => el('span',{class:'pill',text:s})),
      ...(z['VdS-Richtlinien']||'').split(',').map(s => s.trim()).filter(Boolean).map(s => el('span',{class:'pill b',text:s})),
    ]));
    drawer(`Zone ${z['Zone'] ? z['Zone'].replace('Zone ','') : ''} · ${z['Bezeichnung']}`, body);
  }

  function systemDrawer(s) {
    const body = el('div');
    body.appendChild(el('div', { class: 'kv-grid' }, [
      el('div',{class:'k',text:'Schutzbereich'}), el('div',{class:'v',text:s.bereich||''}),
      el('div',{class:'k',text:'Mechanik'}), el('div',{class:'v',text:s.mechanisch||''}),
      el('div',{class:'k',text:'Elektronik'}), el('div',{class:'v',text:s.elektronisch||''}),
      el('div',{class:'k',text:'Organisation'}), el('div',{class:'v',text:s.organisatorisch||''}),
      el('div',{class:'k',text:'Normen'}), el('div',{class:'v',text:s.normen||''}),
      el('div',{class:'k',text:'VdS'}), el('div',{class:'v',text:s.vds||'—'}),
      el('div',{class:'k',text:'Risiko'}), el('div',{class:'v',text:s.risiko||''}),
    ]));
    drawer(s.system, body);
  }

  // --------- KLASSEN (Sicherungsklassen) ----------
  function klassen(d) {
    const root = el('div');
    root.appendChild(el('div', { class: 'view-head' }, [
      el('span', { class: 'crumb', text: 'Sicherungs- & Widerstandsklassen' }),
      el('h1', { text: 'SÜ · EMA-Grad · RC-Klasse' }),
      el('p', { text: 'Klassen-Matrix nach VdS 2333, DIN EN 50131-1 und DIN EN 1627-1630. Klicke eine Klasse für Details.' })
    ]));

    // Visual RC progression bar (resistance time)
    const rcTable = d.sicherungsklassen.tables.find(t => /RC|Widerstand/i.test(t.title));
    if (rcTable) {
      const rcCard = el('div', { class:'card', style:'padding:18px; margin-bottom:18px' });
      rcCard.appendChild(el('div', { class:'card-h' }, [
        el('div', { class:'ico', html:'<i class="fas fa-stopwatch"></i>' }),
        el('h3', { text:'RC-Widerstandszeit visuell' })
      ]));
      const maxMin = 20; // RC 6 = 20 min
      rcTable.rows.forEach(r => {
        const t = (r['Widerstandszeit'] || '').match(/\d+/);
        const mins = t ? +t[0] : 0;
        const row = el('div', { class:'rcbar-row' });
        row.appendChild(el('div', { class:'rclbl', text: r['RC-Klasse'] }));
        const bar = el('div', { class:'rcbar' });
        const fill = el('div', { class:'fill', style:`width:${(mins/maxMin*100).toFixed(0)}%` });
        bar.appendChild(fill);
        row.appendChild(bar);
        row.appendChild(el('div', { class:'rcval', text: r['Widerstandszeit'] || '—' }));
        rcCard.appendChild(row);
      });
      root.appendChild(rcCard);
    }

    d.sicherungsklassen.tables.forEach(t => {
      const wrap = el('div', { class: 'table-wrap' });
      wrap.appendChild(el('header', {}, [
        el('h3', { text: t.title }),
        el('span', { class: 'badge', text: t.rows.length + ' Klassen' })
      ]));
      const headers = t.header.filter(h => h);
      const tbl = buildTable(headers, t.rows, {
        pillCols: ['Sicherungsklasse','EMA-Grad','RC-Klasse','Risikograd','Risikostufe','EMA-Grad (EN 50131)','VdS-Klasse'],
        onRow: (row) => {
          const body = el('div', { class: 'kv-grid' });
          headers.forEach(h => {
            const v = row[h] || '';
            if (!v) return;
            body.appendChild(el('div', { class: 'k', text: h }));
            body.appendChild(el('div', { class: 'v', text: v }));
          });
          drawer(row[headers[1]] || row[headers[0]] || 'Detail', body);
        }
      });
      wrap.appendChild(tbl);
      root.appendChild(wrap);
    });

    return root;
  }

  // ---------- PERIMETER ----------
  function perimeter(d) { return makeCatalogView(d.perimeter, 'Perimeter · Zone 1', 'Zäune, Tore, Schranken, Poller & Sensoren – erste Verteidigungslinie am Grundstücksrand.'); }
  function aussenhaut(d) { return makeCatalogView(d.aussenhaut, 'Außenhaut · Zone 2', 'Türen, Fenster, Verglasung & Schlösser nach DIN EN 1627–1630 und DIN EN 356.'); }
  function ema(d) {
    const fake = { intro: d.ema_zka.intro, tables: d.ema_zka.tables };
    // synthesize sub-sections by Kategorie
    const t0 = fake.tables[0];
    const cats = {};
    t0.rows.forEach(r => {
      const k = r['Kategorie'] || 'Sonstige';
      (cats[k] = cats[k] || []).push(r);
    });
    fake.tables = Object.entries(cats).map(([k,rs]) => ({
      title: ({Zentrale:'⚡ EMA-Zentralen', Bedienteil:'🎛 Bedienteile', Schalteinrichtung:'🔑 Schalteinrichtungen', Signalgeber:'🔊 Signalgeber', Übertragung:'📡 Alarmübertragung (AÜA)', NSL:'☎️ Notruf-Service-Leitstelle', ZKA:'🆔 Zutrittskontrolle (ZKA)'})[k] || k,
      header: t0.header,
      rows: rs
    }));
    return makeCatalogView(fake, 'EMA · ZKA · NSL', 'Übergeordnete Systeme: Zentralen, Übertragung, NSL-Aufschaltung und Zutrittskontrolle.');
  }

  function makeCatalogView(catData, title, sub) {
    const root = el('div');
    root.appendChild(el('div', { class: 'view-head' }, [
      el('span', { class: 'crumb', text: 'Katalog' }),
      el('h1', { text: title }),
      el('p', { text: sub })
    ]));

    // Combine all rows for filter UI
    const all = [];
    catData.tables.forEach((t, ti) => t.rows.forEach(r => all.push({ ...r, _section: t.title, _ti: ti })));
    // collect SÜ classes for chips
    const sueSet = new Set();
    all.forEach(r => {
      const v = (r['Sicherungsklasse'] || r['VdS-Klasse / Grad'] || '');
      const m = v.match(/SÜ\s*[\d–-]+/i);
      if (m) sueSet.add(m[0].replace(/\s+/g, ' '));
    });
    const sueList = ['Alle', ...Array.from(sueSet).sort()];

    const fbar = el('div', { class: 'filterbar' });
    let activeSue = 'Alle';
    let q = '';
    const sueChips = el('div', { class: 'row', style: 'gap: 6px;' });
    sueList.forEach(s => {
      const c = el('button', { class: 'chip' + (s==='Alle' ? ' active' : ''), text: s });
      c.addEventListener('click', () => {
        activeSue = s;
        sueChips.querySelectorAll('.chip').forEach(x => x.classList.toggle('active', x.textContent === s));
        rerender();
      });
      sueChips.appendChild(c);
    });
    fbar.appendChild(sueChips);

    const inp = el('input', { class: 'input', placeholder: 'Filter: Produkt, Norm, Hersteller, Einsatzbereich...', style: 'flex:1; min-width: 220px;' });
    inp.addEventListener('input', () => { q = inp.value.toLowerCase().trim(); rerender(); });
    fbar.appendChild(inp);

    root.appendChild(fbar);

    const list = el('div');
    root.appendChild(list);

    function rerender() {
      list.innerHTML = '';
      catData.tables.forEach((t, ti) => {
        const headers = t.header.filter(h => h);
        const filtered = t.rows.filter(r => {
          if (activeSue !== 'Alle') {
            const v = (r['Sicherungsklasse'] || r['VdS-Klasse / Grad'] || '');
            if (!v.toLowerCase().includes(activeSue.toLowerCase())) return false;
          }
          if (q) {
            const hay = Object.values(r).join(' ').toLowerCase();
            if (!hay.includes(q)) return false;
          }
          return true;
        });
        if (!filtered.length) return;
        const wrap = el('div', { class: 'table-wrap' });
        wrap.appendChild(el('header', {}, [
          el('h3', { text: t.title }),
          el('span', { class: 'badge', text: filtered.length + ' / ' + t.rows.length })
        ]));
        wrap.appendChild(buildTable(headers, filtered, {
          pillCols: ['Sicherungsklasse','VdS-Klasse / Grad','RC-Klasse'],
          onRow: (row) => {
            const body = el('div', { class: 'kv-grid' });
            headers.forEach(h => {
              const v = row[h] || '';
              if (!v) return;
              body.appendChild(el('div', { class: 'k', text: h }));
              body.appendChild(el('div', { class: 'v', text: v }));
            });
            drawer(row['Produkt'] || row['Produkt / Maßnahme'] || row['Komponente'] || row['Meldertyp'] || 'Detail', body);
          }
        }));
        list.appendChild(wrap);
      });
      if (!list.children.length) list.appendChild(el('p', { class: 'muted', text: 'Keine Treffer.' }));
    }

    rerender();
    return root;
  }

  // ---------- MELDER ----------
  function melder(d) {
    const root = el('div');
    root.appendChild(el('div', { class: 'view-head' }, [
      el('span', { class: 'crumb', text: 'Detektion · Zone 2–4' }),
      el('h1', { text: 'Melder – Komplettübersicht' }),
      el('p', { text: 'Bewegungs-, Öffnungs-, Glasbruch-, Erschütterungs-, Spezial- und Brandmelder mit VdS-Norm und Detektionsprinzip.' })
    ]));

    // Detector-card grid above the tables (links into the detail drawers)
    if (d.details) {
      const featured = el('div', { class:'card', style:'padding:18px; margin-bottom:18px' });
      featured.appendChild(el('div', { class:'card-h' }, [
        el('div', { class:'ico', html:'<i class="fas fa-microscope"></i>' }),
        el('h3', { text: 'Funktionsprinzipien (Klick für Detail-Illustration)' })
      ]));
      const grid = el('div', { class:'det-grid' });
      d.details.forEach(det => grid.appendChild(detCard(det)));
      featured.appendChild(grid);
      root.appendChild(featured);
    }

    // Detail cards for D1-D10
    const detailMap = {};
    (d.details || []).forEach(det => detailMap[det.key] = det);

    const keyMap = {
      'PIR-Melder': 'd1_pir_melder',
      'Dualmelder': 'd2_dualmelder',
      'Magnetkontakt': 'd3_magnetkontakt',
      'Schließblechkontakt': 'd10_schliessblechkontakt',
      'Glasbruchmelder': 'd4_glasbruchmelder',
      'Glasbruch': 'd4_glasbruchmelder',
      'Erschütterung': 'd5_erschuetterung',
      'Körperschall': 'd5_erschuetterung',
      'Mikrowellenmelder': 'd6_mikrowelle',
      'IR-Lichtschranke': 'd7_ir_lichtschranke',
      'Brandmelder': 'd8_brandmelder',
      'Rauchmelder': 'd8_brandmelder',
      'Flammenmelder': 'd8_brandmelder',
      'Ansaugrauchmelder': 'd8_brandmelder',
      'Multisensor': 'd8_brandmelder',
      'Druckmatte': 'd9_spezialmelder',
      'Ultraschall': 'd9_spezialmelder',
      'Kapazitiv': 'd9_spezialmelder',
      'Seismisch': 'd9_spezialmelder',
      'Neigungssensor': 'd9_spezialmelder',
      'Wassermelder': 'd9_spezialmelder',
      'Gasmelder': 'd9_spezialmelder',
    };

    function findDetailKey(row) {
      const text = ((row['Meldertyp']||'') + ' ' + (row['Kategorie']||'') + ' ' + (row['Unterkategorie']||''));
      for (const k of Object.keys(keyMap)) {
        if (text.includes(k)) return keyMap[k];
      }
      return null;
    }

    // Filter bar
    const all = [];
    d.melder.tables.forEach((t, ti) => t.rows.forEach(r => all.push({ ...r, _section: t.title, _ti: ti })));
    const sueSet = new Set();
    all.forEach(r => {
      const v = r['Sicherungsklasse'] || '';
      const m = v.match(/SÜ\s*[\d–-]+/i);
      if (m) sueSet.add(m[0].replace(/\s+/g, ' '));
    });
    const sueList = ['Alle', ...Array.from(sueSet).sort()];
    let activeSue = 'Alle';
    let q = '';
    let activeSection = 'Alle';

    const fbar = el('div', { class: 'filterbar' });
    const secChips = el('div', { class: 'row', style: 'gap:6px;' });
    ['Alle', ...d.melder.tables.map(t => t.title)].forEach(s => {
      const c = el('button', { class: 'chip' + (s==='Alle'?' active':''), text: s.length>26 ? s.slice(0,24)+'…' : s, title: s });
      c.addEventListener('click', () => {
        activeSection = s;
        secChips.querySelectorAll('.chip').forEach(x => x.classList.toggle('active', x === c));
        rerender();
      });
      secChips.appendChild(c);
    });
    fbar.appendChild(secChips);

    const fb2 = el('div', { class: 'filterbar' });
    const sueChips = el('div', { class: 'row', style: 'gap:6px;' });
    sueList.forEach(s => {
      const c = el('button', { class: 'chip'+(s==='Alle'?' active':''), text: s });
      c.addEventListener('click', () => {
        activeSue = s;
        sueChips.querySelectorAll('.chip').forEach(x => x.classList.toggle('active', x===c));
        rerender();
      });
      sueChips.appendChild(c);
    });
    fb2.appendChild(sueChips);

    const inp = el('input', { class: 'input', placeholder: 'Filter: Bosch, Tier-Immun, Vorhang, Glasbruch...', style:'flex:1; min-width:220px;' });
    inp.addEventListener('input', () => { q = inp.value.toLowerCase().trim(); rerender(); });
    fb2.appendChild(inp);

    root.appendChild(fbar);
    root.appendChild(fb2);

    const list = el('div');
    root.appendChild(list);

    function rerender() {
      list.innerHTML = '';
      d.melder.tables.forEach((t) => {
        if (activeSection !== 'Alle' && activeSection !== t.title) return;
        const headers = t.header.filter(h => h);
        const filtered = t.rows.filter(r => {
          if (activeSue !== 'Alle') {
            const v = r['Sicherungsklasse'] || '';
            if (!v.toLowerCase().includes(activeSue.toLowerCase())) return false;
          }
          if (q) {
            const hay = Object.values(r).join(' ').toLowerCase();
            if (!hay.includes(q)) return false;
          }
          return true;
        });
        if (!filtered.length) return;
        const wrap = el('div', { class: 'table-wrap' });
        wrap.appendChild(el('header', {}, [
          el('h3', { text: t.title }),
          el('span', { class: 'badge', text: filtered.length + ' / ' + t.rows.length })
        ]));
        wrap.appendChild(buildTable(headers, filtered, {
          pillCols: ['Sicherungsklasse'],
          onRow: (row) => {
            const body = el('div');
            const kv = el('div', { class: 'kv-grid' });
            headers.forEach(h => {
              if (!row[h]) return;
              kv.appendChild(el('div',{class:'k',text:h}));
              kv.appendChild(el('div',{class:'v',text:row[h]}));
            });
            body.appendChild(kv);
            const dKey = findDetailKey(row);
            if (dKey && detailMap[dKey]) {
              const btn = el('button', { class: 'btn primary mt-16', html: '<i class="fas fa-microscope"></i> Funktionsprinzip im Detail' });
              btn.addEventListener('click', () => showDetector(detailMap[dKey]));
              body.appendChild(btn);
            }
            drawer(row['Meldertyp'] || 'Melder', body);
          }
        }));
        list.appendChild(wrap);
      });
      if (!list.children.length) list.appendChild(el('p',{class:'muted',text:'Keine Treffer.'}));
    }

    rerender();
    return root;
  }

  function showDetector(det) {
    const body = el('div');
    // Map D1..D10 to encyclopedia keys with explainers
    const EXPL_KEY = {
      'd1_pir_melder': 'pir-standard',
      'd2_dualmelder': 'dualmelder',
      'd3_magnetkontakt': 'magnetkontakt',
      'd4_glasbruchmelder': 'glas-passiv',
      'd5_erschuetterung': 'piezo-erschuetterung',
      'd6_mikrowelle': 'mikrowelle',
      'd7_ir_lichtschranke': 'ir-schranke',
      'd8_brandmelder': 'rauch-streulicht',
      'd9_spezialmelder': 'kapazitiv',
      'd10_schliessblechkontakt': 'magnetkontakt',
    };
    const ek = EXPL_KEY[det.key];
    if (ek && window.EXPL && EXPL.hasExplainer(ek)) {
      EXPL.player(ek, body);
    } else {
      const ILLMAP = {
        'd1_pir_melder': ILL.pir,
        'd2_dualmelder': ILL.dual,
        'd3_magnetkontakt': ILL.mag,
        'd4_glasbruchmelder': ILL.glass,
        'd5_erschuetterung': ILL.shake,
        'd6_mikrowelle': ILL.mw,
        'd7_ir_lichtschranke': ILL.irBeam,
        'd8_brandmelder': ILL.fire,
        'd9_spezialmelder': ILL.press,
        'd10_schliessblechkontakt': ILL.mag,
      };
      const heroSvg = ILLMAP[det.key] ? ILLMAP[det.key]() : '';
      if (heroSvg) body.appendChild(el('div', { class:'mt-12', html: heroSvg }));
    }
    body.appendChild(el('div', { class: 'det-hero' }, [
      el('h2', { text: det.title }),
      el('div', { class: 'sub', text: det.subtitle || '' }),
    ]));
    det.sections.forEach(sec => {
      const w = el('div', { class: 'det-section' });
      w.appendChild(el('h3', { text: sec.title }));
      if (sec.lines && sec.lines.length) {
        const ul = el('ul');
        sec.lines.forEach(l => ul.appendChild(el('li', { text: l })));
        w.appendChild(ul);
      }
      if (sec.table && sec.table.header) {
        const headers = sec.table.header.filter(h => h);
        w.appendChild(buildTable(headers, sec.table.rows));
      }
      body.appendChild(w);
    });
    drawer(det.name, body);
  }

  // ---------- SIMULATOR ----------
  function simulator(d) {
    const root = el('div');
    root.appendChild(el('div', { class:'view-head' }, [
      el('span', { class:'crumb', text:'Interaktiv' }),
      el('h1', { text:'Floor-Plan Simulator' }),
      el('p', { text:'Platziere virtuelle Sensoren auf einem Grundriss und sieh, welche Bereiche abgedeckt sind. Plus: Coverage-Vergleich verschiedener Melder im selben Raum.' })
    ]));
    root.appendChild(VIZ.floorPlan());
    const cov = VIZ.coverageView();
    root.appendChild(cov.root);
    return root;
  }

  // ---------- VERGLEICH ----------
  function vergleich(d) {
    const root = el('div');
    root.appendChild(el('div', { class:'view-head' }, [
      el('span', { class:'crumb', text:'Side-by-Side' }),
      el('h1', { text:'Melder-Vergleich' }),
      el('p', { text:'Vier Detektionsprinzipien im direkten Vergleich: Funktionsweise, Stärken, Schwächen.' })
    ]));
    root.appendChild(VIZ.compareView());
    // Plus full detector grid
    const grid = el('div', { class:'det-grid mt-24' });
    (d.details || []).forEach(det => grid.appendChild(detCard(det)));
    const wrap = el('div', { class:'card', style:'padding:18px; margin-top:24px' });
    wrap.appendChild(el('div', { class:'card-h' }, [
      el('div', { class:'ico', html:'<i class="fas fa-microscope"></i>' }),
      el('h3', { text:'Alle Funktionsprinzipien' })
    ]));
    wrap.appendChild(grid);
    root.appendChild(wrap);
    return root;
  }

  function detCard(det) {
    const ILLMAP = {
      'd1_pir_melder':  { fn: ILL.pir,  icon:'fa-eye',           sub:'Passiv-Infrarot' },
      'd2_dualmelder':  { fn: ILL.dual, icon:'fa-shield-halved', sub:'PIR + Mikrowelle' },
      'd3_magnetkontakt':{ fn: ILL.mag, icon:'fa-magnet',         sub:'Reed-Kontakt' },
      'd4_glasbruchmelder':{ fn: ILL.glass, icon:'fa-window-maximize', sub:'Akustisch · Piezo' },
      'd5_erschuetterung':{ fn: ILL.shake, icon:'fa-bolt',        sub:'Piezo · Körperschall' },
      'd6_mikrowelle':  { fn: ILL.mw,   icon:'fa-tower-broadcast', sub:'Doppler-Radar' },
      'd7_ir_lichtschranke':{ fn: ILL.irBeam, icon:'fa-arrows-left-right', sub:'IR-Strahl 940nm' },
      'd8_brandmelder': { fn: ILL.fire, icon:'fa-fire',           sub:'Rauch · Wärme · Flamme' },
      'd9_spezialmelder':{ fn: ILL.press, icon:'fa-star',         sub:'Druckmatte · Kapazitiv' },
      'd10_schliessblechkontakt':{ fn: ILL.mag, icon:'fa-lock',   sub:'Verriegelungskontakt' },
    };
    const m = ILLMAP[det.key] || {fn: ()=> '', icon:'fa-wave-square', sub:''};
    const card = el('div', { class:'det-card' });
    card.appendChild(el('div', { class:'head' }, [
      el('div', { class:'icon', html: `<i class="fas ${m.icon}"></i>` }),
      el('div', {}, [
        el('h3', { text: det.name }),
        el('div', { class:'sub', text: m.sub })
      ])
    ]));
    // pick first sub-headline line if exists
    const firstLines = (det.sections[0]?.lines || []).slice(0, 2).join(' ');
    if (firstLines) card.appendChild(el('div', { class:'desc', text: firstLines }));
    card.appendChild(el('div', { class:'mini-svg', html: m.fn() }));
    card.addEventListener('click', () => showDetector(det));
    return card;
  }

  // ---------- PREISLISTE ----------
  function preisliste(d) {
    const root = el('div');
    root.appendChild(el('div', { class: 'view-head' }, [
      el('span', { class: 'crumb', text: 'Investitionsrahmen' }),
      el('h1', { text: 'Preisliste – alle Komponenten' }),
      el('p', { text: '57 Komponenten mit Preisbereich. Filter, Sortierung und Live-Kalkulation per Mengeneingabe.' })
    ]));

    const headers = ['Nr.','Bereich','Kategorie','Produkt','Einheit','Preis von (€)','Preis bis (€)','Sicherungsklasse','Bemerkung'];
    let rows = d.preisliste.rows.slice();
    rows.forEach(r => { r._qty = 0; });

    const bereichSet = new Set(rows.map(r => r['Bereich']).filter(Boolean));
    let activeBereich = 'Alle';
    let q = '';

    const fbar = el('div', { class: 'filterbar' });
    const bChips = el('div', { class: 'row', style: 'gap:6px;' });
    ['Alle', ...bereichSet].forEach(b => {
      const c = el('button', { class: 'chip'+(b==='Alle'?' active':''), text: b });
      c.addEventListener('click', () => {
        activeBereich = b;
        bChips.querySelectorAll('.chip').forEach(x => x.classList.toggle('active', x===c));
        rerender();
      });
      bChips.appendChild(c);
    });
    fbar.appendChild(bChips);

    const inp = el('input', { class: 'input', placeholder: 'Suche im Preisliste...', style:'flex:1; min-width:220px;' });
    inp.addEventListener('input', () => { q = inp.value.toLowerCase().trim(); rerender(); });
    fbar.appendChild(inp);

    root.appendChild(fbar);

    const totals = el('div', { class: 'price-totals' });
    root.appendChild(totals);

    const tableHost = el('div');
    root.appendChild(tableHost);

    function rerender() {
      const filtered = rows.filter(r => {
        if (activeBereich !== 'Alle' && r['Bereich'] !== activeBereich) return false;
        if (q) {
          const hay = Object.values(r).join(' ').toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
      tableHost.innerHTML = '';
      const wrap = el('div', { class: 'table-wrap' });
      wrap.appendChild(el('header', {}, [
        el('h3', { text: 'Komponenten' }),
        el('span', { class: 'badge', text: filtered.length + ' / ' + rows.length + ' – Klick Menge ändern' })
      ]));
      const sc = el('div', { class: 'tbl-scroll' });
      const tbl = el('table', { class: 'data' });
      const trh = el('tr');
      ['Nr.','Bereich','Produkt','Einheit','Preis von','Preis bis','SÜ','Menge','Summe'].forEach(h => trh.appendChild(el('th', { text: h })));
      const thead = el('thead'); thead.appendChild(trh); tbl.appendChild(thead);
      const tbody = el('tbody');
      filtered.forEach(r => {
        const tr = el('tr');
        const lo = +r['Preis von (€)']||0, hi = +r['Preis bis (€)']||lo;
        tr.appendChild(el('td', { text: r['Nr.'] }));
        tr.appendChild(el('td', {}, [el('span', { class: 'pill', text: r['Bereich'] })]));
        tr.appendChild(el('td', { text: r['Produkt'] }));
        tr.appendChild(el('td', { text: r['Einheit']||'' }));
        tr.appendChild(el('td', { class: 'num', text: lo? fmtEUR(lo) : '—' }));
        tr.appendChild(el('td', { class: 'num', text: hi? fmtEUR(hi) : '—' }));
        const sue = r['Sicherungsklasse'] || '';
        tr.appendChild(el('td', {}, [sue ? pillFor(sue) : el('span')]));
        const qInput = el('input', { class:'input', type:'number', min:'0', value: r._qty||0, style:'width:80px; padding:6px 8px;' });
        qInput.addEventListener('input', () => { r._qty = +qInput.value || 0; updateSummary(); });
        const tdQ = el('td'); tdQ.appendChild(qInput); tr.appendChild(tdQ);
        const tdS = el('td', { class: 'num bold', text: (r._qty>0 ? fmtEUR(r._qty*(lo+hi)/2) : '—') });
        tr.appendChild(tdS);
        tbody.appendChild(tr);
      });
      tbl.appendChild(tbody); sc.appendChild(tbl); wrap.appendChild(sc);
      tableHost.appendChild(wrap);
      updateSummary();
    }

    function updateSummary() {
      let lo=0,hi=0,items=0;
      rows.forEach(r => {
        if (r._qty>0) {
          lo += r._qty * (+r['Preis von (€)']||0);
          hi += r._qty * (+r['Preis bis (€)']||0);
          items += r._qty;
        }
      });
      totals.innerHTML = '';
      totals.appendChild(el('div', { class:'flex' }, [
        el('div', {}, [
          el('div', { class:'x', text:'Konfigurierte Komponenten' }),
          el('div', { class:'y', text: String(items) })
        ]),
        el('div', {}, [
          el('div', { class:'x', text:'Investition (Bereich)' }),
          el('div', { class:'y accent', text: `${fmtEUR(lo)} – ${fmtEUR(hi)}` })
        ]),
        el('div', {}, [
          el('div', { class:'x', text:'Ø Erwartung' }),
          el('div', { class:'y', text: fmtEUR((lo+hi)/2) })
        ])
      ]));
      const clearBtn = el('button', { class:'btn ghost', html:'<i class="fas fa-rotate-left"></i> Zurücksetzen' });
      clearBtn.addEventListener('click', () => { rows.forEach(r=>r._qty=0); rerender(); });
      totals.appendChild(clearBtn);
    }

    rerender();
    return root;
  }

  // ---------- DOKUMENTE ----------
  function dokumente(d) {
    const root = el('div');
    root.appendChild(el('div', { class: 'view-head' }, [
      el('span', { class: 'crumb', text: 'Wissensbasis' }),
      el('h1', { text: 'Dokumente · Normen · Richtlinien' }),
      el('p', { text: 'Alle Quellen aus dem Originalordner – PDFs, DOCXs und Präsentationen mit Normbezug.' })
    ]));

    const groups = {};
    d.dokumente.forEach(doc => {
      const k = doc['Ordner'] || 'Sonstige';
      (groups[k] = groups[k] || []).push(doc);
    });

    Object.entries(groups).forEach(([ord, docs]) => {
      const wrap = el('div', { class: 'table-wrap' });
      wrap.appendChild(el('header', {}, [
        el('h3', { text: ord }),
        el('span', { class: 'badge', text: docs.length + ' Dokumente' })
      ]));
      wrap.appendChild(buildTable(['Dateiname','Typ','Thema','Relevante Normen','Verwendet in Sheet'], docs));
      root.appendChild(wrap);
    });
    return root;
  }

  // ---------- DIAGRAMME ----------
  function diagramme(d) {
    const root = el('div');
    root.appendChild(el('div', { class: 'view-head' }, [
      el('span', { class: 'crumb', text: 'Statistiken' }),
      el('h1', { text: 'Diagramme & Auswertungen' }),
      el('p', { text: 'Preisbereiche je Kategorie, Anzahl Meldertypen, Verteilung über SÜ-Klassen.' })
    ]));

    const grid = el('div', { class: 'chart-grid' });

    // Preise Min/Max/Avg
    const c1 = el('div', { class: 'chart-card' });
    c1.appendChild(el('h3', { text: 'Preisbereiche je Kategorie (€)' }));
    const cv1 = el('canvas', { width: '600', height: '320' }); c1.appendChild(cv1);
    grid.appendChild(c1);

    // Melder Anzahl
    const c2 = el('div', { class: 'chart-card' });
    c2.appendChild(el('h3', { text: 'Anzahl Meldervarianten' }));
    const cv2 = el('canvas', { width: '600', height: '320' }); c2.appendChild(cv2);
    grid.appendChild(c2);

    // Preisliste-Anteile (donut)
    const c3 = el('div', { class: 'chart-card' });
    c3.appendChild(el('h3', { text: 'Produkte je Bereich (Preisliste)' }));
    const cv3 = el('canvas', { width: '600', height: '320' }); c3.appendChild(cv3);
    grid.appendChild(c3);

    // SÜ-Verteilung
    const c4 = el('div', { class: 'chart-card' });
    c4.appendChild(el('h3', { text: 'Komponenten je Sicherungsklasse (SÜ)' }));
    const cv4 = el('canvas', { width: '600', height: '320' }); c4.appendChild(cv4);
    grid.appendChild(c4);

    root.appendChild(grid);

    // defer to next frame so canvas is attached
    requestAnimationFrame(() => {
      CHARTS.priceBars(cv1, d.diagramme.kategorien);
      CHARTS.bar(cv2, d.diagramme.melderzahl.map(x=>({label:x.typ,value:x.anzahl})));
      const bAgg = {}; d.preisliste.rows.forEach(r => bAgg[r['Bereich']] = (bAgg[r['Bereich']]||0)+1);
      CHARTS.donut(cv3, Object.entries(bAgg).map(([k,v])=>({label:k,value:v})));
      const sAgg = {1:0,2:0,3:0,4:0,5:0,6:0};
      d.preisliste.rows.forEach(r => {
        const s = r['Sicherungsklasse']||'';
        for (let i=1;i<=6;i++) if (new RegExp('SÜ\\s*'+i,'i').test(s)) sAgg[i]++;
      });
      CHARTS.bar(cv4, Object.entries(sAgg).map(([k,v])=>({label:'SÜ '+k, value: v})));
    });

    return root;
  }

  // ---------- KONFIGURATOR ----------
  function konfigurator(d) {
    return KFG.render(d);
  }

  // ---------- KONZEPT (full description) ----------
  function konzept(d) {
    const root = el('div');
    root.appendChild(el('div', { class: 'view-head' }, [
      el('span', { class: 'crumb', text: 'Sicherheitskonzept' }),
      el('h1', { text: 'Mehrschichtige Verteidigung' }),
      el('p', { text: 'Mechanik + Elektronik + Organisation, aufeinander abgestimmt nach Zwiebelprinzip. Jede Zone enthält eigene Maßnahmen, Normen und Sicherungsklassen.' })
    ]));

    // zone table
    const zHead = ['Zone','Bezeichnung','Schutzbereich','Mechanische Maßnahmen','Elektronische Maßnahmen','Organisatorische Maßnahmen','Relevante Normen','VdS-Richtlinien','Risikobewertung'];
    const wrap = el('div', { class: 'table-wrap' });
    wrap.appendChild(el('header', {}, [
      el('h3', { text: 'Schutzzonen im Sicherheitskonzept' }),
      el('span', { class: 'badge', text: '4 Zonen' })
    ]));
    wrap.appendChild(buildTable(zHead, d.sicherheitskonzept.zones));
    root.appendChild(wrap);

    const sysWrap = el('div', { class:'table-wrap' });
    sysWrap.appendChild(el('header', {}, [
      el('h3', { text: 'Übergeordnete Systeme' }),
      el('span', { class:'badge', text: '4 Systeme' })
    ]));
    const sysRows = d.sicherheitskonzept.systems.map(s => ({
      System: s.system, Bereich: s.bereich, Mechanik: s.mechanisch,
      Elektronik: s.elektronisch, Organisation: s.organisatorisch,
      Normen: s.normen, VdS: s.vds, Risiko: s.risiko
    }));
    sysWrap.appendChild(buildTable(['System','Bereich','Mechanik','Elektronik','Organisation','Normen','VdS','Risiko'], sysRows));
    root.appendChild(sysWrap);
    return root;
  }

  return { home, klassen, perimeter, aussenhaut, melder, ema, preisliste, dokumente, diagramme, konfigurator, konzept, simulator, vergleich, showDetector };
})();
