import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { logisticsAPI } from '../../lib/api';
import { 
  Home, 
  Package, 
  Truck,
  LogOut,
  User,
  Shield,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle,
  BarChart3,
  Activity,
  MessageSquare,
  Star,
  ChevronRight
} from 'lucide-react';

// Import logistics dashboard components
import LogisticsDashboardOverview from './LogisticsDashboardOverview';
import LogisticsOrders from './LogisticsOrders';
import LogisticsNotifications from './LogisticsNotifications';

const LogisticsDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeView, setActiveView] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Set initial view based on URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const view = urlParams.get('view');
    
    if (view && logisticsDashboardItems.find(item => item.id === view)) {
      setActiveView(view);
    }
  }, [location.search]);

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

  // Fetch unread notifications count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await logisticsAPI.getUnreadCount();
        setUnreadNotifications(response.unread_count || 0);
      } catch (err) {
        console.error('Error fetching unread notifications count:', err);
      }
    };

    fetchUnreadCount();
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const logisticsDashboardItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <Home className="w-5 h-5" />,
      gradient: 'from-blue-500 to-purple-600',
      description: 'Overview and analytics'
    },
    { 
      id: 'orders', 
      label: 'Orders', 
      icon: <Package className="w-5 h-5" />,
      gradient: 'from-orange-500 to-red-600',
      description: 'Manage delivery orders'
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: <MessageSquare className="w-5 h-5" />,
      gradient: 'from-green-500 to-teal-600',
      description: 'View logistics requests',
      badge: unreadNotifications > 0 ? unreadNotifications : null
    }
  ];

  const handleViewChange = (viewId) => {
    setActiveView(viewId);
    navigate(`/logistics-dashboard?view=${viewId}`);
  };

  const renderDashboardView = () => {
    switch(activeView) {
      case 'dashboard':
        return <LogisticsDashboardOverview />;
      case 'orders':
        return <LogisticsOrders />;
      case 'notifications':
        return <LogisticsNotifications />;
      default:
        return <LogisticsDashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-red-50/50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Logistics Dashboard</h1>
                  <p className="text-sm text-gray-600">Delivery Management Platform</p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="hidden md:flex items-center space-x-1 bg-gray-100/80 rounded-xl p-1">
              {logisticsDashboardItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleViewChange(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 relative ${
                    activeView === item.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Profile Menu */}
            <div className="relative profile-dropdown">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100/80 transition-colors"
              >
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-600">Logistics Expert</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200/60 py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-gray-900">{user?.first_name} {user?.last_name}</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Shield className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                          Logistics
                        </span>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <button
                        onClick={handleSignOut}
                        disabled={loading}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{loading ? 'Signing out...' : 'Sign Out'}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="flex overflow-x-auto px-4 py-2 space-x-1">
          {logisticsDashboardItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleViewChange(item.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 relative ${
                activeView === item.id
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
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

export default LogisticsDashboard;
