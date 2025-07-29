from django.contrib import admin
from .models import (
    Expert, AdvisoryContent, Course, Resource, 
    UserBookmark, UserLike, ConsultationRequest
)


@admin.register(Expert)
class ExpertAdmin(admin.ModelAdmin):
    list_display = ['name', 'specialization', 'experience_years', 'rating', 'availability', 'consultation_price', 'verified', 'featured']
    list_filter = ['specialization', 'availability', 'verified', 'featured', 'region']
    search_fields = ['name', 'specialization', 'bio']
    readonly_fields = ['id', 'rating', 'total_consultations', 'created_at', 'updated_at']
    list_editable = ['verified', 'featured']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'user', 'name', 'specialization', 'experience_years', 'bio')
        }),
        ('Contact & Location', {
            'fields': ('contact_email', 'contact_phone', 'region', 'profile_image')
        }),
        ('Services', {
            'fields': ('consultation_price', 'availability', 'languages', 'certifications')
        }),
        ('Status & Metrics', {
            'fields': ('rating', 'verified', 'featured', 'total_consultations')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(AdvisoryContent)
class AdvisoryContentAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'crop_type', 'difficulty', 'author_name', 'views', 'likes', 'bookmarks', 'featured', 'verified']
    list_filter = ['category', 'crop_type', 'region', 'season', 'difficulty', 'featured', 'verified', 'published_at']
    search_fields = ['title', 'content', 'excerpt', 'author_name', 'tags']
    readonly_fields = ['id', 'views', 'likes', 'bookmarks', 'created_at', 'updated_at']
    list_editable = ['featured', 'verified']
    date_hierarchy = 'published_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'title', 'content', 'excerpt')
        }),
        ('Categorization', {
            'fields': ('category', 'crop_type', 'region', 'season', 'difficulty', 'tags')
        }),
        ('Author Information', {
            'fields': ('author', 'author_name', 'author_role')
        }),
        ('Media & Links', {
            'fields': ('images', 'video_url', 'download_url')
        }),
        ('Metrics', {
            'fields': ('read_time', 'views', 'likes', 'bookmarks')
        }),
        ('Status', {
            'fields': ('featured', 'verified', 'published_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'difficulty', 'duration', 'author_name', 'price', 'is_free', 'views', 'rating', 'featured']
    list_filter = ['category', 'difficulty', 'is_free', 'featured', 'published_at']
    search_fields = ['title', 'description', 'author_name']
    readonly_fields = ['id', 'views', 'rating', 'created_at', 'updated_at']
    list_editable = ['featured', 'is_free']
    date_hierarchy = 'published_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'title', 'description')
        }),
        ('Categorization', {
            'fields': ('category', 'difficulty', 'modules')
        }),
        ('Duration & Pricing', {
            'fields': ('duration', 'duration_minutes', 'price', 'is_free')
        }),
        ('Author & Media', {
            'fields': ('author', 'author_name', 'image')
        }),
        ('Metrics', {
            'fields': ('views', 'rating')
        }),
        ('Status', {
            'fields': ('featured', 'published_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ['title', 'resource_type', 'category', 'file_size', 'downloads', 'featured']
    list_filter = ['resource_type', 'category', 'featured', 'created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['id', 'downloads', 'created_at', 'updated_at']
    list_editable = ['featured']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'title', 'description')
        }),
        ('Categorization', {
            'fields': ('resource_type', 'category')
        }),
        ('File Information', {
            'fields': ('file_url', 'file_size', 'file_size_bytes', 'image')
        }),
        ('Metrics', {
            'fields': ('downloads',)
        }),
        ('Status', {
            'fields': ('featured',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(UserBookmark)
class UserBookmarkAdmin(admin.ModelAdmin):
    list_display = ['user', 'advisory_content', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'advisory_content__title']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'


@admin.register(UserLike)
class UserLikeAdmin(admin.ModelAdmin):
    list_display = ['user', 'advisory_content', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'advisory_content__title']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'


@admin.register(ConsultationRequest)
class ConsultationRequestAdmin(admin.ModelAdmin):
    list_display = ['user', 'expert', 'subject', 'preferred_date', 'duration_hours', 'total_cost', 'status']
    list_filter = ['status', 'preferred_date', 'created_at']
    search_fields = ['user__username', 'expert__name', 'subject']
    readonly_fields = ['id', 'created_at', 'updated_at']
    list_editable = ['status']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'user', 'expert', 'subject', 'description')
        }),
        ('Scheduling', {
            'fields': ('preferred_date', 'preferred_time', 'duration_hours')
        }),
        ('Financial', {
            'fields': ('total_cost',)
        }),
        ('Status & Notes', {
            'fields': ('status', 'expert_notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
