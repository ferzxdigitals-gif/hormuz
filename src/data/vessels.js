// ── Realistic simulated AIS data for Strait of Hormuz region ──

export const COUNTRY_CODES = {
  'Panama': 'PA', 'Liberia': 'LR', 'Marshall Islands': 'MH', 'Iran': 'IR',
  'Saudi Arabia': 'SA', 'UAE': 'AE', 'China': 'CN', 'India': 'IN',
  'Singapore': 'SG', 'Bahamas': 'BS', 'Greece': 'GR', 'Malta': 'MT',
  'Japan': 'JP', 'South Korea': 'KR', 'Norway': 'NO', 'United Kingdom': 'GB',
  'USA': 'US', 'Qatar': 'QA', 'Kuwait': 'KW', 'Oman': 'OM',
};

// MMSI Maritime Identification Digits (MID) — first 3 digits identify the country
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
};

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

function rand(a, b) { return a + Math.random() * (b - a); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function jitterAlongLane(lane, progress) {
  const idx = Math.min(Math.floor(progress * (lane.length - 1)), lane.length - 2);
  const t = (progress * (lane.length - 1)) - idx;
  const p0 = lane[idx], p1 = lane[idx + 1];
  return {
    lat: p0.lat + (p1.lat - p0.lat) * t + rand(-0.06, 0.06),
    lng: p0.lng + (p1.lng - p0.lng) * t + rand(-0.06, 0.06),
  };
}

function makeVessel(id, flag, typeKeys, weights, cumulative, sum, usedNames) {
  const r = Math.random() * sum;
  const typeIdx = cumulative.findIndex(c => r < c);
  const type = typeKeys[typeIdx];

  let name;
  do { name = pick(VESSEL_NAMES); } while (usedNames.has(name));
  usedNames.add(name);

  const direction = Math.random() > 0.5 ? 'inbound' : 'outbound';
  const pos = jitterAlongLane(LANES[direction], Math.random());

  const statuses = ['underway', 'underway', 'underway', 'at anchor', 'moored'];
  const status = pick(statuses);
  const speed = status === 'underway' ? +rand(8, 16).toFixed(1) : 0;
  const heading = status === 'underway'
    ? (direction === 'inbound' ? Math.floor(rand(260, 310)) : Math.floor(rand(80, 130)))
    : 0;

  const origin = pick(ORIGINS);
  let destination;
  do { destination = pick(DESTINATIONS); } while (destination === origin);

  return {
    id,
    name,
    mmsi: generateMMSI(flag),
    type,
    typeLabel: SHIP_TYPES[type].label,
    color: SHIP_TYPES[type].color,
    silhouette: SHIP_TYPES[type].silhouette,
    flag,
    lat: +pos.lat.toFixed(5),
    lng: +pos.lng.toFixed(5),
    speed,
    heading,
    origin,
    destination,
    status,
    direction,
    length: Math.floor(rand(80, 340)),
    draft: +rand(6, 22).toFixed(1),
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

  // Guarantee every flag appears at least twice
  const guaranteedFlags = [...FLAGS, ...FLAGS];
  guaranteedFlags.forEach((flag, i) => {
    vessels.push(makeVessel(i, flag, typeKeys, weights, cumulative, sum, usedNames));
  });

  // Fill the rest randomly
  for (let i = guaranteedFlags.length; i < Math.max(count, guaranteedFlags.length); i++) {
    vessels.push(makeVessel(i, pick(FLAGS), typeKeys, weights, cumulative, sum, usedNames));
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
