import 'package:ersha_ecosystem_mobile/src/features/marketplace/domain/product_model.dart';
import 'package:ersha_ecosystem_mobile/src/features/marketplace/presentation/models/marketplace_enums.dart';
import 'package:ersha_ecosystem_mobile/src/features/marketplace/presentation/widgets/product_card.dart';
import 'package:ersha_ecosystem_mobile/src/features/marketplace/presentation/edit_product_screen.dart';
import 'package:ersha_ecosystem_mobile/src/features/marketplace/provider/marketplace_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class ProductList extends StatelessWidget {
  final ViewMode viewMode;
  final UserRole userRole;

  const ProductList({
    super.key,
    this.viewMode = ViewMode.grid,
    required this.userRole,
  });

  // Handler for editing a product
  void _handleEditProduct(BuildContext context, Product product) {
    // Navigate to edit product screen
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => EditProductScreen(product: product),
      ),
    );
  }

  // Handler for deleting a product
  void _handleDeleteProduct(BuildContext context, Product product) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Delete Product'),
          content: Text('Are you sure you want to delete "${product.name}"?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                _confirmDeleteProduct(context, product);
              },
              style: TextButton.styleFrom(foregroundColor: Colors.red),
              child: const Text('Delete'),
            ),
          ],
        );
      },
    );
  }

  // Confirm and execute product deletion
  void _confirmDeleteProduct(BuildContext context, Product product) async {
    final provider = Provider.of<MarketplaceProvider>(context, listen: false);
    try {
      await provider.deleteProduct(product.id);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('"${product.name}" deleted successfully'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to delete product: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  // Handler for adding product to cart
  void _handleAddToCart(BuildContext context, Product product) {
    // TODO: Implement add to cart functionality
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('"${product.name}" added to cart'),
        backgroundColor: Colors.green,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<MarketplaceProvider>(
      builder: (context, provider, child) {
        if (provider.isLoading) {
          return const SliverFillRemaining(
            child: Center(child: CircularProgressIndicator()),
          );
        }

        final products = provider.products; // Products are already filtered by the service

        if (products.isEmpty) {
          return SliverFillRemaining(
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.inventory_2_outlined,
                    size: 64,
                    color: Colors.grey[400],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    userRole == UserRole.farmer
                        ? 'You haven\'t listed any products yet.'
                        : 'No products available at the moment.',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
          );
        }

        if (viewMode == ViewMode.grid) {
          return SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 24, 16, 16),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2, // 2 cards per row
                mainAxisSpacing: 16,
                crossAxisSpacing: 16,
                childAspectRatio: 0.65, // Further increased to make cards much taller
              ),
              delegate: SliverChildBuilderDelegate(
                (BuildContext context, int index) {
                  final product = products[index];
                  // Handle image URL construction
                  String? fullImageUrl;
                  
                  // Debug: Print product images to see what we're getting
                  print('=== PRODUCT IMAGE DEBUG ===');
                  print('Product: ${product.name}');
                  print('Images list: ${product.images}');
                  print('Images length: ${product.images.length}');
                  
                  if (product.images.isNotEmpty && 
                      product.images.first.isNotEmpty && 
                      product.images.first != 'null' &&
                      product.images.first.toLowerCase() != 'null') {
                    final imageUrl = product.images.first;
                    print('Raw image URL from backend: $imageUrl');
                    
                    // If it's already a full URL, use as is, otherwise prepend base URL
                    if (imageUrl.startsWith('http')) {
                      fullImageUrl = imageUrl;
                      print('Using full URL as-is: $fullImageUrl');
                    } else {
                      // Construct full URL for media files
                      final baseUrl = 'http://10.0.2.2:8000';
                      // Ensure the URL starts with / for proper path construction
                      final cleanImageUrl = imageUrl.startsWith('/') ? imageUrl : '/$imageUrl';
                      fullImageUrl = '$baseUrl$cleanImageUrl';
                      print('Constructed full URL: $fullImageUrl');
                    }
                  } else {
                    print('No valid image found - will show plant emoji fallback');
                    print('Reason: images empty=${product.images.isEmpty}, first empty=${product.images.isNotEmpty ? product.images.first.isEmpty : "N/A"}, is null string=${product.images.isNotEmpty ? (product.images.first == "null" || product.images.first.toLowerCase() == "null") : "N/A"}');
                  }
                  print('Final result - fullImageUrl: $fullImageUrl');
                  print('=== END PRODUCT IMAGE DEBUG ===');
                  // If no valid image URL, fullImageUrl remains null and we'll show plant emoji
                  
                  return ProductCard(
                    name: product.name,
                    farmer: product.farmerId, // This should be resolved to a farmer name
                    price: 'ETB ${product.price}/${product.unit}',
                    rating: 4.5, // Placeholder rating
                    location: 'Unknown', // Placeholder location
                    imageUrl: fullImageUrl,
                    canEdit: userRole == UserRole.farmer,
                    productId: product.id,
                    onEdit: userRole == UserRole.farmer ? () => _handleEditProduct(context, product) : null,
                    onDelete: userRole == UserRole.farmer ? () => _handleDeleteProduct(context, product) : null,
                    onAddToCart: userRole == UserRole.merchant ? () => _handleAddToCart(context, product) : null,
                  );
                },
                childCount: products.length,
              ),
            ),
          );
        } else {
          return const SliverFillRemaining(
            child: Center(
              child: Text("List view would be shown here"),
            ),
          );
        }
      },
    );
  }


}
