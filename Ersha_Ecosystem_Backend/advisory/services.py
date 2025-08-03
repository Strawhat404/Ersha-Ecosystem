import os
import json
import google.generativeai as genai
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from io import BytesIO
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.db.models import Q, Sum, Count
from django.utils import timezone
from datetime import timedelta
import uuid
from datetime import datetime

from users.models import User, Profile
from marketplace.models import Product
from weather.models import WeatherData
from news.models import NewsArticle
from .translation_service import translation_service

class UserDataService:
    """Service to gather user data from existing sources"""
    
    def __init__(self, user):
        self.user = user
        self.profile = getattr(user, 'profile', None)
    
    def get_user_profile_data(self):
        """Get user profile and farming information"""
        data = {
            'user_type': self.user.user_type,
            'region': self.user.region,
            'verification_status': self.user.verification_status,
        }
        
        if self.profile:
            data.update({
                'farm_size': str(self.profile.farm_size) if self.profile.farm_size else None,
                'farm_size_unit': self.profile.farm_size_unit,
                'woreda': self.profile.woreda,
                'kebele': self.profile.kebele,
                'bio': self.profile.bio,
                'area_of_expertise': self.profile.area_of_expertise,
            })
        
        return data
    
    def get_user_products(self):
        """Get user's farming products and categories"""
        products = Product.objects.filter(farmer=self.user, is_active=True)
        
        product_data = []
        categories = set()
        
        for product in products:
            product_data.append({
                'name': product.name,
                'category': product.category,
                'description': product.description,
                'price': str(product.price),
                'quantity': str(product.quantity),
                'unit': product.unit,
                'organic': product.organic,
                'harvest_date': product.harvest_date.isoformat() if product.harvest_date else None,
            })
            categories.add(product.category)
        
        return {
            'products': product_data,
            'categories': list(categories),
            'total_products': len(product_data)
        }
    
    def get_user_sales_data(self):
        """Get user's sales and order history"""
        try:
            # Get orders where user's products are being sold through OrderItem
            from orders.models import OrderItem
            
            # Get all products by this user
            user_products = Product.objects.filter(farmer=self.user, is_active=True)
            
            # Get order items for user's products
            order_items = OrderItem.objects.filter(product__in=user_products)
            
            # Calculate sales metrics
            total_sales = sum(item.total_price for item in order_items if item.order.status == 'delivered')
            
            recent_order_items = order_items.filter(
                order__created_at__gte=timezone.now() - timedelta(days=30)
            )
            
            sales_data = {
                'total_sales': str(total_sales),
                'total_orders': order_items.count(),
                'completed_orders': order_items.filter(order__status='delivered').count(),
                'recent_orders_count': recent_order_items.count(),
                'average_order_value': str(total_sales / order_items.count()) if order_items.count() > 0 else '0',
            }
            
            # Get recent order details
            recent_order_details = []
            for order_item in recent_order_items[:10]:  # Last 10 order items
                recent_order_details.append({
                    'order_number': order_item.order.id,
                    'product_name': order_item.product.name,
                    'quantity': str(order_item.quantity),
                    'total_amount': str(order_item.total_price),
                    'status': order_item.order.status,
                    'created_at': order_item.order.created_at.isoformat(),
                })
            
            sales_data['recent_orders'] = recent_order_details
            return sales_data
        except Exception as e:
            # Return default data if there's an error
            return {
                'total_sales': '0',
                'total_orders': 0,
                'completed_orders': 0,
                'recent_orders_count': 0,
                'average_order_value': '0',
                'recent_orders': []
            }
    
    def get_user_weather_data(self):
        """Get weather data for user's region"""
        try:
            if not self.user.region:
                return {}
            
            # Get latest weather data for user's region
            weather_data = WeatherData.objects.filter(
                region__icontains=self.user.region
            ).order_by('-created_at').first()
            
            if weather_data:
                return {
                    'region': weather_data.region,
                    'woreda': weather_data.woreda,
                    'temperature': str(weather_data.temperature) if weather_data.temperature else None,
                    'humidity': weather_data.humidity,
                    'rainfall': str(weather_data.rainfall) if weather_data.rainfall else None,
                    'wind_speed': str(weather_data.wind_speed) if weather_data.wind_speed else None,
                    'weather_condition': weather_data.weather_condition,
                    'advisory_text': weather_data.advisory_text,
                    'data_source': weather_data.data_source,
                    'created_at': weather_data.created_at.isoformat(),
                }
            
            return {}
        except Exception as e:
            return {}
    
    def get_relevant_news(self):
        """Get relevant agricultural news for user's region and products"""
        try:
            news_articles = NewsArticle.objects.filter(
                Q(category='agriculture') | Q(category='farming')
            ).order_by('-published_at')[:5]
            
            news_data = []
            for article in news_articles:
                news_data.append({
                    'title': article.title,
                    'content': article.content[:200] + '...' if len(article.content) > 200 else article.content,
                    'category': article.category,
                    'published_at': article.published_at.isoformat(),
                })
            
            return news_data
        except Exception as e:
            return []
    
    def get_user_interaction_data(self):
        """Get user's interaction data for recommendations"""
        try:
            # Get user's course views and interactions
            from .models import Course, Resource
            
            # Get AI-generated courses the user has viewed
            viewed_courses = Course.objects.filter(
                generated_for_user=self.user,
                is_ai_generated=True
            ).order_by('-views')
            
            # Get user's resource downloads
            downloaded_resources = Resource.objects.filter(
                generated_for_user=self.user,
                is_ai_generated=True
            ).order_by('-downloads')
            
            interaction_data = {
                'viewed_courses_count': viewed_courses.count(),
                'downloaded_resources_count': downloaded_resources.count(),
                'preferred_categories': [],
                'preferred_difficulty': 'beginner',
            }
            
            # Analyze preferred categories
            if viewed_courses.exists():
                categories = [course.category for course in viewed_courses]
                if categories:
                    from collections import Counter
                    category_counts = Counter(categories)
                    interaction_data['preferred_categories'] = [cat for cat, count in category_counts.most_common(3)]
            
            # Analyze preferred difficulty
            if viewed_courses.exists():
                difficulties = [course.difficulty for course in viewed_courses]
                if difficulties:
                    from collections import Counter
                    difficulty_counts = Counter(difficulties)
                    interaction_data['preferred_difficulty'] = difficulty_counts.most_common(1)[0][0]
            
            return interaction_data
        except Exception as e:
            return {
                'viewed_courses_count': 0,
                'downloaded_resources_count': 0,
                'preferred_categories': [],
                'preferred_difficulty': 'beginner',
            }
    
    def get_comprehensive_user_data(self):
        """Get all user data for AI course generation"""
        try:
            return {
                'profile': self.get_user_profile_data(),
                'products': self.get_user_products(),
                'sales': self.get_user_sales_data(),
                'weather': self.get_user_weather_data(),
                'news': self.get_relevant_news(),
                'interactions': self.get_user_interaction_data(),
            }
        except Exception as e:
            # Return minimal data if there's an error
            return {
                'profile': self.get_user_profile_data(),
                'products': {'products': [], 'categories': [], 'total_products': 0},
                'sales': {
                    'total_sales': '0',
                    'total_orders': 0,
                    'completed_orders': 0,
                    'recent_orders_count': 0,
                    'average_order_value': '0',
                    'recent_orders': []
                },
                'weather': {},
                'news': [],
                'interactions': {
                    'viewed_courses_count': 0,
                    'downloaded_resources_count': 0,
                    'preferred_categories': [],
                    'preferred_difficulty': 'beginner',
                },
            }

