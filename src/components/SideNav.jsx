import { useState } from 'react';

// Flat 2D SVG icons — explicit 22×22 to prevent default 300×150 render
const SZ = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round', width: 22, height: 22 };

const ICONS = {
  vessels: <svg {...SZ}><path d="M2 19 L6 21 L18 21 L22 19 L21 16 L18 14 L15 12 L9 12 L6 14 L3 16 Z"/><line x1="12" y1="12" x2="12" y2="8"/><line x1="9" y1="9" x2="15" y2="9"/></svg>,
  ports:   <svg {...SZ}><circle cx="12" cy="10" r="3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>,
  news:    <svg {...SZ}><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="9" x2="17" y2="9"/><line x1="7" y1="13" x2="13" y2="13"/><line x1="7" y1="17" x2="11" y2="17"/></svg>,
  compliance: <svg {...SZ}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  pricing: <svg {...SZ}><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="7" y1="15" x2="7.01" y2="15" strokeWidth="2.5"/><line x1="11" y1="15" x2="14" y2="15"/></svg>,
  data:    <svg {...SZ}><rect x="18" y="3" width="4" height="18" rx="1"/><rect x="10" y="8" width="4" height="13" rx="1"/><rect x="2" y="13" width="4" height="8" rx="1"/></svg>,
  solutions: <svg {...SZ}><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  notifications: <svg {...SZ}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  support: <svg {...SZ}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  profile: <svg {...SZ}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
};

const NAV_ITEMS = [
  { id: 'vessels',       icon: ICONS.vessels,       label: 'Vessel Details' },
  { id: 'ports',         icon: ICONS.ports,         label: 'Ports' },
  { id: 'news',          icon: ICONS.news,          label: 'Maritime News' },
  { id: 'compliance',    icon: ICONS.compliance,    label: 'Compliance' },
  { id: 'pricing',       icon: ICONS.pricing,       label: 'Plans & Pricing' },
  { id: 'data',          icon: ICONS.data,          label: 'Data Services' },
  { id: 'solutions',     icon: ICONS.solutions,     label: 'Solutions' },
  { id: 'notifications', icon: ICONS.notifications, label: 'Notifications' },
  { id: 'support',       icon: ICONS.support,       label: 'Support' },
  { id: 'profile',       icon: ICONS.profile,       label: 'Profile Details' },
];

export default function SideNav({ activePanel, onSelect }) {
  const [hovered, setHovered] = useState(null);

  return (
    <nav className="side-nav">
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          className={`side-nav-btn ${activePanel === item.id ? 'side-nav-btn--active' : ''}`}
          onClick={() => onSelect(activePanel === item.id ? null : item.id)}
          onMouseEnter={() => setHovered(item.id)}
          onMouseLeave={() => setHovered(null)}
          title={item.label}
        >
          <span className="side-nav-icon">{item.icon}</span>
          {hovered === item.id && (
            <span className="side-nav-tooltip">{item.label}</span>
          )}
        </button>
      ))}
    </nav>
  );
}
