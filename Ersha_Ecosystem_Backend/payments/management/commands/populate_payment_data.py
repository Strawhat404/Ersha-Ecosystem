from django.core.management.base import BaseCommand
from payments.models import (
    PaymentMethod, EscrowAccount, Transaction, Payment, 
    PayoutRequest, PaymentAnalytics
)
from django.utils import timezone
from decimal import Decimal
import random
from datetime import timedelta

class Command(BaseCommand):
    help = 'Populate the payment models with sample data for Ethiopian payment system.'

    def handle(self, *args, **options):
        # Create Payment Methods
        payment_methods_data = [
            {
                'user_id': 'farmer_001',
                'method_type': 'mobile',
                'provider': 'm_pesa',
                'phone_number': '+251-911-123-456',
                'account_name': 'Abebe Kebede',
                'is_verified': True,
                'is_default': True,
                'is_active': True
            },
            {
                'user_id': 'farmer_001',
                'method_type': 'bank',
                'provider': 'commercial_bank',
                'account_number': '1000123456789',
                'account_name': 'Abebe Kebede',
                'bank_name': 'Commercial Bank of Ethiopia',
                'branch_code': 'CBE001',
                'is_verified': True,
                'is_default': False,
                'is_active': True
            },
            {
                'user_id': 'merchant_001',
                'method_type': 'mobile',
                'provider': 'telebirr',
                'phone_number': '+251-922-234-567',
                'account_name': 'Kebede Abebe',
                'is_verified': True,
                'is_default': True,
                'is_active': True
            },
            {
                'user_id': 'merchant_001',
                'method_type': 'digital',
                'provider': 'hellocash',
                'phone_number': '+251-933-345-678',
                'account_name': 'Kebede Abebe',
                'is_verified': False,
                'is_default': False,
                'is_active': True
            },
            {
                'user_id': 'farmer_002',
                'method_type': 'bank',
                'provider': 'cbe_birr',
                'account_number': '2000987654321',
                'account_name': 'Tigist Haile',
                'bank_name': 'CBE Birr',
                'branch_code': 'CBE002',
                'is_verified': True,
                'is_default': True,
                'is_active': True
            }
        ]

        payment_methods = []
        for method_data in payment_methods_data:
            method, created = PaymentMethod.objects.get_or_create(
                user_id=method_data['user_id'],
                provider=method_data['provider'],
                defaults=method_data
            )
            payment_methods.append(method)
            if created:
                self.stdout.write(f"Created payment method: {method.provider} for {method.user_id}")

        # Create Escrow Accounts
        escrow_accounts_data = [
            {
                'user_id': 'farmer_001',
                'balance': 8540.50,
                'currency': 'ETB',
                'is_active': True
            },
            {
                'user_id': 'merchant_001',
                'balance': 12500.75,
                'currency': 'ETB',
                'is_active': True
            },
            {
                'user_id': 'farmer_002',
                'balance': 3200.25,
                'currency': 'ETB',
                'is_active': True
            }
        ]

        for account_data in escrow_accounts_data:
            account, created = EscrowAccount.objects.get_or_create(
                user_id=account_data['user_id'],
                defaults=account_data
            )
            if created:
                self.stdout.write(f"Created escrow account: {account.user_id} - {account.currency} {account.balance}")

        # Create Transactions
        transactions_data = [
            {
                'transaction_id': 'TXN001',
                'transaction_type': 'sale',
                'amount': 2450.00,
                'currency': 'ETB',
                'status': 'completed',
                'sender_id': 'farmer_001',
                'receiver_id': 'merchant_001',
                'sender_name': 'Abebe Kebede',
                'receiver_name': 'Addis Market Hub',
                'product_name': 'Premium Fresh Carrots',
                'product_description': 'Fresh organic carrots from Oromia farms',
                'quantity': '500kg',
                'order_id': 'ORD2024001',
                'payment_method': payment_methods[0],  # M-Pesa
                'payment_provider': 'M-Pesa',
                'escrow_status': 'released',
                'processing_fee': 25.00,
                'platform_fee': 12.50,
                'description': 'Sale of fresh carrots to market hub',
                'completed_at': timezone.now() - timedelta(days=2)
            },
            {
                'transaction_id': 'TXN002',
                'transaction_type': 'purchase',
                'amount': 1890.50,
                'currency': 'ETB',
                'status': 'pending',
                'sender_id': 'farmer_001',
                'receiver_id': 'merchant_002',
                'sender_name': 'Abebe Kebede',
                'receiver_name': 'Highland Coffee Growers',
                'product_name': 'Ethiopian Coffee Beans',
                'product_description': 'Premium Arabica coffee beans',
                'quantity': '100kg',
                'order_id': 'ORD2024002',
                'payment_method': payment_methods[1],  # Bank account
                'payment_provider': 'CBE Birr',
                'escrow_status': 'holding',
                'processing_fee': 20.00,
                'platform_fee': 10.00,
                'description': 'Purchase of coffee beans from highland growers'
            },
            {
                'transaction_id': 'TXN003',
                'transaction_type': 'sale',
                'amount': 3200.00,
                'currency': 'ETB',
                'status': 'completed',
                'sender_id': 'farmer_002',
                'receiver_id': 'merchant_001',
                'sender_name': 'Tigist Haile',
                'receiver_name': 'Fresh Foods Ltd',
                'product_name': 'Sweet Red Apples',
                'product_description': 'Fresh red apples from Awash farms',
                'quantity': '800kg',
                'order_id': 'ORD2024003',
                'payment_method': payment_methods[4],  # CBE Birr
                'payment_provider': 'CBE Birr',
                'escrow_status': 'released',
                'processing_fee': 30.00,
                'platform_fee': 15.00,
                'description': 'Sale of fresh apples to food company',
                'completed_at': timezone.now() - timedelta(days=1)
            },
            {
                'transaction_id': 'TXN004',
                'transaction_type': 'sale',
                'amount': 1800.00,
                'currency': 'ETB',
                'status': 'processing',
                'sender_id': 'farmer_001',
                'receiver_id': 'merchant_003',
                'sender_name': 'Abebe Kebede',
                'receiver_name': 'Organic Market',
                'product_name': 'Organic Tomatoes',
                'product_description': 'Fresh organic tomatoes',
                'quantity': '300kg',
                'order_id': 'ORD2024004',
                'payment_method': payment_methods[0],  # M-Pesa
                'payment_provider': 'M-Pesa',
                'escrow_status': 'holding',
                'processing_fee': 18.00,
                'platform_fee': 9.00,
                'description': 'Sale of organic tomatoes'
            },
            {
                'transaction_id': 'TXN005',
                'transaction_type': 'purchase',
                'amount': 950.00,
                'currency': 'ETB',
                'status': 'failed',
                'sender_id': 'farmer_002',
                'receiver_id': 'merchant_004',
                'sender_name': 'Tigist Haile',
                'receiver_name': 'Seed Suppliers',
                'product_name': 'Quality Seeds',
                'product_description': 'High-quality agricultural seeds',
                'quantity': '50kg',
                'order_id': 'ORD2024005',
                'payment_method': payment_methods[4],  # CBE Birr
                'payment_provider': 'CBE Birr',
                'escrow_status': 'disputed',
                'processing_fee': 10.00,
                'platform_fee': 5.00,
                'description': 'Purchase of quality seeds'
            }
        ]

        transactions = []
        for transaction_data in transactions_data:
            transaction, created = Transaction.objects.get_or_create(
                transaction_id=transaction_data['transaction_id'],
                defaults=transaction_data
            )
            transactions.append(transaction)
            if created:
                self.stdout.write(f"Created transaction: {transaction.transaction_id}")

        # Create Payments
        payments_data = [
            {
                'transaction': transactions[0],
                'amount': 2450.00,
                'currency': 'ETB',
                'status': 'completed',
                'provider': 'M-Pesa',
                'provider_transaction_id': 'MP123456789',
                'payment_method': payment_methods[0],
                'is_verified': True,
                'completed_at': timezone.now() - timedelta(days=2)
            },
            {
                'transaction': transactions[1],
                'amount': 1890.50,
                'currency': 'ETB',
                'status': 'pending',
                'provider': 'CBE Birr',
                'provider_transaction_id': 'BT987654321',
                'payment_method': payment_methods[1],
                'is_verified': False
            },
            {
                'transaction': transactions[2],
                'amount': 3200.00,
                'currency': 'ETB',
                'status': 'completed',
                'provider': 'CBE Birr',
                'provider_transaction_id': 'BT555666777',
                'payment_method': payment_methods[4],
                'is_verified': True,
                'completed_at': timezone.now() - timedelta(days=1)
            },
            {
                'transaction': transactions[3],
                'amount': 1800.00,
                'currency': 'ETB',
                'status': 'processing',
                'provider': 'M-Pesa',
                'provider_transaction_id': 'MP111222333',
                'payment_method': payment_methods[0],
                'is_verified': False
            },
            {
                'transaction': transactions[4],
                'amount': 950.00,
                'currency': 'ETB',
                'status': 'failed',
                'provider': 'CBE Birr',
                'provider_transaction_id': 'BT444555666',
                'payment_method': payment_methods[4],
                'is_verified': False
            }
        ]

        for payment_data in payments_data:
            Payment.objects.get_or_create(
                transaction=payment_data['transaction'],
                defaults=payment_data
            )

        # Create Payout Requests
        payout_requests_data = [
            {
                'user_id': 'farmer_001',
                'amount': 1890.50,
                'currency': 'ETB',
                'status': 'pending',
                'payment_method': payment_methods[0],  # M-Pesa
                'processing_fee': 15.00,
                'reason': 'Withdrawal of pending payment for coffee beans'
            },
            {
                'user_id': 'farmer_002',
                'amount': 3200.00,
                'currency': 'ETB',
                'status': 'approved',
                'payment_method': payment_methods[4],  # CBE Birr
                'processing_fee': 25.00,
                'approved_by': 'admin_001',
                'approved_at': timezone.now() - timedelta(days=1),
                'reason': 'Withdrawal of completed apple sale'
            }
        ]

        for payout_data in payout_requests_data:
            PayoutRequest.objects.get_or_create(
                user_id=payout_data['user_id'],
                amount=payout_data['amount'],
                status=payout_data['status'],
                defaults=payout_data
            )

        # Create Payment Analytics
        analytics_data = {
            'date': timezone.now().date(),
            'user_id': 'farmer_001',
            'total_transactions': 3,
            'completed_transactions': 2,
            'failed_transactions': 0,
            'pending_transactions': 1,
            'total_volume': 6140.50,
            'total_fees': 67.50,
            'net_volume': 6073.00,
            'mobile_payments': 2,
            'bank_transfers': 1,
            'digital_wallet_payments': 0,
            'success_rate': 66.67
        }

        PaymentAnalytics.objects.get_or_create(
            date=analytics_data['date'],
            user_id=analytics_data['user_id'],
            defaults=analytics_data
        )

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created payment data: {len(payment_methods)} payment methods, {len(transactions)} transactions, {len(payments_data)} payments, {len(payout_requests_data)} payout requests')
        ) 