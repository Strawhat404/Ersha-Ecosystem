# Localization Implementation

This document describes the localization feature implementation for the Ersha-Ecosystem platform.

## Overview

The localization system supports multiple languages with a focus on English and Amharic. The implementation includes:

- Frontend localization with React context
- JSON-based translation files
- Language switcher component
- Backend translation service using Google Translate API
- AI course generation with translation support

## Frontend Implementation

### 1. Locale Context (`src/contexts/LocaleContext.jsx`)

The main localization context that provides:
- Translation function `t(key, params)`
- Language switching functionality
- Persistent language preference storage
- Available languages management

### 2. Translation Files

- `src/locale/en.json` - English translations
- `src/locale/am.json` - Amharic translations

### 3. Language Switcher (`src/components/LanguageSwitcher.jsx`)

A dropdown component that allows users to switch between available languages.

### 4. Updated Components

The following components have been updated to use translations:
- `Navbar.jsx` - Navigation items and branding
- `Herosection.jsx` - Hero content and call-to-action buttons
- `Advisory.jsx` - Expert advice, courses, and resources sections
- `Login.jsx` - Authentication forms and messages

## Backend Implementation

### 1. Translation Service (`advisory/translation_service.py`)

A service class that handles:
- Google Translate API integration
- Text translation with caching
- Course content translation
- Language validation

### 2. AI Course Generation with Translation

The AI course generation service now supports:
- Generating courses in English
- Automatic translation to target languages
- Preserving original and translated content metadata

## Usage

### Frontend Usage

```javascript
import { useLocale } from '../contexts/LocaleContext';

const MyComponent = () => {
  const { t, currentLocale, changeLocale } = useLocale();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('auth.welcomeBack')}</p>
      <button onClick={() => changeLocale('am')}>
        Switch to Amharic
      </button>
    </div>
  );
};
```

### Backend Usage

```python
from advisory.translation_service import translation_service

# Translate text
translated_text = translation_service.translate_text(
    "Hello world", 
    target_language='am'
)

# Translate course content
translated_course = translation_service.translate_course_content(
    course_data, 
    target_language='am'
)
```

## Configuration

### Environment Variables

```bash
# Google Translate API
GOOGLE_TRANSLATE_API_KEY=your-api-key-here

# Existing Gemini API for course generation
GEMINI_API_KEY=your-gemini-api-key-here
```

### Adding New Languages

1. Create a new translation file: `src/locale/{language_code}.json`
2. Add the language to `LocaleContext.jsx`:
   ```javascript
   const getAvailableLocales = () => [
     { code: 'en', name: 'English', nativeName: 'English' },
     { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
     { code: 'fr', name: 'French', nativeName: 'Français' }
   ];
   ```
3. Update the translation service to support the new language code

## Translation Keys Structure

The translation files are organized hierarchically:

```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error"
  },
  "navigation": {
    "home": "Home",
    "marketplace": "Marketplace"
  },
  "auth": {
    "welcomeBack": "Welcome Back",
    "signInToAccount": "Sign in to your account"
  }
}
```

## AI Course Translation

When generating AI courses:

1. Course is generated in English using Gemini API
2. If target language is not English, content is translated using Google Translate API
3. Both original and translated versions are stored
4. Users can access courses in their preferred language

## Caching

Translation results are cached for 24 hours to:
- Reduce API calls
- Improve performance
- Reduce costs

## Error Handling

- Missing translation keys fall back to the key name
- Translation failures don't break the application
- API errors are logged but don't crash the system

## Future Enhancements

1. **More Languages**: Add support for additional Ethiopian languages
2. **Machine Learning**: Implement custom translation models for agricultural terms
3. **Community Translations**: Allow users to contribute translations
4. **Offline Support**: Cache translations for offline use
5. **Voice Translation**: Add speech-to-speech translation for audio content

## Testing

To test the localization:

1. Start the development server
2. Use the language switcher in the navbar
3. Verify all text changes appropriately
4. Test AI course generation in different languages
5. Check that translations persist across page reloads

## Troubleshooting

### Common Issues

1. **Translation not working**: Check if Google Translate API key is configured
2. **Missing translations**: Verify translation keys exist in locale files
3. **Language not switching**: Check localStorage for saved language preference
4. **API errors**: Monitor console for translation service errors

### Debug Mode

Enable debug mode to see missing translation keys:

```javascript
// In LocaleContext.jsx
const t = (key, params = {}) => {
  // ... existing code ...
  if (!value) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
  // ... rest of function
};
``` 