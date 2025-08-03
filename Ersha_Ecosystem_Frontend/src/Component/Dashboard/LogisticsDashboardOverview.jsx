import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle,
  TrendingUp,
  MapPin,
  DollarSign,
  Users,
  Activity,
  AlertTriangle,
  Calendar,
  Star
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { logisticsAPI } from '../../lib/api';

const LogisticsDashboardOverview = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Check if user is authenticated
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No authentication token found. Please login first.');
        }
        
        const [dashboardResponse, metricsResponse] = await Promise.all([
          logisticsAPI.getDashboard(),
          logisticsAPI.getPerformanceMetrics()
        ]);
        
        setDashboardData(dashboardResponse);
        setPerformanceMetrics(metricsResponse);
      } catch (err) {
        console.error('Error fetching logistics dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Mock data for demonstration (fallback)
  const weeklyDeliveries = [
    { day: 'Mon', deliveries: 45, earnings: 2250 },
    { day: 'Tue', deliveries: 38, earnings: 1900 },
    { day: 'Wed', deliveries: 52, earnings: 2600 },
    { day: 'Thu', deliveries: 41, earnings: 2050 },
    { day: 'Fri', deliveries: 48, earnings: 2400 },
    { day: 'Sat', deliveries: 35, earnings: 1750 },
    { day: 'Sun', deliveries: 28, earnings: 1400 }
  ];

  const monthlyTrends = [
    { month: 'Jan', deliveries: 1200, clients: 85 },
    { month: 'Feb', deliveries: 1350, clients: 92 },
    { month: 'Mar', deliveries: 1180, clients: 88 },
    { month: 'Apr', deliveries: 1420, clients: 95 },
    { month: 'May', deliveries: 1380, clients: 98 },
    { month: 'Jun', deliveries: 1520, clients: 102 }
  ];

  const deliveryTypes = [
    { name: 'Farm to Market', value: 45, color: '#f97316' },
    { name: 'Equipment', value: 25, color: '#ef4444' },
    { name: 'Seeds & Supplies', value: 20, color: '#f59e0b' },
    { name: 'Livestock', value: 10, color: '#dc2626' }
  ];

  const recentActivities = [
    { id: 1, type: 'delivery', message: 'Completed delivery to Green Valley Farm', time: '2 hours ago', status: 'completed' },
    { id: 2, type: 'pickup', message: 'New pickup request from Sunrise Agriculture', time: '4 hours ago', status: 'pending' },
    { id: 3, type: 'delivery', message: 'Delivered equipment to Mountain View Ranch', time: '6 hours ago', status: 'completed' },
    { id: 4, type: 'route', message: 'Optimized route for tomorrow\'s deliveries', time: '1 day ago', status: 'info' }
  ];

  const upcomingDeliveries = [
    { id: 1, client: 'Golden Harvest Co.', location: 'Downtown District', time: '09:00 AM', type: 'Produce', priority: 'high' },
    { id: 2, client: 'Fresh Fields Farm', location: 'North Valley', time: '11:30 AM', type: 'Equipment', priority: 'medium' },
    { id: 3, client: 'Organic Gardens Ltd.', location: 'East Side', time: '02:15 PM', type: 'Supplies', priority: 'low' }
  ];

  const stats = [
    {
      title: 'Active Orders',
      value: dashboardData?.active_deliveries?.toString() || '0',
      change: '+12%',
      changeType: 'increase',
      icon: <Package className="w-6 h-6" />,
      gradient: 'from-orange-500 to-red-500',
      description: 'Currently in transit'
    },
    {
      title: 'Pending Pickups',
      value: dashboardData?.pending_deliveries?.toString() || '0',
      change: '+5%',
      changeType: 'increase',
      icon: <Clock className="w-6 h-6" />,
      gradient: 'from-amber-500 to-orange-500',
      description: 'Awaiting collection'
    },
    {
      title: 'Total Deliveries',
      value: dashboardData?.total_deliveries?.toString() || '0',
      change: '+18%',
      changeType: 'increase',
      icon: <CheckCircle className="w-6 h-6" />,
      gradient: 'from-green-500 to-emerald-500',
      description: 'This month'
    },
    {
      title: 'Average Rating',
      value: performanceMetrics?.success_rate ? `${performanceMetrics.success_rate}%` : '0%',
      change: '+0.2',
      changeType: 'increase',
      icon: <Star className="w-6 h-6" />,
      gradient: 'from-yellow-500 to-amber-500',
      description: 'Success rate'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading logistics dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Track your delivery performance and logistics operations</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient}`}>
                <div className="text-white">
                  {stat.icon}
                </div>
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="w-4 h-4" />
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
              <p className="text-gray-500 text-xs mt-1">{stat.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Deliveries Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Weekly Deliveries</h3>
              <p className="text-gray-600 text-sm">Deliveries and earnings this week</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Deliveries</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyDeliveries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="deliveries" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Trends Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
              <p className="text-gray-600 text-sm">Deliveries and client growth</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Deliveries</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Clients</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line type="monotone" dataKey="deliveries" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} />
              <Line type="monotone" dataKey="clients" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Delivery Types Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Delivery Types</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={deliveryTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {deliveryTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {deliveryTypes.map((type, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }}></div>
                <span className="text-sm text-gray-600">{type.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  activity.status === 'completed' ? 'bg-green-100' :
                  activity.status === 'pending' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  {activity.type === 'delivery' ? (
                    <CheckCircle className={`w-4 h-4 ${
                      activity.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                    }`} />
                  ) : activity.type === 'pickup' ? (
                    <Package className="w-4 h-4 text-yellow-600" />
                  ) : (
                    <Activity className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Deliveries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Deliveries</h3>
          <div className="space-y-4">
            {upcomingDeliveries.map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{delivery.client}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">{delivery.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">{delivery.time}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    delivery.priority === 'high' ? 'bg-red-100 text-red-800' :
                    delivery.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {delivery.priority}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{delivery.type}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LogisticsDashboardOverview;
