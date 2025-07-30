from django.shortcuts import render
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import WeatherData
from .serializers import WeatherDataSerializer

# Create your views here.

class WeatherDataViewSet(viewsets.ModelViewSet):
    queryset = WeatherData.objects.all()
    serializer_class = WeatherDataSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['region', 'woreda', 'weather_condition', 'data_source']
    search_fields = ['region', 'woreda', 'weather_condition', 'advisory_text']
    ordering_fields = ['created_at', 'temperature', 'humidity', 'wind_speed', 'pressure']
    ordering = ['-created_at']
    
    @action(detail=False, methods=['get'])
    def alerts(self, request):
        """Get weather alerts for all regions"""
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        
        all_alerts = []
        for item in serializer.data:
            all_alerts.extend(item.get('weather_alerts', []))
        
        return Response({
            'alerts': all_alerts,
            'count': len(all_alerts)
        })
    
    @action(detail=False, methods=['get'])
    def recommendations(self, request):
        """Get farming recommendations for all regions"""
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        
        all_recommendations = []
        for item in serializer.data:
            all_recommendations.extend(item.get('farming_recommendations', []))
        
        return Response({
            'recommendations': all_recommendations,
            'count': len(all_recommendations)
        })
    
    @action(detail=False, methods=['get'])
    def current_conditions(self, request):
        """Get current weather conditions for all regions"""
        queryset = self.filter_queryset(self.get_queryset())
        # Get the latest weather data for each region
        latest_weather = {}
        for weather in queryset:
            region_key = f"{weather.region}_{weather.woreda}" if weather.woreda else weather.region
            if region_key not in latest_weather or weather.created_at > latest_weather[region_key].created_at:
                latest_weather[region_key] = weather
        
        serializer = self.get_serializer(latest_weather.values(), many=True)
        return Response({
            'current_conditions': serializer.data,
            'count': len(serializer.data)
        })
