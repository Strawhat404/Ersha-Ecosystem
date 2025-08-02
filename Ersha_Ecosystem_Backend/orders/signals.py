from django.db.models.signals import post_save
from django.dispatch import receiver
from marketplace.models import Cart
from .models import Notification


@receiver(post_save, sender=Cart)
def create_cart_notification(sender, instance, created, **kwargs):
    """
    Create a notification for the farmer when their product is added to cart
    """
    if created:  # Only when a new cart item is created
        # Get the farmer who owns the product
        farmer = instance.product.farmer
        buyer = instance.user
        
        # Don't create notification if farmer is adding their own product to cart
        if farmer != buyer:
            # Create notification for the farmer
            Notification.objects.create(
                user=farmer,
                notification_type=Notification.NotificationType.CART_ADDED,
                title=f"Your {instance.product.name} was added to cart!",
                message=f"{buyer.first_name} {buyer.last_name} ({buyer.email}) added {instance.quantity} {instance.product.unit} of your {instance.product.name} to their cart. They may be interested in purchasing soon!",
                is_read=False
            )
