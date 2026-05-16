/* Realistische SVG-Person-Sprites · wiederverwendbar
   Detailliertere Charaktere mit Kleidung, Gesicht, Schatten, Walking-Cycle */

window.SPRITES = (() => {

  /* Helper: animated walking cycle */
  const walkAnim = (dur = 0.6) => `
    <animate attributeName="x2" values="-3;3;-3" dur="${dur}s" repeatCount="indefinite"/>
  `;

  /* === Wachmann (Security in Uniform mit Mütze) === */
  const wachmann = (id = 'wachmann', x = 0, y = 0, scale = 1) => `
    <g transform="translate(${x}, ${y}) scale(${scale})" id="${id}">
      <!-- Schatten -->
      <ellipse cx="0" cy="62" rx="15" ry="3" fill="rgba(0,0,0,.4)"/>
      <!-- Beine -->
      <rect x="-5" y="38" width="5" height="22" rx="2" fill="#1e293b"/>
      <rect x="0" y="38" width="5" height="22" rx="2" fill="#1e293b"/>
      <!-- Schuhe -->
      <ellipse cx="-2.5" cy="62" rx="3.5" ry="2" fill="#0a0f1a"/>
      <ellipse cx="2.5" cy="62" rx="3.5" ry="2" fill="#0a0f1a"/>
      <!-- Uniform-Body (dunkelblau) -->
      <path d="M-10 5 L-10 38 L10 38 L10 5 Q10 0 5 0 L-5 0 Q-10 0 -10 5 Z" fill="#1e3a8a"/>
      <!-- Knöpfe -->
      <circle cx="0" cy="12" r="0.8" fill="#fbbf24"/>
      <circle cx="0" cy="20" r="0.8" fill="#fbbf24"/>
      <circle cx="0" cy="28" r="0.8" fill="#fbbf24"/>
      <!-- Schulterstücke gelb -->
      <rect x="-10" y="0" width="6" height="3" fill="#fbbf24"/>
      <rect x="4" y="0" width="6" height="3" fill="#fbbf24"/>
      <!-- Brust-Wappen -->
      <rect x="-5" y="6" width="4" height="5" fill="#dc2626" stroke="#fbbf24" stroke-width=".3"/>
      <!-- Arme -->
      <rect x="-13" y="2" width="4" height="22" rx="2" fill="#1e3a8a"/>
      <rect x="9" y="2" width="4" height="22" rx="2" fill="#1e3a8a"/>
      <!-- Hände -->
      <circle cx="-11" cy="26" r="2.5" fill="#fbd7a0"/>
      <circle cx="11" cy="26" r="2.5" fill="#fbd7a0"/>
      <!-- Hals -->
      <rect x="-3" y="-3" width="6" height="6" fill="#fbd7a0"/>
      <!-- Kopf -->
      <circle cx="0" cy="-9" r="7" fill="#fbd7a0"/>
      <!-- Augen -->
      <circle cx="-2.5" cy="-10" r=".8" fill="#1e293b"/>
      <circle cx="2.5" cy="-10" r=".8" fill="#1e293b"/>
      <!-- Mund (ernst) -->
      <line x1="-1.5" y1="-6" x2="1.5" y2="-6" stroke="#92400e" stroke-width=".5"/>
      <!-- Schirmmütze (Police-Style) -->
      <path d="M-7 -14 L7 -14 L8 -12 L-8 -12 Z" fill="#1e3a8a"/>
      <ellipse cx="0" cy="-12" rx="9" ry="2" fill="#0a0f1a"/>
      <!-- Mützenabzeichen -->
      <rect x="-2" y="-13.5" width="4" height="1.5" fill="#fbbf24"/>
      <!-- Funkgerät am Gürtel -->
      <rect x="-12" y="22" width="3" height="6" fill="#0a0f1a"/>
      <circle cx="-13" cy="20" r="1" fill="#dc2626"/>
    </g>
  `;

  /* === Eindringling (Hoodie, vermummt) === */
  const eindringling = (id = 'eindringling', x = 0, y = 0, scale = 1) => `
    <g transform="translate(${x}, ${y}) scale(${scale})" id="${id}">
      <ellipse cx="0" cy="62" rx="14" ry="2.5" fill="rgba(0,0,0,.5)"/>
      <!-- Beine schwarz -->
      <rect x="-5" y="38" width="5" height="22" rx="2" fill="#0a0f1a"/>
      <rect x="0" y="38" width="5" height="22" rx="2" fill="#0a0f1a"/>
      <ellipse cx="-2.5" cy="62" rx="3.5" ry="2" fill="#000"/>
      <ellipse cx="2.5" cy="62" rx="3.5" ry="2" fill="#000"/>
      <!-- Hoodie-Body dunkel -->
      <path d="M-11 6 L-11 38 L11 38 L11 6 Q11 -1 5 -1 L-5 -1 Q-11 -1 -11 6 Z" fill="#1e293b"/>
      <!-- Tasche vorne -->
      <rect x="-8" y="22" width="16" height="6" fill="#0f172a" opacity=".6"/>
      <!-- Beute-Tasche in der Hand -->
      <rect x="-16" y="28" width="10" height="8" rx="1" fill="#3f3f46" stroke="#000" stroke-width=".5"/>
      <line x1="-14" y1="28" x2="-12" y2="24" stroke="#0a0f1a"/>
      <line x1="-8" y1="28" x2="-10" y2="24" stroke="#0a0f1a"/>
      <!-- Arme -->
      <rect x="-14" y="2" width="4" height="22" rx="2" fill="#1e293b"/>
      <rect x="10" y="2" width="4" height="22" rx="2" fill="#1e293b"/>
      <!-- Hände in Handschuhen -->
      <circle cx="-12" cy="26" r="2.5" fill="#0a0f1a"/>
      <circle cx="12" cy="26" r="2.5" fill="#0a0f1a"/>
      <!-- Hoodie-Kapuze -->
      <path d="M-10 -2 Q-10 -16 0 -16 Q10 -16 10 -2 L10 4 L-10 4 Z" fill="#1e293b"/>
      <!-- Gesicht in Schatten -->
      <ellipse cx="0" cy="-6" rx="6" ry="7" fill="#1e1b18"/>
      <!-- Augen (leuchtend) -->
      <circle cx="-2" cy="-7" r=".9" fill="#fbbf24"/>
      <circle cx="2" cy="-7" r=".9" fill="#fbbf24"/>
    </g>
  `;

  /* === Mitarbeiter (Arbeitskleidung mit Warnweste) === */
  const mitarbeiter = (id = 'mitarbeiter', x = 0, y = 0, scale = 1) => `
    <g transform="translate(${x}, ${y}) scale(${scale})" id="${id}">
      <ellipse cx="0" cy="62" rx="14" ry="2.5" fill="rgba(0,0,0,.4)"/>
      <!-- Hose -->
      <rect x="-5" y="38" width="5" height="22" rx="2" fill="#1e3a8a"/>
      <rect x="0" y="38" width="5" height="22" rx="2" fill="#1e3a8a"/>
      <!-- Stiefel -->
      <ellipse cx="-2.5" cy="62" rx="3.5" ry="2" fill="#451a03"/>
      <ellipse cx="2.5" cy="62" rx="3.5" ry="2" fill="#451a03"/>
      <!-- Arbeits-Shirt grau -->
      <path d="M-10 5 L-10 38 L10 38 L10 5 Q10 0 5 0 L-5 0 Q-10 0 -10 5 Z" fill="#475569"/>
      <!-- Warnweste GELB -->
      <path d="M-9 6 L-9 30 L9 30 L9 6 L4 6 L4 30 M-4 6 L-4 30" fill="#fbbf24" stroke="#0a0f1a" stroke-width=".3"/>
      <!-- Reflektor-Streifen -->
      <rect x="-9" y="14" width="18" height="2" fill="#cbd5e1"/>
      <rect x="-9" y="22" width="18" height="2" fill="#cbd5e1"/>
      <!-- Arme -->
      <rect x="-13" y="2" width="4" height="22" rx="2" fill="#475569"/>
      <rect x="9" y="2" width="4" height="22" rx="2" fill="#475569"/>
      <circle cx="-11" cy="26" r="2.5" fill="#fbd7a0"/>
      <circle cx="11" cy="26" r="2.5" fill="#fbd7a0"/>
      <!-- Hals + Kopf -->
      <rect x="-3" y="-3" width="6" height="6" fill="#fbd7a0"/>
      <circle cx="0" cy="-9" r="7" fill="#fbd7a0"/>
      <circle cx="-2.5" cy="-10" r=".8" fill="#1e293b"/>
      <circle cx="2.5" cy="-10" r=".8" fill="#1e293b"/>
      <path d="M-2 -6 Q0 -5 2 -6" fill="none" stroke="#92400e" stroke-width=".5"/>
      <!-- Helm gelb -->
      <ellipse cx="0" cy="-14" rx="8" ry="5" fill="#fbbf24"/>
      <rect x="-8" y="-12" width="16" height="2" fill="#0a0f1a"/>
    </g>
  `;

  /* === Polizist === */
  const polizist = (id = 'polizist', x = 0, y = 0, scale = 1) => `
    <g transform="translate(${x}, ${y}) scale(${scale})" id="${id}">
      <ellipse cx="0" cy="62" rx="15" ry="3" fill="rgba(0,0,0,.4)"/>
      <rect x="-5" y="38" width="5" height="22" rx="2" fill="#1e293b"/>
      <rect x="0" y="38" width="5" height="22" rx="2" fill="#1e293b"/>
      <ellipse cx="-2.5" cy="62" rx="3.5" ry="2" fill="#000"/>
      <ellipse cx="2.5" cy="62" rx="3.5" ry="2" fill="#000"/>
      <!-- Uniform grün (DE Polizei) -->
      <path d="M-10 5 L-10 38 L10 38 L10 5 Q10 0 5 0 L-5 0 Q-10 0 -10 5 Z" fill="#15803d"/>
      <!-- Schutzweste -->
      <rect x="-9" y="6" width="18" height="20" fill="#166534" stroke="#0a0f1a" stroke-width=".3"/>
      <text x="0" y="18" text-anchor="middle" font-size="6" fill="white" font-weight="900">POLIZEI</text>
      <!-- Reflektor-Streifen -->
      <rect x="-9" y="26" width="18" height="1.5" fill="#fbbf24"/>
      <!-- Arme -->
      <rect x="-13" y="2" width="4" height="22" rx="2" fill="#15803d"/>
      <rect x="9" y="2" width="4" height="22" rx="2" fill="#15803d"/>
      <!-- Hand mit Waffe (rechts) -->
      <circle cx="-11" cy="26" r="2.5" fill="#fbd7a0"/>
      <circle cx="11" cy="26" r="2.5" fill="#fbd7a0"/>
      <rect x="14" y="22" width="6" height="3" fill="#0a0f1a"/>
      <!-- Hals + Kopf -->
      <rect x="-3" y="-3" width="6" height="6" fill="#fbd7a0"/>
      <circle cx="0" cy="-9" r="7" fill="#fbd7a0"/>
      <circle cx="-2.5" cy="-10" r=".8" fill="#1e293b"/>
      <circle cx="2.5" cy="-10" r=".8" fill="#1e293b"/>
      <line x1="-1.5" y1="-6" x2="1.5" y2="-6" stroke="#92400e" stroke-width=".5"/>
      <!-- Helm/Schirmmütze -->
      <path d="M-7 -14 L7 -14 L8 -12 L-8 -12 Z" fill="#0a0f1a"/>
      <ellipse cx="0" cy="-12" rx="9" ry="2" fill="#0a0f1a"/>
      <rect x="-2" y="-13.5" width="4" height="1.5" fill="#22c55e"/>
    </g>
  `;

  /* === Diensthund (Schäferhund) === */
  const hund = (id = 'hund', x = 0, y = 0, scale = 1) => `
    <g transform="translate(${x}, ${y}) scale(${scale})" id="${id}">
      <ellipse cx="0" cy="22" rx="14" ry="2" fill="rgba(0,0,0,.4)"/>
      <!-- Körper -->
      <ellipse cx="0" cy="10" rx="12" ry="6" fill="#78350f"/>
      <!-- Rücken dunkler -->
      <path d="M-10 8 Q0 4 10 8" fill="none" stroke="#451a03" stroke-width="3"/>
      <!-- Beine -->
      <rect x="-8" y="14" width="3" height="9" fill="#78350f"/>
      <rect x="-3" y="14" width="3" height="9" fill="#92400e"/>
      <rect x="2" y="14" width="3" height="9" fill="#92400e"/>
      <rect x="6" y="14" width="3" height="9" fill="#78350f"/>
      <!-- Schwanz -->
      <path d="M11 8 Q16 4 14 -2" fill="none" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
      <!-- Kopf -->
      <ellipse cx="-12" cy="6" rx="5" ry="4" fill="#78350f"/>
      <!-- Schnauze -->
      <ellipse cx="-16" cy="7" rx="3" ry="2" fill="#451a03"/>
      <circle cx="-18" cy="7" r="0.8" fill="#0a0f1a"/>
      <!-- Ohren spitz -->
      <polygon points="-13,2 -14,-2 -11,-1" fill="#451a03"/>
      <polygon points="-11,2 -10,-2 -8,0" fill="#451a03"/>
      <!-- Auge -->
      <circle cx="-13" cy="5" r="0.7" fill="#0a0f1a"/>
      <!-- Halsband -->
      <ellipse cx="-9" cy="9" rx="3.5" ry="2" fill="none" stroke="#dc2626" stroke-width="1"/>
      <rect x="-10" y="9" width="2" height="1.5" fill="#fbbf24"/>
    </g>
  `;

  /* === Mit Walking-Animation (für laufende Personen) === */
  const wachmannWalking = (id, x, y, scale = 1, dur = 0.6) => `
    <g transform="translate(${x}, ${y}) scale(${scale})" id="${id}">
      <ellipse cx="0" cy="62" rx="15" ry="3" fill="rgba(0,0,0,.4)"/>
      <!-- Bewegte Beine -->
      <g>
        <rect x="-5" y="38" width="5" height="22" rx="2" fill="#1e293b">
          <animate attributeName="transform" type="translate" values="0,0;0,-1;0,0" dur="${dur}s" repeatCount="indefinite"/>
        </rect>
        <rect x="0" y="38" width="5" height="22" rx="2" fill="#1e293b">
          <animate attributeName="transform" type="translate" values="0,-1;0,0;0,-1" dur="${dur}s" repeatCount="indefinite"/>
        </rect>
      </g>
      <ellipse cx="-2.5" cy="62" rx="3.5" ry="2" fill="#0a0f1a"/>
      <ellipse cx="2.5" cy="62" rx="3.5" ry="2" fill="#0a0f1a"/>
      <!-- Uniform -->
      <path d="M-10 5 L-10 38 L10 38 L10 5 Q10 0 5 0 L-5 0 Q-10 0 -10 5 Z" fill="#1e3a8a"/>
      <circle cx="0" cy="12" r="0.8" fill="#fbbf24"/>
      <circle cx="0" cy="20" r="0.8" fill="#fbbf24"/>
      <rect x="-10" y="0" width="6" height="3" fill="#fbbf24"/>
      <rect x="4" y="0" width="6" height="3" fill="#fbbf24"/>
      <!-- Schwingende Arme -->
      <g>
        <rect x="-13" y="2" width="4" height="22" rx="2" fill="#1e3a8a">
          <animateTransform attributeName="transform" type="rotate" values="-8 -11 2;8 -11 2;-8 -11 2" dur="${dur}s" repeatCount="indefinite"/>
        </rect>
      </g>
      <g>
        <rect x="9" y="2" width="4" height="22" rx="2" fill="#1e3a8a">
          <animateTransform attributeName="transform" type="rotate" values="8 11 2;-8 11 2;8 11 2" dur="${dur}s" repeatCount="indefinite"/>
        </rect>
      </g>
      <circle cx="-11" cy="26" r="2.5" fill="#fbd7a0"/>
      <circle cx="11" cy="26" r="2.5" fill="#fbd7a0"/>
      <rect x="-3" y="-3" width="6" height="6" fill="#fbd7a0"/>
      <circle cx="0" cy="-9" r="7" fill="#fbd7a0"/>
      <circle cx="-2.5" cy="-10" r=".8" fill="#1e293b"/>
      <circle cx="2.5" cy="-10" r=".8" fill="#1e293b"/>
      <line x1="-1.5" y1="-6" x2="1.5" y2="-6" stroke="#92400e" stroke-width=".5"/>
      <path d="M-7 -14 L7 -14 L8 -12 L-8 -12 Z" fill="#1e3a8a"/>
      <ellipse cx="0" cy="-12" rx="9" ry="2" fill="#0a0f1a"/>
      <rect x="-2" y="-13.5" width="4" height="1.5" fill="#fbbf24"/>
    </g>
  `;

  return {
    wachmann, eindringling, mitarbeiter, polizist, hund,
    wachmannWalking,
  };
})();
