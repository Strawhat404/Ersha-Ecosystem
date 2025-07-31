import 'package:ersha_ecosystem_mobile/src/features/marketplace/presentation/widgets/product_list.dart';
import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import 'package:ersha_ecosystem_mobile/src/common/common_banner_appbar.dart';
import 'package:ersha_ecosystem_mobile/src/common/common_drawer.dart';

// Assuming this enum is defined in your project.
enum UserRole { merchant, farmer }

// 1. Converted the screen to a StatefulWidget to manage state.
class MarketplaceScreen extends StatefulWidget {
  const MarketplaceScreen({super.key});

  @override
  State<MarketplaceScreen> createState() => _MarketplaceScreenState();
}

class _MarketplaceScreenState extends State<MarketplaceScreen> {
  // 2. Added state to track the selected user role.
  UserRole _selectedRole = UserRole.merchant;

  // 3. Created a callback function to update the state from the HeroSection child.
  void _handleRoleChange(UserRole role) {
    setState(() {
      _selectedRole = role;
    });
  }

  // 4. Added a method to show the "Add Product" dialog.
  void _showAddProductDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: const Text('Add New Product'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                // Image Picker Placeholder
                GestureDetector(
                  onTap: () {
                    // TODO: Implement image picking logic here
                  },
                  child: Container(
                    height: 140,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Iconsax.gallery_add, size: 40, color: Colors.grey[600]),
                        const SizedBox(height: 8),
                        Text('Tap to add image', style: TextStyle(color: Colors.grey[700])),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                // Form Fields
                _buildTextField(label: 'Product Title', icon: Iconsax.box),
                const SizedBox(height: 16),
                _buildTextField(label: 'Description', icon: Iconsax.document_text, maxLines: 3),
                const SizedBox(height: 16),
                _buildTextField(label: 'Amount (e.g., 50/kg)', icon: Iconsax.money_3),
                const SizedBox(height: 16),
                _buildTextField(label: 'Location', icon: Iconsax.location),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Cancel'),
              onPressed: () => Navigator.of(context).pop(),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF14532d), // Primary green
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              child: const Text('Add Product'),
              onPressed: () {
                // TODO: Implement logic to save the new product
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  // Helper widget for creating styled TextFields in the dialog
  Widget _buildTextField({required String label, required IconData icon, int maxLines = 1}) {
    return TextField(
      maxLines: maxLines,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, color: Colors.grey[600]),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF14532d)),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CommonBannerAppBar(),
      drawer: const CommonDrawer(),
      floatingActionButton: _selectedRole == UserRole.farmer
          ? FloatingActionButton.extended(
              onPressed: _showAddProductDialog,
              label: const Text('Add Product'),
              icon: const Icon(Iconsax.add),
              backgroundColor: const Color(0xFF14532d),
              foregroundColor: Colors.white,
            )
          : null, // Don't show the button for merchants
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: HeroSection(
              onRoleChanged: _handleRoleChange, // Pass the callback to the child
            ),
          ),
          const ProductList(),
        ],
      ),
    );
  }
}

// --- The HeroSection widget from your code, updated to work with the parent screen ---

class HeroSection extends StatefulWidget {
  final Function(UserRole) onRoleChanged;

  const HeroSection({super.key, required this.onRoleChanged});

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
          colors: [Color(0xFF052e16), Color(0xFF14532d)],
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
      onPressed: () {
        setState(() => _selectedRole = buttonRole);
        widget.onRoleChanged(buttonRole);
      },
      icon: Icon(icon, size: 20),
      label: Text(text),
      style: ElevatedButton.styleFrom(
        elevation: isActive ? 4 : 0,
        backgroundColor: isActive ? Colors.white : Colors.transparent,
        foregroundColor: isActive ? const Color(0xFF14532d) : Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      ),
    );
  }

  Widget _buildStats() {
    final statsData = [
      {'icon': Iconsax.people, 'label': "Active Farmers", 'value': "2,450+"},
      {'icon': Iconsax.shopping_cart, 'label': "Products Listed", 'value': "12,300+"},
      {'icon': Iconsax.location, 'label': "Regions Covered", 'value': "9"},
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