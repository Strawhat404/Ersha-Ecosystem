
import React, { useState, useEffect, useRef } from 'react';
import CountUp from 'react-countup';
import {
  LineChart as RLineChart, Line, BarChart as RBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend as RLegend, ResponsiveContainer
} from 'recharts';

const mockStats = {
  logistics: 8,
  farmers: 24,
  merchants: 12,
  experts: 5,
};

const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
const analyticsData = months.map((month, i) => ({
  month,
  logistics: [0, 0, 0, 2, 8, 8][i],
  farmers: [0, 0, 0, 6, 24, 24][i],
  merchants: [0, 0, 0, 3, 12, 12][i],
  experts: [0, 0, 0, 1, 5, 5][i],
}));


// Use color codes for numbers
const colors = {
  logistics: '#2563eb',
  farmers: '#16a34a',
  merchants: '#a21caf',
  experts: '#eab308',
};

const Dashboard = () => {
  const [chartType, setChartType] = useState('line');
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-green-900 mb-6">Dashboard</h1>
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Logistics" value={mockStats.logistics} color={colors.logistics} />
        <StatCard label="Farmers" value={mockStats.farmers} color={colors.farmers} />
        <StatCard label="Merchants" value={mockStats.merchants} color={colors.merchants} />
        <StatCard label="Experts" value={mockStats.experts} color={colors.experts} />
      </div>
      {/* Analytics */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-lg font-semibold text-green-900 flex-1">Analytics Overview</h2>
          <button
            className={`px-3 py-1 rounded-l ${chartType === 'line' ? 'bg-green-700 text-white' : 'bg-gray-100 text-green-900'} font-medium`}
            onClick={() => setChartType('line')}
          >
            Line Chart
          </button>
          <button
            className={`px-3 py-1 rounded-r ${chartType === 'bar' ? 'bg-green-700 text-white' : 'bg-gray-100 text-green-900'} font-medium`}
            onClick={() => setChartType('bar')}
          >
            Bar Chart
          </button>
        </div>
        <div className="w-full overflow-x-auto">
          <div className="w-full min-w-[400px] h-72">
            {chartType === 'line' ? (
              <ResponsiveContainer width="100%" height="100%">
                <RLineChart data={analyticsData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <RLegend verticalAlign="top" height={36} />
                  <Line type="monotone" dataKey="logistics" stroke="#2563eb" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                  <Line type="monotone" dataKey="farmers" stroke="#16a34a" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                  <Line type="monotone" dataKey="merchants" stroke="#a21caf" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                  <Line type="monotone" dataKey="experts" stroke="#eab308" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                </RLineChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RBarChart data={analyticsData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} barCategoryGap={16}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <RLegend verticalAlign="top" height={36} />
                  <Bar dataKey="logistics" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="farmers" fill="#16a34a" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="merchants" fill="#a21caf" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="experts" fill="#eab308" radius={[6, 6, 0, 0]} />
                </RBarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="flex gap-6 mt-6">
          <Legend color={colors.logistics} label="Logistics" />
          <Legend color={colors.farmers} label="Farmers" />
          <Legend color={colors.merchants} label="Merchants" />
          <Legend color={colors.experts} label="Experts" />
        </div>
      </div>
    </div>
);
};


function StatCard({ label, value, color }) {
  // Animation: fade/slide in on mount
  const cardRef = useRef(null);
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.classList.add('animate-statcard');
    }
  }, []);
  // Use color for number, not box
  return (
    <div ref={cardRef} className="bg-white rounded-lg shadow p-6 flex flex-col items-start gap-2 opacity-0 translate-y-4 transition-all duration-700">
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      <span className="text-3xl font-bold" style={{ color }}>{/* colored number */}
        <CountUp end={value} duration={1.2} />
      </span>
    </div>
  );
}

