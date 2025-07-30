import aiohttp
import json
from decimal import Decimal
from typing import Dict, Any
from .base import BasePaymentService

class ChapaService(BasePaymentService):
    """Chapa payment gateway service implementation"""
    
    @property
    def provider_name(self) -> str:
        return "chapa"
    
    def __init__(self, api_key: str = None, api_secret: str = None):
        super().__init__(api_key, api_secret)
        self.base_url = "https://api.chapa.co/v1"
    
    async def initiate_payment(self, amount: Decimal, currency: str, phone_number: str, 
                             reference: str, description: str) -> Dict[str, Any]:
        """Initiate Chapa payment"""
        
        url = f"{self.base_url}/transaction/initialize"
        
        payload = {
            "amount": self.format_amount(amount),
            "currency": currency,
            "email": f"user@{reference}.com",  # You might want to pass actual email
            "first_name": "User",
            "last_name": "Customer",
            "tx_ref": reference,
            "callback_url": f"{self.base_url}/api/payments/chapa/callback/",
            "return_url": f"{self.base_url}/api/payments/chapa/return/",
            "customization": {
                "title": "Ersha Ecosystem Payment",
                "description": description
            }
        }
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=headers) as response:
                result = await response.json()
                
                if response.status == 200 and result.get('status') == 'success':
                    return {
                        'success': True,
                        'transaction_id': result.get('data', {}).get('reference'),
                        'checkout_url': result.get('data', {}).get('checkout_url'),
                        'message': 'Payment initiated successfully'
                    }
                else:
                    return {
                        'success': False,
                        'error': result.get('message', 'Payment initiation failed')
                    }
    
    async def verify_payment(self, transaction_id: str) -> Dict[str, Any]:
        """Verify Chapa payment status"""
        
        url = f"{self.base_url}/transaction/verify/{transaction_id}"
        
        headers = {
            "Authorization": f"Bearer {self.api_key}"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers) as response:
                result = await response.json()
                
                if response.status == 200 and result.get('status') == 'success':
                    data = result.get('data', {})
                    return {
                        'success': True,
                        'status': data.get('status'),
                        'amount': data.get('amount'),
                        'currency': data.get('currency'),
                        'transaction_id': data.get('reference')
                    }
                else:
                    return {
                        'success': False,
                        'error': result.get('message', 'Failed to verify payment')
                    }
    
    async def refund_payment(self, transaction_id: str, amount: Decimal, reason: str) -> Dict[str, Any]:
        """Process Chapa refund"""
        # Chapa refund implementation
        # This would require additional API endpoints from Chapa
        return {
            'success': False,
            'error': 'Refund not implemented for Chapa'
        } 