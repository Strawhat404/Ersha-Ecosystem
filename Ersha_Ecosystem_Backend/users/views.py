import logging
from rest_framework import status, generics, permissions, viewsets, filters
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import update_session_auth_hash
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count, Sum
from django.utils import timezone
from datetime import timedelta
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


# Admin-specific views and endpoints
class AdminUserViewSet(viewsets.ModelViewSet):
    """Admin ViewSet for managing all users"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['email', 'username', 'first_name', 'last_name', 'phone', 'region']
    ordering_fields = ['date_joined', 'last_login', 'user_type', 'verification_status']
    ordering = ['-date_joined']
    
    def get_queryset(self):
        """Filter users based on admin permissions"""
        if not self.request.user.is_admin:
            return User.objects.none()
        return super().get_queryset()
    
    @action(detail=True, methods=['post'])
    def verify_user(self, request, pk=None):
        """Admin action to verify a user"""
        if not request.user.is_admin:
            return Response({'error': 'Admin access required'}, status=403)
        
        user = self.get_object()
        user.verification_status = User.VerificationStatus.VERIFIED
        user.verified_at = timezone.now()
        user.save()
        
        return Response({
            'message': f'User {user.email} has been verified',
            'verification_status': user.verification_status
        })
    
    @action(detail=True, methods=['post'])
    def flag_user(self, request, pk=None):
        """Admin action to flag a user"""
        if not request.user.is_admin:
            return Response({'error': 'Admin access required'}, status=403)
        
        user = self.get_object()
        user.verification_status = User.VerificationStatus.FAILED
        user.save()
        
        return Response({
            'message': f'User {user.email} has been flagged',
            'verification_status': user.verification_status
        })
    
    @action(detail=True, methods=['post'])
    def ban_user(self, request, pk=None):
        """Admin action to ban a user"""
        if not request.user.is_admin:
            return Response({'error': 'Admin access required'}, status=403)
        
        user = self.get_object()
        user.is_active = False
        user.save()
        
        return Response({
            'message': f'User {user.email} has been banned',
            'is_active': user.is_active
        })
    
    @action(detail=False, methods=['get'])
    def user_stats(self, request):
        """Get user statistics for admin dashboard"""
        if not request.user.is_admin:
            return Response({'error': 'Admin access required'}, status=403)
        
        total_users = User.objects.count()
        farmers = User.objects.filter(user_type=User.UserType.FARMER).count()
        merchants = User.objects.filter(user_type=User.UserType.BUYER).count()
        verified_users = User.objects.filter(verification_status=User.VerificationStatus.VERIFIED).count()
        pending_users = User.objects.filter(verification_status=User.VerificationStatus.PENDING).count()
        
        # Recent registrations (last 30 days)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        recent_registrations = User.objects.filter(date_joined__gte=thirty_days_ago).count()
        
        return Response({
            'total_users': total_users,
            'farmers': farmers,
            'merchants': merchants,
            'verified_users': verified_users,
            'pending_users': pending_users,
            'recent_registrations': recent_registrations
        })


class AdminDashboardView(APIView):
    """Admin dashboard statistics and analytics"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get admin dashboard statistics"""
        if not request.user.is_admin:
            return Response({'error': 'Admin access required'}, status=403)
        
        # User statistics
        total_users = User.objects.count()
        farmers = User.objects.filter(user_type=User.UserType.FARMER).count()
        merchants = User.objects.filter(user_type=User.UserType.BUYER).count()
        verified_users = User.objects.filter(verification_status=User.VerificationStatus.VERIFIED).count()
        
        # Recent activity (last 7 days)
        seven_days_ago = timezone.now() - timedelta(days=7)
        recent_users = User.objects.filter(date_joined__gte=seven_days_ago).count()
        
        # User type distribution
        user_types = User.objects.values('user_type').annotate(count=Count('id'))
        
        # Verification status distribution
        verification_statuses = User.objects.values('verification_status').annotate(count=Count('id'))
        
        return Response({
            'user_stats': {
                'total_users': total_users,
                'farmers': farmers,
                'merchants': merchants,
                'verified_users': verified_users,
                'recent_users': recent_users
            },
            'user_types': user_types,
            'verification_statuses': verification_statuses
        })


