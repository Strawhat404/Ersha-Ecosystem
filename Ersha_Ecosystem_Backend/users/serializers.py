from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Profile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'phone', 'region', 'fayda_id', 'user_type']
        read_only_fields = ['id', 'fayda_id']
        extra_kwargs = {
            'email': {'help_text': 'User email address (must be unique)'},
            'username': {'help_text': 'Username for the account'},
            'first_name': {'help_text': 'User first name'},
            'last_name': {'help_text': 'User last name'},
            'phone': {'help_text': 'Phone number (optional)'},
            'region': {'help_text': 'User region/location'},
            'user_type': {'help_text': 'Type of user: farmer, merchant, or admin'},
        }


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    full_location = serializers.ReadOnlyField()
    
    class Meta:
        model = Profile
        fields = [
            'id', 'user', 'farm_size', 'farm_size_unit', 'woreda', 'kebele',
            'business_license', 'bio', 'profile_picture', 'full_location',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'farm_size': {'help_text': 'Size of the farm in decimal format'},
            'farm_size_unit': {'help_text': 'Unit of farm size (e.g., hectares, acres)'},
            'woreda': {'help_text': 'Woreda (district) name'},
            'kebele': {'help_text': 'Kebele (sub-district) name'},
            'business_license': {'help_text': 'Business license number (for merchants)'},
            'bio': {'help_text': 'User biography or description'},
            'profile_picture': {'help_text': 'Profile picture image file'},
        }


class UserProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 'phone', 
            'region', 'fayda_id', 'user_type', 'profile'
        ]
        read_only_fields = ['id', 'fayda_id']
        extra_kwargs = {
            'email': {'help_text': 'User email address'},
            'username': {'help_text': 'Username for the account'},
            'first_name': {'help_text': 'User first name'},
            'last_name': {'help_text': 'User last name'},
            'phone': {'help_text': 'Phone number'},
            'region': {'help_text': 'User region/location'},
            'user_type': {'help_text': 'Type of user: farmer, merchant, or admin'},
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
    
    class Meta:
        model = User
        fields = [
            'email', 'username', 'first_name', 'last_name', 'password', 
            'password_confirm', 'phone', 'region', 'user_type'
        ]
        extra_kwargs = {
            'email': {
                'help_text': 'Email address (will be used as login username)'
            },
            'username': {
                'help_text': 'Username for the account'
            },
            'first_name': {
                'help_text': 'User first name'
            },
            'last_name': {
                'help_text': 'User last name'
            },
            'phone': {
                'help_text': 'Phone number (optional)'
            },
            'region': {
                'help_text': 'User region/location'
            },
            'user_type': {
                'help_text': 'Type of user: farmer, merchant, or admin'
            },
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
    
        return user


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
            user = authenticate(request=self.context.get('request'), email=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid email or password')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
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