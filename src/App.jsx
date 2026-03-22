import { useState, useMemo, useEffect, useCallback } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import ShipMap from './components/ShipMap';
import { VesselTypesChart, FlagChart, SpeedChart, HourlyChart } from './components/Charts';
import TrafficAnalytics from './components/TrafficAnalytics';
import VesselTable from './components/VesselTable';
import SideNav from './components/SideNav';
import VesselDetailsPanel from './components/panels/VesselDetailsPanel';
import PortsPanel from './components/panels/PortsPanel';
import NewsPanel from './components/panels/NewsPanel';
import SimplePanel from './components/panels/SimplePanel';
import ProfilePanel from './components/panels/ProfilePanel';
import { generateVessels, generateHourlyTransits } from './data/vessels';

const STUB_PANELS = ['compliance', 'pricing', 'data', 'solutions', 'notifications', 'support'];

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [vessels]   = useState(() => generateVessels(48));
  const [liveVessels, setLiveVessels] = useState(() => generateVessels(48));
  const hourlyData  = useMemo(() => generateHourlyTransits(), []);
  const [flyTarget, setFlyTarget]           = useState(null);
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [typeFilter, setTypeFilter]         = useState(null);
  const [flagFilter, setFlagFilter]         = useState(null);
  const [activePanel, setActivePanel]       = useState(null);

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

  const panelOpen = !!activePanel;

  function renderPanel() {
    if (!activePanel) return null;
    if (activePanel === 'vessels') return <VesselDetailsPanel vessels={allVessels} />;
    if (activePanel === 'ports')   return <PortsPanel darkMode={darkMode} />;
    if (activePanel === 'news')    return <NewsPanel />;
    if (activePanel === 'profile') return <ProfilePanel />;
    if (STUB_PANELS.includes(activePanel)) return <SimplePanel panelId={activePanel} />;
    return null;
  }

  return (
    <div className={`app-root ${panelOpen ? 'app-root--panel-open' : ''}`}>
      {/* Fixed left sidenav */}
      <SideNav activePanel={activePanel} onSelect={setActivePanel} />

      {/* Sliding panel */}
      <div className={`side-panel ${panelOpen ? 'side-panel--open' : ''}`}>
        <button className="side-panel-close" onClick={() => setActivePanel(null)} title="Close">✕</button>
        {renderPanel()}
      </div>

      {/* Main content area — offset by sidenav width */}
      <div className="content-area">
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
      </div>
    </div>
  );
}
