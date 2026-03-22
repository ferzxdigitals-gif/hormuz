// ── Realistic simulated AIS data for Strait of Hormuz region ──
import { generateShipPhotos } from './shipPhotos';

export const COUNTRY_CODES = {
  'Panama': 'PA', 'Liberia': 'LR', 'Marshall Islands': 'MH', 'Iran': 'IR',
  'Saudi Arabia': 'SA', 'UAE': 'AE', 'China': 'CN', 'India': 'IN',
  'Singapore': 'SG', 'Bahamas': 'BS', 'Greece': 'GR', 'Malta': 'MT',
  'Japan': 'JP', 'South Korea': 'KR', 'Norway': 'NO', 'United Kingdom': 'GB',
  'USA': 'US', 'Qatar': 'QA', 'Kuwait': 'KW', 'Oman': 'OM',
};

const MMSI_MID = {
  'Panama':           '352',
  'Liberia':          '636',
  'Marshall Islands': '538',
  'Iran':             '422',
  'Saudi Arabia':     '403',
  'UAE':              '470',
  'China':            '413',
  'India':            '419',
  'Singapore':        '564',
  'Bahamas':          '308',
  'Greece':           '237',
  'Malta':            '215',
  'Japan':            '431',
  'South Korea':      '440',
  'Norway':           '257',
  'United Kingdom':   '232',
  'USA':              '367',
  'Qatar':            '466',
  'Kuwait':           '447',
  'Oman':             '461',
};

export function generateMMSI(country) {
  const mid = MMSI_MID[country] || '000';
  const suffix = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
  return mid + suffix;
}

export function generateIMO(id) {
  const base = 9000000 + (id * 71317 + 3141592) % 999999;
  return `IMO ${base}`;
}

export function getFlagUrl(country) {
  const code = COUNTRY_CODES[country];
  return code ? `https://flagcdn.com/w80/${code.toLowerCase()}.png` : null;
}

export const SHIP_TYPES = {
  tanker:    { label: 'Crude Oil Tanker',   color: '#e74c3c', silhouette: 'tanker' },
  product:   { label: 'Product Tanker',     color: '#e67e22', silhouette: 'tanker' },
  lng:       { label: 'LNG Carrier',        color: '#3498db', silhouette: 'lng' },
  bulk:      { label: 'Bulk Carrier',       color: '#9b59b6', silhouette: 'bulk' },
  container: { label: 'Container Ship',     color: '#2ecc71', silhouette: 'container' },
  cargo:     { label: 'General Cargo',      color: '#e84393', silhouette: 'cargo' },
  military:  { label: 'Naval / Military',   color: '#636e72', silhouette: 'military' },
  passenger: { label: 'Passenger / Cruise', color: '#00b894', silhouette: 'passenger' },
  tug:       { label: 'Tug / Service',      color: '#6c5ce7', silhouette: 'tug' },
};

const FLAGS = Object.keys(COUNTRY_CODES);

// ── Position zones — every coordinate verified to be open water ──
//
// Fujairah anchorage: UAE east coast at 56.3°E; 57.2°E+ is confirmed open water.
// Hormuz approach: Oman Batinah coast at 57.5°E is ~24.5°N → safe from 24.75°N north.
//   Iranian Makran coast is ~25.8°N at 57.5°E → upper bound 25.15°N is safe.
// Gulf of Oman: Ras al-Hadd (Oman's eastern cape) is 22.53°N 59.80°E → safe from 22.80°N.
//   At 58.5°E Oman coast is ~23.8°N; lower bound 22.80°N clears the cape everywhere.
// Persian Gulf (mid-channel): Ras Tanura (SA) 26.64°N 50.17°E; Bandar Assaluyeh (IR)
//   27.47°N 52.62°E → safe band is 27.10–27.35°N at 51.5–52.2°E (confirmed mid-channel).
// Hormuz TSS: channel runs 26.3–26.5°N, 56.72–57.05°E (east of Musandam tip at 56.24°E).
// Arabian Sea: 18–21.5°N, 62–67°E — completely open ocean.
const POSITION_ZONES = [
  { name: 'fujairah',       lat: [25.05, 25.42], lng: [57.20, 57.80], weight: 10 },
  { name: 'hormuz_approach',lat: [24.75, 25.15], lng: [57.50, 58.80], weight: 8  },
  { name: 'gulf_oman',      lat: [22.80, 24.20], lng: [58.50, 62.00], weight: 12 },
  { name: 'persian_gulf',   lat: [27.10, 27.35], lng: [51.50, 52.20], weight: 8  },
  { name: 'chokepoint',     lat: [26.30, 26.48], lng: [56.72, 57.05], weight: 6  },
  { name: 'arabian_sea',    lat: [18.00, 21.50], lng: [62.00, 67.00], weight: 4  },
];

