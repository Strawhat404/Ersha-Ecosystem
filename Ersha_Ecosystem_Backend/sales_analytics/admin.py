from django.contrib import admin
from .models import SalesAnalytics, CreditScore, LoanOffer, MonthlyReport, ProductPerformance, SalesTarget, PaymentAnalysis, ExportRequest


@admin.register(SalesAnalytics)
class SalesAnalyticsAdmin(admin.ModelAdmin):
    list_display = ['farmer', 'date', 'total_revenue', 'total_sales', 'revenue_growth', 'sales_growth']
    list_filter = ['date', 'farmer__user_type', 'farmer__region']
    search_fields = ['farmer__email', 'farmer__first_name', 'farmer__last_name']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-date']


@admin.register(CreditScore)
class CreditScoreAdmin(admin.ModelAdmin):
    list_display = ['farmer', 'score', 'score_label', 'payment_reliability', 'sales_history_months', 'total_revenue']
    list_filter = ['score', 'farmer__user_type', 'farmer__region']
    search_fields = ['farmer__email', 'farmer__first_name', 'farmer__last_name']
    readonly_fields = ['created_at', 'updated_at', 'score_label', 'score_color']
    ordering = ['-score']


@admin.register(LoanOffer)
class LoanOfferAdmin(admin.ModelAdmin):
    list_display = ['bank_name', 'loan_type', 'min_amount', 'max_amount', 'interest_rate', 'term_months', 'is_active']
    list_filter = ['is_active', 'loan_type', 'interest_rate']
    search_fields = ['bank_name', 'loan_type']
    readonly_fields = ['created_at']
    ordering = ['interest_rate']


@admin.register(MonthlyReport)
class MonthlyReportAdmin(admin.ModelAdmin):
    list_display = ['farmer', 'period', 'revenue', 'sales', 'profit', 'profit_margin', 'growth_rate']
    list_filter = ['period', 'farmer__user_type', 'farmer__region']
    search_fields = ['farmer__email', 'farmer__first_name', 'farmer__last_name', 'period']
    readonly_fields = ['generated_at']
    ordering = ['-generated_at']


@admin.register(ProductPerformance)
class ProductPerformanceAdmin(admin.ModelAdmin):
    list_display = ['farmer', 'product', 'date', 'units_sold', 'revenue', 'avg_price', 'growth_rate']
    list_filter = ['date', 'farmer__user_type', 'product__unit']
    search_fields = ['farmer__email', 'product__name']
    readonly_fields = ['created_at']
    ordering = ['-date']


@admin.register(SalesTarget)
class SalesTargetAdmin(admin.ModelAdmin):
    list_display = ['farmer', 'target_type', 'target_value', 'current_value', 'progress_percentage', 'is_active', 'is_completed']
    list_filter = ['target_type', 'target_period', 'is_active', 'is_completed', 'farmer__user_type']
    search_fields = ['farmer__email', 'farmer__first_name', 'farmer__last_name']
    readonly_fields = ['created_at', 'updated_at', 'progress_percentage']
    ordering = ['-created_at']


@admin.register(PaymentAnalysis)
class PaymentAnalysisAdmin(admin.ModelAdmin):
    list_display = ['farmer', 'analysis_period', 'total_payments', 'pending_payments', 'overdue_payments', 'payment_reliability_score', 'is_completed']
    list_filter = ['analysis_period', 'is_completed', 'farmer__user_type']
    search_fields = ['farmer__email', 'farmer__first_name', 'farmer__last_name', 'analysis_period']
    readonly_fields = ['generated_at']
    ordering = ['-generated_at']


@admin.register(ExportRequest)
class ExportRequestAdmin(admin.ModelAdmin):
    list_display = ['farmer', 'export_type', 'export_format', 'status', 'file_size', 'requested_at']
    list_filter = ['export_type', 'export_format', 'status', 'date_range', 'farmer__user_type']
    search_fields = ['farmer__email', 'farmer__first_name', 'farmer__last_name', 'export_type']
    readonly_fields = ['requested_at', 'completed_at']
    ordering = ['-requested_at']
