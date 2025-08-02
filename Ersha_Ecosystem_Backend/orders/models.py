from django.db import models
from django.core.validators import MinValueValidator
from users.models import User
from marketplace.models import Product


class Order(models.Model):
    class OrderStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        SHIPPED = 'shipped', 'Shipped'
        DELIVERED = 'delivered', 'Delivered'
        CANCELLED = 'cancelled', 'Cancelled'
        RETURNED = 'returned', 'Returned'
        REFUNDED = 'refunded', 'Refunded'
    
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(
        max_length=20,
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING
    )
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    
    # Delivery details
    delivery_address = models.TextField()
    delivery_phone = models.CharField(max_length=15)
    delivery_notes = models.TextField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    confirmed_at = models.DateTimeField(blank=True, null=True)
    shipped_at = models.DateTimeField(blank=True, null=True)
    delivered_at = models.DateTimeField(blank=True, null=True)
    cancelled_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order #{self.id} - {self.buyer.email} - {self.status}"
    
    @property
    def items_count(self):
        return self.items.count()
    
    def update_status(self, new_status):
        """Update order status and set appropriate timestamp"""
        self.status = new_status
        if new_status == self.OrderStatus.CONFIRMED:
            self.confirmed_at = models.timezone.now()
        elif new_status == self.OrderStatus.SHIPPED:
            self.shipped_at = models.timezone.now()
        elif new_status == self.OrderStatus.DELIVERED:
            self.delivered_at = models.timezone.now()
        elif new_status == self.OrderStatus.CANCELLED:
            self.cancelled_at = models.timezone.now()
        self.save()


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    
    def __str__(self):
        return f"{self.order.id} - {self.product.name} ({self.quantity} {self.product.unit})"
    
    @property
    def total_price(self):
        return self.quantity * self.unit_price


class Notification(models.Model):
    class NotificationType(models.TextChoices):
        ORDER_STATUS = 'order_status', 'Order Status Update'
        PRODUCT_UPDATE = 'product_update', 'Product Update'
        CART_ADDED = 'cart_added', 'Product Added to Cart'
        SYSTEM = 'system', 'System Notification'
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NotificationType.choices)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.title}"
