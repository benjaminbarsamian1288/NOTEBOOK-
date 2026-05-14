/* Pure-canvas charts – no external library */
window.CHARTS = (() => {

  function css(varname) {
    return getComputedStyle(document.documentElement).getPropertyValue(varname).trim();
  }
  const palette = ['#38bdf8','#818cf8','#c084fc','#f472b6','#fbbf24','#22d3ee','#22c55e','#fb7185','#a3e635','#06b6d4'];

  function setupCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.parentElement.clientWidth - 36;
    const ch = +canvas.getAttribute('height') || 320;
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    canvas.style.width = cw + 'px';
    canvas.style.height = ch + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { ctx, w: cw, h: ch };
  }

  function bar(canvas, data) {
    const { ctx, w, h } = setupCanvas(canvas);
    ctx.clearRect(0,0,w,h);
    const padL=44, padR=10, padT=14, padB=46;
    const innerW = w - padL - padR;
    const innerH = h - padT - padB;
    const max = Math.max(...data.map(d=>d.value));
    const bw = innerW / data.length * 0.7;
    const gap = innerW / data.length * 0.3;
    const text = css('--text-dim');
    // Grid
    ctx.strokeStyle = css('--border-soft');
    ctx.lineWidth = 1;
    ctx.fillStyle = text;
    ctx.font = '11px system-ui';
    for (let i=0;i<=4;i++) {
      const y = padT + innerH*i/4;
      ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(padL+innerW,y); ctx.stroke();
      ctx.fillText(String(Math.round(max-max*i/4)), 6, y+4);
    }
    data.forEach((d,i) => {
      const x = padL + i*(bw+gap) + gap/2;
      const bh = innerH * d.value/max;
      const grd = ctx.createLinearGradient(0, padT, 0, padT+innerH);
      grd.addColorStop(0, palette[i % palette.length]);
      grd.addColorStop(1, palette[i % palette.length]+'55');
      ctx.fillStyle = grd;
      ctx.beginPath();
      const r = 6;
      const yT = padT+innerH-bh;
      ctx.moveTo(x, yT+r);
      ctx.arcTo(x, yT, x+r, yT, r);
      ctx.lineTo(x+bw-r, yT);
      ctx.arcTo(x+bw, yT, x+bw, yT+r, r);
      ctx.lineTo(x+bw, padT+innerH);
      ctx.lineTo(x, padT+innerH);
      ctx.closePath(); ctx.fill();
      // Label
      ctx.fillStyle = text;
      ctx.font = '11px system-ui';
      const lbl = d.label.length > 14 ? d.label.slice(0,12)+'…' : d.label;
      ctx.save();
      ctx.translate(x+bw/2, padT+innerH+8);
      ctx.rotate(-0.3);
      ctx.textAlign='right';
      ctx.fillText(lbl, 0, 12);
      ctx.restore();
      ctx.fillStyle = css('--text');
      ctx.font = 'bold 11px system-ui';
      ctx.textAlign='center';
      ctx.fillText(String(d.value), x+bw/2, yT-4);
    });
  }

  function priceBars(canvas, kategorien) {
    const { ctx, w, h } = setupCanvas(canvas);
    ctx.clearRect(0,0,w,h);
    const padL=60, padR=20, padT=14, padB=46;
    const innerW = w - padL - padR;
    const innerH = h - padT - padB;
    const max = Math.max(...kategorien.map(k=>k.max));
    // log-ish: use power scale
    const scale = v => Math.pow(v/max, 0.6) * innerH;
    const bw = innerW / kategorien.length * 0.65;
    const gap = innerW / kategorien.length * 0.35;
    const text = css('--text-dim');
    ctx.strokeStyle = css('--border-soft');
    ctx.fillStyle = text;
    ctx.font = '11px system-ui';
    for (let i=0;i<=4;i++) {
      const y = padT + innerH - innerH*i/4;
      ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(padL+innerW,y); ctx.stroke();
      const val = Math.round(Math.pow(i/4, 1/0.6)*max);
      ctx.fillText((val>=1000?(val/1000).toFixed(1)+'k':String(val))+' €', 6, y+4);
    }
    kategorien.forEach((k,i) => {
      const x = padL + i*(bw+gap) + gap/2;
      const yMin = padT+innerH-scale(k.min);
      const yMax = padT+innerH-scale(k.max);
      const yAvg = padT+innerH-scale(k.avg);
      // min-max bar
      const grd = ctx.createLinearGradient(0, yMax, 0, yMin);
      grd.addColorStop(0, palette[i % palette.length]);
      grd.addColorStop(1, palette[i % palette.length]+'55');
      ctx.fillStyle = grd;
      ctx.fillRect(x, yMax, bw, yMin - yMax);
      // avg marker
      ctx.fillStyle = css('--text');
      ctx.fillRect(x-2, yAvg-1, bw+4, 2);
      // label
      ctx.fillStyle = text;
      ctx.font = '11px system-ui';
      ctx.save();
      ctx.translate(x+bw/2, padT+innerH+8);
      ctx.rotate(-0.3); ctx.textAlign='right';
      ctx.fillText(k.kategorie, 0, 12);
      ctx.restore();
    });
    // legend
    ctx.fillStyle = text;
    ctx.font = '11px system-ui';
    ctx.fillText('Min–Max Bereich | Ø-Marker', padL, padT-2);
  }

  function donut(canvas, data) {
    const { ctx, w, h } = setupCanvas(canvas);
    ctx.clearRect(0,0,w,h);
    const cx = w/2, cy = h/2;
    const r = Math.min(w, h)/2 - 30;
    const rInner = r * 0.55;
    const total = data.reduce((s,d)=>s+d.value, 0);
    let start = -Math.PI/2;
    data.forEach((d,i) => {
      const ang = d.value/total * Math.PI*2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, start, start+ang);
      ctx.arc(cx, cy, rInner, start+ang, start, true);
      ctx.closePath();
      ctx.fillStyle = palette[i % palette.length];
      ctx.fill();
      // label
      const mid = start + ang/2;
      const lx = cx + Math.cos(mid)*(r+12);
      const ly = cy + Math.sin(mid)*(r+12);
      ctx.fillStyle = css('--text-dim');
      ctx.font = '11px system-ui';
      ctx.textAlign = Math.cos(mid)>0 ? 'left' : 'right';
      ctx.fillText(`${d.label} (${d.value})`, lx, ly);
      start += ang;
    });
    ctx.fillStyle = css('--text');
    ctx.font = 'bold 22px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(String(total), cx, cy);
    ctx.fillStyle = css('--text-dim');
    ctx.font = '11px system-ui';
    ctx.fillText('Produkte', cx, cy+18);
  }

  return { bar, priceBars, donut };
})();
