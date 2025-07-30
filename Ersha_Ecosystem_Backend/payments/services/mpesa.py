import aiohttp
import json
import base64
from decimal import Decimal
from typing import Dict, Any
from .base import BasePaymentService

class MPesaService(BasePaymentService):
    """M-Pesa payment service implementation"""
    
    @property
    def provider_name(self) -> str:
        return "mpesa"
    
    def __init__(self, api_key: str = None, api_secret: str = None):
        super().__init__(api_key, api_secret)
        self.base_url = "https://sandbox.safaricom.co.ke"  # Change to production URL
        self.business_short_code = "174379"  # Your business short code
        self.passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
    
    async def initiate_payment(self, amount: Decimal, currency: str, phone_number: str, 
                             reference: str, description: str) -> Dict[str, Any]:
        """Initiate M-Pesa STK Push payment"""
        
        if not self.validate_phone_number(phone_number):
            raise ValueError("Invalid phone number format")
        
        # Remove +251 and add 254 for M-Pesa
        formatted_phone = phone_number.replace('+251', '254')
        
        url = f"{self.base_url}/mpesa/stkpush/v1/processrequest"
        
        # Generate timestamp
        import time
        timestamp = time.strftime('%Y%m%d%H%M%S')
        
        # Generate password
        password = self._generate_password(timestamp)
        
        payload = {
            "BusinessShortCode": self.business_short_code,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(amount),
            "PartyA": formatted_phone,
            "PartyB": self.business_short_code,
            "PhoneNumber": formatted_phone,
            "CallBackURL": f"{self.base_url}/api/payments/mpesa/callback/",
            "AccountReference": reference,
            "TransactionDesc": description
        }
        
        headers = {
            "Authorization": f"Bearer {await self._get_access_token()}",
            "Content-Type": "application/json"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=headers) as response:
                result = await response.json()
                
                if response.status == 200 and result.get('ResponseCode') == '0':
                    return {
                        'success': True,
                        'transaction_id': result.get('CheckoutRequestID'),
                        'merchant_request_id': result.get('MerchantRequestID'),
                        'message': 'Payment initiated successfully'
                    }
                else:
                    return {
                        'success': False,
                        'error': result.get('errorMessage', 'Payment initiation failed'),
                        'response_code': result.get('ResponseCode')
                    }
    
    async def verify_payment(self, transaction_id: str) -> Dict[str, Any]:
        """Verify M-Pesa payment status"""
        
        url = f"{self.base_url}/mpesa/stkpushquery/v1/query"
        
        import time
        timestamp = time.strftime('%Y%m%d%H%M%S')
        password = self._generate_password(timestamp)
        
        payload = {
            "BusinessShortCode": self.business_short_code,
            "Password": password,
            "Timestamp": timestamp,
            "CheckoutRequestID": transaction_id
        }
        
        headers = {
            "Authorization": f"Bearer {await self._get_access_token()}",
            "Content-Type": "application/json"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=headers) as response:
                result = await response.json()
                
                if response.status == 200:
                    return {
                        'success': True,
                        'status': result.get('ResultCode'),
                        'description': result.get('ResultDesc'),
                        'transaction_id': result.get('CheckoutRequestID')
                    }
                else:
                    return {
                        'success': False,
                        'error': 'Failed to verify payment'
                    }
    
    async def refund_payment(self, transaction_id: str, amount: Decimal, reason: str) -> Dict[str, Any]:
        """Process M-Pesa refund"""
        # M-Pesa refund implementation
        # This would require additional API endpoints from M-Pesa
        return {
            'success': False,
            'error': 'Refund not implemented for M-Pesa'
        }
    
    async def _get_access_token(self) -> str:
        """Get M-Pesa access token"""
        url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"
        
        # Create basic auth header
        credentials = f"{self.api_key}:{self.api_secret}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()
        
        headers = {
            "Authorization": f"Basic {encoded_credentials}"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers) as response:
                result = await response.json()
                return result.get('access_token', '')
    
    def _generate_password(self, timestamp: str) -> str:
        """Generate M-Pesa API password"""
        string_to_encode = f"{self.business_short_code}{self.passkey}{timestamp}"
        return base64.b64encode(string_to_encode.encode()).decode() 