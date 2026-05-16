/* Auto-Explainer · generiert für JEDE Komponente eine generische Animation
   Wird beim App-Start einmal ausgeführt
   Nutzt die existierende SVG (mit eingebauten SMIL-Animationen) + 4 Status-Steps */

(function() {
  if (!window.EXPL) return;

  /* Liste aller Komponenten-Quellen */
  function gatherAll() {
    const all = [];
    if (window.MECH_ENCY && MECH_ENCY.LIST) {
      MECH_ENCY.LIST.forEach(m => all.push({
        ...m,
        kategorie: m.kat,
        wzeit: m.wzeit || '—',
      }));
    }
    if (window.KATALOG) {
      ['VIDEO_DB','BRAND_DB','ZKA_DB','EMA_DB'].forEach(dbKey => {
        const db = KATALOG[dbKey];
        if (!db) return;
        const kat = dbKey === 'VIDEO_DB' ? 'Video' : dbKey === 'BRAND_DB' ? 'Brandschutz' : dbKey === 'ZKA_DB' ? 'Zutritt' : 'Alarmierung';
        db.forEach(m => all.push({ ...m, kategorie: kat, wzeit: m.wzeit || '—' }));
      });
    }
    return all;
  }

  /* Auto-Generator: nimmt die SVG der Komponente + baut 4 generische Status-Steps drum */
  function makeAuto(m) {
    // Idee: wir stecken die existierende SVG in einen Container
    // und legen 4 farbige Status-Banner darüber, die sequentiell sichtbar werden

    // SVG extrahieren (nur innerSVG, viewBox)
    const svgMatch = m.svg ? m.svg.match(/<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>/) : null;
    if (!svgMatch) return null;
    const [, viewBox, innerSvg] = svgMatch;

    // Status-Texte je Kategorie
    const states = statesFor(m);

    const composedSvg = `
      <svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" class="expl-svg" preserveAspectRatio="xMidYMid meet">
        ${innerSvg}
        <!-- Status-Overlays (oben) -->
        <g id="auto-s1" opacity="0">
          <rect x="6" y="6" width="${parseFloat(viewBox.split(' ')[2]) - 12}" height="22" rx="4" fill="${states[0].c}" opacity=".92"/>
          <text x="${parseFloat(viewBox.split(' ')[2]) / 2}" y="22" text-anchor="middle" font-size="11" fill="#0b1424" font-family="system-ui" font-weight="900">${states[0].t}</text>
        </g>
        <g id="auto-s2" opacity="0">
          <rect x="6" y="6" width="${parseFloat(viewBox.split(' ')[2]) - 12}" height="22" rx="4" fill="${states[1].c}" opacity=".92">
            <animate attributeName="opacity" values=".7;1;.7" dur="1s" repeatCount="indefinite"/>
          </rect>
          <text x="${parseFloat(viewBox.split(' ')[2]) / 2}" y="22" text-anchor="middle" font-size="11" fill="${states[1].text === 'white' ? 'white' : '#0b1424'}" font-family="system-ui" font-weight="900">${states[1].t}</text>
        </g>
        <g id="auto-s3" opacity="0">
          <rect x="6" y="6" width="${parseFloat(viewBox.split(' ')[2]) - 12}" height="22" rx="4" fill="${states[2].c}" opacity=".92">
            <animate attributeName="opacity" values=".7;1;.7" dur=".6s" repeatCount="indefinite"/>
          </rect>
          <text x="${parseFloat(viewBox.split(' ')[2]) / 2}" y="22" text-anchor="middle" font-size="11" fill="${states[2].text === 'white' ? 'white' : '#0b1424'}" font-family="system-ui" font-weight="900">${states[2].t}</text>
        </g>
        <g id="auto-s4" opacity="0">
          <rect x="6" y="6" width="${parseFloat(viewBox.split(' ')[2]) - 12}" height="22" rx="4" fill="${states[3].c}" opacity=".92">
            <animate attributeName="opacity" values=".5;1;.5" dur=".4s" repeatCount="indefinite"/>
          </rect>
          <text x="${parseFloat(viewBox.split(' ')[2]) / 2}" y="22" text-anchor="middle" font-size="11" fill="white" font-family="system-ui" font-weight="900">${states[3].t}</text>
        </g>
      </svg>
    `;

    return {
      title: m.name,
      intro: `${m.kat || m.kategorie || ''} · ${m.klasse || ''}`,
      svg: composedSvg,
      steps: [
        { t: 0,     h: ['auto-s1'],  text: `① <strong>Ruhe-/Standby-Zustand:</strong> ${m.principle || m.name + ' ist bereit für Detektion bzw. Wirkung.'}` },
        { t: 3500,  h: ['auto-s2'],  text: `② <strong>Ereignis tritt ein:</strong> ${ereignisFor(m)}` },
        { t: 7000,  h: ['auto-s3'],  text: `③ <strong>Detektion / Reaktion:</strong> ${detektionFor(m)}` },
        { t: 10500, h: ['auto-s4'],  text: `④ <strong>Aktion / Alarm:</strong> ${aktionFor(m)}` },
        { t: 14000, h: [],           text: `⑤ <strong>Klasse ${m.klasse || ''}:</strong> ${m.wzeit ? 'Widerstand ' + m.wzeit + '. ' : ''}Hersteller: ${(m.hersteller || []).slice(0, 3).join(', ') || '—'}.` },
      ],
      cycle: 17000,
    };
  }

  function statesFor(m) {
    const kat = m.kat || m.kategorie || '';
    if (kat === 'Türen' || kat === 'Tresore' || kat === 'Fenster') {
      return [
        { t:'VERSCHLOSSEN', c:'#22c55e' },
        { t:'WERKZEUG-ANGRIFF', c:'#fbbf24' },
        { t:'WIDERSTAND ' + (m.wzeit || ''), c:'#ea580c' },
        { t:'⚠ AUFBRUCH-VERSUCH GEMELDET', c:'#dc2626' },
      ];
    }
    if (kat === 'Brandschutz') {
      return [
        { t:'ÜBERWACHUNG AKTIV', c:'#22c55e' },
        { t:'BRAND-INDIZ', c:'#fbbf24' },
        { t:'DETEKTION BESTÄTIGT', c:'#ea580c' },
        { t:'⚠ FEUERWEHR ALARMIERT', c:'#dc2626' },
      ];
    }
    if (kat === 'Zutritt') {
      return [
        { t:'BEREIT', c:'#22c55e' },
        { t:'AUTH-VERSUCH', c:'#06b6d4' },
        { t:'VERIFIKATION', c:'#3b82f6' },
        { t:'✓ ZUTRITT GEWÄHRT', c:'#22c55e' },
      ];
    }
    if (kat === 'Alarmierung' || kat === 'Melder') {
      return [
        { t:'ÜBERWACHUNG', c:'#22c55e' },
        { t:'EREIGNIS DETEKTIERT', c:'#fbbf24' },
        { t:'VERIFIKATION', c:'#ea580c' },
        { t:'⚠ ALARM AUSGELÖST', c:'#dc2626' },
      ];
    }
    if (kat === 'Video') {
      return [
        { t:'KAMERA AKTIV', c:'#22c55e' },
        { t:'OBJEKT IN BILD', c:'#06b6d4' },
        { t:'KI-KLASSIFIKATION', c:'#3b82f6' },
        { t:'✓ AUFGEZEICHNET', c:'#22c55e' },
      ];
    }
    if (kat === 'Zäune' || kat === 'Tore') {
      return [
        { t:'GESCHLOSSEN', c:'#22c55e' },
        { t:'KONTAKT/BEWEGUNG', c:'#fbbf24' },
        { t:'ANALYSE', c:'#ea580c' },
        { t:'⚠ PERIMETER-ALARM', c:'#dc2626' },
      ];
    }
    if (kat === 'Poller') {
      return [
        { t:'VERSENKT · FREI', c:'#22c55e' },
        { t:'FAHRZEUG ERKANNT', c:'#fbbf24' },
        { t:'POLLER FÄHRT AUS', c:'#ea580c' },
        { t:'⚠ DURCHFAHRT BLOCKIERT', c:'#dc2626' },
      ];
    }
    return [
      { t:'BEREIT', c:'#22c55e' },
      { t:'EREIGNIS', c:'#fbbf24' },
      { t:'AKTION', c:'#ea580c' },
      { t:'⚠ AUSGELÖST', c:'#dc2626' },
    ];
  }

  function ereignisFor(m) {
    const kat = m.kat || m.kategorie || '';
    if (kat === 'Türen') return 'Ein Angreifer setzt Werkzeug (Brecheisen, Schraubenzieher) an Tür oder Schloss an.';
    if (kat === 'Fenster') return 'Versuch des Aufhebelns oder Eindrückens des Fensters.';
    if (kat === 'Tresore') return 'Werkzeug- oder Bohr-Angriff auf die Tresorwand bzw. das Schloss.';
    if (kat === 'Brandschutz') return 'Rauchpartikel, Wärmestrahlung oder Flammen-Signatur trifft den Sensor.';
    if (kat === 'Zutritt') return 'Person hält Token (RFID/Bio) vor den Leser bzw. tritt an die Schleuse heran.';
    if (kat === 'Video') return 'Bewegung oder Objekt erscheint im Sichtfeld der Kamera.';
    if (kat === 'Zäune') return 'Berührung, Schnitt oder Kletterversuch am Zaun.';
    if (kat === 'Tore') return 'Fahrzeug nähert sich · ANPR liest Kennzeichen.';
    if (kat === 'Poller') return 'Unbefugtes Fahrzeug nähert sich der gesicherten Zone.';
    if (kat === 'Alarmierung' || kat === 'Melder') return 'Sensor erkennt physikalische Veränderung (Bewegung, Bruch, Druck, Magnetfeld).';
    if (kat === 'Beschläge') return 'Manipulationsversuch am Beschlag oder Schloss.';
    if (kat === 'Verglasung') return 'Wurf-, Schlag- oder Beschuss-Angriff auf das Glas.';
    return 'Sensor wird durch ein Ereignis ausgelöst.';
  }

  function detektionFor(m) {
    const kat = m.kat || m.kategorie || '';
    if (kat === 'Türen' || kat === 'Fenster') return 'Die Konstruktion widersteht dem Angriff für die geprüfte Widerstandszeit.';
    if (kat === 'Tresore') return 'Riegelwerk und Wandung halten dem Werkzeug stand. Sabotage-Sensor meldet.';
    if (kat === 'Brandschutz') return 'Auswertung des Sensorsignals — bei Schwellenüberschreitung Alarm-Trigger.';
    if (kat === 'Zutritt') return 'Berechtigung wird gegen Datenbank verifiziert (Karte, PIN, Biometrie).';
    if (kat === 'Video') return 'KI/IVS klassifiziert das Objekt (Person, Fahrzeug, Tier).';
    if (kat === 'Zäune') return 'Sensorik wertet die Schwingungs-Signatur aus (Schritt, Klettern, Schnitt).';
    if (kat === 'Tore') return 'ANPR-System gleicht Kennzeichen mit Whitelist ab.';
    if (kat === 'Poller') return 'Steuerungs-Logik prüft Berechtigung und löst Hub aus.';
    if (kat === 'Alarmierung' || kat === 'Melder') return 'EMA-Zentrale verarbeitet das Signal in &lt; 100 ms.';
    return 'Auswerteelektronik klassifiziert das Ereignis.';
  }

  function aktionFor(m) {
    const kat = m.kat || m.kategorie || '';
    if (kat === 'Türen' || kat === 'Fenster' || kat === 'Tresore') return 'Magnet-Kontakt meldet Manipulation an EMA → Sirene + NSL-Übertragung.';
    if (kat === 'Brandschutz') return 'Sprinkler-Auslösung oder CO₂-Flutung. BMA alarmiert Feuerwehr (112).';
    if (kat === 'Zutritt') return 'Tür-Magnet öffnet · Audit-Log gespeichert · oder Zutritt verweigert.';
    if (kat === 'Video') return 'Hochaufgelöste Aufzeichnung läuft. Operator-Alarm bei kritischer Klassifikation.';
    if (kat === 'Zäune' || kat === 'Tore') return 'Perimeter-Alarm an Leitstelle. Video-Tower folgt automatisch.';
    if (kat === 'Poller') return 'Hydraulik fährt Poller in &lt; 2 Sek aus → Fahrzeug gestoppt.';
    if (kat === 'Alarmierung' || kat === 'Melder') return 'Außen-Sirene 110 dB · Stroboskop · GSM-Übertragung zur NSL · Streife in &lt; 3 Min.';
    if (kat === 'Beschläge') return 'Verstärkung verhindert Aufhebeln. Mit Magnet-Kontakt → Alarm.';
    if (kat === 'Verglasung') return 'PVB-Folie bindet Splitter. Bei Bruch: Glasbruch-Sensor → Alarm.';
    return 'EMA-Zentrale verarbeitet → Alarm an NSL/Polizei.';
  }

  /* Beim Laden alle generieren */
  function init() {
    const all = gatherAll();
    let count = 0;
    all.forEach(m => {
      if (!m.key) return;
      if (EXPL.hasExplainer(m.key)) return; // hat bereits explizite Animation
      const auto = makeAuto(m);
      if (auto) {
        EXPL.EXPLAINERS[m.key] = auto;
        count++;
      }
    });
    console.info(`✓ Auto-Explainer: ${count} generische Animationen für Komponenten ohne explizite generiert`);
  }

  // Nach DOM-Ready ausführen (wenn alle anderen Module geladen sind)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
