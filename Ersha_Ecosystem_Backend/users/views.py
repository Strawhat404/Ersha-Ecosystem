from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import update_session_auth_hash
from django.shortcuts import get_object_or_404

from .models import User, Profile
from .serializers import (
    UserSerializer, ProfileSerializer, UserProfileSerializer,
    RegisterSerializer, LoginSerializer, ChangePasswordSerializer
)
from core.permissions import IsOwnerOrReadOnly
from core.fayda import fayda_oidc


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    
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
    
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
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
