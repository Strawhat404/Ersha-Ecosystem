import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '../contexts/OnboardingContext';
import { useLocale } from '../contexts/LocaleContext';
import { 
  Volume2, 
  VolumeX, 
  Type, 
  Contrast, 
  Eye, 
  EyeOff, 
  Settings, 
  X,
  HelpCircle,
  Mic,
  MicOff,
  Smartphone,
  Monitor,
  Sun,
  Moon,
  RotateCcw,
  Play,
  Pause
} from 'lucide-react';

const AccessibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('voice');
  const {
    voiceEnabled,
    accessibilityMode,
    largeTextMode,
    highContrastMode,
    speak,
    toggleVoice,
    toggleAccessibilityMode,
    toggleLargeText,
    toggleHighContrast,
    startTour
  } = useOnboarding();

  const { t } = useLocale();

  const accessibilityFeatures = [
    {
      id: 'voice',
      title: t('accessibility.voiceGuidance.title'),
      description: t('accessibility.voiceGuidance.description'),
      icon: voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />,
      action: toggleVoice,
      status: voiceEnabled ? t('accessibility.voiceGuidance.enabled') : t('accessibility.voiceGuidance.disabled'),
      color: voiceEnabled ? 'text-green-600' : 'text-gray-500'
    },
    {
      id: 'text',
      title: t('accessibility.largeText.title'),
      description: t('accessibility.largeText.description'),
      icon: <Type className="w-5 h-5" />,
      action: toggleLargeText,
      status: largeTextMode ? t('accessibility.largeText.enabled') : t('accessibility.largeText.disabled'),
      color: largeTextMode ? 'text-green-600' : 'text-gray-500'
    },
    {
      id: 'contrast',
      title: t('accessibility.highContrast.title'),
      description: t('accessibility.highContrast.description'),
      icon: <Contrast className="w-5 h-5" />,
      action: toggleHighContrast,
      status: highContrastMode ? t('accessibility.highContrast.enabled') : t('accessibility.highContrast.disabled'),
      color: highContrastMode ? 'text-green-600' : 'text-gray-500'
    },
    {
      id: 'accessibility',
      title: t('accessibility.simpleMode.title'),
      description: t('accessibility.simpleMode.description'),
      icon: accessibilityMode ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />,
      action: toggleAccessibilityMode,
      status: accessibilityMode ? t('accessibility.simpleMode.enabled') : t('accessibility.simpleMode.disabled'),
      color: accessibilityMode ? 'text-green-600' : 'text-gray-500'
    }
  ];

  const quickActions = [
    {
      title: 'Start Tour',
      description: 'Learn how to use the platform',
      icon: <Play className="w-4 h-4" />,
      action: () => {
        startTour();
        setIsOpen(false);
      },
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Help',
      description: 'Get help and support',
      icon: <HelpCircle className="w-4 h-4" />,
      action: () => {
        speak(t('help.description'));
        setIsOpen(false);
      },
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Reset Settings',
      description: 'Reset all accessibility settings',
      icon: <RotateCcw className="w-4 h-4" />,
      action: () => {
        // Reset all settings
        if (voiceEnabled) toggleVoice();
        if (largeTextMode) toggleLargeText();
        if (highContrastMode) toggleHighContrast();
        if (accessibilityMode) toggleAccessibilityMode();
        speak('All settings have been reset');
      },
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  const tabs = [
    { id: 'voice', label: 'Voice & Audio', icon: <Mic className="w-4 h-4" /> },
    { id: 'visual', label: 'Visual', icon: <Eye className="w-4 h-4" /> },
    { id: 'navigation', label: 'Navigation', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'quick', label: 'Quick Actions', icon: <Play className="w-4 h-4" /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'voice':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Voice Commands</h3>
              <p className="text-sm text-blue-700 mb-3">
                You can use voice commands to navigate the platform. Try saying:
              </p>
              <div className="space-y-2">
                {Object.entries(t('voiceCommands.commands')).map(([key, command]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Mic className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">{command}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              {accessibilityFeatures.filter(f => f.id === 'voice').map((feature) => (
                <div key={feature.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${feature.color} bg-gray-100`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={feature.action}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        voiceEnabled 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {voiceEnabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                  <p className={`text-sm mt-2 ${feature.color}`}>{feature.status}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'visual':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Visual Accessibility</h3>
              <p className="text-sm text-green-700">
                Make the platform easier to see and read with these visual options.
              </p>
            </div>
            
            <div className="space-y-3">
              {accessibilityFeatures.filter(f => ['text', 'contrast'].includes(f.id)).map((feature) => (
                <div key={feature.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${feature.color} bg-gray-100`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={feature.action}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        (feature.id === 'text' && largeTextMode) || (feature.id === 'contrast' && highContrastMode)
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {((feature.id === 'text' && largeTextMode) || (feature.id === 'contrast' && highContrastMode)) ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                  <p className={`text-sm mt-2 ${feature.color}`}>{feature.status}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'navigation':
        return (
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Navigation Help</h3>
              <p className="text-sm text-purple-700 mb-3">
                Use these keyboard shortcuts to navigate more easily:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(t('accessibility.keyboardNavigation.shortcuts')).map(([key, shortcut]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                      {shortcut.split(' - ')[0]}
                    </kbd>
                    <span className="text-sm">{shortcut.split(' - ')[1]}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              {accessibilityFeatures.filter(f => f.id === 'accessibility').map((feature) => (
                <div key={feature.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${feature.color} bg-gray-100`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={feature.action}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        accessibilityMode 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {accessibilityMode ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                  <p className={`text-sm mt-2 ${feature.color}`}>{feature.status}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'quick':
        return (
          <div className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">Quick Actions</h3>
              <p className="text-sm text-orange-700">
                Common actions to help you get started quickly.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`${action.color} text-white p-4 rounded-lg text-left transition-colors`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      {action.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{action.title}</h4>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </div>
                  </div>
                </button>
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
      {/* Floating Accessibility Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        aria-label="Accessibility options"
      >
        <Settings className="w-6 h-6" />
      </motion.button>

      {/* Accessibility Panel */}
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
              className="absolute bottom-6 right-6 w-96 max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Settings className="w-6 h-6" />
                    <div>
                      <h2 className="font-bold text-lg">{t('accessibility.title')}</h2>
                      <p className="text-sm text-green-100">{t('accessibility.description')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Close accessibility panel"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="p-4 max-h-96 overflow-y-auto">
                {renderTabContent()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccessibilityPanel; 