class AIContentGenerator:
    """AI-powered content generation service using Gemini API"""
    
    def __init__(self):
        self.gemini_api_key = os.getenv('GEMINI_API_KEY')
        self.translation_service = translation_service
        
    def generate_agricultural_course(self, user_data, course_title, course_description, target_language='en'):
        """
        Generate agricultural course with optional translation
        
        Args:
            user_data: User profile and farming data
            course_title: Course title
            course_description: Course description
            target_language: Target language for translation (default: 'en')
            
        Returns:
            Generated course data
        """
        # Generate course in English first
        course_data = self._generate_course_content(user_data, course_title, course_description)
        
        # Translate if target language is not English
        if target_language != 'en' and self.translation_service.validate_language_code(target_language):
            try:
                course_data = self.translation_service.translate_course_content(course_data, target_language)
                course_data['original_language'] = 'en'
                course_data['translated_language'] = target_language
            except Exception as e:
                print(f"Translation failed: {e}")
                # Continue with English version if translation fails
        
        return course_data
    
    def _generate_course_content(self, user_data, course_title, course_description):
        """
        Generate course content using Gemini API
        """
        # Construct the prompt for Gemini
        prompt = self._build_course_prompt(user_data, course_title, course_description)
        
        try:
            # Generate content using Gemini
            response = self.model.generate_content(prompt)
            
            if not response.text:
                raise Exception("No content generated by Gemini API")
            
            # Parse the response
            course_data = self._parse_ai_response(response.text)
            
            # Generate PDF
            pdf_file = self._generate_course_pdf(course_data, user_data)
            
            # Save PDF to storage
            file_path = self._save_pdf(pdf_file, course_data['title'])
            
            return {
                'title': course_data['title'],
                'description': course_data['description'],
                'content': course_data['content'],
                'download_url': file_path,
                'file_size': f"{len(pdf_file.getvalue()) / 1024 / 1024:.1f} MB",
                'file_size_bytes': len(pdf_file.getvalue()),
                'modules': course_data.get('modules', []),
                'duration': course_data.get('duration', '60 mins'),
                'duration_minutes': course_data.get('duration_minutes', 60),
                'difficulty': course_data.get('difficulty', 'beginner'),
                'category': course_data.get('category', 'farming'),
                'tags': course_data.get('tags', []),
                'generated_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            raise Exception(f"Failed to generate course: {str(e)}")
    
    def _build_course_prompt(self, user_data, course_title, course_description):
        """Build a comprehensive prompt for agricultural course generation"""
        
        profile_data = user_data.get('profile', {})
        products_data = user_data.get('products', {})
        sales_data = user_data.get('sales', {})
        weather_data = user_data.get('weather', {})
        news_data = user_data.get('news', [])
        interaction_data = user_data.get('interactions', {})
        
        prompt = f"""
You are an expert agricultural educator for Ethiopian farmers. Generate a comprehensive, educational course based on the following data:

**Course Request:**
Title: {course_title}
Description: {course_description}

**User Profile:**
{json.dumps(profile_data, indent=2)}

**User's Farming Products:**
{json.dumps(products_data, indent=2)}

**User's Sales Data:**
{json.dumps(sales_data, indent=2)}

**Current Weather Conditions:**
{json.dumps(weather_data, indent=2)}

**Recent Agricultural News:**
{json.dumps(news_data, indent=2)}

**User's Learning Preferences:**
{json.dumps(interaction_data, indent=2)}

**Requirements:**
1. Create a comprehensive educational course in PDF format
2. Structure the course with clear modules and lessons
3. Include practical examples based on the user's farming context
4. Provide actionable learning objectives
5. Include Ethiopian agricultural context and best practices
6. Use clear, practical language suitable for Ethiopian farmers
7. Include assessment questions and practical exercises
8. Make it self-paced and easy to follow

**Course Structure:**
- Course Overview and Learning Objectives
- Module 1: [Topic] (with lessons)
- Module 2: [Topic] (with lessons)
- Module 3: [Topic] (with lessons)
- Practical Exercises and Assessments
- Additional Resources and References

**Response Format:**
Return your response in the following JSON format:
{{
    "title": "{course_title}",
    "description": "Comprehensive educational course on {course_title.lower()}",
    "category": "farming",
    "difficulty": "beginner",
    "duration": "60 mins",
    "duration_minutes": 60,
    "tags": ["education", "farming", "practical"],
    "modules": [
        {{
            "title": "Module 1: [Topic]",
            "lessons": [
                {{
                    "title": "Lesson 1.1: [Topic]",
                    "content": "..."
                }}
            ]
        }}
    ],
    "content": {{
        "overview": "...",
        "learning_objectives": "...",
        "module_1": "...",
        "module_2": "...",
        "module_3": "...",
        "practical_exercises": "...",
        "assessment": "...",
        "resources": "..."
    }}
}}

Make the course practical, educational, and specifically tailored to Ethiopian agricultural context and the user's farming profile.
"""
        
        return prompt
    
    def _parse_ai_response(self, response_text):
        """Parse the AI response and extract structured content"""
        try:
            # Try to extract JSON from the response
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx != -1 and end_idx != -1:
                json_str = response_text[start_idx:end_idx]
                data = json.loads(json_str)
            else:
                # Fallback: create structured content from plain text
                data = {
                    "title": "Agricultural Course",
                    "description": "Comprehensive farming education course",
                    "category": "farming",
                    "difficulty": "beginner",
                    "duration": "60 mins",
                    "duration_minutes": 60,
                    "tags": ["education", "farming"],
                    "modules": [],
                    "content": {
                        "overview": response_text[:500] + "...",
                        "learning_objectives": "Learning objectives section",
                        "module_1": "Module 1 content",
                        "module_2": "Module 2 content",
                        "module_3": "Module 3 content",
                        "practical_exercises": "Practical exercises section",
                        "assessment": "Assessment questions",
                        "resources": "Additional resources"
                    }
                }
            
            return data
            
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            return {
                "title": "Agricultural Course",
                "description": "Comprehensive farming education course",
                "category": "farming",
                "difficulty": "beginner",
                "duration": "60 mins",
                "duration_minutes": 60,
                "tags": ["education", "farming"],
                "modules": [],
                "content": {
                    "overview": response_text[:500] + "...",
                    "learning_objectives": "Learning objectives section",
                    "module_1": "Module 1 content",
                    "module_2": "Module 2 content",
                    "module_3": "Module 3 content",
                    "practical_exercises": "Practical exercises section",
                    "assessment": "Assessment questions",
                    "resources": "Additional resources"
                }
            }
    
    def _generate_course_pdf(self, course_data, user_data):
        """Generate a professional PDF course"""
        
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.darkgreen
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=14,
            spaceAfter=12,
            spaceBefore=20,
            textColor=colors.darkgreen
        )
        
        normal_style = ParagraphStyle(
            'CustomNormal',
            parent=styles['Normal'],
            fontSize=11,
            spaceAfter=6,
            alignment=TA_JUSTIFY
        )
        
        # Build PDF content
        story = []
        
        # Title
        story.append(Paragraph(course_data['title'], title_style))
        story.append(Spacer(1, 20))
        
        # Course Overview
        story.append(Paragraph("Course Overview", heading_style))
        story.append(Paragraph(course_data['content']['overview'], normal_style))
        story.append(Spacer(1, 12))
        
        # Learning Objectives
        story.append(Paragraph("Learning Objectives", heading_style))
        story.append(Paragraph(course_data['content']['learning_objectives'], normal_style))
        story.append(Spacer(1, 12))
        
        # Module 1
        story.append(Paragraph("Module 1", heading_style))
        story.append(Paragraph(course_data['content']['module_1'], normal_style))
        story.append(Spacer(1, 12))
        
        # Module 2
        story.append(Paragraph("Module 2", heading_style))
        story.append(Paragraph(course_data['content']['module_2'], normal_style))
        story.append(Spacer(1, 12))
        
        # Module 3
        story.append(Paragraph("Module 3", heading_style))
        story.append(Paragraph(course_data['content']['module_3'], normal_style))
        story.append(Spacer(1, 12))
        
        # Practical Exercises
        story.append(Paragraph("Practical Exercises", heading_style))
        story.append(Paragraph(course_data['content']['practical_exercises'], normal_style))
        story.append(Spacer(1, 12))
        
        # Assessment
        story.append(Paragraph("Assessment Questions", heading_style))
        story.append(Paragraph(course_data['content']['assessment'], normal_style))
        story.append(Spacer(1, 12))
        
        # Resources
        story.append(Paragraph("Additional Resources", heading_style))
        story.append(Paragraph(course_data['content']['resources'], normal_style))
        story.append(Spacer(1, 20))
        
        # Footer
        footer_style = ParagraphStyle(
            'Footer',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.grey,
            alignment=TA_CENTER
        )
        story.append(Paragraph(f"Generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}", footer_style))
        story.append(Paragraph("Ersha Ecosystem - AI-Powered Agricultural Education", footer_style))
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        
        return buffer
    
    def _save_pdf(self, pdf_buffer, title):
        """Save PDF to storage and return file path"""
        
        # Generate unique filename
        filename = f"ai_courses/{uuid.uuid4().hex}_{title.replace(' ', '_')[:50]}.pdf"
        
        # Save to storage
        default_storage.save(filename, ContentFile(pdf_buffer.getvalue()))
        
        # Return the file URL
        return default_storage.url(filename) 