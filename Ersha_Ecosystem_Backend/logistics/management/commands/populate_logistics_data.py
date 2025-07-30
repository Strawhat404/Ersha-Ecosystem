from django.core.management.base import BaseCommand
from logistics.models import (
    ServiceProvider, Delivery, DeliveryTracking, 
    CostEstimate, LogisticsTransaction, LogisticsAnalytics
)
from django.utils import timezone
from decimal import Decimal
import random
from datetime import timedelta

class Command(BaseCommand):
    help = 'Populate the logistics models with sample data for Ethiopian logistics services.'

    def handle(self, *args, **options):
        # Create Service Providers
        providers_data = [
            {
                'name': 'FastFreight Ethiopia',
                'logo_url': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=50&h=50&fit=crop&crop=center',
                'description': 'Reliable cold chain logistics for fresh produce',
                'rating': 4.8,
                'total_deliveries': 2450,
                'avg_delivery_time': '2-3 days',
                'price_per_km': 8.50,
                'coverage_areas': ['Addis Ababa', 'Oromia', 'Amhara', 'SNNPR'],
                'specialties': ['Perishables', 'Bulk Goods'],
                'verified': True,
                'contact_phone': '+251-911-123-456',
                'contact_email': 'info@fastfreight.et',
                'address': 'Bole, Addis Ababa, Ethiopia'
            },
            {
                'name': 'EthioLogistics',
                'logo_url': 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=50&h=50&fit=crop&crop=center',
                'description': 'Fast and secure delivery services nationwide',
                'rating': 4.6,
                'total_deliveries': 3200,
                'avg_delivery_time': '1-2 days',
                'price_per_km': 12.00,
                'coverage_areas': ['Addis Ababa', 'Dire Dawa', 'Hawassa'],
                'specialties': ['Express Delivery', 'Documents'],
                'verified': True,
                'contact_phone': '+251-922-234-567',
                'contact_email': 'contact@ethiologistics.et',
                'address': 'Kazanchis, Addis Ababa, Ethiopia'
            },
            {
                'name': 'RapidTransport',
                'logo_url': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=50&h=50&fit=crop&crop=center',
                'description': 'Specialized in rural and agricultural transport',
                'rating': 4.4,
                'total_deliveries': 1890,
                'avg_delivery_time': '3-5 days',
                'price_per_km': 6.75,
                'coverage_areas': ['Rural Areas', 'Remote Locations'],
                'specialties': ['Agricultural Products', 'Heavy Cargo'],
                'verified': False,
                'contact_phone': '+251-933-345-678',
                'contact_email': 'service@rapidtransport.et',
                'address': 'Meskel Square, Addis Ababa, Ethiopia'
            },
            {
                'name': 'GreenExpress',
                'logo_url': 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=50&h=50&fit=crop&crop=center',
                'description': 'Eco-friendly logistics for sustainable agriculture',
                'rating': 4.7,
                'total_deliveries': 1560,
                'avg_delivery_time': '2-4 days',
                'price_per_km': 9.25,
                'coverage_areas': ['Addis Ababa', 'Oromia', 'Tigray'],
                'specialties': ['Organic Products', 'Sustainable Transport'],
                'verified': True,
                'contact_phone': '+251-944-456-789',
                'contact_email': 'hello@greenexpress.et',
                'address': 'Saris, Addis Ababa, Ethiopia'
            },
            {
                'name': 'MountainCargo',
                'logo_url': 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=50&h=50&fit=crop&crop=center',
                'description': 'Specialized in highland and mountain region transport',
                'rating': 4.3,
                'total_deliveries': 980,
                'avg_delivery_time': '4-6 days',
                'price_per_km': 7.50,
                'coverage_areas': ['Highland Regions', 'Mountain Areas'],
                'specialties': ['Highland Products', 'Mountain Transport'],
                'verified': True,
                'contact_phone': '+251-955-567-890',
                'contact_email': 'info@mountaincargo.et',
                'address': 'Entoto, Addis Ababa, Ethiopia'
            }
        ]

        providers = []
        for provider_data in providers_data:
            provider, created = ServiceProvider.objects.get_or_create(
                name=provider_data['name'],
                defaults=provider_data
            )
            providers.append(provider)
            if created:
                self.stdout.write(f"Created provider: {provider.name}")

        # Create Deliveries
        deliveries_data = [
            {
                'order_id': 'ORD2024001',
                'tracking_number': 'TR123456789ET',
                'product_name': 'Premium Fresh Carrots',
                'product_description': 'Fresh organic carrots from Oromia farms',
                'quantity': '500kg',
                'weight_kg': 500.0,
                'origin': 'Oromia Farm',
                'destination': 'Addis Market Hub',
                'distance_km': 85.0,
                'status': 'in_transit',
                'progress_percentage': 65,
                'current_location': 'Bishoftu Checkpoint',
                'estimated_delivery': timezone.now() + timedelta(days=2),
                'provider': providers[0],
                'cost': 450.00,
                'customer_name': 'Addis Market Hub',
                'customer_phone': '+251-911-111-111',
                'customer_email': 'orders@addismarket.et',
                'is_urgent': False,
                'requires_signature': True
            },
            {
                'order_id': 'ORD2024002',
                'tracking_number': 'TR987654321ET',
                'product_name': 'Ethiopian Coffee Beans',
                'product_description': 'Premium Arabica coffee beans',
                'quantity': '100kg',
                'weight_kg': 100.0,
                'origin': 'Highland Coffee Growers',
                'destination': 'Hawassa Distribution',
                'distance_km': 45.0,
                'status': 'delivered',
                'progress_percentage': 100,
                'current_location': 'Hawassa Warehouse',
                'estimated_delivery': timezone.now() - timedelta(days=1),
                'actual_delivery': timezone.now() - timedelta(days=1),
                'provider': providers[1],
                'cost': 280.00,
                'customer_name': 'Hawassa Distribution',
                'customer_phone': '+251-922-222-222',
                'customer_email': 'delivery@hawassadist.et',
                'is_urgent': False,
                'requires_signature': False
            },
            {
                'order_id': 'ORD2024003',
                'tracking_number': 'TR555666777ET',
                'product_name': 'Sweet Red Apples',
                'product_description': 'Fresh red apples from Awash farms',
                'quantity': '800kg',
                'weight_kg': 800.0,
                'origin': 'AwashAgro Industry',
                'destination': 'Fresh Foods Ltd',
                'distance_km': 120.0,
                'status': 'pending',
                'progress_percentage': 0,
                'current_location': 'Awaiting Pickup',
                'estimated_delivery': timezone.now() + timedelta(days=3),
                'provider': providers[2],
                'cost': 720.00,
                'customer_name': 'Fresh Foods Ltd',
                'customer_phone': '+251-933-333-333',
                'customer_email': 'orders@freshfoods.et',
                'is_urgent': True,
                'requires_signature': True
            },
            {
                'order_id': 'ORD2024004',
                'tracking_number': 'TR111222333ET',
                'product_name': 'Organic Tomatoes',
                'product_description': 'Fresh organic tomatoes',
                'quantity': '300kg',
                'weight_kg': 300.0,
                'origin': 'Green Valley Farms',
                'destination': 'Organic Market',
                'distance_km': 60.0,
                'status': 'out_for_delivery',
                'progress_percentage': 90,
                'current_location': 'Last Mile Delivery',
                'estimated_delivery': timezone.now() + timedelta(hours=4),
                'provider': providers[3],
                'cost': 360.00,
                'customer_name': 'Organic Market',
                'customer_phone': '+251-944-444-444',
                'customer_email': 'delivery@organicmarket.et',
                'is_urgent': False,
                'requires_signature': False
            },
            {
                'order_id': 'ORD2024005',
                'tracking_number': 'TR444555666ET',
                'product_name': 'Mountain Honey',
                'product_description': 'Pure mountain honey from Tigray',
                'quantity': '50kg',
                'weight_kg': 50.0,
                'origin': 'Tigray Highlands',
                'destination': 'Premium Foods',
                'distance_km': 200.0,
                'status': 'picked_up',
                'progress_percentage': 25,
                'current_location': 'Mekelle Hub',
                'estimated_delivery': timezone.now() + timedelta(days=5),
                'provider': providers[4],
                'cost': 400.00,
                'customer_name': 'Premium Foods',
                'customer_phone': '+251-955-555-555',
                'customer_email': 'orders@premiumfoods.et',
                'is_urgent': False,
                'requires_signature': True
            }
        ]

        deliveries = []
        for delivery_data in deliveries_data:
            delivery, created = Delivery.objects.get_or_create(
                tracking_number=delivery_data['tracking_number'],
                defaults=delivery_data
            )
            deliveries.append(delivery)
            if created:
                self.stdout.write(f"Created delivery: {delivery.tracking_number}")

        # Create Tracking Events
        tracking_events = [
            # For delivery 1 (in_transit)
            {'delivery': deliveries[0], 'location': 'Oromia Farm', 'status': 'Picked Up', 'description': 'Package picked up from origin'},
            {'delivery': deliveries[0], 'location': 'Bishoftu Checkpoint', 'status': 'In Transit', 'description': 'Package in transit to destination'},
            
            # For delivery 2 (delivered)
            {'delivery': deliveries[1], 'location': 'Highland Coffee Growers', 'status': 'Picked Up', 'description': 'Package picked up from origin'},
            {'delivery': deliveries[1], 'location': 'Hawassa Warehouse', 'status': 'Delivered', 'description': 'Package successfully delivered'},
            
            # For delivery 3 (pending)
            {'delivery': deliveries[2], 'location': 'AwashAgro Industry', 'status': 'Confirmed', 'description': 'Order confirmed, awaiting pickup'},
            
            # For delivery 4 (out_for_delivery)
            {'delivery': deliveries[3], 'location': 'Green Valley Farms', 'status': 'Picked Up', 'description': 'Package picked up from origin'},
            {'delivery': deliveries[3], 'location': 'Last Mile Delivery', 'status': 'Out for Delivery', 'description': 'Package out for final delivery'},
            
            # For delivery 5 (picked_up)
            {'delivery': deliveries[4], 'location': 'Tigray Highlands', 'status': 'Picked Up', 'description': 'Package picked up from origin'},
            {'delivery': deliveries[4], 'location': 'Mekelle Hub', 'status': 'In Transit', 'description': 'Package in transit to destination'},
        ]

        for event_data in tracking_events:
            DeliveryTracking.objects.get_or_create(
                delivery=event_data['delivery'],
                location=event_data['location'],
                status=event_data['status'],
                defaults={'description': event_data['description']}
            )

        # Create Cost Estimates
        estimates_data = [
            {
                'origin': 'Oromia Farm',
                'destination': 'Addis Market Hub',
                'distance_km': 85.0,
                'weight_kg': 500.0,
                'urgency': 'standard',
                'base_cost': 100.0,
                'distance_cost': 722.5,
                'weight_cost': 1000.0,
                'urgency_multiplier': 1.0,
                'total_cost': 1822.5,
                'estimated_delivery_time': '2-4 days'
            },
            {
                'origin': 'Highland Coffee Growers',
                'destination': 'Hawassa Distribution',
                'distance_km': 45.0,
                'weight_kg': 100.0,
                'urgency': 'express',
                'base_cost': 100.0,
                'distance_cost': 382.5,
                'weight_cost': 200.0,
                'urgency_multiplier': 1.5,
                'total_cost': 1023.75,
                'estimated_delivery_time': '1-2 days'
            }
        ]

        for estimate_data in estimates_data:
            CostEstimate.objects.get_or_create(
                origin=estimate_data['origin'],
                destination=estimate_data['destination'],
                weight_kg=estimate_data['weight_kg'],
                defaults=estimate_data
            )

        # Create Transactions
        transactions_data = [
            {
                'delivery': deliveries[0],
                'transaction_type': 'payment',
                'amount': 450.00,
                'status': 'completed',
                'payment_method': 'M-Pesa',
                'payment_reference': 'MP123456789'
            },
            {
                'delivery': deliveries[1],
                'transaction_type': 'payment',
                'amount': 280.00,
                'status': 'completed',
                'payment_method': 'Bank Transfer',
                'payment_reference': 'BT987654321'
            },
            {
                'delivery': deliveries[2],
                'transaction_type': 'payment',
                'amount': 720.00,
                'status': 'pending',
                'payment_method': 'CBE Birr',
                'payment_reference': 'CB555666777'
            }
        ]

        for transaction_data in transactions_data:
            LogisticsTransaction.objects.get_or_create(
                delivery=transaction_data['delivery'],
                payment_reference=transaction_data['payment_reference'],
                defaults=transaction_data
            )

        # Create Analytics
        analytics_data = {
            'date': timezone.now().date(),
            'total_deliveries': 5,
            'completed_deliveries': 1,
            'failed_deliveries': 0,
            'total_revenue': 1450.00,
            'avg_delivery_time': 2.5,
            'customer_satisfaction': 4.6,
            'top_providers': [
                {'name': 'FastFreight Ethiopia', 'deliveries': 1},
                {'name': 'EthioLogistics', 'deliveries': 1},
                {'name': 'RapidTransport', 'deliveries': 1}
            ]
        }

        LogisticsAnalytics.objects.get_or_create(
            date=analytics_data['date'],
            defaults=analytics_data
        )

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created logistics data: {len(providers)} providers, {len(deliveries)} deliveries, {len(tracking_events)} tracking events')
        ) 