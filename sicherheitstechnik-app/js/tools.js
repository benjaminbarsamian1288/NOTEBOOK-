/* Tools: Quick-Calculators, Glossar, Quiz, Bookmarks */
window.TOOLS = (() => {
  const { el, fmtEUR, toast } = U;

  // ============== CALCULATORS ==============
  function calculators(d) {
    const root = el('div');
    root.appendChild(el('div', { class:'view-head' }, [
      el('span', { class:'crumb', text:'Schnellrechner' }),
      el('h1', { text:'Calculator-Suite' }),
      el('p', { text:'Konkrete Mengen- und Bedarfsrechner: Bewegungsmelder pro Raum, Glasflächen, Zäune, Magnetkontakte, Rauchmelder, Sicherheitstüren. Mit Preisbereich aus der Preisliste.' })
    ]));

    const grid = el('div', { class:'grid cols-2' });

    // 1. PIR pro Raum
    grid.appendChild(buildCalc({
      icon: 'fa-eye', title: 'PIR-Melder pro Raum',
      inputs: [
        { id:'flaeche', label:'Raumfläche (m²)', value:20, min:5, max:1000, step:1 },
        { id:'reichweite', label:'PIR-Reichweite (m)', value:12, min:6, max:30, step:1 },
      ],
      compute: (v) => {
        // PIR covers a 90° cone of length r → area ~ r²·π/4
        const cover = Math.PI * v.reichweite * v.reichweite / 4;
        const n = Math.max(1, Math.ceil(v.flaeche / cover));
        const p = findP(d, 'PIR-Melder Standard');
        return { qty: n, label: `PIR-Melder Standard`, product: p };
      }
    }));

    // 2. Magnetkontakte
    grid.appendChild(buildCalc({
      icon: 'fa-magnet', title: 'Öffnungsmelder',
      inputs: [
        { id:'tueren', label:'Anzahl Außentüren', value:2, min:0, max:50, step:1 },
        { id:'fenster', label:'Anzahl Fenster (EG)', value:6, min:0, max:200, step:1 },
        { id:'dachfenster', label:'Dachfenster / oben', value:2, min:0, max:100, step:1 },
      ],
      compute: (v) => {
        const n = v.tueren + v.fenster + (v.dachfenster*0.5|0);
        const p = findP(d, 'Magnetkontakt AP');
        return { qty: n, label:`Magnetkontakte gesamt`, product: p };
      }
    }));

    // 3. Glasflächen
    grid.appendChild(buildCalc({
      icon: 'fa-window-maximize', title: 'Glasbruchmelder',
      inputs: [
        { id:'raeume', label:'Räume mit Glasflächen', value:3, min:1, max:50, step:1 },
        { id:'methode', label:'Methode: 1=Passiv-akustisch / 2=Aktiv-Folie', value:1, min:1, max:2, step:1 },
      ],
      compute: (v) => {
        if (v.methode === 2) {
          const scheiben = v.raeume * 2;
          return { qty: scheiben, label:'Aktiv-Folien (pro Scheibe)', product: findP(d, 'Aktiv Folie') };
        }
        return { qty: v.raeume, label:'Passiv-akustische Melder (6m Radius)', product: findP(d, 'Passiv akustisch') };
      }
    }));

    // 4. Rauchmelder
    grid.appendChild(buildCalc({
      icon: 'fa-fire', title: 'Rauchmelder nach DIN 14676',
      inputs: [
        { id:'zimmer', label:'Schlaf-/Kinder-/Wohnzimmer', value:3, min:0, max:30, step:1 },
        { id:'flure', label:'Flure / Treppenhäuser', value:1, min:0, max:30, step:1 },
        { id:'kueche', label:'Küchen (Thermomelder)', value:1, min:0, max:10, step:1 },
      ],
      compute: (v) => {
        const r = v.zimmer + v.flure;
        const t = v.kueche;
        return {
          qty: r,
          label: `${r}× Rauchmelder${t ? ` + ${t}× Thermomelder Küche` : ''}`,
          product: findP(d, 'Optischer Rauchmelder'),
          extra: t ? { qty: t, product: findP(d, 'Thermischer Melder') } : null
        };
      }
    }));

    // 5. Zaunlänge
    grid.appendChild(buildCalc({
      icon: 'fa-grip', title: 'Perimeter-Zaun',
      inputs: [
        { id:'umfang', label:'Grundstücks-Umfang (m)', value:200, min:10, max:5000, step:10 },
        { id:'typ', label:'Zauntyp: 1=DopStab 6/5/6, 2=DopStab 8/6/8, 3=358 Mesh', value:1, min:1, max:3, step:1 },
      ],
      compute: (v) => {
        const map = {1:'Doppelstabmatte 6/5/6', 2:'Doppelstabmatte 8/6/8', 3:'358 Mesh Anti-Climb'};
        return { qty: v.umfang, label: `${v.umfang}m ${map[v.typ]}`, product: findP(d, map[v.typ]), unit:'lfm' };
      }
    }));

    // 6. Sicherheitstüren
    grid.appendChild(buildCalc({
      icon: 'fa-door-closed', title: 'Sicherheitstüren',
      inputs: [
        { id:'tueren', label:'Anzahl Türen', value:2, min:1, max:50, step:1 },
        { id:'rc', label:'RC-Klasse (2..6)', value:3, min:2, max:6, step:1 },
      ],
      compute: (v) => {
        return { qty: v.tueren, label:`Sicherheitstür RC ${v.rc}`, product: findP(d, `Sicherheitstür RC ${v.rc}`) };
      }
    }));

    // 7. Zaunsensorik
    grid.appendChild(buildCalc({
      icon: 'fa-tower-broadcast', title: 'Zaunsensorik',
      inputs: [
        { id:'meter', label:'Zaunlänge mit Sensorik (m)', value:200, min:50, max:10000, step:10 },
      ],
      compute: (v) => ({ qty: v.meter, label: 'Mikrophonische Zaunsensorik', product: findP(d, 'Zaunsensorik mikrophon.'), unit:'lfm' })
    }));

    // 8. IR-Lichtschranke
    grid.appendChild(buildCalc({
      icon: 'fa-arrows-left-right', title: 'Lichtschranken',
      inputs: [
        { id:'paare', label:'Anzahl Sender/Empfänger-Paare', value:4, min:1, max:50, step:1 },
        { id:'aussen', label:'Außen (1) oder Innen (0)?', value:1, min:0, max:1, step:1 },
      ],
      compute: (v) => ({
        qty: v.paare,
        label: v.aussen ? 'IR-Lichtschranke außen' : 'IR-Lichtschranke innen',
        product: findP(d, v.aussen ? 'IR-Lichtschranke außen' : 'IR-Lichtschranke innen'),
        unit: 'Paar'
      })
    }));

    root.appendChild(grid);
    return root;
  }

  function findP(d, name) {
    return d.preisliste.rows.find(r => (r['Produkt']||'').toLowerCase().includes(name.toLowerCase()));
  }

  function buildCalc(cfg) {
    const card = el('div', { class:'card' });
    card.appendChild(el('div', { class:'card-h' }, [
      el('div', { class:'ico', html: `<i class="fas ${cfg.icon}"></i>` }),
      el('h3', { text: cfg.title })
    ]));
    const inputs = {};
    cfg.inputs.forEach(i => {
      const row = el('div', { class:'kv-grid', style:'grid-template-columns: 1fr 120px' });
      row.appendChild(el('div', { class:'k', text: i.label, style:'align-self:center' }));
      const inp = el('input', { class:'input', type:'number', value:String(i.value), min:String(i.min), max:String(i.max), step:String(i.step) });
      inp.addEventListener('input', recalc);
      inputs[i.id] = inp;
      row.appendChild(inp);
      card.appendChild(row);
    });
    const output = el('div', { class:'mt-12' });
    card.appendChild(output);
    function recalc() {
      const v = {};
      Object.entries(inputs).forEach(([k, n]) => v[k] = +n.value || 0);
      const r = cfg.compute(v);
      const lo = +r.product?.['Preis von (€)']||0;
      const hi = +r.product?.['Preis bis (€)']||lo;
      output.innerHTML = '';
      output.appendChild(el('div', { class:'kfg-row' }, [
        el('div', {}, [
          el('div', { class:'bold', text: r.label }),
          el('div', { class:'small muted', text: r.product ? `${r.product['Bereich']} · ${r.product['Produkt']}` : 'Produkt nicht gefunden' })
        ]),
        el('div', { class:'qty', text: `× ${r.qty}${r.unit ? ' '+r.unit : ''}` }),
        el('div', { class:'sub-price', text: r.product ? `${fmtEUR(lo*r.qty)} – ${fmtEUR(hi*r.qty)}` : '—' })
      ]));
      if (r.extra && r.extra.product) {
        const lo2 = +r.extra.product['Preis von (€)']||0, hi2 = +r.extra.product['Preis bis (€)']||lo2;
        output.appendChild(el('div', { class:'kfg-row mt-12' }, [
          el('div', { text: r.extra.product['Produkt'] }),
          el('div', { class:'qty', text: `× ${r.extra.qty}` }),
          el('div', { class:'sub-price', text: `${fmtEUR(lo2*r.extra.qty)} – ${fmtEUR(hi2*r.extra.qty)}` })
        ]));
      }
    }
    recalc();
    return card;
  }

  // ============== GLOSSAR ==============
  const GLOSSAR = [
    ['PIR', 'Passiv-Infrarot', 'Passiver Bewegungsmelder, der die Wärmestrahlung (8–14 µm) bewegter Wärmequellen erfasst. Eine Fresnel-Linse teilt das Sichtfeld in Zonen, das pyroelektrische Element erzeugt Spannungsänderungen bei Bewegung.'],
    ['MW', 'Mikrowelle / Doppler-Radar', 'Aktiver Sensor (10,525 GHz), der über die Doppler-Frequenzverschiebung Bewegung erkennt. Durchdringt Glas/Holz, anfällig für Fehlalarme durch Leuchtstoffröhren.'],
    ['Dualmelder', 'Dual-Tech-Bewegungsmelder', 'PIR + Mikrowelle in einem Gehäuse, AND-verknüpft – beide Sensoren müssen auslösen, ergibt bis 95 % weniger Fehlalarme.'],
    ['VdS', 'Verband der Sachversicherer', 'Deutsche Prüfinstitution für Sicherheitstechnik. VdS-Anerkennung ist oft Versicherungsvoraussetzung. Wichtige Richtlinien: VdS 2311, 2312, 2333, 3138.'],
    ['EMA', 'Einbruchmeldeanlage', 'Gesamtanlage zur Detektion und Alarmierung. Komponenten: Zentrale, Melder, Bedienteile, Signalgeber, Übertragungstechnik. Norm: DIN VDE 0833-3, DIN EN 50131.'],
    ['BMA', 'Brandmeldeanlage', 'Anlage zur Branddetektion mit Rauch-, Wärme- oder Flammenmeldern. Norm: DIN 14675, DIN EN 54.'],
    ['ZKA', 'Zutrittskontrollanlage', 'Anlage zur Steuerung von Zutrittsberechtigungen via RFID, PIN, Biometrie. Norm: DIN EN 60839-11-1.'],
    ['NSL', 'Notruf- und Service-Leitstelle', 'Aufschaltstelle, die EMA/BMA-Alarme empfängt und Intervention auslöst. Klassen A (Wohnen), B (Gewerbe), C (Hochsicherheit). VdS 3138.'],
    ['AÜA', 'Alarmübertragungsanlage', 'Übertragung des Alarms zur NSL. IP, GSM/LTE, Dual-Path (IP+GSM) für höhere Sicherheit. VdS 2463.'],
    ['Aufschaltung', 'NSL-Aufschaltung', 'Vertragliche Bindung an eine NSL. Ab SÜ 2 empfohlen, ab SÜ 3 oft Pflicht.'],
    ['RC', 'Resistance Class', 'Widerstandsklasse für Einbruchhemmung nach DIN EN 1627–1630. RC 1 N (Gelegenheitstäter, ohne Werkzeug) bis RC 6 (höchstwirksamer Schutz, 20 Min. Prüfzeit).'],
    ['SÜ', 'Sicherungsklasse / Sicherungsgrad', 'VdS-Einstufung des Schutzbedarfs (SÜ 1 = Wohnung bis SÜ 6 = staatlich). Bestimmt Anforderungen an EMA, RC, Verglasung, NSL.'],
    ['SG', 'Sicherungsgrad', 'Veraltete Bezeichnung, äquivalent zu SÜ.'],
    ['Grad 1-4', 'EMA-Grad nach EN 50131-1', 'Risiko-Einstufung: Grad 1 (Gelegenheit) bis Grad 4 (organisiert/professionell). Bestimmt Sabotage-, Übertragungs- und Verschlüsselungsanforderungen.'],
    ['P1A–P8B', 'Angriffhemmende Verglasung', 'EN 356 Verglasungs-Klassen, basiert auf Kugelfalltest und Axtschlägen. P1A (Privathäuser) bis P8B (Höchstsicherheit), darüber BR4–BR7 (beschusshemmend, EN 1063).'],
    ['Reed-Kontakt', 'Magnetischer Schließkontakt', 'Zwei dünne magnetisierbare Zungen in einer Glasampulle, die durch ein externes Magnetfeld geschlossen werden. Bei Öffnen der Tür → Stromkreis offen → Alarm.'],
    ['Schließblechkontakt', 'Riegelschaltkontakt', 'Erkennt im Gegensatz zum Magnetkontakt nicht ob die Tür zu, sondern ob sie tatsächlich verriegelt ist. Ab SÜ 3 Pflicht. VdS 2269.'],
    ['Anti-Masking', 'Sabotage-Schutz', 'PIR-Funktion, die Verdecken oder Übermalen der Linse erkennt. Ab SÜ 4 gefordert.'],
    ['Doppler-Effekt', 'Frequenzverschiebung', 'Frequenz einer reflektierten Welle ändert sich, wenn sich das Objekt zum Sensor bewegt. Grundlage von Mikrowellen- und Ultraschallmeldern.'],
    ['Fresnel-Linse', 'Stufenlinse', 'Plastik-Linse vor PIR-Sensor, die das Sichtfeld in Zonen aufteilt – jede Zone fokussiert auf das Sensorelement.'],
    ['Piezokeramik', 'Piezoelektrisches Element', 'Material, das mechanische Vibration in elektrische Spannung wandelt. Basis von Erschütterungsmeldern und Körperschallsensoren.'],
    ['Pyroelektrisch', 'Wärmeempfindliches Element', 'Sensor (LiTaO₃-Kristall) im PIR-Melder, der bei Temperaturänderung Ladung erzeugt.'],
    ['ASD', 'Ansaugrauchmelder', 'Rauchansaugsystem mit Laser-Detektion, hochempfindlich, bis 2000 m² Fläche. DIN EN 54-20.'],
    ['IWA 14-1', 'Crash-Norm für HVM', 'Internationale Norm für Anti-Terror-Poller und Road-Blocker (Hostile Vehicle Mitigation). Test mit LKW bei 80 km/h.'],
    ['HVM', 'Hostile Vehicle Mitigation', 'Schutzmaßnahmen gegen Fahrzeugangriffe: Poller, Road-Blocker, Zonen-Sperrungen. PAS 68 / IWA 14-1.'],
    ['ANPR', 'Automatic Number Plate Recognition', 'Automatische Kennzeichenerkennung an Schranken und Toren.'],
    ['Dual-Path', 'Redundante Übertragung', 'Gleichzeitige Alarmübertragung über zwei Wege (IP + GSM). Ab SÜ 4 Pflicht.'],
    ['Sabotage-Schutz', 'Tamper Protection', 'Mechanische und elektronische Maßnahmen gegen Manipulation eines Melders (Deckelkontakt, Bohrschutz, Leitungsüberwachung).'],
    ['Ruhestrom-Prinzip', 'Normally Closed (NC)', 'Kontakt ist im Normalzustand geschlossen, Strom fließt. Unterbrechung (z. B. Kabelabriss) → sofort Alarm.'],
    ['Grad 2 / Klasse A', 'Versicherungsklasse', 'VdS-Klassifizierung der EMA-Anlage für Privatobjekte. Klasse B = Gewerbe, Klasse C = Hochsicherheit.'],
    ['BR4-NS', 'Beschusshemmend', 'EN 1063 Klasse: hält .44 Magnum stand. Für Botschaften, Bargeldtransporte.'],
    ['Telenot', 'Hersteller', 'Deutscher Hersteller von EMA-Zentralen, Bedienteilen, Übertragung. VdS-zertifiziert.'],
    ['Bosch', 'Hersteller', 'Bewegungsmelder, EMA, BMA, Videotechnik – breites Portfolio, VdS-anerkannt.'],
    ['Honeywell', 'Hersteller', 'EMA-Komponenten, Brandmeldetechnik, Zutrittskontrolle.'],
    ['Ajax', 'Hersteller', 'Funkbasierte EMA-Systeme, primär Wohnen / kleines Gewerbe.'],
    ['DIN EN 1627', 'Einbruchhemmung', 'Klassifizierung von einbruchhemmenden Bauteilen (Türen, Fenster). Definiert RC 1 N bis RC 6.'],
    ['DIN EN 50131', 'EMA-Norm', 'Europäische Normenreihe für Einbruchmeldeanlagen. -1 = Allgemein, -2-2 PIR, -2-3 MW, -2-4 Dual, etc.'],
    ['DIN EN 54', 'BMA-Norm', 'Normenreihe für Brandmeldeanlagen. -7 optisch, -5 Wärme, -10 Flamme, -20 ASD.'],
  ];

  function glossar() {
    const root = el('div');
    root.appendChild(el('div', { class:'view-head' }, [
      el('span', { class:'crumb', text:'Wissen' }),
      el('h1', { text:'Glossar – Begriffe der Sicherheitstechnik' }),
      el('p', { text: GLOSSAR.length + ' Fachbegriffe, Abkürzungen, Normen und Hersteller erklärt. Live-Filter.' })
    ]));
    const inp = el('input', { class:'input', placeholder:'Suche im Glossar...', style:'width:100%; margin-bottom: 12px' });
    root.appendChild(inp);
    const list = el('div', { class:'grid cols-2' });
    root.appendChild(list);
    function rerender(q='') {
      list.innerHTML = '';
      const ql = q.toLowerCase();
      const items = ql ? GLOSSAR.filter(([a,b,c]) => (a+b+c).toLowerCase().includes(ql)) : GLOSSAR;
      items.forEach(([abbr, full, desc]) => {
        const c = el('div', { class:'card' });
        c.appendChild(el('div', { class:'card-h' }, [
          el('div', { class:'ico', html: '<i class="fas fa-book"></i>' }),
          el('h3', { text: abbr })
        ]));
        c.appendChild(el('div', { class:'muted small', text: full }));
        c.appendChild(el('p', { text: desc }));
        list.appendChild(c);
      });
      if (!items.length) list.appendChild(el('p', { class:'muted', text:'Keine Treffer.' }));
    }
    inp.addEventListener('input', () => rerender(inp.value));
    rerender();
    return root;
  }

  // ============== QUIZ ==============
  const QUIZ = [
    { q:'Welcher Melder kombiniert PIR und Mikrowelle AND-verknüpft?',
      o:['Anti-Masking-PIR','Dualmelder','Tierimmuner PIR','Vorhangmelder'], a:1,
      e:'Der Dualmelder kombiniert beide Technologien – Alarm nur wenn beide Sensoren auslösen, –95 % Fehlalarme.' },
    { q:'Ab welcher Sicherungsklasse ist ein Dual-Path (IP+GSM) Pflicht?',
      o:['SÜ 2','SÜ 3','SÜ 4','SÜ 5'], a:2,
      e:'Ab SÜ 4 (hohes Risiko, z. B. Banken) ist die redundante Doppel-Übertragung Pflicht.' },
    { q:'Welche Verglasung entspricht RC 3?',
      o:['P1A','P4A','P5A','P8B'], a:2,
      e:'RC 3 fordert mindestens P5A-Verglasung (9 m Kugelfalltest, VSG 16–20 mm).' },
    { q:'Welche Norm beschreibt Bewegungsmelder?',
      o:['VdS 2120','VdS 2312','VdS 2332','VdS 2480'], a:1,
      e:'VdS 2312 ist die Richtlinie für Bewegungsmelder. VdS 2120 = Magnetkontakte, 2332 = Glasbruch, 2480 = Erschütterung.' },
    { q:'Was ist der Unterschied Magnet- vs. Schließblechkontakt?',
      o:['Beide identisch','Magnet: Tür zu, Schließblech: verriegelt','Schließblech ist Funk','Magnet ist nur außen'], a:1,
      e:'Magnetkontakt = Tür zu ja/nein. Schließblech = Schloss-Riegel eingefahren ja/nein. Ab SÜ 3 beide Pflicht.' },
    { q:'Welche Frequenz nutzt ein klassischer MW-Melder?',
      o:['2,4 GHz','10,525 GHz','24 GHz','77 GHz'], a:1,
      e:'X-Band Radar bei 10,525 GHz – europäische ISM-Frequenz für Bewegungsmelder.' },
    { q:'Welche Norm regelt Sicherheits-Türen?',
      o:['DIN EN 356','DIN EN 1627','DIN EN 1063','DIN EN 13241'], a:1,
      e:'DIN EN 1627–1630 klassifiziert einbruchhemmende Türen (RC 1–6).' },
    { q:'Was bedeutet "Anti-Masking" bei PIR?',
      o:['Erkennt Tiere','Erkennt Verdecken/Übermalen','Erkennt Vorhänge','Erkennt Sonne'], a:1,
      e:'Anti-Masking-PIR erkennt aktiv das Abdecken oder Sprühen der Linse – ab SÜ 4 gefordert.' },
    { q:'Welche NSL-Klasse für SÜ 5 (Tresorraum)?',
      o:['Klasse A','Klasse B','Klasse C','Keine'], a:2,
      e:'Ab SÜ 5 ist Klasse C (Hochsicherheits-NSL, Dual-Path, <3 Min. Intervention) Pflicht.' },
    { q:'Welcher Brandmelder eignet sich für Serverräume?',
      o:['Optisch-Streulicht','Thermisch-Max','ASD (Ansaug)','Handfeuermelder'], a:2,
      e:'Ansaugrauchmelder (ASD) sind hochempfindlich (Laser-Detektion), ideal für Server, Archive, Museen.' },
    { q:'Welches Detektionsprinzip nutzt der Glasbruchmelder?',
      o:['Wärme','Schallanalyse: tief + hoch','UV-Licht','Magnetfeld'], a:1,
      e:'Passiver Glasbruchmelder analysiert niedrige (Aufprall) + hohe Frequenzen (Splittern) zweiphasig.' },
    { q:'Welche RC-Klasse ist für ein Einfamilienhaus üblich?',
      o:['RC 1 N','RC 2','RC 4','RC 6'], a:1,
      e:'RC 2 (3 Min. Prüfzeit, einfache Werkzeuge) ist die polizeiliche Empfehlung für EFH und Wohnungen.' },
    { q:'Was bedeutet IWA 14-1?',
      o:['PIR-Norm','Crash-Norm für Anti-Terror-Poller','Glasnorm','BMA-Norm'], a:1,
      e:'IWA 14-1 ist die internationale Norm für HVM (Hostile Vehicle Mitigation) – Poller und Road-Blocker.' },
    { q:'Welcher Sensor erkennt VOR Berührung?',
      o:['Piezo','Druckmatte','Kapazitiver Feldsensor','Wassermelder'], a:2,
      e:'Kapazitiver Feldsensor – elektrostatisches Feld erkennt Annäherung 0,5 m vor Berührung. Für Tresore, Vitrinen, Kunst.' },
    { q:'Wie viele EMA-Grade gibt es nach EN 50131?',
      o:['3','4','6','10'], a:1,
      e:'EN 50131 definiert 4 Grade: Grad 1 (niedrig) bis Grad 4 (höchst, organisierte Täter).' },
  ];

  function quiz() {
    const root = el('div');
    root.appendChild(el('div', { class:'view-head' }, [
      el('span', { class:'crumb', text:'Lernmodus' }),
      el('h1', { text:'Quiz – Sicherheitstechnik-Wissen' }),
      el('p', { text: QUIZ.length + ' Fragen über VdS-Klassen, Melder, Normen und Detektionsprinzipien. Test dein Wissen.' })
    ]));

    let i = 0, score = 0, answered = false;
    const card = el('div', { class:'card quiz-card' });
    root.appendChild(card);

    function render() {
      card.innerHTML = '';
      if (i >= QUIZ.length) {
        card.appendChild(el('div', { class:'wiz-result-h' }, [
          el('div', { class:'wiz-trophy', html: score === QUIZ.length ? '<i class="fas fa-medal"></i>' : '<i class="fas fa-shield-halved"></i>' }),
          el('div', {}, [
            el('div', { class:'muted small', text:'Ergebnis' }),
            el('h2', { class:'wiz-big', text: `${score} / ${QUIZ.length}` }),
            el('div', { class:'muted', text: score === QUIZ.length ? 'Perfekt! Du kennst dich aus.' : score >= QUIZ.length * 0.7 ? 'Sehr gut!' : score >= QUIZ.length * 0.5 ? 'Solide Grundlage.' : 'Lust auf eine zweite Runde?' })
          ])
        ]));
        const again = el('button', { class:'btn primary mt-16', html:'<i class="fas fa-rotate-right"></i> Nochmal' });
        again.addEventListener('click', () => { i=0; score=0; render(); });
        card.appendChild(again);
        return;
      }
      const q = QUIZ[i];
      card.appendChild(el('div', { class:'muted small', text: `Frage ${i+1} / ${QUIZ.length}` }));
      card.appendChild(el('h3', { text: q.q, style:'margin: 6px 0 14px' }));
      const opts = el('div', { class:'quiz-opts' });
      q.o.forEach((o, idx) => {
        const b = el('button', { class:'quiz-opt', text: `${String.fromCharCode(65+idx)}. ${o}` });
        b.addEventListener('click', () => {
          if (answered) return;
          answered = true;
          const correct = idx === q.a;
          if (correct) score++;
          opts.querySelectorAll('.quiz-opt').forEach((x, j) => {
            if (j === q.a) x.classList.add('correct');
            else if (j === idx) x.classList.add('wrong');
          });
          const ex = el('div', { class:'quiz-explain mt-12', html: `<strong>${correct ? '✓ Richtig!' : '✗ Falsch.'}</strong> ${q.e}` });
          card.appendChild(ex);
          const next = el('button', { class:'btn primary mt-12', html: (i+1 < QUIZ.length ? 'Nächste Frage <i class="fas fa-arrow-right"></i>' : 'Ergebnis <i class="fas fa-flag-checkered"></i>') });
          next.addEventListener('click', () => { i++; answered=false; render(); });
          card.appendChild(next);
        });
        opts.appendChild(b);
      });
      card.appendChild(opts);
      const bar = el('div', { class:'quiz-bar' });
      bar.appendChild(el('div', { class:'fill', style:`width:${((i/QUIZ.length)*100).toFixed(0)}%` }));
      card.appendChild(bar);
    }
    render();
    return root;
  }

  // ============== BOOKMARKS / PROJECTS ==============
  function projects() {
    const root = el('div');
    root.appendChild(el('div', { class:'view-head' }, [
      el('span', { class:'crumb', text:'Persönlich' }),
      el('h1', { text:'Meine Projekte' }),
      el('p', { text:'Gespeicherte Konfigurationen aus dem Konfigurator. Wird lokal im Browser persistiert (kein Cloud-Sync).' })
    ]));
    const list = el('div');
    root.appendChild(list);
    function rerender() {
      let ps = [];
      try { ps = JSON.parse(localStorage.getItem('st-projects') || '[]'); } catch {}
      list.innerHTML = '';
      if (!ps.length) {
        list.appendChild(el('p', { class:'muted', text:'Noch keine Projekte gespeichert. Öffne den Konfigurator, stelle eine SÜ-Klasse ein und tippe „Projekt speichern".' }));
        return;
      }
      const grid = el('div', { class:'grid cols-2' });
      ps.forEach((p, idx) => {
        const c = el('div', { class:'card' });
        c.appendChild(el('div', { class:'card-h' }, [
          el('div', { class:'ico', html: '<i class="fas fa-folder"></i>' }),
          el('h3', { text: p.name })
        ]));
        const kv = el('div', { class:'kv-grid mt-12' }, [
          el('div',{class:'k',text:'Klasse'}),     el('div',{class:'v',text:'SÜ '+p.sue}),
          el('div',{class:'k',text:'Skalierung'}), el('div',{class:'v',text:p.factor.toFixed(1)+'×'}),
          el('div',{class:'k',text:'Budget'}),     el('div',{class:'v',text: fmtEUR(p.lo)+' – '+fmtEUR(p.hi)}),
          el('div',{class:'k',text:'Erstellt'}),   el('div',{class:'v',text: new Date(p.ts).toLocaleString('de-DE')}),
        ]);
        c.appendChild(kv);
        const bar = el('div', { class:'row mt-16' });
        const open = el('button', { class:'btn primary', html:'<i class="fas fa-folder-open"></i> Öffnen' });
        open.addEventListener('click', () => {
          if (window.KFG) KFG.setSue(p.sue, p.factor);
          location.hash = '#konfigurator';
        });
        const del = el('button', { class:'btn ghost', html:'<i class="fas fa-trash"></i>' });
        del.addEventListener('click', () => {
          if (!confirm('Projekt „'+p.name+'" löschen?')) return;
          ps.splice(idx, 1);
          localStorage.setItem('st-projects', JSON.stringify(ps));
          rerender();
          toast('Gelöscht');
        });
        bar.appendChild(open); bar.appendChild(del);
        c.appendChild(bar);
        grid.appendChild(c);
      });
      list.appendChild(grid);
    }
    rerender();
    return root;
  }

  return { calculators, glossar, quiz, projects };
})();
