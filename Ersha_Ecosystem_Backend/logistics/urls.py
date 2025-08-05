from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ServiceProviderViewSet, DeliveryViewSet, CostEstimateViewSet,
    LogisticsTransactionViewSet, LogisticsAnalyticsViewSet,
    LogisticsRequestViewSet, LogisticsNotificationViewSet, LogisticsOrderViewSet,
    TestServiceProviderView
)

router = DefaultRouter()
router.register(r'providers', ServiceProviderViewSet)
router.register(r'deliveries', DeliveryViewSet)
router.register(r'estimates', CostEstimateViewSet)
router.register(r'transactions', LogisticsTransactionViewSet)
router.register(r'analytics', LogisticsAnalyticsViewSet)
router.register(r'requests', LogisticsRequestViewSet, basename='logistics-request')
router.register(r'notifications', LogisticsNotificationViewSet, basename='logistics-notification')
router.register(r'orders', LogisticsOrderViewSet, basename='logistics-order')

urlpatterns = [
    path('', include(router.urls)),
    path('verified-providers/', TestServiceProviderView.as_view(), name='verified-providers'),
] 