/* KI-Erweiterungen für jeden Sensor.
   Wird automatisch im Encyclopedia-Detail-Drawer angezeigt. */

window.ENCY_AI = (() => {

  // KI-Daten pro Sensor-Key
  const AI = {

    'pir-standard': {
      kurz: 'Mensch / Tier / Spielzeug · Pattern-Klassifikation',
      methods: [
        { m: 'CNN-Klassifikation', d: 'Convolutional Neural Network bewertet das Δ-Signal-Muster: typische Menschen-Signatur (große Wärme, langsame Bewegung) vs. Katze (klein, schnell)' },
        { m: 'Time-Series-Analyse', d: 'LSTM-Netzwerk erkennt Bewegungs-Muster über Sekunden hinweg' },
        { m: 'Adaptive Schwelle', d: 'KI lernt die Umgebung (Heizungs-Schwankungen, Sonneneinstrahlung) und passt Schwellen dynamisch an' },
      ],
      use_cases: [
        'Tier-Immunität ohne Spezialhardware',
        'Erkennung von kriechenden / sich versteckenden Tätern',
        'Auto-Lernphase für neue Räume (7 Tage Beobachtung)',
      ],
      example: 'Eine KI-PIR-Variante (Bosch/Honeywell ab 2023) reduziert Fehlalarme um 95% gegenüber klassischem PIR durch Mensch-Klassifikation.',
      gain: '−95% Fehlalarme',
    },

    'mikrowelle': {
      kurz: 'Wassergeräusche / Lüfter intelligent filtern',
      methods: [
        { m: 'FFT-Mustererkennung', d: 'Fourier-Analyse des Doppler-Signals — KI erkennt charakteristische Frequenzmuster von Mensch (1-3 m/s) vs Wasser-Strömung (konstant)' },
        { m: 'Cluster-Analyse', d: 'K-Means clustert wiederkehrende Bewegungssignaturen → permanente Störquellen (z.B. Heizungspumpe) auto-blacklisten' },
      ],
      use_cases: [
        'Auto-Ausblenden von Wasserleitungen',
        'Erkennung mehrerer gleichzeitig bewegter Personen',
        'Geschwindigkeits-Profiling (laufen/gehen/kriechen)',
      ],
      example: 'Honeywell IS3000-KI: trainiert sich 48h auf den Raum ein, filtert dann automatisch alle wiederkehrenden Störquellen aus.',
      gain: '−80% Fehlalarme · +25% Sensitivität',
    },

    'dualmelder': {
      kurz: 'Fusion-KI · zeitgenaue Korrelation',
      methods: [
        { m: 'Kalman-Filter', d: 'Stochastische Zustandsschätzung kombiniert PIR- und MW-Signal optimal über Zeit' },
        { m: 'Bayes-Klassifikator', d: 'Berechnet Wahrscheinlichkeit P(Mensch | PIR=x AND MW=y) basierend auf gelernten Verteilungen' },
        { m: 'Confidence-Score', d: 'Statt binärem AND: gewichtete Bewertung 0-100% Mensch-Wahrscheinlichkeit' },
      ],
      use_cases: [
        '"Vorwarnung" bei 70% Konfidenz (Voralarm)',
        '"Hauptalarm" bei 95% Konfidenz',
        'Anti-Spoofing: erkennt synthetische Stör-Signale',
      ],
      example: 'KI-Dualmelder geben Konfidenz-Werte mit jedem Alarm an die EMA — Operator sieht "87% sicher Mensch" statt nur "Alarm".',
      gain: '−98% Fehlalarme · Konfidenz-Anzeige',
    },

    'magnetkontakt': {
      kurz: 'Sabotage-Erkennung · Manipulations-Muster',
      methods: [
        { m: 'Anomalie-Detektion', d: 'KI lernt das übliche Öffnungs-Muster (Tageszeit, Häufigkeit) — bei untypischen Zeiten → Warnung' },
        { m: 'Fremdfeld-Analyse', d: 'Schwankungen der Magnetfeld-Stärke → KI erkennt Überbrückungs-Versuche mit Fremdmagnet' },
      ],
      use_cases: [
        'Tür-Öffnung nachts → automatische Verifizierung mit Kamera',
        'Sabotage-Erkennung VOR dem Öffnen',
        'Routine-Lernen (Mitarbeiter-Verhalten)',
      ],
      example: 'Telenot ComLock-KI: erkennt Magnet-Überbrückung anhand minimaler Feldstärke-Abweichungen.',
      gain: '+100% Sabotage-Schutz',
    },

    'glas-passiv': {
      kurz: 'Bruch vs Husten · Phasen-KI',
      methods: [
        { m: 'Spectral Pattern Matching', d: 'CNN auf das Audio-Spektrogramm — erkennt typisches Doppel-Phasen-Muster (tief/hoch)' },
        { m: 'Anti-Husten/Bellen', d: 'Trainingsdaten enthalten häufige Fehlalarm-Quellen → KI filtert sie aus' },
        { m: 'Glas-Typ-Detektion', d: 'Unterschied Einfach- vs. VSG-Glas im Bruch-Schallspektrum' },
      ],
      use_cases: [
        'Erkennung von Glas-Riss (ohne Bruch)',
        'Filterung von Donner / Knallgeräuschen',
        'Mehrkanal-Lokalisierung (welches Fenster?)',
      ],
      example: 'KI-Glasbruchmelder (Bosch 2024): trainiert mit 100.000 Bruchsignalen, 99,2% Erkennungsrate, <1% Fehlalarm.',
      gain: '99,2% Detection · −90% False-Alarm',
    },

    'piezo-erschuetterung': {
      kurz: 'Bohrer / Hammer / Säge unterscheiden',
      methods: [
        { m: 'Frequenz-Signatur-DB', d: 'KI vergleicht das Vibrationsspektrum mit gespeicherten Werkzeug-Signaturen (Bohrer typ. 50-200 Hz, Säge 200-500 Hz)' },
        { m: 'Recurrent NN', d: 'LSTM erkennt zeitliche Muster (Bohren = rhythmisch, Schlag = einmalig)' },
      ],
      use_cases: [
        'Tool-ID: "Schlagbohrer am Tresor erkannt"',
        'Vorwarnung bei leichten Erschütterungen',
        'Filterung von Verkehrslärm (LKW etc.)',
      ],
      example: 'KI-Erschütterungsmelder zeigen am Display sogar das ERKANNTE Werkzeug an — Tresor-Operator weiß sofort, was los ist.',
      gain: 'Tool-Identifikation · −85% Fehlalarme',
    },

    'koerperschall': {
      kurz: 'Angriffsart-Klassifikation',
      methods: [
        { m: 'Acoustic Fingerprinting', d: 'Akustischer Fingerabdruck jeder Angriffsmethode (Bohren, Flexen, Schweißbrenner, Sprengen)' },
        { m: 'KI lernt Tresor-Material', d: 'Adaptiert sich auf Stahlsorte des spezifischen Tresors' },
      ],
      use_cases: [
        'Alarm-Stufe je nach Angriffstyp (Schweißbrenner = höchste Eskalation)',
        'Lokalisierung: welcher Tresor-Bereich wird angegriffen',
      ],
      example: 'Honeywell Skladia: KI-Modell erkennt 12 verschiedene Angriffs-Werkzeuge mit 96% Genauigkeit.',
      gain: 'Angriffsart-Erkennung · Eskalations-Stufen',
    },

    'ir-schranke': {
      kurz: 'Tier vs Mensch · Bewegungsmuster',
      methods: [
        { m: 'Multi-Strahl-Muster', d: 'KI analysiert WELCHE Strahlen in welcher Reihenfolge unterbrochen werden — Vogel (oben), Reh (mittig), Mensch (alle)' },
        { m: 'Zeitprofil', d: 'Dauer der Unterbrechung: Vogel <100ms, Mensch >500ms' },
      ],
      use_cases: [
        'Vogel-Immunität ohne Mindesthöhe-Justage',
        'Erkennung von Tierherden (Reh-Pulks)',
        'Auto-Justage bei Vegetationswuchs',
      ],
      example: 'Optex AccurAnalyzer-KI: Vogelflug-Erkennung 99,8%, mehrteilige Strahl-Unterbrechungen werden korrekt zugeordnet.',
      gain: 'Tier-Immunität · Multi-Object-Tracking',
    },

    'kapazitiv': {
      kurz: 'Mensch vs Tier vs Reinigungspersonal',
      methods: [
        { m: 'Approach-Geschwindigkeits-Analyse', d: 'Wie schnell ändert sich Kapazität? Mensch langsam, Insekt schnell' },
        { m: 'Kontaktmuster', d: 'Wo & wie wird das Objekt berührt — Reinigung vs Diebstahl unterscheiden' },
      ],
      use_cases: [
        'Lernmodus für regelmäßige Reinigung (kein Alarm)',
        'Stille Alarm bei verdächtiger Berührung',
        'Vergrößerte Annäherungs-Schwelle bei Tagesbetrieb',
      ],
      example: 'KI-Kapazitiv lernt das tägliche Putzpersonal-Muster und gibt nur Alarm bei untypischen Annäherungen.',
      gain: 'Adaptive Empfindlichkeit',
    },

    'rauch-streulicht': {
      kurz: 'Echter Brand vs Dampf vs Staub',
      methods: [
        { m: 'Multi-Spektral-Streuung', d: 'Mehrere LED-Wellenlängen analysieren Partikel-Größe → Wasserdampf ≠ Schwelbrand-Ruß' },
        { m: 'CO + Streulicht Fusion', d: 'KI kombiniert Streulicht-Signal mit CO-Sensor → echter Brand braucht beides' },
        { m: 'Trend-Analyse', d: 'Brand: exponentieller Anstieg; Staub: kurze Spitze und Abklingen' },
      ],
      use_cases: [
        'Küchen-Dampf-Immunität',
        'Erkennung von Schwelbrand vor offener Flamme',
        'Predictive Maintenance der Sensorkammer',
      ],
      example: 'Hekatron Genius PX-KI: 0% Fehlalarme durch Wasserdampf bei Kochen, 100% Echt-Brand-Erkennung.',
      gain: '−99% Dampf-Fehlalarme',
    },

    'asd': {
      kurz: 'Server-spezifische Brand-Signatur',
      methods: [
        { m: 'Multi-Class-Klassifikation', d: 'KI unterscheidet Lithium-Akku-Brand, Kabelschwelbrand, Staubentwicklung, Wasserdampf' },
        { m: 'Predictive Air-Sampling', d: 'KI lernt typische Luftverteilung im Raum → erkennt Brand-Ort früher' },
      ],
      use_cases: [
        'Frühest-Erkennung Lithium-Brand (Rechenzentrum)',
        'Lokalisierung der Brandquelle in m² genau',
        'Auto-Sensitivitäts-Anpassung nach Tageszeit',
      ],
      example: 'Wagner TITANUS PRO-KI: erkennt einen einzigen schwelenden Kondensator in 2.000 m² Halle.',
      gain: 'Brandquelle in 1 m² lokalisiert',
    },

    'flammenmelder': {
      kurz: 'Flamme vs Schweißlicht vs Sonne',
      methods: [
        { m: 'UV/IR-Verhältnis-Analyse', d: 'KI berechnet exaktes Verhältnis — Schweißen hat anderes UV/IR-Profil als Flamme' },
        { m: 'Flicker-Frequenz-Analyse', d: 'Echte Flammen flackern mit ~10 Hz; Schweißbogen mit anderem Muster' },
      ],
      use_cases: [
        'Schweißroboter-Immunität in Industrie',
        'Sonnenlicht-Filter für Außen-Installation',
        'Lichtbogen-Erkennung in Schaltanlagen',
      ],
      example: 'Det-Tronics X3301-KI: false-alarm-frei bei Schweißarbeiten, alarmiert nur bei echtem Brand binnen 2 Sekunden.',
      gain: 'Lichtbogen-Immunität',
    },

    'zaun-mikro': {
      kurz: 'Klettern vs Sturm vs Tiere',
      methods: [
        { m: 'Vibration-Pattern-CNN', d: 'CNN klassifiziert Vibrationssignaturen: Klettern, Schneiden, Hebeln, Wind, Tier' },
        { m: 'Lokalisierung', d: 'Akustische Triangulation auf 1-2 m genau entlang des Zauns' },
      ],
      use_cases: [
        'Sturm-Adaption (höhere Schwelle bei Wind)',
        'Tier-Klassifikation (Vogel, Reh, Hund)',
        'Tracking: Bewegt sich der Angreifer am Zaun entlang?',
      ],
      example: 'Gallagher Trophy-KI: trainiert auf 50.000 Klettervorgängen, 99,5% Detection, <0,1% False-Alarm/100m/Nacht.',
      gain: 'Sturm-immun · Lokalisierung 1 m',
    },

    'zaun-fos': {
      kurz: 'Bahnen-Lokalisierung · Wetter-Filter',
      methods: [
        { m: 'Distributed Acoustic Sensing (DAS)', d: 'KI verarbeitet das gesamte 40 km Fiber-Signal — jeder Meter ist ein virtueller Sensor' },
        { m: 'Wetter-Modell', d: 'Korreliert mit Wetterdaten — Schauer/Sturm wird automatisch herausgefiltert' },
      ],
      use_cases: [
        'Bahnen-Überwachung über tausende Kilometer',
        'Echtzeit-Lokalisierung von Eindringen auf 5 m',
        'Erkennung von Tunnel-Grabungen unter dem Zaun',
      ],
      example: 'OptaSense KI nutzt zentrale Auswertung für nationale Pipeline-Sicherheit — KI lernt das normale Geräusch und alarmiert bei jeder Abweichung.',
      gain: 'Multi-km-Coverage · 5 m Genauigkeit',
    },

    'thermalkam': {
      kurz: 'Person · Tier · Fahrzeug Klassifikation',
      methods: [
        { m: 'YOLO v8 / CNN', d: 'Echtzeit-Objekterkennung im Thermalbild (Mensch 96%, Tier 92%, Fahrzeug 99%)' },
        { m: 'Re-Identification', d: 'KI verfolgt einzelne Personen über mehrere Kameras hinweg' },
        { m: 'Activity Recognition', d: 'Gehen vs Klettern vs Rennen vs Stehen — Verhaltensanalyse' },
      ],
      use_cases: [
        'Person-Counting in Sicherheits-Zonen',
        'Verhalten-basierte Alarmierung ("Person liegt am Boden")',
        'Privacy-by-Design: nur thermisches Bild, keine Identifizierung',
      ],
      example: 'FLIR Recon-V-KI mit Tegra-Prozessor: 30 fps Person-Detection im Wärmebild bei kompletter Dunkelheit.',
      gain: 'Echtzeit-Klassifikation · Re-ID',
    },

    'radar': {
      kurz: 'Klassifikation + Spurverfolgung',
      methods: [
        { m: 'Kalman-Tracker', d: 'Verfolgt mehrere Targets gleichzeitig mit prädiktiver Spur-Schätzung' },
        { m: 'Doppler-Signatur-KI', d: 'Erkennt Bewegungsmuster: Person (1-2 m/s, pulsierend von Schritten), Auto (>5 m/s, konstant)' },
        { m: 'Vegetation-Filter', d: 'Schwankende Äste / Sträucher werden als statische Cluster erkannt' },
      ],
      use_cases: [
        'Vorwarn-Zonen mit Risiko-Bewertung',
        'Multi-Object-Tracking (50+ gleichzeitig)',
        'Spurvorhersage: "Person bewegt sich auf Zone X zu"',
      ],
      example: 'Hensoldt SPEXER 2000-KI: klassifiziert 200+ Targets gleichzeitig auf 2 km Distanz mit Verhaltensvorhersage.',
      gain: 'Multi-Tracking · Prädiktion',
    },

    'lidar': {
      kurz: '3D-Objekt-Klassifikation in Echtzeit',
      methods: [
        { m: 'PointNet++ CNN', d: 'Tiefes neuronales Netz auf 3D-Punktwolken — erkennt Objekt-Form direkt' },
        { m: 'Segmentierung', d: 'Pixel-genaues 3D-Segmenting: jedes Voxel wird klassifiziert' },
        { m: 'Pose-Estimation', d: 'KI bestimmt Körperhaltung: stehend, kriechend, am Boden liegend' },
      ],
      use_cases: [
        'Crawler-Detection (auf dem Boden kriechende Eindringlinge)',
        'Erkennung von Drohnen am Himmel',
        'Person-Counting auf Plätzen',
      ],
      example: 'Quanergy M8-KI: 3D-LiDAR mit Echtzeit-Pose-Estimation für Perimeter-Sicherheit.',
      gain: 'Pose-Erkennung · Drohnen-Detection',
    },

    'kamera': {
      kurz: 'Computer Vision · LLM-Operator-Assistent',
      methods: [
        { m: 'YOLO v8 / Detectron', d: 'Echtzeit-Objekterkennung: Person, Auto, Tier, Tasche, Waffe (mit Spezial-Training)' },
        { m: 'Vision-Language-Model', d: 'GPT-Vision: beschreibt Szene in natürlicher Sprache an Operator' },
        { m: 'Anomalie-KI', d: 'Lernt normale Szene über Wochen → meldet Abweichungen (z.B. verlassener Koffer)' },
        { m: 'Face-ReID', d: 'Wiedererkennung von Gesichtern über mehrere Kameras (DSGVO-konform)' },
      ],
      use_cases: [
        'LLM-Alarm-Bericht: "Person mit dunkler Jacke gegen 23:14 am Eingang"',
        'Tasche-stehengelassen-Detection in Bahnhöfen',
        'Falschfahrer-Erkennung auf Autobahnen',
        'Gewaltvideo-Erkennung in Schulhöfen',
      ],
      example: 'Avigilon AI-Appliance: LLM erstellt automatisch Schichtprotokoll mit "Wer war wann wo".',
      gain: 'LLM-Reports · Anomalie-Detection',
    },

    'erddruck': {
      kurz: 'Schritte vs LKW vs Tier · Mustererkennung',
      methods: [
        { m: 'Seismic CNN', d: 'CNN auf seismische Signaturen — Person hat anderes Vibrationsmuster als Wildschwein' },
        { m: 'Gangart-Klassifikation', d: 'Erkennt Gehen vs Rennen vs Schleichen (Sneak)' },
      ],
      use_cases: [
        'Schleicher-Detection (Sneaking-Pattern)',
        'Tier-Filter (Reh-Herden ohne Alarm)',
        'Lokalisierung mit Multi-Geophone-Triangulation',
      ],
      example: 'Senstar OmniTrax-KI: trainiert auf 10.000 Schrittmuster, erkennt einen einzelnen Schleicher in 200 m Entfernung.',
      gain: 'Schleicher-Detection · Tier-Filter',
    },

    'neigung': {
      kurz: 'Echte Manipulation vs Erschütterung',
      methods: [
        { m: 'Acceleration-Time-Series', d: 'LSTM-Netz auf 3-Achsen-Beschleunigung → Aufprall vs Anhebung unterscheiden' },
        { m: 'Wakeup-by-Pattern', d: 'KI schläft im Energiespar-Modus, wacht nur bei verdächtigem Muster auf' },
      ],
      use_cases: [
        'Geldautomat: Sprengversuch vs Bürgerschaden',
        'Vibrations-Histogramm pro Tageszeit',
        'Vorhersage von Materialermüdung',
      ],
      example: 'Bosch BMI323 mit Edge-KI: 5 µA Stromverbrauch im Wake-Modus, alarmiert nur bei trainierten Mustern.',
      gain: 'Energiesparend · Pattern-Wakeup',
    },

    'seismisch': {
      kurz: 'Bohrer-Tap · KI-Werkzeug-Identifikation',
      methods: [
        { m: 'Frequenz-Cepstrum-Analyse', d: 'KI extrahiert Cepstral-Coeffizienten — wie bei Sprach-Recognition, nur für Werkzeuge' },
        { m: 'Time-Frequency Heatmap', d: 'Spektrogramm wird wie Bild von CNN klassifiziert' },
      ],
      use_cases: [
        'Werkzeug-Identifikation in Echtzeit',
        'Eskalations-Logik (Sprengung = höchste Stufe)',
      ],
      example: 'KI-Tresor-Sensor erkennt 14 verschiedene Angriffs-Werkzeuge mit 97% Treffsicherheit.',
      gain: 'Werkzeug-ID',
    },

    'wassermelder': {
      kurz: 'Tropfen vs Pfütze vs Überflutung',
      methods: [
        { m: 'Leitfähigkeits-Profil-KI', d: 'KI lernt typische Wasser-Leitfähigkeit des Objekts (Trink-, Heizungs-, Salzwasser)' },
        { m: 'Anstiegs-Rate', d: 'Langsamer Anstieg (Leck) vs schnell (Rohrbruch) → Eskalationsstufe' },
      ],
      use_cases: [
        'Pumpen-Steuerung bei Pegel-Anstieg',
        'Erkennung von Aquarium-Lecks (vs Putzwasser)',
      ],
      example: 'Smart-Water-Detector mit KI alarmiert nur bei echten Lecks und schaltet Hauptventil bei kritischer Rate.',
      gain: 'Lecktyp-Erkennung',
    },

    'gasmelder': {
      kurz: 'Mehrere Gase unterscheiden',
      methods: [
        { m: 'Multi-Sensor-Array', d: 'KI verarbeitet Ergebnisse von 6-12 Gas-Sensoren parallel (CO, CH4, H2S, Propan, etc.) → exakte Gas-Identifikation' },
        { m: 'Konzentrations-Verlauf', d: 'KI lernt normale Schwankungen (Kochen, Auto-Start) und alarmiert nur bei kritischen Mustern' },
      ],
      use_cases: [
        'Erkennung von Methan-Lecks bei Heizungen',
        'Frühwarnung bei CO-Vergiftung (LEBENSRETTEND)',
        'Lithium-Akku-Brand-Vorwarnung (Elektrolyt-Geruch)',
      ],
      example: 'Smart-Gas-Sensor mit MOX-Array + KI erkennt 8 verschiedene Gase und Bränden bevor sichtbare Flammen entstehen.',
      gain: 'Gas-Identifikation · Lithium-Frühwarnung',
    },

    'druckmatte': {
      kurz: 'Gewicht / Person vs Möbel',
      methods: [
        { m: 'Druckverlauf-Analyse', d: 'KI bewertet Gewicht (>30 kg = Person, kleiner = Tier) und Verteilungsmuster' },
        { m: 'Schrittmuster-Erkennung', d: 'Sequenzielle Drucksignale ergeben einen "Footstep-Fingerprint"' },
      ],
      use_cases: [
        'Auto-Disable bei platziertem Möbel',
        'Hund-Erkennung (Gewicht/Pfoten-Muster)',
        'Schritt-Tracking durch mehrere Matten',
      ],
      example: 'Premium-Druckmatten erkennen ob jemand allein oder mit jemandem auf der Matte steht.',
      gain: 'Person vs Tier · Schritt-Muster',
    },

    'multisensor': {
      kurz: 'Multi-Signal-Fusion · LLM-Bericht',
      methods: [
        { m: 'Sensor-Fusion-KI', d: 'Kombiniert Rauch + Wärme + CO + Feuchtigkeit in einem ML-Modell' },
        { m: 'Brandverlauf-Vorhersage', d: 'KI schätzt: "Schwelbrand seit 3 Min, in 5 Min offene Flamme"' },
      ],
      use_cases: [
        'Wassernebel-Filterung in Küchen',
        'Frühwarnung mit prädiktiver Eskalation',
        'Automatische Sprinkler-Zonen-Aktivierung',
      ],
      example: 'KI-Multisensor erkennt Schwelbrand-Anfänge 15 Minuten vor klassischen Sensoren.',
      gain: '+15 Min Frühwarnzeit',
    },

    // === Spezial-Aliase teilen sich gleiche KI ===
    'pir-vorhang': null, 'pir-decke': null, 'pir-longrange': null,
    'pir-tierimmun': null, 'pir-antimask': null, 'pir-outdoor': null,
    'schliessblech': null, 'glas-aktiv': null, 'glas-piezo': null,
    'waerme-max': null, 'ultraschall': null,

    // Spezialsensoren neue
    'alarmdraht-tapete': {
      kurz: 'Bruch-Lokalisierung · Penetration-Vorhersage',
      methods: [
        { m: 'TDR (Time Domain Reflectometry)', d: 'KI berechnet aus Reflexionssignalen die exakte Bruchposition' },
        { m: 'Stress-Modell', d: 'KI lernt Material-Spannung und sagt Risse vorher' },
      ],
      use_cases: [
        'Punkt-genaue Lokalisierung des Bruchs',
        'Predictive Maintenance bei Materialermüdung',
      ],
      example: 'Telenot ComLink mit KI lokalisiert Drahtbrüche auf 30 cm genau.',
      gain: 'Bruch-Lokalisierung 30 cm',
    },

    'tuergriff-sensor': {
      kurz: 'Hand-Klassifikation · Identifikation',
      methods: [
        { m: 'Kapazitäts-Profil', d: 'KI lernt Kapazitätsverlauf typischer Hände — fremde Hand erkennen' },
        { m: 'Bewegung-vor-Berührung', d: 'Geschwindigkeit der Annäherung bewertet (schnell = potentiell aggressiv)' },
      ],
      use_cases: [
        'Sanfter vs ruckartiger Griff-Anschlag',
        'Verifizierung über Handschuh/keine-Hand-Berührung',
      ],
      example: 'Burg-Wächter SmartHandle-KI erkennt vor der Tür-Öffnung ob die Person berechtigt ist.',
      gain: 'Berechtigung VOR Öffnung',
    },

    'hall-sensor': {
      kurz: 'Werkzeugtyp-Identifikation',
      methods: [
        { m: 'Magnetfeld-Signatur-DB', d: 'Datenbank typischer Werkzeug-Magnetfelder (Bohrer, Säge, Hebeleisen)' },
        { m: 'Multi-Hall-Array', d: 'Mehrere Hall-Sensoren ergeben ein 3D-Bild des Werkzeug-Magnetfelds' },
      ],
      use_cases: [
        'Werkzeug-ID vor dem Angriff',
        'Annäherungs-Vektor: aus welcher Richtung?',
      ],
      example: 'Hochsicherheits-Tresore mit Hall-Array + KI erkennen das spezifische Werkzeug das verwendet wird.',
      gain: 'Werkzeug + Richtung',
    },
  };

  function getAI(key) {
    return AI[key] || null;
  }

  return { getAI, AI };
})();
