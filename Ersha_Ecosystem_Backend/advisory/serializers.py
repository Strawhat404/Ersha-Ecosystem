from rest_framework import serializers
from .models import (
    Expert, AdvisoryContent, Course, Resource, 
    UserBookmark, UserLike, ConsultationRequest
)


class ExpertSerializer(serializers.ModelSerializer):
    """Serializer for Expert model"""
    class Meta:
        model = Expert
        fields = [
            'id', 'user', 'name', 'specialization', 'experience_years', 'rating',
            'bio', 'availability', 'consultation_price', 'languages',
            'certifications', 'profile_image', 'contact_email', 'contact_phone',
            'region', 'verified', 'featured', 'total_consultations',
            'calendly_link', 'calendly_connected', 'calendly_event_type_id',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'rating', 'total_consultations', 'created_at', 'updated_at']


class AdvisoryContentSerializer(serializers.ModelSerializer):
    """Serializer for AdvisoryContent model"""
    author_name = serializers.CharField(read_only=True)
    is_bookmarked = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = AdvisoryContent
        fields = [
            'id', 'title', 'content', 'excerpt', 'category', 'crop_type',
            'region', 'season', 'difficulty', 'read_time', 'author',
            'author_name', 'author_role', 'tags', 'images', 'video_url',
            'download_url', 'featured', 'verified', 'views', 'likes',
            'bookmarks', 'published_at', 'created_at', 'updated_at',
            'is_bookmarked', 'is_liked'
        ]
        read_only_fields = ['id', 'views', 'likes', 'bookmarks', 'created_at', 'updated_at']

    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return UserBookmark.objects.filter(user=request.user, advisory_content=obj).exists()
        return False

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return UserLike.objects.filter(user=request.user, advisory_content=obj).exists()
        return False


class CourseSerializer(serializers.ModelSerializer):
    """Serializer for Course model"""
    author_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'category', 'difficulty',
            'duration', 'duration_minutes', 'modules', 'author',
            'author_name', 'price', 'is_free', 'image', 'views',
            'rating', 'featured', 'published_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'views', 'rating', 'created_at', 'updated_at']


class ResourceSerializer(serializers.ModelSerializer):
    """Serializer for Resource model"""
    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'description', 'resource_type', 'category',
            'file_url', 'file_size', 'file_size_bytes', 'downloads',
            'image', 'featured', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'downloads', 'created_at', 'updated_at']


class UserBookmarkSerializer(serializers.ModelSerializer):
    """Serializer for UserBookmark model"""
    advisory_content = AdvisoryContentSerializer(read_only=True)
    
    class Meta:
        model = UserBookmark
        fields = ['id', 'advisory_content', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserLikeSerializer(serializers.ModelSerializer):
    """Serializer for UserLike model"""
    advisory_content = AdvisoryContentSerializer(read_only=True)
    
    class Meta:
        model = UserLike
        fields = ['id', 'advisory_content', 'created_at']
        read_only_fields = ['id', 'created_at']


class ConsultationRequestSerializer(serializers.ModelSerializer):
    """Serializer for ConsultationRequest model"""
    expert = ExpertSerializer(read_only=True)
    expert_id = serializers.UUIDField(write_only=True)
    user_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    
    class Meta:
        model = ConsultationRequest
        fields = [
            'id', 'expert', 'expert_id', 'user_name', 'user_email', 'subject', 'description',
            'preferred_date', 'preferred_time', 'duration_hours',
            'total_cost', 'status', 'expert_notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'expert_notes', 'created_at', 'updated_at']

    def get_user_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username
        return "Unknown User"

    def get_user_email(self, obj):
        return obj.user.email if obj.user else None


class AdvisoryContentListSerializer(serializers.ModelSerializer):
    """Simplified serializer for list views"""
    author_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = AdvisoryContent
        fields = [
            'id', 'title', 'excerpt', 'category', 'crop_type', 'region',
            'season', 'difficulty', 'read_time', 'author_name', 'author_role',
            'tags', 'images', 'featured', 'verified', 'views', 'likes',
            'bookmarks', 'published_at'
        ]


class ExpertListSerializer(serializers.ModelSerializer):
    """Simplified serializer for expert list views"""
    class Meta:
        model = Expert
        fields = [
            'id', 'name', 'specialization', 'experience_years', 'rating',
            'availability', 'consultation_price', 'languages', 'profile_image',
            'region', 'verified', 'featured', 'calendly_link', 'calendly_connected'
        ]


class CourseListSerializer(serializers.ModelSerializer):
    """Simplified serializer for course list views"""
    author_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'category', 'difficulty',
            'duration', 'modules', 'author_name', 'price', 'is_free',
            'image', 'views', 'rating', 'featured', 'published_at'
        ]


class ResourceListSerializer(serializers.ModelSerializer):
    """Simplified serializer for resource list views"""
    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'description', 'resource_type', 'category',
            'file_size', 'downloads', 'image', 'featured', 'created_at'
        ] 