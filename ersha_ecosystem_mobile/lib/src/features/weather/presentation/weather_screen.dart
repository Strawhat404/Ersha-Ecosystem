import 'package:flutter/material.dart';
import 'package:ersha_ecosystem_mobile/src/common/common_banner_appbar.dart';
import 'package:ersha_ecosystem_mobile/src/common/common_drawer.dart';
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
      appBar: const CommonBannerAppBar(),
      drawer: const CommonDrawer(),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Container(
              padding: const EdgeInsets.fromLTRB(16, 60, 16, 50),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF052e16), Color(0xFF14532d)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: Column(
                children: [
                  const Text(
                    "Smart Weather Dashboard",
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    "Advanced weather insights and agricultural recommendations for Ethiopian farmers.",
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 16, color: Colors.white.withOpacity(0.9)),
                  ),
                  const SizedBox(height: 24),
                  WeatherSearchBar(
                    city: city,
                    onCityChanged: (value) => setState(() => city = value),
                  ),
                  const SizedBox(height: 24),
                  WeatherTabs(
                    activeTab: activeTab,
                    onTabChanged: (tab) => setState(() => activeTab = tab),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 0, vertical: 0),
              child: WeatherContent(
                city: city,
                activeTab: activeTab,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
