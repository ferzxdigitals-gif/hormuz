const NEWS = [
  {
    id: 1,
    category: 'ALERT',
    categoryColor: '#e74c3c',
    headline: 'Strait of Hormuz Traffic Down 94% Since Feb 28 Crisis',
    summary: 'Commercial vessel transits through the Strait of Hormuz have plummeted to an average of 8 vessels/day, down from a pre-crisis baseline of 138/day. Oil markets brace for prolonged disruption.',
    source: 'HormuzWatch Intelligence',
    time: '2h ago',
    tag: 'Crisis Update',
  },
  {
    id: 2,
    category: 'SECURITY',
    categoryColor: '#e67e22',
    headline: 'Gulf Coalition Naval Forces Establish Escort Corridors',
    summary: 'A joint naval coalition has established protected maritime corridors for civilian vessels in the Gulf of Oman. Escort requests have surged, with over 200 vessels registered.',
    source: 'Maritime Security Digest',
    time: '4h ago',
    tag: 'Naval Ops',
  },
  {
    id: 3,
    category: 'MARKET',
    categoryColor: '#3498db',
    headline: 'Brent Crude Hits $142/bbl as Hormuz Closure Fears Mount',
    summary: 'Oil prices surged to a multi-year high following uncertainty over Hormuz shipping lanes. Analysts warn of $180/bbl if disruption extends beyond Q2 2026.',
    source: 'Energy Markets Daily',
    time: '5h ago',
    tag: 'Energy',
  },
  {
    id: 4,
    category: 'OPERATIONS',
    categoryColor: '#2ecc71',
    headline: 'Fujairah Anchorage Reaches Record 200+ Vessels Waiting',
    summary: 'The anchorage area off Fujairah is now hosting over 200 vessels, a record high. Port authority has expanded designated waiting zones to accommodate the surge.',
    source: 'Port Authority Bulletin',
    time: '7h ago',
    tag: 'Ports',
  },
  {
    id: 5,
    category: 'ANALYSIS',
    categoryColor: '#9b59b6',
    headline: 'LNG Supply to Europe at Risk as Gulf Carriers Divert',
    summary: 'European energy ministers held emergency talks as Qatar and UAE LNG exports face delays. Alternative Cape of Good Hope routing adds 12–18 days per voyage.',
    source: 'Global Energy Monitor',
    time: '10h ago',
    tag: 'LNG',
  },
  {
    id: 6,
    category: 'DIPLOMACY',
    categoryColor: '#00b894',
    headline: 'UN Security Council Emergency Session Called on Hormuz Crisis',
    summary: 'The United Nations Security Council convened an emergency session to address the maritime crisis. Five nations have proposed a resolution to guarantee freedom of navigation.',
    source: 'Reuters Maritime',
    time: '14h ago',
    tag: 'Geopolitics',
  },
  {
    id: 7,
    category: 'TECHNOLOGY',
    categoryColor: '#6c5ce7',
    headline: 'AI Routing Systems Activated to Navigate Alternative Shipping Lanes',
    summary: 'Major shipping companies including Maersk, MSC, and COSCO have activated AI-assisted routing systems to calculate optimal alternative routes around the Hormuz bottleneck.',
    source: 'Shipping Technology Review',
    time: '18h ago',
    tag: 'Tech',
  },
  {
    id: 8,
    category: 'INSURANCE',
    categoryColor: '#fd79a8',
    headline: 'War Risk Premiums in Gulf Soar to 5% of Hull Value',
    summary: 'Lloyd\'s of London and P&I clubs have dramatically increased war risk insurance premiums for Gulf of Oman transits. Many tanker operators are unable to secure coverage.',
    source: 'Marine Insurance Weekly',
    time: '1d ago',
    tag: 'Insurance',
  },
];

export default function NewsPanel() {
  return (
    <div className="panel-inner">
      <div className="panel-title">Maritime News</div>
      <p className="panel-subtitle">Live intelligence on Strait of Hormuz developments</p>
      <div className="news-list">
        {NEWS.map(item => (
          <div key={item.id} className="news-card">
            <div className="news-card-top">
              <span
                className="news-category"
                style={{ background: item.categoryColor + '22', color: item.categoryColor, borderColor: item.categoryColor + '55' }}
              >
                {item.category}
              </span>
              <span className="news-tag">{item.tag}</span>
              <span className="news-time">{item.time}</span>
            </div>
            <div className="news-headline">{item.headline}</div>
            <div className="news-summary">{item.summary}</div>
            <div className="news-source">— {item.source}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
