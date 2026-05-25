/* Sachkunde §34a – Prüfungstrainer. Übungs- & Prüfungsmodus, Kategorien,
   Sofort-Erklärungen, Auswertung mit Bestehensgrenze. window.PRUEFUNG.view(). */
window.PRUEFUNG = (() => {
  const { el } = U;

  const CATS = {
    recht: 'Recht der öffentl. Sicherheit',
    datenschutz: 'Datenschutz',
    bgb: 'BGB · Haftung',
    strafrecht: 'Straf-/Verfahrensrecht + Waffen',
    uvv: 'UVV / Arbeitsschutz',
    umgang: 'Umgang mit Menschen · Erste Hilfe',
    technik: 'Sicherheitstechnik',
  };

  const Q = [
    { c: 'recht', q: 'Wie viele Unterrichtsstunden umfasst die Unterrichtung nach § 34a GewO?', o: ['24 Stunden', '40 Stunden', '80 Stunden', '120 Stunden'], k: 1, e: 'Die Unterrichtung dauert 40 Unterrichtsstunden (à 45 Min).' },
    { c: 'recht', q: 'Wie hoch ist die gesetzliche Mindestversicherung für Personenschäden?', o: ['100.000 €', '250.000 €', '1.000.000 €', '5.000.000 €'], k: 2, e: 'Haftpflicht: 1.000.000 € für Personenschäden, 250.000 € für Sachschäden.' },
    { c: 'recht', q: 'Wer nimmt die Sachkundeprüfung nach § 34a ab?', o: ['Die Polizei', 'Das Gewerbeamt', 'Die IHK', 'Der Arbeitgeber'], k: 2, e: 'Die Industrie- und Handelskammer (IHK) führt Unterrichtung und Sachkundeprüfung durch.' },
    { c: 'recht', q: 'Bevor eine Wachperson eingesetzt werden darf, muss sie …', o: ['einen Waffenschein haben', 'im Bewacherregister angemeldet sein', 'Mitglied einer Gewerkschaft sein', 'eine Uniform besitzen'], k: 1, e: 'Die Anmeldung im Bewacherregister (mit Zuverlässigkeitsprüfung) ist vor der Beschäftigung Pflicht.' },
    { c: 'recht', q: 'Welche Tätigkeit erfordert zwingend die Sachkundeprüfung (nicht nur Unterrichtung)?', o: ['Pförtnerdienst', 'Türsteher (Diskothek)', 'Streifengang im Werk', 'Empfangsdienst'], k: 1, e: 'Türsteher, Schutz von Asylunterkünften/Großveranstaltungen und Ladendetektive brauchen die Sachkundeprüfung.' },

    { c: 'datenschutz', q: 'Was bedeutet der Grundsatz der „Datenminimierung" (DSGVO)?', o: ['So viele Daten wie möglich sammeln', 'Nur die wirklich erforderlichen Daten erheben', 'Daten nie löschen', 'Daten immer verschlüsseln'], k: 1, e: 'Es dürfen nur die für den Zweck nötigen personenbezogenen Daten erhoben werden.' },
    { c: 'datenschutz', q: 'Videoüberwachung muss …', o: ['heimlich erfolgen', 'durch ein Hinweisschild kenntlich gemacht werden', 'nur nachts laufen', 'von der Polizei genehmigt sein'], k: 1, e: 'Auf Videoüberwachung ist durch deutlich sichtbare Hinweisschilder hinzuweisen (Transparenz).' },
    { c: 'datenschutz', q: 'Personenbezogene Daten sind …', o: ['nur Name und Adresse', 'alle Infos über eine bestimmbare Person', 'nur Gesundheitsdaten', 'ausschließlich Fotos'], k: 1, e: 'Personenbezogen = alle Informationen, die sich auf eine identifizierte oder identifizierbare Person beziehen.' },

    { c: 'bgb', q: 'Was erlaubt das Hausrecht dem Sicherheitsmitarbeiter (im Auftrag des Inhabers)?', o: ['Personen festnehmen und vernehmen', 'Personen den Zutritt verwehren oder des Platzes verweisen', 'Strafen verhängen', 'Waffen einziehen'], k: 1, e: 'Über das Hausrecht (BGB) kann Zutritt verweigert und ein Platzverweis ausgesprochen werden – nicht mehr.' },
    { c: 'bgb', q: 'Der Sicherheitsmitarbeiter übt die tatsächliche Gewalt über eine Sache für den Inhaber aus. Er ist …', o: ['Eigentümer', 'Besitzdiener', 'Mieter', 'Treuhänder'], k: 1, e: 'Als Besitzdiener (§ 855 BGB) übt er den Besitz für den Inhaber des Hausrechts aus.' },
    { c: 'bgb', q: 'Wer schuldhaft rechtswidrig einen Schaden verursacht, haftet nach …', o: ['§ 32 StGB', '§ 823 BGB', '§ 127 StPO', '§ 123 StGB'], k: 1, e: '§ 823 BGB (unerlaubte Handlung) regelt den Schadensersatz bei schuldhafter Rechtsverletzung.' },

    { c: 'strafrecht', q: 'In welchem Paragraphen ist die Notwehr geregelt?', o: ['§ 32 StGB', '§ 127 StPO', '§ 859 BGB', '§ 34a GewO'], k: 0, e: 'Notwehr ist in § 32 StGB geregelt: Verteidigung gegen einen gegenwärtigen rechtswidrigen Angriff.' },
    { c: 'strafrecht', q: 'Eine Notwehrhandlung muss sein …', o: ['beliebig hart', 'erforderlich und geboten', 'immer mit der Polizei abgesprochen', 'verhältnislos'], k: 1, e: 'Die Verteidigung muss erforderlich (mildestes wirksames Mittel) und geboten sein.' },
    { c: 'strafrecht', q: 'Nothilfe bedeutet …', o: ['Notwehr zugunsten einer anderen Person', 'Hilfe nur für sich selbst', 'einen Notruf absetzen', 'Erste Hilfe leisten'], k: 0, e: 'Nothilfe ist Notwehr, die man zugunsten eines angegriffenen Dritten leistet (§ 32 StGB).' },
    { c: 'strafrecht', q: 'Worauf stützt sich die vorläufige Festnahme durch „Jedermann"?', o: ['§ 127 StPO', '§ 32 StGB', '§ 823 BGB', 'Hausrecht'], k: 0, e: '§ 127 Abs. 1 StPO: Festnahme auf frischer Tat, wenn Flucht- oder Identitätszweifel bestehen.' },
    { c: 'strafrecht', q: 'Was darf ein Sicherheitsmitarbeiter nach einer Festnahme NICHT tun?', o: ['Die Polizei rufen', 'Die Person vernehmen/verhören', 'Die Identität sichern', 'Die Person festhalten bis Polizei kommt'], k: 1, e: 'Vernehmen/Verhören ist Sache der Polizei. Man sichert nur und übergibt der Polizei.' },
    { c: 'strafrecht', q: 'Das unbefugte Eindringen/Verweilen in einer Wohnung oder Geschäft ist …', o: ['Nötigung § 240', 'Hausfriedensbruch § 123 StGB', 'Diebstahl § 242', 'Sachbeschädigung § 303'], k: 1, e: 'Hausfriedensbruch ist in § 123 StGB geregelt.' },
    { c: 'strafrecht', q: 'Pfefferspray darf gegen einen Menschen eingesetzt werden …', o: ['jederzeit', 'nur in Notwehr/Nothilfe', 'zur Bestrafung', 'auf Zuruf des Chefs'], k: 1, e: 'Der Einsatz gegen Personen ist nur in einer Notwehr-/Nothilfelage gerechtfertigt.' },

    { c: 'uvv', q: 'Wie oft muss die Unterweisung nach DGUV V1 mindestens erfolgen?', o: ['einmalig', 'jährlich', 'alle 5 Jahre', 'nur bei Unfällen'], k: 1, e: 'Unterweisung mindestens jährlich (§ 4 DGUV V1), bei Bedarf öfter.' },
    { c: 'uvv', q: 'Wie viel Prozent der Beschäftigten müssen mindestens Ersthelfer sein (Verwaltung)?', o: ['1 %', '5 %', '10 %', '25 %'], k: 2, e: 'In Verwaltungs-/Handelsbetrieben mind. 10 % (sonst i.d.R. 5 % bzw. mehr).' },
    { c: 'uvv', q: 'Wofür steht „PSA"?', o: ['Privater Sicherheits-Ausweis', 'Persönliche Schutzausrüstung', 'Polizei-Sonder-Aufgabe', 'Personen-Schutz-Aktion'], k: 1, e: 'PSA = Persönliche Schutzausrüstung (Helm, Handschuhe, Warnweste …).' },
    { c: 'uvv', q: 'Welche Farbe haben Gebotszeichen (z. B. „Schutzhelm tragen")?', o: ['Rot', 'Gelb', 'Blau', 'Grün'], k: 2, e: 'Gebotszeichen sind blau (rund). Verbot = rot, Warnung = gelb, Rettung = grün.' },

    { c: 'umgang', q: 'Womit beginnt richtige Deeskalation?', o: ['Mit körperlicher Gewalt', 'Mit ruhiger, sachlicher Kommunikation', 'Mit dem Ziehen des Pfeffersprays', 'Mit Drohungen'], k: 1, e: 'Deeskalation setzt zuerst auf Distanz, ruhige Sprache und Zuhören – Gewalt ist letztes Mittel.' },
    { c: 'umgang', q: 'Die stabile Seitenlage wird angewendet bei einer Person, die …', o: ['ansprechbar ist', 'bewusstlos ist und normal atmet', 'nicht atmet', 'blutet'], k: 1, e: 'Bewusstlos + Atmung vorhanden → stabile Seitenlage (Atemwege frei). Kein Atem → Reanimation.' },
    { c: 'umgang', q: 'Welche Notrufnummer erreicht Feuerwehr und Rettungsdienst?', o: ['110', '112', '116117', '115'], k: 1, e: '112 = Feuerwehr/Rettungsdienst (europaweit). 110 = Polizei.' },
    { c: 'umgang', q: 'Was gehört NICHT zu den „W-Fragen" des Notrufs?', o: ['Wo ist es passiert?', 'Was ist passiert?', 'Wer ist schuld?', 'Wie viele Verletzte?'], k: 2, e: 'Wo · Was · Wie viele · Welche Verletzungen · Warten auf Rückfragen. „Schuld" ist irrelevant.' },
    { c: 'umgang', q: 'Oberste Regel bei jedem Einsatz ist …', o: ['Eigenschutz / eigene Sicherheit zuerst', 'den Täter um jeden Preis stellen', 'Selfies als Beweis machen', 'sofort eingreifen'], k: 0, e: 'Eigenschutz geht vor – ein verletzter Helfer kann niemandem mehr helfen.' },

    { c: 'technik', q: 'Ein PIR-Bewegungsmelder reagiert auf …', o: ['Geräusche', 'Wärmestrahlung (Infrarot) bewegter Körper', 'Funkwellen', 'Erschütterung'], k: 1, e: 'PIR = Passiv-Infrarot: erkennt Änderungen der Wärmestrahlung bei Bewegung.' },
    { c: 'technik', q: 'Ein Mikrowellen-Bewegungsmelder nutzt den …', o: ['Foto-Effekt', 'Doppler-Effekt', 'Treibhaus-Effekt', 'Hall-Effekt'], k: 1, e: 'Er sendet Mikrowellen und misst die Frequenzverschiebung (Doppler) bei Bewegung.' },
    { c: 'technik', q: 'Ein Reed-Kontakt wird typischerweise eingesetzt als …', o: ['Glasbruchmelder', 'Magnet-Öffnungsmelder an Tür/Fenster', 'Rauchmelder', 'Kameralinse'], k: 1, e: 'Der Reed-(Magnet-)Kontakt meldet das Öffnen von Türen/Fenstern.' },
    { c: 'technik', q: 'Ein akustischer Glasbruchmelder erkennt …', o: ['nur laute Geräusche', 'die Folge aus tieffrequentem Schlag und hochfrequentem Splittern', 'Temperatur', 'Funk'], k: 1, e: 'Er wertet die typische Zwei-Stufen-Sequenz aus – das vermeidet Fehlalarme.' },
    { c: 'technik', q: 'Welche Norm betrifft Einbruchmeldeanlagen?', o: ['DIN EN 50131', 'DIN EN 1627', 'ISO 9001', 'DSGVO'], k: 0, e: 'DIN EN 50131 normt Einbruch- und Überfallmeldeanlagen (Grade 1–4).' },
    { c: 'technik', q: 'Die RC-Klassen nach DIN EN 1627 bewerten …', o: ['die Bildauflösung von Kameras', 'die mechanische Einbruchhemmung', 'die Akkulaufzeit', 'die Funkreichweite'], k: 1, e: 'RC 1–6 (Resistance Class) bewerten den Widerstand von Türen/Fenstern gegen Einbruch.' },
    { c: 'technik', q: 'Was ist der höchste Grad einer EMA nach DIN EN 50131?', o: ['Grad 2', 'Grad 4', 'Grad 6', 'Grad 10'], k: 1, e: 'Grad 4 = höchstes Risiko (z. B. hohe Werte, geplante Täter mit Ausrüstung).' },
    { c: 'technik', q: 'Ein Dual-Melder kombiniert zwei Prinzipien, um …', o: ['mehr Strom zu sparen', 'Fehlalarme zu reduzieren', 'weiter zu sehen', 'lauter zu sein'], k: 1, e: 'PIR UND Mikrowelle müssen gleichzeitig auslösen – das senkt Fehlalarme deutlich.' },
  ];

  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }

  function view() {
    const root = el('div', { class: 'pr-view' });
    const host = el('div');
    let state = null;

    const intro = el('div', { class: 'phys-intro' });
    intro.innerHTML = `<span class="tag">Lernen · Prüfung</span>
      <h1>Sachkunde § 34a · Prüfungstrainer 🎓</h1>
      <p class="lead">${Q.length} Fragen aus allen Sachgebieten der Unterrichtung & Sachkundeprüfung.
      <b>Üben</b> mit Sofort-Erklärung oder <b>Prüfung</b> (20 Fragen, Bestehensgrenze 50 %).</p>`;

    function start(mode, cat) {
      let pool = cat === 'alle' ? Q : Q.filter(q => q.c === cat);
      pool = shuffle(pool);
      if (mode === 'pruefung') pool = pool.slice(0, Math.min(20, pool.length));
      state = { mode, pool, idx: 0, score: 0, answers: [] };
      renderQ();
    }

    function renderStart() {
      host.innerHTML = '';
      const c = el('div', { class: 'pr-card' });
      c.appendChild(el('h3', { text: 'Modus wählen' }));
      const modes = el('div', { class: 'pr-modes' });
      [['ueben', 'fa-dumbbell', 'Üben', 'Sofort-Erklärung nach jeder Frage'], ['pruefung', 'fa-stopwatch', 'Prüfung', '20 Fragen · 50 % zum Bestehen']].forEach(([m, ic, t, d]) => {
        const b = el('button', { class: 'pr-mode' }); b.innerHTML = `<i class="fas ${ic}"></i><div class="pr-mt">${t}</div><div class="pr-md">${d}</div>`;
        b.addEventListener('click', () => { c.dataset.mode = m; modes.querySelectorAll('.pr-mode').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); });
        modes.appendChild(b);
      });
      c.appendChild(modes);
      c.appendChild(el('h3', { text: 'Themengebiet', style: 'margin-top:16px' }));
      const cats = el('div', { class: 'pr-cats' });
      const all = ['alle', ...Object.keys(CATS)];
      all.forEach(k => { const n = k === 'alle' ? Q.length : Q.filter(q => q.c === k).length; const b = el('button', { class: 'pr-cat' + (k === 'alle' ? ' sel' : '') }); b.innerHTML = `${k === 'alle' ? 'Alle Themen' : CATS[k]} <em>${n}</em>`; b.addEventListener('click', () => { cats.querySelectorAll('.pr-cat').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); c.dataset.cat = k; }); cats.appendChild(b); });
      c.appendChild(cats);
      c.dataset.mode = 'ueben'; c.dataset.cat = 'alle'; modes.firstChild.classList.add('sel');
      const go = el('button', { class: 'btn primary pr-go', html: '<i class="fas fa-play"></i> Los geht\'s' });
      go.addEventListener('click', () => start(c.dataset.mode, c.dataset.cat));
      c.appendChild(go);
      host.appendChild(c);
    }

    function renderQ() {
      host.innerHTML = '';
      const q = state.pool[state.idx];
      const c = el('div', { class: 'pr-card' });
      const bar = el('div', { class: 'pr-bar' }); const fill = el('div', { class: 'pr-fill' }); fill.style.width = (state.idx / state.pool.length * 100) + '%'; bar.appendChild(fill); c.appendChild(bar);
      c.appendChild(el('div', { class: 'pr-meta' }, [el('span', { class: 'pr-tag', text: CATS[q.c] }), el('span', { text: `Frage ${state.idx + 1} / ${state.pool.length}` })]));
      c.appendChild(el('div', { class: 'pr-q', text: q.q }));
      const opts = el('div', { class: 'pr-opts' });
      const expl = el('div', { class: 'pr-expl', style: 'display:none' });
      const next = el('button', { class: 'btn primary pr-next', html: 'Weiter <i class="fas fa-arrow-right"></i>', style: 'display:none' });
      q.o.forEach((opt, i) => {
        const b = el('button', { class: 'pr-opt', text: opt });
        b.addEventListener('click', () => {
          if (c.dataset.done) return; c.dataset.done = '1';
          const right = i === q.k; if (right) state.score++;
          state.answers.push({ q, picked: i, right });
          if (state.mode === 'ueben') {
            opts.querySelectorAll('.pr-opt').forEach((x, xi) => { x.classList.add('lock'); if (xi === q.k) x.classList.add('correct'); }); if (!right) b.classList.add('wrong');
            expl.innerHTML = (right ? '<b style="color:#22c55e">✓ Richtig!</b> ' : '<b style="color:#ef4444">✗ Falsch.</b> ') + q.e; expl.style.display = 'block'; next.style.display = 'inline-flex';
          } else { advance(); }
        });
        opts.appendChild(b);
      });
      next.addEventListener('click', advance);
      c.append(opts, expl, next); host.appendChild(c);
    }
    function advance() { state.idx++; if (state.idx >= state.pool.length) renderResult(); else renderQ(); }

    function renderResult() {
      host.innerHTML = '';
      const pct = Math.round(state.score / state.pool.length * 100); const pass = pct >= 50;
      const c = el('div', { class: 'pr-card pr-result' });
      c.innerHTML = `<div class="pr-score ${pass ? 'pass' : 'fail'}">${pct}%</div>
        <div class="pr-verdict ${pass ? 'pass' : 'fail'}">${pass ? '✓ Bestanden' : '✗ Nicht bestanden'} · ${state.score} / ${state.pool.length} richtig</div>`;
      const wrong = state.answers.filter(a => !a.right);
      if (wrong.length) { const w = el('div', { class: 'pr-wrong' }); w.appendChild(el('div', { class: 'pr-wh', text: 'Das solltest du dir nochmal ansehen:' })); wrong.forEach(a => { const it = el('div', { class: 'pr-wrong-item' }); it.innerHTML = `<div class="pr-wq">${a.q.q}</div><div class="pr-wa"><b style="color:#22c55e">${a.q.o[a.q.k]}</b> – ${a.q.e}</div>`; w.appendChild(it); }); c.appendChild(w); }
      const again = el('button', { class: 'btn primary', html: '<i class="fas fa-rotate-left"></i> Nochmal' }); again.addEventListener('click', renderStart);
      c.appendChild(again); host.appendChild(c);
    }

    root.append(intro, host); renderStart();
    return root;
  }
  return { view };
})();
