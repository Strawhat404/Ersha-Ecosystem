import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';
import { useOnboarding } from '../contexts/OnboardingContext';
import { 
  Home,
  ShoppingBag,
  Cloud,
  BookOpen,
  Newspaper,
  CreditCard,
  Truck,
  BarChart3,
  User,
  Settings,
  HelpCircle,
  Volume2,
  VolumeX,
  Type,
  Contrast,
  Eye,
  EyeOff,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const SimplifiedNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('main');
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLocale();
  const { 
    voiceEnabled, 
    largeTextMode, 
    highContrastMode, 
    accessibilityMode,
    toggleVoice,
    toggleLargeText,
    toggleHighContrast,
    toggleAccessibilityMode,
    speak
  } = useOnboarding();

  const mainNavigation = [
    {
      id: 'home',
      label: t('navigation.home'),
      icon: <Home className="w-8 h-8" />,
      color: 'bg-blue-500',
      action: () => navigate('/'),
      description: 'Go to home page'
    },
    {
      id: 'marketplace',
      label: t('navigation.marketplace'),
      icon: <ShoppingBag className="w-8 h-8" />,
      color: 'bg-green-500',
      action: () => navigate('/dashboard?view=marketplace'),
      description: 'Buy and sell products'
    },
    {
      id: 'weather',
      label: t('navigation.weather'),
      icon: <Cloud className="w-8 h-8" />,
      color: 'bg-sky-500',
      action: () => navigate('/dashboard?view=weather'),
      description: 'Check weather information'
    },
    {
      id: 'advisory',
      label: t('navigation.advisory'),
      icon: <BookOpen className="w-8 h-8" />,
      color: 'bg-purple-500',
      action: () => navigate('/dashboard?view=advisory'),
      description: 'Get expert advice'
    },
    {
      id: 'news',
      label: t('navigation.news'),
      icon: <Newspaper className="w-8 h-8" />,
      color: 'bg-orange-500',
      action: () => navigate('/dashboard?view=news'),
      description: 'Read latest news'
    },
    {
      id: 'payments',
      label: t('navigation.payments'),
      icon: <CreditCard className="w-8 h-8" />,
      color: 'bg-emerald-500',
      action: () => navigate('/dashboard?view=payments'),
      description: 'Manage payments'
    },
    {
      id: 'logistics',
      label: t('navigation.logistics'),
      icon: <Truck className="w-8 h-8" />,
      color: 'bg-red-500',
      action: () => navigate('/dashboard?view=logistics'),
      description: 'Track deliveries'
    },
    {
      id: 'analytics',
      label: t('navigation.analytics'),
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'bg-indigo-500',
      action: () => navigate('/dashboard?view=analytics'),
      description: 'View business reports'
    }
  ];

  const settingsNavigation = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-8 h-8" />,
      color: 'bg-gray-500',
      action: () => navigate('/profile'),
      description: 'Manage your profile'
    },
    {
      id: 'help',
      label: 'Help',
      icon: <HelpCircle className="w-8 h-8" />,
      color: 'bg-yellow-500',
      action: () => {
        speak(t('help.description'));
        setIsOpen(false);
      },
      description: 'Get help and support'
    }
  ];

  const accessibilitySettings = [
    {
      id: 'voice',
      label: voiceEnabled ? 'Voice On' : 'Voice Off',
      icon: voiceEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />,
      color: voiceEnabled ? 'bg-green-500' : 'bg-gray-500',
      action: toggleVoice,
      description: voiceEnabled ? 'Voice guidance is enabled' : 'Voice guidance is disabled'
    },
    {
      id: 'text',
      label: largeTextMode ? 'Large Text On' : 'Large Text Off',
      icon: <Type className="w-6 h-6" />,
      color: largeTextMode ? 'bg-green-500' : 'bg-gray-500',
      action: toggleLargeText,
      description: largeTextMode ? 'Large text mode is enabled' : 'Large text mode is disabled'
    },
    {
      id: 'contrast',
      label: highContrastMode ? 'High Contrast On' : 'High Contrast Off',
      icon: <Contrast className="w-6 h-6" />,
      color: highContrastMode ? 'bg-green-500' : 'bg-gray-500',
      action: toggleHighContrast,
      description: highContrastMode ? 'High contrast mode is enabled' : 'High contrast mode is disabled'
    },
    {
      id: 'accessibility',
      label: accessibilityMode ? 'Simple Mode On' : 'Simple Mode Off',
      icon: accessibilityMode ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />,
      color: accessibilityMode ? 'bg-green-500' : 'bg-gray-500',
      action: toggleAccessibilityMode,
      description: accessibilityMode ? 'Simple mode is enabled' : 'Simple mode is disabled'
    }
  ];

  const handleNavigation = (item) => {
    speak(item.description);
    item.action();
    setIsOpen(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'main':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Where would you like to go?
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {mainNavigation.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${item.color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col items-center space-y-3`}
                >
                  <div className="bg-white/20 p-3 rounded-full">
                    {item.icon}
                  </div>
                  <span className={`font-bold text-center ${largeTextMode ? 'text-lg' : 'text-base'}`}>
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setActiveSection('settings')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              
              <button
                onClick={() => setActiveSection('accessibility')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Eye className="w-5 h-5" />
                <span>Accessibility</span>
              </button>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setActiveSection('main')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
              <div className="w-10"></div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {settingsNavigation.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`${item.color} text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-4`}
                >
                  <div className="bg-white/20 p-2 rounded-lg">
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <span className={`font-bold ${largeTextMode ? 'text-lg' : 'text-base'}`}>
                      {item.label}
                    </span>
                    <p className="text-sm opacity-90">{item.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'accessibility':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setActiveSection('main')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <h2 className="text-2xl font-bold text-gray-800">Accessibility</h2>
              <div className="w-10"></div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {accessibilitySettings.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    speak(item.description);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`${item.color} text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-between`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-2 rounded-lg">
                      {item.icon}
                    </div>
                    <div className="text-left">
                      <span className={`font-bold ${largeTextMode ? 'text-lg' : 'text-base'}`}>
                        {item.label}
                      </span>
                      <p className="text-sm opacity-90">{item.description}</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Simplified Navigation Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 left-20 z-40 p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        aria-label="Simplified navigation"
      >
        <Home className="w-6 h-6" />
      </motion.button>

      {/* Simplified Navigation Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="absolute bottom-6 left-6 right-6 max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Home className="w-6 h-6" />
                    <div>
                      <h2 className="font-bold text-lg">Simple Navigation</h2>
                      <p className="text-sm text-purple-100">Easy way to get around</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {renderSection()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SimplifiedNavigation; 