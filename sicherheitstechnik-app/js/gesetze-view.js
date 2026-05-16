/* Gesetze-View · 6 Sicherheits-Gesetze mit Paragraphen-Suche */

window.GESETZE_VIEW = (() => {
  const { el } = U;

  function view(d) {
    const root = el('div');
    const allG = GESETZE_DB.getAll();
    const allP = GESETZE_DB.getAllParagraphs();

    // ====== HERO ======
    const hero = el('div', { class:'gv-hero' });
    hero.innerHTML = `
      <div class="gv-hero-bg"></div>
      <div class="gv-hero-content">
        <div class="gv-tag">GESETZES-DATENBANK · INTERAKTIV</div>
        <h1>⚖️ ${allG.length} Sicherheits-Gesetze · ${allP.length} Paragraphen</h1>
        <p>
          BeWachV · KRITIS-DachG · NIS-2/BSIG · DGUV V1 · DGUV V23 — alle Paragraphen erklärt,
          durchsuchbar, mit Visualisierungen. Klick einen Paragraph für die Detail-Erklärung.
        </p>
        <div class="gv-hero-stats">
          ${allG.map(g => `<div class="gv-hero-stat" style="--c:${g.farbe}">
            <i class="fas ${g.icon}"></i>
            <strong>${g.abschnitte.reduce((s,a) => s + a.paragraphen.length, 0)}</strong>
            <span>${g.short}</span>
          </div>`).join('')}
        </div>
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
      </div>
    `;
    root.appendChild(search);

    // ====== Gesetze-Tabs (Karten) ======
    const tabs = el('div', { class:'gv-tabs' });
    let activeG = allG[0].id;
    allG.forEach(g => {
      const card = el('button', { class:'gv-tab' + (g.id === activeG ? ' active' : ''), style:`--c:${g.farbe}` });
      const pcount = g.abschnitte.reduce((s,a) => s + a.paragraphen.length, 0);
      card.innerHTML = `
        <div class="gv-tab-icon"><i class="fas ${g.icon}"></i></div>
        <div class="gv-tab-body">
          <strong>${g.short}</strong>
          <span>${g.title}</span>
          <em>${pcount} §§ · ${g.abschnitte.length} Abschnitte</em>
        </div>
      `;
      card.onclick = () => {
        activeG = g.id;
        tabs.querySelectorAll('.gv-tab').forEach(t => t.classList.remove('active'));
        card.classList.add('active');
        renderContent();
      };
      tabs.appendChild(card);
    });
    root.appendChild(tabs);

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

          ${g.abschnitte.map(a => `
            <details class="gv-abschnitt" ${a.nr === 1 ? 'open' : ''}>
              <summary>
                <span class="gv-abschnitt-nr">${a.nr}</span>
                <strong>${a.title}</strong>
                <span class="gv-abschnitt-count">${a.paragraphen.length} §§</span>
                <i class="fas fa-chevron-down gv-chev"></i>
              </summary>
              <div class="gv-para-grid">
                ${a.paragraphen.map(p => `
                  <div class="gv-para ${p.wichtig?'wichtig':''}" data-pkey="${g.id}-${(p.p||'').replace(/\\s/g,'')}">
                    <div class="gv-para-head">
                      <strong>${p.p}</strong>
                      <span>${p.t}</span>
                      ${p.wichtig ? '<i class="fas fa-star gv-star" title="Wichtig"></i>' : ''}
                    </div>
                    <p>${p.s}</p>
                    <div class="gv-para-tags">
                      ${(p.tags || []).map(t => `<span class="gv-tag-chip">${t}</span>`).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </details>
          `).join('')}
        </div>
      `;

      // Klick auf Paragraph → Drawer
      content.querySelectorAll('.gv-para').forEach(el => {
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
          </div>
        </div>
        <div class="mency-drawer-body">
          <section>
            <h3><i class="fas fa-file-alt"></i> Zusammenfassung</h3>
            <p>${paragraph.s}</p>
          </section>
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
        searchResults.style.display = '';
        searchResults.innerHTML = `
          <div class="gv-results-head">
            <h3>${matches.length} Treffer für „${q}"</h3>
          </div>
          ${matches.length === 0 ? '<p class="muted">Keine Paragraphen gefunden.</p>' :
            matches.map(({ gesetz, abschnitt, paragraph }) => `
              <div class="gv-result-item" style="--c:${gesetz.farbe}" data-pkey="${gesetz.id}-${(paragraph.p||'').replace(/\\s/g,'')}">
                <div class="gv-result-meta">
                  <span class="gv-result-short"><i class="fas ${gesetz.icon}"></i> ${gesetz.short}</span>
                  <span class="gv-result-abs">Abschnitt ${abschnitt.nr}</span>
                </div>
                <div class="gv-result-title">
                  <strong>${paragraph.p}</strong> ${highlight(paragraph.t, q)}
                  ${paragraph.wichtig ? '<i class="fas fa-star gv-star" title="Wichtig"></i>' : ''}
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
