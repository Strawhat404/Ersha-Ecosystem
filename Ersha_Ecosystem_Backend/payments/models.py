import uuid
from django.db import models
from django.utils import timezone
from decimal import Decimal

class PaymentMethod(models.Model):
    """User's payment methods (bank accounts, mobile money, etc.)"""
    METHOD_TYPES = [
        ('mobile', 'Mobile Money'),
        ('bank', 'Bank Account'),
        ('digital', 'Digital Wallet'),
        ('card', 'Credit/Debit Card'),
    ]

    PROVIDER_CHOICES = [
        ('m_pesa', 'M-Pesa'),
        ('telebirr', 'Telebirr'),
        ('hellocash', 'HelloCash'),
        ('cbe_birr', 'CBE Birr'),
        ('commercial_bank', 'Commercial Bank of Ethiopia'),
        ('awash_bank', 'Awash Bank'),
        ('dashen_bank', 'Dashen Bank'),
        ('bank_of_abyssinia', 'Bank of Abyssinia'),
        ('chapa', 'Chapa'),
        ('amole', 'Amole'),
        ('other', 'Other'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=100)  # Link to user (farmer/merchant)
    method_type = models.CharField(max_length=20, choices=METHOD_TYPES)
    provider = models.CharField(max_length=50, choices=PROVIDER_CHOICES)
    account_number = models.CharField(max_length=100, blank=True)  # Masked account number
    phone_number = models.CharField(max_length=20, blank=True)
    account_name = models.CharField(max_length=200, blank=True)
    bank_name = models.CharField(max_length=100, blank=True)
    branch_code = models.CharField(max_length=20, blank=True)
    
    # Verification and status
    is_verified = models.BooleanField(default=False)
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Security
    verification_token = models.CharField(max_length=100, blank=True)
    verification_expires = models.DateTimeField(null=True, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_default', '-created_at']
        verbose_name = "Payment Method"
        verbose_name_plural = "Payment Methods"

    def __str__(self):
        return f"{self.get_provider_display()} - {self.account_number or self.phone_number}"

class EscrowAccount(models.Model):
    """Escrow account for holding funds during transactions"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=100)
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0.0)
    currency = models.CharField(max_length=3, default='ETB')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Escrow Account"
        verbose_name_plural = "Escrow Accounts"

    def __str__(self):
        return f"Escrow Account - {self.user_id} - {self.currency} {self.balance}"

class Transaction(models.Model):
    """Payment transactions"""
    TRANSACTION_TYPES = [
        ('sale', 'Sale'),
        ('purchase', 'Purchase'),
        ('transfer', 'Transfer'),
        ('withdrawal', 'Withdrawal'),
        ('deposit', 'Deposit'),
        ('refund', 'Refund'),
        ('fee', 'Service Fee'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('disputed', 'Disputed'),
    ]

    ESCROW_STATUS_CHOICES = [
        ('holding', 'Holding'),
        ('released', 'Released'),
        ('disputed', 'Disputed'),
        ('refunded', 'Refunded'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    transaction_id = models.CharField(max_length=50, unique=True)  # Human-readable ID
    
    # Transaction details
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='ETB')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Parties involved
    sender_id = models.CharField(max_length=100)  # User ID of sender
    receiver_id = models.CharField(max_length=100)  # User ID of receiver
    sender_name = models.CharField(max_length=200, blank=True)
    receiver_name = models.CharField(max_length=200, blank=True)
    
    # Product/Order details
    product_name = models.CharField(max_length=200, blank=True)
    product_description = models.TextField(blank=True)
    quantity = models.CharField(max_length=50, blank=True)
    order_id = models.CharField(max_length=50, blank=True)
    
    # Payment method
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.SET_NULL, null=True, blank=True)
    payment_provider = models.CharField(max_length=50, blank=True)  # e.g., M-Pesa, CBE Birr
    
    # Escrow details
    escrow_status = models.CharField(max_length=20, choices=ESCROW_STATUS_CHOICES, default='holding')
    escrow_release_date = models.DateTimeField(null=True, blank=True)
    
    # External references
    external_transaction_id = models.CharField(max_length=100, blank=True)  # Provider's transaction ID
    external_reference = models.CharField(max_length=100, blank=True)  # External reference
    
    # Fees and charges
    processing_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    
    # Metadata
    description = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Transaction"
        verbose_name_plural = "Transactions"

    def __str__(self):
        return f"{self.transaction_id} - {self.get_transaction_type_display()} - {self.currency} {self.amount}"

    def save(self, *args, **kwargs):
        # Calculate total amount including fees
        if not self.total_amount:
            self.total_amount = self.amount + self.processing_fee + self.platform_fee
        super().save(*args, **kwargs)

class Payment(models.Model):
    """Payment records linked to transactions"""
    PAYMENT_STATUS_CHOICES = [
        ('initiated', 'Initiated'),
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, related_name='payment')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='ETB')
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='initiated')
    
    # Payment provider details
    provider = models.CharField(max_length=50, blank=True)  # e.g., Chapa, Telebirr
    provider_transaction_id = models.CharField(max_length=128, blank=True, null=True)
    provider_reference = models.CharField(max_length=128, blank=True, null=True)
    
    # Payment method
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Verification and security
    verification_code = models.CharField(max_length=10, blank=True)
    verification_expires = models.DateTimeField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Payment"
        verbose_name_plural = "Payments"

    def __str__(self):
        return f"Payment - {self.transaction.transaction_id} - {self.currency} {self.amount}"

class PayoutRequest(models.Model):
    """Payout requests for users"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='ETB')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Payout method
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.CASCADE)
    
    # Processing details
    processing_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    net_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    
    # Approval and processing
    approved_by = models.CharField(max_length=100, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    # External reference
    external_reference = models.CharField(max_length=100, blank=True)
    
    # Metadata
    reason = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Payout Request"
        verbose_name_plural = "Payout Requests"

    def __str__(self):
        return f"Payout - {self.user_id} - {self.currency} {self.amount}"

    def save(self, *args, **kwargs):
        # Calculate net amount
        if not self.net_amount:
            self.net_amount = self.amount - self.processing_fee
        super().save(*args, **kwargs)

class PaymentAnalytics(models.Model):
    """Payment analytics and reporting data"""
    date = models.DateField()
    user_id = models.CharField(max_length=100)
    
    # Transaction counts
    total_transactions = models.IntegerField(default=0)
    completed_transactions = models.IntegerField(default=0)
    failed_transactions = models.IntegerField(default=0)
    pending_transactions = models.IntegerField(default=0)
    
    # Financial metrics
    total_volume = models.DecimalField(max_digits=15, decimal_places=2, default=0.0)
    total_fees = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    net_volume = models.DecimalField(max_digits=15, decimal_places=2, default=0.0)
    
    # Payment method breakdown
    mobile_payments = models.IntegerField(default=0)
    bank_transfers = models.IntegerField(default=0)
    digital_wallet_payments = models.IntegerField(default=0)
    
    # Success rates
    success_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-date']
        unique_together = ['date', 'user_id']
        verbose_name = "Payment Analytics"
        verbose_name_plural = "Payment Analytics"

    def __str__(self):
        return f"Analytics - {self.user_id} - {self.date} - {self.total_volume}"
