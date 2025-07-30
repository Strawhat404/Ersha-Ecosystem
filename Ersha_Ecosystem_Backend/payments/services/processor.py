import asyncio
from decimal import Decimal
from typing import Dict, Any, Optional
from django.conf import settings
from .base import BasePaymentService
from .mpesa import MPesaService
from .chapa import ChapaService

class PaymentProcessor:
    """Main payment processor that handles all payment providers"""
    
    def __init__(self):
        self.providers = {
            'mpesa': MPesaService(),
            'chapa': ChapaService(),
            # Add more providers here
        }
    
    def get_provider(self, provider_name: str) -> Optional[BasePaymentService]:
        """Get payment provider by name"""
        return self.providers.get(provider_name.lower())
    
    async def process_payment(self, transaction_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process payment using the specified provider"""
        
        provider_name = transaction_data.get('provider', 'mpesa')
        provider = self.get_provider(provider_name)
        
        if not provider:
            return {
                'success': False,
                'error': f'Payment provider {provider_name} not supported'
            }
        
        try:
            # Initiate payment
            result = await provider.initiate_payment(
                amount=Decimal(transaction_data['amount']),
                currency=transaction_data.get('currency', 'ETB'),
                phone_number=transaction_data['phone_number'],
                reference=transaction_data['reference'],
                description=transaction_data.get('description', 'Payment')
            )
            
            if result['success']:
                # Update transaction with provider response
                result['provider'] = provider_name
                result['transaction_data'] = transaction_data
                
            return result
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Payment processing failed: {str(e)}'
            }
    
    async def verify_payment(self, provider_name: str, transaction_id: str) -> Dict[str, Any]:
        """Verify payment status"""
        
        provider = self.get_provider(provider_name)
        
        if not provider:
            return {
                'success': False,
                'error': f'Payment provider {provider_name} not supported'
            }
        
        try:
            result = await provider.verify_payment(transaction_id)
            result['provider'] = provider_name
            return result
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Payment verification failed: {str(e)}'
            }
    
    async def process_refund(self, provider_name: str, transaction_id: str, 
                           amount: Decimal, reason: str) -> Dict[str, Any]:
        """Process refund"""
        
        provider = self.get_provider(provider_name)
        
        if not provider:
            return {
                'success': False,
                'error': f'Payment provider {provider_name} not supported'
            }
        
        try:
            result = await provider.refund_payment(transaction_id, amount, reason)
            result['provider'] = provider_name
            return result
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Refund processing failed: {str(e)}'
            }
    
    def get_supported_providers(self) -> Dict[str, Dict[str, Any]]:
        """Get list of supported payment providers"""
        return {
            'mpesa': {
                'name': 'M-Pesa',
                'description': 'Mobile money payment',
                'supported_currencies': ['ETB'],
                'min_amount': 1.0,
                'max_amount': 100000.0
            },
            'chapa': {
                'name': 'Chapa',
                'description': 'Payment gateway',
                'supported_currencies': ['ETB', 'USD'],
                'min_amount': 1.0,
                'max_amount': 1000000.0
            }
        } 