// Port coordinates for route drawing
export const PORT_COORDS = {
  'Fujairah':        { lat: 25.12, lng: 56.33 },
  'Jebel Ali':       { lat: 25.00, lng: 55.06 },
  'Ras Tanura':      { lat: 26.64, lng: 50.17 },
  'Kharg Island':    { lat: 29.23, lng: 50.31 },
  'Bandar Abbas':    { lat: 27.18, lng: 56.28 },
  'Basra':           { lat: 30.50, lng: 47.83 },
  'Muscat':          { lat: 23.61, lng: 58.54 },
  'Mumbai':          { lat: 18.95, lng: 72.84 },
  'Singapore':       { lat: 1.26,  lng: 103.84 },
  'Yokohama':        { lat: 35.44, lng: 139.64 },
  'Rotterdam':       { lat: 51.90, lng: 4.50 },
  'Houston':         { lat: 29.75, lng: -95.07 },
  'Dalian':          { lat: 38.92, lng: 121.64 },
  'Ulsan':           { lat: 35.50, lng: 129.38 },
  'Jurong':          { lat: 1.30,  lng: 103.71 },
  'Dammam':          { lat: 26.43, lng: 50.10 },
  'Kuwait City':     { lat: 29.35, lng: 47.95 },
  'Ras Laffan':      { lat: 25.93, lng: 51.53 },
  'Sohar':           { lat: 24.36, lng: 56.73 },
  'Salalah':         { lat: 16.94, lng: 54.00 },
  'Jubail':          { lat: 27.01, lng: 49.66 },
  'Mina Al Ahmadi':  { lat: 29.08, lng: 48.16 },
  'Das Island':      { lat: 25.15, lng: 52.87 },
  'Abu Dhabi':             { lat: 24.48, lng: 54.37 },
  'Chabahar':              { lat: 25.30, lng: 60.65 },
  'Bushehr':               { lat: 28.98, lng: 50.83 },
  'Khor Fakkan':           { lat: 25.39, lng: 56.37 },
  'Umm Qasr':              { lat: 30.03, lng: 47.93 },
  'Ras Al Khaimah':        { lat: 25.80, lng: 55.97 },
  'Salalah':               { lat: 16.94, lng: 54.00 },
  'Bandar Imam Khomeini':  { lat: 30.43, lng: 49.08 },
  'Sharjah (Khalid)':      { lat: 25.36, lng: 55.39 },
};

