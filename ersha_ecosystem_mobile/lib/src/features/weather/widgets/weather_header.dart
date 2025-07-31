import 'package:flutter/material.dart';
import 'package:ersha_ecosystem_mobile/src/common/common_banner_appbar.dart';
import 'package:ersha_ecosystem_mobile/src/common/common_drawer.dart';


class WeatherHeader extends StatelessWidget {
  const WeatherHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Banner app bar is now handled by Scaffold/app bar
        const SizedBox(height: 12),
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
