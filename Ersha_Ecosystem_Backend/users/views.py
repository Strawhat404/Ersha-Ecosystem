from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import update_session_auth_hash
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import User, Profile
from .serializers import (
    UserSerializer, ProfileSerializer, UserProfileSerializer,
    RegisterSerializer, LoginSerializer, ChangePasswordSerializer
)
from core.permissions import IsOwnerOrReadOnly
from core.fayda import fayda_oidc


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    
    @swagger_auto_schema(
        operation_description="Register a new user account",
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
                                'fayda_id': openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
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
                                'fayda_id': openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
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
        security=[{'Bearer': []}],  # Add this line to require Bearer token authentication
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
        security=[{'Bearer': []}],  # Add this line to require Bearer token authentication
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
                        'fayda_id': openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                        'profile': openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'farm_size': openapi.Schema(type=openapi.TYPE_NUMBER),
                                'farm_size_unit': openapi.Schema(type=openapi.TYPE_STRING),
                                'woreda': openapi.Schema(type=openapi.TYPE_STRING),
                                'kebele': openapi.Schema(type=openapi.TYPE_STRING),
                                'business_license': openapi.Schema(type=openapi.TYPE_STRING),
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
        security=[{'Bearer': []}],  # Add this line to require Bearer token authentication
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
        security=[{'Bearer': []}],  # Add this line to require Bearer token authentication
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


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@swagger_auto_schema(
    operation_description="Verify Fayda ID and return user information",
    security=[{'Bearer': []}],  # Add this line to require Bearer token authentication
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
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'fayda_id': openapi.Schema(type=openapi.TYPE_STRING),
                    'name': openapi.Schema(type=openapi.TYPE_STRING),
                    'email': openapi.Schema(type=openapi.TYPE_STRING),
                    'phone': openapi.Schema(type=openapi.TYPE_STRING),
                    'region': openapi.Schema(type=openapi.TYPE_STRING),
                }
            )
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
    """Verify Fayda ID and return user information"""
    fayda_id = request.data.get('fayda_id')
    if not fayda_id:
        return Response(
            {'error': 'Fayda ID is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        fayda_info = fayda_oidc.verify_fayda_id(fayda_id)
        return Response(fayda_info)
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@swagger_auto_schema(
    operation_description="Link Fayda ID to authenticated user",
    security=[{'Bearer': []}],  # Add this line to require Bearer token authentication
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
    """Link Fayda ID to authenticated user"""
    fayda_id = request.data.get('fayda_id')
    if not fayda_id:
        return Response(
            {'error': 'Fayda ID is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        result = fayda_oidc.link_fayda_to_user(request.user, fayda_id)
        return Response(result)
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@swagger_auto_schema(
    operation_description="Get Fayda authorization URL for OAuth flow",
    responses={
        200: openapi.Response(
            description="Authorization URL generated successfully",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'authorization_url': openapi.Schema(
                        type=openapi.TYPE_STRING,
                        description="URL to redirect user for Fayda OAuth authorization"
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
    """Get Fayda authorization URL"""
    try:
        # Generate authorization URL
        auth_url = f"{fayda_oidc.authorization_endpoint}?response_type=code&client_id={fayda_oidc.client_id}&redirect_uri={fayda_oidc.redirect_uri}&scope=openid profile email"
        return Response({'authorization_url': auth_url})
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@swagger_auto_schema(
    operation_description="Handle Fayda OAuth callback and exchange authorization code for user info",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['code'],
        properties={
            'code': openapi.Schema(
                type=openapi.TYPE_STRING,
                description="Authorization code received from Fayda OAuth callback"
            )
        }
    ),
    responses={
        200: openapi.Response(
            description="Fayda authentication successful",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING),
                    'user_info': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'fayda_id': openapi.Schema(type=openapi.TYPE_STRING),
                            'name': openapi.Schema(type=openapi.TYPE_STRING),
                            'email': openapi.Schema(type=openapi.TYPE_STRING),
                            'phone': openapi.Schema(type=openapi.TYPE_STRING),
                            'region': openapi.Schema(type=openapi.TYPE_STRING),
                        }
                    )
                }
            )
        ),
        400: openapi.Response(
            description="Bad request - invalid authorization code or token exchange failed",
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
    """Handle Fayda OAuth callback"""
    authorization_code = request.data.get('code')
    if not authorization_code:
        return Response(
            {'error': 'Authorization code is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Exchange authorization code for access token
        token_response = fayda_oidc.get_access_token(authorization_code)
        access_token = token_response.get('access_token')
        
        if not access_token:
            return Response(
                {'error': 'Failed to get access token'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get user information
        user_info = fayda_oidc.get_user_info(access_token)
        
        # Update user with Fayda information
        user = request.user
        if not user.fayda_id and user_info.get('fayda_id'):
            user.fayda_id = user_info['fayda_id']
            user.save()
        
        return Response({
            'message': 'Fayda authentication successful',
            'user_info': user_info
        })
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )
