import 'package:flutter/material.dart';
import 'package:ersha_ecosystem_mobile/src/features/auth/presentation/register_screen.dart';
import 'package:ersha_ecosystem_mobile/src/features/auth/presentation/login_screen.dart';

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
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.green,
          primary: Colors.green.shade600,
          secondary: Colors.teal.shade600,
        ),
        useMaterial3: true,
      ),
      initialRoute: '/register',
      routes: {
        '/register': (context) => RegisterScreen(
              onSwitchToLogin: () {
                Navigator.pushReplacementNamed(context, '/login');
              },
            ),
        '/login': (context) => LoginScreen(
              onSwitchToRegister: () {
                Navigator.pushReplacementNamed(context, '/register');
              },
            ),
      },
    );
  }
}