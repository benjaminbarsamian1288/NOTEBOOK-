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

    /* ============= BGB ============= */
    {
      id: 'bgb',
      short: 'BGB',
      title: 'Bürgerliches Gesetzbuch',
      kategorie: 'Zivilrecht',
      datum: 'In Kraft seit 01.01.1900 · zahlreiche Änderungen',
      farbe: '#0891b2',
      icon: 'fa-balance-scale',
      url: 'https://www.gesetze-im-internet.de/bgb/',
      intro: '2.385 Paragraphen in 5 Büchern. Regelt das gesamte deutsche Privatrecht. Für Sicherheitsdienste hochrelevant: Notwehr/Selbsthilfe (§§ 227—231), Besitz/Hausrecht (§§ 858—862, 1004) und Schadensersatz (§ 823). Pflichtstoff der § 7 BeWachV-Unterrichtung.',
      anwender: 'Jeder Bürger · Sicherheitsdienste · Vertragsparteien · Eigentümer/Besitzer',
      visualisierung: 'bgb-buecher',
      visualisierung2: 'praxis-faelle',
      visualisierung4: 'jedermannsrechte',
      abschnitte: [
        {
          nr: 1, title: '📕 Buch 1 · Allgemeiner Teil (§§ 1—240)',
          paragraphen: [
            { p:'§ 1',   t:'Beginn der Rechtsfähigkeit',           s:'Rechtsfähigkeit des Menschen beginnt mit der Vollendung der Geburt. Ende mit dem Tod.', tags:['Person','Rechtsfähigkeit'] },
            { p:'§ 104', t:'Geschäftsunfähigkeit',                  s:'Nicht geschäftsfähig: unter 7 Jahre · dauerhaft krankhafte Störung der Geistestätigkeit.', tags:['Geschäftsfähigkeit'] },
            { p:'§ 116', t:'Geheimer Vorbehalt',                    s:'Willenserklärung ist nicht deshalb nichtig, weil der Erklärende sich insgeheim vorbehält, das Erklärte nicht zu wollen.', tags:['Willenserklärung'] },
            { p:'§ 119', t:'Anfechtbarkeit wegen Irrtums',          s:'Wer bei Abgabe der Willenserklärung über deren Inhalt im Irrtum war, kann diese anfechten.', tags:['Irrtum','Anfechtung'] },
            { p:'§ 145', t:'Bindung an den Antrag',                 s:'Wer einen Vertrag anbietet, ist an seinen Antrag gebunden — außer er hat das ausgeschlossen.', tags:['Vertrag','Antrag'], wichtig:true },
            { p:'§ 147', t:'Annahmefrist',                          s:'Antrag unter Anwesenden nur sofort annehmbar · unter Abwesenden binnen üblicher Frist.', tags:['Vertragsschluss'] },
          ],
        },
        {
          nr: 2, title: '📗 Buch 2 · Schuldrecht (§§ 241—853) — KERN für Sicherheitsdienste',
          paragraphen: [
            { p:'§ 226', t:'Schikaneverbot',                         s:'Die Ausübung eines Rechts ist unzulässig, wenn sie nur den Zweck haben kann, einem anderen Schaden zuzufügen.', tags:['Rechtsmissbrauch'] },
            { p:'§ 227', t:'Notwehr (zivilrechtlich)',               s:'Eine durch Notwehr gebotene Handlung ist nicht widerrechtlich. Notwehr = Verteidigung gegen einen gegenwärtigen rechtswidrigen Angriff. Erforderlich + geboten.', tags:['Notwehr','Verteidigung'], wichtig:true, jedermann:true,
              beispiel:'Ein angetrunkener Clubgast holt zum Schlag gegen den Türsteher aus. Der Türsteher pariert den Schlag, dreht den Arm zur Seite und drückt ihn gegen die Wand, bis er aufhört. → § 227 BGB rechtfertigt das. Folge: kein Schadensersatz an den Angreifer, selbst wenn er sich dabei den Ellbogen prellt.',
              merksatz:'Verteidigung muss erforderlich (mildestes Mittel) und geboten (nicht rechtsmissbräuchlich) sein. Sobald der Angriff vorbei ist, ist auch die Notwehr vorbei.',
              fehler:['„Bestrafung" nach beendetem Angriff — das ist keine Notwehr mehr.','Verteidigung gegen Wort-Provokation: keine Notwehr (Beleidigung ist Angriff auf Ehre — aber nur sehr eingeschränkt mit körperlicher Gegenwehr).','Schlagstock zücken, obwohl ein „Schritt zurück" gereicht hätte → unverhältnismäßig.'] },
            { p:'§ 228', t:'Defensiver Notstand (Sachen)',           s:'Wer eine fremde Sache beschädigt, um eine durch sie drohende Gefahr abzuwenden, handelt nicht widerrechtlich (z. B. fremden Hund abwehren).', tags:['Notstand'], wichtig:true, jedermann:true,
              beispiel:'Auf dem Werksgelände rennt ein freilaufender Hund knurrend auf einen Mitarbeiter zu. Der Wachmann tritt den Hund weg, dabei wird das Tier leicht verletzt. → § 228 BGB rechtfertigt, weil die Gefahr von der Sache (hier: vom Tier) selbst ausgeht.' },
            { p:'§ 229', t:'Selbsthilfe',                            s:'Wer zum Zwecke der Selbsthilfe eine Sache wegnimmt, zerstört oder beschädigt, oder wer einen Verpflichteten festnimmt, handelt nicht widerrechtlich — wenn obrigkeitliche Hilfe nicht rechtzeitig zu erlangen ist und Vereitelung droht.', tags:['Selbsthilfe','Festnahme'], wichtig:true, jedermann:true,
              beispiel:'Ein Ladendieb läuft mit gestohlener Ware aus dem Geschäft. Bis die Polizei kommt, wäre er längst weg. → Der Ladendetektiv darf ihn festhalten UND die Ware zurücknehmen (§ 229 BGB + § 127 StPO). Er muss sich aber unverzüglich bei der Polizei melden.',
              merksatz:'Drei Voraussetzungen: (1) Anspruch existiert · (2) obrigkeitliche Hilfe zu spät · (3) Vereitelung des Anspruchs droht.',
              fehler:['Festhalten „auf Verdacht" ohne konkrete Anhaltspunkte → keine § 229-Lage.','Nicht direkt die Polizei verständigen → § 230 II verletzt.','Gewalt anwenden, obwohl Festhalten am Arm gereicht hätte.'] },
            { p:'§ 230', t:'Grenzen der Selbsthilfe',                s:'Selbsthilfe darf nicht weiter gehen als zur Abwendung der Gefahr erforderlich. Bei Festnahme: dinglicher/persönlicher Arrest beim Amtsgericht beantragen.', tags:['Grenzen'], wichtig:true, jedermann:true,
              beispiel:'Detektiv hat Dieb festgenommen. Er fesselt ihn nicht und sperrt ihn nicht in den Schrank, sondern führt ihn ins Büro und verständigt sofort 110. → § 230 BGB wahrt die Verhältnismäßigkeit.' },
            { p:'§ 231', t:'Irrtum über Voraussetzungen',            s:'Wer eine der in § 229 bezeichneten Handlungen in der irrigen Annahme vornimmt, dass die erforderlichen Voraussetzungen vorhanden seien, ist zum Schadensersatz verpflichtet.', tags:['Putativ-Selbsthilfe'], wichtig:true,
              beispiel:'Ein Kunde steckt sein eigenes Smartphone in die Tasche. Der Detektiv hält ihn fälschlich für einen Dieb und fesselt ihn am Boden. → Selbst bei gutem Glauben haftet der Sicherheitsdienst nach § 231 BGB auf Schadensersatz!' },
            { p:'§ 241', t:'Pflichten aus Schuldverhältnis',         s:'Schuldner schuldet Leistung · Schuldverhältnis kann zur Rücksicht auf Rechte, Rechtsgüter und Interessen verpflichten.', tags:['Pflichten'] },
            { p:'§ 433', t:'Kaufvertrag · Pflichten',                s:'Verkäufer: Sache übergeben + Eigentum verschaffen, frei von Mängeln. Käufer: Kaufpreis zahlen + Sache abnehmen.', tags:['Kauf'] },
            { p:'§ 535', t:'Mietvertrag · Pflichten',                s:'Vermieter: Mietsache in vertragsgemäßem Zustand überlassen. Mieter: Miete zahlen.', tags:['Miete'] },
            { p:'§ 611', t:'Dienstvertrag',                          s:'Pflicht zur Leistung versprochener Dienste · Gegenpartei zur Zahlung der vergüteten Vergütung. Grundlage für Bewachungs-Dienstverträge.', tags:['Dienstvertrag'], wichtig:true },
            { p:'§ 631', t:'Werkvertrag',                            s:'Werkunternehmer schuldet Herstellung eines Werkes (Erfolg) · Besteller schuldet Vergütung.', tags:['Werkvertrag'] },
            { p:'§ 823', t:'Schadensersatzpflicht',                  s:'Wer vorsätzlich oder fahrlässig Leben, Körper, Gesundheit, Freiheit, Eigentum oder ein sonstiges Recht eines anderen widerrechtlich verletzt, ist zum Ersatz verpflichtet.', tags:['Schadensersatz','Haftung'], wichtig:true,
              beispiel:'Der Türsteher reißt einen Gast am Kragen aus dem Club und schubst ihn zu Boden. Gast bricht sich das Handgelenk. → § 823 BGB: Sicherheitsdienst (und Türsteher persönlich) haften auf Schmerzensgeld + Heilkosten. Versicherungspflicht nach § 14 BeWachV: 1 Mio. € Personenschäden — genau dafür.',
              merksatz:'Jede Verletzung von Körper, Gesundheit, Freiheit oder Eigentum löst Haftung aus — außer es greift eine Rechtfertigung (Notwehr, § 229 etc.).' },
            { p:'§ 826', t:'Sittenwidrige Schädigung',               s:'Wer in einer gegen die guten Sitten verstoßenden Weise einem anderen vorsätzlich Schaden zufügt, ist verpflichtet zum Ersatz.', tags:['Sittenwidrig'] },
            { p:'§ 858', t:'Verbotene Eigenmacht',                   s:'Wer dem Besitzer ohne dessen Willen den Besitz entzieht oder ihn stört, handelt — soweit nicht das Gesetz die Entziehung gestattet — widerrechtlich (verbotene Eigenmacht).', tags:['Besitzstörung','Hausrecht'], wichtig:true,
              beispiel:'Ein Demonstrant kettet sich an das Werkstor des Chemiewerks. → Verbotene Eigenmacht gegen den Besitz des Werks. Der Werkschutz darf die Kette lösen und den Demonstranten vom Gelände führen (Besitzwehr nach § 859).' },
            { p:'§ 859', t:'Selbsthilfe des Besitzers',              s:'Der Besitzer darf sich verbotener Eigenmacht mit Gewalt erwehren. Bei beweglicher Sache darf er sie dem auf frischer Tat Betroffenen wieder abnehmen.', tags:['Besitzwehr','Besitzkehr'], wichtig:true, jedermann:true,
              beispiel:'Besitzwehr (Abs. 1): Hooligan will über den Zaun ins Stadion klettern. Der Wachmann zieht ihn zurück, bevor er drüber ist.\nBesitzkehr (Abs. 2): Ein Dieb schnappt sich eine Tasche und rennt los — der Detektiv holt ihn auf frischer Tat ein und nimmt die Tasche zurück.',
              merksatz:'Besitzwehr = präventiv (Angriff abwehren). Besitzkehr = reaktiv (Sache zurückholen — aber nur auf frischer Tat).',
              fehler:['Besitzkehr 3 Tage später → unzulässig, nicht mehr „auf frischer Tat".','Verfolgung über kilometerweite Distanz → ab einem Punkt nicht mehr „frische Tat".'] },
            { p:'§ 860', t:'Selbsthilfe des Besitzdieners',          s:'Auch der Besitzdiener (z. B. der Sicherheitsmitarbeiter für den Besitzer!) darf die Rechte aus § 859 ausüben.', tags:['Besitzdiener'], wichtig:true, jedermann:true,
              beispiel:'Der Werkschutzmitarbeiter ist NICHT Besitzer des Werks — aber Besitzdiener (§ 855 BGB) seines Arbeitgebers. § 860 BGB überträgt ihm das Recht, das Hausrecht aktiv durchzusetzen. So funktioniert die ganze Branche.' },
            { p:'§ 861', t:'Anspruch auf Wiedereinräumung',          s:'Bei Besitzentziehung durch verbotene Eigenmacht: Anspruch auf Wiedereinräumung des Besitzes.', tags:['Besitzschutz'] },
            { p:'§ 862', t:'Anspruch wegen Besitzstörung',           s:'Wird der Besitzer durch verbotene Eigenmacht im Besitz gestört, kann er Beseitigung verlangen.', tags:['Störungsbeseitigung'] },
            { p:'§ 904', t:'Aggressiver Notstand',                   s:'Eigentümer einer Sache ist nicht berechtigt, die Einwirkung eines anderen auf die Sache zu verbieten, wenn die Einwirkung zur Abwendung einer gegenwärtigen Gefahr notwendig + der drohende Schaden gegenüber dem aus der Einwirkung entstehenden unverhältnismäßig groß ist.', tags:['Notstand','aggressiv'], wichtig:true, jedermann:true },
          ],
        },
        {
          nr: 3, title: '📘 Buch 3 · Sachenrecht (§§ 854—1296)',
          paragraphen: [
            { p:'§ 854', t:'Erwerb des Besitzes',                    s:'Der Besitz einer Sache wird durch die Erlangung der tatsächlichen Gewalt über die Sache erworben.', tags:['Besitz'] },
            { p:'§ 855', t:'Besitzdiener',                           s:'Übt jemand die tatsächliche Gewalt über eine Sache für einen anderen aus, ist nur der andere Besitzer (Besitzdiener-Verhältnis). Wichtig: Sicherheitsmitarbeiter sind oft Besitzdiener!', tags:['Besitzdiener'], wichtig:true },
            { p:'§ 903', t:'Befugnisse des Eigentümers',             s:'Der Eigentümer einer Sache kann, soweit nicht das Gesetz oder Rechte Dritter entgegenstehen, mit der Sache nach Belieben verfahren und andere von jeder Einwirkung ausschließen.', tags:['Eigentum'], wichtig:true },
            { p:'§ 1004', t:'Beseitigungs- und Unterlassungsanspruch', s:'Eigentümer kann Beseitigung der Beeinträchtigung verlangen. Bei Wiederholungsgefahr: Unterlassung. → Rechtliche Grundlage des Hausverbots!', tags:['Hausverbot','Unterlassung'], wichtig:true,
              beispiel:'Ein Hooligan wirft im Stadion eine Bierflasche. Der Verein spricht ein bundesweites Hausverbot für 3 Jahre aus (gestützt auf § 1004 BGB + § 903 BGB). Betritt er trotzdem das Stadion: § 123 StGB Hausfriedensbruch — sofortige Festnahme nach § 127 StPO.',
              merksatz:'Hausverbot = Ausübung des Eigentumsrechts. Schriftlich + mit klarer Dauer + Begründung — sonst angreifbar.' },
          ],
        },
        {
          nr: 4, title: '📙 Buch 4 · Familienrecht (§§ 1297—1921)',
          paragraphen: [
            { p:'§ 1297', t:'Übersicht',                              s:'Verlöbnis · Ehe · Verwandtschaft · elterliche Sorge · Vormundschaft · Pflegschaft. Für Sicherheitsdienste nur am Rande relevant — z. B. bei Notwehr für Familienangehörige (Nothilfe).', tags:['Familie','Übersicht'] },
          ],
        },
        {
          nr: 5, title: '📓 Buch 5 · Erbrecht (§§ 1922—2385)',
          paragraphen: [
            { p:'§ 1922', t:'Gesamtrechtsnachfolge',                  s:'Mit dem Tod einer Person geht deren Vermögen als Ganzes auf den/die Erben über. Für Sicherheitsdienste: Hausrecht erbt sich mit dem Eigentum.', tags:['Erbrecht','Übersicht'] },
          ],
        },
      ],
    },

    /* ============= StGB ============= */
    {
      id: 'stgb',
      short: 'StGB',
      title: 'Strafgesetzbuch',
      kategorie: 'Strafrecht',
      datum: 'In Kraft seit 01.01.1872 (RStGB) · zahlreiche Novellen',
      farbe: '#dc2626',
      icon: 'fa-gavel',
      url: 'https://www.gesetze-im-internet.de/stgb/',
      intro: '358 Paragraphen in 2 Teilen (Allgemeiner Teil §§ 1—79b · Besonderer Teil §§ 80—358). Für Sicherheitsdienste essenziell: Notwehr/Notstand (§§ 32—35), Hausfriedensbruch (§ 123), Körperverletzung (§ 223), Freiheitsberaubung (§ 239), Nötigung (§ 240). Pflichtstoff der § 7 BeWachV.',
      anwender: 'Strafverfolgungsbehörden · jeder Bürger · Sicherheitsdienste · Wachpersonen',
      visualisierung: 'stgb-aufbau',
      visualisierung2: 'praxis-faelle',
      visualisierung3: 'stgb-notwehr',
      visualisierung4: 'jedermannsrechte',
      abschnitte: [
        {
          nr: 1, title: '⚖️ Allgemeiner Teil · Notwehr & Notstand (§§ 32—35) — HERZSTÜCK',
          paragraphen: [
            { p:'§ 13', t:'Begehen durch Unterlassen',               s:'Wer es unterlässt, einen Erfolg abzuwenden, ist nur strafbar, wenn er rechtlich dafür einzustehen hat (Garantenstellung).', tags:['Unterlassen','Garant'] },
            { p:'§ 15', t:'Vorsätzliches/fahrlässiges Handeln',      s:'Strafbar ist nur vorsätzliches Handeln, wenn nicht das Gesetz fahrlässiges Handeln ausdrücklich mit Strafe bedroht.', tags:['Vorsatz','Fahrlässigkeit'] },
            { p:'§ 17', t:'Verbotsirrtum',                            s:'Fehlt dem Täter bei Begehung die Einsicht, Unrecht zu tun, so handelt er ohne Schuld, wenn er diesen Irrtum nicht vermeiden konnte.', tags:['Verbotsirrtum'] },
            { p:'§ 20', t:'Schuldunfähigkeit · seelische Störung',   s:'Ohne Schuld handelt, wer wegen krankhafter seelischer Störung oder Bewusstseinsstörung unfähig ist, das Unrecht der Tat einzusehen.', tags:['Schuldunfähig'] },
            { p:'§ 32', t:'Notwehr',                                  s:'(1) Wer eine Tat begeht, die durch Notwehr geboten ist, handelt nicht rechtswidrig. (2) Notwehr ist die Verteidigung, die erforderlich ist, um einen gegenwärtigen rechtswidrigen Angriff von sich oder einem anderen abzuwenden.', tags:['Notwehr','Rechtfertigung'], wichtig:true, jedermann:true,
              beispiel:'Ein Randalierer schwingt ein Messer in Richtung Türsteher. Der Türsteher tritt ihm gegen das Bein, der Mann fällt, das Messer fällt zu Boden, er wird festgehalten. → § 32 StGB rechtfertigt das. Auch die Sachbeschädigung an Kleidung/Brille des Angreifers ist gerechtfertigt.',
              merksatz:'4-Stufen-Prüfung: ANGRIFF → GEGENWÄRTIG → RECHTSWIDRIG → ERFORDERLICH + GEBOTEN. Sobald nur eine Stufe fehlt: keine Notwehr.',
              fehler:['Verteidigung nach beendetem Angriff (Rache, Strafe) → keine Notwehr.','Notwehr gegen Polizei, die rechtmäßig handelt → unzulässig (kein rechtswidriger Angriff).','„Trutzwehr" mit Waffen, obwohl Festhalten am Arm möglich war → unverhältnismäßig.'] },
            { p:'§ 33', t:'Überschreitung der Notwehr',               s:'Überschreitet der Täter die Grenzen der Notwehr aus Verwirrung, Furcht oder Schrecken, so wird er nicht bestraft.', tags:['Notwehrexzess'], wichtig:true,
              beispiel:'Der Wachmann wird von zwei Männern überfallen und in Panik versetzt. Er schlägt aus reiner Angst auch noch zu, als die Angreifer schon am Boden liegen. → § 33 StGB: keine Strafe, weil aus Furcht/Schrecken überzogen. Aber: zivilrechtliche Haftung (§ 823 BGB) bleibt möglich!' },
            { p:'§ 34', t:'Rechtfertigender Notstand',                s:'Wer in einer gegenwärtigen, nicht anders abwendbaren Gefahr für Leben, Leib, Freiheit, Ehre, Eigentum oder ein anderes Rechtsgut eine Tat begeht, um die Gefahr abzuwenden, handelt nicht rechtswidrig — wenn bei Abwägung das geschützte Interesse wesentlich überwiegt.', tags:['Notstand','Abwägung'], wichtig:true, jedermann:true,
              beispiel:'Der Wachmann findet eine bewusstlose Person hinter einer verschlossenen Tür. Er tritt die Tür ein, um zu helfen, bis der Rettungsdienst eintrifft. → § 34 StGB rechtfertigt die Sachbeschädigung — Leben überwiegt das Eigentum am Türschloss klar.' },
            { p:'§ 35', t:'Entschuldigender Notstand',                s:'Wer in einer gegenwärtigen, nicht anders abwendbaren Gefahr für Leben, Leib oder Freiheit eine rechtswidrige Tat begeht, um die Gefahr von sich, einem Angehörigen oder einer ihm nahestehenden Person abzuwenden, handelt ohne Schuld.', tags:['Entschuldigung'], jedermann:true,
              beispiel:'Wachmann wird mit der Pistole bedroht und gezwungen, den Tresorcode zu nennen, sonst wird seine Familie bedroht. → § 35 StGB entschuldigt die Geheimnisverletzung — er handelt rechtswidrig, aber ohne Schuld.' },
          ],
        },
        {
          nr: 2, title: '🏠 Besonderer Teil · Hausfriedensbruch & Beleidigung (§§ 123—202)',
          paragraphen: [
            { p:'§ 123', t:'Hausfriedensbruch',                       s:'Wer in die Wohnung, in die Geschäftsräume oder in das befriedete Besitztum eines anderen widerrechtlich eindringt oder, wenn er ohne Befugnis darin verweilt und auf die Aufforderung des Berechtigten sich nicht entfernt, wird mit Freiheitsstrafe bis zu 1 Jahr oder mit Geldstrafe bestraft. Antragsdelikt!', tags:['Hausrecht','Antragsdelikt'], wichtig:true,
              beispiel:'Variante 1 (Eindringen): Jemand schleicht sich am Pförtner vorbei aufs Werksgelände.\nVariante 2 (Nicht-Entfernen): Im Einkaufszentrum wird einem Kunden Hausverbot erteilt. Er weigert sich zu gehen und wird laut. Nach klarer Aufforderung „Bitte verlassen Sie sofort das Gebäude" liegt § 123 II Alt. 2 StGB vor.',
              merksatz:'Antragsdelikt — nur auf Antrag des Hausrechtsinhabers (§ 123 II StGB). Strafantrag binnen 3 Monaten (§ 77b StGB)!',
              fehler:['„Bitte gehen Sie" reicht nicht — die Aufforderung muss eindeutig vom Hausrechtsinhaber oder dessen Bevollmächtigtem kommen.','Festnahme nach § 127 StPO nur, wenn Fluchtgefahr oder unbekannte Identität.'] },
            { p:'§ 124', t:'Schwerer Hausfriedensbruch',              s:'Wenn sich eine Menschenmenge öffentlich zusammenrottet und in gewalttätiger Absicht in fremde Räume eindringt: bis zu 2 Jahre oder Geldstrafe.', tags:['Menschenmenge'] },
            { p:'§ 132', t:'Amtsanmaßung',                            s:'Wer unbefugt sich mit der Ausübung eines öffentlichen Amtes befasst oder eine Handlung vornimmt, welche nur Inhaber eines öffentlichen Amtes verrichten dürfen — bis zu 2 Jahre. WICHTIG: Sicherheitsmitarbeiter dürfen sich NICHT als Polizei ausgeben!', tags:['Polizei-Verbot'], wichtig:true,
              beispiel:'Verboten: „Polizei! Ausweis!" oder „Stehenbleiben, Polizeikontrolle!"\nErlaubt: „Werkschutz/Sicherheitsdienst — darf ich Ihren Ausweis sehen?"\nErlaubt: Person nach § 127 StPO festhalten — aber immer mit klarer Eigen-Identifikation.',
              merksatz:'Dunkelblaue Uniform mit Schriftzug „Security" ist okay — aber NIE „Police", „Polizei" oder Sterne/Hoheitszeichen, die mit Polizei verwechselbar sind. Auch verlangt § 19 BeWachV deutliche Unterscheidbarkeit.' },
            { p:'§ 138', t:'Nichtanzeige geplanter Straftaten',       s:'Wer von dem Vorhaben oder der Ausführung bestimmter Straftaten (Hochverrat, Mord, Raub, schwere Brandstiftung) glaubhaft erfährt und es unterlässt, der Behörde rechtzeitig Anzeige zu machen, wird bestraft.', tags:['Anzeigepflicht'] },
            { p:'§ 185', t:'Beleidigung',                              s:'Bis zu 1 Jahr Freiheitsstrafe oder Geldstrafe. Antragsdelikt.', tags:['Ehrdelikt'] },
            { p:'§ 186', t:'Üble Nachrede',                            s:'Wer eine ehrenrührige Tatsache über einen anderen behauptet oder verbreitet, ohne dass sie erweislich wahr ist — bis zu 1 Jahr.', tags:['Ehrdelikt'] },
            { p:'§ 187', t:'Verleumdung',                              s:'Wer wider besseres Wissen eine ehrenrührige unwahre Tatsache behauptet oder verbreitet — bis zu 2 Jahre.', tags:['Verleumdung'] },
            { p:'§ 201', t:'Verletzung der Vertraulichkeit des Wortes', s:'Wer unbefugt das nichtöffentlich gesprochene Wort eines anderen aufnimmt — bis zu 3 Jahre.', tags:['Aufnahme-Verbot'], wichtig:true,
              beispiel:'Detektiv zeichnet heimlich das Gespräch mit einem Dieb auf, um „Beweise" zu haben. → § 201 StGB strafbar! Auch wenn Polizei oder Gericht die Aufnahme als Beweis verwenden würde, hat der Detektiv sich bereits strafbar gemacht.\nErlaubt: schriftliche Notiz, was gesagt wurde.',
              fehler:['Heimliche Videoaufnahme mit Ton im Privatbereich → fast immer strafbar.','Aufnahme im öffentlichen Raum mit gut hörbaren Stimmen → Grenzfall; im Zweifel: Finger weg.'] },
            { p:'§ 202a', t:'Ausspähen von Daten',                    s:'Wer unbefugt sich oder einem anderen Zugang zu Daten verschafft, die nicht für ihn bestimmt und gegen unberechtigten Zugang besonders gesichert sind — bis zu 3 Jahre.', tags:['Hacking','IT-Sec'] },
            { p:'§ 203', t:'Verletzung von Privatgeheimnissen',       s:'Schweigepflicht für Berufsgeheimnisträger — auch Sicherheitsmitarbeiter (z. B. Werkschutz) unterliegen vertraglich der Schweigepflicht.', tags:['Schweigepflicht'], wichtig:true },
          ],
        },
        {
          nr: 3, title: '🩸 Besonderer Teil · Tötung & Körperverletzung (§§ 211—229)',
          paragraphen: [
            { p:'§ 211', t:'Mord',                                    s:'Lebenslange Freiheitsstrafe. Mordmerkmale: Mordlust, Befriedigung des Geschlechtstriebs, Habgier, sonst niedrige Beweggründe · heimtückisch, grausam, gemeingefährlich · Verdeckungs-/Ermöglichungsabsicht.', tags:['Mordmerkmale'], wichtig:true },
            { p:'§ 212', t:'Totschlag',                                s:'Wer einen Menschen tötet, ohne Mörder zu sein — Freiheitsstrafe nicht unter 5 Jahren. Im besonders schweren Fall lebenslang.', tags:['Tötungsdelikt'] },
            { p:'§ 222', t:'Fahrlässige Tötung',                      s:'Bis zu 5 Jahre Freiheitsstrafe oder Geldstrafe.', tags:['Fahrlässigkeit'] },
            { p:'§ 223', t:'Körperverletzung',                         s:'Wer eine andere Person körperlich misshandelt oder an der Gesundheit schädigt — bis zu 5 Jahre. Versuch strafbar. Antragsdelikt (Ausnahme: besonderes öffentl. Interesse).', tags:['KV','Antragsdelikt'], wichtig:true,
              beispiel:'Türsteher schubst aus Wut einen Gast in die Brust. Gast taumelt, fällt nicht. → Bereits Körperverletzung (Misshandlung)! Auch ohne sichtbare Verletzung. „Nur ein Schubser" ist juristisch eine Tat.',
              merksatz:'Körperliche Misshandlung = jede üble, unangemessene Behandlung. Gesundheitsschädigung = Erzeugen/Steigern eines pathologischen Zustands.',
              fehler:['Annahme „solange kein Blut, keine KV" → falsch. Schmerz reicht.','Erlaubt sind nur Eingriffe, die durch Notwehr/§ 229/Einwilligung gerechtfertigt sind.'] },
            { p:'§ 224', t:'Gefährliche Körperverletzung',             s:'Körperverletzung mittels Waffe, gefährlichem Werkzeug, Gift, hinterlistigem Überfall, mit anderen gemeinschaftlich, lebensgefährdender Behandlung — 6 Monate bis 10 Jahre.', tags:['gefährlich'], wichtig:true,
              beispiel:'Zwei Wachleute halten gemeinsam einen Mann gewaltsam am Boden fest und drücken ihn länger als nötig in den Boden. → § 224 I Nr. 4 (gemeinschaftlich) + Nr. 5 (lebensgefährdende Behandlung möglich). Schon das Risiko zählt — auch ohne tatsächliche Lebensgefahr.' },
            { p:'§ 226', t:'Schwere Körperverletzung',                s:'Verlust eines wichtigen Glieds, Sehvermögens, Sprechvermögens etc. — Freiheitsstrafe von 1 bis 10 Jahren.', tags:['schwer'] },
            { p:'§ 227', t:'Körperverletzung mit Todesfolge',         s:'Wenn der Täter durch die Körperverletzung den Tod des Verletzten verursacht — nicht unter 3 Jahren Freiheitsstrafe.', tags:['Todesfolge'] },
            { p:'§ 229', t:'Fahrlässige Körperverletzung',            s:'Bis zu 3 Jahre Freiheitsstrafe oder Geldstrafe.', tags:['Fahrlässigkeit'] },
          ],
        },
        {
          nr: 4, title: '🔒 Besonderer Teil · Freiheitsdelikte & Eigentum (§§ 239—263)',
          paragraphen: [
            { p:'§ 239', t:'Freiheitsberaubung',                      s:'Wer einen Menschen einsperrt oder auf andere Weise der Freiheit beraubt — bis zu 5 Jahre. WICHTIG bei Festnahme durch Sicherheitsdienst — nur § 127 StPO als Rechtfertigung!', tags:['Festnahme','Vorsicht'], wichtig:true,
              beispiel:'Ladendetektiv sperrt Dieb in den Lagerraum und ruft erst 90 Minuten später die Polizei. → § 239 StGB Freiheitsberaubung! Die Festhaltedauer war unverhältnismäßig.\nRichtig: Polizei sofort verständigen + Festgehaltenen in offener Tür/Sichtkontakt halten.',
              merksatz:'Festhalten nach § 127 StPO ist erlaubt — aber JEDE Sekunde länger als zur Übergabe an die Polizei nötig kippt ins § 239 StGB.',
              fehler:['Festnahme „auf Verdacht" ohne Anhaltspunkte → ungerechtfertigt.','Fesselung mit Kabelbinder ohne medizinische Kontrolle → eigene Strafbarkeit.','Hinterzimmer mit verriegelter Tür → klassisches Beispiel für § 239.'] },
            { p:'§ 240', t:'Nötigung',                                 s:'Wer einen Menschen rechtswidrig mit Gewalt oder durch Drohung mit einem empfindlichen Übel zu einer Handlung, Duldung oder Unterlassung nötigt — bis zu 3 Jahre.', tags:['Nötigung'], wichtig:true,
              beispiel:'„Wenn Sie nicht jetzt Ihre Taschen leeren, rufe ich die Polizei und Sie haben einen Eintrag." → Drohung mit empfindlichem Übel, um zur Handlung zu zwingen → § 240 StGB.\nRichtig: „Ich bitte Sie um eine freiwillige Taschenkontrolle. Wenn Sie ablehnen, halte ich Sie nach § 127 StPO fest und rufe die Polizei."' },
            { p:'§ 241', t:'Bedrohung',                                s:'Wer einen Menschen mit der Begehung einer gegen ihn gerichteten rechtswidrigen Tat gegen die sexuelle Selbstbestimmung, die körperliche Unversehrtheit, die persönliche Freiheit oder gegen eine Sache von bedeutendem Wert bedroht — bis zu 1 Jahr.', tags:['Bedrohung'] },
            { p:'§ 242', t:'Diebstahl',                                s:'Wer eine fremde bewegliche Sache einem anderen in der Absicht wegnimmt, die Sache sich oder einem Dritten rechtswidrig zuzueignen — bis zu 5 Jahre.', tags:['Diebstahl'], wichtig:true },
            { p:'§ 243', t:'Besonders schwerer Diebstahl',             s:'Einbruch, Einsteigen, Aufbrechen, verschlossene Sachen, gewerbsmäßig — 3 Monate bis 10 Jahre.', tags:['Einbruch'] },
            { p:'§ 244', t:'Diebstahl mit Waffen · Bandendiebstahl',  s:'Mit Waffe/gefährl. Werkzeug oder als Bandenmitglied — 6 Monate bis 10 Jahre.', tags:['Waffe'], wichtig:true },
            { p:'§ 246', t:'Unterschlagung',                           s:'Wer eine fremde bewegliche Sache sich oder einem Dritten rechtswidrig zueignet — bis zu 3 Jahre.', tags:['Unterschlagung'] },
            { p:'§ 249', t:'Raub',                                     s:'Wer mit Gewalt gegen eine Person oder unter Drohung mit gegenwärtiger Gefahr für Leib oder Leben eine fremde bewegliche Sache wegnimmt — nicht unter 1 Jahr.', tags:['Raub'], wichtig:true },
            { p:'§ 252', t:'Räuberischer Diebstahl',                  s:'Wer auf frischer Tat eines Diebstahls betroffen Gewalt anwendet, um sich im Besitz des Diebesguts zu erhalten — wie Räuber bestraft. WICHTIG: Häufig bei Ladendetektiv-Einsatz!', tags:['Ladendieb'], wichtig:true,
              beispiel:'Der Detektiv hält den Ladendieb am Ausgang an. Der Dieb schlägt nach dem Detektiv, um die Ware zu behalten, und versucht zu fliehen. → § 252 StGB: aus dem einfachen Diebstahl (§ 242) wird automatisch Raub-Strafmaß (1—15 Jahre)!\nKonsequenz: Detektiv sollte Notwehr-Lage (§ 32 StGB) erkennen — er darf jetzt aktiv verteidigen.' },
            { p:'§ 253', t:'Erpressung',                               s:'Wer einen Menschen rechtswidrig mit Gewalt oder durch Drohung mit einem empfindlichen Übel zu einer Handlung, Duldung oder Unterlassung nötigt und dadurch dem Vermögen des Genötigten Nachteil zufügt — bis zu 5 Jahre.', tags:['Erpressung'] },
            { p:'§ 263', t:'Betrug',                                   s:'Wer in der Absicht, sich oder einem Dritten einen rechtswidrigen Vermögensvorteil zu verschaffen, durch Vorspiegelung falscher Tatsachen den Irrtum eines anderen erregt — bis zu 5 Jahre.', tags:['Betrug'] },
          ],
        },
        {
          nr: 5, title: '🔥 Besonderer Teil · Gemeingefährliche & Hilfeleistung (§§ 303—323c)',
          paragraphen: [
            { p:'§ 303', t:'Sachbeschädigung',                         s:'Wer rechtswidrig eine fremde Sache beschädigt oder zerstört — bis zu 2 Jahre. Antragsdelikt.', tags:['Sachbeschädigung'] },
            { p:'§ 306', t:'Brandstiftung',                            s:'Wer fremde Sachen (Gebäude, Hütten, Anlagen) in Brand setzt oder durch Brandlegung ganz oder teilweise zerstört — 1 bis 10 Jahre.', tags:['Brandstiftung'] },
            { p:'§ 315', t:'Gefährliche Eingriffe in den Straßenverkehr', s:'Wer die Sicherheit des Straßenverkehrs beeinträchtigt — 6 Monate bis 10 Jahre.', tags:['Verkehr'] },
            { p:'§ 323a', t:'Vollrausch',                              s:'Wer sich vorsätzlich oder fahrlässig durch alkoholische Getränke in einen Rausch versetzt und in diesem Zustand eine rechtswidrige Tat begeht — bis zu 5 Jahre.', tags:['Alkohol'] },
            { p:'§ 323c', t:'Unterlassene Hilfeleistung',              s:'Wer bei Unglücksfällen oder gemeiner Gefahr nicht Hilfe leistet, obwohl dies erforderlich und ihm zumutbar ist — bis zu 1 Jahr. ABSOLUTE PFLICHT auch für Sicherheitsmitarbeiter!', tags:['Hilfspflicht'], wichtig:true,
              beispiel:'Streifengänger findet bewusstlose Person im Hinterhof, geht weiter, weil „nicht mein Bereich". → § 323c StGB strafbar.\nRichtig: 112 wählen, Erste Hilfe leisten (mindestens Lage prüfen, freie Atemwege, bei Bedarf stabile Seitenlage), bis Rettungsdienst eintrifft.',
              merksatz:'Sicherheitsmitarbeiter haben durch ihre Stellung (Sachkunde nach § 7 BeWachV, Erste-Hilfe-Schein!) eine erhöhte Pflicht — Untätigkeit ist nie eine Option.' },
          ],
        },
      ],
    },

    /* ============= DIN SPEC 14027 · Corporate Security ============= */
    {
      id: 'din14027',
      short: 'DIN SPEC 14027',
      title: 'DIN SPEC 14027 · Corporate Security · Unternehmenssicherheit',
      kategorie: 'Norm · Unternehmenssicherheit',
      datum: '04/2026',
      farbe: '#10b981',
      icon: 'fa-building-shield',
      url: 'https://www.dinmedia.de/de/technische-regel/din-spec-14027/400565136',
      intro: 'Erster branchenübergreifender Standard für die physische Unternehmenssicherheit (Corporate Security). Voller Titel: „Anforderungen zur Stärkung physischer Resilienz von Organisationen". Definiert 16 Handlungsfelder und ein abgestuftes Sicherheitslevel-System A–D. Auf Initiative des BMI von über 40 Organisationen erarbeitet (~202 Seiten), kostenlos beziehbar.',
      anwender: 'Sicherheitsverantwortliche (CSO), Unternehmenssicherheit / Werkschutz, KMU bis Großkonzerne, Fachplaner, Auditoren, Ausschreibende',
      abschnitte: [
        {
          nr: 1, title: 'Grundprinzip · Status · Aufbau',
          paragraphen: [
            { p:'Zweck', t:'Corporate Security Grundschutz', s:'Schließt die Lücke eines bislang fehlenden Standards für die physische Sicherheit von Organisationen. Konzept vergleichbar mit dem IT-Grundschutz des BSI – als Orientierungsrahmen, nicht als Pflicht.', tags:['Grundschutz','physische Resilienz'], wichtig:true },
            { p:'Status', t:'DIN SPEC (PAS-Verfahren) – nicht verbindlich', s:'Im PAS-Verfahren (Publicly Available Specification) entstanden, kein Teil des regulären DIN-Normenwerks und ohne unmittelbare Rechtspflicht. Dient als Referenz für Ausschreibungen, Audits und Benchmarking.', tags:['nicht verbindlich','Referenz'] },
            { p:'Level', t:'Sicherheitslevel A–D', s:'Abgestuftes System von A (sehr hoch) bis D (niedrig) – unabhängig von Branche und Unternehmensgröße. Ermöglicht eine maßgeschneiderte Balance zwischen Aufwand und individuellem Schutzbedarf.', tags:['A = sehr hoch','D = niedrig'], wichtig:true },
            { p:'Aufbau', t:'Beschreibung + Anhang A (Checkliste)', s:'Jedes der 16 Handlungsfelder hat im Hauptteil eine Kurzbeschreibung (Was ist es? Wann nötig? Welche Schnittstellen?) und im Anhang A einen detaillierten Anforderungskatalog als Checkliste.', tags:['Hauptteil','Anhang A','Checkliste'] },
            { p:'Herkunft', t:'BMI-Initiative · 40+ Organisationen', s:'Auf Initiative des Bundesministeriums des Innern (BMI) von über 40 Organisationen aus Behörden und Wirtschaft erarbeitet. Kostenloser Download über DIN Media.', tags:['BMI','kostenlos'] },
          ],
        },
        {
          nr: 2, title: 'Handlungsfelder der Unternehmenssicherheit',
          paragraphen: [
            { p:'HF', t:'Schutzbedarfsermittlung', s:'Werteklassifizierung (Assets) und Bedrohungs-/Risikoanalyse als Ausgangspunkt – bestimmt das anzustrebende Sicherheitslevel.', tags:['Risikoanalyse','Assets'], wichtig:true },
            { p:'HF', t:'Sicherheitslagebild', s:'Operatives und strategisches Lagebild, ggf. Lagezentrum – kontinuierliche Beobachtung der Sicherheitslage.', tags:['Lagebild','Lagezentrum'] },
            { p:'HF', t:'Sicherheitskultur & Kommunikation', s:'Security Awareness, Sensibilisierung der Mitarbeitenden und interne Sicherheitskommunikation.', tags:['Awareness','Kultur'] },
            { p:'HF', t:'Standort- / Liegenschaftssicherheit', s:'Physischer Schutz von Standorten und Liegenschaften (Perimeter, Zutritt, mechanische und elektronische Sicherung).', tags:['Perimeter','Zutritt'] },
            { p:'HF', t:'Reisesicherheit (Travel Security)', s:'Schutz von Mitarbeitenden auf Dienstreisen, Reiserisiko-Bewertung und Notfallprozesse im Ausland.', tags:['Travel Security'] },
            { p:'HF', t:'Business Continuity Management', s:'Aufrechterhaltung kritischer Geschäftsprozesse bei Störungen (Schnittstelle zu ISO 22301).', tags:['BCM'] },
            { p:'HF', t:'Krisenmanagement', s:'Organisation, Stäbe und Abläufe zur Bewältigung von Krisen.', tags:['Krise','Stab'] },
            { p:'HF', t:'Interne Ermittlungen', s:'Strukturierte interne Untersuchungen (Investigations) bei Verstößen und Vorfällen.', tags:['Investigations'] },
            { p:'HF', t:'Know-how- & Informationsschutz', s:'Schutz von geistigem Eigentum, Betriebsgeheimnissen und sensiblen Informationen (Schnittstelle zur IT-Sicherheit).', tags:['Know-how','IP'] },
            { p:'Hinweis', t:'Vollständige 16 Handlungsfelder', s:'Dies sind die in öffentlichen Quellen benannten Schwerpunkte. Die vollständige Liste aller 16 Handlungsfelder samt Anforderungskatalogen steht im kostenlosen DIN-SPEC-14027-Dokument (Anhang A).', tags:['Quelle: DIN Media'] },
          ],
        },
      ],
    },
  ];

  /* ====== VISUALISIERUNGEN als SVG ====== */
  const VIS = {

    /* ===== BGB · 5 Bücher als interaktive Übersicht ===== */
    'bgb-buecher': `
      <svg viewBox="0 0 720 480" xmlns="http://www.w3.org/2000/svg" class="ges-vis">
        <defs>
          <linearGradient id="bgb-bg" x2="0" y2="1"><stop offset="0" stop-color="#0b1424"/><stop offset="1" stop-color="#060a14"/></linearGradient>
          <filter id="bgb-glow"><feGaussianBlur stdDeviation="2"/></filter>
        </defs>
        <rect width="720" height="480" fill="url(#bgb-bg)"/>
        <text x="360" y="30" text-anchor="middle" font-size="16" fill="#0891b2" font-weight="900">BGB · Bürgerliches Gesetzbuch · 5 Bücher · 2.385 §§</text>
        <text x="360" y="50" text-anchor="middle" font-size="11" fill="#94a3b8">Pandektensystem · seit 01.01.1900</text>

        ${[
          {n:1, ti:'Allg. Teil',     b:'Buch 1', p:'§§ 1—240',   col:'#06b6d4', x:60,  topic:'Personen · Sachen · Rechtsgeschäfte', wichtig:'§ 145 Antrag'},
          {n:2, ti:'Schuldrecht',     b:'Buch 2', p:'§§ 241—853', col:'#22c55e', x:200, topic:'Verträge · Schadensersatz · NOTWEHR', wichtig:'§ 227 · § 823 · § 859'},
          {n:3, ti:'Sachenrecht',     b:'Buch 3', p:'§§ 854—1296',col:'#fbbf24', x:340, topic:'Besitz · Eigentum · Hausrecht', wichtig:'§ 903 · § 1004'},
          {n:4, ti:'Familienrecht',   b:'Buch 4', p:'§§ 1297—1921',col:'#a855f7',x:480, topic:'Ehe · Verwandtschaft · Sorge', wichtig:'Übersicht'},
          {n:5, ti:'Erbrecht',        b:'Buch 5', p:'§§ 1922—2385',col:'#ef4444',x:620, topic:'Erbfolge · Testament · Pflichtteil', wichtig:'§ 1922'},
        ].map(B => `
          <g>
            <rect x="${B.x-50}" y="80" width="100" height="240" rx="10" fill="#1e293b" stroke="${B.col}" stroke-width="2.5"/>
            <!-- Buchrücken -->
            <rect x="${B.x-46}" y="84" width="92" height="16" rx="3" fill="${B.col}"/>
            <text x="${B.x}" y="96" text-anchor="middle" font-size="9" fill="#0b1424" font-weight="900">${B.b}</text>
            <!-- Nr-Kreis -->
            <circle cx="${B.x}" cy="140" r="22" fill="#0a0f1a" stroke="${B.col}" stroke-width="2"/>
            <text x="${B.x}" y="148" text-anchor="middle" font-size="20" fill="${B.col}" font-weight="900">${B.n}</text>
            <!-- Titel -->
            <text x="${B.x}" y="195" text-anchor="middle" font-size="12" fill="${B.col}" font-weight="800">${B.ti}</text>
            <text x="${B.x}" y="215" text-anchor="middle" font-size="9" fill="#94a3b8" font-family="monospace">${B.p}</text>
            <!-- Topic -->
            <foreignObject x="${B.x-45}" y="225" width="90" height="50">
              <div xmlns="http://www.w3.org/1999/xhtml" style="font:10px sans-serif;color:#cbd5e1;text-align:center;line-height:1.3">${B.topic}</div>
            </foreignObject>
            <!-- Wichtige §§ -->
            <rect x="${B.x-44}" y="285" width="88" height="28" rx="3" fill="${B.col}" opacity=".2" stroke="${B.col}" stroke-width="1"/>
            <text x="${B.x}" y="303" text-anchor="middle" font-size="9" fill="${B.col}" font-weight="700">${B.wichtig}</text>
          </g>
        `).join('')}

        <!-- Hervorhebung: für Sicherheitsdienste -->
        <rect x="40" y="350" width="640" height="115" rx="8" fill="rgba(8,145,178,.1)" stroke="#0891b2" stroke-width="1.5"/>
        <text x="60" y="375" font-size="13" fill="#0891b2" font-weight="900">⚡ Für Sicherheitsdienste essenziell:</text>
        <g font-size="10.5" fill="#cbd5e1">
          <text x="60" y="398"><tspan fill="#22c55e" font-weight="800">§ 227 BGB Notwehr</tspan> · zivilrechtliche Rechtfertigung von Verteidigungshandlungen</text>
          <text x="60" y="416"><tspan fill="#22c55e" font-weight="800">§ 229 BGB Selbsthilfe</tspan> · Wegnahme/Festnahme wenn obrigkeitliche Hilfe zu spät kommt</text>
          <text x="60" y="434"><tspan fill="#fbbf24" font-weight="800">§ 859 BGB Besitzwehr/-kehr</tspan> · Schutzrechte des Besitzers (auch Sicherheitsmitarbeiter als Besitzdiener!)</text>
          <text x="60" y="452"><tspan fill="#ef4444" font-weight="800">§ 823 BGB Schadensersatz</tspan> · Haftung bei Verletzung von Leben/Körper/Eigentum</text>
        </g>
      </svg>`,

    /* ===== StGB · Aufbau Allg. + Bes. Teil ===== */
    'stgb-aufbau': `
      <svg viewBox="0 0 720 520" xmlns="http://www.w3.org/2000/svg" class="ges-vis">
        <rect width="720" height="520" fill="#0a0f1a"/>
        <text x="360" y="30" text-anchor="middle" font-size="16" fill="#dc2626" font-weight="900">StGB · Strafgesetzbuch · Aufbau</text>
        <text x="360" y="50" text-anchor="middle" font-size="11" fill="#94a3b8">358 Paragraphen · 2 Teile · seit 01.01.1872</text>

        <!-- Allgemeiner Teil -->
        <g>
          <rect x="40" y="80" width="290" height="400" rx="10" fill="#1e293b" stroke="#fbbf24" stroke-width="2.5"/>
          <rect x="40" y="80" width="290" height="36" rx="10" fill="#fbbf24"/>
          <text x="185" y="105" text-anchor="middle" font-size="14" fill="#0b1424" font-weight="900">⚖️ ALLGEMEINER TEIL</text>
          <text x="185" y="132" text-anchor="middle" font-size="10" fill="#fbbf24" font-family="monospace">§§ 1 — 79b</text>
          <text x="185" y="148" text-anchor="middle" font-size="10" fill="#94a3b8">Grundregeln · Rechtfertigung · Schuld · Strafe</text>

          ${[
            {p:'§§ 1—12', t:'Anwendungsbereich · Geltung'},
            {p:'§§ 13—21', t:'Vorsatz · Fahrlässigkeit · Schuld'},
            {p:'§ 32', t:'NOTWEHR · ⭐', hl:'#22c55e'},
            {p:'§ 33', t:'Notwehrexzess'},
            {p:'§ 34', t:'rechtfertigender Notstand ⭐', hl:'#22c55e'},
            {p:'§ 35', t:'entschuldigender Notstand'},
            {p:'§§ 38—45', t:'Strafarten · Geld- + Freiheitsstrafe'},
            {p:'§§ 46—51', t:'Strafzumessung'},
            {p:'§§ 56—58', t:'Bewährung'},
            {p:'§§ 78—79b', t:'Verjährung'},
          ].map((row,i) => `
            <rect x="56" y="${172 + i*28}" width="258" height="22" rx="3" fill="${row.hl?'rgba(34,197,94,.15)':'#0a0f1a'}" stroke="${row.hl||'#334155'}"/>
            <text x="64" y="${187 + i*28}" font-size="10" font-family="monospace" fill="${row.hl||'#94a3b8'}" font-weight="700">${row.p}</text>
            <text x="125" y="${187 + i*28}" font-size="10" fill="${row.hl||'#cbd5e1'}">${row.t}</text>
          `).join('')}
        </g>

        <!-- Besonderer Teil -->
        <g>
          <rect x="350" y="80" width="330" height="400" rx="10" fill="#1e293b" stroke="#dc2626" stroke-width="2.5"/>
          <rect x="350" y="80" width="330" height="36" rx="10" fill="#dc2626"/>
          <text x="515" y="105" text-anchor="middle" font-size="14" fill="#fff" font-weight="900">🎯 BESONDERER TEIL</text>
          <text x="515" y="132" text-anchor="middle" font-size="10" fill="#dc2626" font-family="monospace">§§ 80 — 358</text>
          <text x="515" y="148" text-anchor="middle" font-size="10" fill="#94a3b8">Einzelne Straftatbestände (Mord, Diebstahl ...)</text>

          ${[
            {p:'§ 123', t:'Hausfriedensbruch ⭐', hl:'#fbbf24'},
            {p:'§ 132', t:'Amtsanmaßung ⚠️', hl:'#ef4444'},
            {p:'§ 185', t:'Beleidigung'},
            {p:'§ 201', t:'unbefugte Tonaufnahme ⭐', hl:'#fbbf24'},
            {p:'§ 211', t:'Mord (lebenslang)'},
            {p:'§ 223', t:'Körperverletzung ⭐', hl:'#fbbf24'},
            {p:'§ 224', t:'Gefährliche KV (Waffen!)'},
            {p:'§ 239', t:'Freiheitsberaubung ⚠️', hl:'#ef4444'},
            {p:'§ 240', t:'Nötigung'},
            {p:'§ 242', t:'Diebstahl'},
            {p:'§ 252', t:'Räuber. Diebstahl ⭐ (Ladendetektiv)', hl:'#fbbf24'},
            {p:'§ 303', t:'Sachbeschädigung'},
            {p:'§ 323c', t:'unterl. Hilfeleistung ⭐', hl:'#22c55e'},
          ].map((row,i) => `
            <rect x="368" y="${172 + i*22}" width="294" height="18" rx="3" fill="${row.hl?'rgba(220,38,38,.12)':'#0a0f1a'}" stroke="${row.hl||'#334155'}"/>
            <text x="376" y="${185 + i*22}" font-size="9.5" font-family="monospace" fill="${row.hl||'#94a3b8'}" font-weight="700">${row.p}</text>
            <text x="430" y="${185 + i*22}" font-size="9.5" fill="${row.hl||'#cbd5e1'}">${row.t}</text>
          `).join('')}
        </g>

        <text x="360" y="505" text-anchor="middle" font-size="10" fill="#22d3ee" font-weight="700">⭐ = häufig im Sicherheitsdienst-Alltag · ⚠️ = Achtung Strafbarkeitsrisiko für Wachpersonen</text>
      </svg>`,

    /* ===== Notwehr-Flowchart · § 32 StGB ===== */
    'stgb-notwehr': `
      <svg viewBox="0 0 760 540" xmlns="http://www.w3.org/2000/svg" class="ges-vis">
        <rect width="760" height="540" fill="#0a0f1a"/>
        <text x="380" y="30" text-anchor="middle" font-size="16" fill="#22c55e" font-weight="900">§ 32 StGB · Notwehr-Prüfung · 4-Stufen-Schema</text>
        <text x="380" y="50" text-anchor="middle" font-size="11" fill="#94a3b8">Wer eine durch Notwehr gebotene Tat begeht, handelt nicht rechtswidrig.</text>

        ${[
          {n:1, label:'ANGRIFF', q:'Liegt ein Angriff auf ein rechtlich geschütztes Gut vor?', ja:'Person, Eigentum, Freiheit, Ehre — JA', nein:'kein Angriff → keine Notwehr', y:85, col:'#22c55e'},
          {n:2, label:'GEGENWÄRTIG', q:'Steht der Angriff unmittelbar bevor, dauert er an oder noch nicht beendet?', ja:'unmittelbar/dauernd → JA', nein:'in Zukunft / vorbei → keine Notwehr', y:185, col:'#22c55e'},
          {n:3, label:'RECHTSWIDRIG', q:'Ist der Angriff selbst nicht durch Rechtfertigung gedeckt?', ja:'Angreifer hat keine Rechtfertigung → JA', nein:'(z. B. Polizei greift rechtmäßig zu) → keine Notwehr', y:285, col:'#22c55e'},
          {n:4, label:'ERFORDERLICH + GEBOTEN', q:'Ist Verteidigung das mildeste wirksame Mittel UND nicht rechtsmissbräuchlich?', ja:'mildestes Mittel + sozial geboten → ✓ NOTWEHR', nein:'unverhältnismäßig → Notwehrexzess (§ 33)', y:385, col:'#22c55e'},
        ].map(S => `
          <g>
            <!-- Stufenkreis -->
            <circle cx="60" cy="${S.y+30}" r="26" fill="#1e293b" stroke="${S.col}" stroke-width="3"/>
            <text x="60" y="${S.y+38}" text-anchor="middle" font-size="20" fill="${S.col}" font-weight="900">${S.n}</text>
            <!-- Label -->
            <rect x="100" y="${S.y}" width="170" height="60" rx="6" fill="${S.col}" opacity=".18" stroke="${S.col}" stroke-width="1.5"/>
            <text x="185" y="${S.y+25}" text-anchor="middle" font-size="13" fill="${S.col}" font-weight="900">${S.label}</text>
            <foreignObject x="105" y="${S.y+30}" width="160" height="28">
              <div xmlns="http://www.w3.org/1999/xhtml" style="font:9px sans-serif;color:#cbd5e1;text-align:center;line-height:1.3">${S.q}</div>
            </foreignObject>
            <!-- JA-Pfeil -->
            <rect x="290" y="${S.y+5}" width="220" height="22" rx="3" fill="rgba(34,197,94,.18)" stroke="#22c55e"/>
            <text x="298" y="${S.y+20}" font-size="10" fill="#22c55e" font-weight="700">✓ ${S.ja}</text>
            <!-- NEIN-Pfeil -->
            <rect x="290" y="${S.y+33}" width="220" height="22" rx="3" fill="rgba(239,68,68,.12)" stroke="#ef4444"/>
            <text x="298" y="${S.y+48}" font-size="10" fill="#ef4444" font-weight="700">✗ ${S.nein}</text>
            ${S.n<4 ? `<line x1="60" y1="${S.y+60}" x2="60" y2="${S.y+95}" stroke="#22c55e" stroke-width="2"/>
            <polygon points="56,${S.y+92} 60,${S.y+100} 64,${S.y+92}" fill="#22c55e"/>` : ''}
            <!-- §§-Verweis -->
            <text x="540" y="${S.y+32}" font-size="9" fill="#94a3b8" font-family="monospace">vgl. § 32 II StGB</text>
            <text x="540" y="${S.y+48}" font-size="9" fill="#94a3b8" font-family="monospace">+ § 227 BGB</text>
          </g>
        `).join('')}

        <!-- Ergebnis -->
        <rect x="40" y="480" width="680" height="48" rx="8" fill="rgba(34,197,94,.18)" stroke="#22c55e" stroke-width="2"/>
        <text x="380" y="500" text-anchor="middle" font-size="13" fill="#22c55e" font-weight="900">✓ Alle 4 Stufen JA → NOTWEHR · keine Rechtswidrigkeit · keine Strafe · kein Schadensersatz</text>
        <text x="380" y="518" text-anchor="middle" font-size="10" fill="#94a3b8">Nothilfe = Notwehr zugunsten Dritter — selbe Voraussetzungen</text>
      </svg>`,

    /* ===== Hausrecht & Festnahme (BGB + StGB + StPO) ===== */
    'bgb-hausrecht': `
      <svg viewBox="0 0 720 460" xmlns="http://www.w3.org/2000/svg" class="ges-vis">
        <rect width="720" height="460" fill="#0a0f1a"/>
        <text x="360" y="30" text-anchor="middle" font-size="16" fill="#fbbf24" font-weight="900">Hausrecht & Festnahme · Rechtsgrundlagen-Karte</text>
        <text x="360" y="50" text-anchor="middle" font-size="11" fill="#94a3b8">BGB · StGB · StPO im Zusammenspiel</text>

        <!-- Eigentümer/Besitzer-Kreis -->
        <g>
          <circle cx="170" cy="170" r="80" fill="rgba(8,145,178,.15)" stroke="#0891b2" stroke-width="2.5"/>
          <text x="170" y="155" text-anchor="middle" font-size="14" fill="#0891b2" font-weight="900">EIGENTÜMER /</text>
          <text x="170" y="175" text-anchor="middle" font-size="14" fill="#0891b2" font-weight="900">BESITZER</text>
          <text x="170" y="200" text-anchor="middle" font-size="10" fill="#94a3b8">§ 903 BGB · § 854 BGB</text>
        </g>

        <!-- Sicherheitsmitarbeiter-Kreis -->
        <g>
          <circle cx="550" cy="170" r="80" fill="rgba(34,211,238,.15)" stroke="#22d3ee" stroke-width="2.5"/>
          <text x="550" y="155" text-anchor="middle" font-size="14" fill="#22d3ee" font-weight="900">SICHERHEITS-</text>
          <text x="550" y="175" text-anchor="middle" font-size="14" fill="#22d3ee" font-weight="900">MITARBEITER</text>
          <text x="550" y="200" text-anchor="middle" font-size="10" fill="#94a3b8">§ 855 BGB · Besitzdiener</text>
        </g>

        <!-- Verbindung: Dienstvertrag -->
        <line x1="250" y1="170" x2="470" y2="170" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6 4"/>
        <rect x="290" y="155" width="140" height="30" rx="4" fill="#0a0f1a" stroke="#fbbf24"/>
        <text x="360" y="174" text-anchor="middle" font-size="11" fill="#fbbf24" font-weight="800">§ 611 BGB Dienstvertrag</text>

        <!-- Befugnisse-Boxen -->
        <g>
          <text x="360" y="285" text-anchor="middle" font-size="13" fill="#22c55e" font-weight="900">↓ ÜBERTRAGENE BEFUGNISSE ↓</text>
        </g>

        ${[
          {x:40,  ti:'Hausverbot',      g:'§ 1004 BGB',        beschreibung:'aussprechen + durchsetzen', col:'#22c55e'},
          {x:200, ti:'Besitzwehr',      g:'§ 859 I BGB',       beschreibung:'aktive Verteidigung gegen Eindringen', col:'#22c55e'},
          {x:360, ti:'Besitzkehr',      g:'§ 859 II BGB',      beschreibung:'frische Tat: Sache zurückholen', col:'#22c55e'},
          {x:520, ti:'Selbsthilfe',     g:'§ 229 BGB',         beschreibung:'wenn obrigkeitl. Hilfe zu spät', col:'#fbbf24'},
        ].map(B => `
          <g>
            <rect x="${B.x}" y="305" width="160" height="80" rx="8" fill="#1e293b" stroke="${B.col}" stroke-width="2"/>
            <text x="${B.x+80}" y="328" text-anchor="middle" font-size="12" fill="${B.col}" font-weight="900">${B.ti}</text>
            <text x="${B.x+80}" y="346" text-anchor="middle" font-size="10" fill="#94a3b8" font-family="monospace">${B.g}</text>
            <foreignObject x="${B.x+8}" y="350" width="144" height="32">
              <div xmlns="http://www.w3.org/1999/xhtml" style="font:9.5px sans-serif;color:#cbd5e1;text-align:center;line-height:1.3">${B.beschreibung}</div>
            </foreignObject>
          </g>
        `).join('')}

        <!-- Festnahme-Sonderbox -->
        <rect x="40" y="400" width="640" height="50" rx="8" fill="rgba(239,68,68,.12)" stroke="#ef4444" stroke-width="2"/>
        <text x="60" y="421" font-size="11" fill="#ef4444" font-weight="900">⚠️ JEDERMANNS-FESTNAHME · § 127 I StPO:</text>
        <text x="60" y="440" font-size="10" fill="#cbd5e1">Bei frischer Tat + Fluchtgefahr ODER unbekannter Identität · NUR Festhalten bis Polizei kommt · sonst § 239 StGB Freiheitsberaubung!</text>
      </svg>`,

    /* ===== Strafmaß-Skala ===== */
    'stgb-strafmass': `
      <svg viewBox="0 0 720 360" xmlns="http://www.w3.org/2000/svg" class="ges-vis">
        <rect width="720" height="360" fill="#0a0f1a"/>
        <text x="360" y="30" text-anchor="middle" font-size="16" fill="#dc2626" font-weight="900">StGB · Strafmaß-Skala mit typischen Sicherheits-Delikten</text>
        <text x="360" y="50" text-anchor="middle" font-size="11" fill="#94a3b8">Geldstrafe (§ 40) bis lebenslange Freiheitsstrafe (§ 38)</text>

        <!-- Skala -->
        <line x1="60" y1="220" x2="680" y2="220" stroke="#475569" stroke-width="3"/>
        ${[
          {x:80,  col:'#94a3b8', label:'Geldstrafe', d:'5—360 Tagessätze', delikte:'§ 123 HF · § 185 Beleid.'},
          {x:200, col:'#22c55e', label:'bis 1 Jahr', d:'§ 38 II FS', delikte:'§ 123 · § 185 · § 241'},
          {x:320, col:'#fbbf24', label:'bis 5 Jahre', d:'mittlere Krim.', delikte:'§ 223 KV · § 240 Nötig. · § 242 Diebst.'},
          {x:450, col:'#fb923c', label:'bis 10 Jahre', d:'schwere Krim.', delikte:'§ 224 · § 243 · § 249 Raub'},
          {x:570, col:'#ef4444', label:'> 10 Jahre', d:'Verbrechen', delikte:'§ 212 Totschlag · § 226'},
          {x:670, col:'#7c2d12', label:'lebenslang', d:'§ 38 I StGB', delikte:'§ 211 Mord'},
        ].map(S => `
          <g>
            <line x1="${S.x}" y1="220" x2="${S.x}" y2="210" stroke="${S.col}" stroke-width="2"/>
            <rect x="${S.x-50}" y="90" width="100" height="115" rx="6" fill="#1e293b" stroke="${S.col}" stroke-width="2"/>
            <text x="${S.x}" y="115" text-anchor="middle" font-size="11" fill="${S.col}" font-weight="900">${S.label}</text>
            <text x="${S.x}" y="132" text-anchor="middle" font-size="9" fill="#94a3b8">${S.d}</text>
            <line x1="${S.x-40}" y1="140" x2="${S.x+40}" y2="140" stroke="#334155"/>
            <foreignObject x="${S.x-46}" y="145" width="92" height="55">
              <div xmlns="http://www.w3.org/1999/xhtml" style="font:9px sans-serif;color:#cbd5e1;text-align:center;line-height:1.4">${S.delikte}</div>
            </foreignObject>
            <!-- Marker -->
            <circle cx="${S.x}" cy="220" r="6" fill="${S.col}"/>
          </g>
        `).join('')}

        <text x="60" y="260" font-size="11" fill="#fbbf24" font-weight="700">Verbrechen (§ 12 I StGB):</text>
        <text x="200" y="260" font-size="11" fill="#cbd5e1">Mindestmaß ≥ 1 Jahr Freiheitsstrafe (Mord, Raub, schwere KV, Brandstiftung)</text>
        <text x="60" y="282" font-size="11" fill="#22c55e" font-weight="700">Vergehen (§ 12 II StGB):</text>
        <text x="200" y="282" font-size="11" fill="#cbd5e1">Mindestmaß &lt; 1 Jahr ODER nur Geldstrafe (HF, KV, Diebstahl, Nötigung)</text>

        <rect x="60" y="305" width="600" height="40" rx="6" fill="rgba(220,38,38,.12)" stroke="#dc2626"/>
        <text x="80" y="320" font-size="11" fill="#dc2626" font-weight="900">⚠️ Versuch beim Verbrechen IMMER strafbar (§ 23 I) — beim Vergehen nur wenn ausdrücklich (z. B. § 223 II KV)</text>
        <text x="80" y="338" font-size="10" fill="#cbd5e1">Beihilfe & Anstiftung (§§ 26, 27) ebenfalls strafbar — auch bloßes „Zuhalten der Tür" reicht!</text>
      </svg>`,

    /* ===== Jedermannsrechte · Gesamtübersicht ===== */
    'jedermannsrechte': `
      <svg viewBox="0 0 900 560" xmlns="http://www.w3.org/2000/svg" class="ges-vis">
        <defs>
          <linearGradient id="jr-bg" x2="0" y2="1"><stop offset="0" stop-color="#0b1424"/><stop offset="1" stop-color="#060a14"/></linearGradient>
        </defs>
        <rect width="900" height="560" fill="url(#jr-bg)"/>
        <text x="450" y="34" text-anchor="middle" font-size="18" fill="#22c55e" font-weight="900">✋ Die Jedermannsrechte im Überblick</text>
        <text x="450" y="56" text-anchor="middle" font-size="11.5" fill="#94a3b8">Rechte, die JEDER hat — die Basis aller Eingriffe im Sicherheitsdienst (keine Polizei-Befugnisse!)</text>

        <!-- Spalte 1: StGB (strafrechtlich) -->
        <g>
          <rect x="30" y="80" width="270" height="320" rx="12" fill="rgba(220,38,38,.08)" stroke="#dc2626" stroke-width="2"/>
          <rect x="30" y="80" width="270" height="34" rx="12" fill="#dc2626"/>
          <text x="165" y="103" text-anchor="middle" font-size="13" fill="#fff" font-weight="900">⚖️ StGB · strafrechtlich</text>
          <text x="165" y="130" text-anchor="middle" font-size="9.5" fill="#94a3b8">macht Eingriff straffrei</text>
          ${[
            {p:'§ 32', t:'Notwehr / Nothilfe', d:'Verteidigung gegen gegenwärtigen rechtswidrigen Angriff'},
            {p:'§ 34', t:'Rechtfertigender Notstand', d:'Gefahrenabwehr · geschütztes Interesse überwiegt wesentlich'},
            {p:'§ 35', t:'Entschuldigender Notstand', d:'Gefahr für Leben/Leib/Freiheit · keine Schuld'},
          ].map((r,i) => `
            <rect x="46" y="${145 + i*80}" width="238" height="68" rx="8" fill="#1e293b" stroke="#dc2626" stroke-width="1.2"/>
            <text x="58" y="${168 + i*80}" font-size="14" fill="#dc2626" font-weight="900" font-family="monospace">${r.p}</text>
            <text x="110" y="${168 + i*80}" font-size="12" fill="#fff" font-weight="800">${r.t}</text>
            <foreignObject x="58" y="${175 + i*80}" width="218" height="36">
              <div xmlns="http://www.w3.org/1999/xhtml" style="font:9.5px sans-serif;color:#cbd5e1;line-height:1.35">${r.d}</div>
            </foreignObject>
          `).join('')}
        </g>

        <!-- Spalte 2: BGB (zivilrechtlich) -->
        <g>
          <rect x="315" y="80" width="270" height="450" rx="12" fill="rgba(8,145,178,.08)" stroke="#0891b2" stroke-width="2"/>
          <rect x="315" y="80" width="270" height="34" rx="12" fill="#0891b2"/>
          <text x="450" y="103" text-anchor="middle" font-size="13" fill="#fff" font-weight="900">📘 BGB · zivilrechtlich</text>
          <text x="450" y="130" text-anchor="middle" font-size="9.5" fill="#94a3b8">macht Eingriff nicht widerrechtlich</text>
          ${[
            {p:'§ 227', t:'Notwehr', d:'zivilrechtl. Gegenstück zu § 32 StGB'},
            {p:'§ 228', t:'Defensiver Notstand', d:'Gefahr geht von der Sache aus (z. B. Hund)'},
            {p:'§ 229', t:'Selbsthilfe', d:'Wegnahme / Festhalten wenn Hilfe zu spät'},
            {p:'§ 230', t:'Grenzen der Selbsthilfe', d:'nur so weit wie nötig'},
            {p:'§ 859', t:'Besitzwehr / Besitzkehr', d:'Besitz verteidigen + auf frischer Tat zurückholen'},
            {p:'§ 860', t:'Recht des Besitzdieners', d:'Sicherheitsmitarbeiter darf § 859 ausüben!'},
            {p:'§ 904', t:'Aggressiver Notstand', d:'fremde Sache nutzen bei großer Gefahr'},
          ].map((r,i) => `
            <rect x="331" y="${142 + i*54}" width="238" height="46" rx="6" fill="#1e293b" stroke="#0891b2" stroke-width="1.2"/>
            <text x="343" y="${162 + i*54}" font-size="12" fill="#0891b2" font-weight="900" font-family="monospace">${r.p}</text>
            <text x="398" y="${162 + i*54}" font-size="11" fill="#fff" font-weight="800">${r.t}</text>
            <foreignObject x="343" y="${167 + i*54}" width="222" height="20">
              <div xmlns="http://www.w3.org/1999/xhtml" style="font:9px sans-serif;color:#cbd5e1;line-height:1.25">${r.d}</div>
            </foreignObject>
          `).join('')}
        </g>

        <!-- Spalte 3: StPO + Regeln -->
        <g>
          <rect x="600" y="80" width="270" height="200" rx="12" fill="rgba(168,85,247,.08)" stroke="#a855f7" stroke-width="2"/>
          <rect x="600" y="80" width="270" height="34" rx="12" fill="#a855f7"/>
          <text x="735" y="103" text-anchor="middle" font-size="13" fill="#fff" font-weight="900">🚓 StPO · Festnahme</text>
          <rect x="616" y="128" width="238" height="135" rx="8" fill="#1e293b" stroke="#a855f7" stroke-width="1.2"/>
          <text x="628" y="152" font-size="15" fill="#a855f7" font-weight="900" font-family="monospace">§ 127 I</text>
          <text x="700" y="152" font-size="12" fill="#fff" font-weight="800">Jedermann-Festnahme</text>
          <foreignObject x="628" y="160" width="214" height="98">
            <div xmlns="http://www.w3.org/1999/xhtml" style="font:10px sans-serif;color:#cbd5e1;line-height:1.45">Bei <b style="color:#fff">frischer Tat</b> + <b style="color:#fff">Fluchtgefahr</b> ODER <b style="color:#fff">unbekannter Identität</b> darf jeder den Täter <b style="color:#22c55e">vorläufig festhalten</b> — nur bis die Polizei kommt. Sonst: § 239 StGB Freiheitsberaubung!</div>
          </foreignObject>
        </g>

        <!-- Goldene Grenzen-Box -->
        <g>
          <rect x="600" y="295" width="270" height="235" rx="12" fill="rgba(251,191,36,.08)" stroke="#fbbf24" stroke-width="2"/>
          <text x="735" y="320" text-anchor="middle" font-size="13" fill="#fbbf24" font-weight="900">🛡️ Grenzen — immer!</text>
          ${[
            'Erforderlich: mildestes wirksames Mittel',
            'Verhältnismäßig: kein Übermaß',
            'Gegenwärtig: nur während Gefahr/Tat',
            'Keine Polizei-Befugnisse vortäuschen (§ 132)',
            'Sofort Polizei rufen + dokumentieren',
            'Verteidigung endet, wenn Angriff endet',
          ].map((t,i) => `
            <circle cx="620" cy="${346 + i*29}" r="3.5" fill="#fbbf24"/>
            <foreignObject x="632" y="${337 + i*29}" width="228" height="28">
              <div xmlns="http://www.w3.org/1999/xhtml" style="font:10px sans-serif;color:#fde68a;line-height:1.3">${t}</div>
            </foreignObject>
          `).join('')}
        </g>

        <!-- Verbindungs-Hinweis StGB+BGB -->
        <line x1="300" y1="240" x2="315" y2="240" stroke="#475569" stroke-width="1.5" stroke-dasharray="3 2"/>
        <text x="450" y="552" text-anchor="middle" font-size="10.5" fill="#22d3ee" font-weight="700">Merke: Notwehr gibt es doppelt — § 32 StGB (Strafe) UND § 227 BGB (Schadensersatz). Beide prüfen, ob du straffrei + haftungsfrei bleibst.</text>
      </svg>`,

    /* ===== Praxisfälle Sicherheitsdienst · 8 Szenarios ===== */
    'praxis-faelle': `
      <svg viewBox="0 0 900 720" xmlns="http://www.w3.org/2000/svg" class="ges-vis">
        <rect width="900" height="720" fill="#0a0f1a"/>
        <text x="450" y="30" text-anchor="middle" font-size="16" fill="#fbbf24" font-weight="900">8 Praxisfälle aus dem Sicherheitsdienst-Alltag</text>
        <text x="450" y="50" text-anchor="middle" font-size="11" fill="#94a3b8">Mit Rechtsgrundlage · richtigem Vorgehen · und typischen Fallstricken</text>

        ${[
          {
            x: 30, y: 80, col: '#22c55e', icon: '🚪',
            ti: '1 · Hausverbot durchsetzen',
            sit: 'Kunde mit Hausverbot betritt erneut das Geschäft.',
            tun: 'Klar identifizieren · Aufforderung zum Verlassen · 5 Min Frist · bei Weigerung: § 127 StPO Festhalten + Polizei rufen.',
            laws: ['§ 1004 BGB', '§ 123 StGB', '§ 127 StPO'],
          },
          {
            x: 460, y: 80, col: '#22c55e', icon: '🛍️',
            ti: '2 · Ladendieb gestellt',
            sit: 'Dieb verlässt mit Ware den Kassenbereich.',
            tun: 'Direkt nach Ausgang ansprechen („Ich bin Detektiv des Hauses") · ins Büro begleiten · Polizei rufen · Festhalten max. bis Übergabe.',
            laws: ['§ 242 StGB', '§ 229 BGB', '§ 127 StPO'],
          },
          {
            x: 30, y: 245, col: '#ef4444', icon: '🥊',
            ti: '3 · Angriff auf Wachperson',
            sit: 'Randalierer holt zum Schlag aus.',
            tun: 'Distanz schaffen · verbal deeskalieren · Schlag abwehren (Notwehr) · mildestes wirksames Mittel · sobald Angreifer am Boden: Festhalten, NICHT weiter schlagen.',
            laws: ['§ 32 StGB', '§ 227 BGB', '§ 33 (Exzess)'],
          },
          {
            x: 460, y: 245, col: '#ef4444', icon: '🚨',
            ti: '4 · Räuberischer Diebstahl',
            sit: 'Dieb schlägt nach Detektiv, um die Beute zu behalten.',
            tun: 'Jetzt liegt § 252 vor (Raub-Strafmaß!) · Notwehr-Recht entsteht zusätzlich · Festnahme rechtlich klar · Beweissicherung wichtig.',
            laws: ['§ 252 StGB', '§ 32 StGB', '§ 127 StPO'],
          },
          {
            x: 30, y: 410, col: '#fbbf24', icon: '🆘',
            ti: '5 · Bewusstlose Person',
            sit: 'Streifengänger findet zusammengebrochenen Mann.',
            tun: '112 wählen · stabile Seitenlage · Atmung prüfen · ggf. Reanimation · NICHT weggehen, NICHT „nicht mein Bereich".',
            laws: ['§ 323c StGB', '§ 34 StGB (Notstand)'],
          },
          {
            x: 460, y: 410, col: '#fbbf24', icon: '🐕',
            ti: '6 · Fremder Hund greift an',
            sit: 'Auf Werksgelände läuft knurrender Hund auf Mitarbeiter zu.',
            tun: 'Hund mit Schlagstock/Tritt abwehren ist erlaubt (Gefahr geht von der Sache aus) · Tier möglichst nicht töten · Halter ermitteln.',
            laws: ['§ 228 BGB', '§ 32 StGB (für Tier-Halter)'],
          },
          {
            x: 30, y: 575, col: '#a855f7', icon: '👮',
            ti: '7 · „Stehenbleiben! Polizei!"',
            sit: 'Wachmann ruft das einer fliehenden Person zu, um sie zu stoppen.',
            tun: 'STRAFBAR — § 132 StGB Amtsanmaßung! Richtig: „Werkschutz! Stehenbleiben, bitte ausweisen!" — Eigen-Identifikation klar.',
            laws: ['§ 132 StGB', '§ 19 BeWachV'],
          },
          {
            x: 460, y: 575, col: '#06b6d4', icon: '📹',
            ti: '8 · Tonaufnahme als „Beweis"',
            sit: 'Detektiv schaltet heimlich Diktiergerät an.',
            tun: 'STRAFBAR — § 201 StGB. Richtig: schriftliche Notiz, Zeugen, Videoaufnahme nach DSGVO mit Beschilderung.',
            laws: ['§ 201 StGB', 'DSGVO/BDSG'],
          },
        ].map(C => `
          <g>
            <rect x="${C.x}" y="${C.y}" width="410" height="150" rx="10" fill="#1e293b" stroke="${C.col}" stroke-width="2"/>
            <!-- Icon -->
            <text x="${C.x+30}" y="${C.y+45}" font-size="32">${C.icon}</text>
            <!-- Titel -->
            <text x="${C.x+70}" y="${C.y+30}" font-size="14" fill="${C.col}" font-weight="900">${C.ti}</text>
            <foreignObject x="${C.x+70}" y="${C.y+38}" width="330" height="32">
              <div xmlns="http://www.w3.org/1999/xhtml" style="font:10.5px sans-serif;color:#cbd5e1;line-height:1.4;font-style:italic">${C.sit}</div>
            </foreignObject>
            <!-- Vorgehen -->
            <rect x="${C.x+12}" y="${C.y+75}" width="386" height="50" rx="5" fill="#0a0f1a"/>
            <text x="${C.x+18}" y="${C.y+88}" font-size="9.5" fill="${C.col}" font-weight="800">▸ RICHTIGES VORGEHEN</text>
            <foreignObject x="${C.x+18}" y="${C.y+91}" width="378" height="36">
              <div xmlns="http://www.w3.org/1999/xhtml" style="font:10px sans-serif;color:#e2e8f0;line-height:1.45">${C.tun}</div>
            </foreignObject>
            <!-- Rechtsgrundlagen -->
            ${C.laws.map((l,i) => `
              <rect x="${C.x+12 + i*100}" y="${C.y+128}" width="92" height="16" rx="3" fill="${C.col}" opacity=".25" stroke="${C.col}" stroke-width="1"/>
              <text x="${C.x+58 + i*100}" y="${C.y+139}" text-anchor="middle" font-size="9" fill="${C.col}" font-weight="800" font-family="monospace">${l}</text>
            `).join('')}
          </g>
        `).join('')}

        <!-- Goldene Regel unten -->
        <rect x="30" y="690" width="840" height="22" rx="4" fill="rgba(251,191,36,.15)" stroke="#fbbf24"/>
        <text x="450" y="706" text-anchor="middle" font-size="11" fill="#fbbf24" font-weight="800">🛡️ GOLDENE REGEL: Sicherheitsdienst ≠ Polizei. Mildestes Mittel · Verhältnismäßigkeit · klare Eigen-Identifikation · sofort Polizei rufen · alles dokumentieren.</text>
      </svg>`,

    /* ===== Bestehende ===== */
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
