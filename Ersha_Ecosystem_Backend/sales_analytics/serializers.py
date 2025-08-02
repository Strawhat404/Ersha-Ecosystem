from rest_framework import serializers
from .models import SalesAnalytics, CreditScore, LoanOffer, MonthlyReport, ProductPerformance, SalesTarget, PaymentAnalysis, ExportRequest


class SalesAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesAnalytics
        fields = '__all__'
        read_only_fields = ['farmer', 'created_at', 'updated_at']


class CreditScoreSerializer(serializers.ModelSerializer):
    score_label = serializers.CharField(read_only=True)
    score_color = serializers.CharField(read_only=True)
    
    class Meta:
        model = CreditScore
        fields = '__all__'
        read_only_fields = ['farmer', 'created_at', 'updated_at']


class LoanOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanOffer
        fields = '__all__'


class MonthlyReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyReport
        fields = '__all__'
        read_only_fields = ['farmer', 'generated_at']


class ProductPerformanceSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_unit = serializers.CharField(source='product.unit', read_only=True)
    
    class Meta:
        model = ProductPerformance
        fields = '__all__'
        read_only_fields = ['farmer', 'created_at']


# Quick Actions Serializers
class SalesTargetSerializer(serializers.ModelSerializer):
    target_type_display = serializers.CharField(source='get_target_type_display', read_only=True)
    target_period_display = serializers.CharField(source='get_target_period_display', read_only=True)
    
    class Meta:
        model = SalesTarget
        fields = '__all__'
        read_only_fields = ['farmer', 'current_value', 'progress_percentage', 'created_at', 'updated_at']


class PaymentAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentAnalysis
        fields = '__all__'
        read_only_fields = ['farmer', 'generated_at']


class ExportRequestSerializer(serializers.ModelSerializer):
    export_type_display = serializers.CharField(source='get_export_type_display', read_only=True)
    export_format_display = serializers.CharField(source='get_export_format_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = ExportRequest
        fields = '__all__'
        read_only_fields = ['farmer', 'status', 'file_url', 'file_size', 'requested_at', 'completed_at']


# Dashboard serializers
class FarmerDashboardSerializer(serializers.Serializer):
    """Serializer for farmer dashboard data"""
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_sales = serializers.IntegerField()
    avg_order_value = serializers.DecimalField(max_digits=10, decimal_places=2)
    revenue_growth = serializers.DecimalField(max_digits=5, decimal_places=2)
    sales_growth = serializers.DecimalField(max_digits=5, decimal_places=2)
    top_products = serializers.ListField()
    monthly_trends = serializers.ListField()
    credit_score = serializers.IntegerField()
    loan_offers = serializers.ListField()
    monthly_reports = serializers.ListField()


class SalesOverviewSerializer(serializers.Serializer):
    """Serializer for sales overview data"""
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_sales = serializers.IntegerField()
    revenue_growth = serializers.DecimalField(max_digits=5, decimal_places=2)
    sales_growth = serializers.DecimalField(max_digits=5, decimal_places=2)
    best_month = serializers.CharField()
    top_category = serializers.CharField()
    top_products = serializers.ListField()


class CreditOverviewSerializer(serializers.Serializer):
    """Serializer for credit overview data"""
    score = serializers.IntegerField()
    score_label = serializers.CharField()
    score_color = serializers.CharField()
    payment_reliability = serializers.DecimalField(max_digits=5, decimal_places=2)
    sales_history_months = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    loan_offers = serializers.ListField()


class ReportOverviewSerializer(serializers.Serializer):
    """Serializer for reports overview data"""
    monthly_reports = serializers.ListField()
    report_types = serializers.ListField()
    periods = serializers.ListField() 