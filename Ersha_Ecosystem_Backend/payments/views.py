from django.shortcuts import render
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Sum, Count, Avg
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
import asyncio

from .models import (
    PaymentMethod, EscrowAccount, Transaction, Payment, 
    PayoutRequest, PaymentAnalytics
)
from .serializers import (
    PaymentMethodSerializer, EscrowAccountSerializer, TransactionSerializer,
    PaymentSerializer, PayoutRequestSerializer, PaymentAnalyticsSerializer,
    PaymentMethodCreateSerializer, TransactionCreateSerializer, PaymentCreateSerializer,
    PayoutRequestCreateSerializer, PaymentDashboardSerializer, PaymentMethodUpdateSerializer,
    TransactionStatusUpdateSerializer, PaymentStatusUpdateSerializer, 
    PayoutRequestStatusUpdateSerializer, PaymentMethodSearchSerializer,
    TransactionSearchSerializer
)
from .services.processor import PaymentProcessor

class PaymentMethodViewSet(viewsets.ModelViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['method_type', 'provider', 'is_verified', 'is_default', 'is_active']
    search_fields = ['account_number', 'phone_number', 'account_name', 'bank_name']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-is_default', '-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PaymentMethodCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return PaymentMethodUpdateSerializer
        elif self.action == 'search':
            return PaymentMethodSearchSerializer
        return PaymentMethodSerializer
    
    @action(detail=False, methods=['get'])
    def by_user(self, request):
        """Get payment methods for a specific user"""
        user_id = request.query_params.get('user_id', '')
        if user_id:
            methods = self.get_queryset().filter(user_id=user_id, is_active=True)
            serializer = self.get_serializer(methods, many=True)
            return Response(serializer.data)
        return Response({'error': 'User ID required'}, status=400)
    
    @action(detail=False, methods=['get'])
    def verified(self, request):
        """Get only verified payment methods"""
        methods = self.get_queryset().filter(is_verified=True, is_active=True)
        serializer = self.get_serializer(methods, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Get payment methods by type"""
        method_type = request.query_params.get('type', '')
        if method_type:
            methods = self.get_queryset().filter(method_type=method_type, is_active=True)
            serializer = self.get_serializer(methods, many=True)
            return Response(serializer.data)
        return Response({'error': 'Method type required'}, status=400)
    
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Verify a payment method"""
        method = self.get_object()
        verification_code = request.data.get('verification_code', '')
        
        if verification_code == method.verification_token:
            method.is_verified = True
            method.verification_token = ''
            method.verification_expires = None
            method.save()
            return Response({'message': 'Payment method verified successfully'})
        return Response({'error': 'Invalid verification code'}, status=400)

class EscrowAccountViewSet(viewsets.ModelViewSet):
    queryset = EscrowAccount.objects.all()
    serializer_class = EscrowAccountSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['currency', 'is_active']
    search_fields = ['user_id']
    ordering_fields = ['balance', 'created_at']
    ordering = ['-created_at']
    
    @action(detail=False, methods=['get'])
    def by_user(self, request):
        """Get escrow account for a specific user"""
        user_id = request.query_params.get('user_id', '')
        if user_id:
            account = self.get_queryset().filter(user_id=user_id, is_active=True).first()
            if account:
                serializer = self.get_serializer(account)
                return Response(serializer.data)
            return Response({'error': 'Escrow account not found'}, status=404)
        return Response({'error': 'User ID required'}, status=400)

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['transaction_type', 'status', 'escrow_status', 'currency', 'payment_provider']
    search_fields = ['transaction_id', 'sender_name', 'receiver_name', 'product_name', 'order_id']
    ordering_fields = ['amount', 'created_at', 'completed_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TransactionCreateSerializer
        elif self.action in ['update_status']:
            return TransactionStatusUpdateSerializer
        elif self.action == 'search':
            return TransactionSearchSerializer
        return TransactionSerializer
    
    @action(detail=False, methods=['get'])
    def by_user(self, request):
        """Get transactions for a specific user"""
        user_id = request.query_params.get('user_id', '')
        if user_id:
            transactions = self.get_queryset().filter(
                Q(sender_id=user_id) | Q(receiver_id=user_id)
            )
            serializer = self.get_serializer(transactions, many=True)
            return Response(serializer.data)
        return Response({'error': 'User ID required'}, status=400)
    
    @action(detail=False, methods=['get'])
    def by_status(self, request):
        """Get transactions by status"""
        status_filter = request.query_params.get('status', '')
        if status_filter:
            transactions = self.get_queryset().filter(status=status_filter)
            serializer = self.get_serializer(transactions, many=True)
            return Response(serializer.data)
        return Response({'error': 'Status required'}, status=400)
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get pending transactions"""
        transactions = self.get_queryset().filter(status='pending')
        serializer = self.get_serializer(transactions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def completed(self, request):
        """Get completed transactions"""
        transactions = self.get_queryset().filter(status='completed')
        serializer = self.get_serializer(transactions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def overdue(self, request):
        """Get overdue transactions (pending for more than 7 days)"""
        from django.utils import timezone
        cutoff_date = timezone.now() - timedelta(days=7)
        transactions = self.get_queryset().filter(
            status='pending',
            created_at__lt=cutoff_date
        )
        serializer = self.get_serializer(transactions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update transaction status"""
        transaction = self.get_object()
        serializer = TransactionStatusUpdateSerializer(transaction, data=request.data, partial=True)
        
        if serializer.is_valid():
            old_status = transaction.status
            serializer.save()
            
            # If status changed to completed, update completed_at
            if transaction.status == 'completed' and old_status != 'completed':
                transaction.completed_at = timezone.now()
                transaction.save()
            
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    @action(detail=False, methods=['get'])
    def by_transaction_id(self, request):
        """Get transaction by transaction ID"""
        transaction_id = request.query_params.get('transaction_id', '')
        if transaction_id:
            try:
                transaction = self.get_queryset().get(transaction_id=transaction_id)
                serializer = self.get_serializer(transaction)
                return Response(serializer.data)
            except Transaction.DoesNotExist:
                return Response({'error': 'Transaction not found'}, status=404)
        return Response({'error': 'Transaction ID required'}, status=400)

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'currency', 'provider']
    search_fields = ['provider_transaction_id', 'provider_reference']
    ordering_fields = ['amount', 'created_at', 'completed_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PaymentCreateSerializer
        elif self.action in ['update_status']:
            return PaymentStatusUpdateSerializer
        return PaymentSerializer
    
    @action(detail=False, methods=['get'])
    def by_transaction(self, request):
        """Get payment for a specific transaction"""
        transaction_id = request.query_params.get('transaction_id', '')
        if transaction_id:
            try:
                payment = self.get_queryset().get(transaction__transaction_id=transaction_id)
                serializer = self.get_serializer(payment)
                return Response(serializer.data)
            except Payment.DoesNotExist:
                return Response({'error': 'Payment not found'}, status=404)
        return Response({'error': 'Transaction ID required'}, status=400)
    
    @action(detail=False, methods=['get'])
    def by_status(self, request):
        """Get payments by status"""
        status_filter = request.query_params.get('status', '')
        if status_filter:
            payments = self.get_queryset().filter(status=status_filter)
            serializer = self.get_serializer(payments, many=True)
            return Response(serializer.data)
        return Response({'error': 'Status required'}, status=400)
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update payment status"""
        payment = self.get_object()
        serializer = PaymentStatusUpdateSerializer(payment, data=request.data, partial=True)
        
        if serializer.is_valid():
            old_status = payment.status
            serializer.save()
            
            # If status changed to completed, update completed_at
            if payment.status == 'completed' and old_status != 'completed':
                payment.completed_at = timezone.now()
                payment.save()
            
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class PayoutRequestViewSet(viewsets.ModelViewSet):
    queryset = PayoutRequest.objects.all()
    serializer_class = PayoutRequestSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'currency']
    search_fields = ['user_id', 'external_reference']
    ordering_fields = ['amount', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PayoutRequestCreateSerializer
        elif self.action in ['update_status']:
            return PayoutRequestStatusUpdateSerializer
        return PayoutRequestSerializer
    
    @action(detail=False, methods=['get'])
    def by_user(self, request):
        """Get payout requests for a specific user"""
        user_id = request.query_params.get('user_id', '')
        if user_id:
            requests = self.get_queryset().filter(user_id=user_id)
            serializer = self.get_serializer(requests, many=True)
            return Response(serializer.data)
        return Response({'error': 'User ID required'}, status=400)
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get pending payout requests"""
        requests = self.get_queryset().filter(status='pending')
        serializer = self.get_serializer(requests, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update payout request status"""
        payout_request = self.get_object()
        serializer = PayoutRequestStatusUpdateSerializer(payout_request, data=request.data, partial=True)
        
        if serializer.is_valid():
            old_status = payout_request.status
            serializer.save()
            
            # If status changed to approved, update approved_at
            if payout_request.status == 'approved' and old_status != 'approved':
                payout_request.approved_at = timezone.now()
                payout_request.save()
            
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class PaymentAnalyticsViewSet(viewsets.ModelViewSet):
    queryset = PaymentAnalytics.objects.all()
    serializer_class = PaymentAnalyticsSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['date', 'user_id']
    ordering_fields = ['date', 'total_volume', 'success_rate']
    ordering = ['-date']
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get payment dashboard data"""
        user_id = request.query_params.get('user_id', '')
        if not user_id:
            return Response({'error': 'User ID required'}, status=400)
        
        # Calculate dashboard metrics
        today = timezone.now().date()
        last_30_days = today - timedelta(days=30)
        
        # Get user's transactions
        user_transactions = Transaction.objects.filter(
            Q(sender_id=user_id) | Q(receiver_id=user_id)
        )
        
        # Get user's escrow account
        escrow_account = EscrowAccount.objects.filter(user_id=user_id, is_active=True).first()
        total_balance = escrow_account.balance if escrow_account else Decimal('0.0')
        
        # Calculate pending payouts
        pending_payouts = PayoutRequest.objects.filter(
            user_id=user_id,
            status='pending'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.0')
        
        # Calculate monthly income (completed sales in last 30 days)
        monthly_income = user_transactions.filter(
            transaction_type='sale',
            status='completed',
            created_at__gte=last_30_days
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.0')
        
        # Transaction counts
        total_transactions = user_transactions.count()
        completed_transactions = user_transactions.filter(status='completed').count()
        pending_transactions = user_transactions.filter(status='pending').count()
        failed_transactions = user_transactions.filter(status='failed').count()
        
        # Calculate success rate
        success_rate = (completed_transactions / total_transactions * 100) if total_transactions > 0 else 0
        
        # Get recent transactions
        recent_transactions = user_transactions[:5]
        
        # Get user's payment methods
        payment_methods = PaymentMethod.objects.filter(user_id=user_id, is_active=True)
        
        dashboard_data = {
            'total_balance': total_balance,
            'pending_payouts': pending_payouts,
            'monthly_income': monthly_income,
            'total_transactions': total_transactions,
            'completed_transactions': completed_transactions,
            'pending_transactions': pending_transactions,
            'failed_transactions': failed_transactions,
            'success_rate': round(success_rate, 2),
            'recent_transactions': TransactionSerializer(recent_transactions, many=True).data,
            'payment_methods': PaymentMethodSerializer(payment_methods, many=True).data,
        }
        
        return Response(dashboard_data)
    
    @action(detail=False, methods=['get'])
    def performance_metrics(self, request):
        """Get performance metrics for a user"""
        user_id = request.query_params.get('user_id', '')
        if not user_id:
            return Response({'error': 'User ID required'}, status=400)
        
        # Get user's transactions
        user_transactions = Transaction.objects.filter(
            Q(sender_id=user_id) | Q(receiver_id=user_id)
        )
        
        # Calculate metrics
        total_volume = user_transactions.filter(status='completed').aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.0')
        
        total_fees = user_transactions.aggregate(
            total=Sum('processing_fee') + Sum('platform_fee')
        )['total'] or Decimal('0.0')
        
        # Payment method breakdown
        mobile_payments = user_transactions.filter(
            payment_method__method_type='mobile'
        ).count()
        
        bank_transfers = user_transactions.filter(
            payment_method__method_type='bank'
        ).count()
        
        digital_wallet_payments = user_transactions.filter(
            payment_method__method_type='digital'
        ).count()
        
        metrics = {
            'total_volume': total_volume,
            'total_fees': total_fees,
            'mobile_payments': mobile_payments,
            'bank_transfers': bank_transfers,
            'digital_wallet_payments': digital_wallet_payments,
            'total_transactions': user_transactions.count(),
            'completed_transactions': user_transactions.filter(status='completed').count(),
        }
        
        return Response(metrics)

# New Payment Processing Views
class PaymentProcessingViewSet(viewsets.ViewSet):
    """ViewSet for payment processing operations"""
    
    @action(detail=False, methods=['post'])
    def initiate_payment(self, request):
        """Initiate a payment with a payment provider"""
        try:
            # Extract payment data
            amount = request.data.get('amount')
            currency = request.data.get('currency', 'ETB')
            phone_number = request.data.get('phone_number')
            provider = request.data.get('provider', 'mpesa')
            description = request.data.get('description', 'Payment')
            user_id = request.data.get('user_id')
            
            if not all([amount, phone_number, user_id]):
                return Response({
                    'success': False,
                    'error': 'Amount, phone_number, and user_id are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create transaction record
            transaction = Transaction.objects.create(
                transaction_type='sale',
                amount=Decimal(amount),
                currency=currency,
                sender_id=user_id,
                receiver_id='system',  # System account
                sender_name=request.data.get('sender_name', ''),
                receiver_name=request.data.get('receiver_name', ''),
                product_name=request.data.get('product_name', ''),
                description=description,
                status='pending',
                escrow_status='holding'
            )
            
            # Process payment
            processor = PaymentProcessor()
            payment_data = {
                'amount': amount,
                'currency': currency,
                'phone_number': phone_number,
                'reference': transaction.transaction_id,
                'description': description,
                'provider': provider
            }
            
            # Use asyncio to run the async function
            result = asyncio.run(processor.process_payment(payment_data))
            
            if result['success']:
                # Create payment record
                payment = Payment.objects.create(
                    transaction=transaction,
                    amount=Decimal(amount),
                    currency=currency,
                    provider=provider,
                    provider_transaction_id=result.get('transaction_id'),
                    status='pending'
                )
                
                return Response({
                    'success': True,
                    'transaction_id': transaction.transaction_id,
                    'payment_id': payment.id,
                    'provider_transaction_id': result.get('transaction_id'),
                    'checkout_url': result.get('checkout_url'),
                    'message': result.get('message')
                })
            else:
                # Update transaction status
                transaction.status = 'failed'
                transaction.save()
                
                return Response({
                    'success': False,
                    'error': result.get('error'),
                    'transaction_id': transaction.transaction_id
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({
                'success': False,
                'error': f'Payment initiation failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def supported_providers(self, request):
        """Get list of supported payment providers"""
        processor = PaymentProcessor()
        providers = processor.get_supported_providers()
        return Response(providers)
    
    @action(detail=False, methods=['post'])
    def verify_payment(self, request):
        """Verify payment status"""
        try:
            provider = request.data.get('provider')
            transaction_id = request.data.get('transaction_id')
            
            if not provider or not transaction_id:
                return Response({
                    'success': False,
                    'error': 'Provider and transaction_id are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            processor = PaymentProcessor()
            result = asyncio.run(processor.verify_payment(provider, transaction_id))
            
            return Response(result)
            
        except Exception as e:
            return Response({
                'success': False,
                'error': f'Verification failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
