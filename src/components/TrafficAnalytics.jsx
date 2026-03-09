import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Real data: daily transits through Strait of Hormuz
const HISTORICAL_DATA = [
  { date: 'Feb 20', vessels: 135 },
  { date: 'Feb 21', vessels: 141 },
  { date: 'Feb 22', vessels: 132 },
  { date: 'Feb 23', vessels: 138 },
  { date: 'Feb 24', vessels: 144 },
  { date: 'Feb 25', vessels: 136 },
  { date: 'Feb 26', vessels: 140 },
  { date: 'Feb 27', vessels: 137 },
  { date: 'Feb 28', vessels: 148, label: 'Crisis onset' },
  { date: 'Mar 1',  vessels: 21 },
  { date: 'Mar 2',  vessels: 14 },
  { date: 'Mar 3',  vessels: 9 },
  { date: 'Mar 4',  vessels: 5 },
  { date: 'Mar 5',  vessels: 2 },
  { date: 'Mar 6',  vessels: 3 },
  { date: 'Mar 7',  vessels: 7 },
  { date: 'Mar 8',  vessels: 12 },
  { date: 'Mar 9',  vessels: 8 },
];

// Predictions
const PREDICTION_DATA = [
  { date: 'Mar 10', vessels: 10 },
  { date: 'Mar 11', vessels: 14 },
  { date: 'Mar 12', vessels: 18 },
  { date: 'Mar 13', vessels: 22 },
  { date: 'Mar 14', vessels: 25 },
  { date: 'Mar 15', vessels: 30 },
  { date: 'Mar 16', vessels: 28 },
  { date: 'Mar 17', vessels: 35 },
  { date: 'Mar 18', vessels: 40 },
  { date: 'Mar 19', vessels: 45 },
  { date: 'Mar 20', vessels: 50 },
];

const PRE_CRISIS_AVG = 138;

const TYPE_BREAKDOWN = {
  before: [
    { type: 'Crude Oil Tankers', count: 40, color: '#e74c3c' },
    { type: 'Product Tankers',   count: 16, color: '#e67e22' },
    { type: 'Container Ships',   count: 22, color: '#2ecc71' },
    { type: 'Bulk Carriers',     count: 20, color: '#9b59b6' },
    { type: 'LNG Carriers',      count: 11, color: '#3498db' },
    { type: 'LPG Carriers',      count: 7,  color: '#1abc9c' },
    { type: 'Chemical Tankers',  count: 9,  color: '#e84393' },
    { type: 'Other',             count: 13, color: '#636e72' },
  ],
  after: [
    { type: 'Crude Oil Tankers', count: 3,  color: '#e74c3c' },
    { type: 'Product Tankers',   count: 1,  color: '#e67e22' },
    { type: 'Container Ships',   count: 1,  color: '#2ecc71' },
    { type: 'Bulk Carriers',     count: 1,  color: '#9b59b6' },
    { type: 'LNG Carriers',      count: 0,  color: '#3498db' },
    { type: 'LPG Carriers',      count: 0,  color: '#1abc9c' },
    { type: 'Chemical Tankers',  count: 1,  color: '#e84393' },
    { type: 'Other',             count: 1,  color: '#636e72' },
  ],
};

function StatCard({ label, value, sub, trend, color }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color }}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
      {trend && (
        <div className={`stat-trend ${trend.startsWith('+') ? 'trend-up' : 'trend-down'}`}>
          {trend}
        </div>
      )}
    </div>
  );
}

