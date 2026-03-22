// Generates ship "photo" SVG data URIs.
// Each photo: large ship (fills ~88% of frame width) on a maritime background.
// Three variants = night / dusk / day — visually distinct from the plain silhouette.

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

// Three lighting themes: night / dusk / day
const THEMES = [
  // 0 — Night
  {
    sky1: '#020c1e', sky2: '#05152e',
    sea1: '#040f1e', sea2: '#020a14',
    horizon: '#0a2a4a',
    stars: true,
    sunX: null,
  },
  // 1 — Dusk
  {
    sky1: '#1a0a2e', sky2: '#c05010',
    sea1: '#0a2035', sea2: '#051525',
    horizon: '#ff7b1a',
    stars: false,
    sunX: 320, sunY: 148, sunColor: '#ffb347',
  },
  // 2 — Day
  {
    sky1: '#1565c0', sky2: '#42a5f5',
    sea1: '#0d47a1', sea2: '#01579b',
    horizon: '#90caf9',
    stars: false,
    sunX: 340, sunY: 55, sunColor: '#fffde7',
  },
];

function makeSvg(type, color, variant) {
  const path  = SHIP_PATHS[type] || SHIP_PATHS.cargo;
  const theme = THEMES[variant];
  const id    = `${type}${variant}`;

  // Ship transform: scale 3.6 → ship 360px wide in 400px frame (90%)
  // Path waterline at y=20 → 20*3.6 + yOff = waterlineY
  const sc      = 3.6;
  const xOff    = 20;
  const yOff    = 157;
  const wlY     = yOff + 20 * sc;  // = 229

  const stars = theme.stars
    ? Array.from({ length: 22 }, (_, i) => {
        const x = ((i * 73 + 17) % 380) + 10;
        const y = ((i * 47 + 11) % 130) + 5;
        const r = i % 3 === 0 ? 1.2 : 0.7;
        return `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,${0.3 + (i % 4) * 0.1})"/>`;
      }).join('')
    : '';

  const sun = theme.sunX
    ? `<circle cx="${theme.sunX}" cy="${theme.sunY}" r="22" fill="${theme.sunColor}" opacity="0.85"/>
       <circle cx="${theme.sunX}" cy="${theme.sunY}" r="32" fill="${theme.sunColor}" opacity="0.18"/>`
    : '';

  // Wake lines behind the ship (gives motion)
  const wake = `
  <path d="M${xOff} ${wlY + 4} Q${xOff + 30} ${wlY - 2} ${xOff + 80} ${wlY + 3}" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
  <path d="M${xOff} ${wlY + 9} Q${xOff + 40} ${wlY + 4} ${xOff + 100} ${wlY + 8}" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="1.5"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 280" width="400" height="280">
  <defs>
    <linearGradient id="sk${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${theme.sky1}"/>
      <stop offset="100%" stop-color="${theme.sky2}"/>
    </linearGradient>
    <linearGradient id="se${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${theme.sea1}"/>
      <stop offset="100%" stop-color="${theme.sea2}"/>
    </linearGradient>
    <radialGradient id="gl${id}" cx="50%" cy="100%" r="50%">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Sky -->
  <rect width="400" height="${wlY}" fill="url(#sk${id})"/>
  ${stars}
  ${sun}
  <!-- Horizon glow -->
  <ellipse cx="200" cy="${wlY}" rx="240" ry="24" fill="${theme.horizon}" opacity="0.35"/>
  <!-- Sea -->
  <rect y="${wlY - 2}" width="400" height="${280 - wlY + 2}" fill="url(#se${id})"/>
  <!-- Horizon line -->
  <line x1="0" y1="${wlY}" x2="400" y2="${wlY}" stroke="${theme.horizon}" stroke-width="0.8" stroke-opacity="0.5"/>
  <!-- Sea surface shimmer -->
  <path d="M0 ${wlY+8} Q100 ${wlY+3} 200 ${wlY+8} Q300 ${wlY+13} 400 ${wlY+8}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
  <path d="M0 ${wlY+20} Q120 ${wlY+15} 240 ${wlY+20} Q320 ${wlY+25} 400 ${wlY+20}" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
  <!-- Ship color glow (reflection on water) -->
  <rect y="${wlY}" width="400" height="${280 - wlY}" fill="url(#gl${id})"/>
  <!-- Ship shadow/reflection -->
  <g transform="translate(${xOff},${wlY}) scale(${sc},0.35)" opacity="0.2">
    <path d="${path}" fill="${color}"/>
  </g>
  ${wake}
  <!-- Ship — large, fills most of frame width -->
  <g transform="translate(${xOff},${yOff}) scale(${sc})">
    <path d="${path}" fill="${color}" stroke="${color}" stroke-width="0.3" opacity="0.96"/>
  </g>
</svg>`;
}

/**
 * Returns an array of 3 data-URI SVG "photo" images of the vessel.
 * variant 0 = night, 1 = dusk, 2 = day — always distinct from the plain silhouette.
 */
export function generateShipPhotos(type, color) {
  return [0, 1, 2].map(variant => {
    const svg = makeSvg(type, color, variant);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}
