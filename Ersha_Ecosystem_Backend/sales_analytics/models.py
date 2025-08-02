from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from users.models import User
from orders.models import Order, OrderItem
from marketplace.models import Product


class SalesAnalytics(models.Model):
    """Sales analytics data for farmers"""
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sales_analytics')
    date = models.DateField()
    
    # Sales metrics
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    total_sales = models.IntegerField(default=0)
    avg_order_value = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    
    # Growth metrics
    revenue_growth = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    sales_growth = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    # Product performance
    top_products = models.JSONField(default=list, blank=True)
    monthly_trends = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        unique_together = ['farmer', 'date']
        verbose_name = "Sales Analytics"
        verbose_name_plural = "Sales Analytics"

    def __str__(self):
        return f"Sales Analytics - {self.farmer.email} - {self.date}"


class CreditScore(models.Model):
    """Credit score system for farmers"""
    farmer = models.OneToOneField(User, on_delete=models.CASCADE, related_name='credit_score')
    score = models.IntegerField(
        validators=[MinValueValidator(300), MaxValueValidator(850)],
        default=300
    )
    
    # Credit factors
    payment_reliability = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    sales_history_months = models.IntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    
    # Additional factors
    on_time_deliveries = models.IntegerField(default=0)
    customer_satisfaction = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Credit Score"
        verbose_name_plural = "Credit Scores"

    def __str__(self):
        return f"Credit Score - {self.farmer.email} - {self.score}"

    @property
    def score_label(self):
        if self.score >= 750:
            return "Excellent"
        elif self.score >= 650:
            return "Good"
        elif self.score >= 550:
            return "Fair"
        else:
            return "Poor"

    @property
    def score_color(self):
        if self.score >= 750:
            return "green"
        elif self.score >= 650:
            return "orange"
        elif self.score >= 550:
            return "yellow"
        else:
            return "red"


class LoanOffer(models.Model):
    """Loan offers from Ethiopian banks"""
    bank_name = models.CharField(max_length=200)
    bank_logo = models.URLField(blank=True, null=True)
    
    # Loan details
    loan_type = models.CharField(max_length=100)
    min_amount = models.DecimalField(max_digits=12, decimal_places=2)
    max_amount = models.DecimalField(max_digits=12, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    term_months = models.IntegerField()
    
    # Requirements
    min_credit_score = models.IntegerField(default=300)
    min_sales_history = models.IntegerField(default=0)  # months
    min_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    requirements = models.JSONField(default=list, blank=True)
    
    # Disbursement
    disbursement_time = models.CharField(max_length=50, default="5-7 days")
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['interest_rate']
        verbose_name = "Loan Offer"
        verbose_name_plural = "Loan Offers"

    def __str__(self):
        return f"{self.bank_name} - {self.loan_type}"


class MonthlyReport(models.Model):
    """Monthly sales reports for farmers"""
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='monthly_reports')
    period = models.CharField(max_length=20)  # e.g., "March 2024"
    
    # Report metrics
    revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    sales = models.IntegerField(default=0)
    profit = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    profit_margin = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    # Performance metrics
    top_category = models.CharField(max_length=100, blank=True)
    growth_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    # Report details
    generated_at = models.DateTimeField(default=timezone.now)
    report_data = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-generated_at']
        unique_together = ['farmer', 'period']
        verbose_name = "Monthly Report"
        verbose_name_plural = "Monthly Reports"

    def __str__(self):
        return f"Monthly Report - {self.farmer.email} - {self.period}"


class ProductPerformance(models.Model):
    """Individual product performance tracking"""
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='product_performance')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='performance')
    date = models.DateField()
    
    # Performance metrics
    units_sold = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    avg_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    growth_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-date']
        unique_together = ['farmer', 'product', 'date']
        verbose_name = "Product Performance"
        verbose_name_plural = "Product Performance"

    def __str__(self):
        return f"Product Performance - {self.product.name} - {self.date}"


class SalesTarget(models.Model):
    """Sales targets set by farmers"""
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sales_targets')
    target_type = models.CharField(max_length=50, choices=[
        ('revenue', 'Revenue Target'),
        ('sales', 'Sales Count Target'),
        ('product', 'Product Sales Target'),
        ('growth', 'Growth Target')
    ])
    
    # Target details
    target_value = models.DecimalField(max_digits=12, decimal_places=2)
    current_value = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    target_period = models.CharField(max_length=20, choices=[
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly')
    ])
    
    # Target period
    start_date = models.DateField()
    end_date = models.DateField()
    
    # Status
    is_active = models.BooleanField(default=True)
    is_completed = models.BooleanField(default=False)
    
    # Progress tracking
    progress_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Sales Target"
        verbose_name_plural = "Sales Targets"

    def __str__(self):
        return f"Sales Target - {self.farmer.email} - {self.target_type}"

    def calculate_progress(self):
        """Calculate progress percentage"""
        if self.target_value > 0:
            self.progress_percentage = (self.current_value / self.target_value) * 100
            self.save()


class PaymentAnalysis(models.Model):
    """Payment analysis for farmers"""
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_analyses')
    
    # Analysis period
    analysis_period = models.CharField(max_length=20)  # e.g., "March 2024"
    start_date = models.DateField()
    end_date = models.DateField()
    
    # Payment metrics
    total_payments = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    pending_payments = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    overdue_payments = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    
    # Payment reliability
    on_time_payments = models.IntegerField(default=0)
    late_payments = models.IntegerField(default=0)
    payment_reliability_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    # Analysis data
    payment_trends = models.JSONField(default=list, blank=True)
    customer_payment_behavior = models.JSONField(default=dict, blank=True)
    
    # Status
    is_completed = models.BooleanField(default=False)
    generated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-generated_at']
        unique_together = ['farmer', 'analysis_period']
        verbose_name = "Payment Analysis"
        verbose_name_plural = "Payment Analyses"

    def __str__(self):
        return f"Payment Analysis - {self.farmer.email} - {self.analysis_period}"


class ExportRequest(models.Model):
    """Export requests for sales data"""
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='export_requests')
    
    # Export details
    export_type = models.CharField(max_length=50, choices=[
        ('sales_data', 'Sales Data'),
        ('revenue_report', 'Revenue Report'),
        ('product_performance', 'Product Performance'),
        ('payment_analysis', 'Payment Analysis'),
        ('monthly_report', 'Monthly Report')
    ])
    
    # Export parameters
    date_range = models.CharField(max_length=50, choices=[
        ('last_month', 'Last Month'),
        ('last_quarter', 'Last Quarter'),
        ('last_year', 'Last Year'),
        ('custom', 'Custom Range')
    ])
    
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    
    # Export format
    export_format = models.CharField(max_length=20, choices=[
        ('csv', 'CSV'),
        ('excel', 'Excel'),
        ('pdf', 'PDF'),
        ('json', 'JSON')
    ], default='csv')
    
    # Status
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    ], default='pending')
    
    # File details
    file_url = models.URLField(blank=True, null=True)
    file_size = models.IntegerField(default=0)  # in bytes
    
    # Request details
    requested_at = models.DateTimeField(default=timezone.now)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Additional data
    export_data = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-requested_at']
        verbose_name = "Export Request"
        verbose_name_plural = "Export Requests"

    def __str__(self):
        return f"Export Request - {self.farmer.email} - {self.export_type}"
