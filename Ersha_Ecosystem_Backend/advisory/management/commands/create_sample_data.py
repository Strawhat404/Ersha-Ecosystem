from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from advisory.models import Expert, Course, Resource, AdvisoryContent
from decimal import Decimal
import uuid

User = get_user_model()

class Command(BaseCommand):
    help = 'Create sample data for advisory system'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Create sample experts
        experts_data = [
            {
                'name': 'Dr. Alemayehu Bekele',
                'specialization': 'Crop Management',
                'experience_years': 15,
                'rating': Decimal('4.9'),
                'bio': 'Expert in sustainable farming practices and crop rotation techniques with over 15 years of experience in Ethiopian agriculture.',
                'availability': 'available',
                'consultation_price': Decimal('500.00'),
                'languages': ['Amharic', 'English'],
                'certifications': ['PhD in Agricultural Sciences', 'Certified Crop Advisor'],
                'region': 'Addis Ababa',
                'verified': True,
                'featured': True,
                'calendly_link': 'https://calendly.com/alemayehu-bekele/consultation',
                'calendly_connected': True,
                'calendly_event_type_id': 'sample_event_type_1'
            },
            {
                'name': 'Sara Mekonnen',
                'specialization': 'Livestock Management',
                'experience_years': 12,
                'rating': Decimal('4.8'),
                'bio': 'Specializes in dairy farming and animal nutrition programs. Expert in modern livestock management techniques.',
                'availability': 'busy',
                'consultation_price': Decimal('450.00'),
                'languages': ['Amharic', 'English', 'Oromo'],
                'certifications': ['MSc in Animal Science', 'Livestock Management Specialist'],
                'region': 'Oromia',
                'verified': True,
                'featured': False,
                'calendly_link': 'https://calendly.com/sara-mekonnen/consultation',
                'calendly_connected': True,
                'calendly_event_type_id': 'sample_event_type_2'
            },
            {
                'name': 'Dr. Tadesse Worku',
                'specialization': 'Soil Science',
                'experience_years': 20,
                'rating': Decimal('4.9'),
                'bio': 'Leading researcher in soil health and fertilizer optimization. Expert in soil testing and nutrient management.',
                'availability': 'available',
                'consultation_price': Decimal('600.00'),
                'languages': ['Amharic', 'English'],
                'certifications': ['PhD in Soil Science', 'Certified Soil Scientist'],
                'region': 'Tigray',
                'verified': True,
                'featured': True,
                'calendly_link': 'https://calendly.com/tadesse-worku/consultation',
                'calendly_connected': True,
                'calendly_event_type_id': 'sample_event_type_3'
            },
            {
                'name': 'Meron Alemu',
                'specialization': 'Agricultural Technology',
                'experience_years': 8,
                'rating': Decimal('4.7'),
                'bio': 'Specialist in modern farming technology and precision agriculture. Expert in drone technology and smart farming.',
                'availability': 'available',
                'consultation_price': Decimal('400.00'),
                'languages': ['Amharic', 'English'],
                'certifications': ['MSc in Agricultural Engineering', 'Precision Agriculture Specialist'],
                'region': 'Addis Ababa',
                'verified': True,
                'featured': False,
                'calendly_link': 'https://calendly.com/meron-alemu/consultation',
                'calendly_connected': True,
                'calendly_event_type_id': 'sample_event_type_4'
            },
            {
                'name': 'Dr. Berhanu Gebre',
                'specialization': 'Climate Adaptation',
                'experience_years': 18,
                'rating': Decimal('4.8'),
                'bio': 'Expert in climate-smart agriculture and drought-resistant farming. Specialist in climate change adaptation strategies.',
                'availability': 'available',
                'consultation_price': Decimal('550.00'),
                'languages': ['Amharic', 'English'],
                'certifications': ['PhD in Climate Science', 'Climate Adaptation Expert'],
                'region': 'Amhara',
                'verified': True,
                'featured': True,
                'calendly_link': 'https://calendly.com/berhanu-gebre/consultation',
                'calendly_connected': True,
                'calendly_event_type_id': 'sample_event_type_5'
            },
            {
                'name': 'Tigist Haile',
                'specialization': 'Organic Farming',
                'experience_years': 10,
                'rating': Decimal('4.6'),
                'bio': 'Certified organic farming consultant and sustainable agriculture advocate. Expert in organic certification and permaculture.',
                'availability': 'available',
                'consultation_price': Decimal('350.00'),
                'languages': ['Amharic', 'English'],
                'certifications': ['Organic Certification Expert', 'Permaculture Designer'],
                'region': 'Southern Nations',
                'verified': True,
                'featured': False,
                'calendly_link': 'https://calendly.com/tigist-haile/consultation',
                'calendly_connected': True,
                'calendly_event_type_id': 'sample_event_type_6'
            }
        ]

        for expert_data in experts_data:
            expert, created = Expert.objects.get_or_create(
                name=expert_data['name'],
                defaults=expert_data
            )
            if created:
                self.stdout.write(f'Created expert: {expert.name}')
            else:
                self.stdout.write(f'Expert already exists: {expert.name}')

        # Create sample courses
        courses_data = [
            {
                'title': 'Organic Farming Best Practices',
                'description': 'Learn the fundamentals of organic farming, including soil preparation, natural pest control, and sustainable harvesting techniques.',
                'category': 'farming',
                'difficulty': 'beginner',
                'duration': '45 mins',
                'duration_minutes': 45,
                'modules': ['Soil Health', 'Composting', 'Natural Pest Control', 'Certification Process'],
                'author_name': 'Dr. Alemayehu Bekele',
                'price': Decimal('0.00'),
                'is_free': True,
                'views': 2450,
                'rating': Decimal('4.8'),
                'featured': True
            },
            {
                'title': 'Seasonal Crop Planning Guide',
                'description': 'Comprehensive guide to planning your crops according to Ethiopian seasons, weather patterns, and market demand.',
                'category': 'planning',
                'difficulty': 'intermediate',
                'duration': '60 mins',
                'duration_minutes': 60,
                'modules': ['Seasonal Calendar', 'Market Analysis', 'Risk Management', 'Crop Rotation'],
                'author_name': 'Sara Mekonnen',
                'price': Decimal('299.00'),
                'is_free': False,
                'views': 1870,
                'rating': Decimal('4.7'),
                'featured': False
            },
            {
                'title': 'Modern Irrigation Techniques',
                'description': 'Master efficient irrigation systems including drip irrigation, sprinkler systems, and water conservation methods.',
                'category': 'technology',
                'difficulty': 'advanced',
                'duration': '90 mins',
                'duration_minutes': 90,
                'modules': ['Drip Systems', 'Smart Irrigation', 'Water Management', 'System Maintenance'],
                'author_name': 'Dr. Tadesse Worku',
                'price': Decimal('499.00'),
                'is_free': False,
                'views': 3120,
                'rating': Decimal('4.9'),
                'featured': True
            }
        ]

        for course_data in courses_data:
            course, created = Course.objects.get_or_create(
                title=course_data['title'],
                defaults=course_data
            )
            if created:
                self.stdout.write(f'Created course: {course.title}')
            else:
                self.stdout.write(f'Course already exists: {course.title}')

        # Create sample resources
        resources_data = [
            {
                'title': 'Crop Disease Identification Manual',
                'description': 'Comprehensive visual guide for identifying common crop diseases in Ethiopian agriculture.',
                'resource_type': 'PDF Guide',
                'category': 'health',
                'file_url': 'https://example.com/crop-disease-manual.pdf',
                'file_size': '12.5 MB',
                'file_size_bytes': 13107200,
                'downloads': 1520,
                'featured': True
            },
            {
                'title': 'Fertilizer Application Calculator',
                'description': 'Calculate optimal fertilizer quantities based on soil tests and crop requirements.',
                'resource_type': 'Excel Tool',
                'category': 'tools',
                'file_url': 'https://example.com/fertilizer-calculator.xlsx',
                'file_size': '2.8 MB',
                'file_size_bytes': 2936012,
                'downloads': 890,
                'featured': False
            },
            {
                'title': 'Ethiopian Agricultural Calendar',
                'description': 'Season-wise planting and harvesting guide for major crops in different Ethiopian regions.',
                'resource_type': 'PDF Reference',
                'category': 'planning',
                'file_url': 'https://example.com/agricultural-calendar.pdf',
                'file_size': '8.1 MB',
                'file_size_bytes': 8493465,
                'downloads': 2340,
                'featured': True
            }
        ]

        for resource_data in resources_data:
            resource, created = Resource.objects.get_or_create(
                title=resource_data['title'],
                defaults=resource_data
            )
            if created:
                self.stdout.write(f'Created resource: {resource.title}')
            else:
                self.stdout.write(f'Resource already exists: {resource.title}')

        self.stdout.write(self.style.SUCCESS('Sample data created successfully!')) 