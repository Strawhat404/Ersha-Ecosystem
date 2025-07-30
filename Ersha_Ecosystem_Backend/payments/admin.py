from django.contrib import admin
from .models import (
    PaymentMethod, EscrowAccount, Transaction, Payment, 
    PayoutRequest, PaymentAnalytics
)

@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ['id', 'user_id', 'method_type', 'provider', 'is_verified', 'is_default', 'is_active', 'created_at']
    list_filter = ['method_type', 'provider', 'is_verified', 'is_default', 'is_active', 'created_at']
    search_fields = ['user_id', 'account_number', 'phone_number', 'account_name', 'bank_name']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['-is_default', '-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'user_id', 'method_type', 'provider')
        }),
        ('Account Details', {
            'fields': ('account_number', 'phone_number', 'account_name', 'bank_name', 'branch_code')
        }),
        ('Status & Verification', {
            'fields': ('is_verified', 'is_default', 'is_active')
        }),
        ('Security', {
            'fields': ('verification_token', 'verification_expires'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    list_per_page = 25

@admin.register(EscrowAccount)
class EscrowAccountAdmin(admin.ModelAdmin):
    list_display = ['id', 'user_id', 'balance', 'currency', 'is_active', 'created_at']
    list_filter = ['currency', 'is_active', 'created_at']
    search_fields = ['user_id']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Account Information', {
            'fields': ('id', 'user_id', 'balance', 'currency')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    list_per_page = 25

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['transaction_id', 'transaction_type', 'amount', 'currency', 'status', 'sender_name', 'receiver_name', 'created_at']
    list_filter = ['transaction_type', 'status', 'escrow_status', 'currency', 'payment_provider', 'created_at']
    search_fields = ['transaction_id', 'sender_name', 'receiver_name', 'product_name', 'order_id']
    readonly_fields = ['id', 'transaction_id', 'created_at', 'updated_at', 'completed_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Transaction Information', {
            'fields': ('id', 'transaction_id', 'transaction_type', 'amount', 'currency', 'status')
        }),
        ('Parties', {
            'fields': ('sender_id', 'sender_name', 'receiver_id', 'receiver_name')
        }),
        ('Product Details', {
            'fields': ('product_name', 'product_description', 'quantity', 'order_id')
        }),
        ('Payment Details', {
            'fields': ('payment_method', 'payment_provider')
        }),
        ('Escrow Information', {
            'fields': ('escrow_status', 'escrow_release_date')
        }),
        ('External References', {
            'fields': ('external_transaction_id', 'external_reference')
        }),
        ('Fees & Charges', {
            'fields': ('processing_fee', 'platform_fee', 'total_amount')
        }),
        ('Metadata', {
            'fields': ('description', 'notes', 'ip_address', 'user_agent'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )
    
    list_per_page = 25

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'transaction', 'amount', 'currency', 'status', 'provider', 'created_at']
    list_filter = ['status', 'currency', 'provider', 'is_verified', 'created_at']
    search_fields = ['transaction__transaction_id', 'provider_transaction_id', 'provider_reference']
    readonly_fields = ['id', 'created_at', 'updated_at', 'completed_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Payment Information', {
            'fields': ('id', 'transaction', 'amount', 'currency', 'status')
        }),
        ('Provider Details', {
            'fields': ('provider', 'provider_transaction_id', 'provider_reference')
        }),
        ('Payment Method', {
            'fields': ('payment_method',)
        }),
        ('Verification', {
            'fields': ('verification_code', 'verification_expires', 'is_verified')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )
    
    list_per_page = 25

@admin.register(PayoutRequest)
class PayoutRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'user_id', 'amount', 'currency', 'status', 'payment_method', 'created_at']
    list_filter = ['status', 'currency', 'created_at']
    search_fields = ['user_id', 'external_reference']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Request Information', {
            'fields': ('id', 'user_id', 'amount', 'currency', 'status')
        }),
        ('Payment Method', {
            'fields': ('payment_method',)
        }),
        ('Processing Details', {
            'fields': ('processing_fee', 'net_amount')
        }),
        ('Approval & Processing', {
            'fields': ('approved_by', 'approved_at', 'processed_at')
        }),
        ('External Reference', {
            'fields': ('external_reference',)
        }),
        ('Metadata', {
            'fields': ('reason', 'notes'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    list_per_page = 25

@admin.register(PaymentAnalytics)
class PaymentAnalyticsAdmin(admin.ModelAdmin):
    list_display = ['date', 'user_id', 'total_transactions', 'total_volume', 'success_rate', 'created_at']
    list_filter = ['date', 'created_at']
    search_fields = ['user_id', 'date']
    readonly_fields = ['created_at']
    ordering = ['-date']
    
    fieldsets = (
        ('Date & User', {
            'fields': ('date', 'user_id')
        }),
        ('Transaction Counts', {
            'fields': ('total_transactions', 'completed_transactions', 'failed_transactions', 'pending_transactions')
        }),
        ('Financial Metrics', {
            'fields': ('total_volume', 'total_fees', 'net_volume')
        }),
        ('Payment Method Breakdown', {
            'fields': ('mobile_payments', 'bank_transfers', 'digital_wallet_payments')
        }),
        ('Performance', {
            'fields': ('success_rate',)
        }),
        ('Timestamp', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    list_per_page = 25
