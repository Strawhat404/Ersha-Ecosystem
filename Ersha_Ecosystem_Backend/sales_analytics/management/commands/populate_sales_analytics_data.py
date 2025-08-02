from django.core.management.base import BaseCommand
from django.utils import timezone
from decimal import Decimal
from sales_analytics.models import LoanOffer, CreditScore
from users.models import User


class Command(BaseCommand):
    help = 'Populate sales analytics data with sample loan offers and credit scores'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample loan offers...')
        
        # Create sample loan offers
        loan_offers_data = [
            {
                'bank_name': 'Development Bank of Ethiopia',
                'bank_logo': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=50&h=50&fit=crop&crop=center',
                'loan_type': 'Agricultural Equipment Loan',
                'min_amount': Decimal('50000'),
                'max_amount': Decimal('500000'),
                'interest_rate': Decimal('8.5'),
                'term_months': 24,
                'min_credit_score': 650,
                'min_sales_history': 6,
                'min_revenue': Decimal('100000'),
                'requirements': ['6 months sales history', 'Collateral: Equipment'],
                'disbursement_time': '5-7 days',
                'is_active': True
            },
            {
                'bank_name': 'Commercial Bank of Ethiopia',
                'bank_logo': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=50&h=50&fit=crop&crop=center',
                'loan_type': 'Working Capital Loan',
                'min_amount': Decimal('25000'),
                'max_amount': Decimal('300000'),
                'interest_rate': Decimal('12.0'),
                'term_months': 18,
                'min_credit_score': 550,
                'min_sales_history': 3,
                'min_revenue': Decimal('50000'),
                'requirements': ['3 months sales history', 'Income verification'],
                'disbursement_time': '3-5 days',
                'is_active': True
            },
            {
                'bank_name': 'Awash Bank',
                'bank_logo': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=50&h=50&fit=crop&crop=center',
                'loan_type': 'Seasonal Crop Loan',
                'min_amount': Decimal('10000'),
                'max_amount': Decimal('150000'),
                'interest_rate': Decimal('9.8'),
                'term_months': 12,
                'min_credit_score': 500,
                'min_sales_history': 2,
                'min_revenue': Decimal('25000'),
                'requirements': ['Land ownership proof', 'Crop insurance'],
                'disbursement_time': '2-3 days',
                'is_active': True
            },
            {
                'bank_name': 'Lion International Bank',
                'bank_logo': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=50&h=50&fit=crop&crop=center',
                'loan_type': 'Microfinance Loan',
                'min_amount': Decimal('5000'),
                'max_amount': Decimal('50000'),
                'interest_rate': Decimal('15.0'),
                'term_months': 6,
                'min_credit_score': 400,
                'min_sales_history': 1,
                'min_revenue': Decimal('10000'),
                'requirements': ['Group guarantee', 'Weekly repayments'],
                'disbursement_time': '1-2 days',
                'is_active': True
            },
            {
                'bank_name': 'Cooperative Bank of Oromia',
                'bank_logo': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=50&h=50&fit=crop&crop=center',
                'loan_type': 'Organic Farming Loan',
                'min_amount': Decimal('30000'),
                'max_amount': Decimal('200000'),
                'interest_rate': Decimal('7.5'),
                'term_months': 36,
                'min_credit_score': 700,
                'min_sales_history': 12,
                'min_revenue': Decimal('150000'),
                'requirements': ['Organic certification', 'Environmental impact assessment'],
                'disbursement_time': '7-10 days',
                'is_active': True
            }
        ]

        for loan_data in loan_offers_data:
            loan_offer, created = LoanOffer.objects.get_or_create(
                bank_name=loan_data['bank_name'],
                loan_type=loan_data['loan_type'],
                defaults=loan_data
            )
            if created:
                self.stdout.write(f'Created loan offer: {loan_offer.bank_name} - {loan_offer.loan_type}')
            else:
                self.stdout.write(f'Loan offer already exists: {loan_offer.bank_name} - {loan_offer.loan_type}')

        # Create sample credit scores for existing farmers
        self.stdout.write('Creating sample credit scores for farmers...')
        
        farmers = User.objects.filter(user_type=User.UserType.FARMER)
        for farmer in farmers:
            credit_score, created = CreditScore.objects.get_or_create(
                farmer=farmer,
                defaults={
                    'score': 650,  # Default good score
                    'payment_reliability': Decimal('85.0'),
                    'sales_history_months': 6,
                    'total_revenue': Decimal('125000'),
                    'on_time_deliveries': 45,
                    'customer_satisfaction': Decimal('4.2')
                }
            )
            if created:
                self.stdout.write(f'Created credit score for {farmer.email}: {credit_score.score}')
            else:
                self.stdout.write(f'Credit score already exists for {farmer.email}: {credit_score.score}')

        self.stdout.write(
            self.style.SUCCESS('Successfully populated sales analytics data!')
        ) 