from rest_framework import permissions
from users.models import User


class IsVerifiedUser(permissions.BasePermission):
    """
    Permission class to check if user is verified with Fayda.
    Required for accessing restricted services like loans, financial transactions, etc.
    """
    
    message = "Fayda verification is required to access this service. Please verify your identity first."
    
    def has_permission(self, request, view):
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if user is verified
        return request.user.is_verified
    
    def has_object_permission(self, request, view, obj):
        # For object-level permissions, also check if user is verified
        return request.user.is_verified


class IsVerifiedUserOrReadOnly(permissions.BasePermission):
    """
    Permission class that allows read access to all users but requires verification for write operations.
    """
    
    message = "Fayda verification is required to perform this action. Please verify your identity first."
    
    def has_permission(self, request, view):
        # Allow read operations for all authenticated users
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        
        # Require verification for write operations
        return request.user.is_authenticated and request.user.is_verified
    
    def has_object_permission(self, request, view, obj):
        # Allow read operations for all authenticated users
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        
        # Require verification for write operations
        return request.user.is_verified


class IsVerifiedUserForFinancial(permissions.BasePermission):
    """
    Permission class specifically for financial transactions and loan services.
    """
    
    message = "Fayda verification is required for financial transactions and loan services. Please verify your identity first."
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # For financial services, require verification
        return request.user.is_verified
    
    def has_object_permission(self, request, view, obj):
        return request.user.is_verified


class IsVerifiedUserForMarketplace(permissions.BasePermission):
    """
    Permission class for marketplace buying and selling activities.
    """
    
    message = "Fayda verification is required for marketplace transactions. Please verify your identity first."
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # For marketplace transactions, require verification
        return request.user.is_verified
    
    def has_object_permission(self, request, view, obj):
        return request.user.is_verified


class IsVerifiedUserForPayments(permissions.BasePermission):
    """
    Permission class for payment-related activities.
    """
    
    message = "Fayda verification is required for payment activities. Please verify your identity first."
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # For payment activities, require verification
        return request.user.is_verified
    
    def has_object_permission(self, request, view, obj):
        return request.user.is_verified


def get_verification_required_message(service_type="this service"):
    """
    Helper function to get standardized verification required messages.
    """
    return f"Fayda verification is required for {service_type}. Please verify your identity first."


def check_verification_status(user):
    """
    Helper function to check user verification status and return appropriate response.
    """
    if not user.is_authenticated:
        return {
            'verified': False,
            'message': 'Authentication required',
            'verification_status': 'not_authenticated'
        }
    
    if not user.is_verified:
        return {
            'verified': False,
            'message': 'Fayda verification required',
            'verification_status': user.verification_status,
            'verification_url': '/api/users/fayda/auth-url/'
        }
    
    return {
        'verified': True,
        'message': 'User is verified',
        'verification_status': user.verification_status,
        'verified_at': user.verified_at
    } 