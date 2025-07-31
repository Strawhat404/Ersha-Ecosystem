import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';

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
        ],
      ),
    );
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
}
