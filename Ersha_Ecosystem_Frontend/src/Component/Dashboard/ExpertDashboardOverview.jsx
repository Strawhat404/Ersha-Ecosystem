import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import ExpertProfileSetup from './ExpertProfileSetup';
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
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Real data from API
  const [dashboardData, setDashboardData] = useState({
    totalAdvices: 0,
    activeBookings: 0,
    upcomingMeetings: 0,
    totalEarnings: 0,
    rating: 0,
    completionRate: 0,
    responseTime: '0h',
    totalClients: 0
  });

  const [consultations, setConsultations] = useState([]);
  const [expertProfile, setExpertProfile] = useState(null);

  // Profile setup state
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  // API Base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  // Handle profile creation
  const handleProfileCreated = (profileData) => {
    setExpertProfile(profileData);
    setShowProfileSetup(false);
    // Refresh consultations after profile creation
    fetchConsultations();
  };

  // Fetch expert profile
  const fetchExpertProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/advisory/experts/my_profile/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        // Expert profile doesn't exist - show profile setup
        setShowProfileSetup(true);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExpertProfile(data);
      setShowProfileSetup(false);
    } catch (err) {
      setError('Failed to load expert profile. Please try again.');
      console.error('Error fetching expert profile:', err);
    }
  };

  // Fetch consultations
  const fetchConsultations = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/advisory/experts/my_consultations/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setConsultations(data);
      
      // Calculate dashboard statistics from real data
      calculateDashboardStats(data);
    } catch (err) {
      setError('Failed to load consultations. Please try again.');
      console.error('Error fetching consultations:', err);
    }
  };

  // Calculate dashboard statistics from consultations data
  const calculateDashboardStats = (consultationsData) => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
    
    const totalAdvices = consultationsData.length;
    const activeBookings = consultationsData.filter(c => c.status === 'confirmed').length;
    const upcomingMeetings = consultationsData.filter(c => {
      const consultationDate = new Date(c.preferred_date);
      return consultationDate >= now && consultationDate <= sevenDaysFromNow && c.status === 'confirmed';
    }).length;
    
    const totalEarnings = consultationsData
      .filter(c => c.status === 'completed')
      .reduce((sum, c) => sum + parseFloat(c.total_cost || 0), 0);
    
    const completedConsultations = consultationsData.filter(c => c.status === 'completed').length;
    const completionRate = totalAdvices > 0 ? Math.round((completedConsultations / totalAdvices) * 100) : 0;
    
    // Get unique clients
    const uniqueClients = new Set(consultationsData.map(c => c.user_email)).size;
    
    setDashboardData({
      totalAdvices,
      activeBookings,
      upcomingMeetings,
      totalEarnings: Math.round(totalEarnings),
      rating: expertProfile?.rating || 0,
      completionRate,
      responseTime: '2h', // This would need to be calculated from actual response times
      totalClients: uniqueClients
    });
  };

  // Load data on component mount
  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchExpertProfile(), fetchConsultations()])
        .finally(() => setLoading(false));
    }
  }, [user]);

  // Recalculate stats when consultations change
  useEffect(() => {
    if (consultations.length > 0) {
      calculateDashboardStats(consultations);
    }
  }, [consultations, expertProfile]);

  // Calculate chart data from real consultations
  const getWeeklyConsultations = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Monday
    
    return days.map((day, index) => {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + index);
      const dayStr = dayDate.toISOString().split('T')[0];
      
      const dayConsultations = consultations.filter(c => c.preferred_date === dayStr);
      const earnings = dayConsultations.reduce((sum, c) => sum + parseFloat(c.total_cost || 0), 0);
      
      return {
        day,
        consultations: dayConsultations.length,
        earnings: Math.round(earnings)
      };
    });
  };

  const getMonthlyTrends = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    return months.map((month, index) => {
      const monthConsultations = consultations.filter(c => {
        const consultationDate = new Date(c.preferred_date);
        return consultationDate.getFullYear() === currentYear && consultationDate.getMonth() === index;
      });
      
      const uniqueClients = new Set(monthConsultations.map(c => c.user_email)).size;
      
      return {
        month,
        consultations: monthConsultations.length,
        clients: uniqueClients
      };
    });
  };

  const getConsultationTypes = () => {
    // Group consultations by subject/topic
    const typeCounts = {};
    consultations.forEach(c => {
      const topic = c.subject || 'General Consultation';
      typeCounts[topic] = (typeCounts[topic] || 0) + 1;
    });
    
    const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];
    
    return Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, value], index) => ({
        name,
        value: Math.round((value / consultations.length) * 100),
        color: colors[index % colors.length]
      }));
  };

  const getUpcomingMeetings = () => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
    
    return consultations
      .filter(c => {
        const consultationDate = new Date(c.preferred_date);
        return consultationDate >= now && consultationDate <= sevenDaysFromNow && c.status === 'confirmed';
      })
      .slice(0, 3)
      .map(c => ({
        id: c.id,
        client: c.user_name,
        time: c.preferred_time,
        date: new Date(c.preferred_date).toDateString() === new Date().toDateString() ? 'Today' : 
              new Date(c.preferred_date).toDateString() === new Date(Date.now() + 86400000).toDateString() ? 'Tomorrow' :
              new Date(c.preferred_date).toLocaleDateString(),
        topic: c.subject,
        type: 'video', // Default to video for now
        avatar: c.user_name.split(' ').map(n => n[0]).join('').toUpperCase()
      }));
  };

  const getRecentActivities = () => {
    const activities = [];
    
    // Add recent consultations
    consultations
      .filter(c => c.status === 'completed')
      .slice(0, 2)
      .forEach(c => {
        activities.push({
          id: `completed-${c.id}`,
          type: 'consultation',
          message: `Completed consultation with ${c.user_name}`,
          time: '2 hours ago', // This would need to be calculated from actual timestamps
          icon: CheckCircle,
          color: 'text-green-600'
        });
      });
    
    // Add new bookings
    consultations
      .filter(c => c.status === 'confirmed')
      .slice(0, 1)
      .forEach(c => {
        activities.push({
          id: `booking-${c.id}`,
          type: 'booking',
          message: `New booking from ${c.user_name}`,
          time: '4 hours ago',
          icon: Calendar,
          color: 'text-blue-600'
        });
      });
    
    return activities.slice(0, 4);
  };

  const weeklyConsultations = getWeeklyConsultations();
  const monthlyTrends = getMonthlyTrends();
  const consultationTypes = getConsultationTypes();
  const upcomingMeetings = getUpcomingMeetings();
  const recentActivities = getRecentActivities();

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
      {/* Show profile setup if no expert profile exists */}
      {showProfileSetup && (
        <ExpertProfileSetup
          onProfileCreated={handleProfileCreated}
          onCancel={() => setShowProfileSetup(false)}
        />
      )}

      {/* Show dashboard only if expert profile exists */}
      {!showProfileSetup && (
        <>
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

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard data...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600 mb-4">
                {error === 'PROFILE_NOT_FOUND' 
                  ? 'Please complete your expert registration to access this dashboard.' 
                  : error
                }
              </p>
              <button
                onClick={() => {
                  if (error === 'PROFILE_NOT_FOUND') {
                    // Redirect to profile setup page
                    window.location.href = '/profile-setup';
                  } else {
                    setError(null);
                    fetchExpertProfile();
                    fetchConsultations();
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                {error === 'PROFILE_NOT_FOUND' ? 'Complete Profile Setup' : 'Try Again'}
              </button>
            </div>
          )}

          {/* Dashboard Content */}
          {!loading && !error && (
            <>
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
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ExpertDashboardOverview;
