from rest_framework import permissions


class IsFarmer(permissions.BasePermission):
    """
    Custom permission to only allow farmers to access.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_farmer


class IsMerchant(permissions.BasePermission):
    """
    Custom permission to only allow merchants to access.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_merchant


class IsBuyer(permissions.BasePermission):
    """
    Custom permission to only allow buyers (merchants) to access.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_merchant


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the object.
        # Check if the object has a user attribute (like Product.farmer)
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'farmer'):
            return obj.farmer == request.user
        elif hasattr(obj, 'buyer'):
            return obj.buyer == request.user
        else:
            return False


class IsProductOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow product owners to edit their products.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.farmer == request.user


class IsOrderOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow order owners to edit their orders.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.buyer == request.user


class IsCartOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow cart owners to edit their cart items.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user 