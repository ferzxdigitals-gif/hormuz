import { useState, useMemo } from 'react';
import { getFlagUrl, SHIP_TYPES } from '../../data/vessels';
import { generateShipPhotos } from '../../data/shipPhotos';
import ShipSilhouette from '../ShipSilhouette';

function VesselCard({ vessel, onClick }) {
  const photo = generateShipPhotos(vessel.type, vessel.color)[0];
  return (
    <div className="vd-card" onClick={() => onClick(vessel)}>
      <div className="vd-card-photo">
        <img src={photo} alt={vessel.name} loading="lazy" />
        <span
          className="vd-card-type-badge"
          style={{ background: vessel.color + '22', color: vessel.color, borderColor: vessel.color + '55' }}
        >
          {vessel.typeLabel}
        </span>
      </div>
      <div className="vd-card-body">
        <div className="vd-card-name">{vessel.name}</div>
        <div className="vd-card-meta">
          <img src={getFlagUrl(vessel.flag)} alt={vessel.flag} className="vd-flag" />
          <span>{vessel.flag}</span>
        </div>
        <div className="vd-card-specs">
          <span>Built {vessel.inductionYear}</span>
          <span>{vessel.length} m</span>
          <span className={`vd-status vd-status--${vessel.status.replace(' ', '-')}`}>{vessel.status}</span>
        </div>
      </div>
    </div>
  );
}

function PhotoGallery({ photos, vesselName }) {
  const [active, setActive] = useState(0);
  return (
    <div className="vd-gallery">
      <div className="vd-gallery-main">
        <img src={photos[active]} alt={`${vesselName} photo ${active + 1}`} />
      </div>
      <div className="vd-gallery-thumbs">
        {photos.map((p, i) => (
          <button
            key={i}
            className={`vd-gallery-thumb ${i === active ? 'active' : ''}`}
            onClick={() => setActive(i)}
          >
            <img src={p} alt={`thumb ${i + 1}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

function VesselDetail({ vessel, onBack }) {
  return (
    <div className="vd-detail">
      <button className="vd-back-btn" onClick={onBack}>← Back to list</button>
      <div className="vd-detail-header">
        <img src={getFlagUrl(vessel.flag)} alt={vessel.flag} className="vd-detail-flag" />
        <div>
          <div className="vd-detail-name">{vessel.name}</div>
          <span
            className="vd-card-type-badge"
            style={{ background: vessel.color + '22', color: vessel.color, borderColor: vessel.color + '55' }}
          >
            {vessel.typeLabel}
          </span>
        </div>
      </div>

      <PhotoGallery photos={generateShipPhotos(vessel.type, vessel.color)} vesselName={vessel.name} />

      <div className="vd-detail-grid">
        <div className="vd-detail-row"><span>IMO</span><strong>{vessel.imo}</strong></div>
        <div className="vd-detail-row"><span>MMSI</span><strong>{vessel.mmsi}</strong></div>
        <div className="vd-detail-row"><span>Year Built</span><strong>{vessel.inductionYear}</strong></div>
        <div className="vd-detail-row"><span>Country of Registry</span><strong>{vessel.countryOrigin}</strong></div>
        <div className="vd-detail-row"><span>Type</span><strong>{vessel.typeLabel}</strong></div>
        <div className="vd-detail-row"><span>Status</span>
          <strong className={`vd-status vd-status--${vessel.status.replace(' ', '-')}`}>{vessel.status}</strong>
        </div>
        <div className="vd-detail-row"><span>Length</span><strong>{vessel.length} m</strong></div>
        <div className="vd-detail-row"><span>Beam</span><strong>{vessel.beam} m</strong></div>
        <div className="vd-detail-row"><span>Draft</span><strong>{vessel.draft} m</strong></div>
        <div className="vd-detail-row"><span>Gross Tonnage</span><strong>{vessel.grossTonnage.toLocaleString()} GT</strong></div>
        <div className="vd-detail-row"><span>Speed</span><strong>{vessel.speed > 0 ? `${vessel.speed} kn` : 'Stopped'}</strong></div>
        <div className="vd-detail-row"><span>Heading</span><strong>{vessel.speed > 0 ? `${vessel.heading}°` : '—'}</strong></div>
        <div className="vd-detail-row"><span>Origin Port</span><strong>{vessel.origin}</strong></div>
        <div className="vd-detail-row"><span>Destination Port</span><strong>{vessel.destination}</strong></div>
        <div className="vd-detail-row"><span>Position</span><strong>{vessel.lat.toFixed(4)}°N, {vessel.lng.toFixed(4)}°E</strong></div>
      </div>
    </div>
  );
}

export default function VesselDetailsPanel({ vessels }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const types = useMemo(() => ['all', ...Object.values(SHIP_TYPES).map(t => t.label)], []);

  const filtered = useMemo(() => vessels.filter(v => {
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.flag.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || v.typeLabel === typeFilter;
    return matchSearch && matchType;
  }), [vessels, search, typeFilter]);

  if (selected) return <VesselDetail vessel={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="panel-inner">
      <div className="panel-title">Vessel Details</div>
      <div className="vd-controls">
        <input
          className="vd-search"
          placeholder="Search vessels..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="vd-type-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          {types.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>)}
        </select>
      </div>
      <div className="vd-count">{filtered.length} vessels</div>
      <div className="vd-grid">
        {filtered.map(v => (
          <VesselCard key={v.id} vessel={v} onClick={setSelected} />
        ))}
        {filtered.length === 0 && <div className="vd-empty">No vessels match your search.</div>}
      </div>
    </div>
  );
}
