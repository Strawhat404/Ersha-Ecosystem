import 'package:flutter/material.dart';

class WeatherSearchBar extends StatelessWidget {
  final String city;
  final ValueChanged<String> onCityChanged;
  const WeatherSearchBar({super.key, required this.city, required this.onCityChanged});

  @override
  Widget build(BuildContext context) {
    final controller = TextEditingController(text: city);
    controller.selection = TextSelection.fromPosition(TextPosition(offset: controller.text.length));
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.only(left: 4, bottom: 6),
          child: Text(
            'Enter city name',
            style: TextStyle(
              color: Colors.white,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        TextField(
          decoration: InputDecoration(
            hintText: "e.g. addis ababa (don't search addis ababa)",
            filled: true,
            fillColor: Colors.white,
            prefixIcon: const Icon(Icons.location_city, color: Color(0xFF14532d)),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFF14532d)),
            ),
          ),
          onChanged: onCityChanged,
          controller: controller,
          style: const TextStyle(color: Color(0xFF14532d)),
        ),
      ],
    );
  }
}
