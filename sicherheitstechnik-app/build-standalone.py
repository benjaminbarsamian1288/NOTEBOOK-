#!/usr/bin/env python3
"""Baut aus index.html + css/ + js/ + data/data.json eine einzige,
eigenständige HTML-Datei, die per Doppelklick (file://) ohne Server läuft.

Hintergrund: Über file:// blockieren Browser nur fetch() auf lokale Dateien
(hier data/data.json). <link>/<script src> werden hingegen geladen.
Wir inlinen alles in eine Datei und ersetzen den Daten-Loader durch die
fest eingebetteten Daten -> kein Server, kein fetch mehr nötig.
"""
import json
import re
from pathlib import Path

BASE = Path(__file__).resolve().parent
SRC = BASE / "index.html"
OUT = BASE / "Sicherheitstechnik-Katalog.html"


def strip_query(href: str) -> str:
    return href.split("?", 1)[0]


def safe_inline(text: str) -> str:
    # Verhindert vorzeitiges Schließen des umgebenden <script>/<style>.
    return text.replace("</script", "<\\/script").replace("</style", "<\\/style")


def read_local(rel: str) -> str:
    p = BASE / strip_query(rel)
    return p.read_text(encoding="utf-8")


def build() -> None:
    html = SRC.read_text(encoding="utf-8")

    # 1) Lokale Stylesheets inlinen (CDN-Links bleiben erhalten).
    def repl_link(m: re.Match) -> str:
        href = m.group(1)
        if href.startswith("http") or href.startswith("//"):
            return m.group(0)
        if not href.startswith("css/"):
            return m.group(0)
        css = safe_inline(read_local(href))
        return f'<style data-src="{strip_query(href)}">\n{css}\n</style>'

    html = re.sub(
        r'<link\s+rel="stylesheet"\s+href="([^"]+)"\s*/?>',
        repl_link,
        html,
    )

    # 2) Manifest-Link entfernen (für Einzeldatei irrelevant).
    html = re.sub(r'<link\s+rel="manifest"[^>]*>\s*', "", html)

    # 3) Daten fest einbetten -> ersetzt den fetch-basierten Loader aus js/data.js.
    data_obj = json.loads(read_local("data/data.json"))
    data_js = (
        "/* inlined data – kein fetch nötig (file://-tauglich) */\n"
        "window.ST = {\n"
        "  data: " + safe_inline(json.dumps(data_obj, ensure_ascii=False)) + ",\n"
        "  loading: null,\n"
        "  load() { return Promise.resolve(this.data); }\n"
        "};\n"
    )

    # 4) Lokale Scripts inlinen; js/data.js durch eingebettete Daten ersetzen.
    def repl_script(m: re.Match) -> str:
        src = m.group(1)
        if src.startswith("http") or src.startswith("//"):
            return m.group(0)
        if not src.startswith("js/"):
            return m.group(0)
        if strip_query(src) == "js/data.js":
            body = data_js
        else:
            body = safe_inline(read_local(src))
        return f'<script data-src="{strip_query(src)}">\n{body}\n</script>'

    html = re.sub(
        r'<script\s+src="([^"]+)"\s*></script>',
        repl_script,
        html,
    )

    # 5) Service-Worker-Registrierung entfernen (greift auf file:// nicht und
    #    erzeugt nur Konsolenrauschen).
    html = re.sub(
        r"<script>\s*if\s*\(\s*'serviceWorker'.*?</script>",
        "",
        html,
        flags=re.DOTALL,
    )

    OUT.write_text(html, encoding="utf-8")
    size_mb = OUT.stat().st_size / (1024 * 1024)
    print(f"OK: {OUT.name} erstellt ({size_mb:.2f} MB)")


if __name__ == "__main__":
    build()
