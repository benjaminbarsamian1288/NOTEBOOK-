/* BHE-Sicherheitstechnik-Planungssymbole
   Genormte Symbole nach BHE / DIN für Sicherheitstechnik-Planungen.
   Werden auf dem Canvas gezeichnet als professionelle Pläne. */

window.BHE_SYMBOLS = (() => {

  /* Zeichnet das BHE-Symbol für einen Sensor-Typ an Position (x,y) im Canvas-Context.
     size = Symbolgröße (Standard 24px). */
  function draw(ctx, sensorId, x, y, size, color, opts) {
    opts = opts || {};
    const s = size / 2;  // halber Symbolradius
    ctx.save();
    ctx.lineWidth = Math.max(1.5, size/14);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.font = `bold ${Math.round(size*0.42)}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    switch(sensorId) {
      case 'pir':
      case 'pir-standard':
      case 'pir-vorhang':
      case 'pir-decke':
      case 'pir-longrange':
      case 'pir-tierimmun':
      case 'pir-antimask':
      case 'pir-outdoor': {
        // BHE: Halbkreis nach unten, Punkt innen, Text "BM"
        // Box als Hintergrund
        roundedRect(ctx, x-s, y-s, size, size, size*0.15, true);
        ctx.fillStyle = 'white';
        ctx.fillText('BM', x, y - size*0.05);
        // Erfassungs-Halbkreis
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(x, y + size*0.35, size*0.45, Math.PI, 0);
        ctx.stroke();
        break;
      }
      case 'dual':
      case 'dualmelder': {
        // BM mit Doppelkreis
        roundedRect(ctx, x-s, y-s, size, size, size*0.15, true);
        ctx.fillStyle = 'white';
        ctx.fillText('BMD', x, y - size*0.05);
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(x, y + size*0.35, size*0.45, Math.PI, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y + size*0.35, size*0.30, Math.PI, 0);
        ctx.stroke();
        break;
      }
      case 'mw':
      case 'mikrowelle': {
        // BM mit Wellenlinien (~)
        roundedRect(ctx, x-s, y-s, size, size, size*0.15, true);
        ctx.fillStyle = 'white';
        ctx.fillText('MW', x, y - size*0.05);
        ctx.strokeStyle = color;
        ctx.beginPath();
        const yy = y + size*0.30;
        ctx.moveTo(x - size*0.35, yy);
        ctx.bezierCurveTo(x - size*0.18, yy - size*0.15, x - size*0.06, yy + size*0.15, x + size*0.10, yy - size*0.10);
        ctx.bezierCurveTo(x + size*0.20, yy - size*0.05, x + size*0.30, yy + size*0.05, x + size*0.40, yy - size*0.10);
        ctx.stroke();
        break;
      }
      case 'us':
      case 'ultraschall': {
        roundedRect(ctx, x-s, y-s, size, size, size*0.15, true);
        ctx.fillStyle = 'white';
        ctx.fillText('US', x, y);
        break;
      }
      case 'mag':
      case 'magnetkontakt': {
        // BHE Magnetkontakt: rechteckig schmal mit "MK"
        const w = size*0.85, h = size*0.65;
        roundedRect(ctx, x-w/2, y-h/2, w, h, size*0.1, true);
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(size*0.36)}px system-ui`;
        ctx.fillText('MK', x, y);
        break;
      }
      case 'schliessblech': {
        // SK = Schließblechkontakt
        const w = size*0.85, h = size*0.65;
        roundedRect(ctx, x-w/2, y-h/2, w, h, size*0.1, true);
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(size*0.36)}px system-ui`;
        ctx.fillText('SK', x, y);
        break;
      }
      case 'glass':
      case 'glas-passiv':
      case 'glas-aktiv':
      case 'glas-piezo': {
        // BHE Glasbruch: Raute mit "GB"
        ctx.beginPath();
        ctx.moveTo(x, y - s);
        ctx.lineTo(x + s, y);
        ctx.lineTo(x, y + s);
        ctx.lineTo(x - s, y);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(size*0.34)}px system-ui`;
        ctx.fillText('GB', x, y);
        break;
      }
      case 'piezo-erschuetterung':
      case 'koerperschall':
      case 'seismisch': {
        // EM = Erschütterungsmelder
        roundedRect(ctx, x-s, y-s, size, size, size*0.15, true);
        ctx.fillStyle = 'white';
        ctx.fillText('EM', x, y);
        break;
      }
      case 'kapazitiv': {
        // KFM = Kapazitiver Feldmelder
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(size*0.30)}px system-ui`;
        ctx.fillText('KFM', x, y);
        break;
      }
      case 'fire':
      case 'rauch-streulicht': {
        // BHE Rauchmelder: Kreis mit kleinem Kreis innen
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x, y, s*0.45, 0, Math.PI*2);
        ctx.fill();
        // Center dot
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, s*0.18, 0, Math.PI*2);
        ctx.fill();
        break;
      }
      case 'waerme-max': {
        // WMM = Wärmemelder
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(size*0.34)}px system-ui`;
        ctx.fillText('WM', x, y);
        break;
      }
      case 'multisensor': {
        // MS = Multisensor Brand
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(size*0.32)}px system-ui`;
        ctx.fillText('MS', x, y);
        break;
      }
      case 'asd': {
        // ASD = Ansaugrauchmelder
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(size*0.30)}px system-ui`;
        ctx.fillText('ASD', x, y);
        break;
      }
      case 'flammenmelder': {
        // FL = Flammenmelder
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(size*0.34)}px system-ui`;
        ctx.fillText('FL', x, y);
        break;
      }
      case 'cam':
      case 'kamera': {
        // BHE Kamera: Trapez mit Quadrat (Linse)
        ctx.beginPath();
        ctx.moveTo(x - s, y - s*0.5);
        ctx.lineTo(x + s*0.4, y - s*0.5);
        ctx.lineTo(x + s, y);
        ctx.lineTo(x + s*0.4, y + s*0.5);
        ctx.lineTo(x - s, y + s*0.5);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(size*0.30)}px system-ui`;
        ctx.fillText('K', x - s*0.2, y);
        break;
      }
      case 'sirene': {
        // BHE Sirene: Sechseck mit "S"
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const ang = i * Math.PI / 3 - Math.PI/2;
          const px = x + Math.cos(ang) * s;
          const py = y + Math.sin(ang) * s;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(size*0.40)}px system-ui`;
        ctx.fillText('S', x, y);
        break;
      }
      case 'ir':
      case 'ir-schranke': {
        // BHE Lichtschranke: 2 Pfeile zueinander
        roundedRect(ctx, x-s, y-s*0.5, size, size, size*0.1, true);
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(size*0.30)}px system-ui`;
        ctx.fillText('LS', x, y);
        break;
      }
      case 'wassermelder': {
        roundedRect(ctx, x-s, y-s, size, size, size*0.15, true);
        ctx.fillStyle = 'white';
        ctx.fillText('WS', x, y);
        break;
      }
      case 'gasmelder': {
        roundedRect(ctx, x-s, y-s, size, size, size*0.15, true);
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(size*0.36)}px system-ui`;
        ctx.fillText('GAS', x, y);
        break;
      }
      case 'druckmatte': {
        // DM = Druckmatte
        roundedRect(ctx, x-s, y-s*0.6, size, size*1.2, size*0.1, true);
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(size*0.34)}px system-ui`;
        ctx.fillText('DM', x, y);
        break;
      }
      case 'thermalkam': {
        // Thermal Kamera = Kamera-Form mit "T"
        ctx.beginPath();
        ctx.moveTo(x - s, y - s*0.5);
        ctx.lineTo(x + s*0.4, y - s*0.5);
        ctx.lineTo(x + s, y);
        ctx.lineTo(x + s*0.4, y + s*0.5);
        ctx.lineTo(x - s, y + s*0.5);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(size*0.34)}px system-ui`;
        ctx.fillText('TK', x - s*0.15, y);
        break;
      }
      case 'radar': {
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(size*0.32)}px system-ui`;
        ctx.fillText('RAD', x, y);
        break;
      }
      case 'lidar': {
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(size*0.30)}px system-ui`;
        ctx.fillText('LDR', x, y);
        break;
      }
      case 'zaun-mikro':
      case 'zaun-fos': {
        // Zaunsensor: Rechteck mit "ZS"
        roundedRect(ctx, x-s, y-s*0.6, size, size*1.2, size*0.1, true);
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(size*0.34)}px system-ui`;
        ctx.fillText('ZS', x, y);
        break;
      }
      case 'erddruck': {
        // Erddruck (Geophon)
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(size*0.30)}px system-ui`;
        ctx.fillText('GEO', x, y);
        break;
      }
      case 'neigung': {
        roundedRect(ctx, x-s, y-s, size, size, size*0.15, true);
        ctx.fillStyle = 'white';
        ctx.fillText('NS', x, y);
        break;
      }
      // === Special detectors ===
      case 'alarmdraht-tapete': {
        roundedRect(ctx, x-s, y-s, size, size, size*0.15, true);
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(size*0.34)}px system-ui`;
        ctx.fillText('AT', x, y);
        break;
      }
      case 'alarmspinne': {
        roundedRect(ctx, x-s, y-s, size, size, size*0.15, true);
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(size*0.34)}px system-ui`;
        ctx.fillText('AS', x, y);
        break;
      }
      case 'alarmschlinge': {
        roundedRect(ctx, x-s, y-s, size, size, size*0.15, true);
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.round(size*0.34)}px system-ui`;
        ctx.fillText('SL', x, y);
        break;
      }
      default: {
        // Fallback: simple circle with question mark
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.fillText('?', x, y);
        break;
      }
    }

    // Optional: white outline for visibility
    if (opts.outline !== false) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = Math.max(1, size/22);
      // Outline depends on shape — we just stroke text contour as accent
    }
    ctx.restore();
  }

  function roundedRect(ctx, x, y, w, h, r, fill) {
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    if (fill) ctx.fill();
  }

  // Returns short BHE-code like 'BM', 'GB', 'MK', for the labels
  function getShortCode(sensorId) {
    const M = {
      pir:'BM', 'pir-standard':'BM', 'pir-vorhang':'BM-V', 'pir-decke':'BM-360',
      dual:'BMD', dualmelder:'BMD', mw:'MW', mikrowelle:'MW',
      us:'US', ultraschall:'US',
      mag:'MK', magnetkontakt:'MK', schliessblech:'SK',
      glass:'GB', 'glas-passiv':'GB', 'glas-aktiv':'GB-A', 'glas-piezo':'GB-P',
      'piezo-erschuetterung':'EM', 'koerperschall':'KSM', seismisch:'SEI',
      kapazitiv:'KFM',
      fire:'RM', 'rauch-streulicht':'RM', 'waerme-max':'WM',
      multisensor:'MS', asd:'ASD', flammenmelder:'FL',
      cam:'K', kamera:'K', sirene:'S',
      ir:'LS', 'ir-schranke':'LS',
      wassermelder:'WS', gasmelder:'GAS',
      druckmatte:'DM', thermalkam:'TK', radar:'RAD', lidar:'LDR',
      'zaun-mikro':'ZS', 'zaun-fos':'ZS-F', erddruck:'GEO', neigung:'NS',
    };
    return M[sensorId] || '?';
  }

  return { draw, getShortCode };
})();
