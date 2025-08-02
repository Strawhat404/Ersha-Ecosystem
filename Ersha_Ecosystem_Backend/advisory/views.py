from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, F
from django.utils import timezone
from django.conf import settings

from .models import (
    Expert, AdvisoryContent, Course, Resource, 
    UserBookmark, UserLike, ConsultationRequest
)
from .serializers import (
    ExpertSerializer, ExpertListSerializer,
    AdvisoryContentSerializer, AdvisoryContentListSerializer,
    CourseSerializer, CourseListSerializer,
    ResourceSerializer, ResourceListSerializer,
    UserBookmarkSerializer, UserLikeSerializer,
    ConsultationRequestSerializer
)
from .services import AIContentGenerator, UserDataService


class ExpertViewSet(viewsets.ModelViewSet):
    """ViewSet for Expert model"""
    queryset = Expert.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['specialization', 'availability', 'region', 'verified', 'featured']
    search_fields = ['name', 'specialization', 'bio']
    ordering_fields = ['rating', 'experience_years', 'consultation_price', 'created_at']
    ordering = ['-rating', '-featured', 'name']
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'list':
            return ExpertListSerializer
        return ExpertSerializer

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def verify_expert(self, request, pk=None):
        """Admin action to verify an expert"""
        if not request.user.is_admin:
            return Response({'error': 'Admin access required'}, status=403)
        
        expert = self.get_object()
        expert.verified = True
        expert.save()
        
        return Response({
            'message': f'Expert "{expert.name}" has been verified',
            'verified': expert.verified
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def feature_expert(self, request, pk=None):
        """Admin action to feature/unfeature an expert"""
        if not request.user.is_admin:
            return Response({'error': 'Admin access required'}, status=403)
        
        expert = self.get_object()
        expert.featured = not expert.featured
        expert.save()
        
        status_text = 'featured' if expert.featured else 'unfeatured'
        return Response({
            'message': f'Expert "{expert.name}" has been {status_text}',
            'featured': expert.featured
        })
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def admin_stats(self, request):
        """Get expert statistics for admin dashboard"""
        if not request.user.is_admin:
            return Response({'error': 'Admin access required'}, status=403)
        
        total_experts = Expert.objects.count()
        verified_experts = Expert.objects.filter(verified=True).count()
        featured_experts = Expert.objects.filter(featured=True).count()
        available_experts = Expert.objects.filter(availability='available').count()
        
        # Expert performance stats
        top_experts = Expert.objects.filter(verified=True).order_by('-rating')[:5]
        expert_stats = []
        for expert in top_experts:
            expert_stats.append({
                'name': expert.name,
                'specialization': expert.specialization,
                'rating': float(expert.rating),
                'total_consultations': expert.total_consultations,
                'verified': expert.verified,
                'featured': expert.featured
            })
        
        return Response({
            'total_experts': total_experts,
            'verified_experts': verified_experts,
            'featured_experts': featured_experts,
            'available_experts': available_experts,
            'top_experts': expert_stats
        })

    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get only available experts"""
        experts = self.queryset.filter(availability='available')
        serializer = self.get_serializer(experts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured experts"""
        experts = self.queryset.filter(featured=True)
        serializer = self.get_serializer(experts, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def book_consultation(self, request, pk=None):
        """Book a consultation with an expert through Calendly"""
        expert = self.get_object()
        
        if not expert.calendly_connected or not expert.calendly_link:
            return Response({
                'error': 'This expert has not connected their Calendly account yet.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Return the Calendly link for the user to book directly
        return Response({
            'expert_name': expert.name,
            'expert_specialization': expert.specialization,
            'consultation_price': str(expert.consultation_price),
            'calendly_link': expert.calendly_link,
            'message': f'Redirecting to {expert.name}\'s Calendly booking page...'
        })

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_profile(self, request):
        """Get the current user's expert profile"""
        try:
            expert = Expert.objects.get(user=request.user)
            serializer = self.get_serializer(expert)
            return Response(serializer.data)
        except Expert.DoesNotExist:
            return Response({
                'error': 'Expert profile not found. Please complete your expert registration.'
            }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def create_profile(self, request):
        """Create expert profile for the current user"""
        try:
            # Check if expert profile already exists
            Expert.objects.get(user=request.user)
            return Response({
                'error': 'Expert profile already exists for this user.'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Expert.DoesNotExist:
            pass

        # Add user to the data
        data = request.data.copy()
        data['user'] = request.user.id
        
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            expert = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['put'], permission_classes=[IsAuthenticated])
    def update_profile(self, request):
        """Update the current user's expert profile"""
        try:
            expert = Expert.objects.get(user=request.user)
            serializer = self.get_serializer(expert, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Expert.DoesNotExist:
            return Response({
                'error': 'Expert profile not found. Please complete your expert registration.'
            }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def connect_calendly(self, request, pk=None):
        """Connect expert's Calendly account"""
        expert = self.get_object()
        
        # Check if the current user is the expert
        if expert.user != request.user:
            return Response({
                'error': 'Only the expert can connect their Calendly account.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        calendly_link = request.data.get('calendly_link')
        event_type_id = request.data.get('event_type_id')
        
        if not calendly_link:
            return Response({
                'error': 'Calendly link is required.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        expert.calendly_link = calendly_link
        expert.calendly_event_type_id = event_type_id or ''
        expert.calendly_connected = True
        expert.save()
        
        return Response({
            'message': 'Calendly account connected successfully!',
            'calendly_connected': expert.calendly_connected,
            'calendly_link': expert.calendly_link
        })

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_consultations(self, request):
        """Get consultation requests for the current expert"""
        try:
            expert = Expert.objects.get(user=request.user)
            consultations = ConsultationRequest.objects.filter(expert=expert)
            serializer = ConsultationRequestSerializer(consultations, many=True)
            return Response(serializer.data)
        except Expert.DoesNotExist:
            return Response({
                'error': 'Expert profile not found. Please complete your expert registration.'
            }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def update_consultation_status(self, request, pk=None):
        """Update consultation status (confirm, complete, cancel)"""
        consultation = self.get_object()
        
        # Check if the current user is the expert for this consultation
        if consultation.expert.user != request.user:
            return Response({
                'error': 'You can only update consultations assigned to you.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        new_status = request.data.get('status')
        expert_notes = request.data.get('expert_notes', '')
        
        if new_status not in ['confirmed', 'completed', 'cancelled']:
            return Response({
                'error': 'Invalid status. Must be confirmed, completed, or cancelled.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        consultation.status = new_status
        if expert_notes:
            consultation.expert_notes = expert_notes
        consultation.save()
        
        return Response({
            'message': f'Consultation status updated to {new_status}',
            'status': consultation.status
        })


class AdvisoryContentViewSet(viewsets.ModelViewSet):
    """ViewSet for AdvisoryContent model"""
    queryset = AdvisoryContent.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'crop_type', 'region', 'season', 'difficulty', 'featured', 'verified']
    search_fields = ['title', 'content', 'excerpt', 'author_name', 'tags']
    ordering_fields = ['published_at', 'views', 'likes', 'bookmarks', 'created_at']
    ordering = ['-published_at', '-featured', '-views']
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'list':
            return AdvisoryContentListSerializer
        return AdvisoryContentSerializer

    def retrieve(self, request, *args, **kwargs):
        """Increment view count when content is viewed"""
        instance = self.get_object()
        instance.views = F('views') + 1
        instance.save()
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured advisory content"""
        content = self.queryset.filter(featured=True)
        serializer = self.get_serializer(content, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def verified(self, request):
        """Get verified advisory content"""
        content = self.queryset.filter(verified=True)
        serializer = self.get_serializer(content, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        """Like an advisory content"""
        content = self.get_object()
        user = request.user
        
        like, created = UserLike.objects.get_or_create(
            user=user, 
            advisory_content=content
        )
        
        if created:
            content.likes = F('likes') + 1
            content.save()
            content.refresh_from_db()
            return Response({'status': 'liked'}, status=status.HTTP_201_CREATED)
        else:
            like.delete()
            content.likes = F('likes') - 1
            content.save()
            content.refresh_from_db()
            return Response({'status': 'unliked'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def bookmark(self, request, pk=None):
        """Bookmark an advisory content"""
        content = self.get_object()
        user = request.user
        
        bookmark, created = UserBookmark.objects.get_or_create(
            user=user, 
            advisory_content=content
        )
        
        if created:
            content.bookmarks = F('bookmarks') + 1
            content.save()
            content.refresh_from_db()
            return Response({'status': 'bookmarked'}, status=status.HTTP_201_CREATED)
        else:
            bookmark.delete()
            content.bookmarks = F('bookmarks') - 1
            content.save()
            content.refresh_from_db()
            return Response({'status': 'unbookmarked'}, status=status.HTTP_200_OK)


class CourseViewSet(viewsets.ModelViewSet):
    """ViewSet for Course model"""
    queryset = Course.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'difficulty', 'is_free', 'featured', 'is_ai_generated']
    search_fields = ['title', 'description', 'author_name']
    ordering_fields = ['published_at', 'views', 'rating', 'price', 'duration_minutes']
    ordering = ['-published_at', '-featured', '-views']
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'list':
            return CourseListSerializer
        return CourseSerializer

    def retrieve(self, request, *args, **kwargs):
        """Increment view count when course is viewed"""
        instance = self.get_object()
        instance.views = F('views') + 1
        instance.save()
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured courses"""
        courses = self.queryset.filter(featured=True)
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def free(self, request):
        """Get free courses"""
        courses = self.queryset.filter(is_free=True)
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def ai_generated(self, request):
        """Get all AI-generated courses"""
        courses = self.queryset.filter(is_ai_generated=True).order_by('-generation_timestamp')
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_ai_courses(self, request):
        """Get AI-generated courses for the current user"""
        courses = self.queryset.filter(
            generated_for_user=request.user,
            is_ai_generated=True
        ).order_by('-generation_timestamp')
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def generate_ai_course(self, request):
        """Generate AI-powered agricultural course"""
        try:
            # Validate required data
            course_title = request.data.get('title')
            course_description = request.data.get('description')
            
            if not course_title or not course_description:
                return Response(
                    {'error': 'Title and description are required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get user data
            user_data_service = UserDataService(request.user)
            user_data = user_data_service.get_comprehensive_user_data()
            
            # Initialize AI content generator
            ai_generator = AIContentGenerator()
            
            # Generate course
            generated_data = ai_generator.generate_agricultural_course(
                user_data, course_title, course_description
            )
            
            # Create Course object
            course = Course.objects.create(
                title=generated_data['title'],
                description=generated_data['description'],
                category=generated_data['category'],
                difficulty=generated_data['difficulty'],
                duration=generated_data['duration'],
                duration_minutes=generated_data['duration_minutes'],
                modules=generated_data['modules'],
                is_free=True,  # AI-generated courses are free
                featured=False,  # AI-generated courses are not featured by default
                published_at=timezone.now(),
                author_name=f"AI Assistant for {request.user.get_full_name() or request.user.username}",
                views=0,
                rating=0.0,
                price=0.0,
                download_url=generated_data['download_url'],
                file_size=generated_data['file_size'],
                file_size_bytes=generated_data['file_size_bytes'],
                is_ai_generated=True,
                ai_generation_data=user_data,
                ai_model_used='gemini-2.0-flash',
                generated_for_user=request.user,
                generation_timestamp=timezone.now()
            )
            
            # Serialize and return the created course
            serializer = self.get_serializer(course)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except ValueError as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to generate course: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def get_course_recommendations(self, request):
        """Get personalized course recommendations based on user data"""
        try:
            # Get user data
            user_data_service = UserDataService(request.user)
            user_data = user_data_service.get_comprehensive_user_data()
            
            # Generate course recommendations based on user data
            recommendations = []
            
            # Get user's farming products
            user_products = user_data.get('products', {}).get('categories', [])
            user_region = user_data.get('profile', {}).get('region', '')
            
            # Define course recommendations based on user data
            if 'vegetables' in user_products:
                recommendations.append({
                    'title': 'Advanced Vegetable Farming Techniques',
                    'description': 'Learn advanced techniques for growing vegetables in Ethiopian climate conditions',
                    'category': 'farming',
                    'difficulty': 'intermediate',
                    'duration': '90 mins',
                    'reason': 'Based on your vegetable farming activities'
                })
            
            if 'coffee' in user_products:
                recommendations.append({
                    'title': 'Coffee Farming Excellence',
                    'description': 'Master the art of coffee cultivation and processing for better yields',
                    'category': 'farming',
                    'difficulty': 'intermediate',
                    'duration': '120 mins',
                    'reason': 'Based on your coffee farming activities'
                })
            
            if user_region:
                recommendations.append({
                    'title': f'Climate-Smart Farming for {user_region}',
                    'description': f'Learn farming techniques specifically adapted to {user_region} climate and soil conditions',
                    'category': 'climate',
                    'difficulty': 'beginner',
                    'duration': '75 mins',
                    'reason': f'Based on your location in {user_region}'
                })
            
            # Add general recommendations
            recommendations.extend([
                {
                    'title': 'Soil Health Management',
                    'description': 'Learn how to maintain and improve soil fertility for better crop yields',
                    'category': 'soil',
                    'difficulty': 'beginner',
                    'duration': '60 mins',
                    'reason': 'Essential for all farmers'
                },
                {
                    'title': 'Market Access and Pricing Strategies',
                    'description': 'Learn how to access better markets and get fair prices for your products',
                    'category': 'planning',
                    'difficulty': 'beginner',
                    'duration': '45 mins',
                    'reason': 'Based on your sales activities'
                }
            ])
            
            return Response({
                'recommendations': recommendations,
                'user_data_summary': {
                    'region': user_region,
                    'farm_size': user_data.get('profile', {}).get('farm_size'),
                    'product_categories': user_products,
                    'total_products': user_data.get('products', {}).get('total_products', 0)
                }
            })
            
        except Exception as e:
            return Response(
                {'error': f'Failed to get recommendations: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ResourceViewSet(viewsets.ModelViewSet):
    """ViewSet for Resource model"""
    queryset = Resource.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['resource_type', 'category', 'featured', 'is_ai_generated']
    search_fields = ['title', 'description']
    ordering_fields = ['downloads', 'created_at', 'file_size_bytes']
    ordering = ['-downloads', '-featured', 'title']
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'list':
            return ResourceListSerializer
        return ResourceSerializer

    @action(detail=True, methods=['post'])
    def download(self, request, pk=None):
        """Increment download count"""
        resource = self.get_object()
        resource.downloads = F('downloads') + 1
        resource.save()
        resource.refresh_from_db()
        return Response({'status': 'download recorded'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured resources"""
        resources = self.queryset.filter(featured=True)
        serializer = self.get_serializer(resources, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def generate_ai_content(self, request):
        """Generate AI-powered agricultural content"""
        try:
            # Validate required data
            required_fields = ['weather', 'crop', 'market', 'sales', 'logistics', 'news']
            user_data = {}
            
            for field in required_fields:
                if field not in request.data:
                    return Response(
                        {'error': f'Missing required field: {field}'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                user_data[field] = request.data[field]
            
            # Initialize AI content generator
            ai_generator = AIContentGenerator()
            
            # Generate content
            generated_data = ai_generator.generate_agricultural_report(user_data)
            
            # Create Resource object
            resource = Resource.objects.create(
                title=generated_data['title'],
                description=generated_data['description'],
                resource_type=generated_data['resource_type'],
                category=generated_data['category'],
                file_url=generated_data['file_url'],
                file_size=generated_data['file_size'],
                file_size_bytes=generated_data['file_size_bytes'],
                is_ai_generated=True,
                ai_generation_data=user_data,
                ai_model_used='gemini-2.0-flash',
                generated_for_user=request.user,
                generation_timestamp=timezone.now()
            )
            
            # Serialize and return the created resource
            serializer = self.get_serializer(resource)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except ValueError as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to generate content: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_ai_resources(self, request):
        """Get AI-generated resources for the current user"""
        resources = self.queryset.filter(
            generated_for_user=request.user,
            is_ai_generated=True
        ).order_by('-generation_timestamp')
        serializer = self.get_serializer(resources, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def ai_generated(self, request):
        """Get all AI-generated resources"""
        resources = self.queryset.filter(is_ai_generated=True).order_by('-generation_timestamp')
        serializer = self.get_serializer(resources, many=True)
        return Response(serializer.data)


class UserBookmarkViewSet(viewsets.ModelViewSet):
    """ViewSet for UserBookmark model"""
    serializer_class = UserBookmarkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserBookmark.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserLikeViewSet(viewsets.ModelViewSet):
    """ViewSet for UserLike model"""
    serializer_class = UserLikeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserLike.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ConsultationRequestViewSet(viewsets.ModelViewSet):
    """ViewSet for ConsultationRequest model"""
    serializer_class = ConsultationRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ConsultationRequest.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a consultation request"""
        consultation = self.get_object()
        if consultation.status == 'pending':
            consultation.status = 'cancelled'
            consultation.save()
            return Response({'status': 'cancelled'}, status=status.HTTP_200_OK)
        return Response(
            {'error': 'Cannot cancel consultation in current status'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
