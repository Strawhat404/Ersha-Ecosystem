from django.db.models.signals import post_save
from django.dispatch import receiver
from marketplace.models import Cart
from .models import Notification
from .websocket_utils import send_notification_to_farmer
from datetime import datetime
import json


@receiver(post_save, sender=Cart)
def create_cart_notification(sender, instance, created, **kwargs):
    """
    Create a notification for the farmer when their product is added to cart
    and send real-time WebSocket notification
    """
    if created:  # Only when a new cart item is created
        # Get the farmer who owns the product
        farmer = instance.product.farmer
        buyer = instance.user
        
        # Don't create notification if farmer is adding their own product to cart
        if farmer != buyer:
            # Create notification data
            notification_data = {
                'id': None,  # Will be set after saving
                'notification_type': 'CART_ADDED',
                'title': f"Your {instance.product.name} was added to cart!",
                'message': f"{buyer.first_name} {buyer.last_name} added {instance.quantity} {instance.product.unit} of your {instance.product.name} to their cart.",
                'is_read': False,
                'created_at': datetime.now().isoformat(),
                'metadata': {
                    'product_id': str(instance.product.id),
                    'product_name': instance.product.name,
                    'buyer_id': str(buyer.id),
                    'buyer_name': f"{buyer.first_name} {buyer.last_name}",
                    'quantity': instance.quantity,
                    'unit': instance.product.unit,
                    'cart_id': str(instance.id)
                }
            }
            
            # Create notification in database
            notification = Notification.objects.create(
                user=farmer,
                notification_type=Notification.NotificationType.CART_ADDED,
                title=notification_data['title'],
                message=notification_data['message'],
                is_read=False,
                metadata=notification_data['metadata']
            )
            
            # Update notification ID in the data
            notification_data['id'] = str(notification.id)
            notification_data['created_at'] = notification.created_at.isoformat()
            
            try:
                # Send real-time notification via WebSocket
                send_notification_to_farmer(
                    farmer_id=farmer.id,
                    notification_data=notification_data
                )
            except Exception as e:
                # Don't fail the request if WebSocket fails
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Failed to send WebSocket notification: {str(e)}", exc_info=True)
