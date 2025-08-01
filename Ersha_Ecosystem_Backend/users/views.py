import logging
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import update_session_auth_hash
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import secrets

from .models import User, Profile
from .serializers import (
    UserSerializer, ProfileSerializer, UserProfileSerializer,
    RegisterSerializer, LoginSerializer, ChangePasswordSerializer,
    FaydaVerificationSerializer, VerificationStatusSerializer
)
from core.permissions import IsOwnerOrReadOnly
from core.fayda import fayda_oidc

logger = logging.getLogger(__name__)


class RegisterView(APIView):
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
        logger.info(f"Registration request received with data: {request.data}")
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            logger.info("Registration data is valid, creating user...")
            try:
                user = serializer.save()
                logger.info(f"User created successfully with ID: {user.id}")
                refresh = RefreshToken.for_user(user)
                return Response({
                    'user': UserSerializer(user).data,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                logger.error(f"Error creating user: {e}")
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            logger.error(f"Registration validation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    @swagger_auto_schema(
        operation_description="Authenticate user and return JWT tokens",
        request_body=LoginSerializer,
        responses={
            200: openapi.Response(
                description="Login successful",
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
                description="Bad request - invalid credentials",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'email': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                        'password': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                        'non_field_errors': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                    }
                )
            )
        },
        tags=['Authentication']
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    @swagger_auto_schema(
        operation_description="Logout user by blacklisting the refresh token",
        security=[{'Bearer': []}],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['refresh'],
            properties={
                'refresh': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="JWT refresh token to blacklist"
                )
            }
        ),
        responses={
            200: openapi.Response(
                description="Logout successful",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'message': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            example="Successfully logged out"
                        )
                    }
                )
            ),
            401: openapi.Response(
                description="Unauthorized - invalid or missing authentication"
            )
        },
        tags=['Authentication']
    )
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)


class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    @swagger_auto_schema(
        operation_description="Get current user's profile information",
        security=[{'Bearer': []}],
        responses={
            200: openapi.Response(
                description="User profile retrieved successfully",
                schema=openapi.Schema(
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
                        'profile': openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'farm_size': openapi.Schema(type=openapi.TYPE_NUMBER),
                                'farm_size_unit': openapi.Schema(type=openapi.TYPE_STRING),
                                'business_license_number': openapi.Schema(type=openapi.TYPE_STRING),
                                'woreda': openapi.Schema(type=openapi.TYPE_STRING),
                                'kebele': openapi.Schema(type=openapi.TYPE_STRING),
                                'bio': openapi.Schema(type=openapi.TYPE_STRING),
                                'profile_picture': openapi.Schema(type=openapi.TYPE_STRING),
                                'full_location': openapi.Schema(type=openapi.TYPE_STRING),
                                'created_at': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                                'updated_at': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME),
                            }
                        )
                    }
                )
            ),
            401: openapi.Response(description="Unauthorized - authentication required")
        },
        tags=['User Profile']
    )
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    @swagger_auto_schema(
        operation_description="Update current user's profile information",
        security=[{'Bearer': []}],
        request_body=UserProfileSerializer,
        responses={
            200: openapi.Response(
                description="Profile updated successfully",
                schema=UserProfileSerializer
            ),
            400: openapi.Response(
                description="Bad request - validation errors",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'email': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                        'username': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                        'phone': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                        'region': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                        'profile': openapi.Schema(type=openapi.TYPE_OBJECT),
                    }
                )
            ),
            401: openapi.Response(description="Unauthorized - authentication required")
        },
        tags=['User Profile']
    )
    def put(self, request):
        user_serializer = UserSerializer(request.user, data=request.data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()
        
        profile_serializer = ProfileSerializer(request.user.profile, data=request.data, partial=True)
        if profile_serializer.is_valid():
            profile_serializer.save()
        
        if user_serializer.is_valid() and profile_serializer.is_valid():
            return Response(UserProfileSerializer(request.user).data)
        
        errors = {}
        if not user_serializer.is_valid():
            errors.update(user_serializer.errors)
        if not profile_serializer.is_valid():
            errors.update(profile_serializer.errors)
        
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    @swagger_auto_schema(
        operation_description="Change user's password",
        security=[{'Bearer': []}],
        request_body=ChangePasswordSerializer,
        responses={
            200: openapi.Response(
                description="Password changed successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'message': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            example="Password changed successfully"
                        )
                    }
                )
            ),
            400: openapi.Response(
                description="Bad request - validation errors",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'old_password': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                        'new_password': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                        'new_password_confirm': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                        'non_field_errors': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                    }
                )
            ),
            401: openapi.Response(description="Unauthorized - authentication required")
        },
        tags=['User Profile']
    )
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            update_session_auth_hash(request, user)
            return Response({"message": "Password changed successfully"})
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
def fayda_authorization_url(request):
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
def fayda_callback(request):
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
        
        # Link Fayda data to user
        result = fayda_oidc.link_fayda_to_user(request.user, user_data)
        
        # Get updated user data
        user = User.objects.get(id=request.user.id)
        
        return Response({
            'message': 'Fayda verification completed successfully',
            'user_data': user_data,
            'verification_status': user.verification_status,
            'is_verified': user.is_verified
        })
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@swagger_auto_schema(
    operation_description="Verify Fayda ID and return user information (for testing)",
    security=[{'Bearer': []}],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['fayda_id'],
        properties={
            'fayda_id': openapi.Schema(
                type=openapi.TYPE_STRING,
                description="Fayda ID to verify"
            )
        }
    ),
    responses={
        200: openapi.Response(
            description="Fayda ID verified successfully",
            schema=FaydaVerificationSerializer
        ),
        400: openapi.Response(
            description="Bad request - invalid Fayda ID or verification failed",
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
def verify_fayda(request):
    """Verify Fayda ID and return user information (for testing)"""
    fayda_id = request.data.get('fayda_id')
    if not fayda_id:
        return Response(
            {'error': 'Fayda ID is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        fayda_info = fayda_oidc.verify_fayda_id(fayda_id)
        serializer = FaydaVerificationSerializer(fayda_info)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@swagger_auto_schema(
    operation_description="Link Fayda ID to authenticated user (for testing)",
    security=[{'Bearer': []}],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['fayda_id'],
        properties={
            'fayda_id': openapi.Schema(
                type=openapi.TYPE_STRING,
                description="Fayda ID to link to user account"
            )
        }
    ),
    responses={
        200: openapi.Response(
            description="Fayda ID linked successfully",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING),
                    'fayda_id': openapi.Schema(type=openapi.TYPE_STRING),
                    'verification_status': openapi.Schema(type=openapi.TYPE_STRING),
                    'is_verified': openapi.Schema(type=openapi.TYPE_BOOLEAN)
                }
            )
        ),
        400: openapi.Response(
            description="Bad request - invalid Fayda ID or linking failed",
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
def link_fayda(request):
    """Link Fayda ID to authenticated user (for testing)"""
    fayda_id = request.data.get('fayda_id')
    if not fayda_id:
        return Response(
            {'error': 'Fayda ID is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Get Fayda data
        fayda_data = fayda_oidc.verify_fayda_id(fayda_id)
        
        # Link to user
        result = fayda_oidc.link_fayda_to_user(request.user, fayda_data)
        
        # Get updated user data
        user = User.objects.get(id=request.user.id)
        
        return Response({
            'message': 'Fayda ID linked successfully',
            'fayda_id': user.fayda_id,
            'verification_status': user.verification_status,
            'is_verified': user.is_verified
        })
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )
