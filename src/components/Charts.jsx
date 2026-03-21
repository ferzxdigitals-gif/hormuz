import { useMemo } from 'react';
import { Pie, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Tooltip, Legend,
  ArcElement,
} from 'chart.js';
import { SHIP_TYPES, getFlagUrl } from '../data/vessels';
import { SILHOUETTE_PATHS } from '../data/shipSvgs';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ArcElement);

function getDarkVars(darkMode) {
  return {
    legend: darkMode ? '#8b9eb0' : '#475569',
    grid:   darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
    ticks:  darkMode ? '#4a5a6a' : '#94a3b8',
    border: darkMode ? '#0f1a2a' : '#ffffff',
  };
}

/* ── Custom legend with ship silhouettes ── */
function SilhouetteLegend({ entries }) {
  const total = entries.reduce((s, e) => s + e.count, 0);
  return (
    <div className="chart-custom-legend">
      {entries.map(e => {
        const path = SILHOUETTE_PATHS[e.silhouette] || SILHOUETTE_PATHS.cargo;
        const pct  = total ? (e.count / total) * 100 : 0;
        return (
          <div className="legend-entry" key={e.label}>
            <div className="legend-ship-icon" style={{ borderColor: e.color + '60' }}>
              <svg viewBox="0 0 100 22" width="34" height="8">
                <path d={path} fill={e.color} stroke={e.color} strokeWidth="0.5"/>
              </svg>
            </div>
            <div className="legend-entry-info">
              <span className="legend-type-name">{e.label}</span>
              <div className="legend-bar-row">
                <div className="legend-mini-bar">
                  <div style={{ width: `${pct}%`, background: e.color }} />
                </div>
                <span className="legend-count" style={{ color: e.color }}>{e.count}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Vessel Types doughnut + silhouette legend ── */
export function VesselTypesChart({ vessels, darkMode }) {
  const c = getDarkVars(darkMode);

  const { chartData, legendEntries } = useMemo(() => {
    const counts = {};
    vessels.forEach(v => { counts[v.type] = (counts[v.type] || 0) + 1; });
    const types = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    return {
      chartData: {
        labels: types.map(k => SHIP_TYPES[k].label),
        datasets: [{
          data: types.map(k => counts[k]),
          backgroundColor: types.map(k => SHIP_TYPES[k].color + 'cc'),
          borderColor: types.map(k => SHIP_TYPES[k].color),
          borderWidth: 1.5,
          hoverOffset: 6,
        }],
      },
      legendEntries: types.map(k => ({
        label: SHIP_TYPES[k].label,
        color: SHIP_TYPES[k].color,
        silhouette: SHIP_TYPES[k].silhouette,
        count: counts[k],
      })),
    };
  }, [vessels]);

  const opts = useMemo(() => ({
    plugins: { legend: { display: false }, tooltip: { titleColor: c.legend, bodyColor: c.legend } },
    cutout: '60%',
    maintainAspectRatio: false,
  }), [c.legend]);

  return (
    <>
      <div style={{ height: 140 }}>
        <Doughnut data={chartData} options={opts} />
      </div>
      <SilhouetteLegend entries={legendEntries} />
    </>
  );
}

// Representative primary color for each country's flag
const FLAG_COLORS = {
  'Panama':           '#003893', // blue
  'Liberia':          '#BF0A30', // red
  'Marshall Islands': '#FF8200', // orange/sunset stripe
  'Iran':             '#239F40', // green
  'Saudi Arabia':     '#006C35', // deep green
  'UAE':              '#EF3340', // red
  'China':            '#DE2910', // chinese red
  'India':            '#FF9933', // saffron
  'Singapore':        '#EF3340', // red
  'Bahamas':          '#00778B', // turquoise
  'Greece':           '#0D5EAF', // greek blue
  'Malta':            '#CF142B', // red
  'Japan':            '#BC002D', // crimson
  'South Korea':      '#003478', // taeguk blue
  'Norway':           '#EF2B2D', // red
  'United Kingdom':   '#012169', // union jack blue
  'USA':              '#B22234', // stripes red
  'Qatar':            '#8D153A', // maroon
  'Kuwait':           '#007A3D', // green
  'Oman':             '#DB161B', // red
};

/* ── Flag chart ── */
export function FlagChart({ vessels, darkMode }) {
  const sorted = useMemo(() => {
    const counts = {};
    vessels.forEach(v => { counts[v.flag] = (counts[v.flag] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [vessels]);

  const total = sorted.reduce((s, [, n]) => s + n, 0);

  const chartData = useMemo(() => {
    const colors = sorted.map(([flag]) => FLAG_COLORS[flag] || '#64748b');
    return {
      labels: sorted.map(([f]) => f),
      datasets: [{
        data: sorted.map(([, n]) => n),
        backgroundColor: colors.map(col => col + 'dd'),
        borderColor: colors,
        borderWidth: 1.5,
        hoverOffset: 5,
      }],
    };
  }, [sorted]);

  const opts = useMemo(() => ({
    plugins: { legend: { display: false }, tooltip: { titleColor: '#cdd9e5', bodyColor: '#8b9eb0' } },
    maintainAspectRatio: false,
  }), []);

  return (
    <>
      <div style={{ height: 150 }}>
        <Pie data={chartData} options={opts} />
      </div>
      {/* Custom flag-image legend — all countries */}
      <div className="chart-custom-legend" style={{ marginTop: 10 }}>
        {sorted.map(([flag, count]) => {
          const color = FLAG_COLORS[flag] || '#64748b';
          const pct = total ? (count / total) * 100 : 0;
          const flagUrl = getFlagUrl(flag);
          return (
            <div className="legend-entry" key={flag}>
              <div className="legend-ship-icon" style={{ borderColor: color + '70', padding: '2px 4px', minWidth: 36 }}>
                {flagUrl
                  ? <img src={flagUrl} alt={flag} style={{ width: 28, height: 'auto', borderRadius: 2, display: 'block' }} />
                  : <span style={{ fontSize: 10, color }}>{flag.slice(0, 2)}</span>
                }
              </div>
              <div className="legend-entry-info">
                <span className="legend-type-name">{flag}</span>
                <div className="legend-bar-row">
                  <div className="legend-mini-bar">
                    <div style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <span className="legend-count" style={{ color }}>{count}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ── Speed distribution ── */
export function SpeedChart({ vessels, darkMode }) {
  const c = getDarkVars(darkMode);

  const { chartData, legendEntries } = useMemo(() => {
    const buckets  = [0, 0, 0, 0, 0];
    vessels.forEach(v => {
      if (v.speed === 0)       buckets[0]++;
      else if (v.speed <= 5)  buckets[1]++;
      else if (v.speed <= 10) buckets[2]++;
      else if (v.speed <= 15) buckets[3]++;
      else                     buckets[4]++;
    });
    const labels = ['0 (Idle)', '1–5 kn', '6–10 kn', '11–15 kn', '16+ kn'];
    const colors = ['#4a5a6a', '#ffd166', '#10d98a', '#00cfff', '#ff4d6a'];
    return {
      chartData: {
        labels,
        datasets: [{
          data: buckets,
          backgroundColor: colors.map(c => c + 'cc'),
          borderColor: colors,
          borderWidth: 1.5,
          hoverOffset: 6,
        }],
      },
      legendEntries: labels.map((lbl, i) => ({
        label: lbl,
        color: colors[i],
        silhouette: ['tug','cargo','tanker','container','lng'][i],
        count: buckets[i],
      })),
    };
  }, [vessels]);

  const opts = useMemo(() => ({
    plugins: { legend: { display: false } },
    cutout: '55%',
    maintainAspectRatio: false,
  }), []);

  return (
    <>
      <div style={{ height: 130 }}>
        <Doughnut data={chartData} options={opts} />
      </div>
      <SilhouetteLegend entries={legendEntries} />
    </>
  );
}

/* ── Hourly transits line chart ── */
export function HourlyChart({ hourlyData, darkMode }) {
  const c = getDarkVars(darkMode);

  const data = useMemo(() => ({
    labels: hourlyData.map((_, i) => String(i).padStart(2, '0') + 'h'),
    datasets: [{
      data: hourlyData,
      borderColor: '#00cfff',
      backgroundColor: 'rgba(0,207,255,0.07)',
      fill: true,
      tension: 0.4,
      pointRadius: 2,
      pointBackgroundColor: '#00cfff',
      pointHoverRadius: 5,
      borderWidth: 2,
    }],
  }), [hourlyData]);

  const opts = useMemo(() => ({
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: c.grid }, ticks: { font: { size: 9 }, color: c.ticks, maxTicksLimit: 8 } },
      y: { grid: { color: c.grid }, min: 0, ticks: { color: c.ticks } },
    },
    maintainAspectRatio: false,
  }), [c.grid, c.ticks]);

  return <div style={{ height: 160 }}><Line data={data} options={opts} /></div>;
}
