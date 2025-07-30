from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import FileExtensionValidator


class User(AbstractUser):
    class UserType(models.TextChoices):
        FARMER = 'farmer', 'Farmer'
        MERCHANT = 'merchant', 'Merchant'
        ADMIN = 'admin', 'Admin'
    
    # Override email to make it unique
    email = models.EmailField(
        unique=True,
        help_text="User email address (used as login username)"
    )
    phone = models.CharField(
        max_length=15, 
        blank=True, 
        null=True,
        help_text="User phone number"
    )
    region = models.CharField(
        max_length=100, 
        blank=True, 
        null=True,
        help_text="User region or location"
    )
    fayda_id = models.CharField(
        max_length=50, 
        unique=True, 
        blank=True, 
        null=True,
        help_text="Fayda national ID number"
    )
    user_type = models.CharField(
        max_length=20,
        choices=UserType.choices,
        default=UserType.FARMER,
        help_text="Type of user account"
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
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='profile',
        help_text="Associated user account"
    )
    farm_size = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        blank=True, 
        null=True,
        help_text="Size of the farm in decimal format"
    )
    farm_size_unit = models.CharField(
        max_length=20, 
        blank=True, 
        null=True,
        help_text="Unit of farm size (e.g., hectares, acres)"
    )
    woreda = models.CharField(
        max_length=100, 
        blank=True, 
        null=True,
        help_text="Woreda (district) name"
    )
    kebele = models.CharField(
        max_length=100, 
        blank=True, 
        null=True,
        help_text="Kebele (sub-district) name"
    )
    business_license = models.CharField(
        max_length=100, 
        blank=True, 
        null=True,
        help_text="Business license number (for merchants)"
    )
    bio = models.TextField(
        blank=True, 
        null=True,
        help_text="User biography or description"
    )
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])],
        help_text="Profile picture image file (JPG, JPEG, PNG only)"
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
