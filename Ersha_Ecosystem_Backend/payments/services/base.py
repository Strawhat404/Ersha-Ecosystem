from abc import ABC, abstractmethod
from decimal import Decimal
from typing import Dict, Any, Optional
from django.conf import settings

class BasePaymentService(ABC):
    """Base class for all payment providers"""
    
    def __init__(self, api_key: str = None, api_secret: str = None):
        self.api_key = api_key or getattr(settings, f'{self.provider_name.upper()}_API_KEY', '')
        self.api_secret = api_secret or getattr(settings, f'{self.provider_name.upper()}_API_SECRET', '')
        self.base_url = getattr(settings, f'{self.provider_name.upper()}_BASE_URL', '')
    
    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Return the provider name"""
        pass
    
    @abstractmethod
    async def initiate_payment(self, amount: Decimal, currency: str, phone_number: str, 
                             reference: str, description: str) -> Dict[str, Any]:
        """Initiate a payment request"""
        pass
    
    @abstractmethod
    async def verify_payment(self, transaction_id: str) -> Dict[str, Any]:
        """Verify payment status"""
        pass
    
    @abstractmethod
    async def refund_payment(self, transaction_id: str, amount: Decimal, reason: str) -> Dict[str, Any]:
        """Process refund"""
        pass
    
    def validate_phone_number(self, phone_number: str) -> bool:
        """Validate Ethiopian phone number format"""
        import re
        # Ethiopian phone number pattern: +251-9XX-XXX-XXX
        pattern = r'^\+251-9\d{2}-\d{3}-\d{3}$'
        return bool(re.match(pattern, phone_number))
    
    def format_amount(self, amount: Decimal) -> str:
        """Format amount for payment provider"""
        return str(amount.quantize(Decimal('0.01')))
    
    def generate_reference(self, transaction_id: str) -> str:
        """Generate unique reference for payment"""
        import uuid
        return f"{transaction_id}-{uuid.uuid4().hex[:8]}" 