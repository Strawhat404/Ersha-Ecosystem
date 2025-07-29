from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters import rest_framework as filters
from django.db.models import Q

from .models import Product, Cart
from .serializers import (
    ProductSerializer, ProductCreateSerializer,
    CartSerializer, CartCreateSerializer, CartUpdateSerializer
)
from core.permissions import IsFarmer, IsProductOwnerOrReadOnly, IsCartOwnerOrReadOnly


class ProductFilter(filters.FilterSet):
    min_price = filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = filters.NumberFilter(field_name="price", lookup_expr='lte')
    organic = filters.BooleanFilter()
    farmer = filters.NumberFilter(field_name="farmer__id")
    region = filters.CharFilter(field_name="farmer__region", lookup_expr='icontains')
    
    class Meta:
        model = Product
        fields = ['organic', 'unit', 'farmer', 'region']


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsProductOwnerOrReadOnly]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'farmer__first_name', 'farmer__last_name']
    ordering_fields = ['price', 'created_at', 'harvest_date']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ProductCreateSerializer
        return ProductSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by search query
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(farmer__first_name__icontains=search) |
                Q(farmer__last_name__icontains=search)
            )
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def my_products(self, request):
        """Get products created by the authenticated farmer"""
        if not request.user.is_farmer:
            return Response(
                {'error': 'Only farmers can access this endpoint'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        products = self.get_queryset().filter(farmer=request.user)
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated, IsCartOwnerOrReadOnly]
    
    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CartCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return CartUpdateSerializer
        return CartSerializer
    
    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Add item to cart"""
        serializer = CartCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            cart_item = serializer.save()
            return Response(
                CartSerializer(cart_item).data, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get cart summary with total items and total price"""
        cart_items = self.get_queryset()
        total_items = cart_items.count()
        total_price = sum(item.total_price for item in cart_items)
        
        return Response({
            'total_items': total_items,
            'total_price': total_price,
            'items': CartSerializer(cart_items, many=True).data
        })
    
    @action(detail=False, methods=['delete'])
    def clear(self, request):
        """Clear all items from cart"""
        self.get_queryset().delete()
        return Response({'message': 'Cart cleared successfully'})
    
    @action(detail=True, methods=['post'])
    def update_quantity(self, request, pk=None):
        """Update quantity of a specific cart item"""
        cart_item = self.get_object()
        quantity = request.data.get('quantity')
        
        if not quantity or float(quantity) <= 0:
            return Response(
                {'error': 'Valid quantity is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = CartUpdateSerializer(cart_item, data={'quantity': quantity}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(CartSerializer(cart_item).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
