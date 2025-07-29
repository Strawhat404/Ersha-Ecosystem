from rest_framework import serializers
from .models import Order, OrderItem, Notification
from marketplace.serializers import ProductSerializer
from users.serializers import UserSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total_price = serializers.ReadOnlyField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'unit_price', 'total_price']


class OrderSerializer(serializers.ModelSerializer):
    buyer = UserSerializer(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    items_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'buyer', 'status', 'total_amount', 'delivery_address', 
            'delivery_phone', 'delivery_notes', 'items', 'items_count',
            'created_at', 'updated_at', 'confirmed_at', 'shipped_at', 
            'delivered_at', 'cancelled_at'
        ]
        read_only_fields = [
            'id', 'buyer', 'total_amount', 'created_at', 'updated_at',
            'confirmed_at', 'shipped_at', 'delivered_at', 'cancelled_at'
        ]


class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['delivery_address', 'delivery_phone', 'delivery_notes']
    
    def create(self, validated_data):
        validated_data['buyer'] = self.context['request'].user
        return super().create(validated_data)


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status']
    
    def validate_status(self, value):
        current_status = self.instance.status
        valid_transitions = {
            'pending': ['confirmed', 'cancelled'],
            'confirmed': ['shipped', 'cancelled'],
            'shipped': ['delivered', 'returned'],
            'delivered': ['returned'],
            'cancelled': [],
            'returned': ['refunded'],
            'refunded': []
        }
        
        if value not in valid_transitions.get(current_status, []):
            raise serializers.ValidationError(
                f"Cannot transition from {current_status} to {value}"
            )
        
        return value


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'notification_type', 'title', 'message', 'is_read', 'created_at']
        read_only_fields = ['id', 'created_at']


class NotificationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['is_read'] 