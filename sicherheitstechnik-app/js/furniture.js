/* Möbel-Bibliothek – Canvas-Rendering pro Zimmertyp.
   Jede Funktion zeichnet die Standard-Einrichtung in die übergebenen Raum-Grenzen. */

window.FURN = (() => {

  // Color palette for furniture (light, neutral, easy to read on dark/light theme)
  const P = {
    wood: '#8b6f47',
    woodLight: '#a88560',
    fabric: '#5a7a9a',
    fabricLight: '#7a98b8',
    porcelain: '#dbe9f3',
    metal: '#94a3c4',
    glass: 'rgba(56,189,248,.35)',
    plant: '#22c55e',
    line: 'rgba(255,255,255,.35)',
  };

  function strokeBox(ctx, x, y, w, h, fill, stroke) {
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w, h);
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.strokeRect(x + .5, y + .5, w - 1, h - 1);
    }
  }

  function label(ctx, x, y, text, fs = 9) {
    ctx.fillStyle = 'rgba(255,255,255,.45)';
    ctx.font = `${fs}px system-ui`;
    ctx.fillText(text, x, y);
  }

  /* ===== Renderers per room type =====
     Args: ctx, originX, originY (top-left of room in screen px),
           scale (px per meter), roomW (m), roomD (m), opts */

  function wohnzimmer(ctx, ox, oy, s, w, d) {
    // Sofa (4m long along south wall)
    const sofaW = Math.min(w - 1, 3.5);
    strokeBox(ctx, ox + 0.5*s, oy + d*s - 1.1*s, sofaW*s, 0.9*s, P.fabric, P.line);
    // Sofa cushions
    for (let i = 0; i < 3; i++) {
      strokeBox(ctx, ox + (0.6 + i*sofaW/3)*s, oy + d*s - 1.05*s, (sofaW/3 - 0.1)*s, 0.45*s, P.fabricLight, null);
    }
    // Coffee table
    strokeBox(ctx, ox + 1.2*s, oy + (d - 2.4)*s, 1.5*s, 0.7*s, P.wood, P.line);
    // TV stand (north wall)
    strokeBox(ctx, ox + 1.5*s, oy + 0.2*s, 2*s, 0.4*s, P.wood, P.line);
    strokeBox(ctx, ox + 1.7*s, oy + 0.05*s, 1.6*s, 0.1*s, '#000', P.line);
    // Armchair
    if (w > 4) strokeBox(ctx, ox + (w - 1.3)*s, oy + (d - 2.2)*s, 0.9*s, 0.9*s, P.fabric, P.line);
    label(ctx, ox + 0.5*s, oy + (d - 1.4)*s, 'Sofa');
  }

  function kueche(ctx, ox, oy, s, w, d) {
    // L-shaped kitchen counter along N + W
    strokeBox(ctx, ox + 0.1*s, oy + 0.1*s, (w - 0.2)*s, 0.6*s, P.metal, P.line);  // Top
    strokeBox(ctx, ox + 0.1*s, oy + 0.1*s, 0.6*s, (d - 2.2)*s, P.metal, P.line);  // Left
    // Stove top
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(ox + 1.5*s, oy + 0.15*s, 0.7*s, 0.5*s);
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(ox + (1.65 + (i%2)*0.4)*s, oy + (0.25 + Math.floor(i/2)*0.2)*s, 0.07*s, 0, Math.PI*2);
      ctx.fillStyle = '#444'; ctx.fill();
    }
    // Sink
    strokeBox(ctx, ox + 2.7*s, oy + 0.15*s, 0.7*s, 0.5*s, P.porcelain, P.line);
    ctx.beginPath();
    ctx.arc(ox + 3.05*s, oy + 0.4*s, 0.07*s, 0, Math.PI*2);
    ctx.fillStyle = P.metal; ctx.fill();
    // Fridge
    strokeBox(ctx, ox + 0.15*s, oy + (d - 2.5)*s, 0.7*s, 0.7*s, P.porcelain, P.line);
    label(ctx, ox + 0.2*s, oy + (d - 1.8)*s, 'Kühlschrank', 8);
    // Dining table
    if (w > 3.5 && d > 4) {
      const tx = ox + (w - 1.8)*s, ty = oy + (d - 2.2)*s;
      strokeBox(ctx, tx, ty, 1.4*s, 0.8*s, P.wood, P.line);
      // 4 chairs (small squares)
      strokeBox(ctx, tx - 0.4*s, ty + 0.05*s, 0.3*s, 0.3*s, P.woodLight, null);
      strokeBox(ctx, tx - 0.4*s, ty + 0.45*s, 0.3*s, 0.3*s, P.woodLight, null);
      strokeBox(ctx, tx + 1.5*s, ty + 0.05*s, 0.3*s, 0.3*s, P.woodLight, null);
      strokeBox(ctx, tx + 1.5*s, ty + 0.45*s, 0.3*s, 0.3*s, P.woodLight, null);
    }
  }

  function bad(ctx, ox, oy, s, w, d) {
    // Bathtub
    strokeBox(ctx, ox + 0.2*s, oy + 0.2*s, 1.7*s, 0.7*s, P.porcelain, P.line);
    ctx.fillStyle = P.glass;
    ctx.fillRect(ox + 0.25*s, oy + 0.25*s, 1.6*s, 0.6*s);
    label(ctx, ox + 0.6*s, oy + 0.6*s, 'Wanne', 8);
    // Toilet
    strokeBox(ctx, ox + (w - 0.7)*s, oy + 0.3*s, 0.4*s, 0.6*s, P.porcelain, P.line);
    ctx.fillStyle = P.porcelain;
    ctx.beginPath();
    ctx.ellipse(ox + (w - 0.5)*s, oy + 0.75*s, 0.18*s, 0.22*s, 0, 0, Math.PI*2);
    ctx.fill();
    if (w > 1.5) label(ctx, ox + (w - 0.75)*s, oy + 1.15*s, 'WC', 8);
    // Sink
    strokeBox(ctx, ox + 0.3*s, oy + (d - 0.9)*s, 0.7*s, 0.5*s, P.porcelain, P.line);
    label(ctx, ox + 0.4*s, oy + (d - 0.45)*s, 'WB', 8);
    // Shower
    if (w > 2.5) {
      strokeBox(ctx, ox + (w - 1.3)*s, oy + (d - 1.3)*s, 1.1*s, 1.1*s, 'rgba(56,189,248,.08)', P.line);
      ctx.strokeStyle = P.line;
      ctx.beginPath();
      ctx.moveTo(ox + (w - 1.3)*s, oy + (d - 1.3)*s);
      ctx.lineTo(ox + (w - 0.2)*s, oy + (d - 0.2)*s);
      ctx.stroke();
      label(ctx, ox + (w - 1.1)*s, oy + (d - 0.5)*s, 'Dusche', 8);
    }
  }

  function schlaf(ctx, ox, oy, s, w, d) {
    // Bed (2x1.6m, double)
    const bedW = Math.min(2, w - 1), bedD = Math.min(2, d - 1.5);
    const bx = ox + 0.5*s, by = oy + 0.5*s;
    strokeBox(ctx, bx, by, bedW*s, bedD*s, P.fabric, P.line);
    // Pillows
    strokeBox(ctx, bx + 0.05*s, by + 0.05*s, (bedW/2 - 0.1)*s, 0.35*s, P.porcelain, P.line);
    strokeBox(ctx, bx + (bedW/2 + 0.05)*s, by + 0.05*s, (bedW/2 - 0.1)*s, 0.35*s, P.porcelain, P.line);
    // Blanket fold line
    ctx.strokeStyle = P.line;
    ctx.beginPath();
    ctx.moveTo(bx, by + bedD*0.55*s);
    ctx.lineTo(bx + bedW*s, by + bedD*0.55*s);
    ctx.stroke();
    // Nightstands
    strokeBox(ctx, bx - 0.45*s, by + 0.1*s, 0.4*s, 0.4*s, P.wood, P.line);
    strokeBox(ctx, bx + bedW*s + 0.05*s, by + 0.1*s, 0.4*s, 0.4*s, P.wood, P.line);
    label(ctx, bx + 0.1*s, by + bedD*0.85*s, 'Bett');
    // Wardrobe along one wall
    if (d > 4) strokeBox(ctx, ox + 0.2*s, oy + (d - 0.7)*s, (w - 0.4)*s, 0.6*s, P.wood, P.line);
  }

  function kind(ctx, ox, oy, s, w, d) {
    // Single bed
    strokeBox(ctx, ox + 0.4*s, oy + 0.5*s, 0.9*s, 2*s, P.fabricLight, P.line);
    strokeBox(ctx, ox + 0.45*s, oy + 0.55*s, 0.8*s, 0.3*s, P.porcelain, P.line);
    label(ctx, ox + 0.45*s, oy + 1.5*s, 'Bett', 8);
    // Desk
    strokeBox(ctx, ox + (w - 1.5)*s, oy + 0.3*s, 1.2*s, 0.6*s, P.wood, P.line);
    // Chair
    strokeBox(ctx, ox + (w - 1.0)*s, oy + 0.95*s, 0.4*s, 0.4*s, P.metal, null);
    label(ctx, ox + (w - 1.3)*s, oy + 0.8*s, 'Schreibtisch', 8);
    // Shelf
    if (d > 4) strokeBox(ctx, ox + 0.2*s, oy + (d - 0.5)*s, (w - 0.4)*s, 0.4*s, P.wood, P.line);
  }

  function buero(ctx, ox, oy, s, w, d) {
    // L-Desk
    strokeBox(ctx, ox + 0.3*s, oy + 0.3*s, 1.6*s, 0.7*s, P.wood, P.line);
    strokeBox(ctx, ox + 0.3*s, oy + 1.0*s, 0.7*s, 1.2*s, P.wood, P.line);
    // Office chair
    ctx.fillStyle = P.fabric;
    ctx.beginPath(); ctx.arc(ox + 1.4*s, oy + 1.2*s, 0.25*s, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = P.line; ctx.stroke();
    // Bookshelf (north wall)
    if (w > 3) strokeBox(ctx, ox + 2.2*s, oy + 0.2*s, (w - 2.4)*s, 0.4*s, P.wood, P.line);
    // Filing cabinet
    if (d > 3.5) strokeBox(ctx, ox + (w - 0.6)*s, oy + (d - 1.5)*s, 0.5*s, 1.0*s, P.metal, P.line);
    label(ctx, ox + 0.4*s, oy + 1.5*s, 'Schreibtisch', 8);
  }

  function flur(ctx, ox, oy, s, w, d) {
    // Wardrobe / coat rack
    strokeBox(ctx, ox + 0.1*s, oy + 0.1*s, (w - 0.2)*s, 0.3*s, P.wood, P.line);
    // Shoes
    for (let i = 0; i < 4 && i*0.3 + 0.2 < w - 0.4; i++) {
      strokeBox(ctx, ox + (0.2 + i*0.3)*s, oy + 0.5*s, 0.2*s, 0.15*s, P.wood, null);
    }
    label(ctx, ox + 0.2*s, oy + 0.9*s, 'Flur', 9);
  }

  function dachboden(ctx, ox, oy, s, w, d) {
    // Some storage boxes
    for (let i = 0; i < 4; i++) {
      strokeBox(ctx, ox + (0.5 + i*1.5)*s, oy + 0.5*s, 1*s, 1*s, P.wood, P.line);
    }
    strokeBox(ctx, ox + 0.5*s, oy + (d - 1.5)*s, 2*s, 1*s, P.wood, P.line);
    label(ctx, ox + 0.5*s, oy + (d - 0.3)*s, 'Lagerung', 9);
  }

  // Map room names → renderer
  const MAP = {
    'Wohnen': wohnzimmer, 'Wohnzimmer': wohnzimmer, 'Wohnen·Essen': wohnzimmer,
    'Küche': kueche, 'Kueche': kueche,
    'Bad': bad, 'Bad/Schlaf': bad,
    'Schlaf': schlaf, 'Schlafen': schlaf, 'Schlafzimmer': schlaf,
    'Kind': kind, 'Kind 1': kind, 'Kind 2': kind, 'Kinderzimmer': kind,
    'Büro': buero, 'Buero': buero, 'Arbeitszimmer': buero,
    'Flur': flur, 'Diele': flur, 'Eingang': flur,
    'Dachboden': dachboden, 'Speicher': dachboden,
  };

  function render(ctx, name, ox, oy, scale, w, d) {
    const fn = MAP[name];
    if (fn) fn(ctx, ox, oy, scale, w, d);
  }

  return { render, MAP };
})();
