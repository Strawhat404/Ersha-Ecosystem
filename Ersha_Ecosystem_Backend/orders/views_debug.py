from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import get_user_model
from orders.models import Order, Notification
import logging

logger = logging.getLogger(__name__)

class DebugRecentActivitiesView(APIView):
    """Debug view to check recent activities"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        try:
            # Get the authenticated user
            user = request.user
            
            if not user.is_authenticated:
                return Response(
                    {'error': 'Authentication required'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            logger.info(f"Debugging recent activities for user: {user.email} (is_farmer: {getattr(user, 'is_farmer', False)})")
            
            # Get recent orders for this farmer's products
            recent_orders = Order.objects.filter(
                items__product__farmer=user
            ).distinct().order_by('-created_at')[:10]
            
            logger.info(f"Found {recent_orders.count()} recent orders")
            
            # Get recent notifications
            recent_notifications = Notification.objects.filter(
                user=user
            ).order_by('-created_at')[:20]
            
            logger.info(f"Found {recent_notifications.count()} recent notifications")
            
            # Combine and sort activities
            activities = []
            
            # Add order activities
            for order in recent_orders:
                # Get product names for the order
                product_names = [item.product.name for item in order.items.filter(product__farmer=user)]
                product_list = ", ".join(product_names[:3])
                if len(product_names) > 3:
                    product_list += f" and {len(product_names) - 3} more"
                    
                activity = {
                    'id': f'order_{order.id}',
                    'type': 'order',
                    'title': f'New Order #{order.id}',
                    'description': f'Order received for {product_list or "your products"}',
                    'timestamp': order.created_at.isoformat(),
                    'status': order.status,
                    'amount': float(order.total_amount),
                    'order_id': order.id,
                    'notification_type': 'order_status',
                    'logistics_provider': str(order.logistics_provider.id) if order.logistics_provider else None,
                    'delivery_address': order.delivery_address,
                    'total_weight': sum(float(item.quantity) for item in order.items.filter(product__farmer=user))
                }
                activities.append(activity)
                logger.info(f"Added order activity: {activity['title']}")
            
            # Add notification activities
            for notification in recent_notifications:
                activity = {
                    'id': f'notification_{notification.id}',
                    'type': 'notification',
                    'title': notification.title,
                    'description': notification.message,
                    'timestamp': notification.created_at.isoformat(),
                    'status': 'unread' if not notification.is_read else 'read',
                    'notification_id': notification.id,
                    'notification_type': notification.notification_type,
                    'logistics_provider': notification.metadata.get('logistics_provider') if notification.metadata else None,
                    'delivery_address': notification.metadata.get('delivery_address') if notification.metadata else None,
                    'total_weight': notification.metadata.get('quantity') if notification.metadata else None
                }
                activities.append(activity)
                logger.info(f"Added notification activity: {notification.title}")
            
            # Sort by timestamp (most recent first)
            activities.sort(key=lambda x: x['timestamp'], reverse=True)
            
            # Filter out any potential duplicates and limit to 20 items
            seen = set()
            unique_activities = []
            
            for activity in activities:
                # Create a unique key for each activity
                if activity['type'] == 'order':
                    key = f"order_{activity['order_id']}"
                else:
                    key = f"notification_{activity['notification_id']}"
                    
                if key not in seen:
                    seen.add(key)
                    unique_activities.append(activity)
                    
                    # Stop once we have 20 unique activities
                    if len(unique_activities) >= 20:
                        break
            
            logger.info(f"Returning {len(unique_activities)} unique activities")
            
            return Response({
                'activities': unique_activities,
                'total_count': len(unique_activities),
                'debug_info': {
                    'user_email': user.email,
                    'is_farmer': getattr(user, 'is_farmer', False),
                    'user_type': getattr(user, 'user_type', None),
                    'orders_count': recent_orders.count(),
                    'notifications_count': recent_notifications.count()
                }
            })
            
        except Exception as e:
            logger.error(f"Error in debug_recent_activities: {str(e)}", exc_info=True)
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
