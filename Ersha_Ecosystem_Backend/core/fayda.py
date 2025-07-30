import jwt
import requests
import json
import secrets
import hashlib
import base64
from datetime import datetime, timedelta
from django.conf import settings
from django.utils import timezone
from django.core.cache import cache
from users.models import User


class FaydaOIDC:
    def __init__(self):
        self.config = settings.FAYDA_CONFIG
        self.client_id = self.config['CLIENT_ID']
        self.private_key = self.config['PRIVATE_KEY']
        self.redirect_uri = self.config['REDIRECT_URI']
        self.authorization_endpoint = self.config['AUTHORIZATION_ENDPOINT']
        self.token_endpoint = self.config['TOKEN_ENDPOINT']
        self.userinfo_endpoint = self.config['USERINFO_ENDPOINT']
        self.algorithm = self.config['ALGORITHM']
        self.client_assertion_type = self.config['CLIENT_ASSERTION_TYPE']
    
    def generate_pkce_pair(self):
        """Generate PKCE code verifier and challenge"""
        # Generate a random code verifier
        code_verifier = base64.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8').rstrip('=')
        
        # Generate code challenge using SHA256
        code_challenge = base64.urlsafe_b64encode(
            hashlib.sha256(code_verifier.encode('utf-8')).digest()
        ).decode('utf-8').rstrip('=')
        
        return code_verifier, code_challenge
    
    def generate_authorization_url(self, state=None, acr_values='OTP'):
        """Generate authorization URL with PKCE"""
        code_verifier, code_challenge = self.generate_pkce_pair()
        
        # Store code verifier in cache for later use
        cache_key = f"fayda_pkce_{state or 'default'}"
        cache.set(cache_key, code_verifier, timeout=600)  # 10 minutes timeout
        
        params = {
            'response_type': 'code',
            'client_id': self.client_id,
            'redirect_uri': self.redirect_uri,
            'scope': 'openid profile email',
            'code_challenge': code_challenge,
            'code_challenge_method': 'S256',
            'acr_values': acr_values
        }
        
        if state:
            params['state'] = state
        
        # Build authorization URL
        auth_url = f"{self.authorization_endpoint}?"
        auth_url += "&".join([f"{k}={v}" for k, v in params.items()])
        
        return auth_url, code_verifier
    
    def generate_client_assertion(self):
        """Generate JWT client assertion for OAuth2 client credentials flow"""
        now = datetime.utcnow()
        payload = {
            'iss': self.client_id,
            'sub': self.client_id,
            'aud': self.token_endpoint,
            'iat': int(now.timestamp()),
            'exp': int((now + timedelta(minutes=5)).timestamp()),
            'jti': f"{now.timestamp()}"
        }
        
        # Parse the private key (it's in JWK format)
        try:
            private_key_data = json.loads(self.private_key)
            # For RSA keys, we need to convert JWK to PEM format
            private_key = self._jwk_to_pem(private_key_data)
        except:
            # Fallback: assume it's already in PEM format
            private_key = self.private_key
        
        return jwt.encode(payload, private_key, algorithm=self.algorithm)
    
    def _jwk_to_pem(self, jwk_data):
        """Convert JWK to PEM format (simplified implementation)"""
        # This is a placeholder - in production, use proper JWK to PEM conversion
        # You might want to use libraries like cryptography or PyJWT with proper JWK support
        return self.private_key
    
    def exchange_code_for_tokens(self, authorization_code, code_verifier, state=None):
        """Exchange authorization code for tokens using PKCE"""
        client_assertion = self.generate_client_assertion()
        
        data = {
            'grant_type': 'authorization_code',
            'code': authorization_code,
            'redirect_uri': self.redirect_uri,
            'client_assertion_type': self.client_assertion_type,
            'client_assertion': client_assertion,
            'code_verifier': code_verifier
        }
        
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        
        response = requests.post(self.token_endpoint, data=data, headers=headers)
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Failed to exchange code for tokens: {response.status_code} - {response.text}")
    
    def get_user_info(self, access_token):
        """Get user information using access token"""
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.get(self.userinfo_endpoint, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Failed to get user info: {response.status_code} - {response.text}")
    
    def verify_and_extract_user_data(self, userinfo_response):
        """Extract and validate user data from Fayda response"""
        try:
            # Extract key information from userinfo response
            user_data = {
                'fayda_id': userinfo_response.get('sub') or userinfo_response.get('fayda_id'),
                'name': userinfo_response.get('name'),
                'given_name': userinfo_response.get('given_name'),
                'family_name': userinfo_response.get('family_name'),
                'email': userinfo_response.get('email'),
                'phone_number': userinfo_response.get('phone_number'),
                'birthdate': userinfo_response.get('birthdate'),
                'gender': userinfo_response.get('gender'),
                'address': userinfo_response.get('address'),
                'region': userinfo_response.get('region'),
                'verified_at': timezone.now().isoformat()
            }
            
            # Validate required fields
            if not user_data['fayda_id']:
                raise Exception("Fayda ID not found in userinfo response")
            
            return user_data
        except Exception as e:
            raise Exception(f"Failed to extract user data: {str(e)}")
    
    def complete_verification_flow(self, authorization_code, state=None):
        """Complete the full verification flow"""
        try:
            # Retrieve stored code verifier
            cache_key = f"fayda_pkce_{state or 'default'}"
            code_verifier = cache.get(cache_key)
            
            if not code_verifier:
                raise Exception("Code verifier not found or expired")
            
            # Exchange code for tokens
            token_response = self.exchange_code_for_tokens(authorization_code, code_verifier, state)
            access_token = token_response.get('access_token')
            
            if not access_token:
                raise Exception("Access token not received")
            
            # Get user information
            userinfo = self.get_user_info(access_token)
            
            # Extract and validate user data
            user_data = self.verify_and_extract_user_data(userinfo)
            
            # Clean up cache
            cache.delete(cache_key)
            
            return user_data
            
        except Exception as e:
            # Clean up cache on error
            if state:
                cache.delete(f"fayda_pkce_{state}")
            raise e
    
    def verify_fayda_id(self, fayda_id):
        """Verify Fayda ID and return user information (for testing)"""
        try:
            # This is a simplified verification for testing
            # In production, you would make actual API calls to verify the Fayda ID
            return {
                'fayda_id': fayda_id,
                'name': 'Test User',
                'given_name': 'Test',
                'family_name': 'User',
                'email': f'{fayda_id}@fayda.et',
                'phone_number': '+251900000000',
                'birthdate': '1990-01-01',
                'gender': 'M',
                'region': 'Addis Ababa',
                'verified': True
            }
        except Exception as e:
            raise Exception(f"Failed to verify Fayda ID: {str(e)}")
    
    def link_fayda_to_user(self, user, fayda_data):
        """Link Fayda data to existing user"""
        try:
            fayda_id = fayda_data.get('fayda_id')
            
            if not fayda_id:
                raise Exception("Fayda ID is required")
            
            # Check if Fayda ID is already linked to another user
            existing_user = User.objects.filter(fayda_id=fayda_id).first()
            if existing_user and existing_user != user:
                raise Exception("Fayda ID is already linked to another user")
            
            # Update user with Fayda information
            user.fayda_id = fayda_id
            user.mark_as_verified(fayda_data)
            
            # Update user profile if name is provided
            if fayda_data.get('given_name') and not user.first_name:
                user.first_name = fayda_data['given_name']
            if fayda_data.get('family_name') and not user.last_name:
                user.last_name = fayda_data['family_name']
            if fayda_data.get('phone_number') and not user.phone:
                user.phone = fayda_data['phone_number']
            if fayda_data.get('region') and not user.region:
                user.region = fayda_data['region']
            
            user.save()
            
            return {
                'success': True,
                'message': 'Fayda verification completed successfully',
                'user_data': fayda_data
            }
        except Exception as e:
            raise Exception(f"Failed to link Fayda data: {str(e)}")


# Create a global instance
fayda_oidc = FaydaOIDC() 