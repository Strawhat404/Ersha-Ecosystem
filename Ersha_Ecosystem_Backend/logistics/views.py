from django.shortcuts import render
from rest_framework import viewsets, filters, status, permissions
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg, Count, Sum
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

from .models import (
    ServiceProvider, Delivery, DeliveryTracking, 
    CostEstimate, LogisticsTransaction, LogisticsAnalytics,
    LogisticsRequest
)
from .serializers import (
    ServiceProviderSerializer, DeliverySerializer, DeliveryTrackingSerializer,
    CostEstimateSerializer, LogisticsTransactionSerializer, LogisticsAnalyticsSerializer,
    DeliveryTrackingUpdateSerializer, CostEstimateRequestSerializer,
    DeliveryStatusUpdateSerializer, ServiceProviderSearchSerializer,
    LogisticsDashboardSerializer, LogisticsRequestSerializer,
    LogisticsRequestCreateSerializer, LogisticsRequestUpdateSerializer
)

class TestServiceProviderView(APIView):
    """Simple test view to check if ServiceProvider works"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            providers = ServiceProvider.objects.filter(verified=True, is_active=True)
            serializer = ServiceProviderSerializer(providers, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class ServiceProviderViewSet(viewsets.ModelViewSet):
    queryset = ServiceProvider.objects.all()
    serializer_class = ServiceProviderSerializer
    permission_classes = [AllowAny]  # Allow anonymous access by default
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['verified', 'is_active', 'specialties', 'coverage_areas']
    search_fields = ['name', 'description', 'specialties', 'coverage_areas']
    ordering_fields = ['rating', 'total_deliveries', 'price_per_km', 'created_at']
    ordering = ['-rating', '-total_deliveries']
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def verify_provider(self, request, pk=None):
        """Admin action to verify a service provider"""
        if not request.user.is_admin:
            return Response({'error': 'Admin access required'}, status=403)
        
        provider = self.get_object()
        provider.verified = True
        provider.save()
        
        return Response({
            'message': f'Service provider "{provider.name}" has been verified',
            'verified': provider.verified
        })
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def deactivate_provider(self, request, pk=None):
        """Admin action to deactivate a service provider"""
        if not request.user.is_admin:
            return Response({'error': 'Admin access required'}, status=403)
        
        provider = self.get_object()
        provider.is_active = False
        provider.save()
        
        return Response({
            'message': f'Service provider "{provider.name}" has been deactivated',
            'is_active': provider.is_active
        })
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def admin_stats(self, request):
        """Get logistics statistics for admin dashboard"""
        if not request.user.is_admin:
            return Response({'error': 'Admin access required'}, status=403)
        
        total_providers = ServiceProvider.objects.count()
        verified_providers = ServiceProvider.objects.filter(verified=True).count()
        active_providers = ServiceProvider.objects.filter(is_active=True).count()
        total_deliveries = Delivery.objects.count()
        completed_deliveries = Delivery.objects.filter(status='delivered').count()
        
        # Provider performance stats
        top_providers = ServiceProvider.objects.filter(is_active=True).order_by('-rating')[:5]
        provider_stats = []
        for provider in top_providers:
            provider_stats.append({
                'name': provider.name,
                'rating': float(provider.rating),
                'total_deliveries': provider.total_deliveries,
                'verified': provider.verified
            })
        
        return Response({
            'total_providers': total_providers,
            'verified_providers': verified_providers,
            'active_providers': active_providers,
            'total_deliveries': total_deliveries,
            'completed_deliveries': completed_deliveries,
            'top_providers': provider_stats
        })
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def verified_providers(self, request):
        """Get only verified service providers"""
        providers = self.get_queryset().filter(verified=True, is_active=True)
        serializer = self.get_serializer(providers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_region(self, request):
        """Get providers by coverage region"""
        region = request.query_params.get('region', '')
        if region:
            providers = self.get_queryset().filter(
                coverage_areas__contains=[region],
                is_active=True
            )
            serializer = self.get_serializer(providers, many=True)
            return Response(serializer.data)
        return Response({'error': 'Region parameter required'}, status=400)
    
    @action(detail=False, methods=['get'])
    def top_performers(self, request):
        """Get top performing providers"""
        providers = self.get_queryset().filter(
            is_active=True
        ).annotate(
            success_rate=Count('deliveries', filter=Q(deliveries__status='delivered')) * 100.0 / Count('deliveries')
        ).order_by('-success_rate')[:5]
        serializer = self.get_serializer(providers, many=True)
        return Response(serializer.data)

class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'provider', 'is_urgent', 'requires_signature']
    search_fields = ['tracking_number', 'order_id', 'product_name', 'origin', 'destination']
    ordering_fields = ['created_at', 'estimated_delivery', 'cost', 'progress_percentage']
    ordering = ['-created_at']
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update delivery status and add tracking event"""
        delivery = self.get_object()
        serializer = DeliveryStatusUpdateSerializer(delivery, data=request.data, partial=True)
        
        if serializer.is_valid():
            old_status = delivery.status
            serializer.save()
            
            # Create tracking event
            DeliveryTracking.objects.create(
                delivery=delivery,
                location=request.data.get('current_location', ''),
                status=request.data.get('status', ''),
                description=f"Status updated from {old_status} to {request.data.get('status', '')}"
            )
            
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    @action(detail=True, methods=['post'])
    def add_tracking_event(self, request, pk=None):
        """Add a new tracking event"""
        delivery = self.get_object()
        serializer = DeliveryTrackingUpdateSerializer(data=request.data)
        
        if serializer.is_valid():
            tracking_event = serializer.save(delivery=delivery)
            return Response(DeliveryTrackingSerializer(tracking_event).data)
        return Response(serializer.errors, status=400)
    
    @action(detail=False, methods=['get'])
    def active_deliveries(self, request):
        """Get all active deliveries"""
        active_statuses = ['pending', 'confirmed', 'picked_up', 'in_transit', 'out_for_delivery']
        deliveries = self.get_queryset().filter(status__in=active_statuses)
        serializer = self.get_serializer(deliveries, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def overdue_deliveries(self, request):
        """Get overdue deliveries"""
        overdue_deliveries = self.get_queryset().filter(
            estimated_delivery__lt=timezone.now(),
            status__in=['pending', 'confirmed', 'picked_up', 'in_transit', 'out_for_delivery']
        )
        serializer = self.get_serializer(overdue_deliveries, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_tracking_number(self, request):
        """Get delivery by tracking number"""
        tracking_number = request.query_params.get('tracking_number', '')
        if tracking_number:
            try:
                delivery = self.get_queryset().get(tracking_number=tracking_number)
                serializer = self.get_serializer(delivery)
                return Response(serializer.data)
            except Delivery.DoesNotExist:
                return Response({'error': 'Delivery not found'}, status=404)
        return Response({'error': 'Tracking number required'}, status=400)

class CostEstimateViewSet(viewsets.ModelViewSet):
    queryset = CostEstimate.objects.all()
    serializer_class = CostEstimateSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['urgency']
    search_fields = ['origin', 'destination']
    ordering_fields = ['total_cost', 'created_at']
    ordering = ['-created_at']
    
    @action(detail=False, methods=['post'])
    def calculate(self, request):
        """Calculate cost estimate"""
        serializer = CostEstimateRequestSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            
            # Calculate distance (simplified - in real app, use geocoding API)
            distance = Decimal('50.0')  # Placeholder
            
            # Calculate costs
            base_cost = Decimal('100.0')
            distance_cost = distance * Decimal('8.5')  # ETB 8.5 per km
            weight_cost = data['weight_kg'] * Decimal('2.0')  # ETB 2 per kg
            
            # Urgency multiplier
            urgency_multipliers = {
                'standard': Decimal('1.0'),
                'express': Decimal('1.5'),
                'same_day': Decimal('2.0')
            }
            urgency_multiplier = urgency_multipliers.get(data['urgency'], Decimal('1.0'))
            
            total_cost = (base_cost + distance_cost + weight_cost) * urgency_multiplier
            
            # Create estimate
            estimate = CostEstimate.objects.create(
                origin=data['origin'],
                destination=data['destination'],
                distance_km=distance,
                weight_kg=data['weight_kg'],
                urgency=data['urgency'],
                base_cost=base_cost,
                distance_cost=distance_cost,
                weight_cost=weight_cost,
                urgency_multiplier=urgency_multiplier,
                total_cost=total_cost,
                estimated_delivery_time=f"{'1-2' if data['urgency'] == 'express' else '2-4'} days"
            )
            
            return Response(CostEstimateSerializer(estimate).data)
        return Response(serializer.errors, status=400)

class LogisticsTransactionViewSet(viewsets.ModelViewSet):
    queryset = LogisticsTransaction.objects.all()
    serializer_class = LogisticsTransactionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['transaction_type', 'status', 'currency']
    search_fields = ['payment_reference', 'delivery__tracking_number']
    ordering_fields = ['amount', 'created_at']
    ordering = ['-created_at']
    
    @action(detail=False, methods=['get'])
    def by_delivery(self, request):
        """Get transactions for a specific delivery"""
        delivery_id = request.query_params.get('delivery_id', '')
        if delivery_id:
            transactions = self.get_queryset().filter(delivery_id=delivery_id)
            serializer = self.get_serializer(transactions, many=True)
            return Response(serializer.data)
        return Response({'error': 'Delivery ID required'}, status=400)

class LogisticsAnalyticsViewSet(viewsets.ModelViewSet):
    queryset = LogisticsAnalytics.objects.all()
    serializer_class = LogisticsAnalyticsSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['date']
    ordering_fields = ['date', 'total_deliveries', 'total_revenue']
    ordering = ['-date']
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get dashboard overview data"""
        today = timezone.now().date()
        last_30_days = today - timedelta(days=30)
        
        # Calculate dashboard metrics
        total_deliveries = Delivery.objects.count()
        active_deliveries = Delivery.objects.filter(
            status__in=['pending', 'confirmed', 'picked_up', 'in_transit', 'out_for_delivery']
        ).count()
        completed_deliveries = Delivery.objects.filter(status='delivered').count()
        pending_deliveries = Delivery.objects.filter(status='pending').count()
        
        # Revenue calculations
        total_revenue = LogisticsTransaction.objects.filter(
            status='completed',
            transaction_type='payment'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.0')
        
        avg_delivery_cost = Delivery.objects.aggregate(avg=Avg('cost'))['avg'] or Decimal('0.0')
        
        # Top providers
        top_providers = ServiceProvider.objects.filter(
            is_active=True
        ).annotate(
            delivery_count=Count('deliveries')
        ).order_by('-delivery_count')[:5]
        
        # Recent deliveries
        recent_deliveries = Delivery.objects.all()[:10]
        
        dashboard_data = {
            'total_deliveries': total_deliveries,
            'active_deliveries': active_deliveries,
            'completed_deliveries': completed_deliveries,
            'pending_deliveries': pending_deliveries,
            'total_revenue': total_revenue,
            'avg_delivery_cost': avg_delivery_cost,
            'top_providers': ServiceProviderSerializer(top_providers, many=True).data,
            'recent_deliveries': DeliverySerializer(recent_deliveries, many=True).data,
        }
        
        return Response(dashboard_data)
    
    @action(detail=False, methods=['get'])
    def performance_metrics(self, request):
        """Get performance metrics"""
        today = timezone.now().date()
        last_30_days = today - timedelta(days=30)
        
        # Delivery success rate
        total_deliveries = Delivery.objects.count()
        successful_deliveries = Delivery.objects.filter(status='delivered').count()
        success_rate = (successful_deliveries / total_deliveries * 100) if total_deliveries > 0 else 0
        
        # Calculate average delivery time in Python
        delivered_orders = Delivery.objects.filter(
            status='delivered',
            actual_delivery__isnull=False
        ).values_list('created_at', 'actual_delivery')
        
        # Calculate time differences in Python
        time_differences = []
        for created, delivered in delivered_orders:
            if created and delivered:
                time_diff = delivered - created
                time_differences.append(time_diff.total_seconds())
        
        # Calculate average in seconds and convert to days
        avg_delivery_time_days = 0
        if time_differences:
            avg_seconds = sum(time_differences) / len(time_differences)
            avg_delivery_time_days = round(avg_seconds / (24 * 3600), 2)  # Convert to days
        
        # Revenue trends
        monthly_revenue = LogisticsTransaction.objects.filter(
            status='completed',
            transaction_type='payment',
            created_at__gte=last_30_days
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.0')
        
        metrics = {
            'success_rate': round(success_rate, 2),
            'avg_delivery_time_days': avg_delivery_time_days,
            'monthly_revenue': monthly_revenue,
            'total_providers': ServiceProvider.objects.filter(is_active=True).count(),
            'active_deliveries': Delivery.objects.filter(
                status__in=['pending', 'confirmed', 'picked_up', 'in_transit', 'out_for_delivery']
            ).count()
        }
        
        return Response(metrics)

class LogisticsRequestViewSet(viewsets.ModelViewSet):
    """ViewSet for handling logistics requests from farmers"""
    serializer_class = LogisticsRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'provider', 'farmer']
    search_fields = ['pickup_location', 'delivery_location']
    ordering_fields = ['requested_at', 'status']
    ordering = ['-requested_at']
    
    def get_queryset(self):
        """Return logistics requests based on user type"""
        user = self.request.user
        
        if user.is_logistics_provider:
            # Logistics providers see requests sent to them
            return LogisticsRequest.objects.filter(provider__user=user)
        elif user.is_farmer:
            # Farmers see their own requests
            return LogisticsRequest.objects.filter(farmer=user)
        else:
            # Admins see all requests
            return LogisticsRequest.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return LogisticsRequestCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return LogisticsRequestUpdateSerializer
        return LogisticsRequestSerializer
    
    def perform_create(self, serializer):
        """Create logistics request and notify provider"""
        request = serializer.save(farmer=self.request.user)
        
        # Create notification for logistics provider
        from orders.models import Notification
        Notification.objects.create(
            user=request.provider.user,
            notification_type='logistics_request',
            title='New Logistics Request',
            message=f'Farmer {request.farmer.get_full_name()} has requested logistics services for Order #{request.order.id}'
        )
        
        return request
    
    @action(detail=True, methods=['post'])
    def accept_request(self, request, pk=None):
        """Accept a logistics request (for providers)"""
        logistics_request = self.get_object()
        
        if not request.user.is_logistics_provider:
            return Response(
                {'error': 'Only logistics providers can accept requests'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        logistics_request.accept_request()
        
        # Notify farmer
        from orders.models import Notification
        Notification.objects.create(
            user=logistics_request.farmer,
            notification_type='logistics_accepted',
            title='Logistics Request Accepted',
            message=f'Your logistics request for Order #{logistics_request.order.id} has been accepted by {logistics_request.provider.name}'
        )
        
        return Response({
            'message': 'Logistics request accepted successfully',
            'status': logistics_request.status
        })
    
    @action(detail=True, methods=['post'])
    def reject_request(self, request, pk=None):
        """Reject a logistics request (for providers)"""
        logistics_request = self.get_object()
        reason = request.data.get('reason', '')
        
        if not request.user.is_logistics_provider:
            return Response(
                {'error': 'Only logistics providers can reject requests'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        logistics_request.reject_request(reason)
        
        # Notify farmer
        from orders.models import Notification
        Notification.objects.create(
            user=logistics_request.farmer,
            notification_type='logistics_rejected',
            title='Logistics Request Rejected',
            message=f'Your logistics request for Order #{logistics_request.order.id} has been rejected by {logistics_request.provider.name}'
        )
        
        return Response({
            'message': 'Logistics request rejected',
            'status': logistics_request.status
        })
    
    @action(detail=True, methods=['post'])
    def complete_request(self, request, pk=None):
        """Complete a logistics request (for providers)"""
        logistics_request = self.get_object()
        
        if not request.user.is_logistics_provider:
            return Response(
                {'error': 'Only logistics providers can complete requests'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        logistics_request.complete_request()
        
        # Notify farmer
        from orders.models import Notification
        Notification.objects.create(
            user=logistics_request.farmer,
            notification_type='logistics_completed',
            title='Logistics Request Completed',
            message=f'Your logistics request for Order #{logistics_request.order.id} has been completed by {logistics_request.provider.name}'
        )
        
        return Response({
            'message': 'Logistics request completed successfully',
            'status': logistics_request.status
        })
    
    @action(detail=False, methods=['get'])
    def farmer_requests(self, request):
        """Get logistics requests for the authenticated farmer"""
        if not request.user.is_farmer:
            return Response(
                {'error': 'Only farmers can access this endpoint'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        requests = self.get_queryset().filter(farmer=request.user)
        serializer = self.get_serializer(requests, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def provider_requests(self, request):
        """Get logistics requests for the authenticated provider"""
        if not request.user.is_logistics_provider:
            return Response(
                {'error': 'Only logistics providers can access this endpoint'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        requests = self.get_queryset().filter(provider__user=request.user)
        serializer = self.get_serializer(requests, many=True)
        return Response(serializer.data)
