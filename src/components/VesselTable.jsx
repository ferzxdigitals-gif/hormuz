import { useMemo } from 'react';
import ShipSilhouette from './ShipSilhouette';
import { getFlagUrl } from '../data/vessels';
import { generateShipPhotos } from '../data/shipPhotos';

function ShipPhoto({ vessel }) {
  const src = generateShipPhotos(vessel.type, vessel.color)[0];
  return <img src={src} alt={vessel.name} className="table-ship-thumb" loading="lazy" />;
}

export default function VesselTable({ vessels, selectedVessel, onSelectVessel, onSeeOnMap }) {
  const sorted = useMemo(() => [...vessels].sort((a, b) => b.speed - a.speed), [vessels]);

  const statusClass = s =>
    s === 'underway' ? 'status-transit' : s === 'at anchor' ? 'status-anchor' : 'status-moored';

  return (
    <section className="table-section">
      <div className="table-section-header">
        <h2>Active Vessels</h2>
        <span className="vessel-count-badge">{vessels.length}</span>
        {selectedVessel && (
          <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', marginLeft: 'auto' }}>
            ● {selectedVessel.name} selected
          </span>
        )}
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Vessel</th>
              <th>Photo</th>
              <th>MMSI</th>
              <th>Type</th>
              <th>Flag</th>
              <th>Route</th>
              <th>Speed</th>
              <th>Heading</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(v => {
              const isSelected = selectedVessel?.id === v.id;
              return (
                <tr
                  key={v.id}
                  className={isSelected ? 'row-selected' : ''}
                  onClick={() => onSelectVessel(v)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <div className="vessel-cell">
                      {isSelected && <span className="selected-indicator" />}
                      <ShipSilhouette type={v.silhouette} color={v.color} width={44} />
                      <strong>{v.name}</strong>
                    </div>
                  </td>
                  <td>
                    <ShipPhoto vessel={v} />
                  </td>
                  <td className="mono">{v.mmsi}</td>
                  <td>
                    <span className="type-badge" style={{
                      background: v.color + '1a',
                      color: v.color,
                      borderColor: v.color + '50',
                    }}>
                      {v.typeLabel}
                    </span>
                  </td>
                  <td>
                    <div className="flag-cell">
                      {getFlagUrl(v.flag) && <img src={getFlagUrl(v.flag)} alt={v.flag} className="flag-icon" />}
                      <span>{v.flag}</span>
                    </div>
                  </td>
                  <td>
                    <div className="route-cell">
                      <span className="route-origin">{v.origin}</span>
                      <span className="route-arrow-small">→</span>
                      <span className="route-dest">{v.destination}</span>
                    </div>
                  </td>
                  <td className="mono">{v.speed} kn</td>
                  <td className="mono">{v.heading}°</td>
                  <td>
                    <span className={`status-pill ${statusClass(v.status)}`}>{v.status}</span>
                  </td>
                  <td>
                    {isSelected && (
                      <button
                        className="see-on-map-btn"
                        onClick={e => { e.stopPropagation(); onSeeOnMap(v); }}
                      >
                        ⌖ See on map
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
