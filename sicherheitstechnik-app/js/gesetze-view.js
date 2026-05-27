/* Gesetze-View · 6 Sicherheits-Gesetze mit Paragraphen-Suche */

window.GESETZE_VIEW = (() => {
  const { el } = U;

  function view(d) {
    const root = el('div');
    const allG = GESETZE_DB.getAll();
    const allP = GESETZE_DB.getAllParagraphs();

    // ====== Kompakter HERO ======
    const hero = el('div', { class:'gv-hero gv-hero-compact' });
    hero.innerHTML = `
      <div class="gv-hero-content">
        <h1>⚖️ Gesetzes-Katalog</h1>
        <p><strong>${allG.length}</strong> Gesetze · <strong>${allP.length}</strong> Paragraphen · Klick einen § für Detail-Erklärung</p>
      </div>
    `;
    root.appendChild(hero);

    // ====== Globale Suche ======
    const search = el('div', { class:'gv-search' });
    search.innerHTML = `
      <div class="gv-search-box">
        <i class="fas fa-search"></i>
        <input type="search" id="gv-q" placeholder="Suche: § 14 Haftpflicht · Bewacherregister · NIS-2 · Ersthelfer · Diensthund · 500.000 ..." autofocus>
        <span class="gv-search-count" id="gv-cnt">${allP.length} Paragraphen</span>
        <button class="gv-pdf-btn" onclick="window.print()" title="Aktuelles Gesetz als PDF drucken"><i class="fas fa-print"></i> PDF</button>
      </div>
    `;
    root.appendChild(search);

    // ====== Kachel-Übersicht aller Gesetze ======
    const kachelSec = buildGesetzKacheln();
    root.appendChild(kachelSec);

    function buildGesetzKacheln() {
      const sec = el('div', { class: 'kk-section gk-section' });
      sec.appendChild(el('div', { class: 'kk-sec-head' }, [
        el('div', { class: 'kk-sec-ico', html: '<i class="fas fa-scale-balanced"></i>' }),
        el('div', {}, [
          el('h3', { text: 'Alle Gesetze als Kacheln' }),
          el('div', { class: 'kk-sec-sub', text: 'Tippe ein Gesetz für alle Paragraphen & Erklärungen' }),
        ]),
        el('span', { class: 'kk-sec-count', text: allG.length + ' Gesetze' }),
      ]));
      const grid = el('div', { class: 'kk-grid' });
      allG.forEach(g => {
        const pCount = g.abschnitte.reduce((s, a) => s + a.paragraphen.length, 0);
        let wichtig = 0, jeder = 0;
        g.abschnitte.forEach(a => a.paragraphen.forEach(p => { if (p.wichtig) wichtig++; if (p.jedermann) jeder++; }));
        const tile = el('button', { class: 'kk-tile kk-tile--law', style: `--lv:${g.farbe}`, type: 'button' });
        tile.appendChild(el('div', { class: 'kk-top' }, [
          el('div', { class: 'kk-badge', html: `<i class="fas ${g.icon}"></i> ${g.short}` }),
          el('span', { class: 'kk-count', text: pCount + ' §§' }),
        ]));
        tile.appendChild(el('div', { class: 'kk-risk', text: g.title }));
        tile.appendChild(el('div', { class: 'kk-cat', text: g.kategorie }));
        if (g.intro) tile.appendChild(el('div', { class: 'kk-desc', text: g.intro }));
        const facts = el('div', { class: 'kk-facts' });
        facts.appendChild(el('div', { class: 'kk-fact' }, [
          el('span', { class: 'kk-fact-l', html: '<i class="fas fa-calendar"></i> Stand' }),
          el('span', { class: 'kk-fact-v', text: g.datum }),
        ]));
        facts.appendChild(el('div', { class: 'kk-fact' }, [
          el('span', { class: 'kk-fact-l', html: '<i class="fas fa-users"></i> Wer' }),
          el('span', { class: 'kk-fact-v', text: g.anwender }),
        ]));
        facts.appendChild(el('div', { class: 'kk-fact' }, [
          el('span', { class: 'kk-fact-l', html: '<i class="fas fa-layer-group"></i> Aufbau' }),
          el('span', { class: 'kk-fact-v', text: g.abschnitte.length + ' Abschnitte' }),
        ]));
        tile.appendChild(facts);
        if (wichtig || jeder) {
          const chips = el('div', { class: 'kk-chips' });
          if (wichtig) chips.appendChild(el('span', { class: 'kk-chip kk-chip-star', html: `<i class="fas fa-star"></i> ${wichtig} wichtig` }));
          if (jeder) chips.appendChild(el('span', { class: 'kk-chip kk-chip-hand', html: `<i class="fas fa-hand"></i> ${jeder} Jedermannsrecht` }));
          tile.appendChild(chips);
        }
        tile.appendChild(el('div', { class: 'kk-more', html: 'Gesetz öffnen <i class="fas fa-arrow-right"></i>' }));
        tile.addEventListener('click', () => selectGesetz(g.id, true));
        grid.appendChild(tile);
      });
      sec.appendChild(grid);
      return sec;
    }

    // ====== Gesetze-Tabs (Karten) ======
    const tabs = el('div', { class:'gv-tabs' });
    let activeG = allG[0].id;
    allG.forEach(g => {
      const card = el('button', { class:'gv-tab' + (g.id === activeG ? ' active' : ''), style:`--c:${g.farbe}`, dataset:{ gid: g.id } });
      const pcount = g.abschnitte.reduce((s,a) => s + a.paragraphen.length, 0);
      card.innerHTML = `
        <div class="gv-tab-icon"><i class="fas ${g.icon}"></i></div>
        <div class="gv-tab-body">
          <strong>${g.short}</strong>
          <span>${g.title}</span>
          <em>${pcount} §§ · ${g.abschnitte.length} Abschnitte</em>
        </div>
      `;
      card.onclick = () => selectGesetz(g.id, false);
      tabs.appendChild(card);
    });
    root.appendChild(tabs);

    function selectGesetz(id, scroll) {
      activeG = id;
      tabs.querySelectorAll('.gv-tab').forEach(t => t.classList.toggle('active', t.dataset.gid === id));
      renderContent();
      if (scroll && content.scrollIntoView) content.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ====== Content (Gesetz-Detail) ======
    const content = el('div', { class:'gv-content' });
    root.appendChild(content);

    // ====== Search-Results-Overlay ======
    const searchResults = el('div', { class:'gv-search-results', style:'display:none' });
    root.appendChild(searchResults);

    function renderContent() {
      const g = allG.find(x => x.id === activeG);
      if (!g) return;
      content.innerHTML = `
        <div class="gv-gesetz" style="--c:${g.farbe}">
          <div class="gv-gesetz-head">
            <div class="gv-gesetz-icon"><i class="fas ${g.icon}"></i></div>
            <div>
              <div class="gv-gesetz-cat">${g.kategorie}</div>
              <h2>${g.title}</h2>
              <div class="gv-gesetz-meta">
                <span><i class="fas fa-calendar"></i> ${g.datum}</span>
                <span><i class="fas fa-tag"></i> ${g.short}</span>
                <span><i class="fas fa-users"></i> ${g.anwender}</span>
                ${g.url ? `<a href="${g.url}" target="_blank" rel="noopener" class="gv-gesetz-url"><i class="fas fa-external-link-alt"></i> Original</a>` : ''}
              </div>
            </div>
          </div>
          <p class="gv-gesetz-intro">${g.intro}</p>

          ${g.visualisierung && GESETZE_DB.VIS[g.visualisierung] ? `
            <div class="gv-vis-wrap">
              ${GESETZE_DB.VIS[g.visualisierung]}
            </div>
          ` : ''}
          ${g.visualisierung4 && GESETZE_DB.VIS[g.visualisierung4] ? `
            <div class="gv-vis-wrap gv-vis-jedermann">
              <div class="gv-vis-title"><i class="fas fa-hand"></i> Jedermannsrechte — hervorgehoben</div>
              ${GESETZE_DB.VIS[g.visualisierung4]}
            </div>
          ` : ''}
          ${g.visualisierung2 && GESETZE_DB.VIS[g.visualisierung2] ? `
            <div class="gv-vis-wrap gv-vis-praxis">
              <div class="gv-vis-title"><i class="fas fa-lightbulb"></i> Praxis-Beispiele</div>
              ${GESETZE_DB.VIS[g.visualisierung2]}
            </div>
          ` : ''}
          ${g.visualisierung3 && GESETZE_DB.VIS[g.visualisierung3] ? `
            <div class="gv-vis-wrap">
              <div class="gv-vis-title"><i class="fas fa-shield-halved"></i> Notwehr-Prüfschema</div>
              ${GESETZE_DB.VIS[g.visualisierung3]}
            </div>
          ` : ''}

          ${g.abschnitte.map(a => `
            <details class="gv-abschnitt" ${a.nr === 1 ? 'open' : ''}>
              <summary>
                <span class="gv-abschnitt-nr">${a.nr}</span>
                <strong>${a.title}</strong>
                <span class="gv-abschnitt-count">${a.paragraphen.length} §§</span>
                <i class="fas fa-chevron-down gv-chev"></i>
              </summary>
              <div class="gv-para-list">
                ${a.paragraphen.map(p => `
                  <div class="gv-para-row ${p.wichtig?'wichtig':''} ${p.jedermann?'jedermann':''}" data-pkey="${g.id}-${(p.p||'').replace(/\\s/g,'')}">
                    <div class="gv-para-num">${p.p}${p.jedermann ? '<span class="gv-jedermann-dot" title="Jedermannsrecht"><i class="fas fa-hand"></i></span>' : ''}</div>
                    <div class="gv-para-content">
                      <div class="gv-para-title">${p.t} ${p.wichtig ? '<i class="fas fa-star gv-star" title="Wichtig"></i>' : ''}${p.jedermann ? '<span class="gv-jedermann-badge"><i class="fas fa-hand"></i> JEDERMANNSRECHT</span>' : ''}</div>
                      <div class="gv-para-sum">${p.s}</div>
                      ${p.beispiel ? `<div class="gv-para-beispiel"><i class="fas fa-lightbulb"></i><div><strong>Praxisfall:</strong> ${p.beispiel}</div></div>` : ''}
                      ${p.tags && p.tags.length ? `<div class="gv-para-tags">${p.tags.map(t => `<span class="gv-tag-chip">${t}</span>`).join('')}</div>` : ''}
                    </div>
                    <i class="fas fa-chevron-right gv-para-go"></i>
                  </div>
                `).join('')}
              </div>
            </details>
          `).join('')}
        </div>
      `;

      // Klick auf Paragraph → Drawer
      content.querySelectorAll('.gv-para-row').forEach(el => {
        el.onclick = () => {
          const key = el.dataset.pkey;
          const para = findParagraph(key);
          if (para) openDrawer(para);
        };
      });
    }

    function findParagraph(key) {
      const [gid, pNr] = key.split('-');
      const g = allG.find(x => x.id === gid);
      if (!g) return null;
      for (const a of g.abschnitte) {
        for (const p of a.paragraphen) {
          if ((p.p || '').replace(/\s/g,'') === pNr) {
            return { gesetz: g, abschnitt: a, paragraph: p };
          }
        }
      }
      return null;
    }

    function openDrawer(item) {
      const { gesetz, abschnitt, paragraph } = item;
      const drawer = el('div', { class:'mency-drawer-bg' });
      const inner = el('div', { class:'mency-drawer' });
      inner.innerHTML = `
        <div class="mency-drawer-head" style="--c:${gesetz.farbe}">
          <button class="mency-drawer-close"><i class="fas fa-xmark"></i></button>
          <div class="mency-drawer-kat"><i class="fas ${gesetz.icon}"></i> ${gesetz.short} · Abschnitt ${abschnitt.nr}</div>
          <h2>${paragraph.p} ${paragraph.t}</h2>
          <div class="gv-drawer-meta">
            <span>${gesetz.title}</span>
            ${paragraph.wichtig ? '<span class="gv-drawer-wichtig"><i class="fas fa-star"></i> WICHTIG</span>' : ''}
            ${paragraph.jedermann ? '<span class="gv-drawer-jedermann"><i class="fas fa-hand"></i> JEDERMANNSRECHT</span>' : ''}
          </div>
        </div>
        <div class="mency-drawer-body">
          ${paragraph.jedermann ? `
            <section class="gv-drawer-jedermann-section">
              <h3><i class="fas fa-hand"></i> Jedermannsrecht</h3>
              <div class="gv-drawer-jedermann-box">
                Dieses Recht steht <strong>jeder Person</strong> zu — auch dem Sicherheitsmitarbeiter, der keine hoheitlichen Polizei-Befugnisse hat. Es ist eine der wichtigsten Rechtsgrundlagen für Eingriffe im Dienst. <em>Grenze: stets nur das mildeste erforderliche Mittel + Verhältnismäßigkeit.</em>
              </div>
            </section>
          ` : ''}
          <section>
            <h3><i class="fas fa-file-alt"></i> Zusammenfassung</h3>
            <p>${paragraph.s}</p>
          </section>
          ${paragraph.beispiel ? `
            <section class="gv-drawer-beispiel-section">
              <h3><i class="fas fa-lightbulb"></i> Praxisfall · Sicherheitsdienst</h3>
              <div class="gv-drawer-beispiel">${paragraph.beispiel}</div>
            </section>
          ` : ''}
          ${paragraph.merksatz ? `
            <section class="gv-drawer-merksatz-section">
              <h3><i class="fas fa-bookmark"></i> Merksatz</h3>
              <div class="gv-drawer-merksatz">${paragraph.merksatz}</div>
            </section>
          ` : ''}
          ${paragraph.fehler ? `
            <section class="gv-drawer-fehler-section">
              <h3><i class="fas fa-triangle-exclamation"></i> Typische Fehler</h3>
              <ul class="gv-drawer-fehler">${paragraph.fehler.map(f => `<li>${f}</li>`).join('')}</ul>
            </section>
          ` : ''}
          <section>
            <h3><i class="fas fa-list-check"></i> Schlagworte</h3>
            <div class="gv-drawer-tags">
              ${(paragraph.tags || []).map(t => `<span class="gv-tag-chip">${t}</span>`).join('')}
            </div>
          </section>
          <section>
            <h3><i class="fas fa-section"></i> Kontext</h3>
            <div class="gv-drawer-context">
              <div><strong>Gesetz:</strong> ${gesetz.title}</div>
              <div><strong>Abschnitt ${abschnitt.nr}:</strong> ${abschnitt.title}</div>
              <div><strong>Datum:</strong> ${gesetz.datum}</div>
              <div><strong>Anwender:</strong> ${gesetz.anwender}</div>
              ${gesetz.url ? `<div><strong>Quelle:</strong> <a href="${gesetz.url}" target="_blank" rel="noopener" style="color:${gesetz.farbe}">${gesetz.url}</a></div>` : ''}
            </div>
          </section>
          ${gesetz.visualisierung && GESETZE_DB.VIS[gesetz.visualisierung] ? `
            <section>
              <h3><i class="fas fa-image"></i> Visualisierung des Gesetzes</h3>
              ${GESETZE_DB.VIS[gesetz.visualisierung]}
            </section>
          ` : ''}
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

    // ====== Suche wiring ======
    setTimeout(() => {
      const inp = search.querySelector('#gv-q');
      const cnt = search.querySelector('#gv-cnt');
      inp.oninput = () => {
        const q = inp.value.toLowerCase().trim();
        if (!q) {
          searchResults.style.display = 'none';
          tabs.style.display = '';
          content.style.display = '';
          kachelSec.style.display = '';
          cnt.textContent = `${allP.length} Paragraphen`;
          return;
        }
        const matches = allP.filter(({ gesetz, paragraph }) => {
          const hay = `${paragraph.p} ${paragraph.t} ${paragraph.s} ${gesetz.short} ${gesetz.title} ${(paragraph.tags||[]).join(' ')}`.toLowerCase();
          return hay.includes(q);
        });
        cnt.textContent = `${matches.length} Treffer`;
        tabs.style.display = 'none';
        content.style.display = 'none';
        kachelSec.style.display = 'none';
        searchResults.style.display = '';
        searchResults.innerHTML = `
          <div class="gv-results-head">
            <h3>${matches.length} Treffer für „${q}"</h3>
          </div>
          ${matches.length === 0 ? '<p class="muted">Keine Paragraphen gefunden.</p>' :
            matches.map(({ gesetz, abschnitt, paragraph }) => `
              <div class="gv-result-item ${paragraph.jedermann?'jedermann':''}" style="--c:${gesetz.farbe}" data-pkey="${gesetz.id}-${(paragraph.p||'').replace(/\\s/g,'')}">
                <div class="gv-result-meta">
                  <span class="gv-result-short"><i class="fas ${gesetz.icon}"></i> ${gesetz.short}</span>
                  <span class="gv-result-abs">Abschnitt ${abschnitt.nr}</span>
                </div>
                <div class="gv-result-title">
                  <strong>${paragraph.p}</strong> ${highlight(paragraph.t, q)}
                  ${paragraph.wichtig ? '<i class="fas fa-star gv-star" title="Wichtig"></i>' : ''}
                  ${paragraph.jedermann ? '<span class="gv-jedermann-badge"><i class="fas fa-hand"></i> JEDERMANNSRECHT</span>' : ''}
                </div>
                <p>${highlight(paragraph.s, q)}</p>
                <div class="gv-para-tags">
                  ${(paragraph.tags || []).map(t => `<span class="gv-tag-chip">${t}</span>`).join('')}
                </div>
              </div>
            `).join('')}
        `;
        searchResults.querySelectorAll('.gv-result-item').forEach(el => {
          el.onclick = () => {
            const item = findParagraph(el.dataset.pkey);
            if (item) openDrawer(item);
          };
        });
      };
    }, 0);

    function highlight(text, q) {
      if (!q) return text;
      const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      return text.replace(re, '<mark>$1</mark>');
    }

    renderContent();
    return root;
  }

  return { view };
})();
