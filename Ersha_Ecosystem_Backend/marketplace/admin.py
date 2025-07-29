from django.contrib import admin
from .models import Product, Cart


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'farmer', 'price', 'quantity', 'unit', 'organic', 'is_active', 'created_at')
    list_filter = ('organic', 'is_active', 'unit', 'harvest_date', 'farmer__user_type')
    search_fields = ('name', 'description', 'farmer__email', 'farmer__first_name', 'farmer__last_name')
    list_editable = ('is_active', 'price', 'quantity')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('farmer', 'name', 'description', 'image')
        }),
        ('Pricing & Quantity', {
            'fields': ('price', 'quantity', 'unit')
        }),
        ('Product Details', {
            'fields': ('harvest_date', 'organic', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'quantity', 'total_price', 'added_at')
    list_filter = ('added_at', 'product__unit', 'user__user_type')
    search_fields = ('user__email', 'product__name')
    readonly_fields = ('added_at', 'updated_at', 'total_price')
    
    def total_price(self, obj):
        return obj.total_price
    total_price.short_description = 'Total Price'
