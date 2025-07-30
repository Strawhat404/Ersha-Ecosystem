from rest_framework import serializers
from .models import WeatherData

class WeatherDataSerializer(serializers.ModelSerializer):
    weather_alerts = serializers.SerializerMethodField()
    farming_recommendations = serializers.SerializerMethodField()
    
    class Meta:
        model = WeatherData
        fields = '__all__'
    
    def get_weather_alerts(self, obj):
        """Generate weather alerts based on current conditions"""
        alerts = []
        
        if obj.temperature and obj.temperature > 35:
            alerts.append({
                'type': 'warning',
                'title': 'Heat Wave Alert',
                'message': 'Extreme heat conditions. Increase irrigation and provide crop shade.',
                'severity': 'high',
                'actions': ['Increase watering frequency', 'Provide shade covers', 'Monitor crop stress']
            })
        elif obj.temperature and obj.temperature > 30:
            alerts.append({
                'type': 'caution',
                'title': 'High Temperature',
                'message': 'Increase watering frequency and monitor for heat stress.',
                'severity': 'medium',
                'actions': ['Increase irrigation', 'Monitor crop stress', 'Provide shade']
            })
        
        if obj.humidity and obj.humidity > 80:
            alerts.append({
                'type': 'info',
                'title': 'High Humidity',
                'message': 'Increased risk of fungal diseases. Monitor crops closely.',
                'severity': 'medium',
                'actions': ['Apply fungicide if needed', 'Improve air circulation', 'Reduce watering']
            })
        
        if obj.wind_speed and obj.wind_speed > 10:
            alerts.append({
                'type': 'caution',
                'title': 'Strong Winds',
                'message': 'Protect tall crops and seedlings from wind damage.',
                'severity': 'medium',
                'actions': ['Install windbreaks', 'Stake tall plants', 'Harvest ripe crops']
            })
        
        return alerts
    
    def get_farming_recommendations(self, obj):
        """Generate farming recommendations based on weather conditions"""
        recommendations = []
        
        if obj.weather_condition and 'rain' in obj.weather_condition.lower():
            recommendations.append({
                'priority': 'high',
                'activity': 'Harvesting',
                'description': 'Complete harvesting before heavy rains',
                'timeFrame': 'Next 24 hours'
            })
        elif obj.temperature and 25 < obj.temperature < 30:
            recommendations.append({
                'priority': 'medium',
                'activity': 'Planting',
                'description': 'Optimal conditions for planting new crops',
                'timeFrame': 'This week'
            })
        
        recommendations.append({
            'priority': 'low',
            'activity': 'Soil Preparation',
            'description': 'Prepare soil for upcoming planting season',
            'timeFrame': 'Next 2 weeks'
        })
        
        return recommendations 