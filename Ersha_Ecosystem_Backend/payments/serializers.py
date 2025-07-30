from rest_framework import serializers
from .models import (
    PaymentMethod, EscrowAccount, Transaction, Payment, 
    PayoutRequest, PaymentAnalytics
)

class PaymentMethodSerializer(serializers.ModelSerializer):
    method_type_display = serializers.CharField(source='get_method_type_display', read_only=True)
    provider_display = serializers.CharField(source='get_provider_display', read_only=True)
    masked_account = serializers.SerializerMethodField()
    
    class Meta:
        model = PaymentMethod
        fields = '__all__'
    
    def get_masked_account(self, obj):
        """Return masked account number for security"""
        if obj.account_number:
            if len(obj.account_number) > 4:
                return f"****-****-{obj.account_number[-4:]}"
            return "****"
        elif obj.phone_number:
            if len(obj.phone_number) > 4:
                return f"+251-9**-***-{obj.phone_number[-4:]}"
            return "****"
        return "****"

class EscrowAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = EscrowAccount
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    transaction_type_display = serializers.CharField(source='get_transaction_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    escrow_status_display = serializers.CharField(source='get_escrow_status_display', read_only=True)
    payment_method_details = PaymentMethodSerializer(source='payment_method', read_only=True)
    days_since_created = serializers.SerializerMethodField()
    is_overdue = serializers.SerializerMethodField()
    
    class Meta:
        model = Transaction
        fields = '__all__'
    
    def get_days_since_created(self, obj):
        """Calculate days since transaction was created"""
        from django.utils import timezone
        delta = timezone.now() - obj.created_at
        return delta.days
    
    def get_is_overdue(self, obj):
        """Check if transaction is overdue (pending for more than 7 days)"""
        if obj.status == 'pending':
            from django.utils import timezone
            delta = timezone.now() - obj.created_at
            return delta.days > 7
        return False

class PaymentSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    transaction_details = TransactionSerializer(source='transaction', read_only=True)
    payment_method_details = PaymentMethodSerializer(source='payment_method', read_only=True)
    
    class Meta:
        model = Payment
        fields = '__all__'

class PayoutRequestSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_method_details = PaymentMethodSerializer(source='payment_method', read_only=True)
    
    class Meta:
        model = PayoutRequest
        fields = '__all__'

class PaymentAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentAnalytics
        fields = '__all__'

# Specialized serializers for specific use cases
class PaymentMethodCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating payment methods with verification"""
    verification_code = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = PaymentMethod
        fields = ['method_type', 'provider', 'account_number', 'phone_number', 
                 'account_name', 'bank_name', 'branch_code', 'verification_code']
    
    def validate(self, data):
        """Validate payment method data"""
        method_type = data.get('method_type')
        provider = data.get('provider')
        
        # Validate mobile money methods
        if method_type == 'mobile':
            if not data.get('phone_number'):
                raise serializers.ValidationError("Phone number is required for mobile money methods")
            if provider not in ['m_pesa', 'telebirr', 'hellocash']:
                raise serializers.ValidationError("Invalid provider for mobile money")
        
        # Validate bank account methods
        elif method_type == 'bank':
            if not data.get('account_number'):
                raise serializers.ValidationError("Account number is required for bank methods")
            if provider not in ['cbe_birr', 'commercial_bank', 'awash_bank', 'dashen_bank', 'bank_of_abyssinia']:
                raise serializers.ValidationError("Invalid provider for bank methods")
        
        return data

class TransactionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating transactions"""
    class Meta:
        model = Transaction
        fields = ['transaction_type', 'amount', 'currency', 'sender_id', 'receiver_id',
                 'sender_name', 'receiver_name', 'product_name', 'product_description',
                 'quantity', 'order_id', 'payment_method', 'payment_provider', 'description']

class PaymentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating payments"""
    class Meta:
        model = Payment
        fields = ['transaction', 'amount', 'currency', 'provider', 'payment_method']

class PayoutRequestCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating payout requests"""
    class Meta:
        model = PayoutRequest
        fields = ['user_id', 'amount', 'currency', 'payment_method', 'reason']

# Dashboard and analytics serializers
class PaymentDashboardSerializer(serializers.Serializer):
    """Serializer for payment dashboard data"""
    total_balance = serializers.DecimalField(max_digits=15, decimal_places=2)
    pending_payouts = serializers.DecimalField(max_digits=12, decimal_places=2)
    monthly_income = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_transactions = serializers.IntegerField()
    completed_transactions = serializers.IntegerField()
    pending_transactions = serializers.IntegerField()
    failed_transactions = serializers.IntegerField()
    success_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    recent_transactions = TransactionSerializer(many=True)
    payment_methods = PaymentMethodSerializer(many=True)

class PaymentMethodUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating payment methods"""
    class Meta:
        model = PaymentMethod
        fields = ['is_default', 'is_active']

class TransactionStatusUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating transaction status"""
    class Meta:
        model = Transaction
        fields = ['status', 'escrow_status', 'notes']

class PaymentStatusUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating payment status"""
    class Meta:
        model = Payment
        fields = ['status', 'provider_transaction_id', 'provider_reference']

class PayoutRequestStatusUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating payout request status"""
    class Meta:
        model = PayoutRequest
        fields = ['status', 'approved_by', 'notes']

# Search and filter serializers
class PaymentMethodSearchSerializer(serializers.ModelSerializer):
    """Serializer for payment method search results"""
    method_type_display = serializers.CharField(source='get_method_type_display', read_only=True)
    provider_display = serializers.CharField(source='get_provider_display', read_only=True)
    masked_account = serializers.SerializerMethodField()
    
    class Meta:
        model = PaymentMethod
        fields = ['id', 'method_type', 'method_type_display', 'provider', 'provider_display',
                 'masked_account', 'is_verified', 'is_default', 'is_active']
    
    def get_masked_account(self, obj):
        """Return masked account number for security"""
        if obj.account_number:
            if len(obj.account_number) > 4:
                return f"****-****-{obj.account_number[-4:]}"
            return "****"
        elif obj.phone_number:
            if len(obj.phone_number) > 4:
                return f"+251-9**-***-{obj.phone_number[-4:]}"
            return "****"
        return "****"

class TransactionSearchSerializer(serializers.ModelSerializer):
    """Serializer for transaction search results"""
    transaction_type_display = serializers.CharField(source='get_transaction_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    escrow_status_display = serializers.CharField(source='get_escrow_status_display', read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'transaction_id', 'transaction_type', 'transaction_type_display',
                 'amount', 'currency', 'status', 'status_display', 'escrow_status',
                 'escrow_status_display', 'sender_name', 'receiver_name', 'product_name',
                 'created_at', 'completed_at'] 