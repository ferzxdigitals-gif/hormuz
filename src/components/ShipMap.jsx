import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import {
  MapContainer, TileLayer, Marker, Polyline,
  Popup, ZoomControl, useMap,
} from 'react-leaflet';
import { SHIP_TYPES, LANES, getFlagUrl, PORT_COORDS } from '../data/vessels';
import { getShipMarkerHtml } from '../data/shipSvgs';

const DARK_TILE  = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const LIGHT_TILE = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

function buildRoute(vessel) {
  const originCoord = PORT_COORDS[vessel.origin];
  const destCoord   = PORT_COORDS[vessel.destination];
  if (!originCoord || !destCoord) return { traveled: [], remaining: [] };

  const straitEntry = vessel.direction === 'outbound'
    ? { lat: 26.55, lng: 56.0 } : { lat: 26.15, lng: 57.1 };
  const straitExit  = vessel.direction === 'outbound'
    ? { lat: 26.10, lng: 57.1 } : { lat: 26.50, lng: 56.0 };

  return {
    traveled:  [[originCoord.lat, originCoord.lng], [straitEntry.lat, straitEntry.lng], [vessel.lat, vessel.lng]],
    remaining: [[vessel.lat, vessel.lng], [straitExit.lat, straitExit.lng], [destCoord.lat, destCoord.lng]],
  };
}

function DirectionArrow({ vessel }) {
  if (vessel.status !== 'underway') return null;
  const rad = vessel.heading * Math.PI / 180;
  const d = 0.07;
  const tipLat = vessel.lat + d * Math.cos(rad);
  const tipLng = vessel.lng + d * Math.sin(rad);
  const sz = 0.02;
  const pts = [
    [tipLat, tipLng],
    [tipLat + sz * Math.cos(rad + Math.PI * 0.8), tipLng + sz * Math.sin(rad + Math.PI * 0.8)],
    [tipLat + sz * Math.cos(rad - Math.PI * 0.8), tipLng + sz * Math.sin(rad - Math.PI * 0.8)],
    [tipLat, tipLng],
  ];
  return (
    <>
      <Polyline positions={[[vessel.lat, vessel.lng], [tipLat, tipLng]]}
        pathOptions={{ color: vessel.color, weight: 2, opacity: 0.7 }} />
      <Polyline positions={pts}
        pathOptions={{ color: vessel.color, weight: 1, fill: true, fillColor: vessel.color, fillOpacity: 0.8, opacity: 0.8 }} />
    </>
  );
}

function PulseRing({ vessel }) {
  const icon = useMemo(() => L.divIcon({
    html: '<div class="vessel-pulse-ring"></div>',
    className: '',
    iconSize: [60, 60],
    iconAnchor: [30, 30],
  }), []);
  return <Marker position={[vessel.lat, vessel.lng]} icon={icon} interactive={false} zIndexOffset={-100} />;
}

