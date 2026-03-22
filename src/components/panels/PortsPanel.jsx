import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import { PORT_DETAILS } from '../../data/vessels';

const DARK_TILE  = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const LIGHT_TILE = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

function PortMarker({ port, name, isSelected, onSelect }) {
  const markerRef = useRef(null);

  const icon = L.divIcon({
    html: `<div class="port-marker-dot ${isSelected ? 'port-marker-dot--selected' : ''}">
      <div class="port-marker-inner"></div>
      ${isSelected ? '<div class="port-ping"></div>' : ''}
    </div>`,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  return (
    <Marker
      ref={markerRef}
      position={[port.lat, port.lng]}
      icon={icon}
      eventHandlers={{ click: () => onSelect(name) }}
    />
  );
}

function FlyToPort({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 9, { duration: 0.8 });
  }, [target, map]);
  return null;
}

function PortDetail({ name, port, onClose }) {
  return (
    <div className="port-detail-card">
      <button className="port-detail-close" onClick={onClose}>✕</button>
      <div className="port-detail-header">
        <img
          src={`https://flagcdn.com/w40/${port.countryCode.toLowerCase()}.png`}
          alt={port.country}
          className="port-detail-flag"
        />
        <div>
          <div className="port-detail-name">{name}</div>
          <div className="port-detail-country">{port.country}</div>
        </div>
      </div>
      <div className="port-detail-type">{port.type}</div>
      <p className="port-detail-desc">{port.description}</p>
      <div className="port-detail-grid">
        <div className="port-detail-row"><span>Max Depth</span><strong>{port.depth}</strong></div>
        <div className="port-detail-row"><span>Capacity</span><strong>{port.capacity}</strong></div>
        <div className="port-detail-row"><span>Anchorage</span><strong>{port.anchorage}</strong></div>
        <div className="port-detail-row"><span>Status</span>
          <strong style={{ color: port.status.includes('restrict') ? 'var(--orange)' : 'var(--green)' }}>
            {port.status}
          </strong>
        </div>
        <div className="port-detail-row"><span>Coordinates</span>
          <strong>{port.lat.toFixed(3)}°N, {port.lng.toFixed(3)}°E</strong>
        </div>
      </div>
    </div>
  );
}

export default function PortsPanel({ darkMode }) {
  const [selectedPort, setSelectedPort] = useState(null);
  const ports = PORT_DETAILS;

  const handleSelect = (name) => {
    setSelectedPort(prev => prev === name ? null : name);
  };

  const flyTarget = selectedPort ? ports[selectedPort] : null;

  return (
    <div className="panel-inner panel-inner--ports">
      <div className="panel-title">Ports</div>
      <p className="panel-subtitle">Click a port marker to view details</p>

      <div className="ports-map-wrap">
        <MapContainer
          center={[26.0, 54.0]}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            key={darkMode ? 'dark' : 'light'}
            url={darkMode ? DARK_TILE : LIGHT_TILE}
            attribution="&copy; OpenStreetMap &copy; CARTO"
            maxZoom={18}
            subdomains="abcd"
          />
          <ZoomControl position="topright" />
          <FlyToPort target={flyTarget} />
          {Object.entries(ports).map(([name, port]) => (
            <PortMarker
              key={name}
              name={name}
              port={port}
              isSelected={selectedPort === name}
              onSelect={handleSelect}
            />
          ))}
        </MapContainer>
      </div>

      {selectedPort && ports[selectedPort] && (
        <PortDetail
          name={selectedPort}
          port={ports[selectedPort]}
          onClose={() => setSelectedPort(null)}
        />
      )}

      {!selectedPort && (
        <div className="ports-list">
          {Object.entries(ports).map(([name, port]) => (
            <button
              key={name}
              className="ports-list-item"
              onClick={() => handleSelect(name)}
            >
              <img
                src={`https://flagcdn.com/w40/${port.countryCode.toLowerCase()}.png`}
                alt={port.country}
                className="ports-list-flag"
              />
              <div className="ports-list-info">
                <div className="ports-list-name">{name}</div>
                <div className="ports-list-type">{port.type}</div>
              </div>
              <span className="ports-list-arrow">›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
