from django.db import models
from django.core.validators import MinValueValidator, FileExtensionValidator
from users.models import User


class Product(models.Model):
    class UnitChoices(models.TextChoices):
        KG = 'kg', 'Kilogram'
        TON = 'ton', 'Ton'
        QUINTAL = 'quintal', 'Quintal'
        LITER = 'liter', 'Liter'
        PIECE = 'piece', 'Piece'
        BUNDLE = 'bundle', 'Bundle'
    
    class CategoryChoices(models.TextChoices):
        VEGETABLES = 'vegetables', 'Vegetables'
        FRUITS = 'fruits', 'Fruits'
        GRAINS = 'grains', 'Grains & Cereals'
        DAIRY = 'dairy', 'Dairy Products'
        COFFEE = 'coffee', 'Coffee & Tea'
        SPICES = 'spices', 'Spices & Herbs'
        LEGUMES = 'legumes', 'Legumes'
        TUBERS = 'tubers', 'Tubers & Roots'
        OTHER = 'other', 'Other'
    
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    quantity = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    unit = models.CharField(max_length=20, choices=UnitChoices.choices, default=UnitChoices.KG)
    category = models.CharField(max_length=20, choices=CategoryChoices.choices, default=CategoryChoices.OTHER)
    harvest_date = models.DateField()
    organic = models.BooleanField(default=False)
    image = models.ImageField(
        upload_to='product_images/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])]
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.farmer.email}"
    
    @property
    def available_quantity(self):
        """Calculate available quantity by subtracting ordered quantities"""
        from orders.models import OrderItem
        ordered_quantity = OrderItem.objects.filter(
            product=self,
            order__status__in=['pending', 'confirmed', 'shipped']
        ).aggregate(total=models.Sum('quantity'))['total'] or 0
        return self.quantity - ordered_quantity


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'product']
        ordering = ['-added_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.product.name} ({self.quantity} {self.product.unit})"
    
    @property
    def total_price(self):
        return self.quantity * self.product.price
