from django.contrib import admin
from .models import Order, OrderItem, Notification


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('total_price',)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'buyer', 'status', 'total_amount', 'items_count', 'created_at')
    list_filter = ('status', 'created_at', 'buyer__user_type')
    search_fields = ('buyer__email', 'buyer__first_name', 'buyer__last_name', 'delivery_address')
    readonly_fields = ('created_at', 'updated_at', 'confirmed_at', 'shipped_at', 'delivered_at', 'cancelled_at')
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('buyer', 'status', 'total_amount')
        }),
        ('Delivery Information', {
            'fields': ('delivery_address', 'delivery_phone', 'delivery_notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'confirmed_at', 'shipped_at', 'delivered_at', 'cancelled_at'),
            'classes': ('collapse',)
        }),
    )
    
    def items_count(self, obj):
        return obj.items_count
    items_count.short_description = 'Items Count'


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'unit_price', 'total_price')
    list_filter = ('product__unit', 'order__status')
    search_fields = ('order__buyer__email', 'product__name')
    readonly_fields = ('total_price',)


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'notification_type', 'title', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read', 'created_at', 'user__user_type')
    search_fields = ('user__email', 'title', 'message')
    list_editable = ('is_read',)
    readonly_fields = ('created_at',)
