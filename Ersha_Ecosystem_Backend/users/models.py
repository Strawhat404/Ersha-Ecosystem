import logging
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError

logger = logging.getLogger(__name__)


class User(AbstractUser):
    class UserType(models.TextChoices):
        FARMER = 'farmer', 'Farmer'
        BUYER = 'buyer', 'Buyer/Merchant'
        AGRICULTURAL_BUSINESS = 'agricultural_business', 'Agricultural Business'
        ADMIN = 'admin', 'Admin'
    
    class VerificationStatus(models.TextChoices):
        NOT_VERIFIED = 'not_verified', 'Not Verified'
        VERIFIED = 'verified', 'Verified'
        PENDING = 'pending', 'Pending Verification'
        FAILED = 'failed', 'Verification Failed'
    
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
        max_length=25,
        choices=UserType.choices,
        default=UserType.FARMER,
        help_text="Type of user account"
    )
    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.NOT_VERIFIED,
        help_text="User verification status with Fayda"
    )
    verified_at = models.DateTimeField(
        blank=True, 
        null=True,
        help_text="Timestamp when user was verified"
    )
    fayda_verification_data = models.JSONField(
        blank=True, 
        null=True,
        help_text="Stored Fayda verification data (name, DOB, etc.)"
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
    def is_buyer(self):
        return self.user_type == self.UserType.BUYER
    
    @property
    def is_agricultural_business(self):
        return self.user_type == self.UserType.AGRICULTURAL_BUSINESS
    
    @property
    def is_merchant(self):
        return self.user_type in [self.UserType.BUYER, self.UserType.AGRICULTURAL_BUSINESS]
    
    @property
    def is_admin(self):
        return self.user_type == self.UserType.ADMIN
    
    @property
    def is_verified(self):
        return self.verification_status == self.VerificationStatus.VERIFIED
    
    def mark_as_verified(self, fayda_data=None):
        """Mark user as verified and store Fayda data"""
        from django.utils import timezone
        self.verification_status = self.VerificationStatus.VERIFIED
        self.verified_at = timezone.now()
        if fayda_data:
            self.fayda_verification_data = fayda_data
        self.save()


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
        help_text="Size of the farm in decimal format (required for farmers)"
    )
    farm_size_unit = models.CharField(
        max_length=20, 
        blank=True, 
        null=True,
        help_text="Unit of farm size (e.g., hectares, acres)"
    )
    business_license_number = models.CharField(
        max_length=100, 
        blank=True, 
        null=True,
        help_text="Business license number (required for agricultural businesses)"
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
        help_text="Business license number (for merchants) - deprecated, use business_license_number"
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
    
    def clean(self):
        """Validate profile data based on user type"""
        from django.core.exceptions import ValidationError
        
        logger.info(f"Profile clean() called for user {self.user.id}, user_type: {self.user.user_type}")
        logger.info(f"Farm size: {self.farm_size}, Business license: {self.business_license_number}")
        
        if self.user.user_type == User.UserType.FARMER and not self.farm_size:
            logger.error("Validation failed: Farm size is required for farmers")
            raise ValidationError("Farm size is required for farmers")
        
        if self.user.user_type == User.UserType.AGRICULTURAL_BUSINESS and not self.business_license_number:
            logger.error("Validation failed: Business license number is required for agricultural businesses")
            raise ValidationError("Business license number is required for agricultural businesses")
    
    def save(self, *args, **kwargs):
        # Skip validation if this is an update operation with specific fields or skip_validation is True
        skip_validation = kwargs.pop('skip_validation', False)
        
        if skip_validation or kwargs.get('update_fields'):
            logger.info(f"Skipping validation - skip_validation: {skip_validation}, update_fields: {kwargs.get('update_fields')}")
            super().save(*args, **kwargs)
        else:
            self.clean()
            super().save(*args, **kwargs)


class PKCESession(models.Model):
    """Model to store PKCE session data for Fayda OIDC flow"""
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='pkce_sessions',
        help_text="User associated with this PKCE session"
    )
    state = models.CharField(
        max_length=128,
        unique=True,
        help_text="State parameter for CSRF protection"
    )
    code_verifier = models.CharField(
        max_length=128,
        help_text="PKCE code verifier"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(help_text="When this session expires")
    
    class Meta:
        db_table = 'users_pkce_session'
        indexes = [
            models.Index(fields=['state']),
            models.Index(fields=['user', 'created_at']),
        ]
    
    def __str__(self):
        return f"PKCE Session for {self.user.email} - {self.state[:10]}..."
    
    @property
    def is_expired(self):
        """Check if the session has expired"""
        from django.utils import timezone
        return timezone.now() > self.expires_at
    
    @classmethod
    def cleanup_expired(cls):
        """Remove expired PKCE sessions"""
        from django.utils import timezone
        cls.objects.filter(expires_at__lt=timezone.now()).delete()
