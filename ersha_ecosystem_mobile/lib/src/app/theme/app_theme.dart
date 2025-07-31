import 'package:flutter/material.dart';

class AppTheme {
  static const Color primaryGreen = Color(0xFF16A34A); // green-600
  static const Color darkGreen = Color(0xFF15803D);   // green-700
  static const Color lightGreen = Color(0xFFDCFCE7); // green-100
  static const Color primaryGray = Color(0xFFF3F4F6); // gray-100
  static const Color mediumGray = Color(0xFF6B7280); // gray-500
  static const Color darkGray = Color(0xFF1F2937);   // gray-800
  static const Color yellow = Color(0xFFFBBF24);     // yellow-400
  static const Color red = Color(0xFFEF4444);         // red-500

  static final ThemeData lightTheme = ThemeData(
    scaffoldBackgroundColor: const Color(0xFFF9FAFB), // gray-50
    primaryColor: primaryGreen,
    colorScheme: const ColorScheme.light(
      primary: primaryGreen,
      secondary: darkGreen,
      onPrimary: Colors.white,
      surface: Colors.white,
      onSurface: darkGray,
      error: red,
      tertiary: yellow,
    ),
    textTheme: const TextTheme(
      displayLarge: TextStyle(fontWeight: FontWeight.bold, color: darkGray),
      headlineSmall: TextStyle(fontWeight: FontWeight.bold, color: darkGray),
      titleLarge: TextStyle(fontWeight: FontWeight.bold, color: darkGray),
      bodyLarge: TextStyle(color: mediumGray),
      labelLarge: TextStyle(fontWeight: FontWeight.w600, color: Colors.white),
    ),
    inputDecorationTheme: InputDecorationTheme(
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12.0),
        borderSide: BorderSide(color: Colors.grey.shade300),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12.0),
        borderSide: BorderSide(color: Colors.grey.shade200),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12.0),
        borderSide: const BorderSide(color: primaryGreen, width: 2.0),
      ),
      filled: true,
      fillColor: Colors.white,
      contentPadding: const EdgeInsets.symmetric(vertical: 16.0, horizontal: 16.0),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primaryGreen,
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12.0),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        textStyle: const TextStyle(fontWeight: FontWeight.w600),
      ),
    ),
    cardTheme: CardTheme(
      elevation: 4.0,
      shadowColor: Colors.black.withOpacity(0.1),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16.0),
      ),
    ),
    checkboxTheme: CheckboxThemeData(
      fillColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return primaryGreen;
        }
        return mediumGray;
      }),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
    ),
    sliderTheme: SliderThemeData(
      activeTrackColor: primaryGreen,
      inactiveTrackColor: Colors.grey[300],
      thumbColor: primaryGreen,
      overlayColor: primaryGreen.withAlpha(32),
    ),
  );
}