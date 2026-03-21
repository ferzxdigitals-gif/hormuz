import { useState, useMemo, useEffect, useCallback } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import ShipMap from './components/ShipMap';
import { VesselTypesChart, FlagChart, SpeedChart, HourlyChart } from './components/Charts';
import TrafficAnalytics from './components/TrafficAnalytics';
import VesselTable from './components/VesselTable';
import { generateVessels, generateHourlyTransits } from './data/vessels';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [vessels]   = useState(() => generateVessels(48));
  const [liveVessels, setLiveVessels] = useState(() => generateVessels(48));
  const hourlyData  = useMemo(() => generateHourlyTransits(), []);
  const [flyTarget, setFlyTarget]         = useState(null);
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [flagFilter, setFlagFilter] = useState(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Animate underway vessels
  useEffect(() => {
    const id = setInterval(() => {
      setLiveVessels(prev => prev.map(v => {
        if (v.status !== 'underway') return v;
        const rad = (v.heading - 90) * Math.PI / 180;
        const step = 0.001 * (v.speed / 12);
        return {
          ...v,
          lat: v.lat + step * Math.sin(rad + Math.PI / 2) + (Math.random() - 0.5) * 0.0003,
          lng: v.lng + step * Math.cos(rad + Math.PI / 2) + (Math.random() - 0.5) * 0.0003,
        };
      }));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const filteredVessels = useMemo(() => {
    return liveVessels.filter(v => {
      if (typeFilter && v.type !== typeFilter) return false;
      if (flagFilter && v.flag !== flagFilter) return false;
      return true;
    });
  }, [liveVessels, typeFilter, flagFilter]);

  // Clear selection if the selected vessel is filtered out
  useEffect(() => {
    if (selectedVessel && !filteredVessels.find(v => v.id === selectedVessel.id)) {
      setSelectedVessel(null);
    }
  }, [filteredVessels, selectedVessel]);

  const handleSelectVessel = useCallback((vessel) => {
    setSelectedVessel(vessel);
    setFlyTarget(vessel);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectFromMap = useCallback((vessel) => {
    setSelectedVessel(vessel);
  }, []);

  const handleSeeOnMap = useCallback((vessel) => {
    setFlyTarget({ ...vessel, _t: Date.now() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const allVessels = useMemo(() => vessels, [vessels]);

  return (
    <>
      <Header
        vesselCount={filteredVessels.length}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
      />
      <FilterBar
        vessels={allVessels}
        typeFilter={typeFilter}
        flagFilter={flagFilter}
        filteredCount={filteredVessels.length}
        onTypeFilter={setTypeFilter}
        onFlagFilter={setFlagFilter}
      />
      <main className="main-grid">
        <ShipMap
          vessels={filteredVessels}
          flyTarget={flyTarget}
          selectedVessel={selectedVessel}
          onSelectVessel={handleSelectFromMap}
          darkMode={darkMode}
        />
        <aside className="sidebar">
          <div className="card">
            <h2>Vessel Types</h2>
            <VesselTypesChart vessels={filteredVessels} darkMode={darkMode} />
          </div>
          <div className="card">
            <h2>Flag State</h2>
            <FlagChart vessels={filteredVessels} darkMode={darkMode} />
          </div>
          <div className="card">
            <h2>Speed Distribution</h2>
            <SpeedChart vessels={filteredVessels} darkMode={darkMode} />
          </div>
          <div className="card">
            <h2>Hourly Transits (24h)</h2>
            <HourlyChart hourlyData={hourlyData} darkMode={darkMode} />
          </div>
        </aside>
      </main>
      <TrafficAnalytics darkMode={darkMode} />
      <VesselTable
        vessels={filteredVessels}
        selectedVessel={selectedVessel}
        onSelectVessel={handleSelectVessel}
        onSeeOnMap={handleSeeOnMap}
      />
      <footer className="footer">
        AIS tracking · Maritime intelligence · For demonstration purposes only
      </footer>
    </>
  );
}
