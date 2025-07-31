import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import 'package:ersha_ecosystem_mobile/src/app/theme/app_theme.dart';

enum UserRole { merchant, farmer }

class HeroSection extends StatefulWidget {
  const HeroSection({super.key});

  @override
  State<HeroSection> createState() => _HeroSectionState();
}

class _HeroSectionState extends State<HeroSection> {
  UserRole _selectedRole = UserRole.merchant;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 60, 16, 50),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF052e16), Color(0xFF14532d)], // green-900 to green-800
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Column(
        children: [
          const Text(
            "Agricultural Marketplace",
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(height: 16),
          Text(
            "Connect directly with farmers and merchants. Trade quality produce at competitive prices.",
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 16, color: Colors.white.withOpacity(0.9)),
          ),
          const SizedBox(height: 24),
          _buildRoleToggle(),
          const SizedBox(height: 32),
          _buildStats(),
        ],
      ),
    );
  }

  Widget _buildRoleToggle() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(16),
      ),
      padding: const EdgeInsets.all(8),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _roleButton(
            'Merchant View',
            Iconsax.shopping_cart,
            UserRole.merchant,
          ),
          const SizedBox(width: 8),
          _roleButton(
            'Farmer View',
            Iconsax.tree,
            UserRole.farmer,
          ),
        ],
      ),
    );
  }

  Widget _roleButton(String text, IconData icon, UserRole buttonRole) {
    final bool isActive = _selectedRole == buttonRole;
    return ElevatedButton.icon(
      onPressed: () => setState(() => _selectedRole = buttonRole),
      icon: Icon(icon, size: 20),
      label: Text(text),
      style: ElevatedButton.styleFrom(
        elevation: isActive ? 4 : 0,
        backgroundColor: isActive ? Colors.white : Colors.transparent,
        foregroundColor: isActive ? AppTheme.darkGreen : Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      ),
    );
  }

  Widget _buildStats() {
    final statsData = [
       {'icon': Iconsax.people, 'label': "Active Farmers", 'value': "2,450+"},
      // BEFORE: 'icon': LucideIcons.shoppingCart
      {'icon': Iconsax.shopping_cart, 'label': "Products Listed", 'value': "12,300+"},
      // BEFORE: 'icon': LucideIcons.mapPin
      {'icon': Iconsax.location, 'label': "Regions Covered", 'value': "9"},
      // BEFORE: 'icon': LucideIcons.shield
      {'icon': Iconsax.shield_tick, 'label': "Verified Sellers", 'value': "98%"}
    ];

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: statsData.map((stat) {
        return Column(
          children: [
            Container(
              width: 56,
              height: 56,
              margin: const EdgeInsets.only(bottom: 8),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                shape: BoxShape.circle,
              ),
              child: Icon(stat['icon'] as IconData, color: Colors.white, size: 28),
            ),
            Text(stat['value'] as String, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
            Text(stat['label'] as String, style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 12)),
          ],
        );
      }).toList(),
    );
  }
}