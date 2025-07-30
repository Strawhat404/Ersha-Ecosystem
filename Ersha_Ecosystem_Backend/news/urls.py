from rest_framework.routers import DefaultRouter
from .views import NewsArticleViewSet

router = DefaultRouter()
router.register(r'news', NewsArticleViewSet, basename='news')

urlpatterns = router.urls 