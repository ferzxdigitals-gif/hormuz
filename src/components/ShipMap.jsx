import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import {
  MapContainer, TileLayer, Marker, Polyline,
  Popup, Tooltip, useMap,
} from 'react-leaflet';
import { SHIP_TYPES, LANES, getFlagUrl, PORT_COORDS } from '../data/vessels';
import { getShipMarkerHtml } from '../data/shipSvgs';

// ── Build a curved route: origin → strait waypoint → current pos → strait waypoint → destination ──
function buildRoute(vessel) {
  const originCoord = PORT_COORDS[vessel.origin];
  const destCoord = PORT_COORDS[vessel.destination];
  if (!originCoord || !destCoord) return { traveled: [], remaining: [] };

  // Pick strait waypoints based on direction
  const straitEntry = vessel.direction === 'outbound'
    ? { lat: 26.55, lng: 56.0 }
    : { lat: 26.15, lng: 57.1 };
  const straitExit = vessel.direction === 'outbound'
    ? { lat: 26.10, lng: 57.1 }
    : { lat: 26.50, lng: 56.0 };

  const traveled = [
    [originCoord.lat, originCoord.lng],
    [straitEntry.lat, straitEntry.lng],
    [vessel.lat, vessel.lng],
  ];
  const remaining = [
    [vessel.lat, vessel.lng],
    [straitExit.lat, straitExit.lng],
    [destCoord.lat, destCoord.lng],
  ];

  return { traveled, remaining };
}

// ── Arrow marker at ship's heading ──
function DirectionArrow({ vessel }) {
  if (vessel.status !== 'underway') return null;
  const rad = (vessel.heading) * Math.PI / 180;
  const d = 0.07;
  const tipLat = vessel.lat + d * Math.cos(rad);
  const tipLng = vessel.lng + d * Math.sin(rad);

  // Arrowhead triangle
  const arrowSize = 0.02;
  const leftRad = rad + Math.PI * 0.8;
  const rightRad = rad - Math.PI * 0.8;
  const pts = [
    [tipLat, tipLng],
    [tipLat + arrowSize * Math.cos(leftRad), tipLng + arrowSize * Math.sin(leftRad)],
    [tipLat + arrowSize * Math.cos(rightRad), tipLng + arrowSize * Math.sin(rightRad)],
    [tipLat, tipLng],
  ];

  return (
    <>
      <Polyline
        positions={[[vessel.lat, vessel.lng], [tipLat, tipLng]]}
        pathOptions={{ color: vessel.color, weight: 2.5, opacity: 0.8 }}
      />
      <Polyline
        positions={pts}
        pathOptions={{ color: vessel.color, weight: 1, opacity: 0.9, fill: true, fillColor: vessel.color, fillOpacity: 0.9 }}
      />
    </>
  );
}

