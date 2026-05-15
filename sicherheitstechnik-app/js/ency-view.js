/* Encyclopedia view: Aktiv vs Passiv + Filter + Detail-Drawer */
window.ENCYVIEW = (() => {
  const { el, drawer } = U;

  function view(d) {
    const root = el('div');
    root.appendChild(el('div', { class:'view-head' }, [
      el('span', { class:'crumb', text:'Wissensbasis · Detektion' }),
      el('h1', { text:'Melder-Enzyklopädie' }),
      el('p', { text: ENCY.list.length + ' Detektoren mit Physik, Wirkprinzip, Stärken, Schwächen und typischen Fehlalarmquellen. Klassifiziert nach Aktiv / Passiv / Hybrid.' })
    ]));

    // Aktiv vs Passiv intro
    const ap = el('div', { class:'activepassive' });
    const passiv = el('div', { class:'apcard passiv' });
    passiv.innerHTML = `
      <div class="h">
        <div class="glyph"><i class="fas fa-arrow-down-to-bracket"></i></div>
        <div>
          <h3>Passive Melder</h3>
          <div class="sub">Empfangen nur · Senden nichts</div>
        </div>
      </div>
      <div class="ap-icon-passiv"></div>
      <ul>
        <li><strong>Physik:</strong> Reagieren auf externe Reize (Wärme, Schall, Druck, Vibration)</li>
        <li><strong>Sender?</strong> Nein – emittieren keine Strahlung</li>
        <li><strong>Vorteile:</strong> Unauffällig, geringer Stromverbrauch, schwer zu detektieren</li>
        <li><strong>Beispiele:</strong> PIR-Melder, Magnetkontakt, Glasbruch (akustisch), Druckmatte, Erschütterungsmelder, Thermalkamera</li>
      </ul>`;
    const aktiv = el('div', { class:'apcard aktiv' });
    aktiv.innerHTML = `
      <div class="h">
        <div class="glyph"><i class="fas fa-tower-broadcast"></i></div>
        <div>
          <h3>Aktive Melder</h3>
          <div class="sub">Senden + Empfangen</div>
        </div>
      </div>
      <div class="ap-icon-aktiv"><div class="pulse"></div><div class="pulse"></div><div class="pulse"></div></div>
      <ul>
        <li><strong>Physik:</strong> Senden Signal (Wellen, Licht, Feld) und werten Reflexion oder Unterbrechung aus</li>
        <li><strong>Sender?</strong> Ja – Mikrowellen, IR-Pulse, Ultraschall, Laser, elektrostatisches Feld</li>
        <li><strong>Vorteile:</strong> Aktiver Schutz vor Sabotage, präzise Lokalisierung, breite Detektion</li>
        <li><strong>Beispiele:</strong> Mikrowellenmelder, IR-Lichtschranke, Ultraschall, Radar, ASD-Rauchmelder, Kapazitiv-Feldmelder, LiDAR</li>
      </ul>`;
    ap.appendChild(passiv); ap.appendChild(aktiv);
    root.appendChild(ap);

    // Filter
    const fbar = el('div', { class:'filterbar' });
    const types = ['Alle','passiv','aktiv','hybrid'];
    let activeType = 'Alle';
    let activeKat = 'Alle';
    let q = '';

    const typeBar = el('div', { class:'row', style:'gap:6px;' });
    types.forEach(t => {
      const c = el('button', {
        class: 'chip type-chip' + (t!=='Alle'?(' '+t):'') + (t===activeType?' active':''),
        text: t === 'Alle' ? 'Alle Melder' : (t.charAt(0).toUpperCase()+t.slice(1))
      });
      c.addEventListener('click', () => {
        activeType = t;
        typeBar.querySelectorAll('.chip').forEach(x => x.classList.toggle('active', x.textContent===c.textContent));
        rerender();
      });
      typeBar.appendChild(c);
    });
    fbar.appendChild(typeBar);

    const katSet = ['Alle', ...Array.from(new Set(ENCY.list.map(m => m.kat)))];
    const katBar = el('div', { class:'row', style:'gap:6px;' });
    katSet.forEach(k => {
      const c = el('button', { class:'chip'+(k===activeKat?' active':''), text: k });
      c.addEventListener('click', () => {
        activeKat = k;
        katBar.querySelectorAll('.chip').forEach(x => x.classList.toggle('active', x.textContent===c.textContent));
        rerender();
      });
      katBar.appendChild(c);
    });
    fbar.appendChild(katBar);

    const inp = el('input', { class:'input', placeholder:'Filter: PIR, Doppler, Vibration, ...', style:'flex:1; min-width:220px' });
    inp.addEventListener('input', () => { q = inp.value.toLowerCase().trim(); rerender(); });
    fbar.appendChild(inp);

    root.appendChild(fbar);

    const grid = el('div', { class:'ency-grid' });
    root.appendChild(grid);

    function rerender() {
      grid.innerHTML = '';
      const filtered = ENCY.list.filter(m => {
        if (activeType !== 'Alle' && !m.type.toLowerCase().startsWith(activeType)) return false;
        if (activeKat !== 'Alle' && m.kat !== activeKat) return false;
        if (q) {
          const hay = (m.name + ' ' + m.principle + ' ' + m.physik + ' ' + (m.hersteller||[]).join(' ') + ' ' + (m.normen||[]).join(' ')).toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
      if (!filtered.length) {
        grid.appendChild(el('p', { class:'muted', text:'Keine Treffer.' }));
        return;
      }
      filtered.forEach(m => grid.appendChild(card(m)));
    }
    rerender();
    return root;
  }

  function card(m) {
    const typeKey = m.type.toLowerCase().startsWith('passiv') ? 'passiv'
                  : m.type.toLowerCase().startsWith('aktiv') ? 'aktiv'
                  : 'hybrid';
    const c = el('div', { class:'ency-card' });
    c.appendChild(el('div', { class: 'type-badge ' + typeKey, text: typeKey }));
    // Real-looking product photo (SVG render)
    if (window.PHOTOS && PHOTOS.MAP[m.key]) {
      const ph = el('div', { class: 'ency-photo', html: PHOTOS.render(m.key) });
      c.appendChild(ph);
    } else {
      c.appendChild(el('div', { class:'ica', html:`<i class="fas ${m.icon||'fa-wave-square'}"></i>` }));
    }
    c.appendChild(el('div', { class:'kat', text: m.kat }));
    c.appendChild(el('h3', { text: m.name }));
    c.appendChild(el('div', { class:'prinz', text: m.principle }));
    const specs = el('div', { class:'specrow' });
    if (m.range) specs.appendChild(el('span', { class:'pill b', text: m.range }));
    if (m.sue)   specs.appendChild(el('span', { class:'pill', text:'SÜ '+m.sue }));
    if (m.preis) specs.appendChild(el('span', { class:'pill g', text: m.preis }));
    c.appendChild(specs);
    // Video badge if explainer exists
    if (window.EXPL && EXPL.hasExplainer(m.key)) {
      const v = el('div', { class:'video-badge', html:'<i class="fas fa-circle-play"></i> Video' });
      c.appendChild(v);
    }
    c.addEventListener('click', () => openDetail(m));
    return c;
  }

  function openDetail(m) {
    const body = el('div', { class:'ency-detail' });

    // Product photo at the top
    if (window.PHOTOS && PHOTOS.MAP[m.key]) {
      body.appendChild(el('div', { class:'ency-detail-photo', html: PHOTOS.render(m.key) }));
    }

    // Explainer video below the photo
    if (window.EXPL && EXPL.hasExplainer(m.key)) {
      EXPL.player(m.key, body);
    } else if (m.ill && window.ILL && ILL[m.ill]) {
      body.appendChild(el('div', { class:'hero-ill', html: ILL[m.ill]() }));
    }
    const typeKey = m.type.toLowerCase().startsWith('passiv') ? 'passiv'
                  : m.type.toLowerCase().startsWith('aktiv') ? 'aktiv' : 'hybrid';
    body.appendChild(el('div', { class:'row' }, [
      el('span', { class:'pill', text: m.kat }),
      el('span', { class:'pill ' + ({passiv:'w', aktiv:'b', hybrid:'p'}[typeKey]), text: m.type.toUpperCase() }),
      el('span', { class:'pill', text: 'Coverage: ' + m.coverage }),
      el('span', { class:'pill b', text: m.range || '' }),
    ]));

    body.appendChild(el('h3', { text: 'Physikalisches Funktionsprinzip' }));
    body.appendChild(el('p', { text: m.physik }));

    body.appendChild(el('div', { class:'kv-grid mt-12' }, [
      el('div',{class:'k',text:'Sendet'}),      el('div',{class:'v',text: m.sendet || '—'}),
      el('div',{class:'k',text:'Coverage'}),    el('div',{class:'v',text: m.coverage}),
      el('div',{class:'k',text:'Reichweite'}),  el('div',{class:'v',text: m.range}),
      el('div',{class:'k',text:'Zone(n)'}),     el('div',{class:'v',text: (m.zone||[]).map(z=>'Zone '+z).join(', ')}),
      el('div',{class:'k',text:'Montage'}),     el('div',{class:'v',text: m.montage || '—'}),
      el('div',{class:'k',text:'Normen'}),      el('div',{class:'v'}, (m.normen||[]).map(n => el('span',{class:'pill b', style:'margin-right:4px', text:n}))),
      el('div',{class:'k',text:'SÜ-Klasse'}),   el('div',{class:'v',text: m.sue || '—'}),
      el('div',{class:'k',text:'Richtpreis'}),  el('div',{class:'v',text: m.preis || '—'}),
      el('div',{class:'k',text:'Hersteller'}),  el('div',{class:'v hersteller-chips'}, (m.hersteller||[]).map(h => {
        const ch = el('span', { class:'hersteller-chip' });
        ch.innerHTML = `<i class="fas fa-industry"></i> ${h}`;
        return ch;
      })),
    ]));

    if (m.staerken && m.staerken.length) {
      body.appendChild(el('h3', { text: 'Stärken' }));
      const ul = el('ul', { class:'strengths' });
      m.staerken.forEach(s => ul.appendChild(el('li', { text: s })));
      body.appendChild(ul);
    }
    if (m.schwaechen && m.schwaechen.length) {
      body.appendChild(el('h3', { text: 'Schwächen' }));
      const ul = el('ul', { class:'weakness' });
      m.schwaechen.forEach(s => ul.appendChild(el('li', { text: s })));
      body.appendChild(ul);
    }
    if (m.fehlalarm && m.fehlalarm.length) {
      body.appendChild(el('h3', { text: 'Typische Fehlalarmquellen' }));
      const ul = el('ul', { class:'fa' });
      m.fehlalarm.forEach(s => ul.appendChild(el('li', { text: s })));
      body.appendChild(ul);
    }

    drawer(m.name, body);
  }

  function onion3d() {
    const wrap = el('div', { class:'onion3d' });
    wrap.innerHTML = `
      <div class="ring3d"><div class="lbl">Zone 1 · Perimeter</div></div>
      <div class="ring3d"><div class="lbl">Zone 2 · Aussenhaut</div></div>
      <div class="ring3d"><div class="lbl">Zone 3 · Innenraum</div></div>
      <div class="ring3d"><div class="lbl">Zone 4 · Objekt</div></div>
      <div class="core3d">WERT</div>
    `;
    return wrap;
  }

  function isometricHouse() {
    const w = el('div', { class:'iso-wrap' });
    const i = el('div', { class:'iso' });
    i.innerHTML = `
      <div class="ground"></div>
      <div class="fence"></div>
      <div class="pir-cone pir-1"></div>
      <div class="pir-cone pir-2"></div>
      <div class="building"></div>
      <div class="vault"></div>
    `;
    w.appendChild(i);
    return w;
  }

  return { view, onion3d, isometricHouse };
})();
