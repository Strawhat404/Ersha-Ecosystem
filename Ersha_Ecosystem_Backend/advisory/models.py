import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone


class Expert(models.Model):
    """Expert profiles for consultation services"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255)
    specialization = models.CharField(max_length=255)
    experience_years = models.IntegerField()
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    bio = models.TextField()
    availability = models.CharField(max_length=50, choices=[
        ('available', 'Available'),
        ('busy', 'Busy'),
        ('unavailable', 'Unavailable'),
    ], default='available')
    consultation_price = models.DecimalField(max_digits=10, decimal_places=2)
    languages = models.JSONField(default=list)
    certifications = models.JSONField(default=list, blank=True)
    profile_image = models.URLField(blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    region = models.CharField(max_length=100, blank=True)
    verified = models.BooleanField(default=False)
    featured = models.BooleanField(default=False)
    total_consultations = models.IntegerField(default=0)
    # Calendly integration fields
    calendly_link = models.URLField(blank=True, help_text="Calendly booking link for consultations")
    calendly_connected = models.BooleanField(default=False, help_text="Whether expert has connected their Calendly account")
    calendly_event_type_id = models.CharField(max_length=100, blank=True, help_text="Calendly event type ID for consultations")
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-rating', '-featured', 'name']

    def __str__(self):
        return f"{self.name} - {self.specialization}"


class AdvisoryContent(models.Model):
    """Main advisory content model based on frontend requirements"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=500)
    content = models.TextField()
    excerpt = models.TextField(blank=True)
    category = models.CharField(max_length=100, choices=[
        ('farming', 'Farming'),
        ('planning', 'Planning'),
        ('technology', 'Technology'),
        ('climate', 'Climate'),
        ('livestock', 'Livestock'),
        ('soil', 'Soil'),
        ('pest-control', 'Pest Control'),
        ('harvesting', 'Harvesting'),
        ('soil_enrichment', 'Soil Enrichment'),
    ])
    crop_type = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=100, blank=True)
    season = models.CharField(max_length=50, blank=True, choices=[
        ('dry', 'Dry Season'),
        ('rainy', 'Rainy Season'),
        ('all', 'All Seasons'),
    ])
    difficulty = models.CharField(max_length=20, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ], default='beginner')
    read_time = models.IntegerField(null=True, blank=True)  # in minutes
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    author_name = models.CharField(max_length=255, blank=True)
    author_role = models.CharField(max_length=255, blank=True)
    tags = models.JSONField(default=list, blank=True)
    images = models.JSONField(default=list, blank=True)
    video_url = models.URLField(blank=True)
    download_url = models.URLField(blank=True)
    featured = models.BooleanField(default=False)
    verified = models.BooleanField(default=False)
    views = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    bookmarks = models.IntegerField(default=0)
    published_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_at', '-featured', '-views']
        verbose_name_plural = "Advisory Content"

    def __str__(self):
        return self.title


class Course(models.Model):
    """Training courses with modules and pricing"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=500)
    description = models.TextField()
    category = models.CharField(max_length=100, choices=[
        ('farming', 'Farming'),
        ('planning', 'Planning'),
        ('technology', 'Technology'),
        ('climate', 'Climate'),
        ('livestock', 'Livestock'),
        ('soil', 'Soil'),
        ('pest-control', 'Pest Control'),
    ])
    difficulty = models.CharField(max_length=20, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ], default='beginner')
    duration = models.CharField(max_length=50)  # e.g., "45 mins", "2 hours"
    duration_minutes = models.IntegerField()  # for sorting/filtering
    modules = models.JSONField(default=list)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    author_name = models.CharField(max_length=255, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_free = models.BooleanField(default=True)
    image = models.URLField(blank=True)
    views = models.IntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    featured = models.BooleanField(default=False)
    published_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_at', '-featured', '-views']

    def __str__(self):
        return self.title


class Resource(models.Model):
    """Downloadable resources like PDFs, tools, guides"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=500)
    description = models.TextField()
    resource_type = models.CharField(max_length=50, choices=[
        ('PDF Guide', 'PDF Guide'),
        ('Excel Tool', 'Excel Tool'),
        ('Video Guide', 'Video Guide'),
        ('Data Reports', 'Data Reports'),
        ('PDF Reference', 'PDF Reference'),
    ])
    category = models.CharField(max_length=100, choices=[
        ('health', 'Health'),
        ('tools', 'Tools'),
        ('planning', 'Planning'),
        ('soil', 'Soil'),
        ('market', 'Market'),
        ('certification', 'Certification'),
    ])
    file_url = models.URLField()
    file_size = models.CharField(max_length=20)  # e.g., "12.5 MB"
    file_size_bytes = models.BigIntegerField()  # for sorting
    downloads = models.IntegerField(default=0)
    image = models.URLField(blank=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-downloads', '-featured', 'title']

    def __str__(self):
        return self.title


class UserBookmark(models.Model):
    """User bookmarks for advisory content"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    advisory_content = models.ForeignKey(AdvisoryContent, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ['user', 'advisory_content']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} bookmarked {self.advisory_content.title}"


class UserLike(models.Model):
    """User likes for advisory content"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    advisory_content = models.ForeignKey(AdvisoryContent, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ['user', 'advisory_content']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} liked {self.advisory_content.title}"


class ConsultationRequest(models.Model):
    """Expert consultation requests"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    expert = models.ForeignKey(Expert, on_delete=models.CASCADE)
    subject = models.CharField(max_length=255)
    description = models.TextField()
    preferred_date = models.DateField()
    preferred_time = models.TimeField()
    duration_hours = models.DecimalField(max_digits=3, decimal_places=1, default=1.0)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ], default='pending')
    expert_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Consultation: {self.user.username} with {self.expert.name}"
