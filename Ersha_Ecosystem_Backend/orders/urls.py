from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views_debug import DebugRecentActivitiesView

# Create a single router for all viewsets
router = DefaultRouter()
router.register(r'orders', views.OrderViewSet, basename='order')
router.register(r'notifications', views.NotificationViewSet, basename='notification')

urlpatterns = [
    # Include all router URLs
    path('', include(router.urls)),
    
    # Additional routes
    path('share-farmer-info/', views.share_farmer_info, name='share-farmer-info'),
    path('recent-activities/', views.recent_activities_view, name='recent-activities'),
    
    # Debug routes (temporary - will remove after fixing router)
    path('debug/recent-activities/', DebugRecentActivitiesView.as_view(), name='debug-recent-activities'),
] 