from django.db import models
from django.utils import timezone
import uuid

class NewsArticle(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=500)
    content = models.TextField()
    excerpt = models.TextField(blank=True)
    category = models.CharField(max_length=100)
    tags = models.JSONField(default=list, blank=True)
    author = models.CharField(max_length=255, blank=True)
    source = models.CharField(max_length=255, blank=True)
    source_url = models.URLField(blank=True)
    image_url = models.URLField(blank=True)
    featured = models.BooleanField(default=False)
    views = models.IntegerField(default=0)
    published_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def __str__(self):
        return self.title
