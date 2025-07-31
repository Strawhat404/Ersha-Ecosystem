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
  Calendar
} from 'lucide-react';

// Import dashboard components
import AnalyticsDashboard from './AnalyticsDashboard';
import PaymentSystem from './PaymentSystem';
import LogisticsTracker from './LogisticsTracker';
import Marketplace from '../Marketplace/Marketplace';
import Weather from '../Weather/Weather';
import Advisory from '../Advisory/Advisory';
import News from '../News/News';

const UserDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeView, setActiveView] = useState('overview');
  const [loading, setLoading] = useState(false);

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
      case 'merchant':
        return <Building className="w-6 h-6 text-purple-600" />;
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
      case 'merchant':
        return 'Agricultural Business';
      default:
        return 'User';
    }
  };

  const renderDashboardView = () => {
    switch(activeView) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
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
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">₦31,200</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+18.7%</span>
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
              <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full">
                {getUserTypeIcon(userType)}
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