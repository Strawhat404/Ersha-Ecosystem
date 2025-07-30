import asyncio
import os
from decimal import Decimal
from django.test import TestCase
from django.conf import settings
from payments.services.chapa import ChapaService

class ChapaServiceTest(TestCase):
    """Test Chapa payment service"""
    
    def setUp(self):
        self.chapa_service = ChapaService()
    
    def test_chapa_configuration(self):
        """Test that Chapa API key is configured"""
        self.assertIsNotNone(settings.CHAPA_API_KEY)
        self.assertNotEqual(settings.CHAPA_API_KEY, 'your_chapa_api_key_here')
        self.assertTrue(settings.CHAPA_API_KEY.startswith('CHASECK_'))
        print(f"Chapa API Key: {settings.CHAPA_API_KEY}")
    
    def test_chapa_service_initialization(self):
        """Test Chapa service initialization"""
        self.assertEqual(self.chapa_service.provider_name, 'chapa')
        self.assertIsNotNone(self.chapa_service.api_key)
        self.assertEqual(self.chapa_service.base_url, 'https://api.chapa.co/v1')
    
    def test_phone_number_validation(self):
        """Test Ethiopian phone number validation"""
        valid_phone = "+251-911-123-456"
        invalid_phone = "911-123-456"
        
        self.assertTrue(self.chapa_service.validate_phone_number(valid_phone))
        self.assertFalse(self.chapa_service.validate_phone_number(invalid_phone))
    
    def test_amount_formatting(self):
        """Test amount formatting"""
        amount = Decimal('1000.50')
        formatted = self.chapa_service.format_amount(amount)
        self.assertEqual(formatted, '1000.50')
    
    def test_reference_generation(self):
        """Test reference generation"""
        transaction_id = "TXN123456"
        reference = self.chapa_service.generate_reference(transaction_id)
        self.assertTrue(reference.startswith(transaction_id))
        self.assertIn('-', reference)

# Note: Actual API calls are not tested here to avoid making real requests
# In a real test environment, you would use mock responses 