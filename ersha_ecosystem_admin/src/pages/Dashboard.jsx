
import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import {
  LineChart as RLineChart, Line, BarChart as RBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend as RLegend, ResponsiveContainer
} from 'recharts';
import { dashboardAPI } from '../lib/api';

const Dashboard = () => {
  const [chartType, setChartType] = useState('line');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getComprehensiveStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardStats}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  const { platform_stats } = stats;

  // Use color codes for numbers
  const colors = {
    logistics: '#2563eb',
    farmers: '#16a34a',
    merchants: '#a21caf',
    experts: '#eab308',
  };

  // Prepare chart data
  const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  const analyticsData = months.map((month, i) => ({
    month,
    logistics: [0, 0, 0, 2, platform_stats.logistics.providers, platform_stats.logistics.providers][i],
    farmers: [0, 0, 0, 6, platform_stats.users.farmers, platform_stats.users.farmers][i],
    merchants: [0, 0, 0, 3, platform_stats.users.merchants, platform_stats.users.merchants][i],
    experts: [0, 0, 0, 1, platform_stats.experts.total, platform_stats.experts.total][i],
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-green-900 mb-6">Dashboard</h1>
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Logistics" 
          value={platform_stats.logistics.providers} 
          color={colors.logistics} 
        />
        <StatCard 
          label="Farmers" 
          value={platform_stats.users.farmers} 
          color={colors.farmers} 
        />
        <StatCard 
          label="Merchants" 
          value={platform_stats.users.merchants} 
          color={colors.merchants} 
        />
        <StatCard 
          label="Experts" 
          value={platform_stats.experts.total} 
          color={colors.experts} 
        />
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
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold" style={{ color }}>
            <CountUp end={value} duration={2} />
          </p>
        </div>
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color }}></div>
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded" style={{ backgroundColor: color }}></div>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
}

export default Dashboard;