class ComprehensiveAdminDashboardView(APIView):
    """Comprehensive admin dashboard with statistics from all apps"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get comprehensive admin dashboard statistics"""
        if not request.user.is_admin:
            return Response({'error': 'Admin access required'}, status=403)
        
        try:
            # Import models from other apps
            from news.models import NewsArticle
            from logistics.models import ServiceProvider, Delivery
            from advisory.models import Expert
            from marketplace.models import Product
            
            # User statistics
            total_users = User.objects.count()
            farmers = User.objects.filter(user_type=User.UserType.FARMER).count()
            merchants = User.objects.filter(user_type=User.UserType.BUYER).count()
            verified_users = User.objects.filter(verification_status=User.VerificationStatus.VERIFIED).count()
            pending_users = User.objects.filter(verification_status=User.VerificationStatus.PENDING).count()
            
            # News statistics
            total_articles = NewsArticle.objects.count()
            featured_articles = NewsArticle.objects.filter(featured=True).count()
            total_news_views = NewsArticle.objects.aggregate(total_views=Sum('views'))['total_views'] or 0
            
            # Logistics statistics
            total_providers = ServiceProvider.objects.count()
            verified_providers = ServiceProvider.objects.filter(verified=True).count()
            total_deliveries = Delivery.objects.count()
            completed_deliveries = Delivery.objects.filter(status='delivered').count()
            
            # Expert statistics
            total_experts = Expert.objects.count()
            verified_experts = Expert.objects.filter(verified=True).count()
            featured_experts = Expert.objects.filter(featured=True).count()
            
            # Marketplace statistics
            total_products = Product.objects.count()
            active_products = Product.objects.filter(is_active=True).count()
            organic_products = Product.objects.filter(organic=True).count()
            
            # Recent activity (last 7 days)
            seven_days_ago = timezone.now() - timedelta(days=7)
            recent_users = User.objects.filter(date_joined__gte=seven_days_ago).count()
            recent_articles = NewsArticle.objects.filter(created_at__gte=seven_days_ago).count()
            recent_products = Product.objects.filter(created_at__gte=seven_days_ago).count()
            
            # Platform overview
            platform_stats = {
                'users': {
                    'total': total_users,
                    'farmers': farmers,
                    'merchants': merchants,
                    'verified': verified_users,
                    'pending': pending_users,
                    'recent': recent_users
                },
                'content': {
                    'news_articles': total_articles,
                    'featured_articles': featured_articles,
                    'news_views': total_news_views,
                    'recent_articles': recent_articles
                },
                'logistics': {
                    'providers': total_providers,
                    'verified_providers': verified_providers,
                    'deliveries': total_deliveries,
                    'completed_deliveries': completed_deliveries
                },
                'experts': {
                    'total': total_experts,
                    'verified': verified_experts,
                    'featured': featured_experts
                },
                'marketplace': {
                    'products': total_products,
                    'active_products': active_products,
                    'organic_products': organic_products,
                    'recent_products': recent_products
                }
            }
            
            # Quick actions summary
            quick_actions = {
                'pending_verifications': pending_users,
                'unverified_providers': total_providers - verified_providers,
                'inactive_products': total_products - active_products
            }
            
            return Response({
                'platform_stats': platform_stats,
                'quick_actions': quick_actions,
                'last_updated': timezone.now().isoformat()
            })
            
        except Exception as e:
            logger.error(f"Error generating admin dashboard stats: {e}")
            return Response(
                {'error': 'Failed to generate dashboard statistics'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminLoginView(APIView):
    """Admin-specific login endpoint"""
    permission_classes = [permissions.AllowAny]
    
    @swagger_auto_schema(
        operation_description="Admin login with role validation",
        request_body=LoginSerializer,
        responses={
            200: openapi.Response(
                description="Admin login successful",
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
                                'user_type': openapi.Schema(type=openapi.TYPE_STRING),
                                'is_admin': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                            }
                        ),
                        'refresh': openapi.Schema(type=openapi.TYPE_STRING),
                        'access': openapi.Schema(type=openapi.TYPE_STRING),
                    }
                )
            ),
            400: openapi.Response(
                description="Bad request - invalid credentials or not admin",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            )
        },
        tags=['Admin Authentication']
    )
    def post(self, request):
        """Admin login with role validation"""
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Check if user is admin
            if not user.is_admin:
                return Response(
                    {'error': 'Access denied. Admin privileges required.'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'user_type': user.user_type,
                    'is_admin': user.is_admin,
                },
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
