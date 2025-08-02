import logging
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Profile

logger = logging.getLogger(__name__)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 'phone', 
            'region', 'fayda_id', 'user_type', 'verification_status', 
            'verified_at', 'is_verified'
        ]
        read_only_fields = ['id', 'fayda_id', 'verification_status', 'verified_at', 'is_verified']
        extra_kwargs = {
            'email': {'help_text': 'User email address (must be unique)'},
            'username': {'help_text': 'Username for the account'},
            'first_name': {'help_text': 'User first name'},
            'last_name': {'help_text': 'User last name'},
            'phone': {'help_text': 'Phone number (optional)'},
            'region': {'help_text': 'User region/location'},
            'user_type': {'help_text': 'Type of user: farmer, buyer, expert, logistics, or admin'},
        }


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    full_location = serializers.ReadOnlyField()
    
    class Meta:
        model = Profile
        fields = [
            'id', 'user', 'farm_size', 'farm_size_unit', 'woreda', 'kebele',
            'business_license_number', 'business_license', 'bio', 'profile_picture', 
            'full_location', 'created_at', 'updated_at', 'area_of_expertise', 
            'certificate_of_expertise', 'coverage_areas', 'deliveries_count', 'rating'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'farm_size': {'help_text': 'Size of the farm in decimal format (required for farmers)'},
            'farm_size_unit': {'help_text': 'Unit of farm size (e.g., hectares, acres)'},
            'business_license_number': {'help_text': 'Company registration number (required for logistics companies)'},
            'woreda': {'help_text': 'Woreda (district) name'},
            'kebele': {'help_text': 'Kebele (sub-district) name'},
            'business_license': {'help_text': 'Business license number (for merchants) - deprecated'},
            'bio': {'help_text': 'User biography or description'},
            'profile_picture': {'help_text': 'Profile picture image file'},
            'area_of_expertise': {'help_text': 'Area of expertise (required for experts)'},
            'certificate_of_expertise': {'help_text': 'Certificate of expertise file'},
            'coverage_areas': {'help_text': 'List of service coverage areas for logistics companies'},
            'deliveries_count': {'help_text': 'Total number of deliveries completed'},
            'rating': {'help_text': 'Average rating (0.00 to 5.00)'},
        }


class UserProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 'phone', 
            'region', 'fayda_id', 'user_type', 'verification_status', 
            'verified_at', 'is_verified', 'profile'
        ]
        read_only_fields = ['id', 'fayda_id', 'verification_status', 'verified_at', 'is_verified']
        extra_kwargs = {
            'email': {'help_text': 'User email address'},
            'username': {'help_text': 'Username for the account'},
            'first_name': {'help_text': 'User first name'},
            'last_name': {'help_text': 'User last name'},
            'phone': {'help_text': 'Phone number'},
            'region': {'help_text': 'User region/location'},
            'user_type': {'help_text': 'Type of user: farmer, buyer, expert, logistics, or admin'},
        }


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        min_length=8,
        help_text="Password must be at least 8 characters long"
    )
    password_confirm = serializers.CharField(
        write_only=True,
        help_text="Confirm password (must match password field)"
    )
    
    # Profile fields for different user types
    farm_size = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        required=False, 
        allow_null=True,
        help_text="Size of the farm in decimal format (required for farmers)"
    )
    farm_size_unit = serializers.CharField(
        max_length=20, 
        required=False, 
        allow_null=True,
        allow_blank=True,
        help_text="Unit of farm size (e.g., hectares, acres)"
    )
    business_license_number = serializers.CharField(
        max_length=100, 
        required=False, 
        allow_null=True,
        allow_blank=True,
        help_text="Company registration number (required for logistics companies)"
    )
    
    # Expert-specific fields
    area_of_expertise = serializers.CharField(
        max_length=200,
        required=False,
        allow_null=True,
        allow_blank=True,
        help_text="Area of expertise (required for experts)"
    )
    certificate_of_expertise = serializers.FileField(
        required=False,
        allow_null=True,
        help_text="Certificate of expertise (PDF, JPG, JPEG, PNG only)"
    )
    
    # Logistics-specific fields
    coverage_areas = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        allow_null=True,
        help_text="List of coverage areas for logistics services"
    )
    
    class Meta:
        model = User
        fields = [
            'email', 'username', 'first_name', 'last_name', 'password', 
            'password_confirm', 'phone', 'region', 'user_type', 'farm_size',
            'farm_size_unit', 'business_license_number', 'area_of_expertise',
            'certificate_of_expertise', 'coverage_areas'
        ]
        extra_kwargs = {
            'email': {
                'help_text': 'Email address (will be used as login username)'
            },
            'username': {
                'help_text': 'Username for the account'
            },
            'first_name': {
                'help_text': 'User first name (or company name for logistics)'
            },
            'last_name': {
                'help_text': 'User last name (or contact person for logistics)'
            },
            'phone': {
                'help_text': 'Phone number (optional)'
            },
            'region': {
                'help_text': 'User region/location'
            },
            'user_type': {
                'help_text': 'Type of user: farmer, buyer, expert, logistics company, or admin'
            },
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        
        user_type = attrs.get('user_type')
        
        # Validate required fields based on user type
        if user_type == User.UserType.FARMER:
            farm_size = attrs.get('farm_size')
            if farm_size is None or farm_size == '':
                raise serializers.ValidationError({
                    'farm_size': 'Farm size is required for farmers'
                })
        
        elif user_type == User.UserType.LOGISTICS:
            business_license_number = attrs.get('business_license_number')
            if business_license_number is None or business_license_number == '':
                raise serializers.ValidationError({
                    'business_license_number': 'Company registration number is required for logistics companies'
                })
        
        elif user_type == User.UserType.EXPERT:
            area_of_expertise = attrs.get('area_of_expertise')
            if area_of_expertise is None or area_of_expertise == '':
                raise serializers.ValidationError({
                    'area_of_expertise': 'Area of expertise is required for experts'
                })
        
        return attrs
    
    def create(self, validated_data):
        # Extract profile-specific data
        farm_size = validated_data.pop('farm_size', None)
        farm_size_unit = validated_data.pop('farm_size_unit', None)
        business_license_number = validated_data.pop('business_license_number', None)
        area_of_expertise = validated_data.pop('area_of_expertise', None)
        certificate_of_expertise = validated_data.pop('certificate_of_expertise', None)
        coverage_areas = validated_data.pop('coverage_areas', None)
        
        # Remove password confirmation
        validated_data.pop('password_confirm')
        
        logger.info(f"Creating user with data: {validated_data}")
        logger.info(f"Profile data - farm_size: {farm_size}, farm_size_unit: {farm_size_unit}, business_license_number: {business_license_number}")
        logger.info(f"Expert data - area_of_expertise: {area_of_expertise}, certificate_of_expertise: {certificate_of_expertise}")
        logger.info(f"Logistics data - coverage_areas: {coverage_areas}")
        
        try:
            # Create user
            user = User.objects.create_user(**validated_data)
            logger.info(f"User created successfully with ID: {user.id}, user_type: {user.user_type}")
            
            # Create profile directly with all the data
            profile_data = {
                'user': user,
            }
            
            # Only add fields that have actual values (not None or empty strings)
            if farm_size is not None and farm_size != '':
                profile_data['farm_size'] = farm_size
            if farm_size_unit is not None and farm_size_unit != '':
                profile_data['farm_size_unit'] = farm_size_unit
            if business_license_number is not None and business_license_number != '':
                profile_data['business_license_number'] = business_license_number
            if area_of_expertise is not None and area_of_expertise != '':
                profile_data['area_of_expertise'] = area_of_expertise
            if certificate_of_expertise is not None:
                profile_data['certificate_of_expertise'] = certificate_of_expertise
            if coverage_areas is not None:
                profile_data['coverage_areas'] = coverage_areas
            
            logger.info(f"Creating profile with data: {profile_data}")
            
            # Create profile without triggering validation
            profile = Profile(**profile_data)
            profile.save(skip_validation=True)
            logger.info(f"Profile created successfully with ID: {profile.id}")
            
            # Now validate the profile to ensure all required fields are set
            logger.info("About to validate profile")
            try:
                profile.clean()
                logger.info("Profile validation passed")
            except Exception as e:
                logger.error(f"Profile validation failed: {e}")
                # Delete the user if profile validation fails
                user.delete()
                raise serializers.ValidationError(str(e))
            
            return user
            
        except Exception as e:
            logger.error(f"Error in create method: {e}")
            raise


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(
        help_text="Email address used for registration"
    )
    password = serializers.CharField(
        help_text="User password"
    )
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            # Try to get user by email first
            try:
                user = User.objects.get(email=email)
                # Check password manually since Django's authenticate expects username
                if user.check_password(password):
                    if not user.is_active:
                        raise serializers.ValidationError('User account is disabled')
                    attrs['user'] = user
                else:
                    raise serializers.ValidationError('Invalid email or password')
            except User.DoesNotExist:
                raise serializers.ValidationError('Invalid email or password')
        else:
            raise serializers.ValidationError('Must include email and password')
        
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(
        required=True,
        help_text="Current password"
    )
    new_password = serializers.CharField(
        required=True, 
        min_length=8,
        help_text="New password (must be at least 8 characters long)"
    )
    new_password_confirm = serializers.CharField(
        required=True,
        help_text="Confirm new password (must match new_password field)"
    )
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match")
        return attrs
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Old password is incorrect')
        return value


class FaydaVerificationSerializer(serializers.Serializer):
    """Serializer for Fayda verification response"""
    fayda_id = serializers.CharField(help_text="Fayda national ID number")
    name = serializers.CharField(help_text="Full name from Fayda")
    given_name = serializers.CharField(help_text="First name from Fayda")
    family_name = serializers.CharField(help_text="Last name from Fayda")
    email = serializers.EmailField(help_text="Email from Fayda")
    phone_number = serializers.CharField(help_text="Phone number from Fayda")
    birthdate = serializers.CharField(help_text="Date of birth from Fayda")
    gender = serializers.CharField(help_text="Gender from Fayda")
    region = serializers.CharField(help_text="Region from Fayda")
    verified_at = serializers.DateTimeField(help_text="Verification timestamp")


class VerificationStatusSerializer(serializers.Serializer):
    """Serializer for verification status"""
    verification_status = serializers.CharField(help_text="Current verification status")
    is_verified = serializers.BooleanField(help_text="Whether user is verified")
    verified_at = serializers.DateTimeField(help_text="When user was verified", allow_null=True)
    fayda_id = serializers.CharField(help_text="Linked Fayda ID", allow_null=True) 