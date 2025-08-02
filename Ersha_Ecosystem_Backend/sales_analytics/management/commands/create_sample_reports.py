from django.core.management.base import BaseCommand
from django.utils import timezone
from decimal import Decimal
from sales_analytics.models import MonthlyReport
from users.models import User


class Command(BaseCommand):
    help = 'Create sample monthly reports for testing'

    def handle(self, *args, **options):
        try:
            # Get the farmer user (Pirate)
            farmer = User.objects.get(username='Pirate')
            self.stdout.write(f'Found farmer: {farmer.username} (ID: {farmer.id})')

            # Clear existing reports for this farmer
            existing_reports = MonthlyReport.objects.filter(farmer=farmer)
            deleted_count = existing_reports.count()
            existing_reports.delete()
            self.stdout.write(f'Deleted {deleted_count} existing reports')

            # Create Report 1
            report1 = MonthlyReport.objects.create(
                farmer=farmer,
                period='March 2024',
                revenue=Decimal('15000.00'),
                sales=45,
                profit=Decimal('4500.00'),
                profit_margin=Decimal('30.00'),
                top_category='Vegetables',
                growth_rate=Decimal('12.5'),
                report_data={'type': 'monthly', 'generated': str(timezone.now())}
            )
            self.stdout.write(f'Created Report 1: ID={report1.id}, Period={report1.period}')

            # Create Report 2
            report2 = MonthlyReport.objects.create(
                farmer=farmer,
                period='April 2024',
                revenue=Decimal('18500.00'),
                sales=52,
                profit=Decimal('5550.00'),
                profit_margin=Decimal('30.00'),
                top_category='Fruits',
                growth_rate=Decimal('15.8'),
                report_data={'type': 'monthly', 'generated': str(timezone.now())}
            )
            self.stdout.write(f'Created Report 2: ID={report2.id}, Period={report2.period}')

            # Verify creation
            all_reports = MonthlyReport.objects.filter(farmer=farmer)
            self.stdout.write(f'\nTotal reports for {farmer.username}: {all_reports.count()}')
            for report in all_reports:
                self.stdout.write(f'  ID: {report.id}, Period: {report.period}, Revenue: ${report.revenue}')

            self.stdout.write(
                self.style.SUCCESS('Successfully created sample monthly reports!')
            )

        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('Farmer user "Pirate" not found. Please check the username.')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating reports: {str(e)}')
            )
