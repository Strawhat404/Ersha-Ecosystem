from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SalesAnalyticsViewSet, CreditScoreViewSet, LoanOfferViewSet,
    MonthlyReportViewSet, ProductPerformanceViewSet,
    SalesTargetViewSet, PaymentAnalysisViewSet, ExportRequestViewSet
)

router = DefaultRouter()
router.register(r'sales', SalesAnalyticsViewSet, basename='sales-analytics')
router.register(r'credit-scores', CreditScoreViewSet, basename='credit-scores')
router.register(r'loan-offers', LoanOfferViewSet, basename='loan-offers')
router.register(r'monthly-reports', MonthlyReportViewSet, basename='monthly-reports')
router.register(r'product-performance', ProductPerformanceViewSet, basename='product-performance')
router.register(r'sales-targets', SalesTargetViewSet, basename='sales-targets')
router.register(r'payment-analysis', PaymentAnalysisViewSet, basename='payment-analysis')
router.register(r'export-requests', ExportRequestViewSet, basename='export-requests')

urlpatterns = [
    path('', include(router.urls)),
] 