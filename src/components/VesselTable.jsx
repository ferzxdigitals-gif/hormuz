import { useMemo } from 'react';
import ShipSilhouette from './ShipSilhouette';
import { getFlagUrl } from '../data/vessels';

export default function VesselTable({ vessels, onSelectVessel }) {
  const sorted = useMemo(() => [...vessels].sort((a, b) => b.speed - a.speed), [vessels]);

  const statusClass = (s) =>
    s === 'underway' ? 'status-transit' : s === 'at anchor' ? 'status-anchor' : 'status-moored';

  return (
    <section className="table-section">
      <h2>Active Vessels</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Vessel</th><th>IMO</th><th>Type</th><th>Flag</th>
              <th>Route</th><th>Speed</th><th>Heading</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(v => (
              <tr key={v.id} onClick={() => onSelectVessel(v)} style={{ cursor: 'pointer' }}>
                <td>
                  <div className="vessel-cell">
                    <ShipSilhouette type={v.silhouette} color={v.color} width={50} />
                    <strong>{v.name}</strong>
                  </div>
                </td>
                <td className="mono">{v.imo}</td>
                <td>
                  <span className="type-badge" style={{ background: v.color + '18', color: v.color, borderColor: v.color + '40' }}>
                    {v.typeLabel}
                  </span>
                </td>
                <td>
                  <div className="flag-cell">
                    <img src={getFlagUrl(v.flag)} alt={v.flag} className="flag-icon" />
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
                <td>{v.speed} kn</td>
                <td>{v.heading}°</td>
                <td><span className={`status-pill ${statusClass(v.status)}`}>{v.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
