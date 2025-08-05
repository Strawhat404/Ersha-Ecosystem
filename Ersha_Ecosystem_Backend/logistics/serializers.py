from rest_framework import serializers
from .models import (
    ServiceProvider, Delivery, DeliveryTracking, 
    CostEstimate, LogisticsTransaction, LogisticsAnalytics,
    LogisticsRequest, LogisticsNotification, LogisticsOrder
)
from django.utils import timezone

class ServiceProviderSerializer(serializers.ModelSerializer):
    delivery_count = serializers.SerializerMethodField()
    success_rate = serializers.SerializerMethodField()
    
    class Meta:
        model = ServiceProvider
        fields = '__all__'
    
    def get_delivery_count(self, obj):
        return obj.deliveries.count()
    
    def get_success_rate(self, obj):
        total_deliveries = obj.deliveries.count()
        if total_deliveries == 0:
            return 0.0
        completed_deliveries = obj.deliveries.filter(status='delivered').count()
        return round((completed_deliveries / total_deliveries) * 100, 2)

class DeliveryTrackingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryTracking
        fields = '__all__'

class DeliverySerializer(serializers.ModelSerializer):
    provider_details = ServiceProviderSerializer(source='provider', read_only=True)
    tracking_events = DeliveryTrackingSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    days_in_transit = serializers.SerializerMethodField()
    is_overdue = serializers.SerializerMethodField()
    
    class Meta:
        model = Delivery
        fields = '__all__'
    
    def get_days_in_transit(self, obj):
        if obj.actual_delivery:
            return (obj.actual_delivery - obj.created_at).days
        elif obj.estimated_delivery:
            return (obj.estimated_delivery - obj.created_at).days
        return None
    
    def get_is_overdue(self, obj):
        if obj.estimated_delivery and obj.status not in ['delivered', 'failed', 'cancelled']:
            return timezone.now() > obj.estimated_delivery
        return False

class CostEstimateSerializer(serializers.ModelSerializer):
    urgency_display = serializers.CharField(source='get_urgency_display', read_only=True)
    provider_options = serializers.SerializerMethodField()
    
    class Meta:
        model = CostEstimate
        fields = '__all__'
    
    def get_provider_options(self, obj):
        # Get providers that cover the route
        providers = ServiceProvider.objects.filter(
            is_active=True,
            coverage_areas__contains=[obj.origin.split(',')[0].strip()]  # Simple matching
        )[:3]
        return ServiceProviderSerializer(providers, many=True).data

