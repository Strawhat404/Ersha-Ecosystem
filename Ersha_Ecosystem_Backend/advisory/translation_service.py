import os
import json
import requests
from typing import Dict, Any, Optional
from django.conf import settings
from django.core.cache import cache

class TranslationService:
    """
    Service for handling translations using Google Translate API
    """
    
    def __init__(self):
        self.api_key = os.getenv('GOOGLE_TRANSLATE_API_KEY')
        self.base_url = 'https://translation.googleapis.com/language/translate/v2'
        
    def translate_text(self, text: str, target_language: str = 'am', source_language: str = 'en') -> Optional[str]:
        """
        Translate text using Google Translate API
        
        Args:
            text: Text to translate
            target_language: Target language code (default: 'am' for Amharic)
            source_language: Source language code (default: 'en' for English)
            
        Returns:
            Translated text or None if translation fails
        """
        if not self.api_key:
            print("Warning: Google Translate API key not configured")
            return None
            
        # Check cache first
        cache_key = f"translation_{hash(text)}_{source_language}_{target_language}"
        cached_result = cache.get(cache_key)
        if cached_result:
            return cached_result
            
        try:
            url = f"{self.base_url}?key={self.api_key}"
            data = {
                'q': text,
                'source': source_language,
                'target': target_language,
                'format': 'text'
            }
            
            response = requests.post(url, data=data)
            response.raise_for_status()
            
            result = response.json()
            translated_text = result['data']['translations'][0]['translatedText']
            
            # Cache the result for 24 hours
            cache.set(cache_key, translated_text, 60 * 60 * 24)
            
            return translated_text
            
        except Exception as e:
            print(f"Translation error: {e}")
            return None
    
    def translate_course_content(self, course_content: Dict[str, Any], target_language: str = 'am') -> Dict[str, Any]:
        """
        Translate AI-generated course content to target language
        
        Args:
            course_content: Course content dictionary
            target_language: Target language code
            
        Returns:
            Translated course content
        """
        if not self.api_key:
            print("Warning: Google Translate API key not configured")
            return course_content
            
        translated_content = course_content.copy()
        
        # Translate course title
        if 'title' in translated_content:
            translated_title = self.translate_text(translated_content['title'], target_language)
            if translated_title:
                translated_content['title'] = translated_title
        
        # Translate course description
        if 'description' in translated_content:
            translated_desc = self.translate_text(translated_content['description'], target_language)
            if translated_desc:
                translated_content['description'] = translated_desc
        
        # Translate modules
        if 'modules' in translated_content:
            for module in translated_content['modules']:
                if 'title' in module:
                    translated_module_title = self.translate_text(module['title'], target_language)
                    if translated_module_title:
                        module['title'] = translated_module_title
                
                if 'lessons' in module:
                    for lesson in module['lessons']:
                        if 'title' in lesson:
                            translated_lesson_title = self.translate_text(lesson['title'], target_language)
                            if translated_lesson_title:
                                lesson['title'] = translated_lesson_title
                        
                        if 'content' in lesson:
                            translated_content_text = self.translate_text(lesson['content'], target_language)
                            if translated_content_text:
                                lesson['content'] = translated_content_text
        
        # Translate exercises
        if 'exercises' in translated_content:
            for exercise in translated_content['exercises']:
                if 'question' in exercise:
                    translated_question = self.translate_text(exercise['question'], target_language)
                    if translated_question:
                        exercise['question'] = translated_question
                
                if 'options' in exercise:
                    for i, option in enumerate(exercise['options']):
                        translated_option = self.translate_text(option, target_language)
                        if translated_option:
                            exercise['options'][i] = translated_option
        
        # Translate additional resources
        if 'additional_resources' in translated_content:
            for resource in translated_content['additional_resources']:
                if 'title' in resource:
                    translated_resource_title = self.translate_text(resource['title'], target_language)
                    if translated_resource_title:
                        resource['title'] = translated_resource_title
                
                if 'description' in resource:
                    translated_resource_desc = self.translate_text(resource['description'], target_language)
                    if translated_resource_desc:
                        resource['description'] = translated_resource_desc
        
        return translated_content
    
    def get_supported_languages(self) -> Dict[str, str]:
        """
        Get list of supported languages
        
        Returns:
            Dictionary of language codes and names
        """
        return {
            'en': 'English',
            'am': 'Amharic',
            'fr': 'French',
            'es': 'Spanish',
            'ar': 'Arabic',
            'zh': 'Chinese',
            'hi': 'Hindi',
            'pt': 'Portuguese',
            'ru': 'Russian',
            'ja': 'Japanese'
        }
    
    def validate_language_code(self, language_code: str) -> bool:
        """
        Validate if language code is supported
        
        Args:
            language_code: Language code to validate
            
        Returns:
            True if supported, False otherwise
        """
        supported_languages = self.get_supported_languages()
        return language_code in supported_languages

# Global instance
translation_service = TranslationService() 