from django.core.management.base import BaseCommand
from weather.models import WeatherData
from django.utils import timezone
from decimal import Decimal
import random

class Command(BaseCommand):
    help = 'Populate the WeatherData model with sample weather data for Ethiopian regions.'

    def handle(self, *args, **options):
        # Ethiopian regions and their typical weather patterns
        regions_data = [
            {
                'region': 'Addis Ababa',
                'woreda': 'Kolfe Keranio',
                'temperature': 22.5,
                'humidity': 65,
                'rainfall': 0.0,
                'wind_speed': 3.5,
                'wind_direction': 'NE',
                'pressure': 1013.2,
                'uv_index': 8,
                'visibility': 10.0,
                'weather_condition': 'Clear',
                'forecast_data': {
                    'day1': {'temp': 24, 'condition': 'Clear', 'humidity': 60},
                    'day2': {'temp': 23, 'condition': 'Partly Cloudy', 'humidity': 65},
                    'day3': {'temp': 21, 'condition': 'Light Rain', 'humidity': 75},
                    'day4': {'temp': 25, 'condition': 'Clear', 'humidity': 58},
                    'day5': {'temp': 22, 'condition': 'Cloudy', 'humidity': 70}
                },
                'advisory_text': 'Optimal conditions for outdoor farming activities. Consider planting cool-season crops.'
            },
            {
                'region': 'Oromia',
                'woreda': 'Bishoftu',
                'temperature': 25.8,
                'humidity': 70,
                'rainfall': 2.5,
                'wind_speed': 4.2,
                'wind_direction': 'SE',
                'pressure': 1012.8,
                'uv_index': 9,
                'visibility': 8.5,
                'weather_condition': 'Light Rain',
                'forecast_data': {
                    'day1': {'temp': 26, 'condition': 'Light Rain', 'humidity': 75},
                    'day2': {'temp': 24, 'condition': 'Cloudy', 'humidity': 80},
                    'day3': {'temp': 27, 'condition': 'Clear', 'humidity': 65},
                    'day4': {'temp': 25, 'condition': 'Partly Cloudy', 'humidity': 70},
                    'day5': {'temp': 28, 'condition': 'Clear', 'humidity': 60}
                },
                'advisory_text': 'Light rainfall provides natural irrigation. Good conditions for crop growth.'
            },
            {
                'region': 'Amhara',
                'woreda': 'Bahir Dar',
                'temperature': 28.3,
                'humidity': 75,
                'rainfall': 5.0,
                'wind_speed': 2.8,
                'wind_direction': 'SW',
                'pressure': 1011.5,
                'uv_index': 7,
                'visibility': 6.0,
                'weather_condition': 'Moderate Rain',
                'forecast_data': {
                    'day1': {'temp': 29, 'condition': 'Moderate Rain', 'humidity': 85},
                    'day2': {'temp': 26, 'condition': 'Light Rain', 'humidity': 80},
                    'day3': {'temp': 30, 'condition': 'Clear', 'humidity': 65},
                    'day4': {'temp': 27, 'condition': 'Partly Cloudy', 'humidity': 70},
                    'day5': {'temp': 31, 'condition': 'Clear', 'humidity': 60}
                },
                'advisory_text': 'Moderate rainfall detected. Monitor for potential flooding in low-lying areas.'
            },
            {
                'region': 'Tigray',
                'woreda': 'Mekelle',
                'temperature': 32.1,
                'humidity': 45,
                'rainfall': 0.0,
                'wind_speed': 6.5,
                'wind_direction': 'NW',
                'pressure': 1009.8,
                'uv_index': 10,
                'visibility': 12.0,
                'weather_condition': 'Clear',
                'forecast_data': {
                    'day1': {'temp': 33, 'condition': 'Clear', 'humidity': 40},
                    'day2': {'temp': 31, 'condition': 'Partly Cloudy', 'humidity': 50},
                    'day3': {'temp': 34, 'condition': 'Clear', 'humidity': 35},
                    'day4': {'temp': 30, 'condition': 'Cloudy', 'humidity': 55},
                    'day5': {'temp': 32, 'condition': 'Clear', 'humidity': 45}
                },
                'advisory_text': 'High temperatures and low humidity. Increase irrigation frequency for crops.'
            },
            {
                'region': 'SNNPR',
                'woreda': 'Hawassa',
                'temperature': 26.7,
                'humidity': 80,
                'rainfall': 8.5,
                'wind_speed': 3.0,
                'wind_direction': 'S',
                'pressure': 1010.2,
                'uv_index': 6,
                'visibility': 4.5,
                'weather_condition': 'Heavy Rain',
                'forecast_data': {
                    'day1': {'temp': 25, 'condition': 'Heavy Rain', 'humidity': 90},
                    'day2': {'temp': 24, 'condition': 'Moderate Rain', 'humidity': 85},
                    'day3': {'temp': 27, 'condition': 'Light Rain', 'humidity': 75},
                    'day4': {'temp': 26, 'condition': 'Partly Cloudy', 'humidity': 70},
                    'day5': {'temp': 28, 'condition': 'Clear', 'humidity': 65}
                },
                'advisory_text': 'Heavy rainfall conditions. Avoid outdoor farming activities and monitor drainage.'
            }
        ]

        for region_data in regions_data:
            # Add some variation to make data more realistic
            temp_variation = random.uniform(-2, 2)
            humidity_variation = random.randint(-10, 10)
            
            weather_data = {
                'region': region_data['region'],
                'woreda': region_data['woreda'],
                'temperature': Decimal(str(region_data['temperature'] + temp_variation)),
                'humidity': region_data['humidity'] + humidity_variation,
                'rainfall': Decimal(str(region_data['rainfall'])),
                'wind_speed': Decimal(str(region_data['wind_speed'])),
                'wind_direction': region_data['wind_direction'],
                'pressure': Decimal(str(region_data['pressure'])),
                'uv_index': region_data['uv_index'],
                'visibility': Decimal(str(region_data['visibility'])),
                'weather_condition': region_data['weather_condition'],
                'forecast_data': region_data['forecast_data'],
                'advisory_text': region_data['advisory_text'],
                'data_source': 'Ethiopian Meteorological Agency',
                'created_at': timezone.now()
            }
            
            WeatherData.objects.get_or_create(
                region=weather_data['region'],
                woreda=weather_data['woreda'],
                created_at__date=weather_data['created_at'].date(),
                defaults=weather_data
            )

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created weather data for {len(regions_data)} regions.')
        ) 