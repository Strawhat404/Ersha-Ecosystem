import 'package:flutter/material.dart';

// THEME AND AUTH IMPORTS
import 'package:ersha_ecosystem_mobile/src/app/theme/app_theme.dart';
import 'package:ersha_ecosystem_mobile/src/features/auth/presentation/login_screen.dart';
import 'package:ersha_ecosystem_mobile/src/features/auth/presentation/register_screen.dart';

// --- THIS IS THE CRUCIAL IMPORT THAT WAS MISSING ---
// It tells this file where to find the 'MarketplaceScreen' class.
import 'package:ersha_ecosystem_mobile/src/features/marketplace/presentation/marketplace_screen.dart';
import 'package:ersha_ecosystem_mobile/src/features/weather/presentation/weather_screen.dart';
import 'package:ersha_ecosystem_mobile/src/features/advisory/presentation/advisory_screen.dart';
import 'package:ersha_ecosystem_mobile/src/features/news/presentation/news_screen.dart';
import 'package:ersha_ecosystem_mobile/src/features/fayda_integration/presentation/fayda_integration_screen.dart';
import 'package:ersha_ecosystem_mobile/src/features/payment_integration/payment_screen.dart';
import 'package:ersha_ecosystem_mobile/src/features/logistics_tracking/logistics_tracking_screen.dart';
import 'package:ersha_ecosystem_mobile/src/common/main_scaffold.dart';

void main() {
  runApp(const AgroGebeyaApp());
}

class AgroGebeyaApp extends StatelessWidget {
  const AgroGebeyaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AgroGebeya',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      initialRoute: '/login',
      routes: {
        '/login': (context) => LoginScreen(
              onSwitchToRegister: () {
                Navigator.pushReplacementNamed(context, '/register');
              },
            ),
        '/register': (context) => RegisterScreen(
              onSwitchToLogin: () {
                Navigator.pushReplacementNamed(context, '/login');
              },
            ),
        '/marketplace': (context) => const MainScaffold(child: MarketplaceScreen()),
        '/weather': (context) => const MainScaffold(child: WeatherScreen()),
        '/news': (context) => const MainScaffold(child: NewsScreen()),
        '/advisory': (context) => const MainScaffold(child: AdvisoryScreen()),
        '/fayda_integration': (context) => const MainScaffold(child: FaydaIntegrationScreen()),
        '/payment_integration': (context) => const MainScaffold(child: PaymentScreen()),
        '/logistics_tracking': (context) => const MainScaffold(child: LogisticsTrackingScreen()),
        // Example: '/profile': (context) => const MainScaffold(child: ProfileScreen()),
        // Add other routes here, wrap them with MainScaffold except login/register
      },
    );
  }
}