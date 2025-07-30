from django.contrib import admin
from .models import NewsArticle

@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author', 'featured', 'published_at', 'views')
    list_filter = ('category', 'featured', 'published_at')
    search_fields = ('title', 'excerpt', 'content', 'author', 'tags')
    ordering = ('-published_at',)
