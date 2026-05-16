/* Mechanik-Enzyklopädie · View
   Karten-Grid · Filter · Suche · Detail-Drawer · Vergleichs-Modus */

window.MECH_ENCY_VIEW = (() => {
  const { el } = U;

  const KAT_COLORS = {
    'Türen':       { c:'#7c3aed', icon:'fa-door-closed' },
    'Fenster':     { c:'#0891b2', icon:'fa-window-maximize' },
    'Verglasung':  { c:'#22d3ee', icon:'fa-layer-group' },
    'Tresore':     { c:'#a855f7', icon:'fa-vault' },
    'Zäune':       { c:'#22c55e', icon:'fa-border-all' },
    'Tore':        { c:'#0891b2', icon:'fa-grip-lines-vertical' },
    'Poller':      { c:'#ea580c', icon:'fa-circle-stop' },
    'Beschläge':   { c:'#3b82f6', icon:'fa-key' },
  };

  function view(d) {
    const root = el('div');

    // Hero
    const hero = el('div', { class:'mency-hero' });
    hero.innerHTML = `
      <div class="mency-hero-bg"></div>
      <div class="mency-hero-content">
        <div class="mency-tag">MECHANISCHE SICHERHEIT · ENZYKLOPÄDIE</div>
        <h1>Alle Komponenten · Bilder · Animationen · Hersteller</h1>
        <p>
          ${MECH_ENCY.LIST.length} mechanische Sicherheits-Komponenten — von der RC2-Wohnungstür bis zum
          Klasse-VI-Tresor, vom K12-Anti-Ram-Poller bis zum BR7-Beschussglas.
          Mit Klassen, Normen, Herstellern, Angriffsszenarien.
        </p>
        <div class="mency-hero-stats">
          <div><strong>${MECH_ENCY.LIST.length}</strong><span>Komponenten</span></div>
          <div><strong>8</strong><span>Kategorien</span></div>
          <div><strong>RC1N — RC6</strong><span>Türen/Fenster</span></div>
          <div><strong>Klasse 0 — VI</strong><span>Tresore</span></div>
        </div>
      </div>
    `;
    root.appendChild(hero);

    // Aktiv vs Passiv Intro
    const ap = el('div', { class:'mency-ap' });
    ap.innerHTML = `
      <div class="mency-ap-card passiv">
        <div class="mency-ap-head">
          <div class="mency-ap-icon"><i class="fas fa-shield-halved"></i></div>
          <div><h3>Passive Komponenten</h3><span>Verhindern statisch durch Konstruktion</span></div>
        </div>
        <p>Türen, Fenster, Tresore, Glas, Zäune — sie <strong>halten still</strong> und widerstehen Werkzeugangriffen. Klassifiziert über <strong>Widerstandszeit</strong> (RU, WS, K-Klasse).</p>
        <div class="mency-ap-examples">
          <span class="mency-ap-chip">RC2-Tür</span>
          <span class="mency-ap-chip">P4A-Glas</span>
          <span class="mency-ap-chip">Klasse-I-Tresor</span>
          <span class="mency-ap-chip">Doppelstabmatte</span>
        </div>
      </div>
      <div class="mency-ap-card aktiv">
        <div class="mency-ap-head">
          <div class="mency-ap-icon"><i class="fas fa-bolt"></i></div>
          <div><h3>Aktive Komponenten</h3><span>Reagieren oder bewegen sich elektrisch</span></div>
        </div>
        <p>Versenkbare Poller, Schleusen, Drehkreuze, Elektrozäune, Smart-Locks — sie <strong>schalten</strong>, <strong>fahren aus/ein</strong> oder <strong>detektieren</strong>. Bedingen Strom-/Backup-Versorgung.</p>
        <div class="mency-ap-examples">
          <span class="mency-ap-chip">Hydr. Versenkpoller</span>
          <span class="mency-ap-chip">Personenschleuse</span>
          <span class="mency-ap-chip">Drehkreuz</span>
          <span class="mency-ap-chip">Elektrozaun</span>
          <span class="mency-ap-chip">Smart-Lock</span>
        </div>
      </div>
    `;
    root.appendChild(ap);

    // Filter
    const filterBar = el('div', { class:'mency-filterbar' });
    const state = { kat:'Alle', typ:'Alle', q:'', compare: [] };

    // Kategorie-Tabs
    const kats = ['Alle', ...Object.keys(KAT_COLORS)];
    const katBar = el('div', { class:'mency-tabs' });
    kats.forEach(k => {
      const info = KAT_COLORS[k];
      const b = el('button', {
        class:'mency-tab' + (state.kat === k ? ' active' : ''),
        style: info ? `--c:${info.c}` : '--c:#22d3ee'
      });
      b.innerHTML = info
        ? `<i class="fas ${info.icon}"></i><span>${k}</span><em>${MECH_ENCY.LIST.filter(m => m.kat===k).length}</em>`
        : `<i class="fas fa-layer-group"></i><span>${k}</span><em>${MECH_ENCY.LIST.length}</em>`;
      b.onclick = () => {
        state.kat = k;
        katBar.querySelectorAll('.mency-tab').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        rerender();
      };
      katBar.appendChild(b);
    });
    filterBar.appendChild(katBar);

    // Typ Toggle + Search
    const ctrlRow = el('div', { class:'mency-controls' });
    const typBar = el('div', { class:'mency-typebar' });
    ['Alle','passiv','aktiv'].forEach(t => {
      const b = el('button', { class:'mency-typebtn'+(state.typ===t?' active':'')+(t==='passiv'?' passiv':t==='aktiv'?' aktiv':'') });
      b.textContent = t === 'Alle' ? 'Alle Typen' : t.charAt(0).toUpperCase()+t.slice(1);
      b.onclick = () => {
        state.typ = t;
        typBar.querySelectorAll('.mency-typebtn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        rerender();
      };
      typBar.appendChild(b);
    });
    ctrlRow.appendChild(typBar);

    const search = el('input', { class:'mency-search' });
    search.type = 'search';
    search.placeholder = '🔍 Suche: RC2, Pilzkopf, Klasse III, Schüco, P4A, K12 ...';
    search.oninput = () => { state.q = search.value.toLowerCase().trim(); rerender(); };
    ctrlRow.appendChild(search);

    filterBar.appendChild(ctrlRow);

    // Compare-Bar
    const compareBar = el('div', { class:'mency-compare', style:'display:none' });
    filterBar.appendChild(compareBar);

    root.appendChild(filterBar);

    // Grid
    const stats = el('div', { class:'mency-stats' });
    root.appendChild(stats);

    const grid = el('div', { class:'mency-grid' });
    root.appendChild(grid);

    function rerender() {
      const filtered = MECH_ENCY.LIST.filter(m => {
        if (state.kat !== 'Alle' && m.kat !== state.kat) return false;
        if (state.typ !== 'Alle' && m.typ !== state.typ) return false;
        if (state.q) {
          const hay = `${m.name} ${m.kat} ${m.klasse} ${m.norm} ${m.einsatz} ${m.principle} ${(m.hersteller||[]).join(' ')}`.toLowerCase();
          if (!hay.includes(state.q)) return false;
        }
        return true;
      });

      stats.innerHTML = `
        <span class="mency-stats-count"><strong>${filtered.length}</strong> ${filtered.length === 1 ? 'Komponente' : 'Komponenten'}</span>
        ${state.kat !== 'Alle' ? `<span class="mency-stats-pill" style="--c:${KAT_COLORS[state.kat].c}">${state.kat}</span>` : ''}
        ${state.typ !== 'Alle' ? `<span class="mency-stats-pill" style="--c:${state.typ==='aktiv'?'#22d3ee':'#fbbf24'}">${state.typ}</span>` : ''}
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
      const info = KAT_COLORS[m.kat] || { c:'#22d3ee' };
      const c = el('div', { class:'mency-card', style:`--c:${info.c}` });
      const isCompared = state.compare.includes(m.key);

      c.innerHTML = `
        <button class="mency-card-compare ${isCompared?'on':''}" title="Zum Vergleich hinzufügen">
          <i class="fas fa-${isCompared?'check':'plus'}"></i>
        </button>
        <div class="mency-card-typebadge ${m.typ}">${m.typ}</div>
        <div class="mency-card-img">${m.svg}</div>
        <div class="mency-card-body">
          <div class="mency-card-kat">${m.kat}</div>
          <h4>${m.name}</h4>
          <div class="mency-card-klass">${m.klasse}</div>
          <p class="mency-card-prinz">${m.principle}</p>
          <div class="mency-card-meta">
            <span class="mency-card-norm" title="Norm">${m.norm}</span>
            <span class="mency-card-preis">${m.preis}</span>
          </div>
        </div>
        <div class="mency-card-cta">
          <i class="fas fa-circle-info"></i> Details anzeigen
        </div>
      `;

      c.querySelector('.mency-card-compare').onclick = (e) => {
        e.stopPropagation();
        toggleCompare(m.key);
      };

      c.onclick = () => openDrawer(m);
      return c;
    }

    function toggleCompare(key) {
      const idx = state.compare.indexOf(key);
      if (idx > -1) {
        state.compare.splice(idx, 1);
      } else {
        if (state.compare.length >= 3) {
          alert('Maximal 3 Komponenten vergleichen.');
          return;
        }
        state.compare.push(key);
      }
      updateCompareBar();
      rerender();
    }

    function updateCompareBar() {
      if (!state.compare.length) {
        compareBar.style.display = 'none';
        return;
      }
      compareBar.style.display = '';
      compareBar.innerHTML = `
        <div class="mency-compare-list">
          ${state.compare.map(k => {
            const m = MECH_ENCY.LIST.find(x => x.key === k);
            return `<span class="mency-compare-chip">${m.name} <i class="fas fa-xmark" data-rm="${k}"></i></span>`;
          }).join('')}
        </div>
        <button class="mency-compare-btn">
          <i class="fas fa-table-columns"></i> ${state.compare.length} vergleichen
        </button>
      `;
      compareBar.querySelectorAll('[data-rm]').forEach(el => el.onclick = (e) => {
        e.stopPropagation();
        toggleCompare(el.dataset.rm);
      });
      compareBar.querySelector('.mency-compare-btn').onclick = openCompare;
    }

    function openDrawer(m) {
      const drawer = el('div', { class:'mency-drawer-bg' });
      const inner = el('div', { class:'mency-drawer' });
      const info = KAT_COLORS[m.kat] || { c:'#22d3ee' };

      inner.innerHTML = `
        <div class="mency-drawer-head" style="--c:${info.c}">
          <button class="mency-drawer-close"><i class="fas fa-xmark"></i></button>
          <div class="mency-drawer-typebadge ${m.typ}">${m.typ === 'passiv' ? 'PASSIV' : 'AKTIV'}</div>
          <div class="mency-drawer-kat"><i class="fas ${info.icon}"></i> ${m.kat}</div>
          <h2>${m.name}</h2>
          <div class="mency-drawer-headstats">
            <div class="mency-drawer-stat"><strong>${m.klasse}</strong><span>Klasse</span></div>
            <div class="mency-drawer-stat"><strong>${m.wzeit}</strong><span>Widerstand</span></div>
            <div class="mency-drawer-stat"><strong>${m.preis}</strong><span>Preisrahmen</span></div>
          </div>
        </div>

        <div class="mency-drawer-img">${m.svg}</div>

        <div class="mency-drawer-body">
          <section>
            <h3><i class="fas fa-atom"></i> Wirkprinzip</h3>
            <p>${m.principle}</p>
          </section>

          <section>
            <h3><i class="fas fa-microscope"></i> Aufbau & Physik</h3>
            <p>${m.physik}</p>
          </section>

          <div class="mency-drawer-grid">
            <section class="ok">
              <h3><i class="fas fa-circle-check"></i> Stärken</h3>
              <ul>${m.staerken.map(s => `<li>${s}</li>`).join('')}</ul>
            </section>
            <section class="warn">
              <h3><i class="fas fa-triangle-exclamation"></i> Schwächen</h3>
              <ul>${m.schwaechen.map(s => `<li>${s}</li>`).join('')}</ul>
            </section>
          </div>

          <section>
            <h3><i class="fas fa-hammer"></i> Typische Angriffsszenarien</h3>
            <div class="mency-drawer-angriffe">
              ${m.angriffe.map(a => `<span class="mency-angriff-chip"><i class="fas fa-bolt"></i> ${a}</span>`).join('')}
            </div>
          </section>

          <section>
            <h3><i class="fas fa-industry"></i> Hersteller</h3>
            <div class="mency-drawer-hst">
              ${m.hersteller.map(h => `<span class="mency-hst-chip">${h}</span>`).join('')}
            </div>
          </section>

          <section>
            <h3><i class="fas fa-scroll"></i> Norm & Einsatzgebiet</h3>
            <div class="mency-drawer-meta">
              <div><strong>Norm:</strong> ${m.norm}</div>
              <div><strong>Einsatz:</strong> ${m.einsatz}</div>
            </div>
          </section>
        </div>
      `;
      drawer.appendChild(inner);
      document.body.appendChild(drawer);
      requestAnimationFrame(() => drawer.classList.add('open'));

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

    function openCompare() {
      const items = state.compare.map(k => MECH_ENCY.LIST.find(x => x.key === k));
      const drawer = el('div', { class:'mency-drawer-bg' });
      const inner = el('div', { class:'mency-drawer wide' });

      inner.innerHTML = `
        <div class="mency-compare-head">
          <button class="mency-drawer-close"><i class="fas fa-xmark"></i></button>
          <h2><i class="fas fa-table-columns"></i> Komponenten-Vergleich</h2>
        </div>
        <div class="mency-compare-grid" style="grid-template-columns: repeat(${items.length}, 1fr)">
          ${items.map(m => {
            const info = KAT_COLORS[m.kat];
            return `
              <div class="mency-compare-col" style="--c:${info.c}">
                <div class="mency-compare-img">${m.svg}</div>
                <div class="mency-compare-kat">${m.kat}</div>
                <h4>${m.name}</h4>
                <div class="mency-compare-typebadge ${m.typ}">${m.typ}</div>
                <table>
                  <tr><td>Klasse</td><th>${m.klasse}</th></tr>
                  <tr><td>Widerstand</td><th>${m.wzeit}</th></tr>
                  <tr><td>Norm</td><th>${m.norm}</th></tr>
                  <tr><td>Preis</td><th>${m.preis}</th></tr>
                  <tr><td>Einsatz</td><th>${m.einsatz}</th></tr>
                  <tr><td>Stärken</td><th>${m.staerken.length}</th></tr>
                  <tr><td>Schwächen</td><th>${m.schwaechen.length}</th></tr>
                  <tr><td>Top-Hersteller</td><th>${m.hersteller[0] || '—'}</th></tr>
                </table>
              </div>
            `;
          }).join('')}
        </div>
      `;
      drawer.appendChild(inner);
      document.body.appendChild(drawer);
      requestAnimationFrame(() => drawer.classList.add('open'));

      const close = () => {
        drawer.classList.remove('open');
        setTimeout(() => drawer.remove(), 250);
      };
      drawer.querySelector('.mency-drawer-close').onclick = close;
      drawer.onclick = (e) => { if (e.target === drawer) close(); };
    }

    rerender();
    return root;
  }

  return { view };
})();
