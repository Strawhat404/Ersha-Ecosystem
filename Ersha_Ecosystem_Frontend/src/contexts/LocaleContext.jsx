import React, { createContext, useContext, useState, useEffect } from 'react';
import enLocale from '../locale/en.json';
import amLocale from '../locale/am.json';

const LocaleContext = createContext();

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

export const LocaleProvider = ({ children }) => {
  const [currentLocale, setCurrentLocale] = useState('en');
  const [translations, setTranslations] = useState(enLocale);

  // Load locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || 'en';
    setCurrentLocale(savedLocale);
    setTranslations(savedLocale === 'am' ? amLocale : enLocale);
  }, []);

  // Function to change locale
  const changeLocale = (locale) => {
    setCurrentLocale(locale);
    setTranslations(locale === 'am' ? amLocale : enLocale);
    localStorage.setItem('locale', locale);
  };

  // Function to get translation by key
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key; // Return the key if translation not found
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string: ${key}`);
      return key;
    }

    // Replace parameters in the translation
    let result = value;
    Object.keys(params).forEach(param => {
      result = result.replace(new RegExp(`{${param}}`, 'g'), params[param]);
    });

    return result;
  };

  // Function to get current locale info
  const getCurrentLocale = () => currentLocale;

  // Function to get available locales
  const getAvailableLocales = () => [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' }
  ];

  const value = {
    t,
    currentLocale,
    changeLocale,
    getCurrentLocale,
    getAvailableLocales,
    translations
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}; 