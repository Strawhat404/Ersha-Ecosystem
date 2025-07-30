from django.contrib import admin
from .models import WeatherData

@admin.register(WeatherData)
class WeatherDataAdmin(admin.ModelAdmin):
    list_display = ['region', 'woreda', 'temperature', 'humidity', 'weather_condition', 'created_at']
    list_filter = ['region', 'woreda', 'weather_condition', 'data_source', 'created_at']
    search_fields = ['region', 'woreda', 'weather_condition', 'advisory_text']
    readonly_fields = ['id', 'created_at']
    ordering = ['-created_at', 'region']
    
    fieldsets = (
        ('Location Information', {
            'fields': ('region', 'woreda')
        }),
        ('Weather Conditions', {
            'fields': ('temperature', 'humidity', 'rainfall', 'weather_condition')
        }),
        ('Wind & Pressure', {
            'fields': ('wind_speed', 'wind_direction', 'pressure')
        }),
        ('Additional Data', {
            'fields': ('uv_index', 'visibility')
        }),
        ('Forecast & Advisory', {
            'fields': ('forecast_data', 'advisory_text')
        }),
        ('Metadata', {
            'fields': ('id', 'data_source', 'created_at'),
            'classes': ('collapse',)
        }),
    )
    
    list_per_page = 25
