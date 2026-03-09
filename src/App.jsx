import { useState, useMemo, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ShipMap from './components/ShipMap';
import { VesselTypesChart, FlagChart, SpeedChart, HourlyChart } from './components/Charts';
import TrafficAnalytics from './components/TrafficAnalytics';
import VesselTable from './components/VesselTable';
import { generateVessels, generateHourlyTransits } from './data/vessels';

export default function App() {
  const [vessels, setVessels] = useState(() => generateVessels(48));
  const hourlyData = useMemo(() => generateHourlyTransits(), []);
  const [flyTarget, setFlyTarget] = useState(null);

  // Animate underway vessels
  useEffect(() => {
    const id = setInterval(() => {
      setVessels(prev => prev.map(v => {
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

  const handleSelect = useCallback((vessel) => {
    setFlyTarget(vessel);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Header vesselCount={vessels.length} />
      <main className="main-grid">
        <ShipMap vessels={vessels} flyTarget={flyTarget} onSelectVessel={handleSelect} />
        <aside className="sidebar">
          <div className="card"><h2>Vessel Types in Region</h2><VesselTypesChart vessels={vessels} /></div>
          <div className="card"><h2>Traffic by Flag State</h2><FlagChart vessels={vessels} /></div>
          <div className="card"><h2>Speed Distribution (knots)</h2><SpeedChart vessels={vessels} /></div>
          <div className="card"><h2>Hourly Transits (24h)</h2><HourlyChart hourlyData={hourlyData} /></div>
        </aside>
      </main>
      <TrafficAnalytics />
      <VesselTable vessels={vessels} onSelectVessel={handleSelect} />
      <footer className="footer">
        Data based on AIS tracking and maritime intelligence reports · Dashboard for demonstration purposes
      </footer>
    </>
  );
}
