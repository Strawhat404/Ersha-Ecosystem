import 'product_constants.dart';

class Product {
  final String id;
  final String name;
  final double price;
  final String description;
  final String category;
  final String unit;
  final double quantity;
  final DateTime harvestDate;
  final List<String> images;
  final String farmerId;
  final bool organic;
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;

  Product({
    this.id = '',
    required this.name,
    required this.price,
    required this.description,
    required this.category,
    required this.unit,
    required this.quantity,
    required this.harvestDate,
    this.images = const [],
    required this.farmerId,
    this.organic = false,
    this.isActive = true,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) : 
    createdAt = createdAt ?? DateTime.now(),
    updatedAt = updatedAt ?? DateTime.now();

  Map<String, dynamic> toJson() {
    return {
      if (id.isNotEmpty) 'id': id,
      'name': name,
      'price': price,
      'description': description,
      'category': category,
      'unit': unit,
      'quantity': quantity,
      'harvest_date': harvestDate.toIso8601String().split('T')[0], // Format as YYYY-MM-DD
      'images': images,
      'farmer_id': farmerId,
      'organic': organic,
      'is_active': isActive,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      price: _parseDouble(json['price']),
      description: json['description'] ?? '',
      category: json['category'] ?? 'other',
      unit: json['unit'] ?? 'kg',
      quantity: _parseDouble(json['quantity']),
      harvestDate: json['harvest_date'] != null 
          ? DateTime.tryParse(json['harvest_date']) ?? DateTime.now()
          : DateTime.now(),
      images: _parseImages(json),
      farmerId: _extractFarmerId(json),
      organic: json['organic'] ?? false,
      isActive: json['is_active'] ?? true,
      createdAt: json['created_at'] != null 
          ? DateTime.tryParse(json['created_at']) ?? DateTime.now()
          : DateTime.now(),
      updatedAt: json['updated_at'] != null
          ? DateTime.tryParse(json['updated_at']) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  /// Helper method to safely parse double values from different data types
  static double _parseDouble(dynamic value) {
    if (value == null) return 0.0;
    
    if (value is double) return value;
    if (value is int) return value.toDouble();
    if (value is String) {
      return double.tryParse(value) ?? 0.0;
    }
    
    return 0.0;
  }

  /// Helper method to parse images from backend API response
  /// Backend returns single 'image' field, we convert it to list format for compatibility
  static List<String> _parseImages(Map<String, dynamic> json) {
    // Check for images array first (for future compatibility)
    if (json['images'] != null && json['images'] is List) {
      return List<String>.from(json['images']);
    }
    
    // Handle single image field from backend
    if (json['image'] != null && json['image'].toString().isNotEmpty) {
      final imageUrl = json['image'].toString();
      // Filter out null, empty, or 'null' string values
      if (imageUrl != 'null' && imageUrl.isNotEmpty) {
        return [imageUrl];
      }
    }
    
    // Return empty list if no valid image found
    return [];
  }

  /// Helper method to extract farmer ID from different API response formats
  static String _extractFarmerId(Map<String, dynamic> json) {
    // Try farmer_id field first (direct ID)
    if (json['farmer_id'] != null) {
      return json['farmer_id'].toString();
    }
    
    // Try farmer field - could be ID or nested object
    if (json['farmer'] != null) {
      final farmer = json['farmer'];
      
      // If farmer is a nested object with id field
      if (farmer is Map<String, dynamic> && farmer['id'] != null) {
        return farmer['id'].toString();
      }
      
      // If farmer is just a direct ID
      if (farmer is num || farmer is String) {
        return farmer.toString();
      }
    }
    
    // Fallback to empty string
    return '';
  }
}
