import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar,
  LogOut,
  User,
  Shield,
  GraduationCap,
  TrendingUp,
  Clock,
  CheckCircle,
  BarChart3,
  Activity,
  MessageSquare,
  Star,
  ChevronRight
} from 'lucide-react';

// Import expert dashboard components
import ExpertDashboardOverview from './ExpertDashboardOverview';
import ExpertBookedUsers from './ExpertBookedUsers';
import ExpertCalendar from './ExpertCalendar';

const ExpertDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeView, setActiveView] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Set initial view based on URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const view = urlParams.get('view');
    
    if (view && expertDashboardItems.find(item => item.id === view)) {
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

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const expertDashboardItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <Home className="w-5 h-5" />,
      gradient: 'from-blue-500 to-purple-600',
      description: 'Overview and analytics'
    },
    { 
      id: 'booked-users', 
      label: 'Booked Users', 
      icon: <Users className="w-5 h-5" />,
      gradient: 'from-emerald-500 to-teal-600',
      description: 'All users who booked consultations'
    },
    { 
      id: 'calendar', 
      label: 'Calendar', 
      icon: <Calendar className="w-5 h-5" />,
      gradient: 'from-orange-500 to-red-600',
      description: 'Schedule and appointments'
    }
  ];

  const handleViewChange = (viewId) => {
    setActiveView(viewId);
    navigate(`/expert-dashboard?view=${viewId}`);
  };

  const renderDashboardView = () => {
    switch(activeView) {
      case 'dashboard':
        return <ExpertDashboardOverview />;
      case 'booked-users':
        return <ExpertBookedUsers />;
      case 'calendar':
        return <ExpertCalendar />;
      default:
        return <ExpertDashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Expert Dashboard</h1>
                  <p className="text-sm text-gray-500">Agricultural Expertise Platform</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {expertDashboardItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleViewChange(item.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    activeView === item.id
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Profile Section */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-xs text-gray-500">Agricultural Expert</p>
              </div>
              
              {/* Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full hover:from-green-200 hover:to-emerald-200 transition-all duration-200"
                >
                  <GraduationCap className="w-5 h-5 text-green-600" />
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

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="flex overflow-x-auto px-4 py-2 space-x-2">
          {expertDashboardItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleViewChange(item.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeView === item.id
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
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

export default ExpertDashboard;
