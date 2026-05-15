/* Galerie-View – Realistische Produktbilder aller Sensoren
   wie ein professioneller Hersteller-Katalog */

window.GALLERY = (() => {
  const { el, drawer } = U;

  function view(d) {
    const root = el('div');
    root.appendChild(el('div', { class:'view-head' }, [
      el('span', { class:'crumb', text:'Produktkatalog · Hochwertige Renderings' }),
      el('h1', { text:'Galerie · So sehen die Melder aus' }),
      el('p', { text:'Detaillierte Produktbilder aller Sensortypen – wie auf den Webseiten der Hersteller. Tippe ein Produkt für mehr Details + Animation.' })
    ]));

    // Get all detectors from encyclopedia
    const items = (window.ENCY ? ENCY.list : []).filter(m => m.key && window.PHOTOS && PHOTOS.MAP[m.key]);

    // Group by Kategorie
    const groups = {};
    items.forEach(m => {
      const k = m.kat || 'Sonstige';
      (groups[k] = groups[k] || []).push(m);
    });

    // Filter chips
    const allCats = ['Alle', ...Object.keys(groups)];
    let activeCat = 'Alle';
    const fbar = el('div', { class:'filterbar' });
    allCats.forEach(cat => {
      const c = el('button', { class:'chip'+(cat===activeCat?' active':''), text: cat });
      c.addEventListener('click', () => {
        activeCat = cat;
        fbar.querySelectorAll('.chip').forEach(x => x.classList.toggle('active', x.textContent===cat));
        rerender();
      });
      fbar.appendChild(c);
    });
    root.appendChild(fbar);

    const host = el('div', { class:'gallery-grid' });
    root.appendChild(host);

    function rerender() {
      host.innerHTML = '';
      const list = activeCat === 'Alle' ? items : (groups[activeCat] || []);
      list.forEach(m => host.appendChild(productCard(m)));
    }
    rerender();

    return root;
  }

  function productCard(m) {
    const c = el('div', { class:'gal-card' });
    c.style.setProperty('--c', getSensorColor(m));
    // Photo
    c.appendChild(el('div', { class:'gal-photo', html: PHOTOS.render(m.key) }));
    // Body
    const body = el('div', { class:'gal-body' });
    body.appendChild(el('div', { class:'gal-kat', text: m.kat }));
    body.appendChild(el('h3', { text: m.name }));
    body.appendChild(el('div', { class:'gal-desc', text: m.principle }));
    // Type badge
    const typeKey = m.type.toLowerCase().startsWith('passiv') ? 'passiv'
                  : m.type.toLowerCase().startsWith('aktiv') ? 'aktiv' : 'hybrid';
    const badge = el('div', { class:'gal-badges' });
    badge.appendChild(el('span', { class:'gal-badge type-'+typeKey, text: typeKey.toUpperCase() }));
    if (m.sue) badge.appendChild(el('span', { class:'gal-badge', text:'SÜ '+m.sue }));
    if (m.preis) badge.appendChild(el('span', { class:'gal-badge price', text: m.preis }));
    body.appendChild(badge);
    // Hersteller
    if (m.hersteller && m.hersteller.length) {
      const her = el('div', { class:'gal-hersteller' });
      m.hersteller.slice(0,3).forEach(h => {
        her.appendChild(el('span', { class:'gal-herst-chip', html:`<i class="fas fa-industry"></i> ${h}` }));
      });
      body.appendChild(her);
    }
    c.appendChild(body);

    // Hover hint
    c.appendChild(el('div', { class:'gal-hint', html:'<i class="fas fa-play"></i> Tippen für Animation' }));

    c.addEventListener('click', () => openDetail(m));
    return c;
  }

  function getSensorColor(m) {
    const COL = {
      'Bewegung': '#fbbf24',
      'Öffnung': '#c084fc',
      'Glasbruch': '#38bdf8',
      'Erschütterung': '#fb923c',
      'Spezial': '#a78bfa',
      'Brand': '#ef4444',
      'Perimeter': '#22c55e',
      'Aktiv-IR': '#0ea5e9',
      'Wandschutz': '#a3e635',
      'Objektschutz': '#ec4899',
      'Tresorschutz': '#7c3aed',
      'Vitrinenschutz': '#0d9488',
      'Geldautomat': '#dc2626',
    };
    return COL[m.kat] || '#22d3ee';
  }

  function openDetail(m) {
    const body = el('div', { class:'ency-detail' });
    // Product photo big
    if (window.PHOTOS && PHOTOS.MAP[m.key]) {
      body.appendChild(el('div', { class:'ency-detail-photo', html: PHOTOS.render(m.key) }));
    }
    // Explainer video
    if (window.EXPL && EXPL.hasExplainer(m.key)) {
      EXPL.player(m.key, body);
    }
    // Type + specs
    const typeKey = m.type.toLowerCase().startsWith('passiv') ? 'passiv'
                  : m.type.toLowerCase().startsWith('aktiv') ? 'aktiv' : 'hybrid';
    body.appendChild(el('div', { class:'row' }, [
      el('span', { class:'pill', text: m.kat }),
      el('span', { class:'pill ' + ({passiv:'w', aktiv:'b', hybrid:'p'}[typeKey]), text: m.type.toUpperCase() }),
      el('span', { class:'pill', text: 'Coverage: ' + m.coverage }),
      el('span', { class:'pill b', text: m.range || '' }),
    ]));
    // Physik
    body.appendChild(el('h3', { text:'Funktionsprinzip' }));
    body.appendChild(el('p', { text: m.physik }));
    // Hersteller
    if (m.hersteller) {
      body.appendChild(el('h3', { text:'Hersteller' }));
      const her = el('div', { class:'hersteller-chips' });
      m.hersteller.forEach(h => {
        const ch = el('span', { class:'hersteller-chip', html:`<i class="fas fa-industry"></i> ${h}` });
        her.appendChild(ch);
      });
      body.appendChild(her);
    }
    drawer(m.name, body);
  }

  return { view };
})();
