import 'package:flutter/material.dart';
import '../widgets/weather_header.dart';
import '../widgets/weather_search_bar.dart';
import '../widgets/weather_tabs.dart';
import '../widgets/weather_content.dart';

class WeatherScreen extends StatefulWidget {
  const WeatherScreen({super.key});

  @override
  State<WeatherScreen> createState() => _WeatherScreenState();
}

class _WeatherScreenState extends State<WeatherScreen> {
  String city = "Addis Ababa";
  String activeTab = "current";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background layers
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFFe0f7fa), Color(0xFFa5d6a7)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
          ),
          // Main content
          SafeArea(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 0, vertical: 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const WeatherHeader(),
                    const SizedBox(height: 16),
                    WeatherSearchBar(
                      city: city,
                      onCityChanged: (value) => setState(() => city = value),
                    ),
                    const SizedBox(height: 24),
                    WeatherTabs(
                      activeTab: activeTab,
                      onTabChanged: (tab) => setState(() => activeTab = tab),
                    ),
                    const SizedBox(height: 24),
                    WeatherContent(
                      city: city,
                      activeTab: activeTab,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
