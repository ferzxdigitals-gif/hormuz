import { useState, useMemo } from 'react';
import { SHIP_TYPES, COUNTRY_CODES, getFlagUrl } from '../data/vessels';
import { SILHOUETTE_PATHS } from '../data/shipSvgs';

const ALL_COUNTRIES = Object.keys(COUNTRY_CODES);

export default function FilterBar({ vessels, typeFilter, flagFilter, filteredCount, onTypeFilter, onFlagFilter }) {
  const [openPanel, setOpenPanel] = useState(null); // 'type' | 'flag' | null

  const { typeCounts, flagCounts } = useMemo(() => {
    const tc = {}, fc = {};
    vessels.forEach(v => {
      tc[v.type] = (tc[v.type] || 0) + 1;
      fc[v.flag] = (fc[v.flag] || 0) + 1;
    });
    return { typeCounts: tc, flagCounts: fc };
  }, [vessels]);

  const sortedTypes = useMemo(() =>
    Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a]),
    [typeCounts]
  );
  // Show all countries, sorted by vessel count desc (guaranteed all appear)
  const sortedFlags = useMemo(() =>
    ALL_COUNTRIES.slice().sort((a, b) => (flagCounts[b] || 0) - (flagCounts[a] || 0)),
    [flagCounts]
  );

  const toggle = (panel) => setOpenPanel(p => p === panel ? null : panel);

  const selectType = (type) => {
    onTypeFilter(type === typeFilter ? null : type);
    setOpenPanel(null);
  };
  const selectFlag = (flag) => {
    onFlagFilter(flag === flagFilter ? null : flag);
    setOpenPanel(null);
  };
  const clearAll = () => {
    onTypeFilter(null);
    onFlagFilter(null);
    setOpenPanel(null);
  };

  return (
    <div className="filter-bar">
      <div className="filter-controls">
        {/* Ship type filter */}
        <button
          className={`filter-btn ${openPanel === 'type' ? 'open' : ''} ${typeFilter ? 'has-filter' : ''}`}
          onClick={() => toggle('type')}
        >
          <svg width="14" height="14" viewBox="0 0 100 22" style={{ flexShrink: 0 }}>
            <path d="M5 18 L10 20 L90 20 L95 18 L92 16 L85 14 L80 10 L75 8 L70 8 L65 10 L55 10 L20 10 L15 12 L10 16 Z"
              fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
          </svg>
          Show by Ship Type
          {typeFilter && <span className="filter-active-count">1</span>}
          <span className="filter-chevron">▼</span>
        </button>

        {/* Flag filter */}
        <button
          className={`filter-btn ${openPanel === 'flag' ? 'open' : ''} ${flagFilter ? 'has-filter' : ''}`}
          onClick={() => toggle('flag')}
        >
          ⚑ Show by Flag
          {flagFilter && <span className="filter-active-count">1</span>}
          <span className="filter-chevron">▼</span>
        </button>

        {(typeFilter || flagFilter) && (
          <button className="filter-clear-btn" onClick={clearAll}>✕ Clear</button>
        )}

        <div className="filter-sep" />
        <span className="filter-results-text">{filteredCount} vessels shown</span>
      </div>

      {/* Ship type panel */}
      {openPanel === 'type' && (
        <div className="filter-panel">
          <div className="filter-options-grid">
            <button
              className={`type-option ${!typeFilter ? 'active' : ''}`}
              style={{ '--type-color': 'var(--accent)' }}
              onClick={() => selectType(null)}
            >
              <span style={{ fontSize: '0.7rem' }}>ALL</span>
              <span className="type-option-count">({vessels.length})</span>
            </button>
            {sortedTypes.map(type => {
              const t = SHIP_TYPES[type];
              if (!t) return null;
              const path = SILHOUETTE_PATHS[t.silhouette] || SILHOUETTE_PATHS.cargo;
              return (
                <button
                  key={type}
                  className={`type-option ${typeFilter === type ? 'active' : ''}`}
                  style={{ '--type-color': t.color }}
                  onClick={() => selectType(type)}
                >
                  <svg viewBox="0 0 100 22" width="34" height="8" className="type-option-sil">
                    <path d={path} fill={t.color} stroke={t.color} strokeWidth="0.5"/>
                  </svg>
                  {t.label}
                  <span className="type-option-count">({typeCounts[type] || 0})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Flag panel */}
      {openPanel === 'flag' && (
        <div className="filter-panel">
          <div className="filter-options-flags">
            <button
              className={`flag-option ${!flagFilter ? 'active' : ''}`}
              onClick={() => selectFlag(null)}
            >
              All Flags
              <span className="flag-option-count">({vessels.length})</span>
            </button>
            {sortedFlags.map(flag => (
              <button
                key={flag}
                className={`flag-option ${flagFilter === flag ? 'active' : ''}`}
                onClick={() => selectFlag(flag)}
              >
                {getFlagUrl(flag) && (
                  <img src={getFlagUrl(flag)} alt={flag} />
                )}
                {flag}
                <span className="flag-option-count" style={{ opacity: flagCounts[flag] ? 1 : 0.35 }}>
                  ({flagCounts[flag] || 0})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
