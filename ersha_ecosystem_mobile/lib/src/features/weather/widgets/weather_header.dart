import 'package:flutter/material.dart';

class WeatherHeader extends StatelessWidget {
  const WeatherHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          'Smart Weather Dashboard',
          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
            fontWeight: FontWeight.bold,
            color: Colors.green[900],
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        Text(
          'Advanced weather insights and agricultural recommendations for Ethiopian farmers',
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
            color: Colors.green[700],
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}
