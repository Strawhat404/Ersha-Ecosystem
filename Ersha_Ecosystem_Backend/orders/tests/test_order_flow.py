from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from marketplace.models import Product
from orders.models import Order, OrderItem, Notification
import json

User = get_user_model()

class OrderFlowTestCase(APITestCase):
    def setUp(self):
        # Create test users
        self.farmer = User.objects.create_user(
            email='farmer@test.com',
            password='testpass123',
            first_name='Test',
            last_name='Farmer',
            user_type='farmer',
            is_farmer=True
        )
        
        self.buyer = User.objects.create_user(
            email='buyer@test.com',
            password='testpass123',
            first_name='Test',
            last_name='Buyer'
        )
        
        # Create test product
        self.product = Product.objects.create(
            name='Test Product',
            description='Test Description',
            price=100.00,
            quantity=10,
            unit='kg',
            farmer=self.farmer
        )
        
        # Set up API client
        self.client = APIClient()
        
        # Log in as buyer
        self.client.force_authenticate(user=self.buyer)
    
    def test_order_creation_and_notification_flow(self):
        """Test that order creation creates a notification for the farmer"""
        # Create order
        order_data = {
            'items': [
                {
                    'product_id': self.product.id,
                    'quantity': 2,
                    'price': 100.00
                }
            ],
            'delivery_address': {
                'address': '123 Test St',
                'city': 'Test City',
                'region': 'Test Region',
                'postal_code': '12345',
                'delivery_instructions': 'Test instructions'
            },
            'customer_info': {
                'first_name': 'Test',
                'last_name': 'Buyer',
                'email': 'buyer@test.com',
                'phone': '+1234567890'
            },
            'total_amount': 200.00,
            'payment_provider': 'test'
        }
        
        # Make API request to create order
        response = self.client.post(
            '/api/orders/',
            data=json.dumps(order_data),
            content_type='application/json'
        )
        
        # Verify order was created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue('order_id' in response.data)
        
        # Get the created order
        order_id = response.data['order_id']
        order = Order.objects.get(id=order_id)
        
        # Verify order items
        self.assertEqual(order.items.count(), 1)
        self.assertEqual(order.items.first().product, self.product)
        
        # Verify notification was created for the farmer
        notifications = Notification.objects.filter(user=self.farmer)
        self.assertTrue(notifications.exists())
        
        # Get recent activities for the farmer
        self.client.force_authenticate(user=self.farmer)
        response = self.client.get('/api/orders/recent-activities/')
        
        # Verify activities are returned
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('activities' in response.data)
        self.assertGreater(len(response.data['activities']), 0)
        
        # Check if the order appears in recent activities
        order_activities = [a for a in response.data['activities'] 
                          if a.get('order_id') == order.id]
        self.assertTrue(len(order_activities) > 0)
