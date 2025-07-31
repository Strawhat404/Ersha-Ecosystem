import 'package:flutter/material.dart';

class WeatherSearchBar extends StatelessWidget {
  final String city;
  final ValueChanged<String> onCityChanged;
  const WeatherSearchBar({super.key, required this.city, required this.onCityChanged});

  @override
  Widget build(BuildContext context) {
    return TextField(
      decoration: InputDecoration(
        labelText: 'Enter city name',
        prefixIcon: const Icon(Icons.location_city, color: Colors.green),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        filled: true,
        fillColor: Colors.white,
      ),
      controller: TextEditingController(text: city),
      onChanged: onCityChanged,
    );
  }
}
