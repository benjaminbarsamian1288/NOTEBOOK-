/* Gesetzes-Datenbank · 6 Sicherheits-relevante Gesetze
   - BeWachV (Bewachungsverordnung)
   - KRITIS-Dachgesetz (KRITIS-DachG)
   - NIS2 / BSIG
   - DGUV Vorschrift 1 (Grundsätze der Prävention)
   - DGUV Vorschrift 23 (Wach- und Sicherungsdienste) */

window.GESETZE_DB = (() => {

  const G = [
    /* ============= BeWachV ============= */
    {
      id: 'bewachv',
      short: 'BeWachV',
      title: 'Bewachungsverordnung',
      kategorie: 'Gewerberecht',
      datum: '03.05.2019',
      farbe: '#7c3aed',
      icon: 'fa-user-shield',
      url: 'https://www.gesetze-im-internet.de/bewachv_2019/',
      intro: 'Regelt das Bewachungsgewerbe nach § 34a GewO: Sachkundeprüfung, Unterrichtung, Haftpflicht, Wachpersonal-Ausweis, Dienstanweisung, Aufbewahrung.',
      anwender: 'Bewachungsunternehmer, Wachpersonen, IHK, Aufsichtsbehörden',
      visualisierung: 'bewachv-overview',
      abschnitte: [
        {
          nr: 1, title: 'Zuständigkeit, Unterrichtung in Strafsachen, Antragstellung',
          paragraphen: [
            { p:'§ 1', t:'Örtliche Zuständigkeit', s:'Behörde am Hauptniederlassung-Ort des Unternehmens; bei Wachpersonen am Hauptwohnsitz.', tags:['Behörde','Zuständigkeit'] },
            { p:'§ 2', t:'Unterrichtung in Strafsachen', s:'Staatsanwaltschaften übermitteln Strafverfahren-Infos an Behörden zur Prüfung der Zuverlässigkeit.', tags:['Zuverlässigkeit'] },
            { p:'§ 3', t:'Angaben bei der Antragstellung', s:'Umfangreiche Datensammlung: persönliche Daten, Bewacherregister-ID, Personalausweis-Kopie, Sachkunde-Nachweis, Haftpflicht, Schuldnerverzeichnis.', tags:['Antrag','Daten'] },
          ],
        },
        {
          nr: 2, title: 'Unterrichtungsverfahren',
          paragraphen: [
            { p:'§ 4', t:'Zweck der Unterrichtung', s:'Wachpersonen sollen für eigenverantwortliche Wahrnehmung von Bewachungsaufgaben befähigt werden.', tags:['Schulung'] },
            { p:'§ 5', t:'Zuständige Stelle', s:'IHK übernimmt die Unterrichtung.', tags:['IHK'] },
            { p:'§ 6', t:'Verfahren', s:'Mündliche Unterrichtung · mind. B1-Deutsch · 40 Unterrichtsstunden à 45 Min · max. 20 Teilnehmer.', tags:['40 h','B1'], wichtig:true },
            { p:'§ 7', t:'Inhalt der Unterrichtung', s:'7 Sachgebiete: 1) Recht der öffentl. Sicherheit, 2) Datenschutz, 3) BGB, 4) Straf-/Strafprozess-Recht + Waffen, 5) UVV Wach- und Sicherungsdienste, 6) Umgang mit Menschen + Deeskalation, 7) Grundzüge Sicherheitstechnik.', tags:['7 Sachgebiete'], wichtig:true },
            { p:'§ 8', t:'Anerkennung anderer Nachweise', s:'Wer Werkschutzfachkraft, Schutz- und Sicherheitskraft, Fachkraft Schutz/Sicherheit, Meister Schutz/Sicherheit ist, braucht keine Unterrichtung.', tags:['Anerkennung'] },
          ],
        },
        {
          nr: 3, title: 'Sachkundeprüfung',
          paragraphen: [
            { p:'§ 9', t:'Zweck/Gegenstand der Sachkundeprüfung', s:'Nachweis der für eigenverantwortliche Wahrnehmung erforderlichen Kenntnisse. Pflicht für selbständige Bewachung, Tätigkeit nach §34a GewO Abs.1a Satz 2.', tags:['Sachkunde'] },
            { p:'§ 10', t:'Zuständige Stelle und Prüfungsausschuss', s:'IHK bildet Prüfungsausschuss mit Vorsitzendem + Stellvertreter.', tags:['IHK','Prüfung'] },
            { p:'§ 11', t:'Prüfung, Verfahren', s:'2 Teile: schriftlich + mündlich (15 min pro Prüfling). Mind. ausreichend in beiden. Wiederholung möglich.', tags:['Schriftl./Mündl.'], wichtig:true },
            { p:'§ 12', t:'Anerkennung anderer Nachweise', s:'Bei Werkschutzmeister etc. entfällt die Sachkundeprüfung.', tags:['Anerkennung'] },
          ],
        },
        {
          nr: 4, title: 'Anerkennung ausländischer Befähigungsnachweise',
          paragraphen: [
            { p:'§ 13', t:'Gebrauch der Dienstleistungsfreiheit', s:'Bei unzureichender Qualifikation aus EU/EWR-Staat erfolgt Prüfung durch Behörde.', tags:['EU','Dienstleistungsfreiheit'] },
          ],
        },
        {
          nr: 5, title: 'Haftpflichtversicherung',
          paragraphen: [
            { p:'§ 14', t:'Umfang der Versicherung', s:'Mindestversicherungssummen je Schadensereignis: Personenschäden 1.000.000 € · Sachschäden 250.000 € · Abhandenkommen bewachter Sachen 15.000 € · Vermögensschäden 12.500 €.', tags:['Pflicht','Versicherungssummen'], wichtig:true },
            { p:'§ 15', t:'Versicherungsbestätigung', s:'Bestätigung max. 3 Monate alt bei Antragstellung. Versicherer hat Beendigung/Kündigung sofort der Behörde anzuzeigen.', tags:['3 Monate'] },
          ],
        },
        {
          nr: 6, title: 'Verpflichtungen bei der Ausübung des Gewerbes',
          paragraphen: [
            { p:'§ 16', t:'Beschäftigte, An-/Abmeldung', s:'Beschäftigung nur nach Anmeldung im Bewacherregister + bestätigte Zuverlässigkeit + Befähigung + Volljährigkeit.', tags:['Bewacherregister'], wichtig:true },
            { p:'§ 17', t:'Dienstanweisung', s:'Schriftliche Dienstanweisung verpflichtend: Wachperson hat KEINE Polizei-Befugnisse · Waffenführung mit Zustimmung · Waffengebrauch sofort melden · Schweigepflicht.', tags:['Schriftform','Schweigepflicht'], wichtig:true },
            { p:'§ 18', t:'Ausweis und Kennzeichnung der Wachperson', s:'Ausweis mit Namen, Foto, Unterschrift, Bewacherregister-ID · Schild mit Name oder Kennnummer bei Tätigkeiten nach §34a GewO Abs.1a Satz 2.', tags:['Pflicht','Ausweis'], wichtig:true },
            { p:'§ 19', t:'Dienstkleidung', s:'Darf sich von Uniformen der Streitkräfte/Polizei deutlich unterscheiden. Keine verwechslungsfähigen Abzeichen.', tags:['Kleidung'] },
            { p:'§ 20', t:'Behandlung der Waffen', s:'Sichere Aufbewahrung pflicht. Waffengebrauch unverzüglich der Behörde + Polizei anzeigen.', tags:['Waffen','Meldepflicht'] },
            { p:'§ 21', t:'Buchführung und Aufbewahrung', s:'Aufzeichnungen über alle Bewachungsverträge, Wachpersonen, Dienstanweisung, Versicherung, Belehrungen. Aufbewahrung 3 Jahre.', tags:['3 Jahre','Buchhaltung'] },
          ],
        },
        {
          nr: 7, title: 'Ordnungswidrigkeiten',
          paragraphen: [
            { p:'§ 22', t:'Ordnungswidrigkeiten', s:'Bußgelder bei Verstößen gegen §§ 16—21: Beschäftigung ohne Bestätigung, fehlende Dienstanweisung, fehlende Ausweise, fehlende Schilder, Waffen ohne Rückgabe, fehlende Aufzeichnungen.', tags:['Bußgeld','OWiG'] },
          ],
        },
        {
          nr: 8, title: 'Schlussvorschriften',
          paragraphen: [
            { p:'§ 23', t:'Übergangsvorschriften', s:'Personen aktiv seit vor 31.03.1996 bzw. 1.1.2003 unter Bedingungen befreit von Unterrichtung/Sachkundeprüfung.', tags:['Übergang'] },
            { p:'§ 24', t:'Inkrafttreten/Außerkrafttreten', s:'In Kraft seit 1.6.2019. Alte Fassung von 10.7.2003 außer Kraft.', tags:['1.6.2019'] },
          ],
        },
      ],
    },

    /* ============= KRITIS-DachG ============= */
    {
      id: 'kritis',
      short: 'KRITIS-DachG',
      title: 'KRITIS-Dachgesetz',
      kategorie: 'KRITIS · Resilienz',
      datum: '29.01.2026 (konsolidiert)',
      farbe: '#dc2626',
      icon: 'fa-shield-virus',
      url: 'https://dserver.bundestag.de/btd/21/039/2103906.pdf',
      intro: 'Umsetzung der EU-Richtlinie 2022/2557 (Critical Entities Resilience). 10 Sektoren · Registrierungspflicht · Resilienz-Maßnahmen · Meldepflicht bei Vorfällen.',
      anwender: 'Betreiber kritischer Anlagen, BBK, BSI, Bundes-/Landesbehörden',
      visualisierung: 'kritis-sektoren',
      abschnitte: [
        {
          nr: 1, title: 'Allgemeine Vorschriften',
          paragraphen: [
            { p:'§ 1', t:'Nationale KRITIS-Resilienzstrategie', s:'Bundesregierung soll Strategie zur Verbesserung der Resilienz kritischer Infrastrukturen verabschieden mit Transparenzpflichten.', tags:['Strategie'] },
            { p:'§ 2', t:'Begriffsbestimmungen', s:'12 Definitionen: Betreiber, Anlage, kritische Anlage, kritische Dienstleistung, Resilienz, Risiko, Vorfall, Einrichtungen der Bundesverwaltung, Geschäftsleitung, maritime Infrastrukturen.', tags:['Definitionen'], wichtig:true },
            { p:'§ 3', t:'Zentrale Anlaufstelle; Behörden', s:'BBK = zentrale Anlaufstelle. Zuständige Behörden je nach Sektor: BMI, BNetzA, BMWi, EBA, BSH, BAFin etc.', tags:['BBK','Aufsicht'] },
            { p:'§ 4', t:'Geltungsbereich; Sektoren', s:'10 Sektoren: Energie · Transport/Verkehr · Finanzwesen · Sozialversicherung · Gesundheit · Wasser · Ernährung · IT/TK · Weltraum · Siedlungsabfallentsorgung.', tags:['10 Sektoren'], wichtig:true },
            { p:'§ 5', t:'Erheblichkeit einer Anlage', s:'Regelwert: 500.000 versorgte Einwohner. Kriterien: Einwohner-Zahl, Sektoren-Abhängigkeit, Schaden bei Ausfall, Marktanteil, geografisches Gebiet, alternative Mittel.', tags:['500.000 Einw.','Schwellwerte'], wichtig:true },
            { p:'§ 6', t:'Sonstige Resilienzregelungen', s:'Bund/Länder können zusätzliche Vorgaben machen.', tags:['Subsidiarität'] },
            { p:'§ 7', t:'Einrichtungen der Bundesverwaltung', s:'Vorschriften für KRITIS-Betreiber gelten entsprechend für Bundesverwaltung.', tags:['Bundesverwaltung'] },
          ],
        },
        {
          nr: 2, title: 'Registrierung und Pflichten',
          paragraphen: [
            { p:'§ 8', t:'Registrierung kritischer Anlagen', s:'Pflicht zur Registrierung beim BBK spätestens 3 Monate nach Einstufung, frühestens 17.7.2026. Angaben: Betreiber-Name, Sektor, Standort, IP-Bereiche, Kontaktstelle.', tags:['BBK','Frist 17.7.2026'], wichtig:true },
            { p:'§ 9', t:'Kritische Einrichtungen von besonderer Bedeutung für Europa', s:'Wer in mind. 6 EU-Mitgliedstaaten gleichen Dienst erbringt = europäisch bedeutsam.', tags:['Europa','6 MS'] },
            { p:'§ 10', t:'Risikoanalyse + Risikobewertung', s:'Betreiber muss systematische Risikoanalyse durchführen.', tags:['Risiko'] },
            { p:'§ 11', t:'Resilienzplan', s:'Schriftlicher Plan mit Schutz-, Reaktions- und Wiederherstellungsmaßnahmen.', tags:['Plan'] },
            { p:'§ 12', t:'Geschäftsleitungs-Verantwortung', s:'Geschäftsleitung haftet persönlich für Umsetzung.', tags:['Geschäftsleitung','Haftung'], wichtig:true },
            { p:'§ 13', t:'Schulung', s:'Mitarbeiter müssen geschult werden.', tags:['Schulung'] },
            { p:'§ 14', t:'Meldepflicht bei Vorfällen', s:'Vorfälle, die eine kritische Dienstleistung beeinträchtigen können, sind dem BBK zu melden.', tags:['Meldepflicht','Vorfall'], wichtig:true },
            { p:'§ 15', t:'Information der Öffentlichkeit', s:'Bei Vorfällen ggf. öffentliche Warnung.', tags:['Öffentlichkeit'] },
            { p:'§ 16', t:'Hintergrundüberprüfungen', s:'Bei Personal mit Zugang zu sensiblen Bereichen.', tags:['Personal'] },
          ],
        },
        {
          nr: 3, title: 'Aufsicht und Sanktionen',
          paragraphen: [
            { p:'§ 17', t:'Untersuchungsbefugnisse', s:'BBK kann Anlagen besichtigen, Auskünfte verlangen, Dokumente prüfen.', tags:['Inspektion'] },
            { p:'§ 18', t:'Anordnungsbefugnisse', s:'BBK kann konkrete Maßnahmen anordnen.', tags:['Anordnung'] },
            { p:'§ 19', t:'Bußgelder', s:'Bis zu 10 Millionen € oder 2 % des weltweiten Jahresumsatzes (bei besonders wichtigen Betreibern).', tags:['10 Mio €','Bußgeld'], wichtig:true },
            { p:'§ 20', t:'Persönliche Haftung Geschäftsleitung', s:'Geschäftsleitung kann persönlich haftbar gemacht werden.', tags:['Persönliche Haftung'] },
            { p:'§ 21', t:'Übergangsvorschriften', s:'Stufen-Einführung bis Mitte 2026.', tags:['Übergang'] },
          ],
        },
      ],
    },

    /* ============= NIS2 / BSIG ============= */
    {
      id: 'nis2',
      short: 'NIS-2 / BSIG',
      title: 'NIS-2-Umsetzungsgesetz (BSIG 2025)',
      kategorie: 'Cyber-Sicherheit · IT',
      datum: '02.12.2025 (in Kraft)',
      farbe: '#22d3ee',
      icon: 'fa-shield-virus',
      url: 'https://www.bgbl.de/',
      intro: 'Umsetzung EU-Richtlinie 2022/2555 NIS-2. Stärkt Cybersicherheit für besonders wichtige + wichtige Einrichtungen in 18 Sektoren. Massive Erweiterung gegenüber NIS-1.',
      anwender: 'Über 30.000 Unternehmen in Deutschland (vs. 4.500 bei NIS-1), BSI, Geschäftsleitungen',
      visualisierung: 'nis2-meldekette',
      abschnitte: [
        {
          nr: 1, title: 'Allgemeine Vorschriften (Teil 1)',
          paragraphen: [
            { p:'§ 1', t:'Bundesamt für Sicherheit in der Informationstechnik', s:'BSI als zentrale Stelle für Informationssicherheit auf nationaler Ebene.', tags:['BSI'] },
            { p:'§ 2', t:'Begriffsbestimmungen', s:'46 Definitionen: Beinahevorfall, Cyberbedrohung, IKT-Dienst, Informationssicherheit, kritische Anlage, MSSP, NIS-2-Richtlinie, Schadprogramme, Schwachstelle, Sicherheitsvorfall etc.', tags:['46 Definitionen'], wichtig:true },
          ],
        },
        {
          nr: 2, title: 'Das Bundesamt – Aufgaben (Teil 2 Kap. 1)',
          paragraphen: [
            { p:'§ 3', t:'Aufgaben des Bundesamtes', s:'Gefahrenabwehr, Information, CSIRT-Aufgaben, Forschung, IT-Sicherheitsprodukte, Zertifizierung, Sicherheitskennzeichen, Beratung Polizei/Geheimdienste.', tags:['BSI-Aufgaben'] },
            { p:'§ 4', t:'Zentrale Meldestelle', s:'BSI = zentrale Meldestelle für IT-Sicherheitsvorfälle.', tags:['Meldestelle'] },
            { p:'§ 5', t:'Allgemeine Meldestelle', s:'Auch für Allgemeinheit verfügbar.', tags:['Meldestelle'] },
            { p:'§ 6', t:'Informationsaustausch', s:'BSI tauscht Infos mit nationalen + EU-Behörden.', tags:['EU-Austausch'] },
            { p:'§ 7', t:'Kontrolle der Bundes-Kommunikationstechnik', s:'BSI darf Kommunikationstechnik des Bundes kontrollieren.', tags:['Bundes-IT'] },
            { p:'§ 8', t:'Abwehr von Schadprogrammen', s:'BSI darf gegen Schadprogramme auf Bundes-IT vorgehen.', tags:['Malware'] },
            { p:'§ 10', t:'Maßnahmen zur Abwendung', s:'BSI kann Anordnungen treffen.', tags:['Anordnung'] },
            { p:'§ 13', t:'Warnungen', s:'BSI kann Warnungen an Öffentlichkeit veröffentlichen.', tags:['Warnung'] },
          ],
        },
        {
          nr: 3, title: 'Anwendungsbereich (Teil 3 Kap. 1)',
          paragraphen: [
            { p:'§ 28', t:'Besonders wichtige & wichtige Einrichtungen', s:'Zwei Kategorien: "besonders wichtige" (große Unternehmen in 11 Hochrisiko-Sektoren) + "wichtige" (mittlere/kleine in 7 weiteren Sektoren).', tags:['18 Sektoren','2 Kategorien'], wichtig:true },
            { p:'§ 29', t:'Einrichtungen der Bundesverwaltung', s:'Bundes-Behörden ebenfalls verpflichtet.', tags:['Bundesverwaltung'] },
          ],
        },
        {
          nr: 4, title: 'Pflichten – Risikomanagement, Meldung (Teil 3 Kap. 2)',
          paragraphen: [
            { p:'§ 30', t:'Risikomanagementmaßnahmen', s:'10 Mindest-Maßnahmen: Risiko-Analyse, Vorfallbewältigung, Backup, Lieferketten, IT-Sicherheit, Pen-Tests, Krypto/Auth, Personalsicherheit, Zugangskontrolle, Anlagenverwaltung.', tags:['10 Maßnahmen'], wichtig:true },
            { p:'§ 31', t:'Besondere Anforderungen für KRITIS-Betreiber', s:'Zusätzliche Pflichten gegenüber normalen Einrichtungen.', tags:['KRITIS-Plus'] },
            { p:'§ 32', t:'Meldepflichten', s:'3-Stufen-Meldung: 1) Frühwarnung in 24 h · 2) Vorfall-Meldung in 72 h · 3) Abschlussbericht in 1 Monat.', tags:['24h/72h/1M','Meldung'], wichtig:true },
            { p:'§ 33', t:'Registrierungspflicht', s:'Pflicht-Registrierung beim BSI mit Daten zur Einrichtung.', tags:['Registrierung'] },
            { p:'§ 35', t:'Unterrichtungspflichten', s:'BSI muss über Vorfälle benachrichtigt werden.', tags:['Unterrichtung'] },
            { p:'§ 38', t:'Umsetzungs-/Schulungspflicht der Geschäftsleitung', s:'Geschäftsleitung MUSS regelmäßig geschult werden. Persönliche Verantwortung!', tags:['Geschäftsleitung','Schulungspflicht'], wichtig:true },
            { p:'§ 41', t:'Untersagung kritischer Komponenten', s:'BSI kann bestimmte Komponenten verbieten (z.B. aus Drittstaaten).', tags:['Kompo-Verbot'] },
          ],
        },
        {
          nr: 5, title: 'Aufsicht (Teil 7)',
          paragraphen: [
            { p:'§ 61', t:'Aufsichts-/Durchsetzungs für besonders wichtige', s:'Proaktive Vor-Ort-Audits, Pen-Tests, Sicherheitsprüfungen jederzeit.', tags:['Vor-Ort-Audit'], wichtig:true },
            { p:'§ 62', t:'Aufsichts-/Durchsetzungs für wichtige', s:'Reaktive Audits nur bei Verdacht.', tags:['Reaktiv'] },
          ],
        },
        {
          nr: 6, title: 'Bußgeldvorschriften (Teil 8)',
          paragraphen: [
            { p:'§ 65', t:'Bußgelder', s:'Bis zu 10 Mio € oder 2 % des weltweiten Vorjahresumsatzes (besonders wichtige) · bis 7 Mio € / 1,4 % (wichtige). Persönliche Haftung möglich.', tags:['10 Mio €','2 % Umsatz'], wichtig:true },
          ],
        },
      ],
    },

    /* ============= DGUV V1 ============= */
    {
      id: 'dguv1',
      short: 'DGUV V1',
      title: 'DGUV Vorschrift 1 · Grundsätze der Prävention',
      kategorie: 'Arbeitsschutz · UVV',
      datum: '01.10.2014 (Fassung 07/2014)',
      farbe: '#22c55e',
      icon: 'fa-helmet-safety',
      url: 'https://publikationen.dguv.de/',
      intro: 'Allgemeine Unfallverhütungsvorschrift. Grundpflichten Unternehmer/Versicherte, Erste-Hilfe-Organisation, persönliche Schutzausrüstung, Sicherheitsbeauftragte.',
      anwender: 'Alle Unternehmer + Versicherte in DE (alle Branchen)',
      visualisierung: 'dguv1-pflichten',
      abschnitte: [
        {
          nr: 1, title: 'Allgemeine Vorschriften',
          paragraphen: [
            { p:'§ 1', t:'Geltungsbereich', s:'Gilt für Unternehmer + Versicherte. Auch für ausländische Unternehmen, die in DE tätig sind.', tags:['Universal'] },
          ],
        },
        {
          nr: 2, title: 'Pflichten des Unternehmers',
          paragraphen: [
            { p:'§ 2', t:'Grundpflichten des Unternehmers', s:'Erforderliche Maßnahmen zur Verhütung von Arbeitsunfällen + Berufskrankheiten + arbeitsbedingten Gesundheitsgefahren + wirksamer Erster Hilfe. Kosten NICHT auf Versicherte umlegbar.', tags:['Pflicht','Kosten'], wichtig:true },
            { p:'§ 3', t:'Gefährdungsbeurteilung', s:'Pflicht zur systematischen Beurteilung der Gefährdungen + Dokumentation + regelmäßiger Überprüfung.', tags:['Gefährdungsbeurteilung'], wichtig:true },
            { p:'§ 4', t:'Unterweisung der Versicherten', s:'Vor Aufnahme der Tätigkeit + danach mind. EINMAL JÄHRLICH unterweisen. Dokumentationspflicht.', tags:['Jährlich','Dokumentation'], wichtig:true },
            { p:'§ 5', t:'Vergabe von Aufträgen', s:'Bei Auftragsvergabe schriftliche Vorgaben + Aufsichtsregelung mit Fremdunternehmen.', tags:['Fremdfirmen'] },
            { p:'§ 6', t:'Zusammenarbeit mehrerer Unternehmer', s:'Bei gemeinsamen Arbeitsplätzen: Koordinator bestellen für Abstimmung der Schutzmaßnahmen.', tags:['Koordinator'] },
            { p:'§ 7', t:'Befähigung für Tätigkeiten', s:'Versicherte müssen für Tätigkeit befähigt sein. Qualifizierungsanforderungen beachten.', tags:['Befähigung'] },
            { p:'§ 8', t:'Gefährliche Arbeiten', s:'Bei gefährlichen Arbeiten zu mehreren: zuverlässige Aufsicht. Bei Einzelarbeit: technische/organisatorische Personenschutzmaßnahmen.', tags:['Allein-Arbeit'] },
            { p:'§ 9', t:'Zutritts- und Aufenthaltsverbote', s:'Unbefugte fernhalten, wo Gefahr besteht.', tags:['Zutrittsverbot'] },
            { p:'§ 10', t:'Besichtigung und Anordnung', s:'Aufsichtspersonen müssen Besichtigung ermöglichen + Anordnungen umsetzen.', tags:['Inspektion'] },
            { p:'§ 11', t:'Maßnahmen bei Mängeln', s:'Defekte Arbeitsmittel sofort außer Betrieb nehmen.', tags:['Mängel'] },
            { p:'§ 12', t:'Zugang zu Vorschriften', s:'Vorschriften müssen zugänglich sein.', tags:['Zugang'] },
            { p:'§ 13', t:'Pflichtenübertragung', s:'Schriftliche Übertragung von Pflichten möglich.', tags:['Übertragung'] },
            { p:'§ 14', t:'Ausnahmen', s:'BG kann Ausnahmen genehmigen.', tags:['Ausnahme'] },
          ],
        },
        {
          nr: 3, title: 'Pflichten der Versicherten',
          paragraphen: [
            { p:'§ 15', t:'Allgemeine Unterstützungspflichten', s:'Versicherte haben Maßnahmen zu unterstützen + Weisungen zu befolgen + keine sicherheitswidrigen Handlungen.', tags:['Mitwirkung'] },
            { p:'§ 16', t:'Besondere Unterstützungspflichten', s:'Festgestellte Gefahren sofort melden. Mängel beseitigen, wenn möglich.', tags:['Meldepflicht'] },
            { p:'§ 17', t:'Benutzung von Einrichtungen', s:'Schutzeinrichtungen nicht außer Funktion setzen.', tags:['Schutz nicht umgehen'] },
            { p:'§ 18', t:'Zutritts- und Aufenthaltsverbote', s:'Verbote zu beachten.', tags:['Zutritt'] },
          ],
        },
        {
          nr: 4, title: 'Organisation des betrieblichen Arbeitsschutzes',
          paragraphen: [
            { p:'§ 19', t:'Bestellung von Fachkräften für Arbeitssicherheit', s:'Sifa + Betriebsarzt bestellen.', tags:['Sifa'] },
            { p:'§ 20', t:'Sicherheitsbeauftragte', s:'Ab 21 Beschäftigten: Sicherheitsbeauftragte schriftlich bestellen.', tags:['Sibe','21 MA'], wichtig:true },
            { p:'§ 21', t:'Allgemeine Pflichten Unternehmer', s:'Pflichten bei besonderen Gefahren.', tags:['Gefahren'] },
            { p:'§ 22', t:'Notfallmaßnahmen', s:'Vorkehrungen für Notfälle, Räumung, Brandbekämpfung treffen.', tags:['Notfall'], wichtig:true },
            { p:'§ 23', t:'Maßnahmen gegen Wettereinflüsse', s:'Schutzmaßnahmen bei Witterung.', tags:['Wetter'] },
            { p:'§ 24', t:'Allgemeine Pflichten zur Ersten Hilfe', s:'Wirksame Erste Hilfe sicherstellen + Verbandbuch + Notruf-Aushang.', tags:['Erste Hilfe'] },
            { p:'§ 25', t:'Erforderliche Einrichtungen + Sachmittel', s:'Verbandkasten, ggf. Sanitätsraum, Erste-Hilfe-Kennzeichen.', tags:['Verbandkasten'] },
            { p:'§ 26', t:'Zahl und Ausbildung der Ersthelfer', s:'In Verwaltung/Handel: 1 Ersthelfer je 10 % der Beschäftigten · in sonstigen Betrieben: 1 je 10 %. Auffrischung alle 2 Jahre.', tags:['10 %','2 Jahre Auffr.'], wichtig:true },
            { p:'§ 27', t:'Ausbildung der Betriebssanitäter', s:'Ab 1.500 Versicherten Betriebssanitäter pflicht.', tags:['Bsan','1500'] },
            { p:'§ 28', t:'Unterstützungspflichten der Versicherten', s:'Erste-Hilfe-Leistung als Pflicht.', tags:['Hilfeleistung'] },
            { p:'§ 29', t:'Bereitstellung von PSA', s:'Persönliche Schutzausrüstung kostenfrei bereitstellen.', tags:['PSA'] },
            { p:'§ 30', t:'Benutzung von PSA', s:'PSA muss benutzt werden.', tags:['PSA-Pflicht'] },
            { p:'§ 31', t:'Besondere Unterweisungen', s:'Unterweisung in PSA-Gebrauch.', tags:['PSA-Schulung'] },
          ],
        },
        {
          nr: 5, title: 'Ordnungswidrigkeiten',
          paragraphen: [
            { p:'§ 32', t:'Ordnungswidrigkeiten', s:'Bußgeld bei Verstößen, bis 10.000 €.', tags:['Bußgeld'] },
          ],
        },
      ],
    },

    /* ============= DGUV V23 ============= */
    {
      id: 'dguv23',
      short: 'DGUV V23',
      title: 'DGUV Vorschrift 23 · Wach- und Sicherungsdienste',
      kategorie: 'Arbeitsschutz · Wachdienst',
      datum: '01.10.1990 (Fassung 01.01.1997)',
      farbe: '#fbbf24',
      icon: 'fa-user-shield',
      url: 'https://publikationen.dguv.de/',
      intro: 'Branchen-UVV für Wach- und Sicherungsdienste. Regelt Eignung, Ausrüstung, Hundeführung, Schusswaffen, Geldtransport, Werträume.',
      anwender: 'Bewachungsunternehmen, Wach-/Sicherungspersonal, Geldtransport',
      visualisierung: 'dguv23-themen',
      abschnitte: [
        {
          nr: 1, title: 'Geltungsbereich',
          paragraphen: [
            { p:'§ 1', t:'Geltungsbereich', s:'Wach- und Sicherungstätigkeiten zum Schutz von Personen und Sachwerten.', tags:['Wachschutz'] },
          ],
        },
        {
          nr: 2, title: 'Gemeinsame Bestimmungen',
          paragraphen: [
            { p:'§ 2', t:'Allgemeines', s:'Bestimmungen richten sich an Unternehmer + Versicherte.', tags:['Geltung'] },
            { p:'§ 3', t:'Eignung', s:'Wach-/Sicherungstätigkeiten nur durch geeignete Versicherte. Befähigung muss vorliegen, Aufzeichnungspflicht.', tags:['Eignung'], wichtig:true },
            { p:'§ 4', t:'Dienstanweisungen', s:'Pflicht zu Dienstanweisungen für Verhalten + Mängelmeldung + besondere Gefahren. Regelmäßige Unterweisung.', tags:['DA'], wichtig:true },
            { p:'§ 5', t:'Verbot berauschender Mittel', s:'Alkohol/Drogen verboten während + vor Dienst.', tags:['Alkohol-Verbot'] },
            { p:'§ 6', t:'Übernahme von Aufgaben', s:'Nur übernehmen wenn vermeidbare Gefahren beseitigt oder abgesichert. Schriftliche Festlegung von Sicherungsumfang und -ablauf.', tags:['Schriftform'], wichtig:true },
            { p:'§ 7', t:'Sicherungstätigkeiten mit besonderen Gefahren', s:'Überwachung des Personals bei besonderen Gefahren.', tags:['Überwachung'] },
            { p:'§ 8', t:'Überprüfung von Objekten', s:'Unabhängige Prüfung der zu sichernden Objekte. Regelmäßig + bei Anlass. Aufzeichnungspflicht.', tags:['Objektprüfung'] },
            { p:'§ 9', t:'Objekteinweisung', s:'Einweisung in Objekt + Gefahren vor erster Tätigkeit. Bei Hundeobjekten zusätzliche Hunde-Unterweisung.', tags:['Einweisung'] },
            { p:'§ 10', t:'Ausrüstung des Personals', s:'Ordnungsgemäßer Zustand + Unterweisung + Bewegungsfreiheit + geeignete Schuhe + Handleuchten bei Dunkelheit.', tags:['Ausrüstung'], wichtig:true },
            { p:'§ 11', t:'Brillenträger', s:'Brille gegen Verlieren sichern oder Ersatzbrille mitführen.', tags:['Brille'] },
            { p:'§ 12', t:'Hunde', s:'Nur geprüfte Hunde mit Hundeführern als Diensthunde. Keine bösartigen/leistungsschwachen Hunde. Überforderung vermeiden.', tags:['Diensthunde'], wichtig:true },
            { p:'§ 13', t:'Hundezwinger', s:'Einzelhaltung, Zutrittsverbots-Zeichen, abschließbar, Reinigung ohne Hunde.', tags:['Zwinger'] },
            { p:'§ 14', t:'Hundehaltung in Objekten', s:'Im Objekt: Zwinger pflicht oder vorübergehende Anbindehaltung außerhalb Verkehrswege.', tags:['Objekthund'] },
            { p:'§ 15', t:'Hundeführer', s:'Nur unterwiesene Versicherte. Befähigungs-Nachweis regelmäßig. Bei Wegfall Befugnis-Entzug.', tags:['Hundeführer'] },
            { p:'§ 16', t:'Hundeführung', s:'Übernahme/Abgabe bei geschlossener Tür · keine Personen-Übergabe · Hundecheck vor Kontakt · einheitliche Kommandos · Leinen-Befestigung am Körper untersagt · bei Begegnung mit Dritten: kurze Leine.', tags:['Hundeführung'] },
            { p:'§ 17', t:'Transport von Hunden', s:'Trennung Transportraum/Fahrgastraum + Trennung mehrerer Hunde.', tags:['Hundetransport'] },
            { p:'§ 18', t:'Ausrüstung mit Schusswaffen', s:'Nur ausdrücklich angeordnet. Versicherte müssen waffenrechtlich zuverlässig + sachkundig sein. Schießübungen + Schießfertigkeit-Nachweis regelmäßig.', tags:['Waffen','Sachkunde'], wichtig:true },
            { p:'§ 19', t:'Schusswaffen', s:'Nur amtlich geprüfte Waffen mit deutschem Beschusszeichen. Jährliche Prüfung durch Sachkundige.', tags:['Jährliche Prüfung'] },
            { p:'§ 20', t:'Führen von Schusswaffen', s:'Spezielle Vorgaben zum Führen.', tags:['Waffenführung'] },
            { p:'§ 21', t:'Übergabe von Schusswaffen', s:'Übergabe-Protokoll, Kugelfänger.', tags:['Übergabe'] },
            { p:'§ 22', t:'Aufbewahrung von Schusswaffen', s:'Sichere Aufbewahrung nach Waffenrecht.', tags:['Aufbewahrung'] },
            { p:'§ 23', t:'Alarmempfangszentralen', s:'Anforderungen an Alarm-Empfangszentralen (NSL).', tags:['NSL'] },
          ],
        },
        {
          nr: 3, title: 'Besondere Bestimmungen für Geldtransporte',
          paragraphen: [
            { p:'§ 24', t:'Eignung (Geldtransport)', s:'Spezielle Eignungsanforderungen.', tags:['Geldtransport'] },
            { p:'§ 25', t:'Geldtransporte durch Boten', s:'Vorgaben für Boten-Transport.', tags:['Bote'] },
            { p:'§ 26', t:'Geldtransporte mit Fahrzeugen', s:'Fahrzeug-Anforderungen, Sicherheits-Behältnisse, mind. 2 Personen.', tags:['Fahrzeug','2 Personen'] },
            { p:'§ 27', t:'Werträume', s:'Anforderungen an Werträume nach EN 1143 + Sicherheits-Maßnahmen.', tags:['Werträume','EN 1143'] },
          ],
        },
        {
          nr: 4, title: 'Ordnungswidrigkeiten',
          paragraphen: [
            { p:'§ 28', t:'Ordnungswidrigkeiten', s:'Bußgelder bei Verstößen.', tags:['Bußgeld'] },
          ],
        },
        {
          nr: 5, title: 'Inkrafttreten',
          paragraphen: [
            { p:'§ 29', t:'Inkrafttreten', s:'1.1.1997.', tags:['1.1.1997'] },
          ],
        },
      ],
    },

    /* ============= KRITIS-DachG V2 (Entwurfs-Variante) ============= */
    {
      id: 'kritis-v2',
      short: 'KRITIS-DachG (Drucks.)',
      title: 'KRITIS-Dachgesetz · BT-Drucksache 21/2510',
      kategorie: 'KRITIS · Gesetzentwurf',
      datum: '2025/2026',
      farbe: '#ef4444',
      icon: 'fa-file-shield',
      url: 'https://dserver.bundestag.de/btd/21/025/2102510.pdf',
      intro: 'Originaler Gesetzentwurf zum KRITIS-Dachgesetz (BT-Drucksache 21/2510). Dieselbe Materie wie die konsolidierte Fassung, leicht abweichende Formulierungen.',
      anwender: 'Identisch mit KRITIS-DachG · Drucksachen-Variante zum Nachschlagen',
      visualisierung: 'kritis-prozess',
      abschnitte: [
        {
          nr: 1, title: 'Hinweis',
          paragraphen: [
            { p:'-', t:'Verweis auf konsolidierte Fassung', s:'Vollständige Paragraphen-Liste siehe KRITIS-DachG (oben). Diese Variante ist die ursprüngliche Drucksachen-Fassung mit identischer Struktur.', tags:['Drucksache','21/2510'] },
          ],
        },
      ],
    },

    /* ============= GewO § 34a ============= */
    {
      id: 'gewo34a',
      short: 'GewO § 34a',
      title: 'Gewerbeordnung § 34a · Bewachungsgewerbe',
      kategorie: 'Gewerberecht',
      datum: 'Letzte Änderung 2024',
      farbe: '#06b6d4',
      icon: 'fa-briefcase',
      url: 'https://www.gesetze-im-internet.de/gewo/__34a.html',
      intro: 'Grundnorm für das Bewachungsgewerbe. Erlaubnis-Pflicht, Zuverlässigkeit, Vermögensverhältnisse, Sachkunde, Bewacherregister.',
      anwender: 'Gewerbliche Bewacher, Aufsichtsbehörden, IHK',
      visualisierung: 'gewo-erlaubnis',
      abschnitte: [
        {
          nr: 1, title: '§ 34a Absatzweise',
          paragraphen: [
            { p:'Abs. 1', t:'Erlaubnispflicht', s:'Wer gewerbsmäßig Leben/Eigentum fremder Personen bewacht, bedarf einer Erlaubnis der zuständigen Behörde.', tags:['Pflicht','Erlaubnis'], wichtig:true },
            { p:'Abs. 1 S.3', t:'Versagungsgründe', s:'Versagung wenn: Unzuverlässigkeit · ungeordnete Vermögen · fehlende Unterrichtung · fehlende Sachkunde (bei bestimmten Tätigkeiten) · fehlende Haftpflicht.', tags:['Versagung'], wichtig:true },
            { p:'Abs. 1a S.2', t:'Sachkundepflichtige Tätigkeiten', s:'Sachkundeprüfung statt nur Unterrichtung erforderlich für: Türsteher · Ladendieb-Schutz · bewaffnete Bewachung · Asyl-Unterkünfte · Großveranstaltungen · Detektive.', tags:['Sachkundepflicht'], wichtig:true },
            { p:'Abs. 2', t:'Zuverlässigkeitsprüfung', s:'Anfragen bei Bundeszentralregister, Gewerbezentralregister, Verfassungsschutz, ggf. Polizei.', tags:['Sicherheitsüberprüfung'] },
            { p:'Abs. 3', t:'Wachpersonen-Anmeldung', s:'Anmeldung im Bewacherregister vor Beschäftigung erforderlich. Bestätigung der Behörde muss vorliegen.', tags:['Bewacherregister'] },
            { p:'Abs. 4', t:'Untersagung Beschäftigung', s:'Behörde kann Beschäftigung einer unzuverlässigen Person untersagen.', tags:['Untersagung'] },
            { p:'Abs. 5', t:'Bewacherregister', s:'Nationales Online-Register mit Bewacher-ID, Datenaktualisierungs-Pflicht. Seit 2019.', tags:['Online-Register'] },
            { p:'Abs. 6', t:'Hinweis-/Kennzeichnungspflicht', s:'Ausweis + Schild mit Name oder Kennnummer bei sachkundepflichtigen Tätigkeiten.', tags:['Ausweis','Schild'] },
          ],
        },
      ],
    },

    /* ============= WaffG ============= */
    {
      id: 'waffg',
      short: 'WaffG',
      title: 'Waffengesetz · Auszug für Wachpersonal',
      kategorie: 'Waffenrecht',
      datum: 'Letzte Änderung 2024',
      farbe: '#dc2626',
      icon: 'fa-gun',
      url: 'https://www.gesetze-im-internet.de/waffg_2002/',
      intro: 'Regelt Erwerb, Besitz, Führen und Aufbewahrung von Waffen. Für bewaffnete Wachpersonen relevant: Sachkunde, Bedürfnis, Aufbewahrung nach EN 14450 / EN 1143-1.',
      anwender: 'Bewaffnete Wachpersonen, Bewachungsunternehmen',
      visualisierung: 'waffg-waffenklassen',
      abschnitte: [
        {
          nr: 1, title: 'Allgemeine Grundsätze',
          paragraphen: [
            { p:'§ 1', t:'Anwendungsbereich', s:'Umgang mit Waffen und Munition zum Schutz vor Gefahren.', tags:['Anwendung'] },
            { p:'§ 2', t:'Grundsätze · 3 Klassen', s:'Anlage 1: verbotene / erlaubnispflichtige / freie Waffen. Waffenschein vs. Waffenbesitzkarte (WBK).', tags:['Klassen'], wichtig:true },
            { p:'§ 4', t:'Voraussetzungen', s:'Alter 18+, Zuverlässigkeit (§ 5), persönliche Eignung (§ 6), Sachkunde (§ 7), Bedürfnis (§ 8), Haftpflicht.', tags:['Voraussetzungen'], wichtig:true },
            { p:'§ 5', t:'Zuverlässigkeit', s:'Regelmäßige Überprüfung. Unzuverlässig bei Strafen wegen Verbrechen, extremistischer Vereinigungs-Mitgliedschaft, Alkohol-/Drogen-Abhängigkeit.', tags:['Zuverlässigkeit'] },
            { p:'§ 7', t:'Sachkunde', s:'Praktische + theoretische Prüfung. Für Wachpersonal: DGUV V23 + zusätzliche Schießausbildung pflicht.', tags:['Sachkunde'], wichtig:true },
            { p:'§ 8', t:'Bedürfnis', s:'Bewacher muss konkrete GEFÄHRDUNG nachweisen (z.B. Geldtransport, Personenschutz). Reine Vorsorge reicht nicht.', tags:['Bedürfnis'], wichtig:true },
          ],
        },
        {
          nr: 2, title: 'Erlaubnisse und Aufbewahrung',
          paragraphen: [
            { p:'§ 10', t:'Waffenbesitzkarte (WBK)', s:'Erforderlich für Erwerb und Besitz. Waffen werden einzeln eingetragen.', tags:['WBK'] },
            { p:'§ 19', t:'Waffenschein', s:'Pflicht zum FÜHREN außerhalb eigener Wohnung/Geschäftsräume. Für Wachpersonal sehr restriktiv.', tags:['Waffenschein'], wichtig:true },
            { p:'§ 28', t:'Bewachungsunternehmer', s:'Sondervorschrift: Bewacher können mit Behördenzustimmung Wachpersonen zeitweise Waffen überlassen. Dokumentationspflicht.', tags:['Bewachung','Sondervorschrift'], wichtig:true },
            { p:'§ 36', t:'Aufbewahrung', s:'Mindeststandards: EN 14450/S1 (Kurzwaffen ≤ 5) · EN 14450/N (Langwaffen ≤ 10) · EN 1143-1 Klasse I (höhere Anzahl). Munition GETRENNT.', tags:['Tresor','EN 14450','EN 1143-1'], wichtig:true },
          ],
        },
        {
          nr: 3, title: 'Strafen + Bußgeld',
          paragraphen: [
            { p:'§ 51', t:'Strafvorschriften', s:'Bis 5 Jahre Freiheitsstrafe bei unerlaubtem Umgang.', tags:['Strafe'] },
            { p:'§ 53', t:'Bußgeldvorschriften', s:'Bis 10.000 € bei Verstößen.', tags:['Bußgeld'] },
          ],
        },
      ],
    },

    /* ============= SüG ============= */
    {
      id: 'sueg',
      short: 'SüG',
      title: 'Sicherheitsüberprüfungsgesetz',
      kategorie: 'Geheimschutz',
      datum: 'Letzte Änderung 2024',
      farbe: '#7c3aed',
      icon: 'fa-user-secret',
      url: 'https://www.gesetze-im-internet.de/s_g/',
      intro: 'Sicherheitsüberprüfung für Personen mit Zugang zu Verschlusssachen (VS) oder sicherheitsempfindlichen Tätigkeiten.',
      anwender: 'Personen mit VS-Zugang, KRITIS-Personal, Verteidigungs-Sektor',
      visualisierung: 'sueg-stufen',
      abschnitte: [
        {
          nr: 1, title: 'Allgemeines',
          paragraphen: [
            { p:'§ 1', t:'Zweck', s:'Sicherheitsüberprüfung für VS-Zugang oder lebens-/verteidigungswichtige Anlagen.', tags:['VS-Zugang'] },
            { p:'§ 2', t:'Begriffsbestimmungen', s:'VS-Stufen: VS-NfD · VS-Vertraulich · Geheim · Streng Geheim.', tags:['Definitionen'] },
            { p:'§ 4', t:'Geltungsbereich', s:'Öffentlicher Dienst + nicht-öffentliche Stellen mit VS-Zugang.', tags:['Geltung'] },
          ],
        },
        {
          nr: 2, title: 'Arten der Sicherheitsüberprüfung',
          paragraphen: [
            { p:'§ 7', t:'Drei Stufen Ü1/Ü2/Ü3', s:'Ü1 einfache SÜ für VS-Vertraulich · Ü2 erweiterte für Geheim · Ü3 mit Sicherheitsermittlungen für Streng Geheim.', tags:['Ü1','Ü2','Ü3'], wichtig:true },
            { p:'§ 8', t:'Einfache SÜ (Ü1)', s:'Anfragen Bundeszentralregister + Verfassungsschutz + Polizei. Fragebogen.', tags:['Ü1'] },
            { p:'§ 9', t:'Erweiterte SÜ (Ü2)', s:'Zusätzlich Anhörung von Auskunftspersonen.', tags:['Ü2'] },
            { p:'§ 10', t:'Ü3 mit Sicherheitsermittlungen', s:'Höchstes Niveau. Umfangreiche Ermittlungen + Sicherheitsgespräch.', tags:['Ü3'], wichtig:true },
          ],
        },
        {
          nr: 3, title: 'Verfahren',
          paragraphen: [
            { p:'§ 14', t:'Verfahren', s:'Sicherheitserklärung + Mitwirkungspflicht. Bei Bedenken: Erörterungsgespräch.', tags:['Verfahren'] },
            { p:'§ 17', t:'Wiederholung', s:'Ü1 alle 10 Jahre · Ü2 alle 5 Jahre · Ü3 alle 5 Jahre.', tags:['Wiederholung'], wichtig:true },
            { p:'§ 22', t:'Sicherheitsakte', s:'5 Jahre Speicherung nach Ausscheiden.', tags:['Datenspeicherung'] },
          ],
        },
      ],
    },
  ];

  /* ====== VISUALISIERUNGEN als SVG ====== */
  const VIS = {
    'gewo-erlaubnis': `
      <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" class="ges-vis">
        <rect width="600" height="280" fill="#0a0f1a"/>
        <text x="300" y="28" text-anchor="middle" font-size="14" fill="#06b6d4" font-weight="900">§ 34a GewO · Erlaubnis-Prozess</text>
        ${[['1','Antrag','#06b6d4',60],['2','Unterlagen','#22d3ee',180],['3','Prüfung','#fbbf24',300],['4','Erlaubnis','#22c55e',420],['5','Bewacher-Reg.','#3b82f6',540]].map(([n,l,c,x]) => `
          <g>
            <circle cx="${x}" cy="100" r="30" fill="#1e293b" stroke="${c}" stroke-width="2"/>
            <text x="${x}" y="106" text-anchor="middle" font-size="14" fill="${c}" font-weight="900">${n}</text>
            <text x="${x}" y="155" text-anchor="middle" font-size="11" fill="${c}" font-weight="700">${l}</text>
          </g>
        `).join('')}
        ${[60,180,300,420].map(x => `<line x1="${x+32}" y1="100" x2="${x+88}" y2="100" stroke="#94a3b8" stroke-dasharray="3 2"/>`).join('')}
        <text x="300" y="210" text-anchor="middle" font-size="11" fill="#fbbf24" font-weight="800">Versagungsgründe: Unzuverlässigkeit · ungeordnete Vermögen</text>
        <text x="300" y="228" text-anchor="middle" font-size="11" fill="#fbbf24" font-weight="800">fehlende Unterrichtung/Sachkunde · fehlende Haftpflicht</text>
        <text x="300" y="260" text-anchor="middle" font-size="11" fill="#22c55e" font-weight="700">→ Bei Erfüllung MUSS die Erlaubnis erteilt werden</text>
      </svg>`,

    'waffg-waffenklassen': `
      <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="ges-vis">
        <rect width="600" height="320" fill="#0a0f1a"/>
        <text x="300" y="28" text-anchor="middle" font-size="14" fill="#dc2626" font-weight="900">Waffengesetz · Aufbewahrungs-Klassen § 36</text>
        ${[['Kurzwaffen ≤ 5','#94a3b8','EN 14450/S1','Klasse 0',90],['Langwaffen ≤ 10','#22c55e','EN 14450/N','Klasse N',230],['Höhere Mengen','#0891b2','EN 1143-1','Klasse I',370],['Munition getrennt','#fbbf24','—','Pflicht!',510]].map(([typ,c,norm,kl,x]) => `
          <g>
            <rect x="${x-50}" y="70" width="100" height="160" rx="8" fill="#1e293b" stroke="${c}" stroke-width="2"/>
            <foreignObject x="${x-25}" y="80" width="50" height="50">
              <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;align-items:center;justify-content:center;width:50px;height:50px;color:${c};font-size:30px"><i class="fas fa-vault"></i></div>
            </foreignObject>
            <text x="${x}" y="155" text-anchor="middle" font-size="12" fill="${c}" font-weight="800">${kl}</text>
            <text x="${x}" y="178" text-anchor="middle" font-size="10" fill="#cbd5e1">${typ}</text>
            <text x="${x}" y="205" text-anchor="middle" font-size="9" fill="#94a3b8">${norm}</text>
          </g>
        `).join('')}
        <text x="300" y="270" text-anchor="middle" font-size="12" fill="#ef4444" font-weight="800">§ 28 WaffG: Bewachungsunternehmer überlassen Wachpersonen Waffen zeitweise</text>
        <text x="300" y="290" text-anchor="middle" font-size="10" fill="#94a3b8">Mit Behördenzustimmung · Dokumentationspflicht · siehe auch DGUV V23 § 18</text>
      </svg>`,

    'sueg-stufen': `
      <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="ges-vis">
        <rect width="600" height="320" fill="#0a0f1a"/>
        <text x="300" y="28" text-anchor="middle" font-size="14" fill="#7c3aed" font-weight="900">SüG · 3 Stufen der Sicherheitsüberprüfung</text>
        ${[['Ü1','VS-VERTRAULICH','#22c55e','Einfache SÜ','BZR + BfV + Polizei','10 Jahre',100],['Ü2','GEHEIM','#fbbf24','Erweiterte SÜ','+ Auskunftspers.','5 Jahre',300],['Ü3','STRENG GEHEIM','#dc2626','SÜ + Ermittlungen','+ Sich.-Gespräch','5 Jahre',500]].map(([code, vs, c, name, inhalt, wdh, x]) => `
          <g>
            <rect x="${x-90}" y="70" width="180" height="190" rx="10" fill="#1e293b" stroke="${c}" stroke-width="3"/>
            <text x="${x}" y="100" text-anchor="middle" font-size="22" fill="${c}" font-weight="900">${code}</text>
            <rect x="${x-70}" y="115" width="140" height="22" rx="3" fill="${c}"/>
            <text x="${x}" y="130" text-anchor="middle" font-size="10" fill="#0b1424" font-weight="900">${vs}</text>
            <text x="${x}" y="160" text-anchor="middle" font-size="12" fill="#cbd5e1" font-weight="700">${name}</text>
            <text x="${x}" y="180" text-anchor="middle" font-size="9" fill="#94a3b8">${inhalt}</text>
            <text x="${x}" y="210" text-anchor="middle" font-size="10" fill="${c}" font-weight="700">Wdh.: ${wdh}</text>
          </g>
        `).join('')}
        <text x="300" y="295" text-anchor="middle" font-size="11" fill="#22d3ee" font-weight="700">Pflicht: Sicherheitserklärung + Mitwirkung · Speicherung 5 Jahre nach Ausscheiden</text>
      </svg>`,

    'bewachv-overview': `
      <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" class="ges-vis">
        <rect width="600" height="300" fill="#0a0f1a"/>
        <text x="300" y="30" text-anchor="middle" font-size="14" fill="#7c3aed" font-weight="900">BeWachV · 8 Abschnitte · 24 Paragraphen</text>
        ${[
          ['1', 'Zuständigkeit', 50],
          ['2', 'Unterrichtung 40h', 130],
          ['3', 'Sachkundeprüfung', 210],
          ['4', 'EU-Anerkennung', 290],
          ['5', 'Haftpflicht-Vers.', 370],
          ['6', 'Pflichten Betrieb', 450],
          ['7', 'OWiG', 510],
          ['8', 'Schlussvorschr.', 560],
        ].map(([n, t, x]) => `
          <g>
            <circle cx="${x}" cy="150" r="28" fill="#1e293b" stroke="#7c3aed" stroke-width="2"/>
            <text x="${x}" y="146" text-anchor="middle" font-size="14" fill="#7c3aed" font-weight="900">${n}</text>
            <text x="${x}" y="160" text-anchor="middle" font-size="8" fill="#94a3b8">Abschn.</text>
            <text x="${x}" y="200" text-anchor="middle" font-size="9" fill="#cbd5e1" font-weight="700">${t}</text>
          </g>
        `).join('')}
        <text x="300" y="260" text-anchor="middle" font-size="11" fill="#fbbf24" font-weight="700">Mindestversicherung: Personen 1.000.000 € · Sach 250.000 €</text>
        <text x="300" y="278" text-anchor="middle" font-size="10" fill="#22c55e">Unterrichtung 40 h · Sachkundeprüfung schriftl. + mündl.</text>
      </svg>`,

    'kritis-sektoren': `
      <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" class="ges-vis">
        <rect width="600" height="360" fill="#0a0f1a"/>
        <text x="300" y="30" text-anchor="middle" font-size="14" fill="#dc2626" font-weight="900">10 KRITIS-Sektoren · § 4 KRITIS-DachG</text>
        ${[
          ['fa-bolt','Energie','#fbbf24',80,90],
          ['fa-truck','Transport','#22d3ee',180,90],
          ['fa-coins','Finanzwesen','#22c55e',280,90],
          ['fa-hospital','Gesundheit','#ef4444',380,90],
          ['fa-droplet','Wasser','#06b6d4',480,90],
          ['fa-utensils','Ernährung','#ea580c',80,200],
          ['fa-network-wired','IT/TK','#3b82f6',180,200],
          ['fa-satellite','Weltraum','#7c3aed',280,200],
          ['fa-recycle','Siedlungsabfall','#84cc16',380,200],
          ['fa-shield-halved','Sozialvers.','#a855f7',480,200],
        ].map(([icon, name, c, x, y]) => `
          <g>
            <circle cx="${x}" cy="${y}" r="34" fill="#1e293b" stroke="${c}" stroke-width="2"/>
            <foreignObject x="${x-20}" y="${y-20}" width="40" height="40">
              <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;color:${c};font-size:22px"><i class="fas ${icon}"></i></div>
            </foreignObject>
            <text x="${x}" y="${y+55}" text-anchor="middle" font-size="11" fill="${c}" font-weight="700">${name}</text>
          </g>
        `).join('')}
        <text x="300" y="295" text-anchor="middle" font-size="12" fill="#fbbf24" font-weight="800">Schwellwert: ≥ 500.000 versorgte Einwohner</text>
        <text x="300" y="315" text-anchor="middle" font-size="11" fill="#22d3ee">Registrierung beim BBK bis 17.07.2026 · Bußgeld bis 10 Mio €</text>
        <text x="300" y="335" text-anchor="middle" font-size="10" fill="#94a3b8">Geschäftsleitung persönlich verantwortlich</text>
      </svg>`,

    'nis2-meldekette': `
      <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" class="ges-vis">
        <rect width="600" height="360" fill="#0a0f1a"/>
        <text x="300" y="30" text-anchor="middle" font-size="14" fill="#22d3ee" font-weight="900">NIS-2 Meldekette · § 32 BSIG</text>
        <!-- Schritt-Boxen -->
        ${[
          ['VORFALL','24 h','Frühwarnung','#fbbf24', 70],
          ['DETAILS','72 h','Vorfall-Meldung','#ea580c', 220],
          ['ABSCHLUSS','1 Monat','Abschlussbericht','#22c55e', 370],
        ].map(([phase, time, label, c, x]) => `
          <g transform="translate(${x}, 80)">
            <rect width="160" height="100" rx="10" fill="#1e293b" stroke="${c}" stroke-width="2"/>
            <text x="80" y="28" text-anchor="middle" font-size="12" fill="${c}" font-weight="900">${phase}</text>
            <text x="80" y="60" text-anchor="middle" font-size="24" fill="${c}" font-weight="900">${time}</text>
            <text x="80" y="85" text-anchor="middle" font-size="10" fill="#94a3b8">${label}</text>
          </g>
        `).join('')}
        <!-- Pfeile -->
        <line x1="230" y1="130" x2="280" y2="130" stroke="#fbbf24" stroke-width="2" marker-end="url(#arr)"/>
        <line x1="380" y1="130" x2="430" y2="130" stroke="#ea580c" stroke-width="2" marker-end="url(#arr)"/>
        <defs><marker id="arr" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#94a3b8"/></marker></defs>
        <!-- BSI als Empfänger -->
        <rect x="225" y="220" width="150" height="60" rx="8" fill="#0a0f1a" stroke="#22d3ee" stroke-width="3"/>
        <text x="300" y="245" text-anchor="middle" font-size="14" fill="#22d3ee" font-weight="900">BSI</text>
        <text x="300" y="262" text-anchor="middle" font-size="10" fill="#94a3b8">Bundesamt für Sicherheit</text>
        <text x="300" y="274" text-anchor="middle" font-size="10" fill="#94a3b8">in der Informationstechnik</text>
        <line x1="150" y1="180" x2="280" y2="220" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3 2"/>
        <line x1="300" y1="180" x2="300" y2="220" stroke="#ea580c" stroke-width="1.5" stroke-dasharray="3 2"/>
        <line x1="450" y1="180" x2="320" y2="220" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="3 2"/>
        <!-- Bußgeld -->
        <text x="300" y="320" text-anchor="middle" font-size="12" fill="#ef4444" font-weight="800">⚠ Bußgeld bis 10 Mio € / 2 % weltweiter Umsatz</text>
        <text x="300" y="340" text-anchor="middle" font-size="10" fill="#94a3b8">+ persönliche Haftung der Geschäftsleitung</text>
      </svg>`,

    'dguv1-pflichten': `
      <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="ges-vis">
        <rect width="600" height="320" fill="#0a0f1a"/>
        <text x="300" y="28" text-anchor="middle" font-size="14" fill="#22c55e" font-weight="900">DGUV V1 · Pflichten-Pyramide</text>
        <!-- Pyramide -->
        <polygon points="300,60 200,240 400,240" fill="rgba(34,197,94,.1)" stroke="#22c55e" stroke-width="2"/>
        <line x1="220" y1="200" x2="380" y2="200" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="3 2"/>
        <line x1="240" y1="160" x2="360" y2="160" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="3 2"/>
        <line x1="260" y1="120" x2="340" y2="120" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="3 2"/>
        <text x="300" y="90" text-anchor="middle" font-size="11" fill="#22c55e" font-weight="800">§ 2 GRUNDPFLICHT</text>
        <text x="300" y="140" text-anchor="middle" font-size="10" fill="#cbd5e1" font-weight="700">§ 3 Gefährdungs-Beurteilung</text>
        <text x="300" y="180" text-anchor="middle" font-size="10" fill="#cbd5e1" font-weight="700">§ 4 Unterweisung jährlich</text>
        <text x="300" y="220" text-anchor="middle" font-size="10" fill="#cbd5e1" font-weight="700">§§ 19—28 Organisation + Erste Hilfe</text>
        <!-- Ersthelfer-Anzahl -->
        <rect x="40" y="260" width="240" height="46" rx="6" fill="#1e293b" stroke="#fbbf24"/>
        <text x="160" y="278" text-anchor="middle" font-size="11" fill="#fbbf24" font-weight="800">ERSTHELFER · § 26</text>
        <text x="160" y="295" text-anchor="middle" font-size="11" fill="#22c55e" font-weight="900">Mind. 10 % der Beschäftigten</text>
        <!-- Sibe -->
        <rect x="320" y="260" width="240" height="46" rx="6" fill="#1e293b" stroke="#fbbf24"/>
        <text x="440" y="278" text-anchor="middle" font-size="11" fill="#fbbf24" font-weight="800">SICHERHEITSBEAUFTRAGTE · § 20</text>
        <text x="440" y="295" text-anchor="middle" font-size="11" fill="#22c55e" font-weight="900">Ab 21 Beschäftigten Pflicht</text>
      </svg>`,

    'dguv23-themen': `
      <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="ges-vis">
        <rect width="600" height="320" fill="#0a0f1a"/>
        <text x="300" y="28" text-anchor="middle" font-size="14" fill="#fbbf24" font-weight="900">DGUV V23 · Wach- &amp; Sicherungsdienste</text>
        ${[
          ['fa-id-card','Eignung & Dienstanweisung','#22c55e',80,80,'§ 3-4'],
          ['fa-shield','Ausrüstung','#22d3ee',300,80,'§ 10-11'],
          ['fa-dog','Diensthunde','#a855f7',520,80,'§ 12-17'],
          ['fa-gun','Schusswaffen','#dc2626',80,200,'§ 18-22'],
          ['fa-tower-broadcast','Alarmzentralen','#06b6d4',300,200,'§ 23'],
          ['fa-money-bill-trend-up','Geldtransport','#fbbf24',520,200,'§ 24-27'],
        ].map(([icon, label, c, x, y, ref]) => `
          <g transform="translate(${x}, ${y})">
            <circle r="32" fill="#1e293b" stroke="${c}" stroke-width="2"/>
            <foreignObject x="-20" y="-20" width="40" height="40">
              <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;color:${c};font-size:22px"><i class="fas ${icon}"></i></div>
            </foreignObject>
            <text x="0" y="50" text-anchor="middle" font-size="11" fill="${c}" font-weight="800">${label}</text>
            <text x="0" y="64" text-anchor="middle" font-size="9" fill="#94a3b8">${ref}</text>
          </g>
        `).join('')}
        <text x="300" y="295" text-anchor="middle" font-size="11" fill="#fbbf24" font-weight="700">5 Abschnitte · 29 Paragraphen</text>
      </svg>`,

    'kritis-prozess': `
      <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" class="ges-vis">
        <rect width="600" height="320" fill="#0a0f1a"/>
        <text x="300" y="28" text-anchor="middle" font-size="14" fill="#ef4444" font-weight="900">KRITIS-DachG · Drucksachen-Prozess</text>
        <text x="300" y="50" text-anchor="middle" font-size="11" fill="#94a3b8">BT-Drs. 21/2510 → 21/3906 → Konsolidiert</text>
        ${[
          ['1','Entwurf','21/2510','#94a3b8',100],
          ['2','Beschluss','21/3906','#fbbf24',300],
          ['3','In Kraft','29.01.2026','#22c55e',500],
        ].map(([n, label, dock, c, x]) => `
          <g>
            <circle cx="${x}" cy="160" r="40" fill="#1e293b" stroke="${c}" stroke-width="3"/>
            <text x="${x}" y="155" text-anchor="middle" font-size="18" fill="${c}" font-weight="900">${n}</text>
            <text x="${x}" y="172" text-anchor="middle" font-size="9" fill="#94a3b8">${dock}</text>
            <text x="${x}" y="220" text-anchor="middle" font-size="12" fill="${c}" font-weight="800">${label}</text>
          </g>
        `).join('')}
        <line x1="140" y1="160" x2="260" y2="160" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 2"/>
        <line x1="340" y1="160" x2="460" y2="160" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4 2"/>
        <text x="300" y="280" text-anchor="middle" font-size="10" fill="#22d3ee">Umsetzt EU-Richtlinie (EU) 2022/2557 · Critical Entities Resilience</text>
      </svg>`,
  };

  function getAll() {
    return G;
  }

  function getAllParagraphs() {
    const all = [];
    G.forEach(gesetz => {
      gesetz.abschnitte.forEach(abschnitt => {
        abschnitt.paragraphen.forEach(p => {
          all.push({ gesetz, abschnitt, paragraph: p });
        });
      });
    });
    return all;
  }

  function getVisualization(key) {
    return VIS[key] || '';
  }

  return { getAll, getAllParagraphs, getVisualization, G, VIS };
})();