function ShipMarker({ vessel, isSelected, onSelect }) {
  const icon = useMemo(() => L.divIcon({
    html: getShipMarkerHtml(vessel, isSelected),
    className: 'ship-div-icon',
    iconSize: [60, 50],
    iconAnchor: [30, 25],
    popupAnchor: [0, -20],
  }), [vessel.id, vessel.heading, vessel.lat, vessel.lng, isSelected]);

  return (
    <Marker
      position={[vessel.lat, vessel.lng]}
      icon={icon}
      eventHandlers={{ click: () => onSelect?.(vessel) }}
      zIndexOffset={isSelected ? 1000 : 0}
    >
      <Popup className="map-popup" maxWidth={260}>
        <div className="popup-content">
          <div className="popup-header">
            <strong>{vessel.name}</strong>
            <img src={getFlagUrl(vessel.flag)} alt={vessel.flag} className="popup-flag" />
          </div>
          <span className="popup-imo">MMSI {vessel.mmsi}</span>
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
            <div><span className="route-label">From</span>{vessel.origin}</div>
            <div className="route-arrow">→</div>
            <div><span className="route-label">To</span>{vessel.destination}</div>
          </div>
          <div className={`popup-status popup-status--${vessel.status.replace(' ', '-')}`}>
            {vessel.status}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

function VesselRoute({ vessel }) {
  const { traveled, remaining } = useMemo(() => buildRoute(vessel), [vessel]);
  if (!traveled.length) return null;
  return (
    <>
      <Polyline positions={traveled}  pathOptions={{ color: vessel.color, weight: 2,   opacity: 0.45, dashArray: '6 4' }} />
      <Polyline positions={remaining} pathOptions={{ color: vessel.color, weight: 1.5, opacity: 0.2,  dashArray: '3 6' }} />
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

function TileLayerSwitcher({ darkMode }) {
  return (
    <TileLayer
      key={darkMode ? 'dark' : 'light'}
      url={darkMode ? DARK_TILE : LIGHT_TILE}
      attribution="&copy; OpenStreetMap &copy; CARTO"
      maxZoom={19}
      subdomains="abcd"
    />
  );
}

function Legend() {
  return (
    <div className="map-legend">
      <div className="map-legend-title">Vessel Types</div>
      {Object.values(SHIP_TYPES).map(t => (
        <div className="legend-item" key={t.label}>
          <span className="legend-dot" style={{ background: t.color, boxShadow: `0 0 5px ${t.color}` }} />
          {t.label}
        </div>
      ))}
      <div className="map-legend-title">Routes</div>
      <div className="legend-item">
        <span className="legend-line-dashed" style={{ borderColor: '#00cfff' }} />Traveled
      </div>
      <div className="legend-item">
        <span className="legend-line-dotted" style={{ borderColor: '#666' }} />Remaining
      </div>
      <div className="map-legend-title">Lanes</div>
      <div className="legend-item"><span className="legend-line" style={{ background: '#0077b6' }} />Inbound</div>
      <div className="legend-item"><span className="legend-line" style={{ background: '#e74c3c' }} />Outbound</div>
    </div>
  );
}

export default function ShipMap({ vessels, flyTarget, selectedVessel, onSelectVessel, darkMode }) {
  const laneInbound  = LANES.inbound.map(p  => [p.lat, p.lng]);
  const laneOutbound = LANES.outbound.map(p => [p.lat, p.lng]);

  return (
    <div className="map-panel">
      <MapContainer
        center={[26.3, 56.4]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayerSwitcher darkMode={darkMode} />
        {/* OpenSeaMap nautical overlay */}
        <TileLayer
          url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
          attribution="&copy; OpenSeaMap"
          opacity={0.4}
        />
        <ZoomControl position="topleft" />
        <FlyTo target={flyTarget} />

        {/* Shipping lanes */}
        <Polyline positions={laneInbound}  pathOptions={{ color: '#0077b6', weight: 3, opacity: 0.35, dashArray: '12 8' }} />
        <Polyline positions={laneOutbound} pathOptions={{ color: '#e74c3c', weight: 3, opacity: 0.35, dashArray: '12 8' }} />

        {/* Routes */}
        {vessels.map(v => <VesselRoute key={`r-${v.id}`} vessel={v} />)}

        {/* Direction arrows */}
        {vessels.map(v => <DirectionArrow key={`a-${v.id}`} vessel={v} />)}

        {/* Pulse ring for selected */}
        {selectedVessel && vessels.find(v => v.id === selectedVessel.id) && (
          <PulseRing vessel={selectedVessel} />
        )}

        {/* Ship markers */}
        {vessels.map(v => (
          <ShipMarker
            key={v.id}
            vessel={v}
            isSelected={selectedVessel?.id === v.id}
            onSelect={onSelectVessel}
          />
        ))}
      </MapContainer>
      <Legend />
    </div>
  );
}
