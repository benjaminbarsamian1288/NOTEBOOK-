/* Sicherheitsassistent – multi-step wizard that recommends SÜ class
   based on object type, value, size, location risk, occupancy.
   Then proposes the full component stack via KFG. */

window.WIZARD = (() => {
  const { el, fmtEUR } = U;

  const STATE_KEY = 'st-wizard-v1';

  // Step definitions
  const STEPS = [
    {
      key: 'objekt',
      q: 'Welche Art Objekt schützt du?',
      icon: 'fa-building',
      type: 'cards',
      options: [
        { v: 'wohnung',   l: 'Wohnung / EFH',          d: 'Privater Wohnbereich',                 i:'fa-house',           pts: 1 },
        { v: 'buero',     l: 'Büro / Praxis',          d: 'Gewerbliche Standardnutzung',          i:'fa-briefcase',       pts: 2 },
        { v: 'handel',    l: 'Einzelhandel',           d: 'Ladengeschäft mit Warenbestand',       i:'fa-cart-shopping',   pts: 2 },
        { v: 'juwelier',  l: 'Juwelier / Apotheke',    d: 'Wertkonzentration, attraktive Ware',   i:'fa-gem',             pts: 3 },
        { v: 'bank',      l: 'Bank / Spielhalle',      d: 'Hohe Bargeldsummen',                   i:'fa-piggy-bank',      pts: 4 },
        { v: 'kritis',    l: 'KRITIS / Datacenter',    d: 'Versorgungsrelevante Infrastruktur',   i:'fa-server',          pts: 5 },
        { v: 'militaer',  l: 'Botschaft / Militär',    d: 'Staatlich, hochsensibel',              i:'fa-flag',            pts: 6 },
      ]
    },
    {
      key: 'wert',
      q: 'Wertkonzentration im Objekt?',
      icon: 'fa-euro-sign',
      type: 'cards',
      options: [
        { v: '0-25',     l: '< 25.000 €',           d: 'Normaler Hausrat / Inventar',      i:'fa-circle-dot', pts: 0 },
        { v: '25-100',   l: '25.000 – 100.000 €',   d: 'Erhöhter Inventarwert',            i:'fa-coins',      pts: 1 },
        { v: '100-500',  l: '100.000 – 500.000 €',  d: 'Mittlere Wertkonzentration',       i:'fa-sack-dollar',pts: 2 },
        { v: '500-2M',   l: '500.000 – 2 Mio €',    d: 'Hohe Wertkonzentration',           i:'fa-money-bill-trend-up', pts: 3 },
        { v: '2M+',      l: '> 2 Mio €',            d: 'Sehr hohe / KRITIS-Werte',         i:'fa-vault',      pts: 4 },
      ]
    },
    {
      key: 'groesse',
      q: 'Wie groß ist das Objekt?',
      icon: 'fa-ruler-combined',
      type: 'cards',
      options: [
        { v: 'klein',  l: '< 100 m²',     d: 'Wohnung, kleines Büro',     i:'fa-house-chimney',  pts: 0, factor: 0.6 },
        { v: 'mittel', l: '100 – 300 m²', d: 'EFH, mittleres Gewerbe',    i:'fa-building',       pts: 0, factor: 1.0 },
        { v: 'gross',  l: '300 – 1000 m²',d: 'Großes Gewerbe / Halle',    i:'fa-warehouse',      pts: 1, factor: 1.6 },
        { v: 'xl',     l: '> 1000 m²',    d: 'Industriekomplex',          i:'fa-industry',       pts: 2, factor: 2.4 },
      ]
    },
    {
      key: 'lage',
      q: 'Wo liegt das Objekt?',
      icon: 'fa-map-location-dot',
      type: 'cards',
      options: [
        { v: 'land',     l: 'Ländlich',                d: 'Geringes Risikogebiet',         i:'fa-tree',     pts: 0 },
        { v: 'vorort',   l: 'Stadt / Vorort',          d: 'Standard-Stadtlage',            i:'fa-city',     pts: 1 },
        { v: 'innenstadt',l:'Innenstadt / Hotspot',    d: 'Hohes Verkehrs-/Einbruchsrisiko',i:'fa-traffic-light', pts: 2 },
        { v: 'isoliert', l: 'Isoliert / einsam',       d: 'Lange Anfahrtszeit',            i:'fa-mountain', pts: 2 },
      ]
    },
    {
      key: 'belegung',
      q: 'Wann ist das Objekt belegt?',
      icon: 'fa-clock',
      type: 'cards',
      options: [
        { v: '24-7', l: '24/7 belegt',          d: 'Personen immer vor Ort',         i:'fa-people-roof', pts: 0 },
        { v: 'tag',  l: 'Tagsüber belegt',      d: 'Nachts unbewacht',               i:'fa-sun',         pts: 1 },
        { v: 'tw',   l: 'Teilweise belegt',     d: 'Wechselnde Nutzung',             i:'fa-clock-rotate-left', pts: 1 },
        { v: 'leer', l: 'Meist unbewacht',      d: 'Wochenend-/Saison-Objekt',       i:'fa-moon',        pts: 2 },
      ]
    },
    {
      key: 'historie',
      q: 'Bisherige Einbruchsversuche?',
      icon: 'fa-shield-virus',
      type: 'cards',
      options: [
        { v: 'keine',    l: 'Keine bekannt',     d: 'Erstausstattung',                  i:'fa-circle-check',   pts: 0 },
        { v: '1x',       l: '1× passiert',       d: 'Einmaliger Vorfall',               i:'fa-triangle-exclamation', pts: 1 },
        { v: 'mehrfach', l: 'Mehrfach',          d: 'Wiederholtes Ziel',                i:'fa-bell-concierge',pts: 2 },
        { v: 'gewerbe',  l: 'Branche bekannt-gefährdet', d: 'Apotheke, Juwelier...',    i:'fa-bullseye',      pts: 1 },
      ]
    },
    {
      key: 'budget',
      q: 'Geplantes Budget?',
      icon: 'fa-piggy-bank',
      type: 'cards',
      options: [
        { v: 'low',  l: '< 5.000 €',          d: 'Basisschutz',           i:'fa-coins',     pts: 0 },
        { v: 'mid',  l: '5.000 – 25.000 €',   d: 'Standardausstattung',   i:'fa-wallet',    pts: 0 },
        { v: 'high', l: '25.000 – 100.000 €', d: 'Vollausstattung',       i:'fa-money-check-dollar', pts: 0 },
        { v: 'open', l: 'Offen / KRITIS',     d: 'Best Practice ohne Limit',i:'fa-infinity',pts: 0 },
      ]
    },
  ];

  function computeSue(answers) {
    let total = 0;
    let detail = [];
    STEPS.forEach(step => {
      const v = answers[step.key];
      if (!v) return;
      const opt = step.options.find(o => o.v === v);
      if (opt) {
        total += opt.pts;
        if (opt.pts) detail.push({ step: step.q, opt: opt.l, pts: opt.pts });
      }
    });
    // Map points to SÜ (1..6)
    let sue = 1;
    if (total >= 3)  sue = 2;
    if (total >= 6)  sue = 3;
    if (total >= 9)  sue = 4;
    if (total >= 12) sue = 5;
    if (total >= 16) sue = 6;
    // override by object type if very high
    const obj = answers.objekt;
    if (obj === 'kritis')   sue = Math.max(sue, 5);
    if (obj === 'militaer') sue = Math.max(sue, 6);
    return { sue, total, detail };
  }

  function render(d) {
    const root = el('div');
    root.appendChild(el('div', { class: 'view-head' }, [
      el('span', { class:'crumb', text:'Sicherheitsassistent' }),
      el('h1', { text: '7-Schritte-Sicherheitsanalyse' }),
      el('p', { text: 'Beantworte 7 Fragen zu deinem Objekt – die Engine ermittelt deine Sicherungsklasse SÜ 1–6 mit Begründung und schlägt ein komplettes Sicherungskonzept inkl. Investitionsrahmen vor.' })
    ]));

    let answers = {};
    try { answers = JSON.parse(localStorage.getItem(STATE_KEY) || '{}'); } catch {}
    let currentStep = Object.keys(answers).length;
    if (currentStep > STEPS.length) currentStep = STEPS.length;

    const progressBar = el('div', { class: 'wiz-progress' });
    const stepHost = el('div', { class: 'wiz-step' });
    const resultHost = el('div', { class: 'wiz-result' });
    root.appendChild(progressBar);
    root.appendChild(stepHost);
    root.appendChild(resultHost);

    function paintProgress() {
      progressBar.innerHTML = '';
      STEPS.forEach((s, i) => {
        const dot = el('div', {
          class: 'wiz-dot' + (i<currentStep?' done':'') + (i===currentStep?' active':''),
          html: `<i class="fas ${s.icon}"></i><span class="lbl">${i+1}. ${s.q.split(' ').slice(0,2).join(' ')}…</span>`
        });
        dot.addEventListener('click', () => {
          if (i <= currentStep) { currentStep = i; render2(); }
        });
        progressBar.appendChild(dot);
      });
    }

    function render2() {
      stepHost.innerHTML = '';
      resultHost.innerHTML = '';
      paintProgress();
      if (currentStep >= STEPS.length) {
        showResult();
        return;
      }
      const step = STEPS[currentStep];
      const card = el('div', { class: 'wiz-card' });
      card.appendChild(el('div', { class:'wiz-q' }, [
        el('div', { class:'wiz-num', text: `Frage ${currentStep+1} / ${STEPS.length}` }),
        el('h2', { text: step.q })
      ]));
      const grid = el('div', { class: 'wiz-opts' });
      step.options.forEach(opt => {
        const o = el('button', {
          class: 'wiz-opt' + (answers[step.key]===opt.v ? ' selected' : ''),
          html: `<div class="opt-i"><i class="fas ${opt.i}"></i></div>
                 <div class="opt-l">${opt.l}</div>
                 <div class="opt-d">${opt.d}</div>`
        });
        o.addEventListener('click', () => {
          answers[step.key] = opt.v;
          localStorage.setItem(STATE_KEY, JSON.stringify(answers));
          currentStep++;
          render2();
        });
        grid.appendChild(o);
      });
      card.appendChild(grid);
      const nav = el('div', { class:'wiz-nav' });
      if (currentStep > 0) {
        const back = el('button', { class:'btn ghost', html:'<i class="fas fa-arrow-left"></i> Zurück' });
        back.addEventListener('click', () => { currentStep--; render2(); });
        nav.appendChild(back);
      }
      nav.appendChild(el('span', { class:'muted small', text: `${currentStep+1} von ${STEPS.length}` }));
      card.appendChild(nav);
      stepHost.appendChild(card);
    }

    function showResult() {
      const r = computeSue(answers);
      const sueRow = d.sicherungsklassen.tables[0].rows.find(x => x['Sicherungsklasse'].includes('SÜ '+r.sue));
      const card = el('div', { class:'wiz-card wiz-final' });
      card.innerHTML = `
        <div class="wiz-result-h">
          <div class="wiz-trophy"><i class="fas fa-shield-halved"></i></div>
          <div>
            <div class="muted small">Empfohlene Sicherungsklasse</div>
            <h2 class="wiz-big">SÜ ${r.sue} / ${({1:'SG 1',2:'SG 2',3:'SG 3',4:'SG 4',5:'SG 5',6:'SG 6'})[r.sue]}</h2>
            <div class="muted">${sueRow?.['Beschreibung'] || ''}</div>
          </div>
        </div>
      `;
      const kv = el('div', { class: 'kv-grid mt-16' }, [
        el('div',{class:'k',text:'EMA-Grad'}),     el('div',{class:'v',text: sueRow?.['EMA-Grad (EN 50131)'] || '—'}),
        el('div',{class:'k',text:'Min. RC-Tür'}),  el('div',{class:'v',text: sueRow?.['Min. RC-Tür'] || '—'}),
        el('div',{class:'k',text:'Min. Verglasung'}),el('div',{class:'v',text: sueRow?.['Min. Verglasung'] || '—'}),
        el('div',{class:'k',text:'NSL-Aufschaltung'}),el('div',{class:'v',text: sueRow?.['NSL-Aufschaltung'] || '—'}),
        el('div',{class:'k',text:'Intervention'}), el('div',{class:'v',text: sueRow?.['Empf. Intervention'] || '—'}),
        el('div',{class:'k',text:'Versicherung'}), el('div',{class:'v',text: sueRow?.['Versicherung'] || '—'}),
        el('div',{class:'k',text:'Risiko-Punkte'}),el('div',{class:'v',text: r.total + ' Punkte aus deinen Angaben'}),
      ]);
      card.appendChild(kv);

      // Reasoning
      const reasoning = el('div', { class:'mt-16' });
      reasoning.appendChild(el('h4', { text: 'Begründung' }));
      if (r.detail.length) {
        const ul = el('ul', { style:'color:var(--text-dim); font-size:13px' });
        r.detail.forEach(it => ul.appendChild(el('li', { text: `${it.opt} (+${it.pts} Pkt) – ${it.step}` })));
        reasoning.appendChild(ul);
      } else {
        reasoning.appendChild(el('p', { class:'muted small', text:'Basisrisiko nach Objekttyp.' }));
      }
      card.appendChild(reasoning);

      const btnBar = el('div', { class:'row mt-16' });
      const go = el('button', { class:'btn primary', html:'<i class="fas fa-sliders"></i> Komponenten-Vorschlag öffnen' });
      go.addEventListener('click', () => {
        // Pre-select in konfigurator and navigate
        if (window.KFG && KFG.setSue) KFG.setSue(r.sue, answerFactor());
        location.hash = '#konfigurator';
      });
      const reset = el('button', { class:'btn ghost', html:'<i class="fas fa-rotate-left"></i> Neu starten' });
      reset.addEventListener('click', () => {
        answers = {}; currentStep = 0;
        localStorage.removeItem(STATE_KEY);
        render2();
      });
      btnBar.appendChild(go); btnBar.appendChild(reset);
      card.appendChild(btnBar);
      resultHost.appendChild(card);
    }

    function answerFactor() {
      const o = STEPS.find(s => s.key === 'groesse').options.find(o => o.v === answers.groesse);
      return o?.factor || 1.0;
    }

    render2();
    return root;
  }

  return { render };
})();
