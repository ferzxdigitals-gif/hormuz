const PANEL_CONTENT = {
  compliance: {
    title: 'Compliance',
    icon: '📋',
    desc: 'Maritime regulatory compliance tools and documentation.',
    sections: [
      { label: 'IMO Compliance', status: 'Active', color: '#2ecc71' },
      { label: 'SOLAS Certification', status: 'Active', color: '#2ecc71' },
      { label: 'MARPOL Reporting', status: 'Active', color: '#2ecc71' },
      { label: 'Port State Control', status: 'Review Due', color: '#e67e22' },
      { label: 'Flag State Audit', status: 'Scheduled', color: '#3498db' },
      { label: 'Sanctions Screening', status: 'Active', color: '#2ecc71' },
    ],
  },
  pricing: {
    title: 'Plans & Pricing',
    icon: '💳',
    desc: 'Choose the right plan for your maritime intelligence needs.',
    plans: [
      {
        name: 'Basic', price: 'Free', color: '#636e72',
        features: ['Real-time vessel tracking', '15-min AIS delay', '5 vessel alerts'],
      },
      {
        name: 'Professional', price: '$299/mo', color: '#3498db',
        features: ['Live AIS data', 'Port analytics', 'Fleet management', 'API access', '50 alerts'],
        highlight: true,
      },
      {
        name: 'Enterprise', price: 'Custom', color: '#9b59b6',
        features: ['Unlimited vessels', 'Custom data feeds', 'Dedicated support', 'White-label option', 'Historical data'],
      },
    ],
  },
  data: {
    title: 'Data Services',
    icon: '📊',
    desc: 'Access raw AIS data, historical archives, and analytics APIs.',
    services: [
      { name: 'Live AIS Stream', desc: 'Real-time vessel position data via WebSocket or REST', tag: 'API' },
      { name: 'Historical Archive', desc: 'Up to 10 years of AIS data for the Gulf region', tag: 'Archive' },
      { name: 'Port Call Reports', desc: 'Automated arrival/departure analytics per port', tag: 'Reports' },
      { name: 'Cargo Intelligence', desc: 'Cargo type estimation based on vessel class & route', tag: 'AI' },
      { name: 'Custom Data Export', desc: 'CSV, JSON, Shapefile exports with custom filters', tag: 'Export' },
    ],
  },
  solutions: {
    title: 'Solutions',
    icon: '⚙',
    desc: 'Industry-specific maritime intelligence solutions.',
    items: [
      { name: 'Energy & Trading', icon: '⛽', desc: 'Track crude oil flows, LNG shipping, tanker positions in real time.' },
      { name: 'Port Authorities', icon: '🏗', desc: 'Vessel arrival forecasting, berth management, and traffic analytics.' },
      { name: 'Insurance & Risk', icon: '🛡', desc: 'War risk zone alerts, incident tracking, and exposure reports.' },
      { name: 'Government & Navy', icon: '⚓', desc: 'Classified vessel tracking, AIS spoofing detection, dark vessel alerts.' },
      { name: 'Supply Chain', icon: '🔗', desc: 'End-to-end cargo tracking from origin port to final destination.' },
    ],
  },
  notifications: {
    title: 'Notifications',
    icon: '🔔',
    desc: 'Configure real-time alerts for vessel and maritime events.',
    alerts: [
      { type: 'Vessel Entry Alert', desc: 'Notify when a vessel enters a defined zone', active: true },
      { type: 'Speed Anomaly', desc: 'Detect unusual speed changes or stops', active: true },
      { type: 'AIS Signal Lost', desc: 'Alert when a vessel goes dark for >30 min', active: false },
      { type: 'Port Arrival / Departure', desc: 'Real-time port call notifications', active: true },
      { type: 'Sanctions Hit', desc: 'Immediate alert on sanctioned vessel detection', active: false },
      { type: 'Weather Warning', desc: 'High wind / sea state alerts for watched vessels', active: false },
    ],
  },
  support: {
    title: 'Support',
    icon: '💬',
    desc: 'Get help with HormuzWatch features and data.',
    options: [
      { name: 'Live Chat', icon: '💬', desc: 'Chat with our maritime data specialists. Available 24/7.' },
      { name: 'Documentation', icon: '📖', desc: 'Full API docs, data guides, and tutorials.' },
      { name: 'Email Support', icon: '📧', desc: 'support@hormuzwatch.io — response within 4 hours.' },
      { name: 'Status Page', icon: '🟢', desc: 'Check live system uptime and incident history.' },
      { name: 'Training', icon: '🎓', desc: 'Webinars and onboarding sessions for enterprise clients.' },
    ],
  },
};

export default function SimplePanel({ panelId }) {
  const content = PANEL_CONTENT[panelId];
  if (!content) return null;

  return (
    <div className="panel-inner">
      <div className="panel-title">{content.title}</div>
      <p className="panel-subtitle">{content.desc}</p>

      {/* Compliance */}
      {content.sections && (
        <div className="simple-list">
          {content.sections.map(s => (
            <div key={s.label} className="simple-list-item">
              <span>{s.label}</span>
              <span className="simple-status" style={{ color: s.color }}>{s.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* Pricing */}
      {content.plans && (
        <div className="pricing-plans">
          {content.plans.map(p => (
            <div key={p.name} className={`pricing-card ${p.highlight ? 'pricing-card--highlight' : ''}`}
              style={{ borderColor: p.highlight ? p.color : undefined }}>
              <div className="pricing-name" style={{ color: p.color }}>{p.name}</div>
              <div className="pricing-price">{p.price}</div>
              <ul className="pricing-features">
                {p.features.map(f => <li key={f}>✓ {f}</li>)}
              </ul>
              <button className="pricing-btn" style={{ background: p.color }}>Get Started</button>
            </div>
          ))}
        </div>
      )}

      {/* Data Services */}
      {content.services && (
        <div className="simple-list">
          {content.services.map(s => (
            <div key={s.name} className="simple-list-item simple-list-item--block">
              <div className="simple-service-top">
                <span className="simple-service-name">{s.name}</span>
                <span className="simple-tag">{s.tag}</span>
              </div>
              <div className="simple-service-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      )}

      {/* Solutions */}
      {content.items && (
        <div className="simple-list">
          {content.items.map(s => (
            <div key={s.name} className="simple-list-item simple-list-item--block">
              <div className="simple-service-top">
                <span className="simple-service-name">{s.icon} {s.name}</span>
              </div>
              <div className="simple-service-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      )}

      {/* Notifications */}
      {content.alerts && (
        <div className="simple-list">
          {content.alerts.map(a => (
            <div key={a.type} className="simple-list-item">
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text)', marginBottom: 2 }}>{a.type}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{a.desc}</div>
              </div>
              <div className={`notif-toggle ${a.active ? 'notif-toggle--on' : ''}`}>
                <div className="notif-toggle-knob" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Support */}
      {content.options && (
        <div className="simple-list">
          {content.options.map(o => (
            <div key={o.name} className="simple-list-item simple-list-item--block simple-list-item--hover">
              <div className="simple-service-top">
                <span className="simple-service-name">{o.icon} {o.name}</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>›</span>
              </div>
              <div className="simple-service-desc">{o.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
