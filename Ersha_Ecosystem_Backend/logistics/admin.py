from django.contrib import admin
from .models import (
    ServiceProvider, Delivery, DeliveryTracking, 
    CostEstimate, LogisticsTransaction, LogisticsAnalytics
)

@admin.register(ServiceProvider)
class ServiceProviderAdmin(admin.ModelAdmin):
    list_display = ['name', 'rating', 'total_deliveries', 'price_per_km', 'verified', 'is_active']
    list_filter = ['verified', 'is_active', 'specialties', 'coverage_areas']
    search_fields = ['name', 'description', 'contact_phone', 'contact_email']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['-rating', '-total_deliveries']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'name', 'logo_url', 'description')
        }),
        ('Performance Metrics', {
            'fields': ('rating', 'total_deliveries', 'avg_delivery_time', 'price_per_km')
        }),
        ('Coverage & Specialties', {
            'fields': ('coverage_areas', 'specialties')
        }),
        ('Contact Information', {
            'fields': ('contact_phone', 'contact_email', 'address')
        }),
        ('Status', {
            'fields': ('verified', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    list_per_page = 25

@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ['tracking_number', 'product_name', 'status', 'origin', 'destination', 'provider', 'cost', 'created_at']
    list_filter = ['status', 'provider', 'is_urgent', 'requires_signature', 'created_at']
    search_fields = ['tracking_number', 'order_id', 'product_name', 'origin', 'destination', 'customer_name']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'order_id', 'tracking_number')
        }),
        ('Product Information', {
            'fields': ('product_name', 'product_description', 'quantity', 'weight_kg')
        }),
        ('Route Information', {
            'fields': ('origin', 'destination', 'distance_km')
        }),
        ('Delivery Details', {
            'fields': ('status', 'progress_percentage', 'current_location', 'estimated_delivery', 'actual_delivery')
        }),
        ('Provider & Cost', {
            'fields': ('provider', 'cost', 'currency')
        }),
        ('Customer Information', {
            'fields': ('customer_name', 'customer_phone', 'customer_email')
        }),
        ('Additional Options', {
            'fields': ('special_instructions', 'is_urgent', 'requires_signature')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    list_per_page = 25

@admin.register(DeliveryTracking)
class DeliveryTrackingAdmin(admin.ModelAdmin):
    list_display = ['delivery', 'location', 'status', 'timestamp']
    list_filter = ['status', 'timestamp']
    search_fields = ['delivery__tracking_number', 'location', 'description']
    readonly_fields = ['timestamp']
    ordering = ['-timestamp']
    
    fieldsets = (
        ('Tracking Information', {
            'fields': ('delivery', 'location', 'status', 'description')
        }),
        ('Timestamp', {
            'fields': ('timestamp',)
        }),
    )

@admin.register(CostEstimate)
class CostEstimateAdmin(admin.ModelAdmin):
    list_display = ['origin', 'destination', 'weight_kg', 'urgency', 'total_cost', 'created_at']
    list_filter = ['urgency', 'created_at']
    search_fields = ['origin', 'destination']
    readonly_fields = ['id', 'created_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Route Information', {
            'fields': ('id', 'origin', 'destination', 'distance_km')
        }),
        ('Shipment Details', {
            'fields': ('weight_kg', 'urgency')
        }),
        ('Cost Breakdown', {
            'fields': ('base_cost', 'distance_cost', 'weight_cost', 'urgency_multiplier', 'total_cost')
        }),
        ('Delivery Information', {
            'fields': ('estimated_delivery_time', 'recommended_providers')
        }),
        ('Timestamp', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

@admin.register(LogisticsTransaction)
class LogisticsTransactionAdmin(admin.ModelAdmin):
    list_display = ['id', 'delivery', 'transaction_type', 'amount', 'status', 'created_at']
    list_filter = ['transaction_type', 'status', 'currency', 'created_at']
    search_fields = ['delivery__tracking_number', 'payment_reference']
    readonly_fields = ['id', 'created_at', 'completed_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Transaction Information', {
            'fields': ('id', 'delivery', 'transaction_type', 'amount', 'currency', 'status')
        }),
        ('Payment Details', {
            'fields': ('payment_method', 'payment_reference')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(LogisticsAnalytics)
class LogisticsAnalyticsAdmin(admin.ModelAdmin):
    list_display = ['date', 'total_deliveries', 'completed_deliveries', 'total_revenue', 'customer_satisfaction']
    list_filter = ['date']
    search_fields = ['date']
    readonly_fields = ['created_at']
    ordering = ['-date']
    
    fieldsets = (
        ('Date', {
            'fields': ('date',)
        }),
        ('Delivery Metrics', {
            'fields': ('total_deliveries', 'completed_deliveries', 'failed_deliveries', 'avg_delivery_time')
        }),
        ('Financial Metrics', {
            'fields': ('total_revenue',)
        }),
        ('Quality Metrics', {
            'fields': ('customer_satisfaction', 'top_providers')
        }),
        ('Timestamp', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
