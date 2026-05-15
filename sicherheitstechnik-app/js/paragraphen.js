/* Paragraphen-Detail für jedes Gesetz/Vorschrift.
   Wird in der Gesetze-Detail-Drawer als ausklappbare Liste angezeigt. */

window.PARAGRAPHEN = (() => {

  const P = {

    'gewo34a': [
      { nr:'§ 34a Abs. 1', titel:'Erlaubnispflicht',
        inhalt:'Wer gewerbsmäßig Leben oder Eigentum fremder Personen bewachen will (Bewachungsgewerbe), bedarf der Erlaubnis der zuständigen Behörde. Die Erlaubnis kann mit Auflagen verbunden werden.' },
      { nr:'§ 34a Abs. 1a', titel:'Sachkundeprüfung',
        inhalt:'Die Erlaubnis wird nur erteilt, wenn die zur Leitung des Betriebes bestellten Personen die Sachkundeprüfung vor einer Industrie- und Handelskammer abgelegt haben. Die Sachkunde ist auch erforderlich für Wachpersonen, die Schutz vor Ladendieben, Türsteher, Geld- und Wertdienste, Schutz von Asylunterkünften und Großveranstaltungen ausüben.' },
      { nr:'§ 34a Abs. 2', titel:'Zuverlässigkeit',
        inhalt:'Die Erlaubnis ist zu versagen, wenn Tatsachen die Annahme rechtfertigen, dass der Antragsteller die für den Gewerbebetrieb erforderliche Zuverlässigkeit nicht besitzt. Dies ist insbesondere der Fall bei Verurteilungen wegen bestimmter Straftaten in den letzten 5 Jahren.' },
      { nr:'§ 34a Abs. 5', titel:'Pflichten des Gewerbetreibenden',
        inhalt:'Der Gewerbetreibende muss vor Aufnahme der Tätigkeit jeden Wächter dem Gewerbeamt anzeigen, Dienstausweise ausstellen, ein Tätigkeits-Verzeichnis führen und eine Haftpflichtversicherung abschließen.' },
    ],

    'bewachv': [
      { nr:'§ 1 BewachV', titel:'Anwendungsbereich',
        inhalt:'Die Verordnung regelt die Anforderungen an die Sachkundeprüfung nach § 34a GewO und an Wachpersonen sowie die Pflichten der Gewerbetreibenden.' },
      { nr:'§ 2 BewachV', titel:'Unterrichtung 40 Stunden',
        inhalt:'Wachpersonen, die einfache Bewachungstätigkeiten ausüben (z.B. Empfangsdienst, Streifendienst), müssen vor Aufnahme der Tätigkeit an einer 40-stündigen Unterrichtung bei der IHK teilnehmen. Themen: Recht, Umgang mit Waffen, Eigensicherung, Erste Hilfe.' },
      { nr:'§ 5–9 BewachV', titel:'Sachkundeprüfung 80h',
        inhalt:'Für anspruchsvolle Tätigkeiten ist die Sachkundeprüfung vorgeschrieben (80 Stunden Lehrgang + Prüfung). Erforderlich für: Türsteher in Gaststätten/Diskotheken, Ladendiebstahl-Schutz, Geld-/Werttransporte, Asylunterkünfte, Großveranstaltungen.' },
      { nr:'§ 13 BewachV', titel:'Dienstausweis',
        inhalt:'Die Wachperson muss bei der Ausübung der Tätigkeit einen Dienstausweis mit sich führen. Inhalt: Lichtbild, Name, Geburtsdatum, Bewachungsunternehmen, Ausstellungsdatum, Dauer.' },
      { nr:'§ 14 BewachV', titel:'Bewacherregister (BWR)',
        inhalt:'Jede Wachperson, jeder Wachunternehmer wird vor Tätigkeitsaufnahme im bundesweiten Bewacherregister (BWR) eingetragen. Pflichtdaten: Personalien, Qualifikation, Eintragungsgrund, Bewachungsfirma.' },
      { nr:'§ 16 BewachV', titel:'Versicherung',
        inhalt:'Der Bewachungsunternehmer muss eine Haftpflichtversicherung abschließen — mindestens 1 Mio. € pro Schadensfall für Personenschäden und 250.000 € für Sachschäden.' },
    ],

    'dguv-v1': [
      { nr:'§ 2 DGUV V1', titel:'Grundpflichten des Unternehmers',
        inhalt:'Der Unternehmer hat die Maßnahmen zur Verhütung von Arbeitsunfällen, Berufskrankheiten und arbeitsbedingten Gesundheitsgefahren zu treffen. Dazu gehört auch die Bereitstellung von PSA (Persönliche Schutzausrüstung).' },
      { nr:'§ 3 DGUV V1', titel:'Beurteilung der Arbeitsbedingungen',
        inhalt:'Vor Aufnahme der Tätigkeit ist eine Gefährdungsbeurteilung schriftlich durchzuführen. Sie wird regelmäßig überprüft und bei Änderungen aktualisiert.' },
      { nr:'§ 4 DGUV V1', titel:'Allgemeine Unterstützungspflichten der Versicherten',
        inhalt:'Versicherte sind verpflichtet, die Maßnahmen zur Verhütung von Unfällen zu unterstützen und die persönliche Schutzausrüstung zu benutzen.' },
      { nr:'§ 12 DGUV V1', titel:'Unterweisung',
        inhalt:'Der Unternehmer hat die Versicherten über Sicherheit und Gesundheitsschutz bei der Arbeit ausreichend zu unterweisen. Mindestens einmal jährlich. Die Unterweisung wird schriftlich dokumentiert.' },
      { nr:'§ 23 DGUV V1', titel:'Persönliche Schutzausrüstung',
        inhalt:'Der Unternehmer hat den Versicherten die persönliche Schutzausrüstung kostenfrei zur Verfügung zu stellen. PSA muss CE-konform sein.' },
      { nr:'§ 31 DGUV V1', titel:'Erste-Hilfe-Maßnahmen',
        inhalt:'Der Unternehmer hat sicherzustellen, dass Verletzten Erste Hilfe geleistet werden kann. Mindestens eine ausgebildete Ersthelfer-Quote (5–10% der Belegschaft).' },
    ],

    'dguv-v23': [
      { nr:'§ 2 DGUV V23', titel:'Anforderungen an Wachpersonen',
        inhalt:'Mit Wach- und Sicherungsaufgaben dürfen nur Personen beschäftigt werden, die körperlich und geistig geeignet sind, mindestens 18 Jahre alt sind und in der Tätigkeit unterwiesen wurden.' },
      { nr:'§ 3 DGUV V23', titel:'Persönliche Schutzausrüstung',
        inhalt:'Bei besonderen Gefährdungen (z.B. Geld-/Werttransport, Türstehertätigkeit) ist Schutzausrüstung wie Stichschutzweste, Helm, schussfeste Westen bereitzustellen.' },
      { nr:'§ 4 DGUV V23', titel:'Geld- und Werttransporte',
        inhalt:'Geld- und Werttransporte über bestimmten Betragsschwellen erfordern mindestens 2 Personen und ein gesichertes Transportfahrzeug. Kommunikationsmittel mit der Zentrale müssen permanent verfügbar sein.' },
      { nr:'§ 5 DGUV V23', titel:'Schutz an Türsteher-Positionen',
        inhalt:'Türsteher dürfen nicht alleine arbeiten in Diskotheken / Gaststätten mit besonderem Konfliktpotenzial. Es muss Funkverbindung zur Zentrale bestehen.' },
      { nr:'§ 6 DGUV V23', titel:'Diensthunde',
        inhalt:'Wachhunde dürfen nur von ausgebildeten Hundeführern eingesetzt werden. Der Hundeführer benötigt eine Bescheinigung über die Eignung des Hundes (z.B. nach IPO oder Schutzhundeprüfung).' },
      { nr:'§ 7 DGUV V23', titel:'Notruf-Einrichtungen',
        inhalt:'Bei Alleintätigkeit muss eine Notruf-Einrichtung (Personennotsignalgerät PNG-11) bereitgestellt werden, die im Notfall automatisch die Leitstelle alarmiert.' },
    ],

    'din77200': [
      { nr:'Teil 1', titel:'Allgemeine Anforderungen',
        inhalt:'Definiert Qualitätsstandards für Sicherheitsdienstleister: Unternehmensstruktur, Personalauswahl, Schulung, Auditing, Beschwerdemanagement, Versicherungen.' },
      { nr:'Teil 2', titel:'Mobile Sicherheitsdienste',
        inhalt:'Standards für Streifendienste, Revierdienste, Interventionsdienste: Reaktionszeiten, GPS-Tracking, Berichtswesen, Fahrzeug-Ausstattung.' },
      { nr:'Teil 3', titel:'Sonderveranstaltungen',
        inhalt:'Regelungen für Schutz von Konzerten, Stadien, Großevents: Personalstärke, Crowd-Management, Zusammenarbeit mit Polizei und Sanitätsdiensten.' },
      { nr:'Teil 4', titel:'Geld- und Wertdienste',
        inhalt:'Standards für Geldtransport: Fahrzeuge (Panzerung, Notruf), Transportablauf, Versicherungs-Vorgaben, Mitarbeiter-Qualifikation.' },
    ],

    'vde-0833-1': [
      { nr:'Abschnitt 4', titel:'Anlagenkonzeption',
        inhalt:'Vor Errichtung muss eine Anlagenkonzeption erarbeitet werden mit Schutzziel, Schutzgrad, Anlagenklasse, Aufschaltbedingungen und Wartungsregime.' },
      { nr:'Abschnitt 7', titel:'Qualifizierung Errichter',
        inhalt:'Errichter müssen über Fachkenntnisse, Erfahrung und entsprechende Schulungen verfügen. VdS-anerkannte Errichter sind Standard für versicherungsrelevante Anlagen.' },
      { nr:'Abschnitt 9', titel:'Instandhaltung',
        inhalt:'Wartungsintervalle (mindestens 1x jährlich), Inspektion, Reinigung der Sensoren, Test der Komponenten, Aktualisierung der Software/Firmware.' },
      { nr:'Abschnitt 10', titel:'Dokumentation',
        inhalt:'Vollständige Anlagendokumentation: Pläne, Komponentenliste, Programmierung, Wartungsbuch, Übergabeprotokoll. Aufbewahrungspflicht: gesamte Anlagenlebensdauer.' },
    ],

    'vde-0833-3': [
      { nr:'§ 4', titel:'Sicherungsgrade nach EN 50131-1',
        inhalt:'EMA-Sicherungsgrade 1 bis 4 nach Tätertyp: Grad 1 (Gelegenheits-Einbrecher) bis Grad 4 (organisierte Kriminalität / Profis). Bestimmt Anforderungen an Sabotageschutz, Übertragung, Verschlüsselung.' },
      { nr:'§ 6', titel:'Alarmübertragung',
        inhalt:'Aufschaltung an Notruf-Service-Leitstelle (NSL). Klassen A (Privat), B (Gewerbe), C (Hochsicherheit mit Dual-Path). Übertragungswege: IP, GSM, Funk, Festnetz.' },
      { nr:'§ 8', titel:'Wartung + Instandhaltung',
        inhalt:'Mindestens jährliche Wartung mit Funktionstest aller Komponenten. Bei Grad 3/4: halbjährliche Inspektion. Wartungsfirma muss qualifiziert sein.' },
    ],

    'en-1627': [
      { nr:'RC 1 N', titel:'Gelegenheits-Täter, ohne Werkzeug',
        inhalt:'Widerstand gegen körperliche Gewalt mit Tritten, Schulterwürfen, Hochstemmen. Kein Werkzeug. Prüfung ohne Zeitbegrenzung. Polizeilich empfohlen für Wohnungen im Mehrfamilienhaus.' },
      { nr:'RC 2', titel:'Gelegenheitstäter mit einfachem Werkzeug',
        inhalt:'3 Minuten Prüfzeit. Werkzeuge: Schraubendreher, Zange, Keile. Polizeilich empfohlene Mindest-Klasse für Einfamilienhäuser und Wohnungstüren.' },
      { nr:'RC 3', titel:'Versuchter Täter mit zweitem Schraubendreher',
        inhalt:'5 Minuten Prüfzeit. Weitere Werkzeuge: zweiter Schraubendreher, kleines Brecheisen. Empfehlung für Bürogebäude, Praxis-Räume, höherwertige Wohnungen.' },
      { nr:'RC 4', titel:'Erfahrener Täter mit Schlag- und Stemmwerkzeug',
        inhalt:'10 Minuten Prüfzeit. Werkzeuge: Säge, Bohrmaschine, größeres Brecheisen, Hammer. Für gewerbliche Objekte, Banken-Filialen.' },
      { nr:'RC 5', titel:'Erfahrener Täter mit Elektrowerkzeugen',
        inhalt:'15 Minuten Prüfzeit. Werkzeuge: Akkubohrer, Stichsäge, Winkelschleifer, Brechwerkzeuge. Für Tresorräume, Rechenzentren, KRITIS.' },
      { nr:'RC 6', titel:'Erfahrener Täter mit leistungsstarken Elektrowerkzeugen',
        inhalt:'20 Minuten Prüfzeit. Werkzeuge: leistungsstarke Trennschleifer (230 mm), Bohrmaschinen, Stichsägen. Für Hochsicherheits-Objekte, Militär.' },
    ],

    'en-50131': [
      { nr:'EN 50131-1', titel:'Allgemeine Anforderungen',
        inhalt:'Definiert Anlagengrad 1-4, Funktionsanforderungen, Umgebungsklassen (I bis IV), Mindest-Sabotageschutz, Datenschutz und Anlagenidentifizierung.' },
      { nr:'EN 50131-2-2', titel:'PIR-Bewegungsmelder',
        inhalt:'Anforderungen an Passiv-Infrarot-Bewegungsmelder: Erfassungsbereich, Tier-Immunität (optional), Anti-Masking ab Grad 3, Sabotage-Schutz.' },
      { nr:'EN 50131-2-3', titel:'Mikrowellen-Bewegungsmelder',
        inhalt:'Anforderungen an Mikrowellen-Sensoren: 10,525 GHz X-Band, Doppler-Auswertung, Reichweite, Empfindlichkeit.' },
      { nr:'EN 50131-2-4', titel:'Dual-Tech-Bewegungsmelder',
        inhalt:'Kombinationsmelder PIR+Mikrowelle. UND-Verknüpfung zur Fehlalarm-Reduktion. Mindestens 95% Erkennungsrate bei Mensch-Bewegung.' },
      { nr:'EN 50131-3', titel:'EMA-Zentralen',
        inhalt:'Anforderungen an Alarmzentralen: Mindest-Zonenzahl, Bedienteile, Logbuch, USV, Programmierung, Schnittstellen.' },
      { nr:'EN 50131-4', titel:'Signalgeber',
        inhalt:'Anforderungen an akustische und optische Signalgeber: 100 dB(A) bei 1 m, Mindestlaufzeit der Sirene, IP-Schutz, Sabotagesicherung.' },
      { nr:'EN 50131-5', titel:'Übertragungseinrichtungen',
        inhalt:'Anforderungen an Alarmübertragung: Single-Path / Dual-Path, Reaktionszeit, Verschlüsselung (ab Grad 3 verpflichtend), Pfad-Überwachung.' },
    ],

    'nis2': [
      { nr:'Art. 6 NIS2', titel:'Sektor-Identifizierung',
        inhalt:'Wesentliche Einrichtungen (Essential) und Wichtige Einrichtungen (Important) werden anhand von Sektor + Größe definiert. Schwellen: 50 MA oder 10 Mio. € Umsatz.' },
      { nr:'Art. 21 NIS2', titel:'Risikomanagement-Maßnahmen',
        inhalt:'Pflicht zu: Risikoanalyse, Vorfallsbearbeitung, Geschäftskontinuität (BCM), Lieferkettensicherheit, Personalsicherheit, Krypto-Maßnahmen, Multi-Faktor-Authentifizierung.' },
      { nr:'Art. 23 NIS2', titel:'Meldepflicht 24 Stunden',
        inhalt:'Schwere Sicherheitsvorfälle MÜSSEN innerhalb von 24 Stunden ans nationale CSIRT (in DE: BSI) gemeldet werden. Detail-Meldung innerhalb 72 Stunden. Abschlussbericht innerhalb 1 Monat.' },
      { nr:'Art. 24 NIS2', titel:'Geschäftsleitungs-Haftung',
        inhalt:'Mitglieder der Geschäftsleitung können PERSÖNLICH haftbar gemacht werden, wenn Cybersecurity-Maßnahmen nicht angemessen umgesetzt sind. Verpflichtende Cybersecurity-Schulungen.' },
      { nr:'Art. 34 NIS2', titel:'Bußgelder',
        inhalt:'Für Essential Entities: bis zu 10 Mio. € oder 2% des weltweiten Jahresumsatzes (je nachdem was höher ist). Für Important Entities: bis 7 Mio. € oder 1,4% Umsatz.' },
    ],

    'kritis-dachg': [
      { nr:'§ 5 KRITIS-DachG', titel:'KRITIS-Sektoren',
        inhalt:'10 Sektoren: Energie, Wasser, Verkehr, Gesundheit, Finanzen, Digitale Infrastruktur, Lebensmittel, Abfallwirtschaft, Öffentliche Verwaltung, Weltraum.' },
      { nr:'§ 6 KRITIS-DachG', titel:'Resilienz-Pflichten',
        inhalt:'KRITIS-Betreiber müssen alle 4 Jahre einen Resilienz-Plan vorlegen: Risiko-Analyse, Schutzmaßnahmen physisch und digital, Wiederherstellungs-Plan, Personal-Konzept.' },
      { nr:'§ 7 KRITIS-DachG', titel:'Meldepflicht',
        inhalt:'Erhebliche Vorfälle oder Drohungen müssen innerhalb 24 Stunden an das BBK (Bundesamt für Bevölkerungsschutz) gemeldet werden.' },
      { nr:'§ 10 KRITIS-DachG', titel:'Aufsicht durch BBK',
        inhalt:'Das BBK kann Vor-Ort-Audits durchführen, Berichte anfordern und Anordnungen erlassen. Bei Verstößen drohen Bußgelder bis 10 Mio. €.' },
      { nr:'§ 14 KRITIS-DachG', titel:'Mitarbeiter-Überprüfung',
        inhalt:'Bei besonders sensiblen Positionen (Zugang zu Schaltanlagen, IT-Kern, Verschlusssachen) kann eine Sicherheits-Überprüfung erforderlich sein.' },
    ],

    'bsi-it-sig': [
      { nr:'§ 8a BSIG', titel:'KRITIS-Anforderungen',
        inhalt:'KRITIS-Betreiber müssen "Stand der Technik" der IT-Sicherheit gewährleisten. Mindestens alle 2 Jahre Nachweis durch unabhängige Audits.' },
      { nr:'§ 8b BSIG', titel:'Meldepflicht IT-Vorfälle',
        inhalt:'Erhebliche Störungen müssen ans BSI gemeldet werden. Unverzüglich bei laufenden Vorfällen, anonyme Meldungen möglich für statistische Auswertung.' },
      { nr:'§ 9b BSIG', titel:'Kritische Komponenten',
        inhalt:'Verbot der Verwendung von Komponenten von "nicht vertrauenswürdigen" Herstellern in kritischer Infrastruktur (insb. 5G, Energie). BMI-Genehmigung erforderlich.' },
      { nr:'§ 14 BSIG', titel:'Bußgelder',
        inhalt:'Bei vorsätzlichen oder fahrlässigen Verstößen bis zu 20 Mio. € oder 4% des Welt-Jahresumsatzes (je nachdem was höher ist).' },
    ],

    'kritis-vo': [
      { nr:'§ 2 KritisV', titel:'Energie',
        inhalt:'Stromversorger ab 3.700 GWh/Jahr · Gasversorger ab 5.190 GWh/Jahr · Ölversorger ab 420.000 t/Jahr · Fernwärme ab 250 GWh/Jahr.' },
      { nr:'§ 3 KritisV', titel:'Wasser',
        inhalt:'Trinkwasser-Versorger ab 22 Mio. m³/Jahr (= ca. 500.000 versorgte Personen) · Abwasser-Entsorger ab 22 Mio. m³.' },
      { nr:'§ 4 KritisV', titel:'IT/Telekom',
        inhalt:'Rechenzentren ab 3,5 MW · Cloud-Anbieter ab 500.000 Nutzern · TK-Netze ab 100.000 Teilnehmern.' },
      { nr:'§ 6 KritisV', titel:'Gesundheit',
        inhalt:'Krankenhäuser ab 30.000 vollstationäre Fälle/Jahr · Apotheken-Versorger ab bestimmten Mengen.' },
      { nr:'§ 7 KritisV', titel:'Finanzen',
        inhalt:'Banken ab bestimmten Transaktions-Volumina · Börsen-Betreiber · Zahlungsdienstleister ab bestimmten Schwellen.' },
    ],

    'dsgvo': [
      { nr:'Art. 6 DSGVO', titel:'Rechtsgrundlagen',
        inhalt:'Datenverarbeitung nur mit: Einwilligung, Vertrag, rechtliche Verpflichtung, lebenswichtigen Interessen, öffentlicher Aufgabe, berechtigtem Interesse. Bei Videoüberwachung: meist "berechtigtes Interesse" (Art. 6 Abs. 1 lit. f).' },
      { nr:'Art. 13 DSGVO', titel:'Informationspflichten',
        inhalt:'Bei Videoüberwachung müssen Schilder am Eingang aufgestellt werden: Verantwortlicher, Zweck, Rechtsgrundlage, Speicherdauer, Kontaktdaten Datenschutzbeauftragter, Beschwerderecht.' },
      { nr:'Art. 17 DSGVO', titel:'Recht auf Löschung',
        inhalt:'Betroffene können Löschung ihrer Daten verlangen. Bei Videos meist nach 72 Stunden ohnehin automatisch überschrieben. Bei Vorfällen: längere Aufbewahrung möglich.' },
      { nr:'Art. 35 DSGVO', titel:'Datenschutz-Folgenabschätzung',
        inhalt:'Bei systematischer und umfangreicher Überwachung (insb. KI-Videoanalyse, Gesichtserkennung) ist eine Datenschutz-Folgenabschätzung verpflichtend.' },
      { nr:'Art. 83 DSGVO', titel:'Bußgelder',
        inhalt:'Bis zu 20 Mio. € oder 4% des welt­weiten Jahresumsatzes (je nachdem was höher ist).' },
    ],

    'bdsg': [
      { nr:'§ 4 BDSG', titel:'Videoüberwachung öffentlicher Raum',
        inhalt:'Videoüberwachung von öffentlich zugänglichen Bereichen ist zulässig: bei berechtigtem Interesse, zur Wahrnehmung des Hausrechts, zur Wahrnehmung berechtigter Interessen für konkret festgelegte Zwecke. Beschilderung MUSS vorhanden sein.' },
      { nr:'§ 26 BDSG', titel:'Beschäftigtendatenschutz',
        inhalt:'Datenverarbeitung im Beschäftigungs-Verhältnis nur zur Begründung, Durchführung oder Beendigung des Arbeitsverhältnisses. Ständige Videoüberwachung von Mitarbeitern grundsätzlich UNZULÄSSIG.' },
      { nr:'§ 38 BDSG', titel:'Datenschutz-Beauftragter',
        inhalt:'Pflicht zur Bestellung eines DSB ab 20 Mitarbeitern, die ständig mit der automatisierten Verarbeitung personenbezogener Daten beschäftigt sind.' },
    ],

    'vds-2333': [
      { nr:'SÜ 1', titel:'Geringes Risiko · Wohnungen',
        inhalt:'Basisschutz für Privatobjekte. Mechanik: Standard RC 1N-Türen. Elektronik: Optional. NSL: Optional. Versicherung: Hausrat Standard.' },
      { nr:'SÜ 2', titel:'Mittleres Risiko · EFH, Büros',
        inhalt:'Standardschutz für private und kleine gewerbliche Objekte. RC 2-Türen + P4A-Glas. EMA Grad 2. NSL empfohlen. Polizei-Empfehlung Minimum.' },
      { nr:'SÜ 3', titel:'Erhöhtes Risiko · Juweliere, Apotheken',
        inhalt:'Erhöhter Schutz bei Wertkonzentration. RC 3 + P5A. EMA Grad 2-3. NSL Pflicht (Klasse B). Schließblechkontakte ab hier PFLICHT.' },
      { nr:'SÜ 4', titel:'Hohes Risiko · Banken, Spielhallen',
        inhalt:'Hoher Schutz für Objekte mit hohem Schadenspotenzial. RC 4 + P6B. EMA Grad 3. Dual-Path NSL Pflicht. Intervention < 10 Min.' },
      { nr:'SÜ 5', titel:'Sehr hohes Risiko · KRITIS, Tresorräume',
        inhalt:'Sehr hoher Schutz. RC 5 + P7B. EMA Grad 3-4. Dual-Path mit Redundanz. Interventions-Zeit < 3 Min. Spezialversicherung.' },
      { nr:'SÜ 6', titel:'Höchstes Risiko · Militär, KKW',
        inhalt:'Höchster Schutz für staatliche/militärische Einrichtungen. RC 6 + P8B + BR. EMA Grad 4 mit redundanter Übertragung. Sofortige Intervention. Staatliche Versicherung.' },
    ],

    'vds-3138': [
      { nr:'Klasse A', titel:'Privatobjekte',
        inhalt:'Notruf-Service-Leitstelle für Privatkunden. Reaktionszeit < 90 Sek. Verifizierungs-Anrufe. Weiterleitung an Wachdienst oder Polizei nach Eskalations-Schema.' },
      { nr:'Klasse B', titel:'Gewerbliche Anlagen',
        inhalt:'NSL für Gewerbe. Erhöhte Verfügbarkeit (24/7), redundante Aufschaltwege. Interventionsdienst mit Anfahrzeit < 15 Min.' },
      { nr:'Klasse C', titel:'Hochsicherheit · Dual-Path',
        inhalt:'NSL der Hochsicherheits-Klasse. Doppelte Aufschaltung (IP + GSM), redundante NSL-Standorte, < 3 Min Intervention. Pflicht für SÜ 5/6.' },
    ],

    'wbk': [
      { nr:'§ 28 WaffG', titel:'Bedürfnis Bewachungsgewerbe',
        inhalt:'Wachpersonal kann eine waffenrechtliche Erlaubnis (kleine WBK) erhalten, wenn ein konkretes Bedürfnis besteht. Typische Fälle: Geld-/Werttransport, Personenschutz.' },
      { nr:'§ 28 Abs. 2 WaffG', titel:'Erlaubnis nur für aktive Tätigkeit',
        inhalt:'Die Erlaubnis ist personenbezogen und an die Tätigkeit gebunden. Mit Beendigung der Wachtätigkeit erlischt die Erlaubnis.' },
      { nr:'§ 7 WaffG', titel:'Sachkundenachweis',
        inhalt:'Für den Erwerb einer waffenrechtlichen Erlaubnis ist ein Sachkundenachweis erforderlich. Theoretische und praktische Prüfung.' },
    ],

    'din-14675': [
      { nr:'Abschnitt 4', titel:'Brandschutzkonzept',
        inhalt:'Vor BMA-Errichtung muss ein abgestimmtes Brandschutzkonzept vorliegen. Inhalt: Schutzziele, Personen-/Sachschutz, Räumungsplanung, Aufschaltung Feuerwehr.' },
      { nr:'Abschnitt 6', titel:'Errichterzertifikat',
        inhalt:'BMA dürfen nur von zertifizierten Errichterfirmen (DIN 14675-zertifiziert) errichtet werden. Mitarbeiter benötigen DIN 14675-Schulung.' },
      { nr:'Abschnitt 8', titel:'Übergabe',
        inhalt:'Bei Übergabe an Betreiber: Inbetriebnahmeprotokoll, Schulung des Personals, Übergabe der Dokumentation, Anzeige bei Feuerwehr.' },
      { nr:'Abschnitt 11', titel:'Instandhaltung',
        inhalt:'Vierteljährliche Sichtprüfung, halbjährliche Inspektion, jährliche Wartung. Bei Grad 3: Inspektion alle 3 Monate.' },
    ],
  };

  function getParagraphen(key) { return P[key] || []; }
  return { getParagraphen };
})();
