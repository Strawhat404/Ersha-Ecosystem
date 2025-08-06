import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocale } from './LocaleContext';

const OnboardingContext = createContext();

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider = ({ children }) => {
  const { t, currentLocale } = useLocale();
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tourCompleted, setTourCompleted] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [largeTextMode, setLargeTextMode] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Check if user is new (first time visiting)
  useEffect(() => {
    const hasCompletedTour = localStorage.getItem('tourCompleted');
    const isNewUser = localStorage.getItem('isNewUser') === 'true';
    
    if (isNewUser && !hasCompletedTour) {
      setIsTourActive(true);
    }
    
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
    
    // Initialize audio context for custom sounds
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      setAudioContext(new (window.AudioContext || window.webkitAudioContext)());
    }
  }, []);

  // Tour steps configuration
  const tourSteps = [
    {
      id: 'welcome',
      target: null,
      title: t('onboarding.welcome.title'),
      description: t('onboarding.welcome.description'),
      audioFile: '/audio/onboarding/welcome.mp3',
      position: 'center',
      action: 'next'
    },
    {
      id: 'verification',
      target: '[data-tour="verification"]',
      title: t('onboarding.verification.title'),
      description: t('onboarding.verification.description'),
      audioFile: '/audio/onboarding/verification.mp3',
      position: 'bottom',
      action: 'click'
    },
    {
      id: 'marketplace',
      target: '[data-tour="marketplace"]',
      title: t('onboarding.marketplace.title'),
      description: t('onboarding.marketplace.description'),
      audioFile: '/audio/onboarding/marketplace.mp3',
      position: 'bottom',
      action: 'click'
    },
    {
      id: 'post-product',
      target: '[data-tour="post-product"]',
      title: t('onboarding.postProduct.title'),
      description: t('onboarding.postProduct.description'),
      audioFile: '/audio/onboarding/post-product.mp3',
      position: 'bottom',
      action: 'click'
    },
    {
      id: 'orders',
      target: '[data-tour="orders"]',
      title: t('onboarding.orders.title'),
      description: t('onboarding.orders.description'),
      audioFile: '/audio/onboarding/orders.mp3',
      position: 'bottom',
      action: 'click'
    },
    {
      id: 'weather',
      target: '[data-tour="weather"]',
      title: t('onboarding.weather.title'),
      description: t('onboarding.weather.description'),
      audioFile: '/audio/onboarding/weather.mp3',
      position: 'bottom',
      action: 'click'
    },
    {
      id: 'advisory',
      target: '[data-tour="advisory"]',
      title: t('onboarding.advisory.title'),
      description: t('onboarding.advisory.description'),
      audioFile: '/audio/onboarding/advisory.mp3',
      position: 'bottom',
      action: 'click'
    },
    {
      id: 'completion',
      target: null,
      title: t('onboarding.completion.title'),
      description: t('onboarding.completion.description'),
      audioFile: '/audio/onboarding/completion.mp3',
      position: 'center',
      action: 'finish'
    }
  ];

  // Voice guidance functions
  const speak = (text, options = {}) => {
    if (!speechSynthesis || !voiceEnabled) return;

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLocale === 'am' ? 'am-ET' : 'en-US';
    utterance.rate = options.rate || 0.8; // Slower for better understanding
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      setIsPlaying(false);
    };

    speechSynthesis.speak(utterance);
  };

  const playAudioFile = async (audioFile) => {
    if (!voiceEnabled) return;

    try {
      // Stop any current audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      const audio = new Audio(audioFile);
      setCurrentAudio(audio);
      
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        setIsPlaying(false);
        // Fallback to text-to-speech
        const currentStepData = tourSteps[currentStep];
        speak(currentStepData.description);
      };

      await audio.play();
    } catch (error) {
      console.error('Audio file not found, falling back to TTS:', error);
      const currentStepData = tourSteps[currentStep];
      speak(currentStepData.description);
    }
  };

  const playNotificationSound = () => {
    if (!audioContext) return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Friendly notification sound
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  };

  // Tour navigation functions
  const startTour = () => {
    setIsTourActive(true);
    setCurrentStep(0);
    setTourCompleted(false);
    localStorage.setItem('isNewUser', 'true');
    
    // Play welcome audio
    const firstStep = tourSteps[0];
    playAudioFile(firstStep.audioFile);
    speak(firstStep.description);
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      
      const stepData = tourSteps[nextStepIndex];
      playAudioFile(stepData.audioFile);
      speak(stepData.description);
      
      // Highlight target element
      if (stepData.target) {
        highlightElement(stepData.target);
      }
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      setCurrentStep(prevStepIndex);
      
      const stepData = tourSteps[prevStepIndex];
      playAudioFile(stepData.audioFile);
      speak(stepData.description);
      
      // Highlight target element
      if (stepData.target) {
        highlightElement(stepData.target);
      }
    }
  };

  const finishTour = () => {
    setIsTourActive(false);
    setTourCompleted(true);
    localStorage.setItem('tourCompleted', 'true');
    localStorage.setItem('isNewUser', 'false');
    
    // Play completion sound
    playNotificationSound();
    speak(t('onboarding.completion.success'));
  };

  const skipTour = () => {
    setIsTourActive(false);
    setTourCompleted(true);
    localStorage.setItem('tourCompleted', 'true');
    localStorage.setItem('isNewUser', 'false');
    
    // Stop any current audio/speech
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const highlightElement = (selector) => {
    const element = document.querySelector(selector);
    if (element) {
      // Remove previous highlights
      document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
      });
      
      // Add highlight to current element
      element.classList.add('tour-highlight');
      
      // Scroll to element
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  // Accessibility functions
  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (voiceEnabled && speechSynthesis) {
      speechSynthesis.cancel();
    }
  };

  const toggleAccessibilityMode = () => {
    setAccessibilityMode(!accessibilityMode);
    document.body.classList.toggle('accessibility-mode');
  };

  const toggleLargeText = () => {
    setLargeTextMode(!largeTextMode);
    document.body.classList.toggle('large-text-mode');
  };

  const toggleHighContrast = () => {
    setHighContrastMode(!highContrastMode);
    document.body.classList.toggle('high-contrast-mode');
  };

  const repeatCurrentStep = () => {
    const stepData = tourSteps[currentStep];
    playAudioFile(stepData.audioFile);
    speak(stepData.description);
  };

  const getCurrentStepData = () => tourSteps[currentStep];

  const value = {
    // Tour state
    isTourActive,
    currentStep,
    tourCompleted,
    tourSteps,
    
    // Voice and audio
    voiceEnabled,
    isPlaying,
    speak,
    playAudioFile,
    playNotificationSound,
    
    // Accessibility
    accessibilityMode,
    largeTextMode,
    highContrastMode,
    toggleVoice,
    toggleAccessibilityMode,
    toggleLargeText,
    toggleHighContrast,
    
    // Tour actions
    startTour,
    nextStep,
    previousStep,
    finishTour,
    skipTour,
    repeatCurrentStep,
    getCurrentStepData,
    
    // Utilities
    highlightElement
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}; 