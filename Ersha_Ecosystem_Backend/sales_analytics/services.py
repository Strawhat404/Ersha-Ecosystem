from django.db.models import Sum, Count, Avg, Q, F
from django.utils import timezone
from datetime import timedelta, datetime
from decimal import Decimal
from users.models import User
from orders.models import Order, OrderItem
from marketplace.models import Product
from .models import CreditScore, LoanOffer, SalesAnalytics, MonthlyReport


class AnalyticsCalculationService:
    """Service for calculating analytics based on actual user performance"""
    
    @staticmethod
    def calculate_credit_score(user):
        """Calculate credit score based on actual user performance"""
        if not user.is_farmer:
            return None
            
        # Get user's actual performance data
        farmer_orders = Order.objects.filter(
            items__product__farmer=user,
            status='delivered'
        )
        
        # Base score starts at 300
        base_score = 300
        
        # Calculate performance metrics
        total_orders = farmer_orders.count()
        total_revenue = farmer_orders.aggregate(total=Sum('total_amount'))['total'] or Decimal('0.0')
        
        # Calculate payment reliability (on-time deliveries)
        on_time_orders = farmer_orders.filter(
            delivered_at__lte=F('created_at') + timedelta(days=7)  # Assume 7 days is on-time
        ).count()
        payment_reliability = (on_time_orders / total_orders * 100) if total_orders > 0 else 0
        
        # Calculate sales history (months since first order)
        first_order = farmer_orders.order_by('created_at').first()
        sales_history_months = 0
        if first_order:
            months_diff = (timezone.now() - first_order.created_at).days / 30
            sales_history_months = int(months_diff)
        
        # Calculate average order value
        avg_order_value = total_revenue / total_orders if total_orders > 0 else 0
        
        # Calculate customer satisfaction (based on repeat customers)
        unique_customers = farmer_orders.values('buyer').distinct().count()
        repeat_customers = farmer_orders.values('buyer').annotate(
            order_count=Count('id')
        ).filter(order_count__gt=1).count()
        customer_satisfaction = (repeat_customers / unique_customers * 100) if unique_customers > 0 else 0
        
        # Calculate credit score components
        revenue_bonus = min(200, int(total_revenue / 1000))  # Max 200 points for revenue
        reliability_bonus = min(150, int(payment_reliability * 1.5))  # Max 150 points for reliability
        history_bonus = min(100, sales_history_months * 10)  # Max 100 points for history
        satisfaction_bonus = min(100, int(customer_satisfaction * 1.5))  # Max 100 points for satisfaction
        
        # Calculate final score
        final_score = min(850, base_score + revenue_bonus + reliability_bonus + history_bonus + satisfaction_bonus)
        
        # Update or create credit score
        credit_score, created = CreditScore.objects.get_or_create(
            farmer=user,
            defaults={'score': final_score}
        )
        
        credit_score.score = final_score
        credit_score.payment_reliability = payment_reliability
        credit_score.sales_history_months = sales_history_months
        credit_score.total_revenue = total_revenue
        credit_score.on_time_deliveries = on_time_orders
        credit_score.customer_satisfaction = customer_satisfaction
        credit_score.save()
        
        return credit_score
    
    @staticmethod
    def calculate_sales_analytics(user, period_days=30):
        """Calculate sales analytics based on actual user performance"""
        if not user.is_farmer:
            return None
            
        today = timezone.now().date()
        period_start = today - timedelta(days=period_days)
        
        # Get user's actual orders
        farmer_orders = Order.objects.filter(
            items__product__farmer=user
        ).distinct()
        
        # Calculate current period metrics
        current_period_orders = farmer_orders.filter(
            status='delivered',
            created_at__gte=period_start
        )
        
        total_revenue = current_period_orders.aggregate(total=Sum('total_amount'))['total'] or Decimal('0.0')
        total_sales = current_period_orders.count()
        avg_order_value = total_revenue / total_sales if total_sales > 0 else 0
        
        # Calculate previous period for growth comparison
        previous_period_start = period_start - timedelta(days=period_days)
        previous_period_orders = farmer_orders.filter(
            status='delivered',
            created_at__gte=previous_period_start,
            created_at__lt=period_start
        )
        
        previous_revenue = previous_period_orders.aggregate(total=Sum('total_amount'))['total'] or Decimal('0.0')
        previous_sales = previous_period_orders.count()
        
        # Calculate growth rates
        revenue_growth = 0
        if previous_revenue > 0:
            revenue_growth = ((total_revenue - previous_revenue) / previous_revenue) * 100
            
        sales_growth = 0
        if previous_sales > 0:
            sales_growth = ((total_sales - previous_sales) / previous_sales) * 100
        
        # Calculate top products
        top_products = OrderItem.objects.filter(
            order__in=current_period_orders
        ).values('product__name').annotate(
            revenue=Sum(F('quantity') * F('unit_price')),
            sales=Sum('quantity')
        ).order_by('-revenue')[:4]
        
        # Calculate monthly trends (last 5 months)
        monthly_trends = []
        for i in range(5):
            month_start = today - timedelta(days=30 * (i + 1))
            month_end = today - timedelta(days=30 * i)
            
            month_orders = farmer_orders.filter(
                status='delivered',
                created_at__gte=month_start,
                created_at__lt=month_end
            )
            
            month_revenue = month_orders.aggregate(total=Sum('total_amount'))['total'] or 0
            month_sales = month_orders.count()
            
            monthly_trends.append({
                'month': month_start.strftime('%b'),
                'revenue': float(month_revenue),
                'sales': month_sales
            })
        
        monthly_trends.reverse()
        
        # Create or update sales analytics
        analytics, created = SalesAnalytics.objects.get_or_create(
            farmer=user,
            date=today,
            defaults={
                'total_revenue': total_revenue,
                'total_sales': total_sales,
                'avg_order_value': avg_order_value,
                'revenue_growth': revenue_growth,
                'sales_growth': sales_growth,
                'top_products': list(top_products),
                'monthly_trends': monthly_trends
            }
        )
        
        if not created:
            analytics.total_revenue = total_revenue
            analytics.total_sales = total_sales
            analytics.avg_order_value = avg_order_value
            analytics.revenue_growth = revenue_growth
            analytics.sales_growth = sales_growth
            analytics.top_products = list(top_products)
            analytics.monthly_trends = monthly_trends
            analytics.save()
        
        return analytics
    
    @staticmethod
    def get_eligible_loan_offers(user):
        """Get loan offers that user is eligible for based on actual performance"""
        credit_score = CreditScore.objects.filter(farmer=user).first()
        
        if not credit_score:
            # Calculate credit score if not exists
            credit_score = AnalyticsCalculationService.calculate_credit_score(user)
        
        if not credit_score:
            return []
        
        # Get user's actual performance
        farmer_orders = Order.objects.filter(
            items__product__farmer=user,
            status='delivered'
        )
        
        total_revenue = farmer_orders.aggregate(total=Sum('total_amount'))['total'] or Decimal('0.0')
        first_order = farmer_orders.order_by('created_at').first()
        sales_history_months = 0
        if first_order:
            months_diff = (timezone.now() - first_order.created_at).days / 30
            sales_history_months = int(months_diff)
        
        # Get eligible loan offers
        eligible_offers = LoanOffer.objects.filter(
            is_active=True,
            min_credit_score__lte=credit_score.score,
            min_revenue__lte=total_revenue,
            min_sales_history__lte=sales_history_months
        ).order_by('interest_rate')
        
        return eligible_offers
    
    @staticmethod
    def generate_monthly_report(user, period):
        """Generate monthly report based on actual user performance"""
        if not user.is_farmer:
            return None
        
        # Parse period (e.g., "March 2024")
        try:
            period_date = datetime.strptime(period, "%B %Y")
            start_date = period_date.replace(day=1)
            if period_date.month == 12:
                end_date = period_date.replace(year=period_date.year + 1, month=1, day=1)
            else:
                end_date = period_date.replace(month=period_date.month + 1, day=1)
        except:
            # Default to current month if parsing fails
            today = timezone.now()
            start_date = today.replace(day=1)
            if today.month == 12:
                end_date = today.replace(year=today.year + 1, month=1, day=1)
            else:
                end_date = today.replace(month=today.month + 1, day=1)
        
        # Get orders for the period
        farmer_orders = Order.objects.filter(
            items__product__farmer=user,
            status='delivered',
            created_at__gte=start_date,
            created_at__lt=end_date
        )
        
        # Calculate report metrics
        revenue = farmer_orders.aggregate(total=Sum('total_amount'))['total'] or Decimal('0.0')
        sales = farmer_orders.count()
        
        # Calculate profit (simplified - assume 30% margin)
        profit = revenue * Decimal('0.3')
        profit_margin = 30.0
        
        # Find top category
        top_category = "Mixed"
        if farmer_orders.exists():
            category_counts = OrderItem.objects.filter(
                order__in=farmer_orders
            ).values('product__name').annotate(
                count=Count('id')
            ).order_by('-count')[:1]
            
            if category_counts:
                top_category = category_counts[0]['product__name']
        
        # Calculate growth rate (compare with previous month)
        prev_start = start_date - timedelta(days=30)
        prev_orders = Order.objects.filter(
            items__product__farmer=user,
            status='delivered',
            created_at__gte=prev_start,
            created_at__lt=start_date
        )
        prev_revenue = prev_orders.aggregate(total=Sum('total_amount'))['total'] or Decimal('0.0')
        
        growth_rate = 0
        if prev_revenue > 0:
            growth_rate = ((revenue - prev_revenue) / prev_revenue) * 100
        
        # Create report
        report, created = MonthlyReport.objects.get_or_create(
            farmer=user,
            period=period,
            defaults={
                'revenue': revenue,
                'sales': sales,
                'profit': profit,
                'profit_margin': profit_margin,
                'top_category': top_category,
                'growth_rate': growth_rate,
                'report_data': {
                    'period_start': start_date.isoformat(),
                    'period_end': end_date.isoformat(),
                    'generated_at': timezone.now().isoformat()
                }
            }
        )
        
        if not created:
            report.revenue = revenue
            report.sales = sales
            report.profit = profit
            report.profit_margin = profit_margin
            report.top_category = top_category
            report.growth_rate = growth_rate
            report.save()
        
        return report 