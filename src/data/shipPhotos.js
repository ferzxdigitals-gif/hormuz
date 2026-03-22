// Generates deterministic ship illustration data URIs — no external photo deps.
// Each returns a real SVG showing the vessel silhouette on a maritime background.

const SHIP_PATHS = {
  tanker:    'M5 18 L10 20 L90 20 L95 18 L92 16 L85 14 L80 10 L75 8 L70 8 L65 10 L60 10 L55 10 L20 10 L15 12 L10 16 Z M72 8 L72 4 L74 4 L74 8 M40 10 L40 6 L55 6 L55 10',
  lng:       'M5 18 L10 20 L90 20 L95 18 L90 14 L85 12 L80 10 L75 8 L25 8 L20 10 L15 14 L10 16 Z M30 8 L30 3 Q40 0 50 3 L50 8 M55 8 L55 3 Q65 0 75 3 L75 8',
  bulk:      'M5 18 L10 20 L90 20 L95 18 L90 14 L85 10 L80 8 L25 8 L20 10 L15 14 L10 16 Z M30 8 L30 5 L75 5 L75 8 M70 5 L72 2 L74 2 L74 5',
  container: 'M5 18 L10 20 L90 20 L95 18 L92 14 L88 10 L82 7 L78 5 L25 5 L20 8 L15 12 L10 16 Z M28 5 L28 2 L75 2 L75 5 M30 5 L30 2 M40 5 L40 2 M50 5 L50 2 M60 5 L60 2 M70 5 L70 2',
  cargo:     'M5 18 L10 20 L90 20 L95 18 L90 14 L85 10 L78 8 L25 8 L20 10 L15 14 L10 16 Z M60 8 L60 3 L65 3 L65 8 M30 8 L30 5 L50 5 L50 8',
  military:  'M5 16 L15 18 L85 18 L95 16 L90 14 L85 12 L80 10 L75 8 L50 6 L45 4 L40 4 L35 6 L20 8 L15 12 L10 14 Z M45 4 L45 1 L47 1 L47 4 M60 8 L70 8 L70 6 L60 6 Z',
  passenger: 'M5 18 L10 20 L90 20 L95 18 L92 16 L88 12 L82 8 L78 6 L25 6 L20 8 L15 12 L10 16 Z M28 6 L28 2 L75 2 L75 6 M34 4 L40 4 L40 2 M44 4 L50 4 L50 2 M54 4 L60 4 L60 2 M64 4 L70 4 L70 2',
  tug:       'M10 16 L15 18 L75 18 L85 16 L80 14 L75 12 L70 10 L60 8 L40 8 L30 10 L20 12 L15 14 Z M55 8 L55 4 L58 4 L58 8 M45 8 L45 5 L50 5 L50 8',
};

// Sky/sea color pairs per vessel type — gives each type a distinct maritime atmosphere
const TYPE_COLORS = {
  tanker:    { sky1: '#0a1520', sky2: '#102035', sea1: '#0d2540', sea2: '#071528' },
  product:   { sky1: '#0f1828', sky2: '#1a2a3a', sea1: '#122238', sea2: '#0a1822' },
  lng:       { sky1: '#08182e', sky2: '#0d2448', sea1: '#0a2040', sea2: '#061528' },
  bulk:      { sky1: '#0d1820', sky2: '#182530', sea1: '#102030', sea2: '#0a1520' },
  container: { sky1: '#0a1c30', sky2: '#102840', sea1: '#0d2238', sea2: '#081525' },
  cargo:     { sky1: '#0f1a25', sky2: '#1a2838', sea1: '#122030', sea2: '#0c1820' },
  military:  { sky1: '#0d1218', sky2: '#181e25', sea1: '#101820', sea2: '#0a1015' },
  passenger: { sky1: '#0a2035', sky2: '#0e2c50', sea1: '#0d2848', sea2: '#081830' },
  tug:       { sky1: '#0f1a28', sky2: '#1a2838', sea1: '#102030', sea2: '#0c1820' },
};

function makeSvg(type, color, variant) {
  const path  = SHIP_PATHS[type] || SHIP_PATHS.cargo;
  const c     = TYPE_COLORS[type] || TYPE_COLORS.cargo;

  // Slight sky variation per gallery variant
  const skyShift = variant * 8;
  const sky1 = shiftHex(c.sky1, skyShift);
  const sky2 = shiftHex(c.sky2, skyShift);

  // Stars (subtle)
  const stars = Array.from({ length: 18 }, (_, i) => {
    const x = ((i * 73 + 17) % 380) + 10;
    const y = ((i * 47 + 11) % 120) + 10;
    const r = (i % 3 === 0) ? 1.2 : 0.7;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,${0.3 + (i % 4) * 0.1})"/>`;
  }).join('');

  // Horizon glow colour from ship type
  const glowAlpha = 0.12 + variant * 0.04;

  const id = `${type}${variant}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 280" width="400" height="280">
  <defs>
    <linearGradient id="sk${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${sky1}"/>
      <stop offset="100%" stop-color="${sky2}"/>
    </linearGradient>
    <linearGradient id="se${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${c.sea1}"/>
      <stop offset="100%" stop-color="${c.sea2}"/>
    </linearGradient>
    <radialGradient id="gl${id}" cx="50%" cy="100%" r="60%">
      <stop offset="0%" stop-color="${color}" stop-opacity="${glowAlpha}"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Sky -->
  <rect width="400" height="195" fill="url(#sk${id})"/>
  <!-- Stars -->
  ${stars}
  <!-- Horizon glow -->
  <ellipse cx="200" cy="195" rx="220" ry="30" fill="url(#gl${id})"/>
  <!-- Sea -->
  <rect y="193" width="400" height="87" fill="url(#se${id})"/>
  <!-- Horizon line -->
  <line x1="0" y1="194" x2="400" y2="194" stroke="${color}" stroke-width="0.6" stroke-opacity="0.25"/>
  <!-- Wave lines -->
  <path d="M0 208 Q80 201 160 208 Q240 215 320 208 Q360 204 400 208" fill="none" stroke="rgba(0,180,220,0.15)" stroke-width="1.5"/>
  <path d="M0 222 Q100 215 200 222 Q300 229 400 222" fill="none" stroke="rgba(0,180,220,0.09)" stroke-width="1"/>
  <path d="M20 238 Q120 232 200 238 Q280 244 380 238" fill="none" stroke="rgba(0,180,220,0.06)" stroke-width="1"/>
  <!-- Ship shadow (reflection) -->
  <g transform="translate(75,194) scale(2.5,0.4)" opacity="0.18">
    <g fill="${color}"><path d="${path}"/></g>
  </g>
  <!-- Ship silhouette — waterline at y=20 in viewBox → y=194 in image -->
  <g transform="translate(75,144) scale(2.5)">
    <g fill="${color}" stroke="${color}" stroke-width="0.35" opacity="0.95">
      <path d="${path}"/>
    </g>
  </g>
</svg>`;
}

function shiftHex(hex, amount) {
  // Brighten a dark hex colour slightly
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

/**
 * Returns an array of 3 data-URI SVG images showing the ship on a maritime background.
 * Deterministic — same type+color always produces the same images.
 */
export function generateShipPhotos(type, color) {
  return [0, 1, 2].map(variant => {
    const svg = makeSvg(type, color, variant);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}
