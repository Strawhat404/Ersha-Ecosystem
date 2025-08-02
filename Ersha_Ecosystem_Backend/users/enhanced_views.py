from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from .models import PKCESession
from core.fayda import fayda_oidc
import secrets
import time

User = get_user_model()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def enhanced_fayda_authorization_url(request):
    """Generate enhanced Fayda OIDC authorization URL with database-based PKCE storage"""
    try:
        # Generate state parameter for CSRF protection
        state = secrets.token_urlsafe(32)
        
        # Generate PKCE pair using the fayda_oidc method
        code_verifier, code_challenge = fayda_oidc.generate_pkce_pair()
        
        # Store in database with expiration
        expires_at = timezone.now() + timedelta(minutes=30)
        PKCESession.objects.create(
            user=request.user,
            state=state,
            code_verifier=code_verifier,
            expires_at=expires_at
        )
        
        # Build authorization URL manually to use our code_challenge
        params = {
            'response_type': 'code',
            'client_id': fayda_oidc.client_id,
            'redirect_uri': fayda_oidc.redirect_uri,
            'scope': 'openid profile email',
            'code_challenge': code_challenge,
            'code_challenge_method': 'S256',
            'acr_values': 'OTP',
            'state': state
        }
        
        # Build authorization URL
        auth_url = f"{fayda_oidc.authorization_endpoint}?"
        auth_url += "&".join([f"{k}={v}" for k, v in params.items()])
        
        return Response({
            'authorization_url': auth_url,
            'state': state
        })
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enhanced_fayda_callback(request):
    """Handle enhanced Fayda OIDC callback with database-based PKCE retrieval"""
    try:
        authorization_code = request.data.get('code')
        state = request.data.get('state')
        
        if not authorization_code or not state:
            return Response({
                'error': 'Authorization code and state are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Retrieve PKCE session from database
        try:
            pkce_session = PKCESession.objects.get(state=state, user=request.user)
            
            # Check if session is expired
            if pkce_session.is_expired:
                pkce_session.delete()
                return Response({
                    'error': 'PKCE session expired'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            code_verifier = pkce_session.code_verifier
            
            # Clean up the session
            pkce_session.delete()
            
        except PKCESession.DoesNotExist:
            return Response({
                'error': 'PKCE session not found'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Exchange code for tokens
        token_response = fayda_oidc.exchange_code_for_tokens(
            authorization_code, 
            code_verifier, 
            state
        )
        
        access_token = token_response.get('access_token')
        if not access_token:
            return Response({
                'error': 'Access token not received'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get user information
        userinfo = fayda_oidc.get_user_info(access_token)
        
        # Extract and validate user data
        user_data = fayda_oidc.verify_and_extract_user_data(userinfo)
        
        # Link Fayda data to user
        result = fayda_oidc.link_fayda_to_user(request.user, user_data)
        
        return Response({
            'success': True,
            'message': 'Fayda verification completed successfully',
            'verification_status': request.user.verification_status,
            'is_verified': request.user.is_verified,
            'fayda_id': request.user.fayda_id
        })
        
    except Exception as e:
        return Response({
            'error': str(e),
            'verification_status': request.user.verification_status,
            'is_verified': request.user.is_verified
        }, status=status.HTTP_400_BAD_REQUEST) 