export default function TrafficAnalytics() {
  const currentVessels = HISTORICAL_DATA[HISTORICAL_DATA.length - 1].vessels;
  const reduction = PRE_CRISIS_AVG - currentVessels;
  const reductionPct = ((reduction / PRE_CRISIS_AVG) * 100).toFixed(1);

  const allDates = [...HISTORICAL_DATA.map(d => d.date), ...PREDICTION_DATA.map(d => d.date)];
  const historicalValues = HISTORICAL_DATA.map(d => d.vessels);
  const predictionValues = [...Array(HISTORICAL_DATA.length - 1).fill(null), HISTORICAL_DATA[HISTORICAL_DATA.length - 1].vessels, ...PREDICTION_DATA.map(d => d.vessels)];

  const chartData = useMemo(() => ({
    labels: allDates,
    datasets: [
      {
        label: 'Actual Transits',
        data: [...historicalValues, ...Array(PREDICTION_DATA.length).fill(null)],
        borderColor: '#0077b6',
        backgroundColor: 'rgba(0,119,182,0.08)',
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: (ctx) => {
          const idx = ctx.dataIndex;
          if (idx === 8) return '#dc2626'; // Feb 28
          return '#0077b6';
        },
        pointBorderColor: (ctx) => {
          const idx = ctx.dataIndex;
          if (idx === 8) return '#dc2626';
          return '#0077b6';
        },
        pointHoverRadius: 6,
        borderWidth: 2.5,
        segment: {
          borderColor: (ctx) => {
            if (ctx.p0DataIndex >= 8) return '#dc2626';
            return '#0077b6';
          },
          backgroundColor: (ctx) => {
            if (ctx.p0DataIndex >= 8) return 'rgba(220,38,38,0.06)';
            return 'rgba(0,119,182,0.08)';
          },
        },
      },
      {
        label: 'Predicted (AI Estimate)',
        data: predictionValues,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245,158,11,0.06)',
        fill: true,
        tension: 0.3,
        borderDash: [6, 4],
        pointRadius: 3,
        pointBackgroundColor: '#f59e0b',
        borderWidth: 2,
      },
      {
        label: 'Pre-crisis baseline',
        data: Array(allDates.length).fill(PRE_CRISIS_AVG),
        borderColor: '#94a3b8',
        borderDash: [4, 4],
        borderWidth: 1,
        pointRadius: 0,
        fill: false,
      },
    ],
  }), []);

  return (
    <section className="analytics-section">
      <div className="analytics-header">
        <h2>Traffic Impact Analysis</h2>
        <span className="analytics-badge">Since Feb 28, 2026</span>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        <StatCard
          label="Pre-Crisis Average"
          value={`${PRE_CRISIS_AVG}`}
          sub="vessels/day"
          color="#0077b6"
        />
        <StatCard
          label="Current (Today)"
          value={`${currentVessels}`}
          sub="vessels/day"
          trend={`-${reductionPct}%`}
          color="#dc2626"
        />
        <StatCard
          label="Reduction"
          value={`-${reduction}`}
          sub="fewer vessels/day"
          color="#dc2626"
        />
        <StatCard
          label="Lowest Point"
          value="2"
          sub="vessels on Mar 5"
          trend="-98.6%"
          color="#7c2d12"
        />
        <StatCard
          label="Oil Impact"
          value="~18M"
          sub="barrels/day disrupted"
          color="#ea580c"
        />
        <StatCard
          label="Predicted Mar 20"
          value="~50"
          sub="vessels/day (recovery)"
          trend="+525%"
          color="#059669"
        />
      </div>

      {/* Timeline chart */}
      <div className="analytics-chart-card">
        <h3>Daily Vessel Transits — Actual vs Predicted</h3>
        <div style={{ height: 280 }}>
          <Line data={chartData} options={{
            plugins: {
              legend: {
                position: 'top',
                labels: { boxWidth: 14, padding: 16, font: { size: 11 }, color: '#475569' },
              },
              tooltip: {
                callbacks: {
                  afterLabel: (ctx) => {
                    if (ctx.datasetIndex === 0 && ctx.dataIndex === 8) return '(Crisis onset)';
                    return '';
                  },
                },
              },
            },
            scales: {
              x: {
                grid: { color: '#f1f5f9' },
                ticks: { font: { size: 10 }, color: '#94a3b8', maxRotation: 45 },
              },
              y: {
                grid: { color: '#f1f5f9' },
                min: 0,
                max: 160,
                ticks: { color: '#94a3b8' },
              },
            },
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
          }} />
        </div>
      </div>

      {/* Type breakdown comparison */}
      <div className="breakdown-grid">
        <div className="breakdown-card">
          <h3>Before Feb 28 <span className="breakdown-total">138 vessels/day</span></h3>
          {TYPE_BREAKDOWN.before.map(t => {
            const pct = ((t.count / PRE_CRISIS_AVG) * 100).toFixed(0);
            return (
              <div className="breakdown-row" key={t.type}>
                <span className="breakdown-type">{t.type}</span>
                <div className="breakdown-bar-wrap">
                  <div className="breakdown-bar" style={{ width: `${pct * 2.2}%`, background: t.color }} />
                </div>
                <span className="breakdown-count">{t.count}</span>
              </div>
            );
          })}
        </div>
        <div className="breakdown-card breakdown-card--after">
          <h3>After Feb 28 <span className="breakdown-total breakdown-total--red">~8 vessels/day</span></h3>
          {TYPE_BREAKDOWN.after.map((t, i) => {
            const before = TYPE_BREAKDOWN.before[i].count;
            const changePct = before > 0 ? (((t.count - before) / before) * 100).toFixed(0) : 0;
            return (
              <div className="breakdown-row" key={t.type}>
                <span className="breakdown-type">{t.type}</span>
                <div className="breakdown-bar-wrap">
                  <div className="breakdown-bar" style={{ width: `${(t.count / 40) * 100}%`, background: t.color, opacity: 0.7 }} />
                </div>
                <span className="breakdown-count">{t.count}</span>
                <span className="breakdown-change">{changePct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
