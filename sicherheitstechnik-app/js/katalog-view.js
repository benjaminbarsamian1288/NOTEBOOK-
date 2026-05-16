/* Katalog-View · Master-Hub + generische Sub-Kategorie-Views */

window.KATALOG_VIEW = (() => {
  const { el } = U;

  /* ========== MASTER HUB ========== */
  function masterHub(d) {
    const root = el('div');

    // Hero
    const hero = el('div', { class:'kat-master-hero' });
    hero.innerHTML = `
      <div class="kat-master-bg"></div>
      <div class="kat-master-content">
        <div class="kat-master-tag">SICHERHEITSTECHNIK · MASTER-KATALOG</div>
        <h1>Alle Komponenten · Sortiert · Mit Animationen</h1>
        <p>
          Komplette Übersicht aller Sicherheitstechnik-Bereiche in <strong>6 Hauptkategorien</strong>.
          Jede Komponente mit Bild, Beschreibung, Klassifizierung, Hersteller und Wirkprinzip.
        </p>
        <div class="kat-master-stats">
          ${KATALOG.ALL_KATS.map(k => `
            <div class="kat-master-stat" style="--c:${k.c}">
              <strong>${k.count()}</strong><span>${k.name.split('·')[0].trim()}</span>
            </div>
          `).join('')}
          <div class="kat-master-stat" style="--c:#22c55e">
            <strong>${totalCount()}</strong><span>Gesamt</span>
          </div>
        </div>
      </div>
    `;
    root.appendChild(hero);

    // 6 große Kategorie-Cards
    const grid = el('div', { class:'kat-master-grid' });
    KATALOG.ALL_KATS.forEach(k => {
      const card = el('div', { class:'kat-master-card', style:`--c:${k.c}` });
      card.innerHTML = `
        <div class="kat-master-card-glow"></div>
        <div class="kat-master-card-icon">${k.heroSvg}</div>
        <div class="kat-master-card-body">
          <div class="kat-master-card-meta">
            <i class="fas ${k.icon}"></i>
            <span class="kat-master-card-count">${k.count()} Komponenten</span>
          </div>
          <h2>${k.name}</h2>
          <p>${k.desc}</p>
          <div class="kat-master-card-preview">
            ${k.preview.map(p => `<span>${p}</span>`).join('')}
          </div>
          <button class="kat-master-card-btn">
            Alle anzeigen <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      `;
      card.querySelector('.kat-master-card-btn').onclick = () => navigate(k.view);
      grid.appendChild(card);
    });
    root.appendChild(grid);

    // Quick-Links zu anderen Views
    const more = el('div', { class:'card mt-16 kat-master-more' });
    more.innerHTML = `
      <div class="card-h">
        <div class="ico" style="background:rgba(34,211,238,.15); color:#22d3ee"><i class="fas fa-compass"></i></div>
        <h3>Weitere Werkzeuge & Übersichten</h3>
      </div>
      <div class="kat-master-quicklinks">
        <a class="kat-quicklink" data-view="zwiebel3d"><i class="fas fa-circle-dot"></i> 3D-Zwiebelmodell · 4 Schutzzonen</a>
        <a class="kat-quicklink" data-view="haus3d"><i class="fas fa-house-chimney"></i> Sicherheits-Haus 3D</a>
        <a class="kat-quicklink" data-view="wwd"><i class="fas fa-tower-cell"></i> WWD Video-Türme</a>
        <a class="kat-quicklink" data-view="konzept"><i class="fas fa-layer-group"></i> Schutzkonzept</a>
        <a class="kat-quicklink" data-view="klassen"><i class="fas fa-medal"></i> SÜ · Grade · RC-Klassen</a>
        <a class="kat-quicklink" data-view="wizard"><i class="fas fa-wand-magic-sparkles"></i> Sicherheits-Assistent</a>
        <a class="kat-quicklink" data-view="konfigurator"><i class="fas fa-sliders"></i> Konfigurator</a>
        <a class="kat-quicklink" data-view="calculators"><i class="fas fa-calculator"></i> Calculator-Suite</a>
        <a class="kat-quicklink" data-view="gesetze"><i class="fas fa-gavel"></i> Gesetze · KRITIS · NIS2</a>
        <a class="kat-quicklink" data-view="galerie"><i class="fas fa-images"></i> Produkt-Galerie</a>
        <a class="kat-quicklink" data-view="mediathek"><i class="fas fa-photo-film"></i> Mediathek</a>
        <a class="kat-quicklink" data-view="quiz"><i class="fas fa-graduation-cap"></i> Quiz · Wissens-Test</a>
        <a class="kat-quicklink" data-view="glossar"><i class="fas fa-book"></i> Glossar · 37 Begriffe</a>
      </div>
    `;
    more.querySelectorAll('[data-view]').forEach(a => a.onclick = () => navigate(a.dataset.view));
    root.appendChild(more);

    return root;
  }

  function totalCount() {
    let sum = 0;
    KATALOG.ALL_KATS.forEach(k => { sum += k.count(); });
    return sum;
  }

  function navigate(view) {
    const btn = document.querySelector(`.navitem[data-view="${view}"]`);
    if (btn) {
      btn.click();
    } else {
      // Render direkt
      const main = document.querySelector('main') || document.querySelector('.main');
      if (main && window.app && window.app.renderView) window.app.renderView(view);
    }
  }

  /* ========== Generische Sub-View für die 4 neuen Kategorien ========== */

  function subView(katId) {
    const meta = KATALOG.ALL_KATS.find(k => k.id === katId);
    if (!meta) return el('div', { text:'Kategorie nicht gefunden' });

    const dbMap = {
      'video': KATALOG.VIDEO_DB,
      'brandschutz': KATALOG.BRAND_DB,
      'zutritt': KATALOG.ZKA_DB,
      'alarmierung': KATALOG.EMA_DB,
    };
    const list = dbMap[katId] || [];
    const root = el('div');

    // Hero
    const hero = el('div', { class:'kat-sub-hero', style:`--c:${meta.c}` });
    hero.innerHTML = `
      <div class="kat-sub-bg"></div>
      <div class="kat-sub-content">
        <a class="kat-sub-back" data-back><i class="fas fa-arrow-left"></i> Zurück zum Katalog</a>
        <div class="kat-sub-tag">${meta.name.toUpperCase()}</div>
        <h1><i class="fas ${meta.icon}"></i> ${meta.name}</h1>
        <p>${meta.desc}</p>
        <div class="kat-sub-stats">
          <div><strong>${list.length}</strong><span>Komponenten</span></div>
          <div><strong>${list.filter(x => x.typ === 'aktiv').length}</strong><span>Aktiv</span></div>
          <div><strong>${list.filter(x => x.typ === 'passiv').length}</strong><span>Passiv</span></div>
          <div><strong>${new Set(list.flatMap(x => x.hersteller || [])).size}</strong><span>Hersteller</span></div>
        </div>
      </div>
    `;
    hero.querySelector('[data-back]').onclick = (e) => {
      e.preventDefault();
      navigate('katalog');
    };
    root.appendChild(hero);

    // Filter
    const filterBar = el('div', { class:'kat-sub-filter' });
    const state = { typ:'Alle', q:'' };

    const typBar = el('div', { class:'mency-typebar' });
    ['Alle','passiv','aktiv'].forEach(t => {
      const b = el('button', { class:'mency-typebtn'+(state.typ===t?' active':'')+(t==='passiv'?' passiv':t==='aktiv'?' aktiv':'') });
      b.textContent = t === 'Alle' ? 'Alle Typen' : t.charAt(0).toUpperCase()+t.slice(1);
      b.onclick = () => {
        state.typ = t;
        typBar.querySelectorAll('.mency-typebtn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        render();
      };
      typBar.appendChild(b);
    });
    filterBar.appendChild(typBar);

    const search = el('input', { class:'mency-search' });
    search.type = 'search';
    search.placeholder = '🔍 Suche: Klasse, Hersteller, Funktion ...';
    search.oninput = () => { state.q = search.value.toLowerCase().trim(); render(); };
    filterBar.appendChild(search);

    root.appendChild(filterBar);

    const grid = el('div', { class:'mency-grid' });
    root.appendChild(grid);

    function render() {
      const filtered = list.filter(m => {
        if (state.typ !== 'Alle' && m.typ !== state.typ) return false;
        if (state.q) {
          const hay = `${m.name} ${m.klasse} ${m.norm} ${m.einsatz} ${m.principle} ${(m.hersteller||[]).join(' ')}`.toLowerCase();
          if (!hay.includes(state.q)) return false;
        }
        return true;
      });
      grid.innerHTML = '';
      if (!filtered.length) {
        grid.appendChild(el('p', { class:'muted', style:'grid-column:1/-1; text-align:center; padding:40px', text:'Keine Komponenten gefunden.' }));
        return;
      }
      filtered.forEach(m => grid.appendChild(buildCard(m, meta)));
    }

    function buildCard(m, meta) {
      const c = el('div', { class:'mency-card', style:`--c:${meta.c}` });
      c.innerHTML = `
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
      c.onclick = () => openDrawer(m, meta);
      return c;
    }

    function openDrawer(m, meta) {
      const drawer = el('div', { class:'mency-drawer-bg' });
      const inner = el('div', { class:'mency-drawer' });

      inner.innerHTML = `
        <div class="mency-drawer-head" style="--c:${meta.c}">
          <button class="mency-drawer-close"><i class="fas fa-xmark"></i></button>
          <div class="mency-drawer-typebadge ${m.typ}">${m.typ === 'passiv' ? 'PASSIV' : 'AKTIV'}</div>
          <div class="mency-drawer-kat"><i class="fas ${meta.icon}"></i> ${m.kat}</div>
          <h2>${m.name}</h2>
          <div class="mency-drawer-headstats">
            <div class="mency-drawer-stat"><strong>${m.klasse}</strong><span>Klasse</span></div>
            <div class="mency-drawer-stat"><strong>${m.wzeit}</strong><span>Verhalten</span></div>
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
            <h3><i class="fas fa-scroll"></i> Norm & Einsatz</h3>
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

    render();
    return root;
  }

  return {
    masterHub,
    videoView: (d) => subView('video'),
    brandView: (d) => subView('brandschutz'),
    zkaView:   (d) => subView('zutritt'),
    emaView:   (d) => subView('alarmierung'),
  };
})();
