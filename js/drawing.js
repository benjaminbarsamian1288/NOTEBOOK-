/**
 * Drawing Module - Canvas-based drawing/inking tool
 */
const Drawing = (() => {
    let canvas = null;
    let ctx = null;
    let container = null;
    let isActive = false;
    let isDrawing = false;
    let currentTool = 'pen';
    let currentColor = '#000000';
    let currentSize = 3;
    let paths = [];
    let currentPath = null;
    let onDrawingChange = null;

    function init(canvasId, containerId, callback) {
        canvas = document.getElementById(canvasId);
        container = document.getElementById(containerId);
        onDrawingChange = callback;

        if (!canvas) return;
        ctx = canvas.getContext('2d');

        // Mouse events
        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', endDraw);
        canvas.addEventListener('mouseleave', endDraw);

        // Touch events
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            startDraw({
                offsetX: touch.clientX - rect.left,
                offsetY: touch.clientY - rect.top
            });
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            draw({
                offsetX: touch.clientX - rect.left,
                offsetY: touch.clientY - rect.top
            });
        });

        canvas.addEventListener('touchend', endDraw);

        // Resize
        window.addEventListener('resize', resizeCanvas);
    }

    function resizeCanvas() {
        if (!canvas || !container) return;
        const rect = container.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        redraw();
    }

    function activate() {
        if (!container) return;
        isActive = true;
        container.classList.remove('hidden');
        container.classList.add('active');
        resizeCanvas();
        updateCursor();
    }

    function deactivate() {
        if (!container) return;
        isActive = false;
        container.classList.remove('active');
        container.classList.add('hidden');
    }

    function toggle() {
        if (isActive) {
            deactivate();
        } else {
            activate();
        }
        return isActive;
    }

    function setTool(tool) {
        currentTool = tool;
        updateCursor();
    }

    function setColor(color) {
        currentColor = color;
    }

    function setSize(size) {
        currentSize = parseInt(size);
    }

    function updateCursor() {
        if (!container) return;
        container.classList.remove('eraser-cursor');
        if (currentTool === 'eraser') {
            container.classList.add('eraser-cursor');
        }
    }

    function startDraw(e) {
        if (!isActive) return;
        isDrawing = true;

        const x = e.offsetX;
        const y = e.offsetY;

        if (currentTool === 'eraser') {
            eraseAt(x, y);
            return;
        }

        currentPath = {
            tool: currentTool,
            color: currentTool === 'highlighter' ? hexToRgba(currentColor, 0.3) : currentColor,
            size: currentTool === 'highlighter' ? currentSize * 3 : currentSize,
            points: [{ x, y }]
        };

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = currentPath.color;
        ctx.lineWidth = currentPath.size;

        if (currentTool === 'highlighter') {
            ctx.globalCompositeOperation = 'multiply';
        } else {
            ctx.globalCompositeOperation = 'source-over';
        }
    }

    function draw(e) {
        if (!isDrawing || !isActive) return;

        const x = e.offsetX;
        const y = e.offsetY;

        if (currentTool === 'eraser') {
            eraseAt(x, y);
            return;
        }

        if (currentPath) {
            currentPath.points.push({ x, y });
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }

    function endDraw() {
        if (!isDrawing) return;
        isDrawing = false;

        if (currentPath && currentPath.points.length > 0) {
            paths.push(currentPath);
            currentPath = null;
            ctx.globalCompositeOperation = 'source-over';
            if (onDrawingChange) onDrawingChange(getDrawingData());
        }
    }

    function eraseAt(x, y) {
        const eraseRadius = currentSize * 4;
        const before = paths.length;
        paths = paths.filter(path => {
            return !path.points.some(p =>
                Math.hypot(p.x - x, p.y - y) < eraseRadius
            );
        });
        if (paths.length !== before) {
            redraw();
            if (onDrawingChange) onDrawingChange(getDrawingData());
        }
    }

    function redraw() {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        paths.forEach(path => {
            if (path.points.length === 0) return;
            ctx.beginPath();
            ctx.moveTo(path.points[0].x, path.points[0].y);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = path.color;
            ctx.lineWidth = path.size;

            if (path.tool === 'highlighter') {
                ctx.globalCompositeOperation = 'multiply';
            } else {
                ctx.globalCompositeOperation = 'source-over';
            }

            for (let i = 1; i < path.points.length; i++) {
                ctx.lineTo(path.points[i].x, path.points[i].y);
            }
            ctx.stroke();
        });

        ctx.globalCompositeOperation = 'source-over';
    }

    function clear() {
        paths = [];
        if (ctx && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        if (onDrawingChange) onDrawingChange(null);
    }

    function getDrawingData() {
        return { paths: paths, width: canvas?.width, height: canvas?.height };
    }

    function loadDrawing(data) {
        if (!data || !data.paths) {
            paths = [];
        } else {
            paths = data.paths;
        }
        if (isActive) {
            resizeCanvas();
        }
    }

    function toDataURL() {
        if (!canvas) return null;
        return canvas.toDataURL('image/png');
    }

    function hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    }

    function getIsActive() {
        return isActive;
    }

    return {
        init, activate, deactivate, toggle,
        setTool, setColor, setSize,
        clear, loadDrawing, getDrawingData, toDataURL,
        resizeCanvas, getIsActive
    };
})();
