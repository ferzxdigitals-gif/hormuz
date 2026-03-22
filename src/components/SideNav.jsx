import { useState } from 'react';

const NAV_ITEMS = [
  { id: 'vessels',       icon: '⚓', label: 'Vessel Details' },
  { id: 'ports',         icon: '🏗', label: 'Ports' },
  { id: 'news',          icon: '📰', label: 'Maritime News' },
  { id: 'compliance',    icon: '📋', label: 'Compliance' },
  { id: 'pricing',       icon: '💳', label: 'Plans & Pricing' },
  { id: 'data',          icon: '📊', label: 'Data Services' },
  { id: 'solutions',     icon: '⚙',  label: 'Solutions' },
  { id: 'notifications', icon: '🔔', label: 'Notifications' },
  { id: 'support',       icon: '💬', label: 'Support' },
  { id: 'profile',       icon: '👤', label: 'Profile Details' },
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
