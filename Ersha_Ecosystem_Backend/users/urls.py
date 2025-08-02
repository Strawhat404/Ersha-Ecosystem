from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views, enhanced_views

# Admin router
admin_router = DefaultRouter()
admin_router.register(r'users', views.AdminUserViewSet, basename='admin-user')

urlpatterns = [
    # Authentication endpoints
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    
    # Enhanced Authentication (with role-based validation)
    path('register/enhanced/', enhanced_views.EnhancedRegisterView.as_view(), name='enhanced_register'),
    
    # User profile endpoints
    path('profile/', views.UserProfileView.as_view(), name='user_profile'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    
    # Verification Status
    path('verification-status/', enhanced_views.VerificationStatusView.as_view(), name='verification_status'),
    
    # Fayda OIDC (Enhanced - Production)
    path('fayda/enhanced/auth-url/', enhanced_views.enhanced_fayda_authorization_url, name='enhanced_fayda_authorization_url'),
    path('fayda/enhanced/callback/', enhanced_views.enhanced_fayda_callback, name='enhanced_fayda_callback'),
    
    # Fayda OIDC (Legacy)
    path('fayda/auth-url/', views.fayda_authorization_url, name='fayda_authorization_url'),
    path('fayda/callback/', views.fayda_callback, name='fayda_callback'),
    path('fayda/verify/', views.verify_fayda, name='verify_fayda'),
    path('fayda/link/', views.link_fayda, name='link_fayda'),
    
    # Admin endpoints
    path('admin/login/', views.AdminLoginView.as_view(), name='admin_login'),
    path('admin/dashboard/', views.AdminDashboardView.as_view(), name='admin_dashboard'),
    path('admin/comprehensive-dashboard/', views.ComprehensiveAdminDashboardView.as_view(), name='comprehensive_admin_dashboard'),
    path('admin/', include(admin_router.urls)),
]