import { useMemo } from 'react';
import { Pie, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Tooltip, Legend,
  ArcElement,
} from 'chart.js';
import { SHIP_TYPES } from '../data/vessels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ArcElement);

ChartJS.defaults.color = '#64748b';
ChartJS.defaults.font.family = "'Inter', system-ui, sans-serif";
ChartJS.defaults.font.size = 11;

const pieOpts = {
  plugins: {
    legend: {
      position: 'right',
      labels: {
        boxWidth: 12,
        padding: 10,
        font: { size: 10 },
        color: '#475569',
      },
    },
  },
  maintainAspectRatio: false,
};

export function VesselTypesChart({ vessels }) {
  const data = useMemo(() => {
    const counts = {};
    vessels.forEach(v => { counts[v.type] = (counts[v.type] || 0) + 1; });
    const types = Object.keys(counts);
    return {
      labels: types.map(k => SHIP_TYPES[k].label),
      datasets: [{
        data: types.map(k => counts[k]),
        backgroundColor: types.map(k => SHIP_TYPES[k].color),
        borderWidth: 2,
        borderColor: '#fff',
      }],
    };
  }, [vessels]);

  return <div style={{ height: 220 }}><Doughnut data={data} options={pieOpts} /></div>;
}

export function FlagChart({ vessels }) {
  const data = useMemo(() => {
    const counts = {};
    vessels.forEach(v => { counts[v.flag] = (counts[v.flag] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const colors = ['#0077b6','#00b4d8','#90e0ef','#e74c3c','#e67e22','#f1c40f','#2ecc71','#9b59b6','#1abc9c','#34495e'];
    return {
      labels: sorted.map(f => f[0]),
      datasets: [{
        data: sorted.map(f => f[1]),
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#fff',
      }],
    };
  }, [vessels]);

  return <div style={{ height: 220 }}><Pie data={data} options={pieOpts} /></div>;
}

export function SpeedChart({ vessels }) {
  const data = useMemo(() => {
    const buckets = [0, 0, 0, 0, 0];
    vessels.forEach(v => {
      if (v.speed === 0) buckets[0]++;
      else if (v.speed <= 5) buckets[1]++;
      else if (v.speed <= 10) buckets[2]++;
      else if (v.speed <= 15) buckets[3]++;
      else buckets[4]++;
    });
    return {
      labels: ['0 (Idle)', '1–5', '6–10', '11–15', '16+'],
      datasets: [{
        data: buckets,
        backgroundColor: ['#94a3b8', '#f1c40f', '#2ecc71', '#3498db', '#e74c3c'],
        borderWidth: 2,
        borderColor: '#fff',
      }],
    };
  }, [vessels]);

  return <div style={{ height: 200 }}><Doughnut data={data} options={pieOpts} /></div>;
}

export function HourlyChart({ hourlyData }) {
  const data = useMemo(() => ({
    labels: hourlyData.map((_, i) => String(i).padStart(2, '0') + ':00'),
    datasets: [{
      data: hourlyData,
      borderColor: '#0077b6',
      backgroundColor: 'rgba(0,119,182,0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: '#0077b6',
      pointHoverRadius: 6,
      borderWidth: 2.5,
    }],
  }), [hourlyData]);

  return (
    <div style={{ height: 180 }}>
      <Line data={data} options={{
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: '#e2e8f0' }, ticks: { font: { size: 9 }, color: '#94a3b8' } },
          y: { grid: { color: '#e2e8f0' }, min: 0, ticks: { color: '#94a3b8' } },
        },
        maintainAspectRatio: false,
      }} />
    </div>
  );
}
