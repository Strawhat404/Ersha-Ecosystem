import os
import sys
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agriculture_marketplace.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

def get_jwt_token(email):
    User = get_user_model()
    try:
        user = User.objects.get(email=email)
        refresh = RefreshToken.for_user(user)
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }
    except User.DoesNotExist:
        return {'error': f'User with email {email} does not exist'}

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print('Usage: python get_token.py <email>')
        sys.exit(1)
    
    email = sys.argv[1]
    result = get_jwt_token(email)
    print('Access Token:', result.get('access', 'No token generated'))
    print('Refresh Token:', result.get('refresh', 'No refresh token generated'))
    if 'error' in result:
        print('Error:', result['error'])
