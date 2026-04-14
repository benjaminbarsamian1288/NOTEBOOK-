/**
 * PWA Icon Generator - Creates PNG icons from canvas at runtime
 * and caches them for the PWA manifest
 */
const IconGenerator = (() => {
    function generateIcon(size) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Background gradient
        const grad = ctx.createLinearGradient(0, 0, size, size);
        grad.addColorStop(0, '#4a90d9');
        grad.addColorStop(1, '#357abd');
        ctx.fillStyle = grad;

        // Rounded rect background
        const r = size * 0.15;
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(size - r, 0);
        ctx.quadraticCurveTo(size, 0, size, r);
        ctx.lineTo(size, size - r);
        ctx.quadraticCurveTo(size, size, size - r, size);
        ctx.lineTo(r, size);
        ctx.quadraticCurveTo(0, size, 0, size - r);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath();
        ctx.fill();

        const cx = size / 2;
        const cy = size / 2;
        const s = size * 0.22;

        // Open book - left page
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.beginPath();
        ctx.moveTo(cx, cy - s * 1.0);
        ctx.lineTo(cx - s * 1.2, cy - s * 0.75);
        ctx.lineTo(cx - s * 1.2, cy + s * 1.0);
        ctx.lineTo(cx, cy + s * 0.75);
        ctx.closePath();
        ctx.fill();

        // Open book - right page
        ctx.beginPath();
        ctx.moveTo(cx, cy - s * 1.0);
        ctx.lineTo(cx + s * 1.2, cy - s * 0.75);
        ctx.lineTo(cx + s * 1.2, cy + s * 1.0);
        ctx.lineTo(cx, cy + s * 0.75);
        ctx.closePath();
        ctx.fill();

        // Text lines on left page
        ctx.fillStyle = 'rgba(74,144,217,0.35)';
        const lx = cx - s * 0.95;
        const lw = s * 0.75;
        for (let i = 0; i < 4; i++) {
            const ly = cy - s * 0.25 + i * s * 0.28;
            ctx.fillRect(lx, ly, lw - (i % 2 === 1 ? s * 0.15 : 0), size * 0.008);
        }

        // Text lines on right page
        const rx = cx + s * 0.2;
        for (let i = 0; i < 3; i++) {
            const ry = cy - s * 0.25 + i * s * 0.28;
            ctx.fillRect(rx, ry, lw - (i % 2 === 0 ? s * 0.1 : 0), size * 0.008);
        }

        // Microphone badge
        const micCx = cx + s * 1.0;
        const micCy = cy - s * 0.7;
        const micR = size * 0.1;

        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(micCx, micCy, micR, 0, Math.PI * 2);
        ctx.fill();

        // Mic body
        ctx.fillStyle = 'white';
        const mw = micR * 0.38;
        const mh = micR * 0.6;
        ctx.beginPath();
        ctx.roundRect(micCx - mw / 2, micCy - mh * 0.7, mw, mh, mw / 2);
        ctx.fill();

        // Mic arc
        ctx.strokeStyle = 'white';
        ctx.lineWidth = micR * 0.12;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(micCx, micCy - micR * 0.05, micR * 0.35, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();

        // Mic stand
        ctx.beginPath();
        ctx.moveTo(micCx, micCy + micR * 0.15);
        ctx.lineTo(micCx, micCy + micR * 0.35);
        ctx.stroke();

        return canvas.toDataURL('image/png');
    }

    async function generateAndCacheIcons() {
        const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

        for (const size of sizes) {
            const dataUrl = generateIcon(size);
            // Convert data URL to blob and cache
            const response = await fetch(dataUrl);
            const blob = await response.blob();

            if ('caches' in window) {
                const cache = await caches.open('voicenote-icons-v1');
                const iconResponse = new Response(blob, {
                    headers: { 'Content-Type': 'image/png' }
                });
                await cache.put(`/icons/icon-${size}.png`, iconResponse);
            }
        }
    }

    return { generateIcon, generateAndCacheIcons };
})();
