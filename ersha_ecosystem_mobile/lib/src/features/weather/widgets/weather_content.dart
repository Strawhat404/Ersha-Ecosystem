import 'package:flutter/material.dart';

class WeatherContent extends StatelessWidget {
  final String city;
  final String activeTab;
  const WeatherContent({super.key, required this.city, required this.activeTab});

  @override
  Widget build(BuildContext context) {
    // This is a placeholder for the actual tab content.
    // You can expand this with real weather data and widgets.
    switch (activeTab) {
      case 'current':
        return Card(
          color: Colors.green[50],
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                Text('Current Weather in $city', style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 8),
                Icon(Icons.wb_sunny, color: Colors.orange, size: 48),
                const SizedBox(height: 8),
                Text('25°C, Clear Sky', style: Theme.of(context).textTheme.bodyLarge),
              ],
            ),
          ),
        );
      case 'forecast':
        return Card(
          color: Colors.green[50],
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text('Forecast for $city'),
          ),
        );
      case 'alerts':
        return Card(
          color: Colors.red[50],
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text('No active weather alerts.'),
          ),
        );
      case 'calendar':
        return Card(
          color: Colors.green[100],
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text('Crop Calendar for $city'),
          ),
        );
      case 'activities':
        return Card(
          color: Colors.blue[50],
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text('Recommended Farming Activities'),
          ),
        );
      default:
        return const SizedBox.shrink();
    }
  }
}
