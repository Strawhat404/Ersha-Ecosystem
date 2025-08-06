import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '../contexts/OnboardingContext';
import { useLocale } from '../contexts/LocaleContext';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  X, 
  HelpCircle,
  Eye,
  EyeOff,
  Type,
  Contrast,
  Repeat,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Mic,
  MicOff
} from 'lucide-react';

const OnboardingTour = () => {
  const {
    isTourActive,
    currentStep,
    tourSteps,
    voiceEnabled,
    isPlaying,
    accessibilityMode,
    largeTextMode,
    highContrastMode,
    speak,
    playAudioFile,
    toggleVoice,
    toggleAccessibilityMode,
    toggleLargeText,
    toggleHighContrast,
    nextStep,
    previousStep,
    finishTour,
    skipTour,
    repeatCurrentStep,
    getCurrentStepData
  } = useOnboarding();

  const { t } = useLocale();
  const overlayRef = useRef(null);

  const currentStepData = getCurrentStepData();

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isTourActive) return;

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          nextStep();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          previousStep();
          break;
        case 'Escape':
          e.preventDefault();
          skipTour();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          repeatCurrentStep();
          break;
        case 'v':
        case 'V':
          e.preventDefault();
          toggleVoice();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isTourActive, currentStep]);

  // Auto-advance for certain steps
  useEffect(() => {
    if (!isTourActive || !currentStepData) return;

    let timeout;
    if (currentStepData.action === 'next' && currentStepData.id !== 'completion') {
      timeout = setTimeout(() => {
        nextStep();
      }, 8000); // Auto-advance after 8 seconds
    }

    return () => clearTimeout(timeout);
  }, [currentStep, isTourActive]);

  if (!isTourActive || !currentStepData) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={(e) => {
          // Close tour if clicking outside the tour content
          if (e.target === overlayRef.current) {
            skipTour();
          }
        }}
      >
        {/* Tour Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Highlight current element */}
          {currentStepData.target && (
            <div className="absolute inset-0">
              <div className="tour-highlight-overlay" />
            </div>
          )}
        </div>

        {/* Tour Content */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
            max-w-md w-full mx-4 pointer-events-auto
            ${currentStepData.position === 'center' ? 'top-1/2' : 'top-auto bottom-20'}
            ${accessibilityMode ? 'accessibility-mode' : ''}
            ${largeTextMode ? 'large-text-mode' : ''}
            ${highContrastMode ? 'high-contrast-mode' : ''}`}
        >
          {/* Tour Card */}
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-green-500 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {currentStepData.title}
                    </h3>
                    <p className="text-sm text-green-100">
                      Step {currentStep + 1} of {tourSteps.length}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={skipTour}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Skip tour"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <p className={`text-gray-700 leading-relaxed ${
                  largeTextMode ? 'text-lg' : 'text-base'
                }`}>
                  {currentStepData.description}
                </p>
              </div>

              {/* Voice Controls */}
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleVoice}
                    className={`p-2 rounded-full transition-colors ${
                      voiceEnabled 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    aria-label={voiceEnabled ? 'Disable voice' : 'Enable voice'}
                  >
                    {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={repeatCurrentStep}
                    className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-full transition-colors"
                    aria-label="Repeat current step"
                  >
                    <Repeat className="w-4 h-4" />
                  </button>
                  
                  {isPlaying && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm text-green-600">Playing...</span>
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-500">
                  Press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">R</kbd> to repeat
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={previousStep}
                  disabled={currentStep === 0}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    currentStep === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-2">
                  {currentStepData.action === 'finish' ? (
                    <button
                      onClick={finishTour}
                      className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Finish Tour</span>
                    </button>
                  ) : (
                    <button
                      onClick={nextStep}
                      className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-green-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {currentStep + 1} of {tourSteps.length} steps
                </p>
              </div>
            </div>
          </div>

          {/* Accessibility Controls */}
          <div className="mt-4 bg-white rounded-lg shadow-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Accessibility Options</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={toggleAccessibilityMode}
                className={`flex items-center justify-center space-x-2 p-2 rounded-lg transition-colors ${
                  accessibilityMode 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {accessibilityMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span className="text-sm">Accessibility</span>
              </button>
              
              <button
                onClick={toggleLargeText}
                className={`flex items-center justify-center space-x-2 p-2 rounded-lg transition-colors ${
                  largeTextMode 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Type className="w-4 h-4" />
                <span className="text-sm">Large Text</span>
              </button>
              
              <button
                onClick={toggleHighContrast}
                className={`flex items-center justify-center space-x-2 p-2 rounded-lg transition-colors ${
                  highContrastMode 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Contrast className="w-4 h-4" />
                <span className="text-sm">High Contrast</span>
              </button>
              
              <button
                onClick={toggleVoice}
                className={`flex items-center justify-center space-x-2 p-2 rounded-lg transition-colors ${
                  voiceEnabled 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                <span className="text-sm">Voice</span>
              </button>
            </div>
          </div>

          {/* Keyboard Shortcuts Help */}
          <div className="mt-4 bg-gray-50 rounded-lg p-3">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">Keyboard Shortcuts</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div><kbd className="px-1 py-0.5 bg-white rounded">→</kbd> or <kbd className="px-1 py-0.5 bg-white rounded">Space</kbd> Next</div>
              <div><kbd className="px-1 py-0.5 bg-white rounded">←</kbd> Previous</div>
              <div><kbd className="px-1 py-0.5 bg-white rounded">R</kbd> Repeat</div>
              <div><kbd className="px-1 py-0.5 bg-white rounded">V</kbd> Toggle Voice</div>
              <div><kbd className="px-1 py-0.5 bg-white rounded">Esc</kbd> Skip Tour</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingTour; 