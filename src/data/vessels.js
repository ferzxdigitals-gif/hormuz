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

// ── Position zones — every range verified against nautical charts ──
//
// fujairah:        Outer anchorage east of port (east of 56.6°E = open Gulf of Oman)
// gulf_oman:       Main Gulf of Oman shipping lane — 24.8–25.8°N keeps well north of
//                  Oman's coast (Sohar 24.36°N at 56.7°E; coast curves SE from there)
// persian_central: Persian Gulf mid-channel between Iran (~27–28°N) and UAE/Qatar
//                  (~24–25°N) — 26.6–27.8°N at 52–54.5°E is confirmed open water
// persian_north:   Upper Gulf approaches; starts at 28.5°N to stay north of Saudi shore
// chokepoint:      Hormuz TSS — starts at 56.6°E to clear the Musandam peninsula tip
// arabian_sea:     Open Arabian Sea well south of all Oman coastline (no land near 61–65°E)
const POSITION_ZONES = [
  { name: 'fujairah',        lat: [25.08, 25.48], lng: [56.62, 57.15], weight: 12, primaryStatus: 'at anchor' },
  { name: 'gulf_oman',       lat: [24.80, 25.80], lng: [57.80, 60.80], weight: 10, primaryStatus: 'underway' },
  { name: 'persian_central', lat: [26.60, 27.80], lng: [52.00, 54.50], weight: 8,  primaryStatus: 'underway' },
  { name: 'persian_north',   lat: [28.50, 29.30], lng: [48.80, 51.00], weight: 6,  primaryStatus: 'underway' },
  { name: 'chokepoint',      lat: [26.22, 26.52], lng: [56.62, 57.10], weight: 6,  primaryStatus: 'underway' },
  { name: 'arabian_sea',     lat: [20.00, 22.50], lng: [61.50, 65.00], weight: 6,  primaryStatus: 'underway' },
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

function makeVessel(id, totalCount, flag, typeKeys, weights, cumulative, sum, usedNames) {
  const r = Math.random() * sum;
  const typeIdx = cumulative.findIndex(c => r < c);
  const type = typeKeys[typeIdx];

  let name;
  do { name = pick(VESSEL_NAMES); } while (usedNames.has(name));
  usedNames.add(name);

  // Pick position zone based on index for even distribution
  const zone = pickZone(totalCount, id % totalCount);

  const lat = rand(zone.lat[0], zone.lat[1]);
  const lng = rand(zone.lng[0], zone.lng[1]);

  // Status depends on zone
  const zoneStatuses = {
    fujairah:        ['at anchor', 'at anchor', 'moored'],
    gulf_oman:       ['underway', 'underway', 'underway', 'at anchor'],
    persian_central: ['underway', 'underway', 'underway', 'at anchor'],
    persian_north:   ['underway', 'underway', 'moored'],
    chokepoint:      ['underway', 'underway', 'underway'],
    arabian_sea:     ['underway', 'underway', 'underway'],
  };
  const statusPool = zoneStatuses[zone.name] || ['underway'];
  const status = pick(statusPool);

  const speed = status === 'underway' ? +rand(8, 16).toFixed(1) : 0;

  // Direction based on zone location (east of strait = outbound heading, west = inbound)
  const isEast = lng > 56.5;
  const direction = isEast ? 'outbound' : 'inbound';
  const heading = status === 'underway'
    ? (direction === 'inbound' ? Math.floor(rand(250, 310)) : Math.floor(rand(70, 130)))
    : Math.floor(rand(0, 360));

  const origin = pick(ORIGINS);
  let destination;
  do { destination = pick(DESTINATIONS); } while (destination === origin);

  const inductionYear = 1990 + Math.floor(rand(0, 33));
  const countryOrigin = flag; // flag state = country of registry

  return {
    id,
    name,
    mmsi: generateMMSI(flag),
    imo: generateIMO(id),
    type,
    typeLabel: SHIP_TYPES[type].label,
    color: SHIP_TYPES[type].color,
    silhouette: SHIP_TYPES[type].silhouette,
    flag,
    countryOrigin,
    inductionYear,
    lat: +lat.toFixed(5),
    lng: +lng.toFixed(5),
    speed,
    heading,
    origin,
    destination,
    status,
    direction,
    length: Math.floor(rand(80, 340)),
    draft: +rand(6, 22).toFixed(1),
    beam: Math.floor(rand(20, 60)),
    grossTonnage: Math.floor(rand(5000, 180000)),
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
  const usedNames = new Set();

  const guaranteedFlags = [...FLAGS, ...FLAGS];
  guaranteedFlags.forEach((flag, i) => {
    vessels.push(makeVessel(i, count, flag, typeKeys, weights, cumulative, sum, usedNames));
  });

  for (let i = guaranteedFlags.length; i < Math.max(count, guaranteedFlags.length); i++) {
    vessels.push(makeVessel(i, count, pick(FLAGS), typeKeys, weights, cumulative, sum, usedNames));
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
