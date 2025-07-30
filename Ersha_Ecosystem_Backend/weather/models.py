import uuid
from django.db import models
from django.utils import timezone

class WeatherData(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    region = models.CharField(max_length=100)
    woreda = models.CharField(max_length=100, blank=True)
    temperature = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    humidity = models.IntegerField(null=True)
    rainfall = models.DecimalField(max_digits=8, decimal_places=2, null=True)
    wind_speed = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    wind_direction = models.CharField(max_length=10, blank=True)
    pressure = models.DecimalField(max_digits=8, decimal_places=2, null=True)
    uv_index = models.IntegerField(null=True)
    visibility = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    weather_condition = models.CharField(max_length=100, blank=True)
    forecast_data = models.JSONField(default=dict, blank=True)  # 7-day forecast
    advisory_text = models.TextField(blank=True)
    data_source = models.CharField(max_length=100, default='Ethiopian Meteorological Agency')
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('region', 'woreda', 'created_at')
        ordering = ['-created_at', 'region']

    def __str__(self):
        return f"{self.region} - {self.woreda} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
