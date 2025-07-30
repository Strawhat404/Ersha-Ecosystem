import json
import hmac
import hashlib
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Transaction, Payment
from .services.processor import PaymentProcessor

@csrf_exempt
@require_http_methods(["POST"])
def mpesa_callback(request):
    """Handle M-Pesa payment callback"""
    try:
        data = json.loads(request.body)
        
        # Verify callback signature (implement based on M-Pesa docs)
        # signature = request.headers.get('X-MPESA-Signature')
        # if not verify_signature(data, signature):
        #     return HttpResponse('Unauthorized', status=401)
        
        # Extract payment details
        checkout_request_id = data.get('CheckoutRequestID')
        result_code = data.get('ResultCode')
        result_desc = data.get('ResultDesc')
        amount = data.get('Amount')
        
        # Find the transaction
        try:
            payment = Payment.objects.get(
                provider_transaction_id=checkout_request_id,
                provider='mpesa'
            )
            transaction = payment.transaction
            
            # Update payment status based on result code
            if result_code == '0':  # Success
                payment.status = 'completed'
                transaction.status = 'completed'
                transaction.escrow_status = 'released'
            else:
                payment.status = 'failed'
                transaction.status = 'failed'
            
            payment.save()
            transaction.save()
            
            return HttpResponse('OK', status=200)
            
        except Payment.DoesNotExist:
            return HttpResponse('Payment not found', status=404)
            
    except Exception as e:
        return HttpResponse(f'Error: {str(e)}', status=500)

@csrf_exempt
@require_http_methods(["POST"])
def chapa_callback(request):
    """Handle Chapa payment callback"""
    try:
        data = json.loads(request.body)
        
        # Verify callback signature
        # signature = request.headers.get('X-Chapa-Signature')
        # if not verify_chapa_signature(data, signature):
        #     return HttpResponse('Unauthorized', status=401)
        
        # Extract payment details
        reference = data.get('tx_ref')
        status = data.get('status')
        amount = data.get('amount')
        
        # Find the transaction
        try:
            payment = Payment.objects.get(
                provider_transaction_id=reference,
                provider='chapa'
            )
            transaction = payment.transaction
            
            # Update payment status
            if status == 'success':
                payment.status = 'completed'
                transaction.status = 'completed'
                transaction.escrow_status = 'released'
            else:
                payment.status = 'failed'
                transaction.status = 'failed'
            
            payment.save()
            transaction.save()
            
            return HttpResponse('OK', status=200)
            
        except Payment.DoesNotExist:
            return HttpResponse('Payment not found', status=404)
            
    except Exception as e:
        return HttpResponse(f'Error: {str(e)}', status=500)

@api_view(['POST'])
def verify_payment(request):
    """Manual payment verification endpoint"""
    try:
        provider = request.data.get('provider')
        transaction_id = request.data.get('transaction_id')
        
        if not provider or not transaction_id:
            return Response({
                'success': False,
                'error': 'Provider and transaction_id are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        processor = PaymentProcessor()
        # Use asyncio to run the async function
        import asyncio
        result = asyncio.run(processor.verify_payment(provider, transaction_id))
        
        return Response(result)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Verification failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def verify_signature(data: dict, signature: str) -> bool:
    """Verify webhook signature"""
    # Implement signature verification based on provider documentation
    # This is a placeholder - implement actual verification logic
    return True

def verify_chapa_signature(data: dict, signature: str) -> bool:
    """Verify Chapa webhook signature"""
    # Implement Chapa signature verification
    # This is a placeholder - implement actual verification logic
    return True 