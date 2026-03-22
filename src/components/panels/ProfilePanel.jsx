export default function ProfilePanel() {
  return (
    <div className="panel-inner">
      <div className="panel-title">Profile</div>

      <div className="profile-avatar-wrap">
        <div className="profile-avatar">AN</div>
        <div className="profile-online-dot" />
      </div>

      <div className="profile-name">Arohan Neog</div>
      <div className="profile-role">Maritime Intelligence Analyst</div>
      <div className="profile-badge">Professional Plan</div>

      <div className="profile-section-label">Account</div>
      <div className="simple-list">
        <div className="simple-list-item">
          <span>Email</span>
          <strong>arohan.neog@hormuzwatch.io</strong>
        </div>
        <div className="simple-list-item">
          <span>Member since</span>
          <strong>Jan 2025</strong>
        </div>
        <div className="simple-list-item">
          <span>Plan</span>
          <strong style={{ color: 'var(--accent)' }}>Professional</strong>
        </div>
        <div className="simple-list-item">
          <span>API Calls (this month)</span>
          <strong>12,840 / 50,000</strong>
        </div>
        <div className="simple-list-item">
          <span>Active Alerts</span>
          <strong>3</strong>
        </div>
        <div className="simple-list-item">
          <span>Watched Vessels</span>
          <strong>14</strong>
        </div>
      </div>

      <div className="profile-section-label">Preferences</div>
      <div className="simple-list">
        <div className="simple-list-item">
          <span>Default map view</span>
          <strong>Strait of Hormuz</strong>
        </div>
        <div className="simple-list-item">
          <span>Units</span>
          <strong>Metric (knots, metres)</strong>
        </div>
        <div className="simple-list-item">
          <span>Timezone</span>
          <strong>GST (UTC+4)</strong>
        </div>
        <div className="simple-list-item">
          <span>AIS data frequency</span>
          <strong>Real-time (Live)</strong>
        </div>
      </div>

      <div className="profile-actions">
        <button className="profile-action-btn">✎ Edit Profile</button>
        <button className="profile-action-btn profile-action-btn--danger">⏻ Log Out</button>
      </div>
    </div>
  );
}
