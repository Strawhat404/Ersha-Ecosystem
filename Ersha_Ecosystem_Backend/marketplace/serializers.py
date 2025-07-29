from rest_framework import serializers
from .models import Product, Cart
from users.serializers import UserSerializer


class ProductSerializer(serializers.ModelSerializer):
    farmer = UserSerializer(read_only=True)
    available_quantity = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'farmer', 'name', 'description', 'price', 'quantity', 
            'unit', 'harvest_date', 'organic', 'image', 'is_active',
            'available_quantity', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'farmer', 'created_at', 'updated_at']


class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'name', 'description', 'price', 'quantity', 'unit', 
            'harvest_date', 'organic', 'image'
        ]
    
    def create(self, validated_data):
        validated_data['farmer'] = self.context['request'].user
        return super().create(validated_data)


class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total_price = serializers.ReadOnlyField()
    
    class Meta:
        model = Cart
        fields = ['id', 'product', 'quantity', 'total_price', 'added_at', 'updated_at']
        read_only_fields = ['id', 'added_at', 'updated_at']


class CartCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ['product', 'quantity']
    
    def validate(self, attrs):
        product = attrs['product']
        quantity = attrs['quantity']
        
        # Check if product is active
        if not product.is_active:
            raise serializers.ValidationError("This product is not available")
        
        # Check if farmer is not buying their own product
        if product.farmer == self.context['request'].user:
            raise serializers.ValidationError("You cannot add your own product to cart")
        
        # Check if quantity is available
        if quantity > product.available_quantity:
            raise serializers.ValidationError(f"Only {product.available_quantity} {product.unit} available")
        
        return attrs
    
    def create(self, validated_data):
        user = self.context['request'].user
        product = validated_data['product']
        quantity = validated_data['quantity']
        
        # Check if item already exists in cart
        cart_item, created = Cart.objects.get_or_create(
            user=user,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            # Update quantity if item already exists
            cart_item.quantity = quantity
            cart_item.save()
        
        return cart_item


class CartUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ['quantity']
    
    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0")
        
        # Check if quantity is available
        product = self.instance.product
        if value > product.available_quantity:
            raise serializers.ValidationError(f"Only {product.available_quantity} {product.unit} available")
        
        return value 