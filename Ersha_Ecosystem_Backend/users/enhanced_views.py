from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import update_session_auth_hash
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import secrets

from .models import User, Profile
from .serializers import (
    UserSerializer, ProfileSerializer, UserProfileSerializer,
    RegisterSerializer, LoginSerializer, ChangePasswordSerializer,
    FaydaVerificationSerializer, VerificationStatusSerializer
)
from core.fayda import fayda_oidc


class EnhancedRegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    
    @swagger_auto_schema(
        operation_description="Register a new user account with role-based validation",
        request_body=RegisterSerializer,
        responses={
            201: openapi.Response(
                description="User registered successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'user': openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'email': openapi.Schema(type=openapi.TYPE_STRING),
                                'username': openapi.Schema(type=openapi.TYPE_STRING),
                                'first_name': openapi.Schema(type=openapi.TYPE_STRING),
                                'last_name': openapi.Schema(type=openapi.TYPE_STRING),
                                'phone': openapi.Schema(type=openapi.TYPE_STRING),
                                'region': openapi.Schema(type=openapi.TYPE_STRING),
                                'user_type': openapi.Schema(type=openapi.TYPE_STRING),
                                'verification_status': openapi.Schema(type=openapi.TYPE_STRING),
                                'is_verified': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                            }
                        ),
                        'refresh': openapi.Schema(type=openapi.TYPE_STRING),
                        'access': openapi.Schema(type=openapi.TYPE_STRING),
                    }
                )
            ),
            400: openapi.Response(
                description="Bad request - validation errors",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'email': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                        'username': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                        'password': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                        'password_confirm': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                        'farm_size': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                        'business_license_number': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                        'non_field_errors': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                    }
                )
            )
        },
        tags=['Authentication']
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerificationStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    @swagger_auto_schema(
        operation_description="Get current user's verification status",
        security=[{'Bearer': []}],
        responses={
            200: openapi.Response(
                description="Verification status retrieved successfully",
                schema=VerificationStatusSerializer
            ),
            401: openapi.Response(description="Unauthorized - authentication required")
        },
        tags=['Fayda OIDC']
    )
    def get(self, request):
        user = request.user
        serializer = VerificationStatusSerializer({
            'verification_status': user.verification_status,
            'is_verified': user.is_verified,
            'verified_at': user.verified_at,
            'fayda_id': user.fayda_id
        })
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@swagger_auto_schema(
    operation_description="Get Fayda authorization URL for OIDC PKCE flow",
    security=[{'Bearer': []}],
    responses={
        200: openapi.Response(
            description="Authorization URL generated successfully",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'authorization_url': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        description="URL to redirect user for Fayda OIDC authorization"
                    ),
                    'state': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        description="State parameter for CSRF protection"
                    )
                }
            )
        ),
        400: openapi.Response(
            description="Bad request - failed to generate authorization URL",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING)
                }
            )
        ),
        401: openapi.Response(description="Unauthorized - authentication required")
    },
    tags=['Fayda OIDC']
)
def enhanced_fayda_authorization_url(request):
    """Get Fayda authorization URL with PKCE"""
    try:
        # Generate state for CSRF protection
        state = secrets.token_urlsafe(32)
        
        # Generate authorization URL with PKCE
        auth_url, _ = fayda_oidc.generate_authorization_url(state=state)
        
        return Response({
            'authorization_url': auth_url,
            'state': state
        })
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@swagger_auto_schema(
    operation_description="Handle Fayda OIDC callback and complete verification flow",
    security=[{'Bearer': []}],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['code', 'state'],
        properties={
            'code': openapi.Schema(
                type=openapi.TYPE_STRING,
                description="Authorization code received from Fayda OIDC callback"
            ),
            'state': openapi.Schema(
                type=openapi.TYPE_STRING,
                description="State parameter for CSRF protection"
            )
        }
    ),
    responses={
        200: openapi.Response(
            description="Fayda verification completed successfully",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING),
                    'user_data': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'fayda_id': openapi.Schema(type=openapi.TYPE_STRING),
                            'name': openapi.Schema(type=openapi.TYPE_STRING),
                            'given_name': openapi.Schema(type=openapi.TYPE_STRING),
                            'family_name': openapi.Schema(type=openapi.TYPE_STRING),
                            'email': openapi.Schema(type=openapi.TYPE_STRING),
                            'phone_number': openapi.Schema(type=openapi.TYPE_STRING),
                            'birthdate': openapi.Schema(type=openapi.TYPE_STRING),
                            'gender': openapi.Schema(type=openapi.TYPE_STRING),
                            'region': openapi.Schema(type=openapi.TYPE_STRING),
                        }
                    ),
                    'verification_status': openapi.Schema(type=openapi.TYPE_STRING),
                    'is_verified': openapi.Schema(type=openapi.TYPE_BOOLEAN)
                }
            )
        ),
        400: openapi.Response(
            description="Bad request - invalid authorization code or verification failed",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING)
                }
            )
        ),
        401: openapi.Response(description="Unauthorized - authentication required")
    },
    tags=['Fayda OIDC']
)
def enhanced_fayda_callback(request):
    """Handle Fayda OIDC callback with PKCE"""
    authorization_code = request.data.get('code')
    state = request.data.get('state')
    
    if not authorization_code:
        return Response(
            {'error': 'Authorization code is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not state:
        return Response(
            {'error': 'State parameter is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Complete the verification flow
        user_data = fayda_oidc.complete_verification_flow(authorization_code, state)
        
        # Link Fayda data to user with verification checks
        result = fayda_oidc.link_fayda_to_user(request.user, user_data)
        
        # Get updated user data
        user = User.objects.get(id=request.user.id)
        
        response_data = {
            'message': result['message'],
            'user_data': user_data,
            'verification_status': user.verification_status,
            'is_verified': user.is_verified
        }
        
        # Include verification details if available
        if 'verification_details' in result:
            response_data['verification_details'] = result['verification_details']
        
        return Response(response_data)
        
    except Exception as e:
        # Get updated user data to check if verification failed
        try:
            user = User.objects.get(id=request.user.id)
            return Response({
                'error': str(e),
                'verification_status': user.verification_status,
                'is_verified': user.is_verified
            }, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST) 