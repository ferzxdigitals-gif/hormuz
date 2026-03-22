// Local ship photos — served from public/ships/{type}/
// Files were copied from the user's curated "Ships Photo" folder.
// Types with fewer than 3 photos repeat the available ones to fill all 3 slots.
const b = import.meta.env.BASE_URL; // e.g. '/hormuz/'

const LOCAL_PHOTOS = {
  tanker:    [`${b}ships/tanker/1.jpg`,    `${b}ships/tanker/2.jpg`,    `${b}ships/tanker/3.jpg`],
  product:   [`${b}ships/product/1.jpg`,   `${b}ships/product/2.jpg`,   `${b}ships/product/3.jpg`],
  lng:       [`${b}ships/lng/1.jpg`,       `${b}ships/lng/2.jpg`,       `${b}ships/lng/3.jpg`],
  bulk:      [`${b}ships/bulk/1.jpg`,      `${b}ships/bulk/2.jpg`,      `${b}ships/bulk/3.webp`],
  container: [`${b}ships/container/1.jpg`, `${b}ships/container/2.jpg`, `${b}ships/container/3.jpg`],
  cargo:     [`${b}ships/cargo/1.webp`,    `${b}ships/cargo/2.jpg`,     `${b}ships/cargo/3.avif`],
  military:  [`${b}ships/military/1.jpg`,  `${b}ships/military/1.jpg`,  `${b}ships/military/1.jpg`],
  passenger: [`${b}ships/passenger/1.jpg`, `${b}ships/passenger/1.jpg`, `${b}ships/passenger/1.jpg`],
  tug:       [`${b}ships/tug/1.jpg`,       `${b}ships/tug/2.jpg`,       `${b}ships/tug/3.jpg`],
};

/**
 * Returns 3 local photo URLs for the given vessel type (instantly, no network request).
 */
export async function fetchShipPhotos(type) {
  return LOCAL_PHOTOS[type] ?? LOCAL_PHOTOS.cargo;
}

// ────────────────────────────────────────────────────────────────────────────
// SVG fallback — shown while loading or if Wikipedia fetch fails
// Hull: dark red | Superstructure: white | Funnel: vessel accent colour
// ────────────────────────────────────────────────────────────────────────────

const SHIP_PATHS = {
  tanker:    'M5 18 L10 20 L90 20 L95 18 L92 16 L85 14 L80 10 L75 8 L70 8 L65 10 L60 10 L55 10 L20 10 L15 12 L10 16 Z',
  lng:       'M5 18 L10 20 L90 20 L95 18 L90 14 L85 12 L80 10 L75 8 L25 8 L20 10 L15 14 L10 16 Z',
  bulk:      'M5 18 L10 20 L90 20 L95 18 L90 14 L85 10 L80 8 L25 8 L20 10 L15 14 L10 16 Z',
  container: 'M5 18 L10 20 L90 20 L95 18 L92 14 L88 10 L82 7 L78 5 L25 5 L20 8 L15 12 L10 16 Z',
  cargo:     'M5 18 L10 20 L90 20 L95 18 L90 14 L85 10 L78 8 L25 8 L20 10 L15 14 L10 16 Z',
  military:  'M5 16 L15 18 L85 18 L95 16 L90 14 L85 12 L80 10 L75 8 L50 6 L45 4 L40 4 L35 6 L20 8 L15 12 L10 14 Z',
  passenger: 'M5 18 L10 20 L90 20 L95 18 L92 16 L88 12 L82 8 L78 6 L25 6 L20 8 L15 12 L10 16 Z',
  tug:       'M10 16 L15 18 L75 18 L85 16 L80 14 L75 12 L70 10 L60 8 L40 8 L30 10 L20 12 L15 14 Z',
};

const THEMES = [
  { sky1: '#020d1e', sky2: '#05182e', sea1: '#040f1e', sea2: '#020a14', hor: '#0a3060', stars: true },
  { sky1: '#2c0a3a', sky2: '#c05515', sea1: '#0c2538', sea2: '#061828', hor: '#ff8c1a', stars: false },
  { sky1: '#1565c0', sky2: '#5fb3f5', sea1: '#0d47a1', sea2: '#01579b', hor: '#bbdefb', stars: false },
];

function makeSvg(type, color, variant) {
  const path  = SHIP_PATHS[type] ?? SHIP_PATHS.cargo;
  const t     = THEMES[variant];
  const id    = `${type}${variant}`;
  const sc = 3.5, xOff = 25, yOff = 172, wlY = yOff + 20 * sc;

  const stars = t.stars ? Array.from({ length: 20 }, (_, i) => {
    const x = ((i * 73 + 17) % 380) + 10;
    const y = ((i * 47 + 11) % 130) + 5;
    return `<circle cx="${x}" cy="${y}" r="${i % 3 ? 0.7 : 1.2}" fill="rgba(255,255,255,${0.28 + (i % 4) * 0.1})"/>`;
  }).join('') : '';

  const sun = variant === 2
    ? `<circle cx="330" cy="50" r="18" fill="#fffde7" opacity="0.9"/>
       <circle cx="330" cy="50" r="34" fill="#fff9c4" opacity="0.18"/>`
    : variant === 1
    ? `<circle cx="320" cy="148" r="18" fill="#ffb347" opacity="0.85"/>
       <circle cx="320" cy="148" r="34" fill="#ff6600" opacity="0.18"/>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 280" width="400" height="280">
  <defs>
    <linearGradient id="sk${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${t.sky1}"/><stop offset="100%" stop-color="${t.sky2}"/>
    </linearGradient>
    <linearGradient id="se${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${t.sea1}"/><stop offset="100%" stop-color="${t.sea2}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="${wlY+2}" fill="url(#sk${id})"/>
  ${stars}${sun}
  <ellipse cx="200" cy="${wlY}" rx="240" ry="20" fill="${t.hor}" opacity="0.4"/>
  <rect y="${wlY}" width="400" height="${280-wlY}" fill="url(#se${id})"/>
  <g transform="translate(${xOff},${yOff}) scale(${sc})">
    <path d="${path}" fill="#7a0000" stroke="#4a0000" stroke-width="0.45"/>
    <line x1="6" y1="17.5" x2="92" y2="17.5" stroke="#ddd" stroke-width="0.7" opacity="0.5"/>
    <rect x="67" y="2" width="19" height="10" rx="0.4" fill="#f0f0f0" stroke="#bbb" stroke-width="0.3"/>
    <rect x="68.5" y="3"  width="3" height="2"   fill="#a8d8ff" opacity="0.85" rx="0.2"/>
    <rect x="72.5" y="3"  width="3" height="2"   fill="#a8d8ff" opacity="0.85" rx="0.2"/>
    <rect x="76.5" y="3"  width="3" height="2"   fill="#a8d8ff" opacity="0.85" rx="0.2"/>
    <rect x="68.5" y="6"  width="3" height="1.8" fill="#a8d8ff" opacity="0.7"  rx="0.2"/>
    <rect x="72.5" y="6"  width="3" height="1.8" fill="#a8d8ff" opacity="0.7"  rx="0.2"/>
    <rect x="76.5" y="6"  width="3" height="1.8" fill="#a8d8ff" opacity="0.7"  rx="0.2"/>
    <rect x="75" y="-2" width="5" height="5" rx="0.4" fill="${color}" stroke="#1a1a1a" stroke-width="0.4"/>
  </g>
</svg>`;
}

export function generateShipPhotos(type, color) {
  return [0, 1, 2].map(v =>
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(makeSvg(type, color, v))}`
  );
}
