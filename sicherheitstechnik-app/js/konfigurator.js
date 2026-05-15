/* SÜ-Konfigurator – pick Sicherungsklasse + Objekttyp -> recommended stack with price range
   Built from data/data.json: maps SÜ -> recommended components from preisliste + EMA + perimeter. */

window.KFG = (() => {

  const { el, fmtEUR, pillFor } = U;

  // Recipes per SÜ level (1..6) - what components and quantities (factors per Objekttyp)
  // Factor uses base counts that scale with size hint.
  const RECIPES = {
    1: {
      label: 'SÜ 1 · Geringes Risiko',
      desc: 'Basisschutz für Privatobjekte mit normalem Risiko (Wohnung, Reihenhaus).',
      items: [
        ['EMA', 'Funk-Alarmzentrale', 1],
        ['Melder', 'PIR-Melder Standard', 3],
        ['Melder', 'Magnetkontakt AP', 4],
        ['Brand', 'Optischer Rauchmelder', 3],
        ['EMA', 'Innensirene', 1],
        ['Mech.', 'Sicherheitstür RC 2', 1],
      ]
    },
    2: {
      label: 'SÜ 2 · Mittleres Risiko',
      desc: 'Standardschutz EFH / Büro / kleiner Einzelhandel.',
      items: [
        ['EMA', 'Kleine EMA 8 Zonen', 1],
        ['Melder', 'PIR-Melder Standard', 4],
        ['Melder', 'Magnetkontakt AP', 6],
        ['Melder', 'Passiv akustisch', 2],
        ['Brand', 'Optischer Rauchmelder', 4],
        ['EMA', 'Außensirene + Blitz', 1],
        ['EMA', 'IP-Übertragung', 1],
        ['Mech.', 'Sicherheitstür RC 2', 1],
        ['Mech.', 'Fenster RC 2 + P4A', 4],
      ]
    },
    3: {
      label: 'SÜ 3 · Erhöhtes Risiko',
      desc: 'Erhöhter Schutz für Juwelier, Apotheke, Pelzgeschäft, Waffenhandel.',
      items: [
        ['EMA', 'Mittlere EMA 32 Zonen', 1],
        ['Melder', 'Dualmelder PIR+MW', 5],
        ['Melder', 'Magnetkontakt UP', 6],
        ['Melder', 'Schließblechkontakt', 3],
        ['Melder', 'Aktiv Folie', 6],
        ['Brand', 'Multisensormelder', 5],
        ['EMA', 'Außensirene + Blitz', 1],
        ['EMA', 'IP-Übertragung', 1],
        ['EMA', 'GSM/LTE-Übertragung', 1],
        ['Mech.', 'Sicherheitstür RC 3', 1],
        ['Mech.', 'Fenster RC 3 + P5A', 4],
      ]
    },
    4: {
      label: 'SÜ 4 · Hohes Risiko',
      desc: 'Banken, Spielhallen, Edel-Juweliere – Dual-Path Pflicht.',
      items: [
        ['EMA', 'Große EMA 128+ Zonen', 1],
        ['Melder', 'Dualmelder PIR+MW', 8],
        ['Melder', 'Außen-Dual IP65', 4],
        ['Melder', 'Magnetkontakt UP', 10],
        ['Melder', 'Schließblechkontakt', 5],
        ['Melder', 'Piezo-Melder', 5],
        ['Brand', 'Multisensormelder', 8],
        ['EMA', 'Dual-Path IP+GSM', 1],
        ['EMA', 'Außensirene + Blitz', 2],
        ['Mech.', 'Sicherheitstür RC 4', 2],
        ['Perimeter', 'IR-Lichtschranke außen', 3],
      ]
    },
    5: {
      label: 'SÜ 5 · Sehr hohes Risiko',
      desc: 'KRITIS, Tresorräume, Edelmetallhandel, Rechenzentren.',
      items: [
        ['EMA', 'Große EMA 128+ Zonen', 1],
        ['Melder', 'Dualmelder PIR+MW', 12],
        ['Melder', 'Außen-Dual IP65', 6],
        ['Melder', 'Magnetkontakt UP', 14],
        ['Melder', 'Schließblechkontakt', 8],
        ['Melder', 'Körperschallmelder', 4],
        ['Melder', 'Kapazitiver Feldmelder', 3],
        ['Melder', 'Druckmatte', 2],
        ['Brand', 'Ansaugrauchmelder', 1],
        ['EMA', 'Dual-Path IP+GSM', 1],
        ['Perimeter', 'Thermalkamera + KI', 2],
        ['Perimeter', 'Zaunsensorik mikrophon.', 100],
        ['Mech.', 'Sicherheitstür RC 5', 2],
      ]
    },
    6: {
      label: 'SÜ 6 · Höchstes Risiko',
      desc: 'Militär, KKW, Botschaften, Bunker – staatlicher Schutz.',
      items: [
        ['EMA', 'Große EMA 128+ Zonen', 2],
        ['Melder', 'Dualmelder PIR+MW', 20],
        ['Melder', 'Außen-Dual IP65', 10],
        ['Melder', 'Magnetkontakt UP', 24],
        ['Melder', 'Schließblechkontakt', 14],
        ['Melder', 'Körperschallmelder', 6],
        ['Melder', 'Kapazitiver Feldmelder', 6],
        ['Melder', 'Druckmatte', 4],
        ['Brand', 'Ansaugrauchmelder', 2],
        ['Brand', 'Flammenmelder IR/UV', 2],
        ['EMA', 'Dual-Path IP+GSM', 2],
        ['Perimeter', 'Thermalkamera + KI', 4],
        ['Perimeter', 'Radar', 2],
        ['Perimeter', 'Zaun', 200],
        ['Perimeter', '358 Mesh Anti-Climb', 200],
        ['Perimeter', 'Versenkbare Poller HVM', 4],
        ['Mech.', 'Sicherheitstür RC 6', 4],
      ]
    },
  };

  function exportPDF(d, sue, factor, recipe, totLo, totHi) {
    // Simple printable HTML window – no jsPDF needed
    const items = recipe.items.map(([b,name,q]) => {
      const product = findProduct(d, b, name);
      if (!product) return null;
      const qty = Math.max(1, Math.round(q * factor));
      const lo = +product['Preis von (€)']||0, hi = +product['Preis bis (€)']||lo;
      return { product, qty, lo, hi };
    }).filter(Boolean);
    const win = window.open('', '_blank');
    if (!win) { U.toast('Popup-Blocker aktiv – bitte erlauben'); return; }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>ST-Katalog Konfiguration SÜ ${sue}</title>
      <style>
        body { font-family: -apple-system, system-ui, Arial; padding: 24px; color: #111; }
        h1 { margin: 0 0 4px; color: #0284c7; }
        .meta { color: #555; font-size: 13px; margin-bottom: 18px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
        th, td { border-bottom: 1px solid #ddd; padding: 7px 10px; text-align: left; }
        th { background: #f1f5fb; font-size: 11px; text-transform: uppercase; letter-spacing: .5px; }
        tfoot td { font-weight: 700; }
        .num { text-align: right; font-variant-numeric: tabular-nums; }
      </style></head><body>
      <h1>Sicherheitskonzept · SÜ ${sue}</h1>
      <div class="meta">Skalierung ${factor.toFixed(1)}× · ${new Date().toLocaleDateString('de-DE')} · ${items.length} Positionen</div>
      <table>
        <thead><tr><th>Bereich</th><th>Produkt</th><th class="num">Menge</th><th class="num">Stück (€)</th><th class="num">Summe (€)</th></tr></thead>
        <tbody>
        ${items.map(i => `<tr>
          <td>${i.product['Bereich']}</td>
          <td>${i.product['Produkt']}</td>
          <td class="num">${i.qty} ${i.product['Einheit']||''}</td>
          <td class="num">${i.lo.toLocaleString('de-DE')}–${i.hi.toLocaleString('de-DE')}</td>
          <td class="num">${(i.qty*i.lo).toLocaleString('de-DE')}–${(i.qty*i.hi).toLocaleString('de-DE')}</td>
        </tr>`).join('')}
        </tbody>
        <tfoot><tr><td colspan="4">Investitionsrahmen gesamt</td><td class="num">${totLo.toLocaleString('de-DE')}–${totHi.toLocaleString('de-DE')} €</td></tr></tfoot>
      </table>
      <p style="margin-top:24px; color:#888; font-size:11px;">ST-Katalog · Sicherheitstechnik V4 · Investitionsrahmen, kein Festpreisangebot · ${new Date().toISOString()}</p>
      <script>setTimeout(()=>window.print(), 500);</script>
      </body></html>`;
    win.document.write(html);
    win.document.close();
  }

  function saveProject(sue, factor, lo, hi) {
    let projects = [];
    try { projects = JSON.parse(localStorage.getItem('st-projects') || '[]'); } catch {}
    const name = prompt('Projekt-Name?', `Projekt SÜ ${sue} · ${new Date().toLocaleDateString('de-DE')}`);
    if (!name) return;
    projects.push({ name, sue, factor, lo, hi, ts: Date.now() });
    localStorage.setItem('st-projects', JSON.stringify(projects));
    U.toast(`„${name}" gespeichert`);
  }

  function findProduct(d, bereich, name) {
    return d.preisliste.rows.find(r => r['Bereich']===bereich && r['Produkt'].toLowerCase().includes(name.toLowerCase()))
        || d.preisliste.rows.find(r => r['Produkt'].toLowerCase().includes(name.toLowerCase()));
  }

  let activeSue = 3;
  let sizeFactor = 1.0;
  let lastResult = null;

  function setSue(n, factor) {
    activeSue = +n || 3;
    if (factor) sizeFactor = factor;
  }

  function render(d) {
    const root = el('div');
    root.appendChild(el('div', { class:'view-head' }, [
      el('span', { class:'crumb', text:'Empfehlungs-Engine' }),
      el('h1', { text:'Konfigurator – SÜ-basiertes Sicherheitskonzept' }),
      el('p', { text:'Wähle Sicherungsklasse und Objektgröße. Die Engine schlägt eine vollständige Komponentenliste mit Investitionsrahmen vor.' })
    ]));

    const matrix = el('div', { class: 'matrix' });
    [1,2,3,4,5,6].forEach(n => {
      const c = el('div', { class:'sue'+(n===activeSue?' active':''), dataset: {n} });
      c.appendChild(el('div',{class:'lvl',text:'SÜ '+n}));
      c.appendChild(el('div',{class:'lbl',text:({1:'Wohnen',2:'Standard',3:'Erhöht',4:'Hoch',5:'KRITIS',6:'Staat'})[n]}));
      c.addEventListener('click', () => {
        activeSue = n;
        matrix.querySelectorAll('.sue').forEach(x => x.classList.toggle('active', +x.dataset.n===n));
        update();
      });
      matrix.appendChild(c);
    });
    root.appendChild(matrix);

    // Objektgröße slider
    const sizeRow = el('div', { class: 'card' });
    sizeRow.appendChild(el('div', { class:'card-h' }, [
      el('div', { class:'ico', html:'<i class="fas fa-ruler-combined"></i>' }),
      el('h3', { text:'Objektgröße & Skalierung' })
    ]));
    const slider = el('input', { type:'range', min:'0.5', max:'3', step:'0.1', value:String(sizeFactor), style:'width:100%' });
    const sizeLabel = el('span', { class:'pill b', text:`Faktor ${sizeFactor.toFixed(1)}x` });
    slider.addEventListener('input', () => {
      sizeFactor = +slider.value;
      sizeLabel.textContent = `Faktor ${sizeFactor.toFixed(1)}x`;
      update();
    });
    sizeRow.appendChild(el('div', { class:'row' }, [
      el('span',{class:'muted small',text:'Klein'}),
      slider,
      el('span',{class:'muted small',text:'Groß'}),
      sizeLabel
    ]));
    root.appendChild(sizeRow);

    const result = el('div', { class:'kfg-result' });
    root.appendChild(result);

    // Map Bereich -> visual config (color + icon + optional SVG illustration)
    const BEREICH_META = {
      'EMA':        { color: '#22d3ee', icon: 'fa-bell',         label: 'Alarmanlage' },
      'Melder':     { color: '#fbbf24', icon: 'fa-wave-square',  label: 'Detektoren' },
      'Brand':      { color: '#ef4444', icon: 'fa-fire',         label: 'Brandschutz' },
      'Perimeter':  { color: '#22c55e', icon: 'fa-tower-broadcast', label: 'Perimeter' },
      'Mech.':      { color: '#a78bfa', icon: 'fa-door-closed',  label: 'Mechanik' },
      'Verglasung': { color: '#38bdf8', icon: 'fa-window-maximize', label: 'Verglasung' },
    };

    // Map specific product names to a small SVG illustration key in ILL
    const PRODUCT_ILL = {
      'PIR':       'pir',  'Bewegung': 'pir',
      'Dual':      'dual',
      'Magnet':    'mag',
      'Schließblech':'mag',
      'Glasbruch':'glass','Aktiv Folie':'glass','Passiv':'glass',
      'Erschüt':   'shake','Körperschall':'shake','Piezo':'shake',
      'Mikrowelle':'mw',   'IR':'irBeam','Lichtschranke':'irBeam',
      'Rauch':     'fire', 'Brand':'fire','Multisensor':'fire','Flammen':'fire','Ansaug':'fire',
      'Zaun':      'fence','Thermalkamera':'fence','Radar':'fence',
      'Druckmatte':'press','Wassermelder':'press','Gasmelder':'press','Kapazit':'cap',
    };
    function findIllustration(productName) {
      for (const k of Object.keys(PRODUCT_ILL)) {
        if (productName.toLowerCase().includes(k.toLowerCase())) return PRODUCT_ILL[k];
      }
      return null;
    }

    function update() {
      result.innerHTML = '';
      const recipe = RECIPES[activeSue];
      const totalEl = el('div', { class:'kfg-total' });
      result.appendChild(el('h2', { text: recipe.label, style:'margin:0 0 4px' }));
      result.appendChild(el('p', { class:'muted', text: recipe.desc, style:'margin:0 0 8px' }));
      result.appendChild(totalEl);

      // Pre-compute items grouped by Bereich for visual presentation
      const itemsByBereich = {};
      const flatItems = [];
      let totLo = 0, totHi = 0, n = 0;
      const skipped = [];

      recipe.items.forEach(([bereich, productName, baseQty]) => {
        const qty = Math.max(1, Math.round(baseQty * sizeFactor));
        const product = findProduct(d, bereich, productName);
        if (!product) { skipped.push(productName); return; }
        const lo = +product['Preis von (€)']||0;
        const hi = +product['Preis bis (€)']||lo;
        totLo += lo*qty;
        totHi += hi*qty;
        n += qty;
        const entry = { product, qty, lo, hi, illKey: findIllustration(product['Produkt']) };
        flatItems.push(entry);
        (itemsByBereich[product['Bereich']] = itemsByBereich[product['Bereich']] || []).push(entry);
      });
      totalEl.appendChild(el('span', { class:'price', text: `${fmtEUR(totLo)} – ${fmtEUR(totHi)}` }));
      totalEl.appendChild(el('span', { class:'range', text:`Investitionsrahmen · ${n} Komponenten · Ø ${fmtEUR((totLo+totHi)/2)}` }));

      // Action buttons + SÜ-Klassen Visualisierung
      const acts = el('div', { class: 'row mt-12' });
      const expBtn = el('button', { class:'btn', html:'<i class="fas fa-file-pdf"></i> Als PDF exportieren' });
      expBtn.addEventListener('click', () => exportPDF(d, activeSue, sizeFactor, recipe, totLo, totHi));
      const saveBtn = el('button', { class:'btn ghost', html:'<i class="fas fa-floppy-disk"></i> Projekt speichern' });
      saveBtn.addEventListener('click', () => saveProject(activeSue, sizeFactor, totLo, totHi));
      acts.appendChild(expBtn); acts.appendChild(saveBtn);
      result.appendChild(acts);

      const sueRow = d.sicherungsklassen.tables[0].rows.find(r => r['Sicherungsklasse'].includes('SÜ '+activeSue));
      if (sueRow) {
        const meta = el('div', { class:'row mt-12', style:'gap:8px;flex-wrap:wrap;' }, [
          pillFor(sueRow['EMA-Grad (EN 50131)']),
          pillFor(sueRow['Min. RC-Tür']),
          pillFor(sueRow['Min. Verglasung']),
          el('span', {class:'pill b', text: 'NSL: '+sueRow['NSL-Aufschaltung']}),
          el('span', {class:'pill', text: 'Intervention: '+sueRow['Empf. Intervention']}),
          el('span', {class:'pill p', text: sueRow['Versicherung']||''}),
        ]);
        result.appendChild(meta);
      }

      // ===== Visual recommendation grid grouped by Bereich =====
      const visWrap = el('div', { class: 'kfg-vis mt-16' });
      const orderedBereiche = ['Mech.','Verglasung','Perimeter','Melder','Brand','EMA'];
      orderedBereiche.forEach(b => {
        const list = itemsByBereich[b];
        if (!list || !list.length) return;
        const meta = BEREICH_META[b] || { color: '#94a3c4', icon: 'fa-cube', label: b };
        const sect = el('div', { class: 'kfg-sect' });
        sect.style.setProperty('--sect-color', meta.color);
        // section header
        const head = el('div', { class: 'kfg-secthead' });
        head.innerHTML = `
          <div class="kfg-secticon"><i class="fas ${meta.icon}"></i></div>
          <div class="kfg-secttitle">
            <strong>${meta.label}</strong>
            <div class="muted small">${list.length} Produkt${list.length>1?'e':''} · ${list.reduce((s,it)=>s+it.qty,0)} Stück</div>
          </div>
          <div class="kfg-sectprice">${fmtEUR(list.reduce((s,it)=>s+it.qty*it.lo,0))} – ${fmtEUR(list.reduce((s,it)=>s+it.qty*it.hi,0))}</div>`;
        sect.appendChild(head);
        // cards grid
        const grid = el('div', { class: 'kfg-cardgrid' });
        list.forEach(it => {
          const card = el('div', { class: 'kfg-card' });
          card.style.setProperty('--sect-color', meta.color);
          // mini illustration if available
          if (it.illKey && window.ILL && ILL[it.illKey]) {
            card.appendChild(el('div', { class: 'kfg-cardill', html: ILL[it.illKey]() }));
          } else {
            card.appendChild(el('div', { class: 'kfg-cardill kfg-cardill-empty', html: `<i class="fas ${meta.icon}"></i>` }));
          }
          // body
          const body = el('div', { class: 'kfg-cardbody' });
          body.innerHTML = `
            <div class="kfg-cardtitle">${it.product['Produkt']}</div>
            <div class="kfg-cardmeta">${it.product['Einheit']||''} · ${it.product['Sicherungsklasse']||''}</div>
            <div class="kfg-cardrow">
              <span class="kfg-qty">× ${it.qty}</span>
              <span class="kfg-unitprice muted small">${fmtEUR(it.lo)}–${fmtEUR(it.hi)}</span>
            </div>
            <div class="kfg-subprice">${fmtEUR(it.qty*it.lo)} – ${fmtEUR(it.qty*it.hi)}</div>
          `;
          card.appendChild(body);
          grid.appendChild(card);
        });
        sect.appendChild(grid);
        visWrap.appendChild(sect);
      });
      result.appendChild(visWrap);

      if (skipped.length) {
        result.appendChild(el('p', { class:'muted small mt-12', text:`Hinweis: ${skipped.length} Position(en) nicht in Preisliste hinterlegt (${skipped.join(', ')}).`}));
      }
    }
    update();
    return root;
  }

  return { render, setSue, getLastResult: () => lastResult };
})();
