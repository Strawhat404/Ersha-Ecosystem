import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';

const LanguageSwitcher = () => {
  const { currentLocale, changeLocale, getAvailableLocales } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const availableLocales = getAvailableLocales();
  const currentLocaleInfo = availableLocales.find(locale => locale.code === currentLocale);

  const handleLocaleChange = (localeCode) => {
    changeLocale(localeCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 rounded-lg hover:bg-gray-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm">{currentLocaleInfo?.nativeName || currentLocaleInfo?.name}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
          >
            {availableLocales.map((locale) => (
              <motion.button
                key={locale.code}
                onClick={() => handleLocaleChange(locale.code)}
                className={`w-full text-left px-4 py-3 text-sm transition-colors duration-200 flex items-center justify-between ${
                  currentLocale === locale.code
                    ? 'bg-green-50 text-green-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                whileHover={{ backgroundColor: currentLocale === locale.code ? '#f0fdf4' : '#f9fafb' }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{locale.code === 'am' ? '🇪🇹' : '🇺🇸'}</span>
                  <div>
                    <div className="font-medium">{locale.nativeName}</div>
                    <div className="text-xs text-gray-500">{locale.name}</div>
                  </div>
                </div>
                {currentLocale === locale.code && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-green-500 rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSwitcher; 