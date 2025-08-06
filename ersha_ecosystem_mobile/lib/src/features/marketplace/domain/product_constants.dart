class ProductConstants {
  // Unit choices matching Django backend
  static const Map<String, String> unitChoices = {
    'kg': 'Kilogram',
    'ton': 'Ton',
    'quintal': 'Quintal',
    'liter': 'Liter',
    'piece': 'Piece',
    'bundle': 'Bundle',
  };

  // Category choices matching Django backend
  static const Map<String, String> categoryChoices = {
    'vegetables': 'Vegetables',
    'fruits': 'Fruits',
    'grains': 'Grains & Cereals',
    'dairy': 'Dairy Products',
    'coffee': 'Coffee & Tea',
    'spices': 'Spices & Herbs',
    'legumes': 'Legumes',
    'tubers': 'Tubers & Roots',
    'other': 'Other',
  };

  // Get list of unit display names
  static List<String> get unitDisplayNames => 
      unitChoices.values.toList();
  
  // Get unit value from display name
  static String? getUnitValue(String displayName) {
    return unitChoices.entries
        .firstWhere(
          (entry) => entry.value == displayName,
          orElse: () => const MapEntry('', ''),
        )
        .key;
  }

  // Get list of category display names
  static List<String> get categoryDisplayNames => 
      categoryChoices.values.toList();
  
  // Get category value from display name
  static String? getCategoryValue(String displayName) {
    return categoryChoices.entries
        .firstWhere(
          (entry) => entry.value == displayName,
          orElse: () => const MapEntry('other', 'Other'),
        )
        .key;
  }
}
