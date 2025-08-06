import 'package:ersha_ecosystem_mobile/src/app/theme/app_theme.dart';
import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';

class ProductCard extends StatelessWidget {
  final String name;
  final String farmer;
  final String price;
  final double rating;
  final String location;
  final String? imageUrl; // Made nullable to handle missing images
  final bool canEdit;
  final String? productId; // Add product ID for edit/delete operations
  final VoidCallback? onEdit; // Callback for edit action
  final VoidCallback? onDelete; // Callback for delete action
  final VoidCallback? onAddToCart; // Callback for add to cart action

  const ProductCard({
    super.key,
    required this.name,
    required this.farmer,
    required this.price,
    required this.rating,
    required this.location,
    this.imageUrl, // Made optional since it can be null
    this.canEdit = false,
    this.productId,
    this.onEdit,
    this.onDelete,
    this.onAddToCart,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2.0,
      shadowColor: Colors.black.withOpacity(0.05),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16.0),
        side: BorderSide(color: Colors.grey.shade200, width: 1),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image Section - More compact
          Container(
            height: 100,
            width: double.infinity,
            child: imageUrl != null && imageUrl!.isNotEmpty
                ? Image.network(
                    imageUrl!,
                    fit: BoxFit.cover,
                    loadingBuilder: (context, child, loadingProgress) {
                      if (loadingProgress == null) return child;
                      return const Center(
                        child: CircularProgressIndicator(strokeWidth: 2),
                      );
                    },
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        color: Colors.grey[100],
                        child: const Center(
                          child: Icon(Iconsax.gallery_slash, color: AppTheme.mediumGray, size: 30),
                        ),
                      );
                    },
                  )
                : Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          Colors.green.shade50,
                          Colors.teal.shade50,
                        ],
                      ),
                    ),
                    child: const Center(
                      child: Text(
                        '🌿',
                        style: TextStyle(fontSize: 40),
                      ),
                    ),
                  ),
          ),
          // Details Section - More spacious
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Product name
                  Text(
                    name,
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  
                  // Farmer info
                  Row(
                    children: [
                      const Icon(Iconsax.verify, color: AppTheme.primaryGreen, size: 12),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          'Farmer ID: $farmer',
                          style: const TextStyle(
                            color: AppTheme.mediumGray,
                            fontSize: 10,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  
                  // Rating and location
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.star, color: AppTheme.yellow, size: 12),
                          const SizedBox(width: 2),
                          Text(
                            rating.toString(),
                            style: const TextStyle(fontSize: 10),
                          ),
                        ],
                      ),
                      Row(
                        children: [
                          const Icon(Iconsax.location, color: AppTheme.mediumGray, size: 10),
                          const SizedBox(width: 2),
                          Text(
                            location,
                            style: const TextStyle(
                              fontSize: 10,
                              color: AppTheme.mediumGray,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  
                  // Price
                  Text(
                    price,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primaryGreen,
                    ),
                  ),
                  const SizedBox(height: 8),
                  
                  // Action buttons
                  SizedBox(
                    width: double.infinity,
                    height: 32,
                    child: canEdit
                        ? Row(
                            children: [
                              Expanded(
                                child: OutlinedButton(
                                  onPressed: onEdit,
                                  style: OutlinedButton.styleFrom(
                                    padding: const EdgeInsets.symmetric(vertical: 6),
                                    side: const BorderSide(color: AppTheme.mediumGray),
                                    foregroundColor: AppTheme.darkGray,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                  ),
                                  child: const Text(
                                    'Edit',
                                    style: TextStyle(fontSize: 11),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 6),
                              Expanded(
                                child: OutlinedButton(
                                  onPressed: onDelete,
                                  style: OutlinedButton.styleFrom(
                                    padding: const EdgeInsets.symmetric(vertical: 6),
                                    side: const BorderSide(color: Colors.red),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                  ),
                                  child: const Text(
                                    'Delete',
                                    style: TextStyle(
                                      color: Colors.red,
                                      fontSize: 11,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          )
                        : ElevatedButton(
                            onPressed: onAddToCart,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.lightGreen,
                              foregroundColor: AppTheme.darkGreen,
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(6),
                              ),
                            ),
                            child: const Text(
                              'Add to Cart',
                              style: TextStyle(fontSize: 11),
                            ),
                          ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}