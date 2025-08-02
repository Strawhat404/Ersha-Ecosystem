from django.shortcuts import render
from rest_framework import viewsets, filters, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import NewsArticle
from .serializers import NewsArticleSerializer
from django.db import models

# Create your views here.

class NewsArticleViewSet(viewsets.ModelViewSet):
    queryset = NewsArticle.objects.all()
    serializer_class = NewsArticleSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'featured']
    search_fields = ['title', 'excerpt', 'content', 'tags', 'author', 'source']
    ordering_fields = ['published_at', 'views', 'created_at']
    ordering = ['-published_at']
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def approve(self, request, pk=None):
        """Admin action to approve a news article"""
        if not request.user.is_admin:
            return Response({'error': 'Admin access required'}, status=403)
        
        article = self.get_object()
        article.verified = True
        article.save()
        
        return Response({
            'message': f'News article "{article.title}" has been approved',
            'verified': article.verified
        })
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def feature(self, request, pk=None):
        """Admin action to feature/unfeature a news article"""
        if not request.user.is_admin:
            return Response({'error': 'Admin access required'}, status=403)
        
        article = self.get_object()
        article.featured = not article.featured
        article.save()
        
        status_text = 'featured' if article.featured else 'unfeatured'
        return Response({
            'message': f'News article "{article.title}" has been {status_text}',
            'featured': article.featured
        })
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def admin_stats(self, request):
        """Get news statistics for admin dashboard"""
        if not request.user.is_admin:
            return Response({'error': 'Admin access required'}, status=403)
        
        total_articles = NewsArticle.objects.count()
        featured_articles = NewsArticle.objects.filter(featured=True).count()
        verified_articles = NewsArticle.objects.filter(verified=True).count()
        total_views = NewsArticle.objects.aggregate(total_views=models.Sum('views'))['total_views'] or 0
        
        # Articles by category
        category_stats = NewsArticle.objects.values('category').annotate(
            count=models.Count('id'),
            total_views=models.Sum('views')
        )
        
        return Response({
            'total_articles': total_articles,
            'featured_articles': featured_articles,
            'verified_articles': verified_articles,
            'total_views': total_views,
            'category_stats': category_stats
        })
