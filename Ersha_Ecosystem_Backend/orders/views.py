from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db import transaction
from django_filters import rest_framework as filters
import uuid
from decimal import Decimal
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Order, OrderItem, Notification
from .serializers import (
    OrderSerializer, OrderCreateSerializer, OrderStatusUpdateSerializer,
    NotificationSerializer, NotificationUpdateSerializer
)
from marketplace.models import Cart
from core.permissions import IsOrderOwnerOrReadOnly
from payments.services.processor import PaymentProcessor


class OrderFilter(filters.FilterSet):
    status = filters.CharFilter()
    min_total = filters.NumberFilter(field_name="total_amount", lookup_expr='gte')
    max_total = filters.NumberFilter(field_name="total_amount", lookup_expr='lte')
    created_after = filters.DateFilter(field_name="created_at", lookup_expr='gte')
    created_before = filters.DateFilter(field_name="created_at", lookup_expr='lte')
    
    class Meta:
        model = Order
        fields = ['status']


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsOrderOwnerOrReadOnly]
    filterset_class = OrderFilter
    ordering_fields = ['created_at', 'total_amount', 'status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Order.objects.filter(buyer=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        elif self.action in ['update_status']:
            return OrderStatusUpdateSerializer
        return OrderSerializer
    
    def create(self, request, *args, **kwargs):
        """Create a new order"""
        try:
            with transaction.atomic():
                # Extract data from request
                items_data = request.data.get('items', [])
                delivery_address = request.data.get('delivery_address', {})
                customer_info = request.data.get('customer_info', {})
                total_amount = Decimal(request.data.get('total_amount', 0))
                
                # Validate required data
                if not items_data:
                    return Response(
                        {'error': 'No items provided'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                if not delivery_address.get('address') or not delivery_address.get('city') or not delivery_address.get('region'):
                    return Response(
                        {'error': 'Complete delivery address is required'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                if not customer_info.get('email') or not customer_info.get('phone'):
                    return Response(
                        {'error': 'Customer email and phone are required'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Create order
                order_data = {
                    'buyer': request.user,
                    'delivery_address': f"{delivery_address.get('address')}, {delivery_address.get('city')}, {delivery_address.get('region')}",
                    'delivery_phone': customer_info.get('phone'),
                    'delivery_notes': delivery_address.get('delivery_instructions', ''),
                    'total_amount': total_amount,
                    'status': 'pending_payment'
                }
                
                order = Order.objects.create(**order_data)
                
                # Create order items
                for item_data in items_data:
                    from marketplace.models import Product
                    try:
                        product = Product.objects.get(id=item_data['product_id'])
                        OrderItem.objects.create(
                            order=order,
                            product=product,
                            quantity=Decimal(item_data['quantity']),
                            unit_price=Decimal(item_data['price'])
                        )
                    except Product.DoesNotExist:
                        raise Exception(f"Product with id {item_data['product_id']} not found")
                
                # Create notification for farmers
                for item in order.items.all():
                    Notification.objects.create(
                        user=item.product.farmer,
                        notification_type='order_status',
                        title='New Order Received',
                        message=f'You have received a new order for {item.quantity} {item.product.unit} of {item.product.name}'
                    )
                
                return Response({
                    'success': True,
                    'order_id': order.id,
                    'message': 'Order created successfully'
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['post'])
    def create_from_cart(self, request):
        """Create order from cart items"""
        cart_items = Cart.objects.filter(user=request.user)
        
        if not cart_items.exists():
            return Response(
                {'error': 'Cart is empty'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate delivery information
        delivery_address = request.data.get('delivery_address')
        delivery_phone = request.data.get('delivery_phone')
        delivery_notes = request.data.get('delivery_notes', '')
        
        if not delivery_address or not delivery_phone:
            return Response(
                {'error': 'Delivery address and phone are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            with transaction.atomic():
                # Create order
                order_data = {
                    'buyer': request.user,
                    'delivery_address': delivery_address,
                    'delivery_phone': delivery_phone,
                    'delivery_notes': delivery_notes,
                    'total_amount': 0
                }
                
                order = Order.objects.create(**order_data)
                total_amount = 0
                
                # Create order items from cart
                for cart_item in cart_items:
                    # Check if product is still available
                    if cart_item.quantity > cart_item.product.available_quantity:
                        raise Exception(f"Insufficient quantity for {cart_item.product.name}")
                    
                    # Create order item
                    OrderItem.objects.create(
                        order=order,
                        product=cart_item.product,
                        quantity=cart_item.quantity,
                        unit_price=cart_item.product.price
                    )
                    
                    total_amount += cart_item.total_price
                
                # Update order total
                order.total_amount = total_amount
                order.save()
                
                # Clear cart
                cart_items.delete()
                
                # Create notification for farmers
                for item in order.items.all():
                    Notification.objects.create(
                        user=item.product.farmer,
                        notification_type='order_status',
                        title='New Order Received',
                        message=f'You have received a new order for {item.quantity} {item.product.unit} of {item.product.name}'
                    )
                
                return Response(
                    OrderSerializer(order).data, 
                    status=status.HTTP_201_CREATED
                )
                
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['post'])
    async def create_with_payment(self, request):
        """Create order with payment integration"""
        try:
            with transaction.atomic():
                # Extract data from request
                items_data = request.data.get('items', [])
                delivery_address = request.data.get('delivery_address', {})
                customer_info = request.data.get('customer_info', {})
                total_amount = Decimal(request.data.get('total_amount', 0))
                payment_provider = request.data.get('payment_provider', 'chapa')
                
                # Validate required data
                if not items_data:
                    return Response(
                        {'error': 'No items provided'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                if not delivery_address.get('address') or not delivery_address.get('city') or not delivery_address.get('region'):
                    return Response(
                        {'error': 'Complete delivery address is required'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                if not customer_info.get('email') or not customer_info.get('phone'):
                    return Response(
                        {'error': 'Customer email and phone are required'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Create order
                order_data = {
                    'buyer': request.user,
                    'delivery_address': f"{delivery_address.get('address')}, {delivery_address.get('city')}, {delivery_address.get('region')}",
                    'delivery_phone': customer_info.get('phone'),
                    'delivery_notes': delivery_address.get('delivery_instructions', ''),
                    'total_amount': total_amount,
                    'status': 'pending_payment'
                }
                
                order = Order.objects.create(**order_data)
                
                # Create order items
                for item_data in items_data:
                    from marketplace.models import Product
                    try:
                        product = Product.objects.get(id=item_data['product_id'])
                        OrderItem.objects.create(
                            order=order,
                            product=product,
                            quantity=Decimal(item_data['quantity']),
                            unit_price=Decimal(item_data['price'])
                        )
                    except Product.DoesNotExist:
                        raise Exception(f"Product with id {item_data['product_id']} not found")
                
                # Generate unique reference for payment
                payment_reference = f"order_{order.id}_{uuid.uuid4().hex[:8]}"
                
                # Prepare payment data
                payment_data = {
                    'amount': float(total_amount),
                    'currency': 'ETB',
                    'phone_number': customer_info.get('phone'),
                    'reference': payment_reference,
                    'description': f'Payment for Order #{order.id}',
                    'provider': payment_provider
                }
                
                # Initialize payment processor
                payment_processor = PaymentProcessor()
                
                # Process payment
                payment_result = await payment_processor.process_payment(payment_data)
                
                if payment_result['success']:
                    # Update order with payment reference
                    order.payment_reference = payment_reference
                    order.save()
                    
                    # Clear cart if items came from cart
                    Cart.objects.filter(user=request.user).delete()
                    
                    # Create notification for farmers
                    for item in order.items.all():
                        Notification.objects.create(
                            user=item.product.farmer,
                            notification_type='order_status',
                            title='New Order Received',
                            message=f'You have received a new order for {item.quantity} {item.product.unit} of {item.product.name}'
                        )
                    
                    return Response({
                        'order_id': order.id,
                        'payment_url': payment_result.get('checkout_url'),
                        'transaction_id': payment_result.get('transaction_id'),
                        'message': 'Order created and payment initiated successfully'
                    }, status=status.HTTP_201_CREATED)
                else:
                    # If payment fails, delete the order
                    order.delete()
                    return Response({
                        'error': payment_result.get('error', 'Payment initiation failed')
                    }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update order status (for farmers)"""
        order = self.get_object()
        
        # Check if user is the farmer of any product in the order
        is_farmer = order.items.filter(product__farmer=request.user).exists()
        if not is_farmer:
            return Response(
                {'error': 'Only farmers can update order status'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = OrderStatusUpdateSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            old_status = order.status
            new_status = serializer.validated_data['status']
            
            # Update status
            order.update_status(new_status)
            
            # Create notification for buyer
            Notification.objects.create(
                user=order.buyer,
                notification_type='order_status',
                title='Order Status Updated',
                message=f'Your order #{order.id} status has been updated to {new_status}'
            )
            
            return Response(OrderSerializer(order).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        """Get orders for the authenticated user"""
        orders = self.get_queryset()
        page = self.paginate_queryset(orders)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def farmer_orders(self, request):
        """Get orders for products sold by the authenticated farmer"""
        if not request.user.is_farmer:
            return Response(
                {'error': 'Only farmers can access this endpoint'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        orders = Order.objects.filter(items__product__farmer=request.user).distinct()
        page = self.paginate_queryset(orders)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    ordering_fields = ['created_at', 'is_read']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['patch'])
    def mark_read(self, request, pk=None):
        """Mark notification as read"""
        notification = self.get_object()
        serializer = NotificationUpdateSerializer(notification, data={'is_read': True}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        self.get_queryset().update(is_read=True)
        return Response({'message': 'All notifications marked as read'})
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications"""
        count = self.get_queryset().filter(is_read=False).count()
        return Response({'unread_count': count})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def share_farmer_info(request):
    """
    API endpoint for farmers to share their location and contact information
    after receiving cart notifications
    """
    try:
        notification_id = request.data.get('notification_id')
        location_data = request.data.get('location_data', {})
        
        # Validate notification exists and belongs to the farmer
        notification = get_object_or_404(
            Notification, 
            id=notification_id, 
            user=request.user,
            notification_type=Notification.NotificationType.CART_ADDED
        )
        
        # Extract buyer information from notification message
        # This is a simplified approach - in production, you might want to store buyer_id in notification
        message = notification.message
        
        # Create a farmer info sharing record (you might want to create a model for this)
        farmer_info = {
            'farmer_id': request.user.id,
            'farmer_name': f"{request.user.first_name} {request.user.last_name}",
            'farmer_email': request.user.email,
            'address': location_data.get('address', ''),
            'phone': location_data.get('phone', ''),
            'notes': location_data.get('notes', ''),
            'available_time': location_data.get('availableTime', ''),
            'coordinates': location_data.get('coordinates'),
            'shared_at': timezone.now().isoformat()
        }
        
        # In a real implementation, you might:
        # 1. Save this info to a FarmerContactInfo model
        # 2. Send notification to the buyer
        # 3. Create a communication channel between farmer and buyer
        
        # For now, we'll just mark the notification as handled and return success
        notification.is_read = True
        notification.save()
        
        # TODO: Implement buyer notification about farmer's shared info
        # This could involve creating a new notification for the buyer
        # or sending an email/SMS with the farmer's contact details
        
        return Response({
            'message': 'Farmer information shared successfully',
            'farmer_info': farmer_info
        }, status=status.HTTP_200_OK)
        
    except Notification.DoesNotExist:
        return Response({
            'error': 'Notification not found or does not belong to you'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': f'Failed to share farmer information: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
