from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Product
from datetime import date, timedelta
import tempfile
import os
from PIL import Image

User = get_user_model()


class ProductAPITestCase(APITestCase):
    def setUp(self):
        """Set up test data"""
        # Create a farmer user
        self.farmer = User.objects.create_user(
            username='farmer@test.com',
            email='farmer@test.com',
            password='testpass123',
            first_name='John',
            last_name='Farmer',
            user_type=User.UserType.FARMER,
            region='Addis Ababa'
        )
        
        # Create a merchant user
        self.merchant = User.objects.create_user(
            username='merchant@test.com',
            email='merchant@test.com',
            password='testpass123',
            first_name='Jane',
            last_name='Merchant',
            user_type=User.UserType.BUYER,
            region='Addis Ababa'
        )
        
        # Create a test product
        self.product = Product.objects.create(
            farmer=self.farmer,
            name='Test Tomatoes',
            description='Fresh organic tomatoes',
            price=45.00,
            quantity=100.0,
            unit='kg',
            harvest_date=date.today() - timedelta(days=5),
            organic=True
        )
        
        self.client = APIClient()
    
    def create_test_image(self):
        """Create a test image file"""
        image = Image.new('RGB', (100, 100), color='red')
        tmp_file = tempfile.NamedTemporaryFile(suffix='.jpg', delete=False)
        image.save(tmp_file.name, 'JPEG')
        return tmp_file.name
    
    def test_farmer_can_create_product(self):
        """Test that a farmer can create a product listing"""
        self.client.force_authenticate(user=self.farmer)
        
        data = {
            'name': 'Fresh Carrots',
            'description': 'Organic carrots from my farm',
            'price': 35.00,
            'quantity': 50.0,
            'unit': 'kg',
            'harvest_date': date.today().isoformat(),
            'organic': True
        }
        
        response = self.client.post('/api/products/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 2)
        
        product = Product.objects.get(name='Fresh Carrots')
        self.assertEqual(product.farmer, self.farmer)
        self.assertEqual(product.price, 35.00)
        self.assertTrue(product.organic)
    
    def test_merchant_cannot_create_product(self):
        """Test that a merchant cannot create a product listing"""
        self.client.force_authenticate(user=self.merchant)
        
        data = {
            'name': 'Fresh Carrots',
            'description': 'Organic carrots from my farm',
            'price': 35.00,
            'quantity': 50.0,
            'unit': 'kg',
            'harvest_date': date.today().isoformat(),
            'organic': True
        }
        
        response = self.client.post('/api/products/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Product.objects.count(), 1)  # Only the original product
    
    def test_unauthenticated_user_cannot_create_product(self):
        """Test that unauthenticated users cannot create products"""
        data = {
            'name': 'Fresh Carrots',
            'description': 'Organic carrots from my farm',
            'price': 35.00,
            'quantity': 50.0,
            'unit': 'kg',
            'harvest_date': date.today().isoformat(),
            'organic': True
        }
        
        response = self.client.post('/api/products/', data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_farmer_can_view_own_products(self):
        """Test that a farmer can view their own products"""
        self.client.force_authenticate(user=self.farmer)
        
        response = self.client.get('/api/products/my_products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Tomatoes')
    
    def test_merchant_cannot_view_farmer_products_endpoint(self):
        """Test that merchants cannot access the my_products endpoint"""
        self.client.force_authenticate(user=self.merchant)
        
        response = self.client.get('/api/products/my_products/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_product_validation(self):
        """Test product validation rules"""
        self.client.force_authenticate(user=self.farmer)
        
        # Test negative price
        data = {
            'name': 'Test Product',
            'description': 'Test description',
            'price': -10.00,
            'quantity': 50.0,
            'unit': 'kg',
            'harvest_date': date.today().isoformat(),
            'organic': False
        }
        
        response = self.client.post('/api/products/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Test negative quantity
        data['price'] = 10.00
        data['quantity'] = -5.0
        
        response = self.client.post('/api/products/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Test future harvest date
        data['quantity'] = 5.0
        data['harvest_date'] = (date.today() + timedelta(days=30)).isoformat()
        
        response = self.client.post('/api/products/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_product_with_image(self):
        """Test creating a product with an image"""
        self.client.force_authenticate(user=self.farmer)
        
        # Create a test image
        image_path = self.create_test_image()
        
        try:
            with open(image_path, 'rb') as image_file:
                data = {
                    'name': 'Product with Image',
                    'description': 'Test product with image',
                    'price': 25.00,
                    'quantity': 30.0,
                    'unit': 'kg',
                    'harvest_date': date.today().isoformat(),
                    'organic': False,
                    'image': image_file
                }
                
                response = self.client.post('/api/products/', data, format='multipart')
                self.assertEqual(response.status_code, status.HTTP_201_CREATED)
                self.assertTrue(Product.objects.get(name='Product with Image').image)
        finally:
            # Clean up the test image file
            if os.path.exists(image_path):
                os.unlink(image_path)
    
    def test_list_products(self):
        """Test listing all products (public endpoint)"""
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'Test Tomatoes')
    
    def test_farmer_can_update_own_product(self):
        """Test that a farmer can update their own product"""
        self.client.force_authenticate(user=self.farmer)
        
        data = {
            'name': 'Updated Tomatoes',
            'description': 'Updated description',
            'price': 50.00,
            'quantity': 75.0,
            'unit': 'kg',
            'harvest_date': date.today().isoformat(),
            'organic': False
        }
        
        response = self.client.put(f'/api/products/{self.product.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.product.refresh_from_db()
        self.assertEqual(self.product.name, 'Updated Tomatoes')
        self.assertEqual(self.product.price, 50.00)
    
    def test_farmer_cannot_update_other_farmer_product(self):
        """Test that a farmer cannot update another farmer's product"""
        other_farmer = User.objects.create_user(
            username='other@test.com',
            email='other@test.com',
            password='testpass123',
            user_type=User.UserType.FARMER
        )
        
        self.client.force_authenticate(user=other_farmer)
        
        data = {
            'name': 'Hacked Tomatoes',
            'description': 'Hacked description',
            'price': 100.00,
            'quantity': 200.0,
            'unit': 'kg',
            'harvest_date': date.today().isoformat(),
            'organic': False
        }
        
        response = self.client.put(f'/api/products/{self.product.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        self.product.refresh_from_db()
        self.assertEqual(self.product.name, 'Test Tomatoes')  # Should not change
    
    def test_farmer_can_delete_own_product(self):
        """Test that a farmer can delete their own product"""
        self.client.force_authenticate(user=self.farmer)
        
        response = self.client.delete(f'/api/products/{self.product.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Product.objects.count(), 0)
    
    def test_farmer_cannot_delete_other_farmer_product(self):
        """Test that a farmer cannot delete another farmer's product"""
        other_farmer = User.objects.create_user(
            username='other@test.com',
            email='other@test.com',
            password='testpass123',
            user_type=User.UserType.FARMER
        )
        
        self.client.force_authenticate(user=other_farmer)
        
        response = self.client.delete(f'/api/products/{self.product.id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Product.objects.count(), 1)  # Product should still exist
