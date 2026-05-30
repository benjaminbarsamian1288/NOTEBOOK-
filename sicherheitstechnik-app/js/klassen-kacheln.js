/* Große, klickbare Übersichts-Kacheln für die Klassen-Tabellen.
   window.KLASSENKACHELN.render(d) → DOM-Knoten mit drei Kachel-Sektionen
   (VdS-Sicherungsklassen SÜ, EMA-Grade, RC-Widerstandsklassen).
   Liest die echten Daten aus d.sicherungsklassen.tables. Tippen auf eine
   Kachel öffnet den Detail-Drawer mit allen Feldern der Zeile. */
window.KLASSENKACHELN = (() => {
  const { el, drawer } = U;

  // Risiko-Farbe: grün (geringes Risiko) → rot (höchstes Risiko)
  function lvColor(idx, count) {
    const hue = Math.round(140 - (idx / Math.max(1, count - 1)) * 140);
    return `hsl(${hue} 70% 50%)`;
  }

  // Konfiguration je Tabellentyp (über Titel erkannt)
  const CONFIGS = [
    {
      match: /Sicherungsklass/i,
      icon: 'fa-medal',
      title: 'VdS-Sicherungsklassen · SÜ 1 – 6',
      sub: 'Welches Schutzniveau braucht das Objekt? (VdS 2333)',
      badge: r => (r['Sicherungsklasse'] || '').split('/')[0].trim(),
      heading: r => r['Risikograd'] || '',
      desc: r => r['Beschreibung'] || '',
      facts: [
        ['EMA-Grad (EN 50131)', 'fa-bell', 'EMA-Grad'],
        ['Min. RC-Tür', 'fa-door-closed', 'Min. RC-Tür'],
        ['NSL-Aufschaltung', 'fa-tower-broadcast', 'NSL'],
      ],
      example: r => r['Beispiel-Objekte'] || '',
    },
    {
      match: /EMA-SICHERHEITSGRADE|EMA-Grad/i,
      icon: 'fa-bell',
      title: 'EMA-Sicherheitsgrade · Grad 1 – 4',
      sub: 'Gegen welchen Tätertyp schützt die Alarmanlage? (DIN EN 50131-1)',
      badge: r => { const m = (r['EMA-Grad'] || '').match(/Grad\s*\d/i); return m ? m[0] : (r['EMA-Grad'] || ''); },
      heading: r => { const p = (r['EMA-Grad'] || '').split('–')[1]; return (p ? p.trim() : '') || r['Risikostufe'] || ''; },
      desc: r => r['Bemerkung'] || '',
      facts: [
        ['Tätertyp', 'fa-user-ninja', 'Täter'],
        ['Werkzeug', 'fa-screwdriver-wrench', 'Werkzeug'],
        ['Alarmübertragung', 'fa-tower-broadcast', 'Übertragung'],
      ],
      example: r => r['Typische Objekte'] || '',
    },
    {
      match: /WIDERSTANDSKLASSEN|RC-Klasse/i,
      icon: 'fa-stopwatch',
      title: 'RC-Widerstandsklassen · RC 1 – 6',
      sub: 'Wie lange hält Tür/Fenster dem Einbruch stand? (DIN EN 1627)',
      badge: r => r['RC-Klasse'] || '',
      heading: r => (r['Widerstandszeit'] && r['Widerstandszeit'] !== '—') ? '⏱ ' + r['Widerstandszeit'] : 'Kein Zeitwert',
      desc: r => r['Typische Anwendung'] || '',
      facts: [
        ['Tätertyp', 'fa-user-ninja', 'Täter'],
        ['Werkzeuge', 'fa-screwdriver-wrench', 'Werkzeug'],
        ['Verglasung', 'fa-window-maximize', 'Glas'],
      ],
      example: r => r['Empfehlung'] || '',
    },
  ];

  function detailDrawer(cfg, row, headers, color) {
    const body = el('div', { class: 'kk-detail' });
    body.appendChild(el('div', { class: 'kk-detail-hero', style: `--lv:${color}` }, [
      el('div', { class: 'kk-detail-badge', text: cfg.badge(row) }),
      el('div', { class: 'kk-detail-htext' }, [
        el('div', { class: 'kk-detail-risk', text: cfg.heading(row) }),
        cfg.desc(row) ? el('div', { class: 'kk-detail-desc', text: cfg.desc(row) }) : null,
      ]),
    ]));
    const grid = el('div', { class: 'kv-grid' });
    headers.forEach(h => {
      const v = row[h];
      if (!v) return;
      grid.append(el('div', { class: 'k', text: h }), el('div', { class: 'v', text: v }));
    });
    body.appendChild(grid);
    drawer((row['Sicherungsklasse'] || row['EMA-Grad'] || row['RC-Klasse'] || 'Klasse'), body);
  }

  function section(cfg, tbl) {
    const headers = tbl.header.filter(h => h);
    const rows = tbl.rows;
    const sec = el('section', { class: 'kk-section' });
    sec.appendChild(el('div', { class: 'kk-sec-head' }, [
      el('div', { class: 'kk-sec-ico', html: `<i class="fas ${cfg.icon}"></i>` }),
      el('div', {}, [
        el('h3', { text: cfg.title }),
        el('div', { class: 'kk-sec-sub', text: cfg.sub }),
      ]),
      el('span', { class: 'kk-sec-count', text: rows.length + ' Klassen' }),
    ]));

    const grid = el('div', { class: 'kk-grid' });
    rows.forEach((r, i) => {
      const color = lvColor(i, rows.length);
      const tile = el('button', { class: 'kk-tile', style: `--lv:${color}`, type: 'button' });
      // Kopf: Badge + Risiko-Punkte
      const dots = el('div', { class: 'kk-dots' });
      for (let k = 0; k < rows.length; k++) dots.appendChild(el('span', { class: 'kk-dot' + (k <= i ? ' on' : '') }));
      tile.appendChild(el('div', { class: 'kk-top' }, [
        el('div', { class: 'kk-badge', text: cfg.badge(r) }),
        dots,
      ]));
      tile.appendChild(el('div', { class: 'kk-risk', text: cfg.heading(r) }));
      if (cfg.desc(r)) tile.appendChild(el('div', { class: 'kk-desc', text: cfg.desc(r) }));

      const facts = el('div', { class: 'kk-facts' });
      cfg.facts.forEach(([key, ic, short]) => {
        const v = r[key];
        if (!v) return;
        facts.appendChild(el('div', { class: 'kk-fact' }, [
          el('span', { class: 'kk-fact-l', html: `<i class="fas ${ic}"></i> ${short}` }),
          el('span', { class: 'kk-fact-v', text: v }),
        ]));
      });
      tile.appendChild(facts);

      const ex = cfg.example(r);
      if (ex) tile.appendChild(el('div', { class: 'kk-ex' }, [
        el('i', { class: 'fas fa-location-dot' }),
        el('span', { text: ex }),
      ]));
      tile.appendChild(el('div', { class: 'kk-more', html: 'Alle Details <i class="fas fa-arrow-right"></i>' }));

      tile.addEventListener('click', () => detailDrawer(cfg, r, headers, color));

      // Notizbuch-Pin oben rechts (überlagert die Kachel, eigener Klick)
      if (window.NOTEBOOK) {
        const item = {
          id: 'class-' + cfg.id + '-' + (cfg.badge(r) || ('row-' + i)).replace(/\s+/g, '-'),
          kind: 'class', kicker: cfg.title, badge: cfg.badge(r),
          title: cfg.heading(r), summary: cfg.desc(r) || '',
          beispiel: cfg.example(r) ? 'Beispiel-Objekte: ' + cfg.example(r) : null,
          tags: [], accent: color,
        };
        const pin = NOTEBOOK.pinBtn(item, { size: 'sm' });
        pin.classList.add('kk-pin');
        tile.appendChild(pin);
      }
      grid.appendChild(tile);
    });
    sec.appendChild(grid);
    return sec;
  }

  function render(d) {
    const wrap = el('div', { class: 'kk-wrap' });
    if (!d || !d.sicherungsklassen || !d.sicherungsklassen.tables) return wrap;
    d.sicherungsklassen.tables.forEach(tbl => {
      const cfg = CONFIGS.find(c => c.match.test(tbl.title || ''));
      if (cfg) {
        try { wrap.appendChild(section(cfg, tbl)); } catch (e) { /* Daten unerwartet → überspringen */ }
      }
    });
    return wrap;
  }

  return { render };
})();
