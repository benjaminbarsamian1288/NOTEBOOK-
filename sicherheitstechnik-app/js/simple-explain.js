/* Einfache Erklärungen + Praxis-Beispiele für Komponenten
   Generisch + Per-Component Overrides */

window.SIMPLE_EXPLAIN = (() => {

  /* ====== Pro-Komponente spezifische Erklärungen ====== */
  const PER_KEY = {
    /* === MELDER === */
    'pir-standard': {
      einfach: 'Stell dir vor, du stehst in einem dunklen Zimmer. Du fühlst keine Bewegung — aber sobald jemand reinkommt, spürst du seine Körperwärme. Genau so funktioniert ein PIR-Melder: Er „fühlt" Wärme von Körpern, die sich vor ihm bewegen.',
      vergleich: 'Wie das Auge einer Schlange in der Nacht — reagiert auf Wärmeunterschiede.',
      beispiele: [
        '🏠 Im Flur einer Wohnung montiert, schaltet das Licht automatisch ein',
        '🏢 In Bürogebäuden außerhalb der Arbeitszeiten als Alarmmelder',
        '🛒 Im Supermarkt zur Diebstahlüberwachung nach Ladenschluss',
        '⚠ Fehl-Alarm-Beispiel: Sonnenschein durchs Fenster auf die Linse → falscher Alarm',
      ],
      tipp: 'PIR-Melder NICHT direkt gegenüber von Fenstern oder Heizkörpern montieren.',
    },
    'magnet-kontakt': {
      einfach: 'Zwei kleine Magnete — einer am Türrahmen, einer an der Tür. Solange sie nebeneinander hängen, fließt Strom durch einen kleinen Schalter. Öffnest du die Tür, entfernen sie sich → Schalter klappt um → Alarm.',
      vergleich: 'Wie wenn man bei zwei Magneten an einem Kühlschrank den einen wegnimmt — Verbindung weg.',
      beispiele: [
        '🚪 Eingangstür: zeigt Bewohnern, ob die Tür wirklich zu ist',
        '🪟 Alle Fenster im EG einer Wohnung mit EMA',
        '🏪 Schaufenster eines Juweliers — bei Bruch sofort Alarm',
        '🔓 In Schließanlagen mit Smart-Home-Anbindung',
      ],
      tipp: 'VdS-Variante kaufen — billige Magnetkontakte lassen sich mit einem Fremd-Magneten austricksen.',
    },
    'glasbruch-akustisch': {
      einfach: 'Ein winziges Mikrofon hört permanent. Wenn Glas zerbricht, klingt das immer gleich: erst ein dumpfer Schlag (tief), dann das Klirren der Splitter (hoch). Der Melder erkennt dieses Muster.',
      vergleich: 'Wie Shazam für Glas-Bruch — kennt das „Lied" von zerspringendem Glas.',
      beispiele: [
        '🏪 Schaufenster eines Juweliers (zentral montiert)',
        '🚗 Autoglas-Alarmanlage',
        '🏠 Wohnzimmer mit großen Fensterflächen',
        '⚠ Fehl-Alarm-Beispiel: Glas fällt in der Küche zu Boden — Alarm auslöst',
      ],
      tipp: 'Reichweite je Sensor ca. 5–8 m — bei großen Räumen mehrere installieren.',
    },
    /* === MECHANIK === */
    'tuer-rc2': {
      einfach: 'Eine ganz normale Wohnungstür, aber mit Stahleinlage und drei Riegeln statt nur einem. Wenn du abschließt, schieben sich drei Stahlbolzen in den Türrahmen — wie drei Hände, die zusammen die Tür halten.',
      vergleich: 'Wie ein Tresor in der Wand, nur größer und für Menschen.',
      beispiele: [
        '🏠 Polizei-Empfehlung für JEDE Wohnungseingangstür',
        '🏢 Eingangstüren von Büros bis 5. Etage',
        '🏨 Hotelzimmer-Türen (Standardausstattung in besseren Häusern)',
        '💰 Erspart bis zu 1.600 € durch KfW-Förderung Programm 455-E',
      ],
      tipp: 'Polizei-Beratungsstellen geben kostenlose Vor-Ort-Beratung zu RC2-Türen.',
    },
    'tresor-1': {
      einfach: 'Ein Stahlkasten mit dicken Wänden (Stahl-Beton-Stahl Sandwich). Beim Zudrehen fahren 8 Bolzen wie Bolzenriegel in den Korpus. Den knackst du nicht mit Werkzeug aus dem Baumarkt.',
      vergleich: 'Wie ein Mini-Bunker für dein Wohnzimmer.',
      beispiele: [
        '💰 Versichert 40.000 € privat / 20.000 € Gewerbe',
        '🏠 Schmuck, Bargeld, wichtige Dokumente zu Hause',
        '💼 Kleines Büro: Tageseinnahmen, Geheimhaltungspflichten',
        '⚠ Wichtig: Im Boden oder in der Wand verankern, sonst klauen die ihn mit',
      ],
      tipp: 'Auf VdS-Plakette achten — billige China-Tresore haben oft keine echte Klassifizierung.',
    },
    'fenster-rc2': {
      einfach: 'Ein ganz normales Fenster, aber mit verstärktem Beschlag. Statt nur die Tür-Falle hat es 4 kegelförmige Pilzköpfe, die hinter Stahl-Schließbleche greifen. Aufhebeln unmöglich.',
      vergleich: 'Wie Velcro statt Druckknopf — viele kleine Haken statt einer Verbindung.',
      beispiele: [
        '🪟 EG-Fenster, Balkontür, Terrassentür',
        '🏠 Schlafzimmer wenn Erdgeschoss',
        '🏪 Schaufenster bis 4 m² Größe',
        '💡 Achte beim Kauf: muss „RC2" stehen — nicht „RC2N" (das ist nur die Mechanik ohne sicheres Glas)',
      ],
      tipp: 'Polizei sagt: 80 % aller Einbrüche gehen durchs FENSTER — nicht durch die Tür.',
    },
    'poller-versenk-hydr': {
      einfach: 'Ein dicker Stahl-Zylinder steckt im Boden. Wenn er nicht gebraucht wird, ist er unter der Straße versteckt — Autos fahren drüber. Drückt der Operator einen Knopf, schießt er in 2 Sekunden hoch und stoppt sogar einen rasenden LKW.',
      vergleich: 'Wie ein Lichtschwert für die Straße — nicht da, dann plötzlich da.',
      beispiele: [
        '🚌 Vor Botschaften (Anti-Anschlag)',
        '🏛 Eingang zum Bundeskanzleramt',
        '🛒 Fußgängerzonen-Zufahrt für Lieferanten',
        '🎪 Bei Großveranstaltungen als Schutz vor Amok-Fahrten',
      ],
      tipp: 'PAS 68 K12 stoppt einen 7,5-Tonner bei 80 km/h — das ist Welt-Top-Standard.',
    },
    /* === VIDEO === */
    'cam-ptz': {
      einfach: 'Eine Kamera die schwenken (Pan), neigen (Tilt) und zoomen (Zoom) kann — alles motorisiert. Auf 200 m Entfernung erkennt sie noch ein Gesicht. Wenn jemand auftaucht, folgt sie ihm automatisch.',
      vergleich: 'Wie ein wachsamer Hausmeister mit Adler-Augen, der nie schläft.',
      beispiele: [
        '🏟 Stadion-Überwachung mit einer Kamera für ein ganzes Spielfeld',
        '🏭 Industriegelände 15.000 m² mit nur 4 Kameras',
        '🛂 Flughafen-Vorfeld',
        '🌃 KWS Video Control Tower (deutsche Marke)',
      ],
      tipp: 'Wartung der Mechanik wichtig — die Motoren laufen 24/7 wenn Auto-Tracking aktiv.',
    },
    'cam-thermal': {
      einfach: 'Eine Kamera die KEIN Licht braucht — sie „sieht" Wärmestrahlung. Ein Mensch leuchtet auf wie eine Glühbirne im Dunkeln. Funktioniert bei totaler Dunkelheit, durch Nebel, durch Rauch.',
      vergleich: 'Wie das Sehen vom Predator-Alien im Film.',
      beispiele: [
        '🚨 Perimeter-Schutz von KRITIS-Anlagen nachts',
        '🚒 Feuerwehr findet Personen in verrauchten Räumen',
        '🐾 Wildbeobachtung in der Natur',
        '⚠ Achtung Sommer: Wenn Hintergrund warm ist (~ 30°C), wird Detektion schwerer',
      ],
      tipp: 'Sehr teuer (2.500 — 25.000 €) — nur dort wo optische Kamera scheitert.',
    },
    /* === BRAND === */
    'rauchmelder-optisch': {
      einfach: 'In dem kleinen Kasten ist eine winzige LED und eine Foto-Linse — beide schauen sich aber NICHT direkt an. Bei klarer Luft kommt nichts beim Foto-Sensor an. Bei Rauch streuen die Partikel das Licht so, dass es zur Linse trifft → Alarm.',
      vergleich: 'Wie eine Discokugel — das Licht streut an Partikeln.',
      beispiele: [
        '🛏 Schlafzimmer (Pflicht in allen Bundesländern!)',
        '🛋 Wohnzimmer + Flur',
        '🏢 Büros, Schulen, Krankenhäuser',
        '⚠ NICHT in der Küche (Kochdunst löst aus) oder Badezimmer (Wasserdampf)',
      ],
      tipp: 'Batterien jährlich prüfen, kompletter Tausch nach 10 Jahren — danach wird Sensor unzuverlässig.',
    },
    'sprinkler-nass': {
      einfach: 'An der Decke hängt ein Rohr unter Wasserdruck. Vorne sitzt ein Glasfass mit Alkohol drin. Wird es heiß (Brand!), dehnt sich der Alkohol aus, das Glas platzt — Ventil öffnet sich → Wasser. Nur am Brand-Ort, nicht überall.',
      vergleich: 'Wie ein Thermometer das bei Hitze zerbricht und Wasser auslöst.',
      beispiele: [
        '🏭 Industriehallen, Logistikzentren',
        '🏨 Hotels, Krankenhäuser, Pflegeheime',
        '🛒 Supermärkte, Kaufhäuser',
        '⚠ NICHT für Server-Räume (Wasser zerstört Elektronik) — dort CO₂ oder Novec',
      ],
      tipp: 'Versicherung gibt 30—50 % Rabatt bei Sprinkler-Anlage.',
    },
    'co2-anlage': {
      einfach: 'Eine Anlage die einen Raum komplett mit CO₂-Gas flutet. CO₂ verdrängt Sauerstoff — ohne Sauerstoff kein Feuer. Aber auch keine Menschen — DARUM vor Auslösung 30 Sek Vorwarnung, alle MÜSSEN raus.',
      vergleich: 'Wie das Pusten einer Kerze, nur halt mit einem ganzen Raum.',
      beispiele: [
        '💾 Server-/Daten-Räume (hinterlässt keine Spuren)',
        '⚡ Schalt- und Verteilerräume',
        '🎨 Schiffs-Maschinenräume',
        '⚠⚠ LEBENSGEFAHR — keiner darf bei Auslösung im Raum sein',
      ],
      tipp: 'In neueren Anlagen wird CO₂ durch Novec 1230 ersetzt — personensicher und umweltfreundlicher.',
    },
    /* === ZUTRITT === */
    'rfid-mifare': {
      einfach: 'Du hältst eine kleine Karte vor ein Kästchen. Das Kästchen schickt unsichtbare Funk-Wellen, die Karte antwortet mit ihrer Nummer. Wenn die Nummer in der Liste der „Erlaubten" steht → Tür geht auf.',
      vergleich: 'Wie wenn du an einem Hotel-Empfang nur deinen Namen sagst — und der Portier kennt dich schon.',
      beispiele: [
        '🏢 Mitarbeiter-Zugang zu Büros',
        '🏨 Hotelzimmer-Schloss',
        '🎫 ÖPNV-Ticket (z. B. Berlin Fahrkarten)',
        '⚠ Vorsicht: Alte „Mifare Classic"-Karten lassen sich klonen — DESFire-Variante nehmen',
      ],
      tipp: 'Bei Kartenverlust SOFORT sperren — Karte ist wie ein Schlüssel.',
    },
    'fingerprint': {
      einfach: 'Der Sensor scannt deinen Finger und sucht charakteristische Punkte — Linien-Enden, Verzweigungen. Etwa 15—40 dieser „Minutien" müssen mit dem hinterlegten Muster übereinstimmen.',
      vergleich: 'Wie wenn man Sterne im All wiedererkennt — bestimmte Konstellationen sind einzigartig.',
      beispiele: [
        '📱 Smartphone-Entsperrung',
        '🏠 Smart-Lock an der Haustür',
        '🏛 Behörden-Zugang',
        '⚠ Bei Verletzung am Finger → kommst nicht mehr rein. Backup-PIN immer einrichten!',
      ],
      tipp: 'Datenschutz: Biometrie ist sensible Daten — DSGVO einhalten.',
    },
    /* === ALARM === */
    'ema-zentrale': {
      einfach: 'Das „Gehirn" deiner Alarmanlage. Alle Melder (Bewegung, Magnet, Glas) hängen daran. Sie weiß, ob das System scharf ist, und reagiert bei Alarm: Sirene an, Blitzleuchte, SMS an Wachdienst.',
      vergleich: 'Wie ein Schiedsrichter, der alle Signale empfängt und entscheidet.',
      beispiele: [
        '🏠 Im Keller oder versteckter Ort montiert',
        '🏢 In Büros mit Anbindung an externe Notrufzentrale (NSL)',
        '💎 VdS-Grad 3 für Juweliere, Banken, Galerien',
        '🚨 Bei Strom-Ausfall: Akku-Pufferung 72 Stunden',
      ],
      tipp: 'Wartung jährlich durch VdS-Errichter — sonst keine Versicherungsleistung.',
    },
    'sirene-aussen': {
      einfach: 'Ein lauter Lautsprecher + ein blinkendes Licht an der Hausfassade. Wenn die EMA-Zentrale alarmiert, gehen beide gleichzeitig los — schreckt Einbrecher ab und alarmiert Nachbarn.',
      vergleich: 'Wie der Feuermelder in der Schule — extrem laut, jeder schaut hin.',
      beispiele: [
        '🏠 An der Fassade in 3—4 m Höhe (außer Reichweite)',
        '🏪 Über dem Geschäftseingang',
        '⚖ Pflicht: max. 3 Minuten Lautstärke (Lärmschutz)',
        '🔋 Eigener Akku — auch ohne Strom Alarm',
      ],
      tipp: 'Mit Bauschaum kann man Sirenen leise machen — daher mit Sabotage-Sensor wählen.',
    },
  };

  /* ====== Generische Templates pro Kategorie ====== */
  const TEMPLATES = {
    'Melder': {
      einfach: (m) => `${m.name} ist ein ${m.typ === 'aktiv' ? 'aktiver Sensor — er sendet ein Signal aus und prüft, ob es zurückkommt' : 'passiver Sensor — er empfängt nur und wartet auf eine Veränderung'}. Bei Detektion meldet er an die EMA-Zentrale.`,
      vergleich: 'Wie ein wachsamer Wachhund — bemerkt sofort, wenn etwas nicht stimmt.',
      tipp: 'VdS-Zertifizierung gibt Sicherheit über die Qualität.',
    },
    'Türen': {
      einfach: (m) => `${m.name} ist eine Sicherheitstür der Klasse ${m.klasse}. Sie hält ${m.wzeit} stand bei einem Werkzeug-Angriff. Polizei-Empfehlung für Wohnungen ist mindestens RC2.`,
      vergleich: 'Wie ein gepanzerter Bunker — je höher die Klasse, desto stärker.',
      tipp: 'Auch die Zarge muss verstärkt sein — beste Tür nutzt nichts in dünnem Rahmen.',
    },
    'Fenster': {
      einfach: (m) => `${m.name} ist ein einbruchhemmendes Fenster der Klasse ${m.klasse}. Statt einfacher Falle hat es Pilzkopf-Zapfen, die hinter Stahl-Schließbleche greifen.`,
      vergleich: 'Wie eine Klinke mit vier zusätzlichen Riegeln, die rundherum greifen.',
      tipp: 'Über 80 % aller Einbrüche gehen durchs Fenster — hier zuerst aufrüsten!',
    },
    'Verglasung': {
      einfach: (m) => `${m.name} ist Sicherheitsglas der Klasse ${m.klasse}. Es hält ${m.wzeit} aus.`,
      vergleich: 'Wie eine Schutzfolie — bricht zwar, aber zerfällt nicht in Scherben.',
      tipp: 'Auch bei Bruch hält die PVB-Folie die Scherben zusammen → Verletzungsschutz.',
    },
    'Tresore': {
      einfach: (m) => `${m.name} ist ein Wertschutzschrank der Klasse ${m.klasse}. Versichert für ${m.einsatz.match(/\d[\d.]*\s*€/)?.[0] || '—'}.`,
      vergleich: 'Wie eine kleine Mini-Bunker-Wohnung für deine wichtigsten Sachen.',
      tipp: 'Immer im Boden oder in der Wand verankern — sonst tragen sie ihn weg.',
    },
    'Zäune': {
      einfach: (m) => `${m.name} ist ein ${m.typ === 'aktiv' ? 'aktiver Zaun mit Detektion' : 'passiver Zaun'}. Eignet sich für ${m.einsatz}.`,
      vergleich: 'Eine Grenze — sichtbar zeigt: hier ist mein Gebiet.',
      tipp: 'Höhe alleine schützt nicht — Übersteig-Schutz oben drauf (NATO-Draht oder Y-Aufsatz).',
    },
    'Tore': {
      einfach: (m) => `${m.name} ist ein automatisches ${m.kat === 'Tore' ? 'Eingangstor' : 'Tor'}. Öffnung ${m.wzeit}.`,
      vergleich: 'Eine sehr breite Tür mit Motor — fährt selbständig.',
      tipp: 'Klemmschutz nach EN 12453 prüfen lassen — sonst keine Versicherung bei Verletzung.',
    },
    'Poller': {
      einfach: (m) => `${m.name} ist ein ${m.typ === 'aktiv' ? 'versenkbarer' : 'fester'} Poller der Klasse ${m.klasse}. Stoppt ein Fahrzeug von ${m.wzeit}.`,
      vergleich: 'Wie ein Riegel auf der Straße — nicht da, dann plötzlich da (bei versenkbaren).',
      tipp: 'PAS 68 / IWA 14-1 sind die wichtigsten Norm-Kürzel.',
    },
    'Beschläge': {
      einfach: (m) => `${m.name} sichert ${m.einsatz}. Klasse: ${m.klasse}.`,
      vergleich: 'Das Detail, das den Unterschied macht — wie der Schraubenzieher beim Möbel-Aufbau.',
      tipp: 'Auch Beschläge müssen passen — sonst hilft die beste Tür nichts.',
    },
    'Video': {
      einfach: (m) => `${m.name}. ${m.klasse}. Liefert Live-Bild und Aufzeichnung an den NVR (Network Video Recorder).`,
      vergleich: 'Wie ein extra Auge das nie schläft — und sich alles merkt.',
      tipp: 'DSGVO: Hinweisschild PFLICHT — sonst hohe Bußgelder.',
    },
    'Brandschutz': {
      einfach: (m) => `${m.name} ist ein Brand-/Lösch-Element. ${m.principle.split('.')[0]}.`,
      vergleich: 'Wie ein Wachhund für Feuer — schläft nie, bellt rechtzeitig.',
      tipp: 'Jährliche Wartung pflicht — sonst keine Sachversicherung.',
    },
    'Zutritt': {
      einfach: (m) => `${m.name} kontrolliert wer rein darf. ${m.klasse}.`,
      vergleich: 'Wie ein elektronischer Pförtner — kennt seine Leute.',
      tipp: 'Mit 2-Faktor (Karte + PIN) ist es deutlich sicherer.',
    },
    'Alarmierung': {
      einfach: (m) => `${m.name} ist Teil einer Einbruchmeldeanlage (EMA). ${m.principle.split('.')[0]}.`,
      vergleich: 'Wie das Nervensystem deines Hauses — meldet jeden Eingriff.',
      tipp: 'VdS-Errichter nehmen — billige Selbsteinbau führt zu Fehlalarmen.',
    },
  };

  function get(m) {
    if (PER_KEY[m.key]) return PER_KEY[m.key];
    const tmpl = TEMPLATES[m.kategorie] || TEMPLATES['Melder'];
    return {
      einfach: typeof tmpl.einfach === 'function' ? tmpl.einfach(m) : tmpl.einfach,
      vergleich: tmpl.vergleich,
      tipp: tmpl.tipp,
      beispiele: defaultBeispiele(m),
    };
  }

  function defaultBeispiele(m) {
    const ex = [];
    if (m.einsatz) ex.push(`📍 Typischer Einsatz: ${m.einsatz}`);
    if (m.preis) ex.push(`💰 Preisrahmen: ${m.preis}`);
    if (m.hersteller && m.hersteller.length) ex.push(`🏭 Bewährte Marken: ${m.hersteller.slice(0, 3).join(', ')}`);
    if (m.norm) ex.push(`📜 Norm: ${m.norm}`);
    return ex;
  }

  return { get, PER_KEY };
})();
