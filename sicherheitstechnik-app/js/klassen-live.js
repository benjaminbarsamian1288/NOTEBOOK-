/* Klassen Live: SÜ, EMA-Grade und RC-Klassen richtig übersichtlich,
   mit großen interaktiven Karten, Live-Animationen und einem „Tür-Test".
   window.KLASSEN_LIVE.view(d). */
window.KLASSEN_LIVE = (() => {
  const { el } = U;

  function loop(canvas, draw) {
    function f() { if (!canvas.isConnected) return; draw(); requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }
  const numOf = s => { const m = (s || '').match(/\d+/); return m ? +m[0] : 0; };

  /* ---------- Daten-Helfer: Klassen-Konfig ---------- */
  const CFG = [
    {
      key: 'sue', match: /Sicherungsklass/i, label: 'VdS-Sicherungsklassen', short: 'SÜ',
      norm: 'VdS 2333', icon: 'fa-medal', lead: 'Welches Schutzniveau braucht das Objekt?',
      badge: r => (r['Sicherungsklasse'] || '').split('/')[0].trim(),
      title: r => r['Risikograd'] || '',
      desc:  r => r['Beschreibung'] || '',
      ex:    r => r['Beispiel-Objekte'] || '',
      facts: [
        ['EMA-Grad (EN 50131)', 'fa-bell',          'EMA-Grad'],
        ['Min. RC-Tür',         'fa-door-closed',   'Min. Tür'],
        ['Min. Verglasung',     'fa-window-maximize','Glas'],
        ['NSL-Aufschaltung',    'fa-tower-broadcast','NSL'],
        ['Empf. Intervention',  'fa-truck-medical', 'Intervention'],
        ['Versicherung',        'fa-shield-halved', 'Versicherung'],
      ],
      // Bild-Komponenten der Mini-Szene: Türstärke, Alarm-Wellen, NSL-Punkt, Personen
      scene: (r, idx, total) => ({
        type: 'object', strength: idx / Math.max(1, total - 1),
        alarm: /grad\s*[1234]/i.test(r['EMA-Grad (EN 50131)'] || '') ? (numOf(r['EMA-Grad (EN 50131)']) || 0) : 0,
        nsl:   !/optional|nein/i.test(r['NSL-Aufschaltung'] || '') && r['NSL-Aufschaltung'],
      }),
    },
    {
      key: 'ema', match: /EMA-SICHERHEITSGRADE|EMA-Grad/i, label: 'EMA-Sicherheitsgrade', short: 'Grad',
      norm: 'DIN EN 50131-1', icon: 'fa-bell', lead: 'Gegen welchen Täter schützt die Alarmanlage?',
      badge: r => { const m = (r['EMA-Grad'] || '').match(/Grad\s*\d/i); return m ? m[0] : (r['EMA-Grad'] || ''); },
      title: r => { const p = (r['EMA-Grad'] || '').split('–')[1]; return (p ? p.trim() : '') || r['Risikostufe'] || ''; },
      desc:  r => r['Bemerkung'] || '',
      ex:    r => r['Typische Objekte'] || '',
      facts: [
        ['Tätertyp',         'fa-user-ninja',        'Täter'],
        ['Täter-Kenntnisse', 'fa-brain',             'Kenntnisse'],
        ['Werkzeug',         'fa-screwdriver-wrench','Werkzeug'],
        ['Sabotage-Schutz',  'fa-shield-halved',     'Sabotage'],
        ['Alarmübertragung', 'fa-tower-broadcast',   'Übertragung'],
        ['Richtpreis EMA-System', 'fa-euro-sign',    'Preis'],
      ],
      scene: (r, idx, total) => ({
        type: 'alarm', strength: idx / Math.max(1, total - 1),
        alarm: idx + 1, dual: /dual|3-fach|redundant/i.test(r['Alarmübertragung'] || ''),
      }),
    },
    {
      key: 'rc', match: /WIDERSTANDSKLASSEN|RC-Klasse/i, label: 'RC-Widerstandsklassen', short: 'RC',
      norm: 'DIN EN 1627', icon: 'fa-stopwatch', lead: 'Wie lange hält die Tür dem Einbrecher stand?',
      badge: r => r['RC-Klasse'] || '',
      title: r => (r['Widerstandszeit'] && r['Widerstandszeit'] !== '—') ? r['Widerstandszeit'] : 'Kein Zeitwert',
      desc:  r => r['Typische Anwendung'] || '',
      ex:    r => r['Empfehlung'] || '',
      facts: [
        ['Tätertyp',     'fa-user-ninja',        'Täter'],
        ['Werkzeuge',    'fa-screwdriver-wrench','Werkzeug'],
        ['Verglasung',   'fa-window-maximize',   'Glas'],
        ['Polizei-Empf.','fa-shield-halved',     'Polizei'],
        ['Richtpreis Tür (€)', 'fa-door-closed', 'Tür-Preis'],
        ['Richtpreis Fenster (€)', 'fa-window-restore', 'Fenster-Preis'],
      ],
      scene: (r, idx, total) => ({
        type: 'door', strength: idx / Math.max(1, total - 1),
        minutes: numOf(r['Widerstandszeit']),
        // Werkzeug-Eskalation: körperliche Gewalt → Schraubendreher → Brecheisen → Säge → Winkelschleifer
        tool: ['👊', '🪛', '🛠', '🪓', '🪚', '⚙', '⚡'][Math.min(idx, 6)],
      }),
    },
  ];

  function lvColor(idx, count) {
    const hue = Math.round(140 - (idx / Math.max(1, count - 1)) * 140);
    return `hsl(${hue} 70% 50%)`;
  }

  /* ---------- Animation: Mini-Szene pro Klasse (Tür/Alarm/Objekt) ---------- */
  function scene(scene, color, active) {
    const W = 220, H = 220, c = el('canvas', { class: 'kl-scene', width: W, height: H }), ctx = c.getContext('2d');
    let t = 0, breach = 0, hit = 0;
    function reset() { breach = 0; hit = 0; }
    function draw() {
      t += 0.04;
      ctx.clearRect(0, 0, W, H);
      // Hintergrund
      const grd = ctx.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, 130);
      grd.addColorStop(0, '#101a2e'); grd.addColorStop(1, '#070b15');
      ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);

      const cx = W / 2, cy = H / 2 + 8;
      // Boden
      ctx.fillStyle = '#1e293b'; ctx.fillRect(0, H - 22, W, 22);
      ctx.strokeStyle = '#334155'; ctx.beginPath(); ctx.moveTo(0, H - 22); ctx.lineTo(W, H - 22); ctx.stroke();

      // Periodischer „Angriff": jede ~ (minutes * 0.3) Sekunden
      const period = Math.max(2.4, (scene.minutes || 1) * 0.5);
      breach += 1 / (period * 60);
      const broken = breach >= 1;
      if (breach >= 1.3) reset();

      if (scene.type === 'door') {
        // Tür
        const dw = 78, dh = 130, dx = cx - dw / 2, dy = H - 22 - dh;
        // Türrahmen
        ctx.fillStyle = '#7c5018'; ctx.fillRect(dx - 6, dy - 6, dw + 12, dh + 6);
        // Türblatt
        ctx.fillStyle = broken ? '#3b1010' : '#3a2a18'; ctx.fillRect(dx, dy, dw, dh);
        ctx.strokeStyle = '#7c5018'; ctx.lineWidth = 3; ctx.strokeRect(dx, dy, dw, dh);
        // Beschläge: je höher die Klasse, desto mehr Schrauben/Bänder
        const screws = 2 + Math.round(scene.strength * 6);
        ctx.fillStyle = '#9ca3af';
        for (let i = 0; i < screws; i++) {
          const yy = dy + 12 + i * ((dh - 24) / Math.max(1, screws - 1));
          ctx.beginPath(); ctx.arc(dx + 8, yy, 2.5, 0, 7); ctx.fill();
          ctx.beginPath(); ctx.arc(dx + dw - 8, yy, 2.5, 0, 7); ctx.fill();
        }
        // Türknauf
        ctx.fillStyle = '#cbd5e1'; ctx.beginPath(); ctx.arc(dx + dw - 14, dy + dh / 2, 5, 0, 7); ctx.fill();
        // Widerstands-Schild schrumpft
        const shieldH = dh * Math.max(0, 1 - Math.min(1, breach));
        ctx.fillStyle = broken ? 'rgba(239,68,68,0.55)' : 'rgba(34,197,94,0.30)';
        ctx.fillRect(dx, dy + (dh - shieldH), dw, shieldH);
        // Einbrecher links
        ctx.font = '36px sans-serif'; ctx.textAlign = 'center';
        const ninjaY = dy + dh / 2 + 8;
        ctx.fillText('🥷', cx - 70, ninjaY);
        // Werkzeug haut zu
        hit = broken ? 0 : Math.abs(Math.sin(t * 6)) * 14;
        ctx.font = '28px sans-serif'; ctx.fillText(scene.tool || '🔨', cx - 30 + hit, ninjaY + 4);
        // Splitter bei Durchbruch
        if (broken) {
          ctx.fillStyle = '#ef4444'; ctx.font = '34px sans-serif'; ctx.fillText('💥', dx + dw / 2, dy + dh / 2 + 10);
        }
        // Widerstandszeit oben
        ctx.fillStyle = '#fbbf24'; ctx.font = '900 18px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('⏱ ' + (scene.minutes ? scene.minutes + ' Min' : '—'), 12, 24);
        ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif';
        ctx.fillText(broken ? 'durchbrochen' : 'hält stand…', 12, 40);
      } else if (scene.type === 'alarm') {
        // Zentrale mit Sirene
        const bx = cx - 25, by = H - 22 - 70;
        ctx.fillStyle = '#0f172a'; ctx.strokeStyle = color; ctx.lineWidth = 3;
        ctx.fillRect(bx, by, 50, 60); ctx.strokeRect(bx, by, 50, 60);
        // Sirene oben
        const al = Math.abs(Math.sin(t * 4));
        ctx.fillStyle = `rgba(239,68,68,${0.4 + al * 0.6})`;
        ctx.beginPath(); ctx.arc(cx, by - 4, 7, 0, 7); ctx.fill();
        // Schall-Wellen (Anzahl = EMA-Grad)
        ctx.strokeStyle = color; ctx.lineWidth = 2;
        for (let i = 1; i <= scene.alarm; i++) {
          const r = 18 + i * 13 + (Math.sin(t * 3 + i) * 3);
          ctx.globalAlpha = 0.5 - i * 0.08;
          ctx.beginPath(); ctx.arc(cx, by - 4, r, -Math.PI * 0.9, -Math.PI * 0.1); ctx.stroke();
        }
        ctx.globalAlpha = 1;
        // NSL-Antenne bei höheren Graden
        if (scene.alarm >= 3) {
          ctx.strokeStyle = '#22d3ee';
          ctx.beginPath(); ctx.moveTo(cx + 30, by + 20); ctx.lineTo(W - 24, 30); ctx.stroke();
          ctx.fillStyle = '#22d3ee'; ctx.beginPath(); ctx.arc(W - 24, 30, 5, 0, 7); ctx.fill();
          if (scene.dual) {
            ctx.beginPath(); ctx.moveTo(cx + 30, by + 30); ctx.lineTo(W - 24, 60); ctx.stroke();
            ctx.beginPath(); ctx.arc(W - 24, 60, 4, 0, 7); ctx.fill();
          }
        }
        // Täter symbolisch
        ctx.font = '34px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('🥷', 32, by + 50);
        // Grad-Label
        ctx.fillStyle = '#fbbf24'; ctx.font = '900 18px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('Grad ' + scene.alarm, 12, 24);
      } else {
        // SÜ-Objekt: Haus mit Schild
        const hx = cx - 50, hy = H - 22 - 90, hw = 100, hh = 70;
        ctx.fillStyle = '#1e293b'; ctx.fillRect(hx, hy, hw, hh);
        ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.strokeRect(hx, hy, hw, hh);
        // Dach
        ctx.fillStyle = color; ctx.beginPath();
        ctx.moveTo(hx - 6, hy); ctx.lineTo(hx + hw / 2, hy - 26); ctx.lineTo(hx + hw + 6, hy); ctx.closePath(); ctx.fill();
        // Tür
        ctx.fillStyle = '#0b1424'; ctx.fillRect(hx + hw / 2 - 8, hy + hh - 26, 16, 26);
        // Fenster
        ctx.fillStyle = 'rgba(34,211,238,0.4)';
        ctx.fillRect(hx + 12, hy + 14, 18, 18);
        ctx.fillRect(hx + hw - 30, hy + 14, 18, 18);
        // Schutz-Schild (pulsiert)
        const pulse = 1 + Math.sin(t * 2) * 0.05;
        ctx.save(); ctx.translate(cx + 60, hy + 4); ctx.scale(pulse, pulse);
        ctx.fillStyle = color; ctx.font = '32px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('🛡', 0, 0);
        // Sterne (gefüllt = Schutzniveau)
        const stars = Math.round(scene.strength * 5) + 1;
        for (let i = 0; i < 6; i++) {
          ctx.fillStyle = i < stars ? '#fbbf24' : '#334155';
          ctx.font = '12px sans-serif'; ctx.fillText('★', -30 + i * 12, 22);
        }
        ctx.restore();
        // NSL-Indikator
        if (scene.nsl && !/optional|nein/i.test(String(scene.nsl))) {
          ctx.fillStyle = '#22d3ee'; ctx.font = '14px sans-serif'; ctx.textAlign = 'left';
          ctx.fillText('📡 NSL', 12, 24);
        }
      }
      // Decoration: aktiv-Glow
      if (active) {
        ctx.save();
        ctx.strokeStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 20;
        ctx.lineWidth = 2; ctx.strokeRect(2, 2, W - 4, H - 4);
        ctx.restore();
      }
    }
    loop(c, draw);
    return c;
  }

  /* ---------- Pyramide: alle Klassen einer Norm nebeneinander ---------- */
  function pyramid(rows, cfg, onClick) {
    const wrap = el('div', { class: 'kl-pyr' });
    const grid = el('div', { class: 'kl-pyr-grid' });
    rows.forEach((r, i) => {
      const color = lvColor(i, rows.length);
      const cell = el('button', { class: 'kl-pyr-cell', style: `--lv:${color}`, type: 'button' });
      const heightPct = 30 + (i / Math.max(1, rows.length - 1)) * 70;
      const bar = el('div', { class: 'kl-pyr-bar' });
      bar.style.height = heightPct + '%';
      bar.style.background = color;
      cell.appendChild(bar);
      cell.appendChild(el('div', { class: 'kl-pyr-badge', text: cfg.badge(r) }));
      cell.appendChild(el('div', { class: 'kl-pyr-lbl', text: cfg.title(r).split(' ')[0] }));
      cell.addEventListener('click', () => onClick(i));
      grid.appendChild(cell);
    });
    wrap.appendChild(grid);
    wrap.appendChild(el('div', { class: 'kl-pyr-axis' }, [
      el('span', { text: '← gering' }),
      el('span', { text: 'hoch →' }),
    ]));
    return wrap;
  }

  /* ---------- Big Card: detaillierte Folie pro Klasse ---------- */
  function bigCard(cfg, rows, idx) {
    const r = rows[idx]; const color = lvColor(idx, rows.length);
    const card = el('div', { class: 'kl-big', style: `--lv:${color}` });
    // Linker Bereich: Animation + Badge
    const left = el('div', { class: 'kl-big-l' });
    left.appendChild(scene(cfg.scene(r, idx, rows.length), color, true));
    const dots = el('div', { class: 'kl-big-dots' });
    for (let k = 0; k < rows.length; k++) {
      const d = el('span', { class: 'kl-big-dot' + (k <= idx ? ' on' : '') });
      d.style.background = k <= idx ? color : '#1e293b';
      dots.appendChild(d);
    }
    left.appendChild(dots);
    left.appendChild(el('div', { class: 'kl-big-badge', text: cfg.badge(r) }));
    left.appendChild(el('div', { class: 'kl-big-norm', text: cfg.norm }));
    card.appendChild(left);
    // Rechter Bereich: Titel, Beschreibung, Fakten
    const right = el('div', { class: 'kl-big-r' });
    right.appendChild(el('div', { class: 'kl-big-kicker', text: cfg.label + ' · Stufe ' + (idx + 1) + ' / ' + rows.length }));
    right.appendChild(el('h2', { class: 'kl-big-title', text: cfg.title(r) }));
    if (cfg.desc(r)) right.appendChild(el('p', { class: 'kl-big-desc', text: cfg.desc(r) }));
    const facts = el('div', { class: 'kl-big-facts' });
    cfg.facts.forEach(([key, ic, lbl]) => {
      const v = r[key]; if (!v) return;
      facts.appendChild(el('div', { class: 'kl-big-fact' }, [
        el('span', { class: 'kl-big-fact-l', html: `<i class="fas ${ic}"></i> ${lbl}` }),
        el('span', { class: 'kl-big-fact-v', text: v }),
      ]));
    });
    right.appendChild(facts);
    const ex = cfg.ex(r);
    if (ex) right.appendChild(el('div', { class: 'kl-big-ex' }, [
      el('span', { class: 'kl-big-ex-l', html: '<i class="fas fa-location-dot"></i> Typische Objekte' }),
      el('span', { class: 'kl-big-ex-v', text: ex }),
    ]));
    // Notebook-Pin
    if (window.NOTEBOOK) {
      right.appendChild(NOTEBOOK.pinBtn({
        id: 'class-live-' + cfg.key + '-' + (cfg.badge(r) || idx).toString().replace(/\s+/g, '-'),
        kind: 'class', kicker: cfg.label, badge: cfg.badge(r),
        title: cfg.title(r), summary: cfg.desc(r) || '',
        beispiel: ex ? 'Typische Objekte: ' + ex : null, tags: [], accent: color,
      }, { size: 'sm' }));
    }
    card.appendChild(right);
    return card;
  }

  /* ---------- Alle Klassen als Vergleich ---------- */
  function compareGrid(cfg, rows, onClick) {
    const wrap = el('div', { class: 'kl-cmp' });
    rows.forEach((r, i) => {
      const color = lvColor(i, rows.length);
      const tile = el('button', { class: 'kl-cmp-tile', style: `--lv:${color}`, type: 'button' });
      tile.appendChild(scene(cfg.scene(r, i, rows.length), color, false));
      tile.appendChild(el('div', { class: 'kl-cmp-badge', text: cfg.badge(r) }));
      tile.appendChild(el('div', { class: 'kl-cmp-title', text: cfg.title(r) }));
      const ex = cfg.ex(r);
      if (ex) tile.appendChild(el('div', { class: 'kl-cmp-ex', text: ex }));
      tile.addEventListener('click', () => onClick(i));
      wrap.appendChild(tile);
    });
    return wrap;
  }

  /* ---------- Hauptview ---------- */
  function view(d) {
    const root = el('div', { class: 'kl-wrap' });
    root.appendChild(el('div', { class: 'view-head' }, [
      el('span', { class: 'crumb', text: 'Technik · Klassen' }),
      el('h1', { text: '🛡 Klassen Live · SÜ · EMA-Grade · RC' }),
      el('p', { text: 'Drei Normen, eine Ansicht. Tippe oben den Bereich, ziehe am Schieber und sieh, wie die Tür bei höherer Klasse dem Einbrecher länger standhält.' }),
    ]));

    if (!d || !d.sicherungsklassen || !d.sicherungsklassen.tables) return root;

    // Daten je Konfig sammeln
    const decks = CFG.map(cfg => {
      const tbl = d.sicherungsklassen.tables.find(t => cfg.match.test(t.title || ''));
      return tbl ? { cfg, rows: tbl.rows } : null;
    }).filter(Boolean);
    if (!decks.length) return root;

    let activeIdx = 0;          // welche Norm
    let activeRow = decks[0].rows.length >= 3 ? 2 : 0; // welche Klasse

    // Norm-Tabs
    const tabs = el('div', { class: 'kl-tabs' });
    decks.forEach((dk, i) => {
      const b = el('button', { class: 'kl-tab' + (i === activeIdx ? ' on' : ''), type: 'button' });
      b.innerHTML = `<i class="fas ${dk.cfg.icon}"></i>
        <div><strong>${dk.cfg.label}</strong>
        <span>${dk.cfg.norm} · ${dk.rows.length} Klassen</span></div>`;
      b.addEventListener('click', () => {
        activeIdx = i; activeRow = Math.min(activeRow, decks[i].rows.length - 1);
        tabs.querySelectorAll('.kl-tab').forEach((x, j) => x.classList.toggle('on', j === i));
        refresh();
      });
      tabs.appendChild(b);
    });
    root.appendChild(tabs);

    // Lead-Text + Pyramide
    const headBox = el('div', { class: 'kl-head' });
    root.appendChild(headBox);

    // Big-Card-Bereich
    const stage = el('div', { class: 'kl-stage' });
    root.appendChild(stage);

    // Schieber
    const sliderBox = el('div', { class: 'kl-slider-box' });
    root.appendChild(sliderBox);

    // Vergleichs-Grid
    const cmpHead = el('div', { class: 'kl-cmp-head' });
    root.appendChild(cmpHead);
    const cmpHost = el('div'); root.appendChild(cmpHost);

    // Hilfe-Hinweis
    const help = el('div', { class: 'kl-help' });
    help.innerHTML = `<b>Wie lese ich das?</b>
      <ul>
        <li><b>Stufe = Schutzniveau.</b> Je höher die Klasse, desto besser der Schutz – aber auch teurer.</li>
        <li><b>RC-Tür ⏱:</b> Wie lange hält die Tür einem Einbruch stand (z.B. RC 3 = 5 Minuten).</li>
        <li><b>EMA-Grad 🔔:</b> Gegen welchen Tätertyp die Alarmanlage schützt (1 = Gelegenheit, 4 = Profi).</li>
        <li><b>SÜ 🛡:</b> Gesamt-Schutzniveau des Objekts – kombiniert Mechanik + Alarm + NSL.</li>
      </ul>`;
    root.appendChild(help);

    function refresh() {
      const { cfg, rows } = decks[activeIdx];
      activeRow = Math.min(activeRow, rows.length - 1);

      headBox.innerHTML = '';
      headBox.appendChild(el('div', { class: 'kl-lead' }, [
        el('div', { class: 'kl-lead-ic', html: `<i class="fas ${cfg.icon}"></i>` }),
        el('div', {}, [
          el('h2', { text: cfg.label }),
          el('p', { text: cfg.lead + '  ·  ' + cfg.norm + ' · ' + rows.length + ' Stufen' }),
        ]),
      ]));
      headBox.appendChild(pyramid(rows, cfg, i => { activeRow = i; refresh(); }));

      stage.innerHTML = '';
      stage.appendChild(bigCard(cfg, rows, activeRow));

      sliderBox.innerHTML = '';
      const sl = el('input', { type: 'range', min: '0', max: String(rows.length - 1), step: '1', value: String(activeRow), class: 'kl-slider' });
      sl.addEventListener('input', () => { activeRow = +sl.value; refresh(); });
      sliderBox.appendChild(el('label', { text: 'Klasse wählen:' }));
      sliderBox.appendChild(sl);
      sliderBox.appendChild(el('span', { class: 'kl-slider-val', text: cfg.badge(rows[activeRow]) }));

      cmpHead.innerHTML = '';
      cmpHead.appendChild(el('h3', { class: 'kl-cmp-h', html: `<i class="fas fa-table-cells-large"></i> Alle ${rows.length} ${cfg.short}-Klassen im Vergleich` }));
      cmpHead.appendChild(el('p', { class: 'kl-cmp-sub', text: 'Tippe eine Kachel, um sie groß zu sehen.' }));

      cmpHost.innerHTML = '';
      cmpHost.appendChild(compareGrid(cfg, rows, i => { activeRow = i; refresh(); window.scrollTo({ top: stage.offsetTop - 80, behavior: 'smooth' }); }));
    }

    refresh();
    return root;
  }

  return { view };
})();
