import { useEffect, useState } from 'react';

function formatTime(tz) {
  return new Date().toLocaleTimeString('en-US', {
    timeZone: tz,
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
}

export default function Header({ vesselCount, darkMode, onToggleDark }) {
  const [gst, setGst] = useState('');
  const [ist, setIst] = useState('');

  useEffect(() => {
    const tick = () => {
      setGst(formatTime('Asia/Dubai'));
      setIst(formatTime('Asia/Kolkata'));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const headerBg = `url('${import.meta.env.BASE_URL}header-bg.png') center/cover no-repeat`;

  return (
    <header className="header" style={{ backgroundImage: headerBg }}>
      <div className="header-left">
        <div className="logo">
          <svg viewBox="0 0 48 48" width="36" height="36">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={darkMode ? '#00cfff' : '#0077b6'} />
                <stop offset="100%" stopColor={darkMode ? '#0066aa' : '#023e8a'} />
              </linearGradient>
            </defs>
            <circle cx="24" cy="24" r="23" fill="url(#logoGrad)" opacity="0.9"/>
            <path d="M8 28 Q14 22 24 26 Q34 30 40 24" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M8 32 Q14 26 24 30 Q34 34 40 28" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <path d="M18 24 L20 26 L32 26 L34 24 L32 22 L28 18 L26 16 L24 16 L22 18 L20 22 Z" fill="#fff" opacity="0.95"/>
            <rect x="25" y="12" width="1.5" height="5" rx="0.5" fill="#fff"/>
            <polygon points="27,12 27,15 31,13.5" fill="rgba(255,255,255,0.8)"/>
          </svg>
        </div>
        <div className="header-title">
          <h1>HORMUZ<span className="header-watch">WATCH</span></h1>
          <span className="header-subtitle">STRAIT OF HORMUZ · MARITIME INTELLIGENCE</span>
        </div>
        <span className="live-badge">● LIVE</span>
      </div>

      <div className="header-right">
        <div className="clocks">
          <div className="clock-row">
            <span className="clock-label">GST</span>
            <span className="clock-time">{gst}</span>
          </div>
          <div className="clock-row">
            <span className="clock-label">IST</span>
            <span className="clock-time">{ist}</span>
          </div>
        </div>
        <span className="ship-count">{vesselCount} vessels</span>
        <button className="theme-toggle" onClick={onToggleDark}>
          {darkMode ? '☀ Light' : '☾ Dark'}
        </button>
      </div>
    </header>
  );
}
