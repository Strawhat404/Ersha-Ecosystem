from django.db import models
from django.utils import timezone

# Create your models here.

class PKCECache(models.Model):
    """Store PKCE data for OAuth2 flow"""
    state = models.CharField(max_length=255, unique=True)
    code_verifier = models.TextField()
    user_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['created_at']),
            models.Index(fields=['state']),
        ]
    
    def is_expired(self):
        """Check if PKCE data is expired (30 minutes)"""
        return (timezone.now() - self.created_at).total_seconds() > 1800
    
    def __str__(self):
        return f"PKCE for user {self.user_id} - {self.state[:10]}..."
