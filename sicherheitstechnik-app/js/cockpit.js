/* Cockpit – die zentrale Übersichts-Ansicht.
   Links: Alle Gesetze + Paragraphen, durchsuchbar.
   Rechts: Alle Sicherheits-Komponenten (Melder, Perimeter, Außenhaut, EMA, Klassen),
   durchsuchbar und nach Typ filterbar.
   Oben: eine Mega-Suche die BEIDE Spalten gleichzeitig filtert.
   window.COCKPIT.view(d). */
window.COCKPIT = (() => {
  const { el, escapeHtml, drawer } = U;

  /* ============ Daten sammeln ============ */
  function gatherLaws() {
    if (!window.GESETZE_DB) return [];
    return GESETZE_DB.getAll().map(g => ({
      g, items: g.abschnitte.flatMap(a => a.paragraphen.map(p => ({
        g, a, p,
        text: (p.p + ' ' + p.t + ' ' + (p.s || '') + ' ' + (p.tags || []).join(' ')).toLowerCase(),
      }))),
    }));
  }
  function gatherComponents(d) {
    // Liste mit Quelle, Kategorie, Zeile, normalisierten Feldern.
    const out = [];
    const push = (group, gid, gicon, color, tbl) => {
      (tbl.rows || []).forEach(r => {
        const title = r['Produkt / Maßnahme'] || r['Produkt'] || r['Maßnahme'] || r['Sicherungsklasse'] || r['EMA-Grad'] || r['RC-Klasse'] || r['Modell'] || Object.values(r)[1] || '';
        const desc = r['Beschreibung'] || r['Detektionsprinzip'] || r['Beispiel-Objekte'] || r['Anwendung'] || r['Typische Anwendung'] || r['Einsatzbereich'] || '';
        const klass = r['Sicherungsklasse'] || r['VdS-Klasse / Grad'] || r['VdS-Klasse'] || r['Widerstandsklasse'] || r['EMA-Grad'] || r['EMA-Grad (EN 50131)'] || '';
        const norm = r['Norm / Richtlinie'] || r['Norm'] || '';
        const preis = r['Richtpreis (€)'] || r['Richtpreis Tür (€)'] || r['Preis'] || r['Richtpreis'] || '';
        out.push({
          group, gid, gicon, color,
          section: (tbl.title || '').replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]\s*/u, ''),
          title, desc, klass, norm, preis, raw: r,
          text: (title + ' ' + desc + ' ' + klass + ' ' + norm + ' ' + (tbl.title || '')).toLowerCase(),
        });
      });
    };
    if (d.melder)     d.melder.tables.forEach(t => push('Melder', 'melder', 'fa-bell', '#22d3ee', t));
    if (d.perimeter)  d.perimeter.tables.forEach(t => push('Perimeter', 'perimeter', 'fa-border-all', '#22c55e', t));
    if (d.aussenhaut) d.aussenhaut.tables.forEach(t => push('Außenhaut', 'aussenhaut', 'fa-door-closed', '#fbbf24', t));
    if (d.ema_zka)    d.ema_zka.tables.forEach(t => push('EMA · ZKA', 'ema', 'fa-tower-broadcast', '#a855f7', t));
    if (d.sicherungsklassen) d.sicherungsklassen.tables.forEach(t => push('Klassen', 'klassen', 'fa-medal', '#ef4444', t));
    return out;
  }

  /* ============ Detail-Drawer ============ */
  function openLawDetail(item) {
    const { g, a, p } = item;
    const body = el('div', { class: 'ck-drawer' });
    body.appendChild(el('div', { class: 'ck-drawer-head', style: `--c:${g.farbe}` }, [
      el('div', { class: 'ck-drawer-ico', html: `<i class="fas ${g.icon}"></i>` }),
      el('div', {}, [
        el('div', { class: 'ck-drawer-meta', text: g.short + ' · ' + g.title + ' · Abschnitt ' + a.nr }),
        el('h3', { text: p.p + ' ' + p.t }),
      ]),
    ]));
    if (p.wichtig || p.jedermann) {
      const flags = el('div', { class: 'ck-drawer-flags' });
      if (p.wichtig) flags.appendChild(el('span', { class: 'ck-flag ck-flag-star', html: '<i class="fas fa-star"></i> WICHTIG' }));
      if (p.jedermann) flags.appendChild(el('span', { class: 'ck-flag ck-flag-hand', html: '<i class="fas fa-hand"></i> JEDERMANNSRECHT' }));
      body.appendChild(flags);
    }
    if (p.s) body.appendChild(el('div', { class: 'ck-drawer-section' }, [
      el('h4', { html: '<i class="fas fa-file-lines"></i> Zusammenfassung' }),
      el('p', { text: p.s }),
    ]));
    if (p.beispiel) body.appendChild(el('div', { class: 'ck-drawer-section ck-box-ex' }, [
      el('h4', { html: '<i class="fas fa-lightbulb"></i> Praxisfall' }),
      el('p', { text: p.beispiel }),
    ]));
    if (p.merksatz) body.appendChild(el('div', { class: 'ck-drawer-section ck-box-merk' }, [
      el('h4', { html: '<i class="fas fa-bookmark"></i> Merksatz' }),
      el('p', { text: p.merksatz }),
    ]));
    if (p.fehler && p.fehler.length) {
      const box = el('div', { class: 'ck-drawer-section ck-box-fehler' });
      box.appendChild(el('h4', { html: '<i class="fas fa-triangle-exclamation"></i> Typische Fehler' }));
      const ul = el('ul'); p.fehler.forEach(f => ul.appendChild(el('li', { text: f })));
      box.appendChild(ul); body.appendChild(box);
    }
    if (p.tags && p.tags.length) {
      const tg = el('div', { class: 'ck-drawer-tags' });
      p.tags.forEach(t => tg.appendChild(el('span', { class: 'ck-tag', text: t })));
      body.appendChild(tg);
    }
    // Notebook-Pin
    if (window.NOTEBOOK) {
      const actions = el('div', { class: 'ck-drawer-actions' });
      actions.appendChild(NOTEBOOK.pinBtn({
        id: g.id + '/' + (p.p || '').replace(/\s+/g, ''),
        kind: 'law', kicker: g.short + ' · Abschnitt ' + a.nr, badge: p.p,
        title: p.t, summary: p.s || '', beispiel: p.beispiel, merksatz: p.merksatz,
        fehler: p.fehler, tags: p.tags || [], wichtig: p.wichtig, jedermann: p.jedermann, accent: g.farbe,
      }));
      body.appendChild(actions);
    }
    drawer(p.p + ' · ' + p.t, body);
  }

  function openComponentDetail(it) {
    const body = el('div', { class: 'ck-drawer' });
    body.appendChild(el('div', { class: 'ck-drawer-head', style: `--c:${it.color}` }, [
      el('div', { class: 'ck-drawer-ico', html: `<i class="fas ${it.gicon}"></i>` }),
      el('div', {}, [
        el('div', { class: 'ck-drawer-meta', text: it.group + ' · ' + it.section }),
        el('h3', { text: it.title }),
      ]),
    ]));
    if (it.desc) body.appendChild(el('div', { class: 'ck-drawer-section' }, [
      el('h4', { html: '<i class="fas fa-file-lines"></i> Beschreibung' }),
      el('p', { text: it.desc }),
    ]));
    // Alle weiteren Felder als Key/Value-Liste
    const kv = el('div', { class: 'kv-grid' });
    Object.entries(it.raw).forEach(([k, v]) => {
      if (!v || k === 'Nr.' || k === 'Beschreibung') return;
      kv.appendChild(el('div', { class: 'k', text: k }));
      kv.appendChild(el('div', { class: 'v', text: v }));
    });
    body.appendChild(kv);
    drawer(it.title, body);
  }

  /* ============ Hauptansicht ============ */
  function view(d) {
    const root = el('div', { class: 'ck-wrap' });

    // Hero/Header mit Mega-Suche
    const head = el('div', { class: 'ck-head' });
    head.appendChild(el('div', { class: 'ck-head-l' }, [
      el('span', { class: 'ck-eyebrow', text: 'Cockpit' }),
      el('h1', { class: 'ck-title', text: '🛰 Alles auf einen Blick' }),
      el('p', { class: 'ck-sub', text: 'Links: Gesetze · Rechts: Melder & Komponenten · Suche oben filtert beides gleichzeitig. Klick öffnet Details. Nichts hin-und-her-Springen.' }),
    ]));
    const searchWrap = el('div', { class: 'ck-search-wrap' });
    const searchIcon = el('i', { class: 'fas fa-search ck-search-icon' });
    const search = el('input', { class: 'ck-search', type: 'search', placeholder: 'Suche in Gesetzen UND Komponenten…  z.B. Notwehr, PIR, RC 3, Versicherung, Glasbruch' });
    const clearBtn = el('button', { class: 'ck-search-clear hidden', html: '<i class="fas fa-xmark"></i>' });
    searchWrap.appendChild(searchIcon); searchWrap.appendChild(search); searchWrap.appendChild(clearBtn);
    head.appendChild(searchWrap);
    root.appendChild(head);

    // Quick-Stats
    const laws = gatherLaws();
    const components = gatherComponents(d);
    const lawCount = laws.reduce((s, x) => s + x.items.length, 0);
    const stats = el('div', { class: 'ck-stats' });
    [
      { i: 'fa-gavel', n: laws.length, l: 'Gesetze', c: '#fbbf24' },
      { i: 'fa-section', n: lawCount, l: 'Paragraphen', c: '#fbbf24' },
      { i: 'fa-bell', n: components.filter(c => c.group === 'Melder').length, l: 'Melder', c: '#22d3ee' },
      { i: 'fa-border-all', n: components.filter(c => c.group === 'Perimeter').length, l: 'Perimeter', c: '#22c55e' },
      { i: 'fa-door-closed', n: components.filter(c => c.group === 'Außenhaut').length, l: 'Außenhaut', c: '#fbbf24' },
      { i: 'fa-medal', n: components.filter(c => c.group === 'Klassen').length, l: 'Klassen', c: '#ef4444' },
    ].forEach(s => {
      const c = el('div', { class: 'ck-stat', style: `--c:${s.c}` });
      c.innerHTML = `<i class="fas ${s.i}"></i><strong>${s.n}</strong><span>${s.l}</span>`;
      stats.appendChild(c);
    });
    root.appendChild(stats);

    // Split-Layout
    const grid = el('div', { class: 'ck-grid' });
    const leftCol = el('div', { class: 'ck-col ck-col-laws' });
    const rightCol = el('div', { class: 'ck-col ck-col-comp' });
    grid.appendChild(leftCol); grid.appendChild(rightCol);
    root.appendChild(grid);

    // ===== LEFT: Gesetze =====
    leftCol.appendChild(el('div', { class: 'ck-col-head' }, [
      el('h2', { html: '<i class="fas fa-gavel"></i> Gesetze · §§' }),
      el('span', { class: 'ck-col-count', text: lawCount + ' §§' }),
    ]));

    // Gesetz-Filter-Chips (Toggle nach Gesetz)
    const lawFilters = new Set();  // wenn leer = alle
    const lawChipBar = el('div', { class: 'ck-chipbar' });
    laws.forEach(({ g }) => {
      const ch = el('button', { class: 'ck-chip', type: 'button', style: `--c:${g.farbe}`, dataset: { id: g.id } });
      ch.innerHTML = `<i class="fas ${g.icon}"></i> ${g.short}`;
      ch.addEventListener('click', () => {
        if (lawFilters.has(g.id)) lawFilters.delete(g.id); else lawFilters.add(g.id);
        ch.classList.toggle('on');
        renderLaws();
      });
      lawChipBar.appendChild(ch);
    });
    leftCol.appendChild(lawChipBar);

    // Quick-Filter Important / Jedermannsrecht
    const lawTagBar = el('div', { class: 'ck-tagbar' });
    let onlyWichtig = false, onlyJedermann = false;
    const wBtn = el('button', { class: 'ck-tagbtn', html: '<i class="fas fa-star"></i> nur WICHTIG' });
    const jBtn = el('button', { class: 'ck-tagbtn', html: '<i class="fas fa-hand"></i> nur JEDERMANNSRECHT' });
    wBtn.addEventListener('click', () => { onlyWichtig = !onlyWichtig; wBtn.classList.toggle('on'); renderLaws(); });
    jBtn.addEventListener('click', () => { onlyJedermann = !onlyJedermann; jBtn.classList.toggle('on'); renderLaws(); });
    lawTagBar.append(wBtn, jBtn);
    leftCol.appendChild(lawTagBar);

    const lawList = el('div', { class: 'ck-list' });
    leftCol.appendChild(lawList);

    function renderLaws() {
      const q = search.value.trim().toLowerCase();
      lawList.innerHTML = '';
      let totalShown = 0;
      laws.forEach(({ g, items }) => {
        if (lawFilters.size && !lawFilters.has(g.id)) return;
        const matched = items.filter(it =>
          (!q || it.text.includes(q)) &&
          (!onlyWichtig || it.p.wichtig) &&
          (!onlyJedermann || it.p.jedermann)
        );
        if (!matched.length) return;
        const grp = el('div', { class: 'ck-group', style: `--c:${g.farbe}` });
        grp.appendChild(el('div', { class: 'ck-group-head' }, [
          el('div', { class: 'ck-group-ic', html: `<i class="fas ${g.icon}"></i>` }),
          el('div', {}, [
            el('strong', { text: g.short }),
            el('span', { class: 'ck-group-sub', text: g.title }),
          ]),
          el('span', { class: 'ck-group-n', text: matched.length + ' §§' }),
        ]));
        matched.slice(0, 20).forEach(it => {
          const row = el('button', { class: 'ck-row', type: 'button' });
          const flagsHtml = (it.p.wichtig ? '<i class="fas fa-star ck-rowflag-star"></i>' : '') +
                           (it.p.jedermann ? '<i class="fas fa-hand ck-rowflag-hand"></i>' : '');
          row.innerHTML = `
            <span class="ck-row-badge" style="background:${g.farbe}">${it.p.p}</span>
            <span class="ck-row-body">
              <span class="ck-row-title">${highlight(it.p.t, q)} ${flagsHtml}</span>
              <span class="ck-row-desc">${highlight(it.p.s || '', q)}</span>
            </span>
            <i class="fas fa-chevron-right ck-row-go"></i>`;
          row.addEventListener('click', () => openLawDetail(it));
          grp.appendChild(row);
          totalShown++;
        });
        if (matched.length > 20) grp.appendChild(el('div', { class: 'ck-more', text: '+ ' + (matched.length - 20) + ' weitere Paragraphen (Suche eingrenzen)' }));
        lawList.appendChild(grp);
      });
      if (!totalShown) lawList.appendChild(el('div', { class: 'ck-empty', html: '<i class="fas fa-circle-info"></i> Keine Paragraphen passen.' }));
    }

    // ===== RIGHT: Komponenten =====
    rightCol.appendChild(el('div', { class: 'ck-col-head' }, [
      el('h2', { html: '<i class="fas fa-microchip"></i> Melder · Komponenten' }),
      el('span', { class: 'ck-col-count', text: components.length + ' Einträge' }),
    ]));

    const compFilters = new Set();
    const compChipBar = el('div', { class: 'ck-chipbar' });
    const groups = ['Melder', 'Perimeter', 'Außenhaut', 'EMA · ZKA', 'Klassen'];
    const groupColors = { 'Melder': '#22d3ee', 'Perimeter': '#22c55e', 'Außenhaut': '#fbbf24', 'EMA · ZKA': '#a855f7', 'Klassen': '#ef4444' };
    const groupIcons = { 'Melder': 'fa-bell', 'Perimeter': 'fa-border-all', 'Außenhaut': 'fa-door-closed', 'EMA · ZKA': 'fa-tower-broadcast', 'Klassen': 'fa-medal' };
    groups.forEach(g => {
      const ch = el('button', { class: 'ck-chip', type: 'button', style: `--c:${groupColors[g]}`, dataset: { id: g } });
      ch.innerHTML = `<i class="fas ${groupIcons[g]}"></i> ${g}`;
      ch.addEventListener('click', () => {
        if (compFilters.has(g)) compFilters.delete(g); else compFilters.add(g);
        ch.classList.toggle('on');
        renderComponents();
      });
      compChipBar.appendChild(ch);
    });
    rightCol.appendChild(compChipBar);

    const compList = el('div', { class: 'ck-list' });
    rightCol.appendChild(compList);

    function renderComponents() {
      const q = search.value.trim().toLowerCase();
      compList.innerHTML = '';
      // Gruppieren nach Group → Section
      const byGroup = {};
      components.forEach(c => {
        if (compFilters.size && !compFilters.has(c.group)) return;
        if (q && !c.text.includes(q)) return;
        (byGroup[c.group] = byGroup[c.group] || {})[c.section] = (byGroup[c.group][c.section] || []);
        byGroup[c.group][c.section].push(c);
      });
      let total = 0;
      Object.entries(byGroup).forEach(([gname, sections]) => {
        const color = groupColors[gname] || '#22d3ee';
        const grp = el('div', { class: 'ck-group', style: `--c:${color}` });
        const cnt = Object.values(sections).reduce((s, a) => s + a.length, 0);
        grp.appendChild(el('div', { class: 'ck-group-head' }, [
          el('div', { class: 'ck-group-ic', html: `<i class="fas ${groupIcons[gname]}"></i>` }),
          el('div', {}, [
            el('strong', { text: gname }),
            el('span', { class: 'ck-group-sub', text: Object.keys(sections).length + ' Kategorien' }),
          ]),
          el('span', { class: 'ck-group-n', text: cnt + ' Einträge' }),
        ]));
        Object.entries(sections).forEach(([sec, items]) => {
          if (Object.keys(sections).length > 1) grp.appendChild(el('div', { class: 'ck-subhead', text: sec }));
          items.slice(0, 15).forEach(it => {
            const row = el('button', { class: 'ck-row', type: 'button' });
            row.innerHTML = `
              <span class="ck-row-icon" style="color:${color}"><i class="fas ${it.gicon}"></i></span>
              <span class="ck-row-body">
                <span class="ck-row-title">${highlight(it.title, q)}</span>
                <span class="ck-row-desc">${highlight(it.desc || '', q)}</span>
                <span class="ck-row-tags">
                  ${it.klass ? `<span class="ck-pill" style="--c:${color}">${it.klass}</span>` : ''}
                  ${it.norm ? `<span class="ck-pill ck-pill-norm">${it.norm}</span>` : ''}
                  ${it.preis ? `<span class="ck-pill ck-pill-price">${it.preis}</span>` : ''}
                </span>
              </span>
              <i class="fas fa-chevron-right ck-row-go"></i>`;
            row.addEventListener('click', () => openComponentDetail(it));
            grp.appendChild(row);
            total++;
          });
          if (items.length > 15) grp.appendChild(el('div', { class: 'ck-more', text: '+ ' + (items.length - 15) + ' weitere (Suche eingrenzen)' }));
        });
        compList.appendChild(grp);
      });
      if (!total) compList.appendChild(el('div', { class: 'ck-empty', html: '<i class="fas fa-circle-info"></i> Keine Komponenten passen.' }));
    }

    function highlight(text, q) {
      const s = escapeHtml(text || '');
      if (!q) return s;
      const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      return s.replace(re, '<mark class="ck-hl">$1</mark>');
    }

    // Suche live: filtert BEIDE
    search.addEventListener('input', () => {
      clearBtn.classList.toggle('hidden', !search.value);
      renderLaws();
      renderComponents();
    });
    clearBtn.addEventListener('click', () => { search.value = ''; clearBtn.classList.add('hidden'); renderLaws(); renderComponents(); });
    // Initial
    renderLaws(); renderComponents();
    // Auto-Fokus
    setTimeout(() => search.focus(), 100);

    return root;
  }

  return { view };
})();
