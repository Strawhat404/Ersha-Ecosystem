import 'package:ersha_ecosystem_mobile/src/features/marketplace/presentation/add_product_screen.dart';
import 'package:ersha_ecosystem_mobile/src/features/marketplace/presentation/widgets/product_list.dart';
import 'package:ersha_ecosystem_mobile/src/features/marketplace/presentation/models/marketplace_enums.dart';
import 'package:ersha_ecosystem_mobile/src/features/marketplace/provider/marketplace_provider.dart';
import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import 'package:ersha_ecosystem_mobile/src/common/common_banner_appbar.dart';
import 'package:ersha_ecosystem_mobile/src/common/common_drawer.dart';
import 'package:ersha_ecosystem_mobile/src/features/auth/provider/auth_provider.dart';
import 'package:provider/provider.dart';

// 1. Converted the screen to a StatefulWidget to manage state.
class MarketplaceScreen extends StatefulWidget {
  const MarketplaceScreen({super.key});

  @override
  State<MarketplaceScreen> createState() => _MarketplaceScreenState();
}

class _MarketplaceScreenState extends State<MarketplaceScreen> {
  UserRole _currentUserRole = UserRole.merchant;
  bool _hasInitializedProducts = false;

  @override
  void initState() {
    super.initState();
    // Initialize with merchant as default, will be updated in build method
  }

  // Get user role from AuthProvider
  UserRole _getUserRole(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    return _getUserRoleFromProvider(authProvider);
  }
  
  // Extract user role from AuthProvider instance
  UserRole _getUserRoleFromProvider(AuthProvider authProvider) {
    final user = authProvider.user;
    
    if (user != null) {
      print('DEBUG: User type from AuthProvider: ${user.userType}'); // Debug print
      // Map backend user types to UI roles
      switch (user.userType.toLowerCase()) {
        case 'farmer':
          print('DEBUG: Mapped to farmer role'); // Debug print
          return UserRole.farmer;
        case 'buyer':
        case 'merchant':
        case 'agricultural_business':
          print('DEBUG: Mapped to merchant role'); // Debug print
          return UserRole.merchant;
        default:
          print('DEBUG: Unknown user type, defaulting to merchant'); // Debug print
          return UserRole.merchant; // Default fallback
      }
    }
    print('DEBUG: No user found, defaulting to merchant'); // Debug print
    return UserRole.merchant; // Default for unauthenticated users
  }

  void _handleRoleChange(UserRole newRole) {
    setState(() {
      _currentUserRole = newRole;
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
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        // Get the current user role from AuthProvider
        final userRole = _getUserRoleFromProvider(authProvider);
        
        // Update current user role if it has changed and fetch products with new context
        if (_currentUserRole != userRole || !_hasInitializedProducts) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            setState(() {
              _currentUserRole = userRole;
              _hasInitializedProducts = true;
            });
            
            // Fetch products with the current user context
            final marketplaceProvider = Provider.of<MarketplaceProvider>(context, listen: false);
            final userId = authProvider.user?.id?.toString();
            final userTypeString = authProvider.user?.userType;
            
            print('=== MARKETPLACE SCREEN DEBUG ===');
            print('DEBUG: User from AuthProvider: ${authProvider.user?.toJson()}');
            print('DEBUG: User ID: $userId');
            print('DEBUG: User Type: $userTypeString');
            print('DEBUG: User Role (UI): $userRole');
            print('DEBUG: Fetching products for role: $userTypeString, userId: $userId');
            
            marketplaceProvider.fetchProducts(
              userRole: userTypeString,
              userId: userId,
            );
          });
        }
        
        return Scaffold(
          appBar: const CommonBannerAppBar(),
          drawer: const CommonDrawer(),
          floatingActionButton: Consumer<AuthProvider>(
            builder: (context, authProvider, _) {
              // Only show FAB for farmers
              final userRole = _getUserRoleFromProvider(authProvider);
              if (userRole != UserRole.farmer) {
                return const SizedBox.shrink();
              }
              return FloatingActionButton.extended(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const AddProductScreen()),
                  );
                },
                icon: const Icon(Iconsax.add),
                label: const Text('Add Product'),
                backgroundColor: Colors.green,
                foregroundColor: Colors.white,
              );
            },
          ),
          body: CustomScrollView(
            slivers: [
              SliverToBoxAdapter(
                child: HeroSection(
                  onRoleChanged: _handleRoleChange,
                  userRole: userRole,
                ),
              ),
              ProductList(
                userRole: userRole,
              ),
            ],
          ),
        );
      },
    );
  }
}

// --- The HeroSection widget from your code, updated to work with the parent screen ---

class HeroSection extends StatefulWidget {
  final Function(UserRole) onRoleChanged;
  final UserRole? userRole; // Add actual user role parameter

  const HeroSection({super.key, required this.onRoleChanged, this.userRole});

  @override
  State<HeroSection> createState() => _HeroSectionState();
}

class _HeroSectionState extends State<HeroSection> {
  UserRole _selectedRole = UserRole.merchant;

  @override
  void initState() {
    super.initState();
    // If user role is provided, use it and disable toggle
    if (widget.userRole != null) {
      _selectedRole = widget.userRole!;
    }
  }

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
          // Only show toggle if no specific user role is set (unauthenticated users)
          if (widget.userRole == null) _buildRoleToggle(),
          if (widget.userRole != null) _buildCurrentRoleDisplay(),
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

  Widget _buildCurrentRoleDisplay() {
    String roleText = _selectedRole == UserRole.farmer ? 'Farmer View' : 'Merchant View';
    IconData roleIcon = _selectedRole == UserRole.farmer ? Iconsax.tree : Iconsax.shopping_cart;
    
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(16),
      ),
      padding: const EdgeInsets.all(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(roleIcon, size: 20, color: const Color(0xFF14532d)),
            const SizedBox(width: 8),
            Text(
              roleText,
              style: const TextStyle(
                color: Color(0xFF14532d),
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
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