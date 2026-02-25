/**
 * Voice Recorder Module - Audio recording with waveform visualization
 */
const Recorder = (() => {
    let mediaRecorder = null;
    let audioChunks = [];
    let stream = null;
    let analyser = null;
    let animationId = null;
    let startTime = null;
    let pausedTime = 0;
    let timerInterval = null;
    let isRecording = false;
    let isPaused = false;

    // Callbacks
    let onStateChange = null;
    let onComplete = null;

    function setCallbacks(callbacks) {
        if (callbacks.onStateChange) onStateChange = callbacks.onStateChange;
        if (callbacks.onComplete) onComplete = callbacks.onComplete;
    }

    async function startRecording() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(stream);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);

            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunks.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunks, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                const duration = formatTime(getTotalTime());

                // Convert to base64 for storage
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (onComplete) {
                        onComplete({
                            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
                            url: url,
                            data: reader.result,
                            duration: duration,
                            durationMs: getTotalTime(),
                            createdAt: new Date().toISOString(),
                            name: 'Aufnahme ' + new Date().toLocaleTimeString('de-DE')
                        });
                    }
                };
                reader.readAsDataURL(blob);

                cleanup();
            };

            mediaRecorder.start(100);
            isRecording = true;
            isPaused = false;
            startTime = Date.now();
            pausedTime = 0;

            startTimer();
            startVisualization();

            if (onStateChange) onStateChange('recording');

            return true;
        } catch (err) {
            console.error('Recording failed:', err);
            if (onStateChange) onStateChange('error', err.message);
            return false;
        }
    }

    function pauseRecording() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.pause();
            isPaused = true;
            pausedTime += Date.now() - startTime;
            clearInterval(timerInterval);
            cancelAnimationFrame(animationId);
            if (onStateChange) onStateChange('paused');
        }
    }

    function resumeRecording() {
        if (mediaRecorder && mediaRecorder.state === 'paused') {
            mediaRecorder.resume();
            isPaused = false;
            startTime = Date.now();
            startTimer();
            startVisualization();
            if (onStateChange) onStateChange('recording');
        }
    }

    function stopRecording() {
        if (mediaRecorder && (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused')) {
            if (isPaused) {
                // Already accumulated in pausedTime
            } else {
                pausedTime += Date.now() - startTime;
            }
            mediaRecorder.stop();
            isRecording = false;
            isPaused = false;
            clearInterval(timerInterval);
            cancelAnimationFrame(animationId);
            if (onStateChange) onStateChange('stopped');
        }
    }

    function cleanup() {
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            stream = null;
        }
        analyser = null;
    }

    function getTotalTime() {
        if (!isRecording && !isPaused) return pausedTime;
        if (isPaused) return pausedTime;
        return pausedTime + (Date.now() - startTime);
    }

    function startTimer() {
        const timerEl = document.getElementById('rec-timer');
        timerInterval = setInterval(() => {
            if (timerEl) {
                timerEl.textContent = formatTime(getTotalTime());
            }
        }, 100);
    }

    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function startVisualization() {
        const canvas = document.getElementById('waveform-canvas');
        if (!canvas || !analyser) return;

        const ctx = canvas.getContext('2d');
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function draw() {
            if (!analyser) return;
            animationId = requestAnimationFrame(draw);

            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;

            analyser.getByteFrequencyData(dataArray);

            const isDark = document.body.classList.contains('dark-mode');
            ctx.fillStyle = isDark ? '#252536' : '#f8f9fa';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
                const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
                gradient.addColorStop(0, '#4a90d9');
                gradient.addColorStop(1, '#e74c3c');
                ctx.fillStyle = gradient;
                ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
                x += barWidth;
            }
        }

        draw();
    }

    // Play a recording from base64 data
    function playRecording(data) {
        const audio = new Audio(data);
        audio.play();
        return audio;
    }

    function getState() {
        return { isRecording, isPaused };
    }

    return {
        setCallbacks,
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
        playRecording,
        getState,
        formatTime
    };
})();
