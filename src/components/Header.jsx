import { useEffect, useState } from 'react';

export default function Header({ vesselCount }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Dubai',
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
        }) + ' GST'
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <svg viewBox="0 0 48 48" width="40" height="40">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0077b6" />
                <stop offset="100%" stopColor="#00b4d8" />
              </linearGradient>
            </defs>
            <circle cx="24" cy="24" r="23" fill="url(#logoGrad)" />
            <path d="M8 28 Q14 22 24 26 Q34 30 40 24" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M8 32 Q14 26 24 30 Q34 34 40 28" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M18 24 L20 26 L32 26 L34 24 L32 22 L28 18 L26 16 L24 16 L22 18 L20 22 Z" fill="#fff" opacity="0.95" />
            <rect x="25" y="12" width="1.5" height="5" rx="0.5" fill="#fff" />
            <polygon points="27,12 27,15 31,13.5" fill="rgba(255,255,255,0.8)" />
          </svg>
        </div>
        <div className="header-title">
          <h1>HormuzWatch</h1>
          <span className="header-subtitle">Strait of Hormuz Maritime Traffic Intelligence</span>
        </div>
        <span className="live-badge">● LIVE</span>
      </div>
      <div className="header-right">
        <span className="clock">{time}</span>
        <span className="ship-count">{vesselCount} vessels tracked</span>
      </div>
    </header>
  );
}