// Inject animation style for StatCard if not present
if (typeof document !== 'undefined' && !document.getElementById('statcard-anim')) {
  const style = document.createElement('style');
  style.id = 'statcard-anim';
  style.innerHTML = `
    .animate-statcard {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block w-4 h-4 rounded ${color}`}></span>
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}

function LineChart({ months, analytics }) {
  // Simple SVG line chart for demo
  const series = Object.entries(analytics);
  const maxY = Math.max(...series.flatMap(([_, arr]) => arr));
  const height = 180;
  const width = 520;
  const stepX = width / (months.length - 1);
  const getY = (val) => height - (val / maxY) * (height - 30);
  const colors = ['#2563eb', '#16a34a', '#a21caf', '#eab308'];
  return (
    <svg width={width} height={height} className="bg-gray-50 rounded-lg w-full max-w-2xl">
      {/* Y grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <line
          key={i}
          x1={0}
          x2={width}
          y1={getY(maxY * p)}
          y2={getY(maxY * p)}
          stroke="#e5e7eb"
        />
      ))}
      {/* X grid */}
      {months.map((_, i) => (
        <line
          key={i}
          x1={i * stepX}
          x2={i * stepX}
          y1={0}
          y2={height}
          stroke="#e5e7eb"
        />
      ))}
      {/* Lines */}
      {series.map(([key, arr], idx) => (
        <polyline
          key={key}
          fill="none"
          stroke={colors[idx]}
          strokeWidth={3}
          points={arr.map((v, i) => `${i * stepX},${getY(v)}`).join(' ')}
        />
      ))}
      {/* Dots */}
      {series.map(([key, arr], idx) => (
        arr.map((v, i) => (
          <circle
            key={key + i}
            cx={i * stepX}
            cy={getY(v)}
            r={4}
            fill={colors[idx]}
            stroke="#fff"
            strokeWidth={2}
          />
        ))
      ))}
      {/* X labels */}
      {months.map((m, i) => (
        <text
          key={m}
          x={i * stepX}
          y={height - 5}
          textAnchor="middle"
          fontSize={13}
          fill="#64748b"
        >
          {m}
        </text>
      ))}
      {/* Y labels */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <text
          key={i}
          x={-5}
          y={getY(maxY * p) + 5}
          textAnchor="end"
          fontSize={13}
          fill="#64748b"
        >
          {Math.round(maxY * p)}
        </text>
      ))}
    </svg>
  );
}

function BarChart({ months, analytics, maxY }) {
  const series = Object.entries(analytics);
  const height = 180;
  const width = 520;
  const barWidth = 18;
  const groupWidth = barWidth * series.length + 12;
  return (
    <svg width={width} height={height} className="bg-gray-50 rounded-lg w-full max-w-2xl">
      {/* Y grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <line
          key={i}
          x1={0}
          x2={width}
          y1={height - (height - 30) * p}
          y2={height - (height - 30) * p}
          stroke="#e5e7eb"
        />
      ))}
      {/* Bars */}
      {months.map((m, i) => (
        series.map(([key, arr], idx) => (
          <rect
            key={key + i}
            x={i * groupWidth + idx * barWidth}
            y={height - (arr[i] / maxY) * (height - 30)}
            width={barWidth}
            height={(arr[i] / maxY) * (height - 30)}
            fill={['#2563eb', '#16a34a', '#a21caf', '#eab308'][idx]}
            rx={3}
          />
        ))
      ))}
      {/* X labels */}
      {months.map((m, i) => (
        <text
          key={m}
          x={i * groupWidth + (groupWidth / 2) - 8}
          y={height - 5}
          textAnchor="middle"
          fontSize={13}
          fill="#64748b"
        >
          {m}
        </text>
      ))}
      {/* Y labels */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <text
          key={i}
          x={-5}
          y={height - (height - 30) * p + 5}
          textAnchor="end"
          fontSize={13}
          fill="#64748b"
        >
          {Math.round(maxY * p)}
        </text>
      ))}
    </svg>
  );
}

export default Dashboard;
