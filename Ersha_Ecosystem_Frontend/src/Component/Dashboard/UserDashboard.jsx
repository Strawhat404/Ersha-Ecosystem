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

const UserDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeView, setActiveView] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: <BarChart3 className="w-5 h-5" />,
      gradient: 'from-purple-500 to-pink-600',
      description: 'Business insights & reports'
    },
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
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                    {getUserTypeIcon(userType)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Welcome back, {profile?.first_name || user?.first_name || 'User'}!
                    </h1>
                    <p className="text-gray-600">
                      {getUserTypeLabel(userType)} Dashboard • {profile?.region || 'Ethiopia'}
                    </p>
                  </div>
                </div>
                
                {/* Verification Status */}
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getVerificationColor(profile?.verification_status || 'not_verified')}`}>
                    {getVerificationIcon(profile?.verification_status || 'not_verified')}
                    <span className="text-sm font-medium">
                      {getVerificationLabel(profile?.verification_status || 'not_verified')}
                    </span>
                  </div>
                  
                  {profile?.verification_status !== 'verified' && (
                    <button
                      onClick={() => navigate('/verification')}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-medium">Verify Now</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₦125,450</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+23.4%</span>
                  <span className="text-gray-500 ml-1">from last month</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Orders</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-blue-600 font-medium">3 pending</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Credit Score</p>
                    <p className="text-2xl font-bold text-gray-900">742</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-purple-600 font-medium">Excellent</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Verification Status</p>
                    <p className="text-lg font-bold text-gray-900">
                      {getVerificationLabel(profile?.verification_status || 'not_verified')}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-xl">
                    {getVerificationIcon(profile?.verification_status || 'not_verified')}
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  {profile?.verification_status !== 'verified' ? (
                    <button
                      onClick={() => navigate('/verification')}
                      className="text-blue-600 font-medium hover:text-blue-700 flex items-center space-x-1"
                    >
                      <span>Verify Now</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-green-600 font-medium">✓ Verified</span>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dashboardItems.slice(1, 5).map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleViewChange(item.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${item.gradient} text-white`}>
                        {item.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        );
      }

      case 'marketplace':
        return <Marketplace />;
        
      case 'analytics':
        return <AnalyticsDashboard userType={userType} />;
        
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