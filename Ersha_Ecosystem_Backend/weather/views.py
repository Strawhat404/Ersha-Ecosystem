from django.shortcuts import render
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import WeatherData
from .serializers import WeatherDataSerializer

# Create your views here.

class WeatherDataViewSet(viewsets.ModelViewSet):
    queryset = WeatherData.objects.all()
    serializer_class = WeatherDataSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['region', 'woreda', 'weather_condition', 'data_source']
    search_fields = ['region', 'woreda', 'weather_condition', 'advisory_text']
    ordering_fields = ['created_at', 'temperature', 'humidity', 'wind_speed', 'pressure']
    ordering = ['-created_at']
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def alerts(self, request):
        """Get weather alerts for all regions"""
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        
        all_alerts = []
        for item in serializer.data:
            all_alerts.extend(item.get('weather_alerts', []))
        
        # If no alerts from database, provide some sample alerts based on weather conditions
        if not all_alerts:
            for item in serializer.data:
                temp = float(item.get('temperature', 0))
                wind_speed = float(item.get('wind_speed', 0))
                rainfall = float(item.get('rainfall', 0)) if item.get('rainfall') else 0
                
                if temp > 25:
                    all_alerts.append(f"Warm weather in {item.get('region', 'Unknown')}: Stay hydrated!")
                if wind_speed > 5:
                    all_alerts.append(f"Moderate winds in {item.get('region', 'Unknown')}: Secure outdoor items!")
                if rainfall > 5:
                    all_alerts.append(f"Rain expected in {item.get('region', 'Unknown')}: Prepare for wet conditions!")
                elif rainfall == 0 and temp > 20:
                    all_alerts.append(f"Dry conditions in {item.get('region', 'Unknown')}: Consider irrigation for crops!")
        
        return Response({
            'alerts': all_alerts,
            'count': len(all_alerts)
        })
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
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
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
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
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def regions(self, request):
        """Get list of all regions"""
        regions = WeatherData.objects.values_list('region', flat=True).distinct()
        return Response({
            'regions': list(regions),
            'count': len(regions)
        })
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def woredas(self, request):
        """Get list of all woredas"""
        woredas = WeatherData.objects.values_list('woreda', flat=True).distinct()
        return Response({
            'woredas': list(woredas),
            'count': len(woredas)
        })
