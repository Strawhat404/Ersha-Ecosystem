import uuid
from django.db import models
from django.utils import timezone
from decimal import Decimal

class ServiceProvider(models.Model):
    """Logistics service providers/companies"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    logo_url = models.URLField(blank=True)
    description = models.TextField(blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    total_deliveries = models.IntegerField(default=0)
    avg_delivery_time = models.CharField(max_length=50, blank=True)  # e.g., "2-3 days"
    price_per_km = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)
    coverage_areas = models.JSONField(default=list, blank=True)  # List of regions covered
    specialties = models.JSONField(default=list, blank=True)  # List of specialties
    verified = models.BooleanField(default=False)
    contact_phone = models.CharField(max_length=20, blank=True)
    contact_email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-rating', '-total_deliveries']
        verbose_name = "Service Provider"
        verbose_name_plural = "Service Providers"

    def __str__(self):
        return self.name

class Delivery(models.Model):
    """Delivery/shipment tracking"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('picked_up', 'Picked Up'),
        ('in_transit', 'In Transit'),
        ('out_for_delivery', 'Out for Delivery'),
        ('delivered', 'Delivered'),
        ('failed', 'Failed'),
        ('returned', 'Returned'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_id = models.CharField(max_length=50, unique=True)
    tracking_number = models.CharField(max_length=50, unique=True)
    
    # Product Information
    product_name = models.CharField(max_length=200)
    product_description = models.TextField(blank=True)
    quantity = models.CharField(max_length=50)  # e.g., "500kg", "100 units"
    weight_kg = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Route Information
    origin = models.CharField(max_length=200)
    destination = models.CharField(max_length=200)
    distance_km = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    
    # Delivery Details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    progress_percentage = models.IntegerField(default=0)
    current_location = models.CharField(max_length=200, blank=True)
    estimated_delivery = models.DateTimeField(null=True, blank=True)
    actual_delivery = models.DateTimeField(null=True, blank=True)
    
    # Provider Information
    provider = models.ForeignKey(ServiceProvider, on_delete=models.CASCADE, related_name='deliveries')
    
    # Cost Information
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    currency = models.CharField(max_length=3, default='ETB')
    
    # Customer Information
    customer_name = models.CharField(max_length=200, blank=True)
    customer_phone = models.CharField(max_length=20, blank=True)
    customer_email = models.EmailField(blank=True)
    
    # Additional Information
    special_instructions = models.TextField(blank=True)
    is_urgent = models.BooleanField(default=False)
    requires_signature = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Delivery"
        verbose_name_plural = "Deliveries"

    def __str__(self):
        return f"{self.tracking_number} - {self.product_name}"

class DeliveryTracking(models.Model):
    """Tracking events for deliveries"""
    delivery = models.ForeignKey(Delivery, on_delete=models.CASCADE, related_name='tracking_events')
    location = models.CharField(max_length=200)
    status = models.CharField(max_length=50)
    description = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.delivery.tracking_number} - {self.status} at {self.location}"

class CostEstimate(models.Model):
    """Freight cost estimates"""
    URGENCY_CHOICES = [
        ('standard', 'Standard'),
        ('express', 'Express'),
        ('same_day', 'Same Day'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    origin = models.CharField(max_length=200)
    destination = models.CharField(max_length=200)
    distance_km = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    weight_kg = models.DecimalField(max_digits=10, decimal_places=2)
    urgency = models.CharField(max_length=20, choices=URGENCY_CHOICES, default='standard')
    
    # Calculated costs
    base_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    distance_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    weight_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    urgency_multiplier = models.DecimalField(max_digits=4, decimal_places=2, default=1.0)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    
    # Delivery time estimates
    estimated_delivery_time = models.CharField(max_length=50, blank=True)
    
    # Recommended providers
    recommended_providers = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Estimate: {self.origin} to {self.destination} - ETB {self.total_cost}"

class LogisticsTransaction(models.Model):
    """Payment transactions for logistics services"""
    TRANSACTION_TYPES = [
        ('payment', 'Payment'),
        ('refund', 'Refund'),
        ('fee', 'Service Fee'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    delivery = models.ForeignKey(Delivery, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='ETB')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Payment method
    payment_method = models.CharField(max_length=50, blank=True)
    payment_reference = models.CharField(max_length=100, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.transaction_type} - ETB {self.amount} - {self.status}"

class LogisticsAnalytics(models.Model):
    """Analytics data for logistics performance"""
    date = models.DateField()
    total_deliveries = models.IntegerField(default=0)
    completed_deliveries = models.IntegerField(default=0)
    failed_deliveries = models.IntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    avg_delivery_time = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    customer_satisfaction = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    
    # Provider performance
    top_providers = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-date']
        unique_together = ['date']

    def __str__(self):
        return f"Analytics for {self.date} - {self.total_deliveries} deliveries"
