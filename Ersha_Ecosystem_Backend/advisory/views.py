from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, F
from django.utils import timezone

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
    filterset_fields = ['category', 'difficulty', 'is_free', 'featured']
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


class ResourceViewSet(viewsets.ModelViewSet):
    """ViewSet for Resource model"""
    queryset = Resource.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['resource_type', 'category', 'featured']
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
