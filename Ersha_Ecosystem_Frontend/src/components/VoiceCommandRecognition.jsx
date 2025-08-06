import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '../contexts/OnboardingContext';
import { useLocale } from '../contexts/LocaleContext';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const VoiceCommandRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const { speak, voiceEnabled } = useOnboarding();
  const { t, currentLocale } = useLocale();
  const navigate = useNavigate();

  // Voice commands mapping
  const voiceCommands = {
    // Navigation commands
    'go to marketplace': () => navigate('/dashboard?view=marketplace'),
    'go to weather': () => navigate('/dashboard?view=weather'),
    'go to advisory': () => navigate('/dashboard?view=advisory'),
    'go to news': () => navigate('/dashboard?view=news'),
    'go to payments': () => navigate('/dashboard?view=payments'),
    'go to logistics': () => navigate('/dashboard?view=logistics'),
    'go to profile': () => navigate('/profile'),
    'go home': () => navigate('/'),
    
    // Action commands
    'post product': () => navigate('/dashboard?view=marketplace'),
    'sell something': () => navigate('/dashboard?view=marketplace'),
    'buy products': () => navigate('/dashboard?view=marketplace'),
    'check orders': () => navigate('/dashboard?view=logistics'),
    'view earnings': () => navigate('/dashboard?view=analytics'),
    'get verified': () => navigate('/verification'),
    
    // Help commands
    'help me': () => speak(t('help.description')),
    'what can I do': () => speak(t('onboarding.welcome.description')),
    'how to sell': () => speak(t('help.quickHelp.questions.0.answer')),
    'how to get paid': () => speak(t('help.quickHelp.questions.1.answer')),
    'how to track orders': () => speak(t('help.quickHelp.questions.3.answer')),
    
    // Accessibility commands
    'make text larger': () => document.body.classList.add('large-text-mode'),
    'make text smaller': () => document.body.classList.remove('large-text-mode'),
    'turn on voice': () => speak('Voice guidance is now enabled'),
    'turn off voice': () => speak('Voice guidance is now disabled'),
    'high contrast': () => document.body.classList.add('high-contrast-mode'),
    'normal contrast': () => document.body.classList.remove('high-contrast-mode'),
    
    // System commands
    'stop listening': () => setIsListening(false),
    'start listening': () => setIsListening(true),
    'repeat that': () => speak(lastCommand),
    'what did you hear': () => speak(`I heard: ${transcript}`),
    
    // Amharic commands (if locale is Amharic)
    ...(currentLocale === 'am' && {
      'ወደ ገበያ ቦታ ሂድ': () => navigate('/dashboard?view=marketplace'),
      'የአየር ሁኔታ አሳይ': () => navigate('/dashboard?view=weather'),
      'ምክር አሳይ': () => navigate('/dashboard?view=advisory'),
      'ምርት አስቀምጥ': () => navigate('/dashboard?view=marketplace'),
      'ትዕዛዝ አሳይ': () => navigate('/dashboard?view=logistics'),
      'እርዳታ አሳይ': () => speak(t('help.description')),
      'ድምፅ በር': () => speak('የድምፅ መመሪያ የተገኘ ነው'),
      'ድምፅ ዝጋ': () => speak('የድምፅ መመሪያ የተሰናከለ ነው'),
    })
  };

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = currentLocale === 'am' ? 'am-ET' : 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        setError('');
        setTranscript('');
        setConfidence(0);
      };
      
      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            setConfidence(confidence);
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
        
        // Process final transcript
        if (finalTranscript) {
          processCommand(finalTranscript.toLowerCase().trim());
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(`Error: ${event.error}`);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
      setIsSupported(true);
    } else {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser');
    }
  }, [currentLocale]);

  const processCommand = (command) => {
    setLastCommand(command);
    
    // Find matching command
    const matchedCommand = Object.keys(voiceCommands).find(cmd => 
      command.includes(cmd) || cmd.includes(command)
    );
    
    if (matchedCommand) {
      setShowFeedback(true);
      speak(`Executing: ${matchedCommand}`);
      
      // Execute the command
      voiceCommands[matchedCommand]();
      
      // Hide feedback after 3 seconds
      setTimeout(() => setShowFeedback(false), 3000);
    } else {
      setError(`Command not recognized: "${command}"`);
      speak(`I didn't understand: ${command}. Please try again.`);
    }
  };

  const toggleListening = () => {
    if (!isSupported) {
      setError('Speech recognition is not supported');
      return;
    }
    
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const availableCommands = Object.keys(voiceCommands).slice(0, 10); // Show first 10 commands

  if (!isSupported) {
    return null; // Don't render if not supported
  }

  return (
    <>
      {/* Voice Command Button */}
      <motion.button
        onClick={toggleListening}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`fixed bottom-6 left-6 z-40 p-4 rounded-full shadow-lg transition-all duration-200 ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
        aria-label={isListening ? 'Stop voice commands' : 'Start voice commands'}
      >
        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </motion.button>

      {/* Voice Command Panel */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-20 left-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border-2 border-blue-500 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Mic className="w-6 h-6" />
                    {isListening && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 bg-red-500 rounded-full opacity-50"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {isListening ? 'Listening...' : 'Voice Commands'}
                    </h3>
                    <p className="text-sm text-blue-100">
                      {isListening ? 'Speak your command' : 'Click to start listening'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleListening}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Transcript */}
              {transcript && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">You said:</h4>
                  <p className="text-gray-700">{transcript}</p>
                  {confidence > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Confidence: {Math.round(confidence * 100)}%
                    </p>
                  )}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                </div>
              )}

              {/* Success Feedback */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-700">Command executed successfully!</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Available Commands */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Available Commands:</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availableCommands.map((command, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-50 rounded text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setTranscript(command);
                        processCommand(command);
                      }}
                    >
                      "{command}"
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Click any command above to execute it
                </p>
              </div>

              {/* Listening Indicator */}
              {isListening && (
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-3 h-3 bg-red-500 rounded-full"
                  />
                  <span className="text-sm text-gray-600">Listening...</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceCommandRecognition; 