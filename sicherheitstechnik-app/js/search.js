/* Global fuzzy-ish search across all structured data */
window.SEARCH = (() => {
  const { el, escapeHtml } = U;

  let index = [];

  function buildIndex(d) {
    index = [];
    // Zones
    d.sicherheitskonzept.zones.forEach(z => {
      index.push({
        section: 'Schutzzonen', view: 'konzept',
        title: z['Zone'] + ' · ' + z['Bezeichnung'],
        body: [z['Schutzbereich'], z['Mechanische Maßnahmen'], z['Elektronische Maßnahmen'], z['Relevante Normen'], z['VdS-Richtlinien']].filter(Boolean).join(' | ')
      });
    });
    // Systems
    d.sicherheitskonzept.systems.forEach(s => {
      index.push({
        section: 'Übergeordnete Systeme', view: 'konzept',
        title: s.system,
        body: [s.bereich, s.mechanisch, s.elektronisch, s.normen, s.vds].filter(Boolean).join(' | ')
      });
    });
    // Sicherungsklassen
    d.sicherungsklassen.tables.forEach(t => t.rows.forEach(r => {
      const ttl = r['Sicherungsklasse'] || r['EMA-Grad'] || r['RC-Klasse'];
      index.push({
        section: t.title, view: 'klassen',
        title: ttl,
        body: Object.values(r).join(' | ')
      });
    }));
    // Catalog tables
    ['perimeter','aussenhaut','melder','ema_zka'].forEach(k => {
      const viewMap = { perimeter:'perimeter', aussenhaut:'aussenhaut', melder:'melder', ema_zka:'ema' };
      (d[k]?.tables || []).forEach(t => t.rows.forEach(r => {
        const ttl = r['Produkt'] || r['Produkt / Maßnahme'] || r['Komponente'] || r['Meldertyp'] || '';
        index.push({
          section: t.title.replace(/[^\w\sÀ-￿&-]/g,'').trim(), view: viewMap[k],
          title: ttl,
          body: Object.values(r).join(' | ')
        });
      }));
    });
    // Preisliste
    d.preisliste.rows.forEach(r => {
      index.push({
        section: 'Preisliste · ' + r['Bereich'], view: 'preisliste',
        title: r['Produkt'] + ' (' + r['Preis von (€)'] + '–' + r['Preis bis (€)'] + ' €)',
        body: Object.values(r).join(' | ')
      });
    });
    // Dokumente
    d.dokumente.forEach(doc => {
      index.push({
        section: 'Dokumente · ' + doc['Ordner'], view: 'dokumente',
        title: doc['Dateiname'],
        body: [doc['Thema'], doc['Relevante Normen']].filter(Boolean).join(' | ')
      });
    });
    // Details D1-D10
    (d.details || []).forEach(det => {
      index.push({
        section: 'Funktionsprinzip', view: 'melder',
        title: det.name,
        body: det.sections.map(s => (s.lines||[]).join(' ')).join(' ')
      });
    });
  }

  function search(q) {
    q = q.toLowerCase().trim();
    if (!q) return [];
    const terms = q.split(/\s+/);
    return index
      .map(it => {
        const hay = (it.title + ' ' + it.body).toLowerCase();
        let score = 0;
        for (const t of terms) {
          const i = hay.indexOf(t);
          if (i < 0) return null;
          score += 1 + (hay.indexOf(t) < it.title.length ? 2 : 0);
        }
        return { it, score };
      })
      .filter(Boolean)
      .sort((a,b)=>b.score-a.score)
      .slice(0, 60)
      .map(({it}) => it);
  }

  function highlight(text, q) {
    if (!q) return escapeHtml(text);
    const safe = escapeHtml(text);
    const terms = q.toLowerCase().split(/\s+/);
    let out = safe;
    terms.forEach(t => {
      if (!t) return;
      const re = new RegExp('('+t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');
      out = out.replace(re, '<mark>$1</mark>');
    });
    return out;
  }

  function renderResults(q, results, onClick) {
    const panel = el('div', { class: 'search-panel' });
    if (!results.length) {
      panel.appendChild(el('p', { class: 'muted', text: 'Keine Treffer für "'+q+'".' }));
      return panel;
    }
    panel.appendChild(el('h4', { text: results.length + ' Treffer für "'+q+'"' }));
    const groups = {};
    results.forEach(r => (groups[r.section] = groups[r.section] || []).push(r));
    Object.entries(groups).forEach(([sec, items]) => {
      panel.appendChild(el('h4', { text: sec }));
      items.forEach(it => {
        const res = el('div', { class: 'search-result' });
        const snip = it.body.length > 160 ? it.body.slice(0, 160)+'…' : it.body;
        res.innerHTML = `
          <div style="flex:1">
            <div class="ttl">${highlight(it.title, q)}</div>
            <div class="snip">${highlight(snip, q)}</div>
          </div>
          <div class="meta">${escapeHtml(it.section)}</div>`;
        res.addEventListener('click', () => onClick(it));
        panel.appendChild(res);
      });
    });
    return panel;
  }

  return { buildIndex, search, renderResults };
})();
