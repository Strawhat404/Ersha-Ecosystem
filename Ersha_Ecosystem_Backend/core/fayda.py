import jwt
import requests
import json
from datetime import datetime, timedelta
from django.conf import settings
from django.utils import timezone
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
        self.expiration_time = self.config['EXPIRATION_TIME']
        self.algorithm = self.config['ALGORITHM']
        self.client_assertion_type = self.config['CLIENT_ASSERTION_TYPE']
    
    def generate_client_assertion(self):
        """Generate JWT client assertion for OAuth2 client credentials flow"""
        now = datetime.utcnow()
        payload = {
            'iss': self.client_id,
            'sub': self.client_id,
            'aud': self.token_endpoint,
            'iat': now,
            'exp': now + timedelta(minutes=self.expiration_time),
            'jti': f"{now.timestamp()}"
        }
        
        # Parse the private key (it's in JWK format)
        try:
            private_key_data = json.loads(self.private_key)
            # For RSA keys, we need to convert JWK to PEM format
            # This is a simplified version - in production, use proper JWK to PEM conversion
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
    
    def get_access_token(self, authorization_code):
        """Get access token using authorization code"""
        client_assertion = self.generate_client_assertion()
        
        data = {
            'grant_type': 'authorization_code',
            'code': authorization_code,
            'redirect_uri': self.redirect_uri,
            'client_assertion_type': self.client_assertion_type,
            'client_assertion': client_assertion,
        }
        
        response = requests.post(self.token_endpoint, data=data)
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Failed to get access token: {response.text}")
    
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
            raise Exception(f"Failed to get user info: {response.text}")
    
    def verify_fayda_id(self, fayda_id):
        """Verify Fayda ID and return user information"""
        try:
            # This is a simplified verification
            # In production, you would make actual API calls to verify the Fayda ID
            # For now, we'll return a mock response
            return {
                'fayda_id': fayda_id,
                'name': 'Test User',
                'email': f'{fayda_id}@fayda.et',
                'phone': '+251900000000',
                'verified': True
            }
        except Exception as e:
            raise Exception(f"Failed to verify Fayda ID: {str(e)}")
    
    def link_fayda_to_user(self, user, fayda_id):
        """Link Fayda ID to existing user"""
        try:
            # Verify the Fayda ID first
            fayda_info = self.verify_fayda_id(fayda_id)
            
            if not fayda_info.get('verified'):
                raise Exception("Fayda ID verification failed")
            
            # Check if Fayda ID is already linked to another user
            existing_user = User.objects.filter(fayda_id=fayda_id).first()
            if existing_user and existing_user != user:
                raise Exception("Fayda ID is already linked to another user")
            
            # Link Fayda ID to user
            user.fayda_id = fayda_id
            user.save()
            
            return {
                'success': True,
                'message': 'Fayda ID linked successfully',
                'fayda_info': fayda_info
            }
        except Exception as e:
            raise Exception(f"Failed to link Fayda ID: {str(e)}")


# Create a global instance
fayda_oidc = FaydaOIDC() 