/* Themen-Hubs: 6 große Bereiche mit kuratierten Unter-Ansichten.
   window.HUBS.view(id). */
window.HUBS = (() => {
  const { el } = U;

  const HUBS = {
    'hub-welle': {
      icon: 'fa-satellite-dish', color: '#22d3ee',
      title: '📡 Wellen & Signale',
      lead: 'Alles über Wellen, Frequenzen und wie Daten in der Sicherheitstechnik übertragen werden. Vom Lichtschalter bis zur Funkwelle, vom EMA-BUS bis zur 5G-Alarmübertragung.',
      sections: [
        { label: 'Verstehen', tiles: [
          { v: 'megaspektrum', ic: 'fa-chart-line', c: '#22d3ee', t: 'Mega-Spektrum-Karte', d: '60+ Marker von 1 Hz bis Gamma · Zoom & Pan · PIR, MW, WLAN, Röntgen', tag: 'NEU' },
          { v: 'wellen', ic: 'fa-wave-square', c: '#22d3ee', t: 'Wellen einfach erklärt', d: 'Was ist Frequenz, Wellenlänge, λ·f=c – mit Animationen und Alltagsvergleichen' },
          { v: 'daten', ic: 'fa-ethernet', c: '#a855f7', t: 'Datenübertragung Deep-Dive', d: 'Spannungspulse, Bandbreite, Bits → Bild, Störung – animiert' },
        ]},
        { label: 'Nachschlagen', tiles: [
          { v: 'freqtab', ic: 'fa-table-list', c: '#fbbf24', t: 'Frequenzen & Datenraten', d: '44 Frequenz-Beispiele · 15 Datenraten · Lade-Zeit für 11 Datei-Typen' },
          { v: 'spektrum', ic: 'fa-wave-square', c: '#38bdf8', t: 'Spektrum (alt · animiert)', d: '11 Bänder mit 3D-Wellen, Slider, Farb-Spektrum' },
        ]},
      ]
    },
    'hub-schutz': {
      icon: 'fa-shield-halved', color: '#22c55e',
      title: '🛡 Klassen & Schutz',
      lead: 'Sicherungsklassen, EMA-Grade, RC-Widerstandsklassen — was bedeutet was, welche Norm gilt, wie viel kostet welches Niveau. Plus die Schutzzonen-Ansicht.',
      sections: [
        { label: 'Klassen verstehen', tiles: [
          { v: 'klassenlive', ic: 'fa-medal', c: '#22c55e', t: 'SÜ · Grade · RC · Live', d: 'Tür mit Einbruchs-Animation, Pyramide, große Karten, Vergleich', tag: 'NEU' },
          { v: 'klassen', ic: 'fa-medal', c: '#84cc16', t: 'Klassen-Tabellen (alt)', d: 'Vollständige Daten-Tabellen aller SÜ, Grade, RC' },
        ]},
        { label: 'Schutzkonzept', tiles: [
          { v: 'konzept', ic: 'fa-circle-dot', c: '#22c55e', t: 'Zwiebel-Schutzkonzept', d: '4 Zonen: Perimeter → Außenhaut → Innen → Wertschutz' },
          { v: 'zwiebel3d', ic: 'fa-globe', c: '#a3e635', t: '3D-Zwiebelmodell', d: 'Interaktives 3D-Modell der 4 Schutzzonen' },
          { v: 'haus3d', ic: 'fa-house-chimney', c: '#fbbf24', t: 'Sicherheits-Haus 3D', d: 'Vom Zaun bis zum Tresor in 3D' },
        ]},
        { label: 'Komponenten je Zone', tiles: [
          { v: 'perimeter', ic: 'fa-border-all', c: '#22c55e', t: 'Perimeter · Zone 1', d: 'Zäune, Tore, Schranken, Poller' },
          { v: 'aussenhaut', ic: 'fa-door-closed', c: '#84cc16', t: 'Außenhaut · Zone 2', d: 'Türen, Fenster, Verglasung (RC, Pn)' },
          { v: 'melder', ic: 'fa-bell', c: '#fbbf24', t: 'Melder · Zone 3', d: 'PIR, MW, Dual, Glasbruch, Erschütterung' },
          { v: 'mechanik', ic: 'fa-vault', c: '#f97316', t: 'Mechanik · Zone 4', d: 'Tresore, Wertschutzschränke, Zylinder' },
        ]},
      ]
    },
    'hub-technik': {
      icon: 'fa-microchip', color: '#a855f7',
      title: '🛠 Technik & Geräte',
      lead: 'EMA-Zentralen, NSL-Aufschaltung, Videotechnik, Zutrittskontrolle. Alles was die Sicherheitstechnik elektrisch macht.',
      sections: [
        { label: 'Systeme', tiles: [
          { v: 'ema', ic: 'fa-tower-broadcast', c: '#a855f7', t: 'EMA · ZKA · NSL', d: 'Zentralen, Bedienteile, Übertragung, Aufschaltung' },
          { v: 'videotechnik', ic: 'fa-video', c: '#ef4444', t: 'Videotechnik Detail', d: 'Aufnahme, analog/IP, Recorder, Kabel – animiert' },
          { v: 'wwd', ic: 'fa-tower-cell', c: '#fbbf24', t: 'WWD Video-Türme', d: 'KI-Auswertung, 24/7-Leitstelle' },
          { v: 'wwdtech', ic: 'fa-tower-cell', c: '#f97316', t: 'WWD-Türme · Technik', d: 'Bitübertragung in Türmen erklärt' },
        ]},
        { label: 'Kataloge', tiles: [
          { v: 'masterency', ic: 'fa-book-open-reader', c: '#22d3ee', t: 'Komplett-Katalog', d: '142 Komponenten durchsuchbar' },
          { v: 'enzyklopaedie', ic: 'fa-flask', c: '#a855f7', t: 'Melder-Enzyklopädie', d: 'Detektor-Typen erklärt' },
          { v: 'mechency', ic: 'fa-flask-vial', c: '#fbbf24', t: 'Mechanik-Enzyklopädie', d: '50+ Komponenten · Vergleich' },
          { v: 'galerie', ic: 'fa-images', c: '#22c55e', t: 'Produkt-Galerie', d: 'Echte Produktfotos nach Hersteller' },
        ]},
      ]
    },
    'hub-recht': {
      icon: 'fa-gavel', color: '#fbbf24',
      title: '⚖️ Recht & Normen',
      lead: 'BeWachV, DGUV, KRITIS, NIS-2, GewO §34a, WaffG, BGB, StGB — alle Sicherheits-Gesetze an einem Ort. Plus Notizbuch und Sachkunde-Training.',
      sections: [
        { label: 'Gesetze', tiles: [
          { v: 'gesetze', ic: 'fa-gavel', c: '#fbbf24', t: 'Gesetze-Katalog', d: '12 Gesetze · 264 §§ · Praxisfälle · Suchen' },
        ]},
        { label: 'Lernen & Üben', tiles: [
          { v: 'praesentation', ic: 'fa-person-chalkboard', c: '#22d3ee', t: 'Slideshow + Tagesplan', d: '5 §§ pro Tag · Streak · Vorlesen · Marker' },
          { v: 'notebook', ic: 'fa-bookmark', c: '#a855f7', t: 'Mein Notizbuch', d: 'Gepinnte Inhalte als eigenes Deck' },
          { v: 'pruefung', ic: 'fa-graduation-cap', c: '#22c55e', t: 'Sachkunde §34a Training', d: '35 Prüfungsfragen' },
        ]},
      ]
    },
    'hub-planen': {
      icon: 'fa-pen-ruler', color: '#38bdf8',
      title: '🛠 Planen & Berechnen',
      lead: 'Werkzeuge zum Planen einer Anlage: Pläne zeichnen, Sensoren platzieren, Reichweiten und Preise rechnen.',
      sections: [
        { label: 'Werkzeuge', tiles: [
          { v: 'plan', ic: 'fa-pen-ruler', c: '#38bdf8', t: 'Plan zeichnen (Stift)', d: 'Mit S-Pen skizzieren + Stempel' },
          { v: 'sandbox', ic: 'fa-vector-square', c: '#22d3ee', t: 'Objekt-Planer (Sandbox)', d: 'Sensoren setzen → Heatmap' },
          { v: 'fp', ic: 'fa-vector-square', c: '#a855f7', t: 'Plan-Designer', d: 'Grundriss + Komponenten platzieren' },
          { v: 'building3d', ic: 'fa-cube', c: '#fbbf24', t: '3D-Gebäudeplaner', d: 'Isometrisches Haus, rotierbar' },
        ]},
        { label: 'Rechnen & Beraten', tiles: [
          { v: 'wizard', ic: 'fa-wand-magic-sparkles', c: '#22c55e', t: 'Sicherheits-Assistent', d: 'Fragen → SÜ-Empfehlung' },
          { v: 'konfigurator', ic: 'fa-sliders', c: '#22d3ee', t: 'Konfigurator', d: 'Schutz-Stack mit Richtpreis' },
          { v: 'calculators', ic: 'fa-calculator', c: '#fbbf24', t: 'Calculator-Suite', d: 'Live-Rechner Mengen + Preise' },
          { v: 'lab', ic: 'fa-flask', c: '#f97316', t: 'Engineering-Lab', d: '12 Fach-Rechner: Linsen, Akku, Kabel …' },
          { v: 'preisliste', ic: 'fa-euro-sign', c: '#22c55e', t: 'Preisliste', d: 'Richtpreise aller Komponenten' },
        ]},
      ]
    },
    'hub-erleben': {
      icon: 'fa-gamepad', color: '#ef4444',
      title: '🎬 Erleben & Lernen',
      lead: 'Sicherheitstechnik zum Anfassen: 3D-Spiel, Begehung, Physik live, Quiz, Mediathek.',
      sections: [
        { label: '3D & Spiele', tiles: [
          { v: 'game3d', ic: 'fa-gamepad', c: '#ef4444', t: 'Einbruch-Spiel 3D', d: 'Perimeter → Außenhaut → Tresor, ohne Alarm' },
          { v: 'begehung', ic: 'fa-person-walking', c: '#fbbf24', t: '3D-Begehung (Ego)', d: 'Lauf durchs Objekt, weich den Sensoren aus' },
          { v: 'werk', ic: 'fa-industry', c: '#a855f7', t: 'Sicherheits-Werk', d: 'Virtueller Industriestandort' },
        ]},
        { label: 'Lernen', tiles: [
          { v: 'physik', ic: 'fa-atom', c: '#22d3ee', t: 'Physik Live · 29 Sims', d: 'Leitstand, Nebel, Drohne, FFT, Drehkreuz …' },
          { v: 'sensoren', ic: 'fa-mobile-screen-button', c: '#22c55e', t: 'Handy als Sensor', d: 'Mikro, Bewegung & Kamera live' },
          { v: 'vergleich', ic: 'fa-table-cells-large', c: '#fbbf24', t: 'Melder-Vergleich', d: 'PIR vs MW vs Dual vs Schranke' },
          { v: 'quiz', ic: 'fa-graduation-cap', c: '#a855f7', t: 'Quiz · Lernmodus', d: 'Teste dein Wissen' },
          { v: 'glossar', ic: 'fa-book', c: '#22d3ee', t: 'Glossar', d: 'Fachbegriffe A-Z' },
          { v: 'mediathek', ic: 'fa-photo-film', c: '#ef4444', t: 'Mediathek', d: 'Alle Bilder + Animationen' },
        ]},
      ]
    },
  };

  function view(id) {
    const hub = HUBS[id];
    const root = el('div', { class: 'hub-wrap' });
    if (!hub) { root.appendChild(el('div', { text: 'Hub nicht gefunden' })); return root; }
    root.style.setProperty('--a', hub.color);

    const hero = el('div', { class: 'hub-hero' });
    hero.appendChild(el('div', { class: 'hub-hero-ic', html: `<i class="fas ${hub.icon}"></i>` }));
    const heroT = el('div', { style: 'flex:1' });
    heroT.appendChild(el('h1', { text: hub.title }));
    heroT.appendChild(el('p', { text: hub.lead }));
    hero.appendChild(heroT);
    root.appendChild(hero);

    hub.sections.forEach(sec => {
      root.appendChild(el('div', { class: 'hub-section-label', text: sec.label }));
      const grid = el('div', { class: 'hub-grid' });
      sec.tiles.forEach(t => {
        const tile = el('button', { class: 'hub-tile', type: 'button', style: `--c:${t.c}` });
        tile.appendChild(el('div', { class: 'hub-tile-ic', html: `<i class="fas ${t.ic}"></i>` }));
        const body = el('div', { class: 'hub-tile-body' }, [
          el('strong', { text: t.t }),
          el('span', { text: t.d }),
        ]);
        if (t.tag) body.appendChild(el('span', { class: 'hub-tile-tag', text: t.tag }));
        tile.appendChild(body);
        tile.appendChild(el('i', { class: 'fas fa-arrow-right hub-tile-go' }));
        tile.addEventListener('click', () => { location.hash = '#' + t.v; });
        grid.appendChild(tile);
      });
      root.appendChild(grid);
    });
    return root;
  }

  return { view, HUBS };
})();
