from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from advisory.models import Expert, AdvisoryContent, Course, Resource
from decimal import Decimal


class Command(BaseCommand):
    help = 'Populate advisory system with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample advisory data...')

        # Create sample experts
        experts_data = [
            {
                'name': 'Dr. Alemayehu Bekele',
                'specialization': 'Crop Management',
                'experience_years': 15,
                'rating': 4.9,
                'bio': 'Expert in sustainable farming practices and crop rotation techniques.',
                'availability': 'available',
                'consultation_price': Decimal('500.00'),
                'languages': ['Amharic', 'English'],
                'profile_image': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
                'region': 'Oromia',
                'verified': True,
                'featured': True,
            },
            {
                'name': 'Sara Mekonnen',
                'specialization': 'Livestock Management',
                'experience_years': 12,
                'rating': 4.8,
                'bio': 'Specializes in dairy farming and animal nutrition programs.',
                'availability': 'busy',
                'consultation_price': Decimal('450.00'),
                'languages': ['Amharic', 'English', 'Oromo'],
                'profile_image': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
                'region': 'Amhara',
                'verified': True,
                'featured': False,
            },
            {
                'name': 'Dr. Tadesse Worku',
                'specialization': 'Soil Science',
                'experience_years': 20,
                'rating': 4.9,
                'bio': 'Leading researcher in soil health and fertilizer optimization.',
                'availability': 'available',
                'consultation_price': Decimal('600.00'),
                'languages': ['Amharic', 'English'],
                'profile_image': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                'region': 'Tigray',
                'verified': True,
                'featured': True,
            },
        ]

        for expert_data in experts_data:
            Expert.objects.get_or_create(
                name=expert_data['name'],
                defaults=expert_data
            )

        # Create sample advisory content
        advisory_data = [
            {
                'title': 'Integrated Pest Management for Coffee Plants',
                'content': 'Integrated Pest Management (IPM) is crucial for sustainable coffee production. This comprehensive guide covers monitoring, biological control, cultural practices, and targeted chemical intervention.',
                'excerpt': 'Learn effective strategies to control coffee berry borer and leaf rust while maintaining organic certification.',
                'category': 'pest-control',
                'crop_type': 'coffee',
                'region': 'oromia',
                'season': 'dry',
                'difficulty': 'intermediate',
                'read_time': 8,
                'author_name': 'Dr. Alemayehu Bekele',
                'author_role': 'Agricultural Extension Officer',
                'tags': ['organic', 'sustainable', 'coffee berry borer', 'leaf rust'],
                'images': ['https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=200&fit=crop&crop=center'],
                'featured': True,
                'verified': True,
                'views': 1250,
                'likes': 340,
                'bookmarks': 180,
            },
            {
                'title': 'Soil Enrichment Techniques for Vegetable Farming',
                'content': 'Healthy soil is the foundation of productive vegetable farming. This guide covers soil testing, organic matter incorporation, proper drainage, and crop rotation planning.',
                'excerpt': 'Comprehensive guide to improving soil fertility using organic matter and proper drainage techniques.',
                'category': 'soil_enrichment',
                'crop_type': 'vegetables',
                'region': 'amhara',
                'season': 'rainy',
                'difficulty': 'beginner',
                'read_time': 6,
                'author_name': 'Engineer Tigist Alemu',
                'author_role': 'Soil Conservation Specialist',
                'tags': ['soil health', 'organic matter', 'drainage', 'crop rotation'],
                'images': ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=200&fit=crop&crop=center'],
                'featured': False,
                'verified': True,
                'views': 980,
                'likes': 245,
                'bookmarks': 120,
            },
            {
                'title': 'Optimal Harvesting Time for Cereal Crops',
                'content': 'Master the art of timing your harvest to maximize yield and grain quality for wheat, barley, and teff. Learn about moisture content, weather conditions, and storage preparation.',
                'excerpt': 'Master the art of timing your harvest to maximize yield and grain quality for wheat, barley, and teff.',
                'category': 'harvesting',
                'crop_type': 'cereals',
                'region': 'tigray',
                'season': 'dry',
                'difficulty': 'intermediate',
                'read_time': 10,
                'author_name': 'Dr. Mehari Gebreyohannes',
                'author_role': 'Crop Production Specialist',
                'tags': ['harvesting', 'cereals', 'timing', 'quality'],
                'images': ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=200&fit=crop&crop=center'],
                'featured': True,
                'verified': True,
                'views': 2100,
                'likes': 520,
                'bookmarks': 310,
            },
        ]

        for content_data in advisory_data:
            AdvisoryContent.objects.get_or_create(
                title=content_data['title'],
                defaults=content_data
            )

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
                'image': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop',
                'views': 2450,
                'rating': 4.8,
                'featured': True,
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
                'image': 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=300&fit=crop',
                'views': 1870,
                'rating': 4.7,
                'featured': False,
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
                'image': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
                'views': 3120,
                'rating': 4.9,
                'featured': True,
            },
        ]

        for course_data in courses_data:
            Course.objects.get_or_create(
                title=course_data['title'],
                defaults=course_data
            )

        # Create sample resources
        resources_data = [
            {
                'title': 'Crop Disease Identification Manual',
                'description': 'Comprehensive visual guide for identifying common crop diseases in Ethiopian agriculture.',
                'resource_type': 'PDF Guide',
                'category': 'health',
                'file_url': 'https://example.com/disease-manual.pdf',
                'file_size': '12.5 MB',
                'file_size_bytes': 13107200,
                'downloads': 1520,
                'image': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=64&h=64&fit=crop',
                'featured': True,
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
                'image': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=64&h=64&fit=crop',
                'featured': False,
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
                'image': 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=64&h=64&fit=crop',
                'featured': True,
            },
        ]

        for resource_data in resources_data:
            Resource.objects.get_or_create(
                title=resource_data['title'],
                defaults=resource_data
            )

        self.stdout.write(
            self.style.SUCCESS('Successfully created sample advisory data!')
        ) 