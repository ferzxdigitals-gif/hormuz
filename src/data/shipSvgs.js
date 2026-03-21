export const SILHOUETTE_PATHS = {
  tanker:    'M5 18 L10 20 L90 20 L95 18 L92 16 L85 14 L80 10 L75 8 L70 8 L65 10 L60 10 L55 10 L20 10 L15 12 L10 16 Z M72 8 L72 4 L74 4 L74 8 M40 10 L40 6 L55 6 L55 10',
  lng:       'M5 18 L10 20 L90 20 L95 18 L90 14 L85 12 L80 10 L75 8 L25 8 L20 10 L15 14 L10 16 Z M30 8 L30 3 Q40 0 50 3 L50 8 M55 8 L55 3 Q65 0 75 3 L75 8',
  bulk:      'M5 18 L10 20 L90 20 L95 18 L90 14 L85 10 L80 8 L25 8 L20 10 L15 14 L10 16 Z M30 8 L30 5 L75 5 L75 8 M70 5 L72 2 L74 2 L74 5',
  container: 'M5 18 L10 20 L90 20 L95 18 L92 14 L88 10 L82 7 L78 5 L25 5 L20 8 L15 12 L10 16 Z M28 5 L28 2 L75 2 L75 5 M76 5 L78 1 L80 1 L80 5 M30 5 L30 2 M40 5 L40 2 M50 5 L50 2 M60 5 L60 2 M70 5 L70 2',
  cargo:     'M5 18 L10 20 L90 20 L95 18 L90 14 L85 10 L78 8 L25 8 L20 10 L15 14 L10 16 Z M60 8 L60 3 L65 3 L65 8 M62 3 L62 1 L63 1 L63 3 M30 8 L30 5 L50 5 L50 8',
  military:  'M5 16 L15 18 L85 18 L95 16 L90 14 L85 12 L80 10 L75 8 L50 6 L45 4 L40 4 L35 6 L20 8 L15 12 L10 14 Z M45 4 L45 1 L47 1 L47 4 M55 6 L55 3 L57 3 L57 6 M60 8 L70 8 L70 6 L60 6 Z',
  passenger: 'M5 18 L10 20 L90 20 L95 18 L92 16 L88 12 L82 8 L78 6 L25 6 L20 8 L15 12 L10 16 Z M28 6 L28 2 L75 2 L75 6 M30 2 L30 0 L32 0 L32 2 M34 4 L40 4 L40 2 M44 4 L50 4 L50 2 M54 4 L60 4 L60 2 M64 4 L70 4 L70 2 M76 6 L78 3 L80 6',
  tug:       'M10 16 L15 18 L75 18 L85 16 L80 14 L75 12 L70 10 L60 8 L40 8 L30 10 L20 12 L15 14 Z M55 8 L55 4 L58 4 L58 8 M45 8 L45 5 L50 5 L50 8',
};

export function getShipMarkerHtml(vessel, isSelected = false) {
  const path = SILHOUETTE_PATHS[vessel.silhouette] || SILHOUETTE_PATHS.cargo;
  const flagCode = {
    'Panama':'pa','Liberia':'lr','Marshall Islands':'mh','Iran':'ir',
    'Saudi Arabia':'sa','UAE':'ae','China':'cn','India':'in',
    'Singapore':'sg','Bahamas':'bs','Greece':'gr','Malta':'mt',
    'Japan':'jp','South Korea':'kr','Norway':'no','United Kingdom':'gb',
    'USA':'us','Qatar':'qa','Kuwait':'kw','Oman':'om',
  }[vessel.flag] || 'un';

  const rotation = vessel.heading || 0;
  const selClass = isSelected ? ' selected' : '';
  const glow     = isSelected ? `filter: drop-shadow(0 0 6px ${vessel.color});` : '';

  return `
    <div class="ship-marker-wrap">
      <div class="ship-icon-container${selClass}" style="transform: rotate(${rotation - 90}deg)">
        <svg viewBox="0 0 100 22" width="44" height="11" class="ship-svg" style="${glow}">
          <g fill="${vessel.color}" stroke="${vessel.color}" stroke-width="0.8">
            <path d="${path}" />
          </g>
        </svg>
      </div>
      <img src="https://flagcdn.com/w40/${flagCode}.png" class="ship-flag-badge" alt="${vessel.flag}" />
      <div class="ship-name-label" style="border-left: 3px solid ${vessel.color}; ${isSelected ? `color: ${vessel.color};` : ''}">${vessel.name}</div>
    </div>
  `;
}