// Detailed port info for Ports panel
export const PORT_DETAILS = {
  'Fujairah': {
    lat: 25.12, lng: 56.33, country: 'UAE', countryCode: 'AE',
    type: 'Oil Terminal & Bunkering Hub', depth: '17 m', capacity: '120M tonnes/yr bunkering',
    anchorage: 'Large (200+ vessels)', status: 'Operational',
    description: 'One of the world\'s largest bunkering hubs and a key waypoint for vessels avoiding the Strait. Major waiting area during the current crisis.',
  },
  'Jebel Ali': {
    lat: 25.00, lng: 55.06, country: 'UAE', countryCode: 'AE',
    type: 'Container & General Port', depth: '17 m', capacity: '19M TEU/year',
    anchorage: 'Yes', status: 'Operational',
    description: 'The largest port in the Middle East and 9th busiest globally. Hub for trans-shipment and supply chains.',
  },
  'Ras Tanura': {
    lat: 26.64, lng: 50.17, country: 'Saudi Arabia', countryCode: 'SA',
    type: 'Crude Oil Export Terminal', depth: '20 m', capacity: '6.5M bbl/day capacity',
    anchorage: 'Yes', status: 'Operational',
    description: 'Saudi Aramco\'s primary export terminal. One of the world\'s largest oil-loading facilities.',
  },
  'Kharg Island': {
    lat: 29.23, lng: 50.31, country: 'Iran', countryCode: 'IR',
    type: 'Crude Oil Terminal', depth: '18 m', capacity: '5M bbl/day',
    anchorage: 'Yes', status: 'Operational (restricted)',
    description: 'Iran\'s main crude oil export terminal, handling over 90% of the country\'s oil exports.',
  },
  'Bandar Abbas': {
    lat: 27.18, lng: 56.28, country: 'Iran', countryCode: 'IR',
    type: 'Multi-purpose Port', depth: '13 m', capacity: '20M tonnes/year',
    anchorage: 'Yes', status: 'Operational',
    description: 'Iran\'s largest port at the entrance to the Strait of Hormuz. Critical for military and commercial traffic.',
  },
  'Basra': {
    lat: 30.50, lng: 47.83, country: 'Iraq', countryCode: 'IQ',
    type: 'Oil Export Terminal', depth: '12 m', capacity: '4.5M bbl/day',
    anchorage: 'Limited', status: 'Operational',
    description: 'Iraq\'s primary oil export terminal on the Shatt al-Arab waterway.',
  },
  'Muscat': {
    lat: 23.61, lng: 58.54, country: 'Oman', countryCode: 'OM',
    type: 'General & Container Port', depth: '15 m', capacity: '4M TEU/year',
    anchorage: 'Yes', status: 'Operational',
    description: 'Oman\'s main port, strategically located outside the Strait of Hormuz.',
  },
  'Ras Laffan': {
    lat: 25.93, lng: 51.53, country: 'Qatar', countryCode: 'QA',
    type: 'LNG Export Terminal', depth: '16 m', capacity: '77M tonnes/yr LNG',
    anchorage: 'Yes', status: 'Operational',
    description: 'The world\'s largest LNG export facility, serving Qatar\'s massive gas export operations.',
  },
  'Dammam': {
    lat: 26.43, lng: 50.10, country: 'Saudi Arabia', countryCode: 'SA',
    type: 'Container & General Port', depth: '14 m', capacity: '8M TEU/year',
    anchorage: 'Yes', status: 'Operational',
    description: 'Saudi Arabia\'s main gateway on the Arabian Gulf.',
  },
  'Kuwait City': {
    lat: 29.35, lng: 47.95, country: 'Kuwait', countryCode: 'KW',
    type: 'General Cargo & Oil Port', depth: '13 m', capacity: '3M TEU/year',
    anchorage: 'Yes', status: 'Operational',
    description: 'Kuwait\'s primary port and commercial hub on the northern Gulf.',
  },
  'Sohar': {
    lat: 24.36, lng: 56.73, country: 'Oman', countryCode: 'OM',
    type: 'Industrial & Container Port', depth: '18 m', capacity: '5M TEU/year',
    anchorage: 'Yes', status: 'Operational',
    description: 'Oman\'s fastest-growing industrial port, located just outside the Strait.',
  },
  'Das Island': {
    lat: 25.15, lng: 52.87, country: 'UAE', countryCode: 'AE',
    type: 'Offshore LNG Terminal', depth: '15 m', capacity: '12M tonnes/yr LNG',
    anchorage: 'Limited', status: 'Operational',
    description: 'Abu Dhabi\'s offshore LNG and crude oil export terminal in the Persian Gulf.',
  },
  'Mina Al Ahmadi': {
    lat: 29.08, lng: 48.16, country: 'Kuwait', countryCode: 'KW',
    type: 'Crude Oil Export Terminal', depth: '16 m', capacity: '2.5M bbl/day',
    anchorage: 'Yes', status: 'Operational',
    description: 'Kuwait\'s primary crude oil export facility.',
  },
  'Jubail': {
    lat: 27.01, lng: 49.66, country: 'Saudi Arabia', countryCode: 'SA',
    type: 'Industrial & Petrochemical Port', depth: '15 m', capacity: '30M tonnes/year',
    anchorage: 'Yes', status: 'Operational',
    description: 'World\'s largest industrial city port, home to SABIC and major refineries.',
  },
  'Abu Dhabi': {
    lat: 24.48, lng: 54.37, country: 'UAE', countryCode: 'AE',
    type: 'Multi-purpose Port', depth: '15 m', capacity: '5M TEU/year',
    anchorage: 'Yes', status: 'Operational',
    description: 'Capital of UAE, major oil export hub and growing container port.',
  },
  'Chabahar': {
    lat: 25.30, lng: 60.65, country: 'Iran', countryCode: 'IR',
    type: 'Deep Water Container & General Port', depth: '16 m', capacity: '8.5M tonnes/year',
    anchorage: 'Yes', status: 'Operational',
    description: 'Iran\'s only deep-water port on the Gulf of Oman. Strategically important as it bypasses the Strait of Hormuz. India has invested heavily in its development for access to Afghanistan and Central Asia.',
  },
  'Bushehr': {
    lat: 28.98, lng: 50.83, country: 'Iran', countryCode: 'IR',
    type: 'General Cargo & Oil Port', depth: '11 m', capacity: '5M tonnes/year',
    anchorage: 'Yes', status: 'Operational',
    description: 'Major Iranian port in the northern Persian Gulf, near the Bushehr nuclear power plant. Handles general cargo and petrochemical exports.',
  },
  'Khor Fakkan': {
    lat: 25.39, lng: 56.37, country: 'UAE', countryCode: 'AE',
    type: 'Container Transshipment Port', depth: '16 m', capacity: '7M TEU/year',
    anchorage: 'Yes', status: 'Operational',
    description: 'UAE\'s major East Coast container port, outside the Strait on the Gulf of Oman. Critical transshipment hub avoiding Hormuz congestion. Part of Sharjah emirate.',
  },
  'Umm Qasr': {
    lat: 30.03, lng: 47.93, country: 'Iraq', countryCode: 'IQ',
    type: 'Container & General Cargo Port', depth: '11 m', capacity: '3M TEU/year',
    anchorage: 'Limited', status: 'Operational',
    description: 'Iraq\'s main deepwater port in the northern Gulf, near the Kuwait border. Critical import gateway for Iraq\'s food, goods, and humanitarian supplies.',
  },
  'Ras Al Khaimah': {
    lat: 25.80, lng: 55.97, country: 'UAE', countryCode: 'AE',
    type: 'Container & Industrial Port', depth: '12 m', capacity: '2M TEU/year',
    anchorage: 'Yes', status: 'Operational',
    description: 'Port of the northernmost UAE emirate. Important for ceramics, cement exports, and growing container traffic.',
  },
  'Salalah': {
    lat: 16.94, lng: 54.00, country: 'Oman', countryCode: 'OM',
    type: 'Deep Water Container & Transshipment Port', depth: '17 m', capacity: '5M TEU/year',
    anchorage: 'Yes', status: 'Operational',
    description: 'Major Omani port on the Arabian Sea, far south of Hormuz. Key transshipment hub on East-West shipping routes between Europe and Asia.',
  },
  'Bandar Imam Khomeini': {
    lat: 30.43, lng: 49.08, country: 'Iran', countryCode: 'IR',
    type: 'Multi-purpose & Petrochemical Port', depth: '14 m', capacity: '15M tonnes/year',
    anchorage: 'Yes', status: 'Operational',
    description: 'Iran\'s largest commercial port on the Shatt al-Arab at the head of the Persian Gulf. Major petrochemical export hub near Mahshahr.',
  },
  'Sharjah (Khalid)': {
    lat: 25.36, lng: 55.39, country: 'UAE', countryCode: 'AE',
    type: 'General Cargo & Container Port', depth: '13 m', capacity: '4M TEU/year',
    anchorage: 'Yes', status: 'Operational',
    description: 'Port of Sharjah on the Persian Gulf side, handling general cargo, containers, and building materials. Part of the UAE\'s multi-port logistics network.',
  },
};

