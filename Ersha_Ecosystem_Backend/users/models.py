from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import FileExtensionValidator


class User(AbstractUser):
    class UserType(models.TextChoices):
        FARMER = 'farmer', 'Farmer'
        MERCHANT = 'merchant', 'Merchant'
        ADMIN = 'admin', 'Admin'
    
    # Override email to make it unique
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    region = models.CharField(max_length=100, blank=True, null=True)
    fayda_id = models.CharField(max_length=50, unique=True, blank=True, null=True)
    user_type = models.CharField(
        max_length=20,
        choices=UserType.choices,
        default=UserType.FARMER
    )
    
    # Override username field to use email
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email
    
    @property
    def is_farmer(self):
        return self.user_type == self.UserType.FARMER
    
    @property
    def is_merchant(self):
        return self.user_type == self.UserType.MERCHANT
    
    @property
    def is_admin(self):
        return self.user_type == self.UserType.ADMIN


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    farm_size = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    farm_size_unit = models.CharField(max_length=20, blank=True, null=True)  # hectares, acres, etc.
    woreda = models.CharField(max_length=100, blank=True, null=True)
    kebele = models.CharField(max_length=100, blank=True, null=True)
    business_license = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.email} - Profile"
    
    @property
    def full_location(self):
        location_parts = []
        if self.user.region:
            location_parts.append(self.user.region)
        if self.woreda:
            location_parts.append(self.woreda)
        if self.kebele:
            location_parts.append(self.kebele)
        return ', '.join(location_parts) if location_parts else 'Location not specified'