class LogisticsTransactionSerializer(serializers.ModelSerializer):
    transaction_type_display = serializers.CharField(source='get_transaction_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    delivery_details = DeliverySerializer(source='delivery', read_only=True)
    
    class Meta:
        model = LogisticsTransaction
        fields = '__all__'

class LogisticsAnalyticsSerializer(serializers.ModelSerializer):
    success_rate = serializers.SerializerMethodField()
    revenue_per_delivery = serializers.SerializerMethodField()
    
    class Meta:
        model = LogisticsAnalytics
        fields = '__all__'
    
    def get_success_rate(self, obj):
        if obj.total_deliveries == 0:
            return 0.0
        return round((obj.completed_deliveries / obj.total_deliveries) * 100, 2)
    
    def get_revenue_per_delivery(self, obj):
        if obj.total_deliveries == 0:
            return 0.0
        return round(obj.total_revenue / obj.total_deliveries, 2)

# Specialized serializers for specific use cases
class DeliveryTrackingUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating delivery tracking"""
    class Meta:
        model = DeliveryTracking
        fields = ['location', 'status', 'description']

class CostEstimateRequestSerializer(serializers.Serializer):
    """Serializer for cost estimation requests"""
    origin = serializers.CharField(max_length=200)
    destination = serializers.CharField(max_length=200)
    weight_kg = serializers.DecimalField(max_digits=10, decimal_places=2)
    urgency = serializers.ChoiceField(choices=CostEstimate.URGENCY_CHOICES, default='standard')
    special_requirements = serializers.CharField(required=False, allow_blank=True)

class DeliveryStatusUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating delivery status"""
    class Meta:
        model = Delivery
        fields = ['status', 'progress_percentage', 'current_location']

class ServiceProviderSearchSerializer(serializers.ModelSerializer):
    """Serializer for provider search results"""
    delivery_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ServiceProvider
        fields = ['id', 'name', 'logo_url', 'rating', 'avg_delivery_time', 
                 'price_per_km', 'coverage_areas', 'specialties', 'verified',
                 'delivery_count']
    
    def get_delivery_count(self, obj):
        return obj.deliveries.count()

class LogisticsDashboardSerializer(serializers.Serializer):
    """Serializer for dashboard overview data"""
    total_deliveries = serializers.IntegerField()
    active_deliveries = serializers.IntegerField()
    completed_deliveries = serializers.IntegerField()
    pending_deliveries = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    avg_delivery_cost = serializers.DecimalField(max_digits=10, decimal_places=2)
    top_providers = ServiceProviderSerializer(many=True)
    recent_deliveries = DeliverySerializer(many=True) 

class LogisticsRequestSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.get_full_name', read_only=True)
    farmer_email = serializers.CharField(source='farmer.email', read_only=True)
    provider_name = serializers.CharField(source='provider.name', read_only=True)
    order_id = serializers.CharField(source='order.id', read_only=True)
    
    class Meta:
        model = LogisticsRequest
        fields = '__all__'
        read_only_fields = ['farmer', 'status', 'requested_at', 'accepted_at', 'completed_at']

class LogisticsRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogisticsRequest
        fields = [
            'order', 'provider', 'pickup_location', 'pickup_latitude', 'pickup_longitude',
            'delivery_location', 'delivery_latitude', 'delivery_longitude',
            'product_details', 'total_weight', 'special_instructions'
        ]

class LogisticsRequestUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogisticsRequest
        fields = ['status', 'provider_notes', 'rejection_reason', 'actual_cost'] 


class LogisticsNotificationSerializer(serializers.ModelSerializer):
    """Serializer for logistics notifications"""
    request_details = LogisticsRequestSerializer(source='logistics_request', read_only=True)
    
    class Meta:
        model = LogisticsNotification
        fields = [
            'id', 'notification_type', 'title', 'message', 'is_read', 
            'metadata', 'created_at', 'read_at', 'request_details'
        ]
        read_only_fields = ['id', 'created_at', 'read_at']


class LogisticsOrderSerializer(serializers.ModelSerializer):
    """Serializer for logistics orders"""
    farmer_name = serializers.ReadOnlyField()
    buyer_name = serializers.ReadOnlyField()
    status_display = serializers.ReadOnlyField()
    order_number = serializers.ReadOnlyField()
    
    class Meta:
        model = LogisticsOrder
        fields = [
            'id', 'order', 'logistics_request', 'provider', 'farmer', 'buyer',
            'product_name', 'product_description', 'quantity', 'weight_kg',
            'pickup_location', 'delivery_location', 'distance_km',
            'tracking_status', 'current_location', 'estimated_delivery', 'actual_delivery',
            'accepted_at', 'on_the_way_at', 'picked_product_at', 'on_delivery_at', 'delivered_at',
            'cost', 'currency', 'special_instructions', 'provider_notes',
            'is_urgent', 'requires_signature', 'created_at', 'updated_at',
            'farmer_name', 'buyer_name', 'status_display', 'order_number'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'farmer_name', 'buyer_name', 
            'status_display', 'order_number'
        ]


class LogisticsOrderCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating logistics orders"""
    
    class Meta:
        model = LogisticsOrder
        fields = [
            'order', 'logistics_request', 'provider', 'farmer', 'buyer',
            'product_name', 'product_description', 'quantity', 'weight_kg',
            'pickup_location', 'delivery_location', 'distance_km',
            'cost', 'currency', 'special_instructions', 'is_urgent', 'requires_signature'
        ]


class LogisticsOrderUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating logistics orders"""
    
    class Meta:
        model = LogisticsOrder
        fields = [
            'tracking_status', 'current_location', 'estimated_delivery', 'actual_delivery',
            'cost', 'provider_notes', 'is_urgent', 'requires_signature'
        ] 