from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PaymentMethodViewSet, EscrowAccountViewSet, TransactionViewSet,
    PaymentViewSet, PayoutRequestViewSet, PaymentAnalyticsViewSet,
    PaymentProcessingViewSet
)
from . import webhooks

router = DefaultRouter()
router.register(r'payment-methods', PaymentMethodViewSet)
router.register(r'escrow-accounts', EscrowAccountViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'payout-requests', PayoutRequestViewSet)
router.register(r'analytics', PaymentAnalyticsViewSet)
router.register(r'processing', PaymentProcessingViewSet, basename='processing')

urlpatterns = [
    path('', include(router.urls)),
    # Webhook endpoints
    path('webhooks/mpesa/', webhooks.mpesa_callback, name='mpesa_webhook'),
    path('webhooks/chapa/', webhooks.chapa_callback, name='chapa_webhook'),
    path('webhooks/verify/', webhooks.verify_payment, name='verify_payment'),
] 