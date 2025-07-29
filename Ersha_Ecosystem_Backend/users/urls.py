from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    
    # Profile
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    
    # Fayda OIDC
    path('fayda/verify/', views.verify_fayda, name='verify_fayda'),
    path('fayda/link/', views.link_fayda, name='link_fayda'),
    path('fayda/auth-url/', views.fayda_authorization_url, name='fayda_auth_url'),
    path('fayda/callback/', views.fayda_callback, name='fayda_callback'),
] 