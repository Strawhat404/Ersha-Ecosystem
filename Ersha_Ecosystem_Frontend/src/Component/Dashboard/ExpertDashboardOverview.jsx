import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  DollarSign,
  Activity,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Eye,
  Phone,
  Video
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

const ExpertDashboardOverview = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  const [dashboardData, setDashboardData] = useState({
    totalAdvices: 156,
    activeBookings: 8,
    upcomingMeetings: 3,
    totalEarnings: 12450,
    rating: 4.8,
    completionRate: 94,
    responseTime: '2h',
    totalClients: 89
  });

  // Mock data for charts
  const weeklyConsultations = [
    { day: 'Mon', consultations: 12, earnings: 480 },
    { day: 'Tue', consultations: 8, earnings: 320 },
    { day: 'Wed', consultations: 15, earnings: 600 },
    { day: 'Thu', consultations: 10, earnings: 400 },
    { day: 'Fri', consultations: 18, earnings: 720 },
    { day: 'Sat', consultations: 6, earnings: 240 },
    { day: 'Sun', consultations: 4, earnings: 160 }
  ];

  const monthlyTrends = [
    { month: 'Jan', consultations: 45, clients: 23 },
    { month: 'Feb', consultations: 52, clients: 28 },
    { month: 'Mar', consultations: 48, clients: 25 },
    { month: 'Apr', consultations: 61, clients: 32 },
    { month: 'May', consultations: 58, clients: 30 },
    { month: 'Jun', consultations: 67, clients: 35 }
  ];

  const consultationTypes = [
    { name: 'Crop Management', value: 35, color: '#10B981' },
    { name: 'Pest Control', value: 25, color: '#3B82F6' },
    { name: 'Soil Health', value: 20, color: '#F59E0B' },
    { name: 'Irrigation', value: 15, color: '#EF4444' },
    { name: 'Other', value: 5, color: '#8B5CF6' }
  ];

  const upcomingMeetings = [
    {
      id: 1,
      client: 'Abebe Kebede',
      time: '10:00 AM',
      date: 'Today',
      topic: 'Tomato Disease Management',
      type: 'video',
      avatar: 'AK'
    },
    {
      id: 2,
      client: 'Meron Tadesse',
      time: '2:30 PM',
      date: 'Today',
      topic: 'Organic Farming Techniques',
      type: 'phone',
      avatar: 'MT'
    },
    {
      id: 3,
      client: 'Dawit Solomon',
      time: '9:00 AM',
      date: 'Tomorrow',
      topic: 'Irrigation System Setup',
      type: 'video',
      avatar: 'DS'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'consultation',
      message: 'Completed consultation with Almaz Tesfaye',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'booking',
      message: 'New booking from Yohannes Girma',
      time: '4 hours ago',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'review',
      message: 'Received 5-star review from Tigist Bekele',
      time: '6 hours ago',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      id: 4,
      type: 'message',
      message: 'New message from Haile Mariam',
      time: '1 day ago',
      icon: MessageSquare,
      color: 'text-purple-600'
    }
  ];

  const StatCard = ({ title, value, change, changeType, icon: Icon, gradient, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            </div>
          </div>
        </div>
        {change && (
          <div className={`flex items-center space-x-1 ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            {changeType === 'positive' ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Track your consultation performance and client engagement</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Bookings"
          value={dashboardData.activeBookings}
          change="+12%"
          changeType="positive"
          icon={Users}
          gradient="from-blue-500 to-blue-600"
          subtitle="Currently scheduled"
        />
        <StatCard
          title="Upcoming Meetings"
          value={dashboardData.upcomingMeetings}
          change="+5%"
          changeType="positive"
          icon={Calendar}
          gradient="from-green-500 to-green-600"
          subtitle="Next 7 days"
        />
        <StatCard
          title="Total Advices"
          value={dashboardData.totalAdvices}
          change="+18%"
          changeType="positive"
          icon={MessageSquare}
          gradient="from-purple-500 to-purple-600"
          subtitle="All time consultations"
        />
        <StatCard
          title="Average Rating"
          value={`${dashboardData.rating}/5.0`}
          change="+0.2"
          changeType="positive"
          icon={Star}
          gradient="from-yellow-500 to-yellow-600"
          subtitle="Client satisfaction"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Consultations Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Weekly Consultations</h3>
              <p className="text-sm text-gray-600">Consultations and earnings this week</p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyConsultations}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="consultations" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Trends Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
              <p className="text-sm text-gray-600">Consultations and client growth</p>
            </div>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="consultations" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="clients" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Consultation Types Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Consultation Types</h3>
              <p className="text-sm text-gray-600">Distribution by category</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={consultationTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {consultationTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {consultationTypes.map((type, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="text-sm text-gray-600">{type.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{type.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Meetings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Meetings</h3>
              <p className="text-sm text-gray-600">Next scheduled consultations</p>
            </div>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {upcomingMeetings.map((meeting) => (
              <div key={meeting.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {meeting.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{meeting.client}</p>
                  <p className="text-xs text-gray-500 truncate">{meeting.topic}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-400">{meeting.date} at {meeting.time}</span>
                    {meeting.type === 'video' ? (
                      <Video className="w-3 h-3 text-blue-500" />
                    ) : (
                      <Phone className="w-3 h-3 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-600">Latest updates and actions</p>
            </div>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-gray-50 ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExpertDashboardOverview;
