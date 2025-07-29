from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExpertViewSet, AdvisoryContentViewSet, CourseViewSet, ResourceViewSet,
    UserBookmarkViewSet, UserLikeViewSet, ConsultationRequestViewSet
)

router = DefaultRouter()
router.register(r'experts', ExpertViewSet)
router.register(r'advisory-content', AdvisoryContentViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'resources', ResourceViewSet)
router.register(r'bookmarks', UserBookmarkViewSet, basename='bookmark')
router.register(r'likes', UserLikeViewSet, basename='like')
router.register(r'consultations', ConsultationRequestViewSet, basename='consultation')

urlpatterns = [
    path('api/advisory/', include(router.urls)),
] 