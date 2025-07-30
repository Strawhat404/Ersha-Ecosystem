from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ServiceProviderViewSet, DeliveryViewSet, CostEstimateViewSet,
    LogisticsTransactionViewSet, LogisticsAnalyticsViewSet
)

router = DefaultRouter()
router.register(r'providers', ServiceProviderViewSet)
router.register(r'deliveries', DeliveryViewSet)
router.register(r'estimates', CostEstimateViewSet)
router.register(r'transactions', LogisticsTransactionViewSet)
router.register(r'analytics', LogisticsAnalyticsViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 