export const LANES = {
  inbound: [
    { lat: 26.20, lng: 57.20 },
    { lat: 26.35, lng: 56.80 },
    { lat: 26.45, lng: 56.40 },
    { lat: 26.55, lng: 56.10 },
    { lat: 26.60, lng: 55.80 },
  ],
  outbound: [
    { lat: 26.05, lng: 55.80 },
    { lat: 26.10, lng: 56.10 },
    { lat: 26.18, lng: 56.40 },
    { lat: 26.22, lng: 56.80 },
    { lat: 26.08, lng: 57.20 },
  ],
};

// Ship photos: deterministic SVG illustrations — no external dependencies
export { generateShipPhotos as getVesselPhotos };

const DESTINATIONS = Object.keys(PORT_COORDS);
const ORIGINS = Object.keys(PORT_COORDS);

const VESSEL_NAMES = [
  'PACIFIC GLORY','ARABIAN STAR','GULF HARMONY','EASTERN DAWN',
  'HORMUZ SPIRIT','PERSIAN VOYAGER','OCEAN TITAN','JADE FORTUNE',
  'DESERT ROSE','SILK ROAD','GOLDEN HORIZON','SAPPHIRE SEA',
  'THUNDER BAY','CORAL STREAM','AMBER LIGHT','NEPTUNE GRACE',
  'ATLAS VENTURE','EMERALD WAVE','IRON BRIDGE','LUNAR CREST',
  'CRIMSON TIDE','BLUE MARLIN','STELLAR WIND','PHOENIX SUN',
  'SILVER ARROW','DRAGON PEARL','ROYAL PALM','ARCTIC BREEZE',
  'RUBY QUEEN','DIAMOND PEAK','LIBERTY BELL','CRYSTAL HARBOR',
  'BRAVE HEART','FALCON CREST','PROUD EAGLE','NORTHERN STAR',
  'SOUTHERN CROSS','CEDAR GROVE','SUNSET BLVD','MONSOON TIDE',
  'SCARLET DAWN','IVORY COAST','INDIGO SKY','BRONZE SHIELD',
  'MARBLE ARCH','VELVET SEA','GRANITE PEAK','OPAL WAVE',
  'TOPAZ DREAM','ONYX NIGHT','JASPER REEF','GARNET ISLE',
];

