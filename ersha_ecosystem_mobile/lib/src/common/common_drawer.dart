
import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';

// Top-level function to handle backend logout

class CommonDrawer extends StatelessWidget {
  const CommonDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topRight: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
      ),
      child: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 16),
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF052e16), Color(0xFF14532d)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.only(
                topRight: Radius.circular(32),
                bottomRight: Radius.circular(0),
              ),
            ),
            child: const Text(
              'Ersha Ecosystem',
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: Colors.white,
                fontFamily: 'Serif',
                letterSpacing: 1.5,
              ),
            ),
          ),
          Expanded(
            child: Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  bottomRight: Radius.circular(32),
                ),
              ),
              child: ListView(
                padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 8),
                children: [
                  _drawerItem(
                    icon: Iconsax.verify,
                    label: 'Fayda Integration',
                    color: const Color(0xFF14532d),
                    onTap: () => Navigator.of(context).pushNamed('/fayda_integration'),
                  ),
                  _drawerItem(
                    icon: Iconsax.card,
                    label: 'Payment Integration',
                    color: Colors.blueAccent,
                    onTap: () => Navigator.of(context).pushNamed('/payment_integration'),
                  ),
                  _drawerItem(
                    icon: Iconsax.truck,
                    label: 'Logistics Tracking',
                    color: Colors.orangeAccent,
                    onTap: () => Navigator.of(context).pushNamed('/logistics_tracking'),
                  ),
                ],
              ),
            ),
          ),
          // Logout button at the bottom
          Padding(
            padding: const EdgeInsets.only(bottom: 24.0, left: 8.0, right: 8.0),
            child: _drawerItem(
              icon: Iconsax.logout,
              label: 'Logout',
              color: Colors.redAccent,
              onTap: () async {
                // Call backend logout API
                try {
                  // Replace with your actual logout endpoint
                  final response = await fetchLogout();
                  if (response) {
                    // Clear user state (e.g., tokens)
                    // You may need to use Provider, Riverpod, etc. to clear auth state
                    // For now, just navigate to login
                    Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Logout failed. Please try again.')),
                    );
                  }
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Error: $e')),
                  );
                }
              },
            ),
          ),
        ],
      ),
    );
  }
  }
  // Drawer item helper for consistent style
  Widget _drawerItem({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: color, size: 28),
      title: Text(
        label,
        style: const TextStyle(
          color: Colors.black,
          fontSize: 18,
          fontWeight: FontWeight.w600,
        ),
      ),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      onTap: onTap,
      hoverColor: Colors.black.withOpacity(0.04),
      splashColor: Colors.black.withOpacity(0.08),
    );
  }


// Top-level function to handle backend logout
Future<bool> fetchLogout() async {
  // Replace with your actual API call logic
  // Example using http package:
  // final response = await http.post(Uri.parse('https://your-backend/api/logout/'), headers: {...});
  // return response.statusCode == 200;
  await Future.delayed(const Duration(milliseconds: 500));
  return true; // Simulate success
}
