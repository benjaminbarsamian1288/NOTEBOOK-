/**
 * Editor Module - Rich text editing, formatting, and content management
 */
const Editor = (() => {
    let editorEl = null;
    let autoSaveTimer = null;
    let onContentChange = null;

    function init(elementId, callback) {
        editorEl = document.getElementById(elementId);
        onContentChange = callback;

        if (!editorEl) return;

        // Content change handler with auto-save
        editorEl.addEventListener('input', () => {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                if (onContentChange) onContentChange(editorEl.innerHTML);
                updateWordCount();
            }, 500);
            updateWordCount();
        });

        // Keyboard shortcuts
        editorEl.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'b': e.preventDefault(); execCommand('bold'); break;
                    case 'i': e.preventDefault(); execCommand('italic'); break;
                    case 'u': e.preventDefault(); execCommand('underline'); break;
                    case 'z': if (!e.shiftKey) { /* browser default undo */ } break;
                    case 'y': /* browser default redo */ break;
                }
            }
            // Tab key for indentation
            if (e.key === 'Tab') {
                e.preventDefault();
                if (e.shiftKey) {
                    execCommand('outdent');
                } else {
                    execCommand('indent');
                }
            }
        });

        // Paste handler - clean paste
        editorEl.addEventListener('paste', (e) => {
            // Allow paste but strip unwanted formatting from external sources
            const clipboardData = e.clipboardData || window.clipboardData;

            // Check for files (images)
            if (clipboardData.files && clipboardData.files.length > 0) {
                e.preventDefault();
                Array.from(clipboardData.files).forEach(file => {
                    if (file.type.startsWith('image/')) {
                        insertImageFromFile(file);
                    }
                });
                return;
            }

            // Let HTML paste through for internal copy-paste
            const html = clipboardData.getData('text/html');
            if (html) return; // Allow browser default for HTML paste

            // For plain text, insert with line breaks preserved
            const text = clipboardData.getData('text/plain');
            if (text) {
                e.preventDefault();
                document.execCommand('insertHTML', false, text.replace(/\n/g, '<br>'));
            }
        });

        // Drag and drop
        editorEl.addEventListener('dragover', (e) => {
            e.preventDefault();
            editorEl.classList.add('drag-over');
        });

        editorEl.addEventListener('dragleave', () => {
            editorEl.classList.remove('drag-over');
        });

        editorEl.addEventListener('drop', (e) => {
            e.preventDefault();
            editorEl.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            Array.from(files).forEach(file => {
                if (file.type.startsWith('image/')) {
                    insertImageFromFile(file);
                }
            });
        });

        updateWordCount();
    }

    function execCommand(command, value) {
        document.execCommand(command, false, value || null);
        editorEl.focus();
    }

    function setFontFamily(family) {
        document.execCommand('fontName', false, family);
        editorEl.focus();
    }

    function setFontSize(size) {
        document.execCommand('fontSize', false, size);
        editorEl.focus();
    }

    function setTextColor(color) {
        document.execCommand('foreColor', false, color);
        editorEl.focus();
    }

    function setHighlightColor(color) {
        document.execCommand('hiliteColor', false, color);
        editorEl.focus();
    }

    function insertCheckbox() {
        const id = 'cb_' + Date.now();
        const html = `<div class="checklist-item" contenteditable="false">
            <input type="checkbox" id="${id}" onchange="this.parentElement.classList.toggle('checked', this.checked)">
            <span contenteditable="true">Aufgabe</span>
        </div><p></p>`;
        document.execCommand('insertHTML', false, html);
        editorEl.focus();
    }

    function insertTable(rows, cols) {
        let html = '<table><tbody>';
        for (let r = 0; r < rows; r++) {
            html += '<tr>';
            for (let c = 0; c < cols; c++) {
                const tag = r === 0 ? 'th' : 'td';
                html += `<${tag}>${r === 0 ? 'Spalte ' + (c + 1) : ''}</${tag}>`;
            }
            html += '</tr>';
        }
        html += '</tbody></table><p></p>';
        document.execCommand('insertHTML', false, html);
        editorEl.focus();
    }

    function insertLink(url, text) {
        const html = `<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(text || url)}</a>`;
        document.execCommand('insertHTML', false, html);
        editorEl.focus();
    }

    function insertImage(src) {
        const html = `<img src="${src}" alt="Bild" style="max-width:100%"><p></p>`;
        document.execCommand('insertHTML', false, html);
        editorEl.focus();
    }

    function insertImageFromFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            insertImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    function insertDivider() {
        document.execCommand('insertHTML', false, '<hr><p></p>');
        editorEl.focus();
    }

    function insertCodeBlock() {
        const html = '<pre contenteditable="true">// Code hier eingeben...</pre><p></p>';
        document.execCommand('insertHTML', false, html);
        editorEl.focus();
    }

    function insertAudioAttachment(recording) {
        const html = `
        <div class="audio-attachment" data-recording-id="${recording.id}" contenteditable="false">
            <div class="audio-icon"><i class="fas fa-microphone"></i></div>
            <div class="audio-info">
                <div class="audio-name">${escapeHtml(recording.name)}</div>
                <div class="audio-duration">${recording.duration}</div>
            </div>
            <audio controls src="${recording.data || recording.url}" preload="none"></audio>
            <button class="btn-delete-audio" onclick="Editor.removeAudioAttachment(this)" title="Entfernen">
                <i class="fas fa-times"></i>
            </button>
        </div><p></p>`;
        document.execCommand('insertHTML', false, html);
        editorEl.focus();
    }

    function removeAudioAttachment(btn) {
        const attachment = btn.closest('.audio-attachment');
        if (attachment) {
            attachment.remove();
            if (onContentChange) onContentChange(editorEl.innerHTML);
        }
    }

    function insertFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const html = `<div class="file-attachment" contenteditable="false">
                <i class="fas fa-paperclip"></i>
                <span>${escapeHtml(file.name)}</span>
                <span style="color:var(--text-muted);font-size:0.75rem">(${formatFileSize(file.size)})</span>
            </div><p></p>`;
            document.execCommand('insertHTML', false, html);
            editorEl.focus();
        };
        reader.readAsDataURL(file);
    }

    function getContent() {
        return editorEl ? editorEl.innerHTML : '';
    }

    function setContent(html) {
        if (editorEl) {
            editorEl.innerHTML = html || '';
            updateWordCount();
        }
    }

    function getPlainText() {
        return editorEl ? editorEl.innerText : '';
    }

    function focus() {
        if (editorEl) editorEl.focus();
    }

    function updateWordCount() {
        const text = getPlainText().trim();
        const words = text ? text.split(/\s+/).length : 0;
        const chars = text.length;
        const wordCountEl = document.getElementById('word-count');
        const charCountEl = document.getElementById('char-count');
        if (wordCountEl) wordCountEl.textContent = `${words} Wörter`;
        if (charCountEl) charCountEl.textContent = `${chars} Zeichen`;
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    }

    return {
        init, execCommand,
        setFontFamily, setFontSize, setTextColor, setHighlightColor,
        insertCheckbox, insertTable, insertLink, insertImage, insertImageFromFile,
        insertDivider, insertCodeBlock, insertAudioAttachment, removeAudioAttachment,
        insertFile, getContent, setContent, getPlainText, focus
    };
})();