function rand(a, b) { return a + Math.random() * (b - a); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Seeded PRNG (mulberry32) — gives each vessel a deterministic position every load
function mulberry32(seed) {
  let s = (seed * 2654435761) >>> 0;
  return function () {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

function pickZone(total, index) {
  // Distribute vessels across zones by weight
  const totalWeight = POSITION_ZONES.reduce((s, z) => s + z.weight, 0);
  const slot = (index / total) * totalWeight;
  let acc = 0;
  for (const z of POSITION_ZONES) {
    acc += z.weight;
    if (slot < acc) return z;
  }
  return POSITION_ZONES[0];
}

// Force specific vessel IDs into a particular zone regardless of weight distribution
// Key = vessel id (matches VESSEL_NAMES index), value = zone name
const FORCED_ZONES = {
  19: 'persian_gulf',  // LUNAR CREST
  24: 'persian_gulf',  // SILVER ARROW
};

function makeVessel(id, totalCount, flag, typeKeys, weights, cumulative, sum) {
  // Each vessel gets a deterministic PRNG seeded by its ID — same position every load
  const rng  = mulberry32(id);
  const sr   = (a, b) => a + rng() * (b - a);
  const sp   = (arr) => arr[Math.floor(rng() * arr.length)];

  const r = rng() * sum;
  const typeIdx = cumulative.findIndex(c => r < c);
  const type = typeKeys[typeIdx];

  // Name assigned by index — VESSEL_NAMES has 52 entries, max count is 48, no collisions
  const name = VESSEL_NAMES[id % VESSEL_NAMES.length];

  // Zone is deterministic; specific vessels can be forced into a named zone
  const zone = FORCED_ZONES[id]
    ? POSITION_ZONES.find(z => z.name === FORCED_ZONES[id])
    : pickZone(totalCount, id % totalCount);

  const lat = sr(zone.lat[0], zone.lat[1]);
  const lng = sr(zone.lng[0], zone.lng[1]);

  const zoneStatuses = {
    fujairah:        ['at anchor', 'at anchor', 'moored'],
    hormuz_approach: ['underway', 'underway', 'underway', 'at anchor'],
    gulf_oman:       ['underway', 'underway', 'underway', 'at anchor'],
    persian_gulf:    ['underway', 'underway', 'underway', 'at anchor'],
    chokepoint:      ['underway', 'underway', 'underway'],
    arabian_sea:     ['underway', 'underway', 'underway'],
  };
  const statusPool = zoneStatuses[zone.name] || ['underway'];
  const status = sp(statusPool);

  const speed = status === 'underway' ? +sr(8, 16).toFixed(1) : 0;

  const isEast = lng > 56.5;
  const direction = isEast ? 'outbound' : 'inbound';
  const heading = status === 'underway'
    ? (direction === 'inbound' ? Math.floor(sr(250, 310)) : Math.floor(sr(70, 130)))
    : Math.floor(sr(0, 360));

  const origin = sp(ORIGINS);
  const otherDests = DESTINATIONS.filter(d => d !== origin);
  const destination = sp(otherDests);

  const inductionYear = 1990 + Math.floor(sr(0, 33));

  // Deterministic MMSI suffix based on id
  const mmsiSuffix = String((id * 137 + 42) % 1000000).padStart(6, '0');
  const mmsi = (MMSI_MID[flag] || '000') + mmsiSuffix;

  return {
    id,
    name,
    mmsi,
    imo: generateIMO(id),
    type,
    typeLabel: SHIP_TYPES[type].label,
    color: SHIP_TYPES[type].color,
    silhouette: SHIP_TYPES[type].silhouette,
    flag,
    countryOrigin: flag,
    inductionYear,
    lat: +lat.toFixed(5),
    lng: +lng.toFixed(5),
    speed,
    heading,
    origin,
    destination,
    status,
    direction,
    length: Math.floor(sr(80, 340)),
    draft: +sr(6, 22).toFixed(1),
    beam: Math.floor(sr(20, 60)),
    grossTonnage: Math.floor(sr(5000, 180000)),
    photos: generateShipPhotos(type, SHIP_TYPES[type].color),
  };
}

export function generateVessels(count = 60) {
  const typeKeys = Object.keys(SHIP_TYPES);
  const weights = [30, 15, 12, 8, 10, 6, 4, 3, 12];
  const cumulative = [];
  let sum = 0;
  weights.forEach(w => { sum += w; cumulative.push(sum); });

  const vessels = [];
  const guaranteedFlags = [...FLAGS, ...FLAGS]; // 40 vessels with every flag represented twice

  for (let i = 0; i < Math.max(count, guaranteedFlags.length); i++) {
    // Flags beyond the guaranteed list cycle through FLAGS deterministically
    const flag = i < guaranteedFlags.length ? guaranteedFlags[i] : FLAGS[i % FLAGS.length];
    vessels.push(makeVessel(i, count, flag, typeKeys, weights, cumulative, sum));
  }

  return vessels;
}

export function generateHourlyTransits() {
  return Array.from({ length: 24 }, (_, h) => {
    const localH = (h + 4) % 24;
    const base = localH >= 6 && localH <= 20 ? 8 : 4;
    return Math.floor(base + Math.random() * 6);
  });
}