function ShipMarker({ vessel, onSelect }) {
  const icon = useMemo(() => L.divIcon({
    html: getShipMarkerHtml(vessel),
    className: 'ship-div-icon',
    iconSize: [60, 50],
    iconAnchor: [30, 25],
    popupAnchor: [0, -20],
  }), [vessel.id, vessel.heading, vessel.lat, vessel.lng]);

  return (
    <Marker
      position={[vessel.lat, vessel.lng]}
      icon={icon}
      eventHandlers={{ click: () => onSelect?.(vessel) }}
    >
      <Popup className="map-popup" maxWidth={280}>
        <div className="popup-content">
          <div className="popup-header">
            <strong>{vessel.name}</strong>
            <img src={getFlagUrl(vessel.flag)} alt={vessel.flag} className="popup-flag" />
          </div>
          <span className="popup-imo">IMO {vessel.imo}</span>
          <hr />
          <div className="popup-grid">
            <span>Type</span><span>{vessel.typeLabel}</span>
            <span>Flag</span><span>{vessel.flag}</span>
            <span>Speed</span><span>{vessel.speed} kn</span>
            <span>Heading</span><span>{vessel.heading}°</span>
            <span>Draft</span><span>{vessel.draft} m</span>
            <span>Length</span><span>{vessel.length} m</span>
          </div>
          <hr />
          <div className="popup-route">
            <div><span className="route-label">From</span> {vessel.origin}</div>
            <div className="route-arrow">→</div>
            <div><span className="route-label">To</span> {vessel.destination}</div>
          </div>
          <div className={`popup-status popup-status--${vessel.status.replace(' ', '-')}`}>
            {vessel.status}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

// ── Route lines for each vessel ──
function VesselRoute({ vessel }) {
  const { traveled, remaining } = useMemo(() => buildRoute(vessel), [vessel]);
  if (!traveled.length) return null;

  return (
    <>
      {/* Traveled portion — solid */}
      <Polyline
        positions={traveled}
        pathOptions={{
          color: vessel.color,
          weight: 2,
          opacity: 0.5,
          dashArray: '6 4',
        }}
      />
      {/* Remaining portion — dotted and faded */}
      <Polyline
        positions={remaining}
        pathOptions={{
          color: vessel.color,
          weight: 1.5,
          opacity: 0.25,
          dashArray: '3 6',
        }}
      />
    </>
  );
}

function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.setView([target.lat, target.lng], 10, { animate: true, duration: 0.8 });
  }, [target, map]);
  return null;
}

function Legend() {
  return (
    <div className="map-legend">
      <div className="map-legend-title">Vessel Types</div>
      {Object.values(SHIP_TYPES).map(t => (
        <div className="legend-item" key={t.label}>
          <span className="legend-dot" style={{ background: t.color }} />
          {t.label}
        </div>
      ))}
      <div className="map-legend-title" style={{ marginTop: 10 }}>Routes</div>
      <div className="legend-item">
        <span className="legend-line-dashed" style={{ borderColor: '#0077b6' }} />
        Traveled path
      </div>
      <div className="legend-item">
        <span className="legend-line-dotted" style={{ borderColor: '#999' }} />
        Remaining path
      </div>
      <div className="map-legend-title" style={{ marginTop: 10 }}>Shipping Lanes</div>
      <div className="legend-item"><span className="legend-line" style={{ background: '#0077b6' }} />Inbound (West)</div>
      <div className="legend-item"><span className="legend-line" style={{ background: '#e74c3c' }} />Outbound (East)</div>
    </div>
  );
}

export default function ShipMap({ vessels, flyTarget, onSelectVessel }) {
  const laneInbound = LANES.inbound.map(p => [p.lat, p.lng]);
  const laneOutbound = LANES.outbound.map(p => [p.lat, p.lng]);

  return (
    <div className="map-panel">
      <MapContainer center={[26.3, 56.4]} zoom={8} style={{ height: '100%', minHeight: 560 }} zoomControl>
        {/* Google Maps-style base layer with English labels */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap &copy; CARTO"
          maxZoom={19}
          subdomains="abcd"
        />
        {/* OpenSeaMap nautical overlay */}
        <TileLayer
          url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
          attribution="&copy; OpenSeaMap"
          maxZoom={18}
          opacity={0.6}
        />
        <FlyTo target={flyTarget} />

        {/* Shipping lanes */}
        <Polyline positions={laneInbound} pathOptions={{ color: '#0077b6', weight: 3, opacity: 0.4, dashArray: '12 8' }} />
        <Polyline positions={laneOutbound} pathOptions={{ color: '#e74c3c', weight: 3, opacity: 0.4, dashArray: '12 8' }} />

        {/* Route lines (render behind ships) */}
        {vessels.map(v => (
          <VesselRoute key={`route-${v.id}`} vessel={v} />
        ))}

        {/* Direction arrows */}
        {vessels.map(v => (
          <DirectionArrow key={`arrow-${v.id}`} vessel={v} />
        ))}

        {/* Ship markers */}
        {vessels.map(v => (
          <ShipMarker key={v.id} vessel={v} onSelect={onSelectVessel} />
        ))}
      </MapContainer>
      <Legend />
    </div>
  );
}
