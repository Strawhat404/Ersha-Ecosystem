import React from 'react';
import { useLocale } from '../contexts/LocaleContext';

const LocalizationTest = () => {
  const { t, currentLocale, changeLocale, getAvailableLocales } = useLocale();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Localization Test</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Current Language: {currentLocale}</h3>
          <div className="flex space-x-2">
            {getAvailableLocales().map(locale => (
              <button
                key={locale.code}
                onClick={() => changeLocale(locale.code)}
                className={`px-3 py-1 rounded ${
                  currentLocale === locale.code
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {locale.nativeName}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Translation Examples:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded">
              <strong>Navigation:</strong>
              <div>{t('navigation.home')}</div>
              <div>{t('navigation.marketplace')}</div>
              <div>{t('navigation.weather')}</div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded">
              <strong>Auth:</strong>
              <div>{t('auth.welcomeBack')}</div>
              <div>{t('auth.emailAddress')}</div>
              <div>{t('auth.password')}</div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded">
              <strong>Common:</strong>
              <div>{t('common.loading')}</div>
              <div>{t('common.error')}</div>
              <div>{t('common.success')}</div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded">
              <strong>Brand:</strong>
              <div>{t('brand.name')}</div>
              <div>{t('brand.tagline')}</div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-blue-50 rounded">
          <h3 className="font-semibold mb-2">Parameter Replacement Test:</h3>
          <div>{t('validation.minLength', { min: 8 })}</div>
          <div>{t('validation.maxLength', { max: 100 })}</div>
        </div>
      </div>
    </div>
  );
};

export default LocalizationTest; 