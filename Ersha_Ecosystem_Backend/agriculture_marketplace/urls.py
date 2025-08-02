"""
URL configuration for agriculture_marketplace project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from drf_yasg.generators import OpenAPISchemaGenerator

# Custom schema generator with security definitions
class CustomSchemaGenerator(OpenAPISchemaGenerator):
    def get_schema(self, request=None, public=False):
        schema = super().get_schema(request, public)
        schema.security_definitions = {
            'Bearer': {
                'type': 'apiKey',
                'name': 'Authorization',
                'in': 'header',
                'description': 'JWT Authorization header using the Bearer scheme. Example: "Bearer {token}"'
            }
        }
        return schema

# Swagger schema view
schema_view = get_schema_view(
    openapi.Info(
        title="Agriculture Marketplace API",
        default_version='v1',
        description="A comprehensive API for agriculture marketplace platform with Fayda OIDC integration",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@agriculture-marketplace.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    generator_class=CustomSchemaGenerator,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Swagger URLs
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # API URLs
    path('api/', include([
        # Authentication
        path('auth/', include('users.urls')),
        path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        
        # Marketplace (includes both products and cart)
        path('', include('marketplace.urls')),
        
        # Orders
        path('orders/', include('orders.urls')),
        path('notifications/', include('orders.urls')),
        
        # Advisory
        path('advisory/', include('advisory.urls')),
        
        # News
        path('news/', include('news.urls')),
        
        # Weather
        path('weather/', include('weather.urls')),
        
        # Logistics
        path('logistics/', include('logistics.urls')),
        
        # Payments
        path('payments/', include('payments.urls')),
        
        # Sales Analytics
        path('analytics/', include('sales_analytics.urls')),
        
        # Admin Dashboard
        path('admin/dashboard/', include('users.urls')),
    ])),
]

# Serve media files in development
if settings.DEBUG:
    # Regular media files (public)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
