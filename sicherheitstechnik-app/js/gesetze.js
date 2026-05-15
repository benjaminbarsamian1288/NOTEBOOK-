/* Gesetze, Normen, Richtlinien für Sicherheitstechnik & Wachgewerbe.
   Interaktive Datenbank mit Filter, Suche, Detail-Drawer. */

window.GESETZE = (() => {
  const { el, drawer } = U;

  // Vollständige Daten
  const DB = [
    // ============== PERSONAL / WACHGEWERBE ==============
    {
      key:'gewo34a', kat:'Personal', name:'Gewerbeordnung §34a', kuerzel:'GewO §34a', jahr:'1869 (lfd. Novellen)',
      scope:'Erlaubnis für Bewachungsgewerbe in Deutschland',
      kernpunkte: [
        'Erlaubnispflicht: Wer ein Bewachungsgewerbe betreiben will, braucht §34a-Erlaubnis',
        'Zuverlässigkeit + persönliche Eignung erforderlich',
        'Sachkundenachweis nach §34a GewO + BewachV',
        'Mind. 40h Unterrichtung bei IHK / 80h Sachkundeprüfung bei höheren Tätigkeiten',
      ],
      relevant_fuer: ['Sicherheitsdienste','Werkschutz','Detektive','Geld-/Wertdienste','Personenschutz'],
      links: ['§ 34a GewO','BewachV','DGUV V23','DIN 77200'],
      summary:'Grundlage für alle Bewachungs-Tätigkeiten. Ohne §34a-Erlaubnis darf niemand gewerblich bewachen.'
    },
    {
      key:'bewachv', kat:'Personal', name:'Bewachungsverordnung', kuerzel:'BewachV', jahr:'2019 (aktuelle Fassung)',
      scope:'Durchführungsverordnung zu §34a GewO',
      kernpunkte: [
        'Sachkundeprüfung-Anforderungen detailliert',
        'Unterrichtung (40h) für einfache Bewachung',
        'Sachkundeprüfung (80h) für: Türsteher, Geld-/Wertdienst, Schutz vor Ladendieben, Asylunterkünfte, Großveranstaltungen',
        'Dienstausweis-Pflicht mit Lichtbild + Namen + Bewachungsunternehmen',
        'Bewacherregister (BWR) — bundesweite Datenbank, jeder Bewacher muss eingetragen sein',
      ],
      relevant_fuer: ['Wachpersonal','Türsteher','Empfangsdienst','Streifendienst','Veranstaltungsschutz'],
      links: ['GewO §34a','DGUV V23','DIN 77200-2'],
      summary:'Sagt WIE jemand zum Bewacher wird: Sachkunde-Prüfung, Eintragung im BWR, Dienstausweis.'
    },
    {
      key:'dguv-v1', kat:'Personal', name:'DGUV Vorschrift 1 · Grundsätze der Prävention', kuerzel:'DGUV V1', jahr:'2014',
      scope:'Allgemeine Pflichten zur Verhütung von Unfällen + Berufskrankheiten',
      kernpunkte: [
        'Pflicht des Unternehmers: sichere Arbeitsplätze + PSA bereitstellen',
        'Pflicht des Mitarbeiters: Schutzmittel benutzen, Anweisungen befolgen',
        'Unterweisung MINDESTENS jährlich, dokumentiert',
        'Erste-Hilfe-Material + Aushänge Pflicht',
        'Gefährdungsbeurteilung schriftlich',
      ],
      relevant_fuer: ['Alle Branchen','Sicherheitsdienste','Bauwesen','Werkschutz'],
      links: ['DGUV V2','DGUV V23','ArbSchG','BetrSichV'],
      summary:'Pflichten von Unternehmer und Mitarbeiter im Bereich Arbeitssicherheit + Prävention.'
    },
    {
      key:'dguv-v23', kat:'Personal', name:'DGUV Vorschrift 23 · Wach- und Sicherungsdienste', kuerzel:'DGUV V23', jahr:'1990 (mehrfach geändert)',
      scope:'Spezifische Unfallverhütung für Bewachungsgewerbe',
      kernpunkte: [
        'Eignung: nur körperlich + geistig geeignete Personen einsetzen',
        'Mindestalter 18 Jahre',
        'Schutzausrüstung bei Risikoeinsätzen (Stichschutzweste, etc.)',
        'Schulung in Erster Hilfe + Konfliktdeeskalation',
        'Geld- und Werttransport: 2 Personen Mindestbesetzung, Sicherungsfahrzeug',
        'Wachhunde-Einsatz nur durch geprüfte Hundeführer',
      ],
      relevant_fuer: ['Wachdienste','Geld-/Wertdienste','Werkschutz','Türsteher'],
      links: ['BewachV','DGUV V1','§34a GewO'],
      summary:'Unfallverhütung speziell für Wachpersonal: Eignung, Schutzausrüstung, Schulungen, Gefahrengruppen.'
    },
    {
      key:'din77200', kat:'Personal', name:'DIN 77200 · Sicherheitsdienstleistungen', kuerzel:'DIN 77200', jahr:'2017 (Neufassung)',
      scope:'Qualitätsstandards für Sicherheitsdienstleister',
      kernpunkte: [
        'Teil 1: Allgemeine Anforderungen',
        'Teil 2: Mobile Sicherheitsdienste (Streifen, Revierdienst)',
        'Teil 3: Sonderveranstaltungen',
        'Teil 4: Geld- und Wertdienste',
        'Personalauswahl + Schulung dokumentieren',
        'Notruf-Service-Leitstelle (NSL) Anforderungen',
        'Berichtswesen und Audit-Trails',
      ],
      relevant_fuer: ['Werkschutz','Streifendienst','Veranstaltungen','Wertdienste','NSL-Betreiber'],
      links: ['BewachV','VdS 3138','DIN EN 50518'],
      summary:'Qualitäts-Norm: Welche Standards muss ein Sicherheitsdienstleister erfüllen.'
    },

    // ============== TECHNIK / ANLAGEN ==============
    {
      key:'vde-0833-1', kat:'Anlagen', name:'DIN VDE 0833-1 · GMA Allgemein', kuerzel:'VDE 0833-1', jahr:'2014',
      scope:'Allgemeine Festlegungen für Gefahrenmeldeanlagen (Brand, Einbruch, Überfall)',
      kernpunkte: [
        'Planung, Errichtung, Betrieb GMA',
        'Errichter müssen qualifiziert sein',
        'Wartungsintervalle: 1x jährlich Inspektion, je nach Anlage',
        'Übergabe-Protokoll Pflicht',
        'Bestandsschutz von Altanlagen',
      ],
      relevant_fuer: ['EMA','BMA','Errichter','Wartungsfirmen'],
      links: ['VDE 0833-2','VDE 0833-3','DIN EN 50131','DIN 14675'],
      summary:'Dachnorm für alle Gefahrenmeldeanlagen. Definiert Grundsätze.'
    },
    {
      key:'vde-0833-2', kat:'Anlagen', name:'DIN VDE 0833-2 · BMA', kuerzel:'VDE 0833-2', jahr:'2017',
      scope:'Festlegungen für Brandmeldeanlagen (BMA)',
      kernpunkte: [
        'Planung von Brandmeldeanlagen',
        'Detektor-Positionierung nach Raumgröße + Risiko',
        'Aufschaltung an Feuerwehr (BMZ + ÜAG)',
        'Wartung: vierteljährlich Sichtprüfung, jährlich vollständig',
        'BMA-Errichter: VdS-anerkannt + zertifizierte Mitarbeiter',
      ],
      relevant_fuer: ['BMA-Planung','BMA-Wartung','Feuerwehr-Aufschaltung'],
      links: ['DIN 14675','DIN EN 54','VdS 2095'],
      summary:'Konkrete Anforderungen an Brandmeldeanlagen: Planung, Errichtung, Betrieb, Instandhaltung.'
    },
    {
      key:'vde-0833-3', kat:'Anlagen', name:'DIN VDE 0833-3 · EMA', kuerzel:'VDE 0833-3', jahr:'2009/A1:2017',
      scope:'Festlegungen für Einbruch- und Überfall-Meldeanlagen (EMA/ÜMA)',
      kernpunkte: [
        'Anlagengrad nach Risiko: Grad 1 bis 4',
        'Pflichten der Errichter, Betreiber, NSL',
        'Übertragungstechnik + Redundanz',
        'Notruf-Aufschaltung Klasse A/B/C',
        'Wartung jährlich + Inspektion',
      ],
      relevant_fuer: ['EMA-Errichter','VdS-Errichter','Wachbetriebe','NSL-Aufschaltung'],
      links: ['DIN EN 50131','VdS 2311','VdS 3138'],
      summary:'Pendant zu VDE 0833-2, aber für Einbruchmeldeanlagen.'
    },
    {
      key:'din-14675', kat:'Anlagen', name:'DIN 14675 · BMA Aufbau + Betrieb', kuerzel:'DIN 14675', jahr:'2020',
      scope:'Brandmeldeanlagen — Aufbau und Betrieb',
      kernpunkte: [
        'Spezielle DIN für BMA (parallel zu VDE 0833-2)',
        'Brandschutzkonzept Pflicht',
        'Feuerwehr-Schließung (Feuerwehrschlüsseldepot FSD)',
        'Brandmelderzentrale + Übertragungseinrichtung',
      ],
      relevant_fuer: ['BMA-Planer','Errichter','Wartung','Feuerwehr'],
      links: ['VDE 0833-2','DIN EN 54'],
      summary:'Praxisnahe Ausführungs-DIN für Brandmeldeanlagen.'
    },
    {
      key:'en-50131', kat:'Anlagen', name:'DIN EN 50131 · EMA-Norm', kuerzel:'EN 50131', jahr:'ab 2007',
      scope:'EU-Normenreihe für Einbruch-/Überfall-Meldeanlagen',
      kernpunkte: [
        '-1: Allgemein',
        '-2-2: PIR-Bewegungsmelder',
        '-2-3: Mikrowellen-Melder',
        '-2-4: Dual-Tech-Melder',
        '-2-5: IR-Lichtschranken',
        '-2-6: Magnet-/Druck-Schalter',
        '-2-7: Glasbruch-Melder',
        '-2-8: Erschütterungsmelder',
        '-2-9: Kapazitive Feldmelder',
        '-3: EMA-Zentralen',
        '-4: Signalgeber',
        '-5: Übertragungseinrichtungen',
        'Klassifizierung Grad 1–4 (Risiko-Einstufung)',
      ],
      relevant_fuer: ['EMA-Hersteller','Errichter','VdS-Prüfung'],
      links: ['VDE 0833-3','VdS 2311'],
      summary:'Europäische Normen-Familie für alle EMA-Komponenten.'
    },
    {
      key:'en-1627', kat:'Anlagen', name:'DIN EN 1627–1630 · RC-Klassen', kuerzel:'EN 1627', jahr:'2011',
      scope:'Einbruchhemmende Bauteile (Türen, Fenster, Verglasung)',
      kernpunkte: [
        'RC 1 N: Gelegenheitstäter (privat, ohne Werkzeug)',
        'RC 2: 3 Min Prüfzeit, einfache Werkzeuge',
        'RC 3: 5 Min, Brechwerkzeuge',
        'RC 4: 10 Min, Akku-Bohrer, Trennschleifer',
        'RC 5: 15 Min, Elektrowerkzeuge',
        'RC 6: 20 Min, Profi-Werkzeuge',
      ],
      relevant_fuer: ['Türen-/Fenster-Hersteller','Architekten','Bauherren','VdS-SÜ-Bewertung'],
      links: ['DIN EN 356 (Verglasung)','VdS 2333'],
      summary:'Klassifizierung von einbruchhemmenden Bauteilen nach Widerstandsklasse RC.'
    },
    {
      key:'vds-2311', kat:'Anlagen', name:'VdS 2311 · EMA-Planung', kuerzel:'VdS 2311', jahr:'2017',
      scope:'VdS-Richtlinie für Planung + Einbau von EMA',
      kernpunkte: [
        'Detailspezifikationen pro Komponente',
        'Verlegung der Leitungen, Verkabelung',
        'Mantel- und Sabotage-Schutz',
        'Versicherungs-Anforderungen',
      ],
      relevant_fuer: ['VdS-Errichter','Versicherungs-relevante Anlagen'],
      links: ['VdS 2333','VdS 2227'],
      summary:'Detail-Richtlinie für Errichter — VdS-anerkennungsfähige EMA-Anlagen.'
    },
    {
      key:'vds-2333', kat:'Anlagen', name:'VdS 2333 · Sicherungsrichtlinien', kuerzel:'VdS 2333', jahr:'2020',
      scope:'Definition der Sicherungsklassen SÜ 1–6',
      kernpunkte: [
        'SÜ 1: Privat / Wohnen',
        'SÜ 2: Standard-Gewerbe',
        'SÜ 3: Juweliere, Apotheken',
        'SÜ 4: Banken, Spielhallen',
        'SÜ 5: KRITIS, Tresorräume',
        'SÜ 6: Staatlich, Militär',
        'Pro Klasse: Anforderungen an Mechanik + Elektronik + Organisation',
      ],
      relevant_fuer: ['Versicherungen','Errichter','VdS-Planung','Risikobewertung'],
      links: ['VdS 2311','DIN EN 1627','EN 50131'],
      summary:'Das wichtigste VdS-Dokument: Welche Sicherungsklasse für welches Objekt.'
    },
    {
      key:'vds-3138', kat:'Anlagen', name:'VdS 3138 · NSL-Anforderungen', kuerzel:'VdS 3138', jahr:'2018',
      scope:'Notruf- und Service-Leitstellen (NSL)',
      kernpunkte: [
        'Klasse A: Privatkunden, einfache Aufschaltung',
        'Klasse B: Gewerbliche Anlagen',
        'Klasse C: Hochsicherheit, Dual-Path, redundant',
        '24/7 Besetzung Pflicht',
        'Verifikations-Prozeduren',
        'Eskalations-Verfahren',
      ],
      relevant_fuer: ['NSL-Betreiber','Errichter','Versicherungen'],
      links: ['VdS 2311','VdS 2333','DIN EN 50518'],
      summary:'Welche Anforderungen muss eine NSL erfüllen: Personal, Technik, Verfahren.'
    },

    // ============== KRITIS / CYBER ==============
    {
      key:'kritis-dachg', kat:'KRITIS', name:'KRITIS-Dachgesetz', kuerzel:'KRITIS-DachG', jahr:'2025 (geplant)',
      scope:'Bundeseinheitlicher Rahmen für PHYSISCHEN Schutz Kritischer Infrastrukturen',
      kernpunkte: [
        'Umsetzung der EU-CER-Richtlinie (Critical Entities Resilience)',
        'Betreiber Kritischer Anlagen müssen Resilienz nachweisen',
        'Verpflichtung zu: Risikoanalyse, Schutzmaßnahmen, Vorfallsmeldung',
        'Sektoren: Energie, Wasser, Verkehr, Gesundheit, Finanzen, Digitale Infrastruktur, Lebensmittel, Abfallwirtschaft, öffentliche Verwaltung, Weltraum, ...',
        'Schwellenwerte definieren wann ein Betreiber KRITIS ist',
        'Aufsicht: BBK (Bundesamt für Bevölkerungsschutz)',
        'Bußgelder bis 10 Mio. € bei Verstößen',
      ],
      relevant_fuer: ['Energieversorger','Wasserwerke','Krankenhäuser','Verkehr','Banken','Telekom','Behörden'],
      links: ['BSI-Gesetz','NIS2-Richtlinie','KRITIS-Verordnung'],
      summary:'NEU: Verpflichtet KRITIS-Betreiber zu umfassendem physischen Schutz. Pendant zu NIS2 für die ANALOGE Welt.'
    },
    {
      key:'nis2', kat:'KRITIS', name:'NIS2-Richtlinie', kuerzel:'NIS2', jahr:'2024 (Umsetzung in DE: 2024/2025)',
      scope:'EU-Cybersecurity-Richtlinie für Netzwerk- und Informationssysteme',
      kernpunkte: [
        'Erheblich erweiterte Pflichten gegenüber NIS1',
        'Wesentliche Einrichtungen (Essential): Energie, Verkehr, Bank, Gesundheit, Wasser, Digital',
        'Wichtige Einrichtungen (Important): Post, Abfall, Lebensmittelversorger, Chemie, Forschung',
        'Schwellen: ab 50 MA oder 10 Mio. € Umsatz',
        'Risikomanagement, Vorfallsmeldung 24h, regelmäßige Audits',
        'GESCHÄFTSLEITUNG persönlich haftbar',
        'Bußgelder bis 10 Mio. € oder 2% Weltjahresumsatz',
      ],
      relevant_fuer: ['ca. 30.000 deutsche Unternehmen','IT-Leitung','Datenschutz','Geschäftsleitung','SOC'],
      links: ['BSI-Gesetz','IT-SiG 2.0','KRITIS-DachG'],
      summary:'EU-Pflicht für Cybersecurity. Persönliche Haftung der Geschäftsleitung. Auch für Mittelstand.'
    },
    {
      key:'bsi-it-sig', kat:'KRITIS', name:'IT-Sicherheitsgesetz 2.0', kuerzel:'IT-SiG 2.0', jahr:'2021',
      scope:'Stärkt BSI als Cyber-Aufsichtsbehörde + erweitert KRITIS-Pflichten',
      kernpunkte: [
        'KRITIS-Betreiber müssen Stand der Technik nachweisen (mind. alle 2 Jahre)',
        'Meldepflicht für IT-Sicherheitsvorfälle ans BSI',
        'BSI kann Sicherheitslücken erforschen',
        'Verbot vertrauensunwürdiger Komponenten (z.B. bestimmte Hersteller)',
        'Bußgelder bis 20 Mio. €',
      ],
      relevant_fuer: ['KRITIS-Betreiber','IT-Hersteller','Behörden'],
      links: ['BSI-Gesetz','NIS2','KRITIS-DachG'],
      summary:'Deutsche Umsetzung der Cybersecurity-Pflichten. Wird teilweise durch NIS2 / KRITIS-DachG abgelöst/erweitert.'
    },
    {
      key:'kritis-vo', kat:'KRITIS', name:'BSI-KRITIS-Verordnung', kuerzel:'BSI-KritisV', jahr:'2017 / Updates 2021',
      scope:'Definiert welche Anlagen als KRITIS gelten',
      kernpunkte: [
        'Schwellenwerte je Sektor (z.B. Energie: > 100.000 versorgte Haushalte)',
        '10 Sektoren mit konkreten Schwellen',
        'Wer drüber liegt, ist KRITIS-Betreiber',
        'Muss BSI nachweisen + zertifizieren lassen',
      ],
      relevant_fuer: ['Großunternehmen','Energieversorger','Krankenhäuser','Wasserwerke'],
      links: ['IT-SiG 2.0','KRITIS-DachG'],
      summary:'Konkrete Schwellenwerte: ab WANN ist man KRITIS?'
    },

    // ============== DATENSCHUTZ ==============
    {
      key:'dsgvo', kat:'Datenschutz', name:'DSGVO', kuerzel:'DSGVO / GDPR', jahr:'2018 (EU)',
      scope:'EU-Datenschutz-Grundverordnung — auch für Videoüberwachung',
      kernpunkte: [
        'Rechtsgrundlage für Datenverarbeitung (Art. 6)',
        'Informationspflichten + Schilder bei Videoüberwachung',
        'Speicherdauer auf Erforderliches beschränken (typ. 72h)',
        'Verarbeitungsverzeichnis Pflicht',
        'Datenschutz-Folgenabschätzung bei Risiko',
        'Auskunfts- + Löschrechte für Betroffene',
        'Bußgelder bis 4% Welt-Jahresumsatz',
      ],
      relevant_fuer: ['Alle Unternehmen','Video-Betreiber','EMA-Betreiber mit Personenbezug','HR'],
      links: ['BDSG','BfDI-Hinweise zu Video'],
      summary:'Datenschutzrecht. Wichtig für Videoüberwachung, Zutrittsprotokolle, KI-Bewertung.'
    },
    {
      key:'bdsg', kat:'Datenschutz', name:'BDSG · Bundesdatenschutzgesetz', kuerzel:'BDSG', jahr:'2018 (Neufassung mit DSGVO)',
      scope:'Deutsche Konkretisierung der DSGVO',
      kernpunkte: [
        'Beschäftigtendatenschutz § 26',
        'Videoüberwachung öffentlicher Raum § 4',
        'Datenschutzbeauftragter ab 20 Mitarbeitern',
        'Spezielle Regeln für Sicherheits-/Datenverarbeitung',
      ],
      relevant_fuer: ['Unternehmen','Datenschutzbeauftragte','HR'],
      links: ['DSGVO','BfDI'],
      summary:'BDSG ergänzt die DSGVO mit deutschen Spezifika.'
    },

    // ============== BRAND ==============
    {
      key:'en-54', kat:'Anlagen', name:'DIN EN 54 · Brandmeldetechnik', kuerzel:'EN 54', jahr:'laufend',
      scope:'EU-Normen für Brandmeldekomponenten',
      kernpunkte: [
        '-5: Wärmemelder',
        '-7: Optische Rauchmelder (Streulicht)',
        '-10: Flammenmelder',
        '-11: Handmelder',
        '-12: Linienförmige Rauchmelder (IR)',
        '-20: Ansaugrauchmelder (ASD)',
        '-22: Linienförmige Wärmemelder (LHD)',
        '-29: Multisensoren (Rauch + Wärme)',
      ],
      relevant_fuer: ['BMA-Hersteller','Errichter','Wartung'],
      links: ['DIN 14675','VDE 0833-2','VdS 2095'],
      summary:'Komponentennorm für Brandmelder. Jede Bauart hat eigene EN-54-X-Norm.'
    },

    // ============== SONSTIGE ==============
    {
      key:'wbk', kat:'Personal', name:'Waffengesetz · §28', kuerzel:'WaffG §28', jahr:'2002',
      scope:'Waffenrecht für Bewachungsgewerbe',
      kernpunkte: [
        'Bedürfnis für Schusswaffen muss konkret begründet werden',
        'Personenbezogene Erlaubnis für Wachpersonen',
        'Strenge Voraussetzungen: Zuverlässigkeit + Sachkunde',
        'Geld-/Wertdienst typische Berechtigung',
      ],
      relevant_fuer: ['Personenschutz','Geld-/Wertdienste','Militärsicherheit'],
      links: ['BewachV','GewO §34a'],
      summary:'Wann darf Wachpersonal Schusswaffen tragen?'
    },
  ];

  function view(d) {
    const root = el('div');
    root.appendChild(el('div', { class:'view-head' }, [
      el('span', { class:'crumb', text:'Recht · Normen · Vorschriften' }),
      el('h1', { text:'Gesetze · Normen · Richtlinien' }),
      el('p', { text:'Komplette Übersicht der relevanten Rechtsgrundlagen für Sicherheitstechnik, Wachgewerbe und KRITIS. Mit aktuellem KRITIS-Dachgesetz und NIS2-Richtlinie.' })
    ]));

    // Filter chips
    const cats = ['Alle', 'Personal', 'Anlagen', 'KRITIS', 'Datenschutz'];
    let activeCat = 'Alle';
    let q = '';

    const fbar = el('div', { class:'filterbar' });
    const chips = el('div', { class:'row', style:'gap:6px' });
    cats.forEach(c => {
      const b = el('button', { class:'chip'+(c===activeCat?' active':''), text: c });
      b.addEventListener('click', () => {
        activeCat = c;
        chips.querySelectorAll('.chip').forEach(x => x.classList.toggle('active', x.textContent===c));
        rerender();
      });
      chips.appendChild(b);
    });
    fbar.appendChild(chips);
    const inp = el('input', { class:'input', placeholder:'Suche: BewachV, KRITIS, NIS2, VdS, ...', style:'flex:1; min-width:200px' });
    inp.addEventListener('input', () => { q = inp.value.toLowerCase().trim(); rerender(); });
    fbar.appendChild(inp);
    root.appendChild(fbar);

    // Stats banner
    const stats = el('div', { class:'ges-stats' });
    stats.innerHTML = `
      <div class="ges-stat-pill"><i class="fas fa-gavel"></i> <strong>${DB.length}</strong> Vorschriften</div>
      <div class="ges-stat-pill"><i class="fas fa-user-shield"></i> <strong>${DB.filter(x=>x.kat==='Personal').length}</strong> Personal</div>
      <div class="ges-stat-pill"><i class="fas fa-microchip"></i> <strong>${DB.filter(x=>x.kat==='Anlagen').length}</strong> Anlagen</div>
      <div class="ges-stat-pill" style="--c:#ef4444"><i class="fas fa-shield-virus"></i> <strong>${DB.filter(x=>x.kat==='KRITIS').length}</strong> KRITIS</div>
      <div class="ges-stat-pill" style="--c:#c084fc"><i class="fas fa-lock"></i> <strong>${DB.filter(x=>x.kat==='Datenschutz').length}</strong> Datenschutz</div>
    `;
    root.appendChild(stats);

    // KRITIS-Hervorhebung
    const highlight = el('div', { class:'ges-highlight' });
    highlight.innerHTML = `
      <div class="ges-highlight-head">
        <i class="fas fa-circle-exclamation"></i>
        <strong>WICHTIG · NEU 2024/2025</strong>
      </div>
      <div class="ges-highlight-grid">
        <button class="ges-hl-card" data-key="kritis-dachg">
          <div class="ges-hl-icon"><i class="fas fa-shield"></i></div>
          <div>
            <strong>KRITIS-Dachgesetz</strong>
            <div class="muted small">Physischer Schutz Kritischer Infrastrukturen</div>
          </div>
        </button>
        <button class="ges-hl-card" data-key="nis2">
          <div class="ges-hl-icon"><i class="fas fa-network-wired"></i></div>
          <div>
            <strong>NIS2-Richtlinie</strong>
            <div class="muted small">EU-Cybersecurity · persönliche Geschäftsleitungs-Haftung</div>
          </div>
        </button>
      </div>
    `;
    highlight.addEventListener('click', e => {
      const b = e.target.closest('.ges-hl-card');
      if (b) openDetail(DB.find(x => x.key === b.dataset.key));
    });
    root.appendChild(highlight);

    // Grid
    const grid = el('div', { class:'ges-grid' });
    root.appendChild(grid);

    function rerender() {
      grid.innerHTML = '';
      const list = DB.filter(g => {
        if (activeCat !== 'Alle' && g.kat !== activeCat) return false;
        if (q) {
          const hay = (g.name + ' ' + g.kuerzel + ' ' + g.scope + ' ' + g.summary + ' ' + (g.kernpunkte||[]).join(' ')).toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
      if (!list.length) { grid.appendChild(el('p', { class:'muted', text:'Keine Treffer.' })); return; }
      list.forEach(g => grid.appendChild(card(g)));
    }
    rerender();

    return root;
  }

  function card(g) {
    const KAT_COLORS = {
      'Personal': '#22c55e',
      'Anlagen': '#22d3ee',
      'KRITIS': '#ef4444',
      'Datenschutz': '#c084fc',
    };
    const c = el('div', { class:'ges-card' });
    c.style.setProperty('--c', KAT_COLORS[g.kat] || '#94a3b8');
    c.innerHTML = `
      <div class="ges-card-head">
        <div class="ges-card-icon"><i class="fas fa-gavel"></i></div>
        <div class="ges-card-kat">${g.kat}</div>
        <div class="ges-card-jahr">${g.jahr}</div>
      </div>
      <div class="ges-card-kuerzel">${g.kuerzel}</div>
      <h3 class="ges-card-name">${g.name}</h3>
      <div class="ges-card-scope">${g.scope}</div>
      <div class="ges-card-summary">${g.summary}</div>
      <div class="ges-card-footer">
        <span class="ges-card-cta">Details <i class="fas fa-arrow-right"></i></span>
      </div>
    `;
    c.addEventListener('click', () => openDetail(g));
    return c;
  }

  function openDetail(g) {
    if (!g) return;
    const KAT_COLORS = {
      'Personal': '#22c55e',
      'Anlagen': '#22d3ee',
      'KRITIS': '#ef4444',
      'Datenschutz': '#c084fc',
    };
    const color = KAT_COLORS[g.kat] || '#94a3b8';
    const body = el('div', { class:'ges-detail' });
    body.style.setProperty('--c', color);
    body.innerHTML = `
      <div class="ges-detail-head">
        <div class="ges-detail-kuerzel">${g.kuerzel}</div>
        <div class="ges-detail-jahr">${g.jahr}</div>
      </div>
      <div class="ges-detail-scope">${g.scope}</div>

      <h3>📋 Zusammenfassung</h3>
      <p>${g.summary}</p>

      <h3>🎯 Kernpunkte</h3>
      <ul class="ges-list">
        ${g.kernpunkte.map(p => `<li>${p}</li>`).join('')}
      </ul>

      <h3>👥 Relevant für</h3>
      <div class="ges-tagrow">
        ${g.relevant_fuer.map(p => `<span class="ges-tag">${p}</span>`).join('')}
      </div>

      <h3>🔗 Verknüpfte Normen / Verweise</h3>
      <div class="ges-tagrow">
        ${(g.links||[]).map(p => `<span class="ges-tag-link">${p}</span>`).join('')}
      </div>
    `;
    drawer(g.kuerzel + ' · ' + g.name, body);
  }

  return { view };
})();
