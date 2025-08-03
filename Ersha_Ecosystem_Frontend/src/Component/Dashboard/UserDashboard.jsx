import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  BarChart3, 
  CreditCard, 
  Truck, 
  BookOpen, 
  Newspaper, 
  Cloud,
  CloudSun,
  Leaf,
  User,
  Building,
  TrendingUp,
  DollarSign,
  Package,
  Calendar,
  Shield,
  ShieldCheck,
  ShieldX,
  Clock,
  LogOut,
  ExternalLink,
  GraduationCap
} from 'lucide-react';

// Import dashboard components
import AnalyticsDashboard from './AnalyticsDashboard';
import PaymentSystem from './PaymentSystem';
import LogisticsTracker from './LogisticsTracker';
import Marketplace from '../Marketplace/Marketplace';
import Weather from '../Weather/EnhancedWeather';
import Advisory from '../Advisory/Advisory';
import News from '../News/News';
import FarmerNotifications from './FarmerNotifications';

const UserDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeView, setActiveView] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeOrders, setActiveOrders] = useState({ total: 0, pending: 0 });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Determine user type from profile
  const userType = profile?.user_type || user?.user_type || 'farmer';

  // Set initial view based on URL parameters or user type
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const view = urlParams.get('view');
    
    if (view && dashboardItems.find(item => item.id === view)) {
      setActiveView(view);
    } else {
      // Set default view based on user type
      const defaultView = userType === 'farmer' ? 'overview' : 'marketplace';
      setActiveView(defaultView);
    }
  }, [location.search, userType]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-dropdown')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  // Fetch data on component mount and set up polling
  useEffect(() => {
    fetchActiveOrders();
    fetchNotifications();
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchActiveOrders();
      fetchNotifications();
    }, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, [userType]);

  // Fetch active orders for farmers
  const fetchActiveOrders = async () => {
    if (userType !== 'farmer') return;
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch('/api/orders/orders/farmer_orders/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const orders = data.results || [];
        const total = orders.length;
        const pending = orders.filter(order => 
          ['pending', 'processing', 'shipped'].includes(order.status)
        ).length;
        
        setActiveOrders({ total, pending });
      }
    } catch (error) {
      console.error('Error fetching active orders:', error);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch('/api/orders/notifications/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const notifications = data.results || [];
        setNotifications(notifications);
        setUnreadCount(notifications.filter(n => !n.is_read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getVerificationIcon = (status) => {
    switch (status) {
      case 'verified':
        return <ShieldCheck className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <ShieldX className="w-5 h-5 text-red-600" />;
      default:
        return <Shield className="w-5 h-5 text-gray-600" />;
    }
  };

  const getVerificationLabel = (status) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Pending Verification';
      case 'failed':
        return 'Verification Failed';
      default:
        return 'Not Verified';
    }
  };

  const getVerificationColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const dashboardItems = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: <Home className="w-5 h-5" />,
      gradient: 'from-blue-500 to-purple-600',
      description: 'Your dashboard summary'
    },
    { 
      id: 'marketplace', 
      label: 'Marketplace', 
      icon: <ShoppingBag className="w-5 h-5" />,
      gradient: 'from-emerald-500 to-teal-600',
      description: 'Buy and sell products'
    },
    ...(userType === 'farmer' ? [{
      id: 'analytics', 
      label: 'Analytics', 
      icon: <BarChart3 className="w-5 h-5" />,
      gradient: 'from-purple-500 to-pink-600',
      description: 'Business insights & reports'
    }] : []),
    { 
      id: 'payments', 
      label: 'Payments', 
      icon: <CreditCard className="w-5 h-5" />,
      gradient: 'from-green-500 to-emerald-600',
      description: 'Manage transactions'
    },
    { 
      id: 'logistics', 
      label: 'Logistics', 
      icon: <Truck className="w-5 h-5" />,
      gradient: 'from-orange-500 to-red-600',
      description: 'Track deliveries'
    },
    { 
      id: 'weather', 
      label: 'Weather', 
      icon: <Cloud className="w-5 h-5" />,
      gradient: 'from-sky-500 to-blue-600',
      description: 'Weather forecasts'
    },
    { 
      id: 'advisory', 
      label: 'Advisory', 
      icon: <BookOpen className="w-5 h-5" />,
      gradient: 'from-yellow-500 to-orange-600',
      description: 'Farming guidance'
    },
    { 
      id: 'news', 
      label: 'News', 
      icon: <Newspaper className="w-5 h-5" />,
      gradient: 'from-indigo-500 to-purple-600',
      description: 'Latest updates'
    }
  ];

  const handleViewChange = (viewId) => {
    setActiveView(viewId);
    // Update URL without page reload
    navigate(`/dashboard?view=${viewId}`, { replace: true });
  };

  const getUserTypeIcon = (type) => {
    switch (type) {
      case 'farmer':
        return <Leaf className="w-6 h-6 text-green-600" />;
      case 'buyer':
        return <ShoppingBag className="w-6 h-6 text-blue-600" />;
      case 'expert':
        return <GraduationCap className="w-6 h-6 text-purple-600" />;
      case 'logistics':
        return <Truck className="w-6 h-6 text-orange-600" />;
      default:
        return <User className="w-6 h-6 text-gray-600" />;
    }
  };

  const getUserTypeLabel = (type) => {
    switch (type) {
      case 'farmer':
        return 'Farmer';
      case 'buyer':
        return 'Buyer/Merchant';
      case 'expert':
        return 'Expert';
      case 'logistics':
        return 'Logistics Company';
      default:
        return 'User';
    }
  };

  const renderDashboardView = () => {
    switch(activeView) {
      case 'overview': {
        const verificationStatus = profile?.verification_status || 'not_verified';
        
        return (
          <div className="space-y-6">
            {/* Welcome Section - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg p-6 text-white"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Leaf className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                      {profile?.first_name || user?.first_name || 'Farmer'}
                    </h1>
                    <p className="text-emerald-100">
                      Welcome to your farming dashboard
                    </p>
                  </div>
                </div>
                
                {/* Verification Status - Always show when there's a status */}
                {verificationStatus && verificationStatus !== 'not_verified' ? (
                  <div 
                    className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-colors"
                    onClick={() => verificationStatus !== 'verified' && navigate('/verification')}
                    title={getVerificationLabel(verificationStatus)}
                  >
                    {getVerificationIcon(verificationStatus)}
                    <span className="font-medium text-sm">
                      {verificationStatus === 'verified' ? 'Verified' : 'Verify Now'}
                    </span>
                  </div>
                ) : (
                  <div 
                    className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-colors"
                    onClick={() => navigate('/verification')}
                    title="Get Verified"
                  >
                    <Shield className="w-5 h-5 text-white/80" />
                    <span className="font-medium text-sm">Get Verified</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Key Metrics - Simplified and More Visual */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Total Earnings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                    <p className="text-2xl font-bold text-gray-900">ETB 12,540</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </motion.div>

              {/* Weather Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-blue-500 to-sky-600 rounded-2xl shadow-lg p-5 text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-100">Weather</p>
                    <p className="text-2xl font-bold">24°C</p>
                    <p className="text-sm text-blue-100">Addis Ababa</p>
                  </div>
                  <div className="p-2 bg-white/20 rounded-xl">
                    <CloudSun className="w-8 h-8" />
                  </div>
                </div>
                <div className="mt-3 flex justify-between text-xs">
                  <div className="text-center">
                    <p>H: 28°</p>
                    <p>L: 18°</p>
                  </div>
                  <div className="text-center">
                    <p>Humidity</p>
                    <p>65%</p>
                  </div>
                  <div className="text-center">
                    <p>Wind</p>
                    <p>12 km/h</p>
                  </div>
                </div>
              </motion.div>

              {/* Active Orders */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Orders</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {activeOrders.total || '0'}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-3 flex items-center text-sm">
                  {activeOrders.pending > 0 ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-blue-600">{activeOrders.pending} pending</span>
                    </>
                  ) : (
                    <span className="text-gray-400">No pending orders</span>
                  )}
                </div>
              </motion.div>

              {/* Next Action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Your Next Step</p>
                    <p className="text-lg font-bold text-gray-900">
                      {verificationStatus === 'verified' ? 'Sell Products' : 'Get Verified'}
                    </p>
                  </div>
                  <button 
                    onClick={() => verificationStatus === 'verified' ? handleViewChange('marketplace') : navigate('/verification')}
                    className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white"
                  >
                    {verificationStatus === 'verified' ? 
                      <ShoppingBag className="w-6 h-6" /> : 
                      <Shield className="w-6 h-6" />
                    }
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {verificationStatus === 'verified' ? 
                    'List your products to start selling' : 
                    'Complete verification to access all features'
                  }
                </p>
              </motion.div>
            </div>

            {/* Quick Actions - More Visual */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {dashboardItems
                  .filter(item => item.id !== 'overview')
                  .map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => handleViewChange(item.id)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 group"
                    >
                      <div className={`p-3 rounded-lg mb-2 bg-gradient-to-r ${item.gradient} text-white`}>
                        {React.cloneElement(item.icon, { className: 'w-6 h-6' })}
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-700">
                        {item.label}
                      </span>
                    </motion.button>
                  ))
                }
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="p-2 bg-emerald-50 rounded-lg mr-3">
                      <Package className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New order received</p>
                      <p className="text-xs text-gray-500">Order #100{item} • 2 hours ago</p>
                    </div>
                    <span className="text-xs font-medium text-emerald-600">View</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        );
      }

      case 'marketplace':
        return <Marketplace />;
        
      case 'analytics':
        return userType === 'farmer' ? <AnalyticsDashboard userType={userType} /> : <div className="text-center py-12"><p className="text-gray-600">Analytics dashboard is only available for farmers.</p></div>;
        
      case 'payments':
        return <PaymentSystem userType={userType} />;
        
      case 'logistics':
        return <LogisticsTracker userType={userType} />;
        
      case 'weather':
        return <Weather />;
        
      case 'advisory':
        return <Advisory />;
        
      case 'news':
        return <News />;
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              
              {/* Navigation Tabs */}
              <nav className="flex space-x-1">
                {dashboardItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleViewChange(item.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      activeView === item.id
                        ? 'bg-gradient-to-r text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    } ${activeView === item.id ? item.gradient : ''}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </motion.button>
                ))}
              </nav>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-xs text-gray-500">{getUserTypeLabel(userType)}</p>
              </div>
              
              {/* Farmer Notifications - Only show for farmers */}
              {userType === 'farmer' && (
                <FarmerNotifications 
                  notifications={notifications}
                  unreadCount={unreadCount}
                />
              )}
              
              {/* Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full hover:from-green-200 hover:to-emerald-200 transition-all duration-200"
                >
                  {getUserTypeIcon(userType)}
                </button>
                
                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {profile?.first_name} {profile?.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{profile?.email}</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/profile');
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile Settings</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/verification');
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Verification</span>
                      </button>
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          handleLogout();
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderDashboardView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserDashboard; 