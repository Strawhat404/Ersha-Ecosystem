import 'package:ersha_ecosystem_mobile/src/features/marketplace/presentation/models/marketplace_enums.dart';
import 'package:ersha_ecosystem_mobile/src/features/marketplace/presentation/widgets/product_card.dart';
import 'package:flutter/material.dart';

class ProductList extends StatelessWidget {
  final ViewMode viewMode;

  const ProductList({super.key, this.viewMode = ViewMode.grid});

  // --- MOCK DATA ---
  // A list of maps, where each map represents a product.
  final List<Map<String, dynamic>> mockProducts = const [
    {
      "name": "Premium Fresh Carrots",
      "farmer": "Oromia Organic Farm",
      "price": "ETB 45/kg",
      "rating": 4.8,
      "location": "Addis Ababa",
      "imageUrl": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop",
    },
    {
      "name": "Sweet Red Apples",
      "farmer": "Mountain View Orchards",
      "price": "ETB 65/kg",
      "rating": 4.7,
      "location": "Hawassa",
      "imageUrl": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop",
    },
    {
      "name": "Ethiopian Coffee Beans",
      "farmer": "Highland Coffee Growers",
      "price": "ETB 180/kg",
      "rating": 4.9,
      "location": "Jimma",
      "imageUrl": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
    },
    {
      "name": "Golden Potatoes",
      "farmer": "Valley Fresh Produce",
      "price": "ETB 35/kg",
      "rating": 4.5,
      "location": "Bahir Dar",
      "imageUrl": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop",
    },
    {
      "name": "Organic Basmati Rice",
      "farmer": "Highland Farmers Coop",
      "price": "ETB 85/kg",
      "rating": 4.6,
      "location": "Oromia",
      "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    },
    {
      "name": "Fresh Tomatoes",
      "farmer": "Sunrise Vegetables",
      "price": "ETB 55/kg",
      "rating": 4.6,
      "location": "Addis Ababa",
      "imageUrl": "https://images.unsplash.com/photo-1561138020-22596155a04a?w=400&h=300&fit=crop",
    },
    {
      "name": "Green Bananas",
      "farmer": "Tropical Harvest",
      "price": "ETB 25/kg",
      "rating": 4.3,
      "location": "Arba Minch",
      "imageUrl": "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&h=300&fit=crop",
    },
    {
      "name": "Yellow Onions",
      "farmer": "Green Valley Farm",
      "price": "ETB 28/kg",
      "rating": 4.4,
      "location": "Debre Zeit",
      "imageUrl": "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb7?w=400&h=300&fit=crop",
    },
  ];

  @override
  Widget build(BuildContext context) {
    // We'll primarily build the grid view as requested.
    // The logic to switch to a list view would go here.
    if (viewMode == ViewMode.grid) {
      return SliverPadding(
        padding: const EdgeInsets.fromLTRB(16, 24, 16, 16),
        sliver: SliverGrid(
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2, // 2 cards per row
            mainAxisSpacing: 16,
            crossAxisSpacing: 16,
            childAspectRatio: 0.62, // Adjust this ratio to fit the card content
          ),
          delegate: SliverChildBuilderDelegate(
            (BuildContext context, int index) {
              // Get the product data for the current index
              final product = mockProducts[index];
              // Create a ProductCard and pass the data to it
              return ProductCard(
                name: product['name'],
                farmer: product['farmer'],
                price: product['price'],
                rating: product['rating'],
                location: product['location'],
                imageUrl: product['imageUrl'],
              );
            },
            childCount: mockProducts.length, // The number of items in the grid
          ),
        ),
      );
    } else {
      // Placeholder for the list view
      return const SliverFillRemaining(
        child: Center(
          child: Text("List view would be shown here"),
        ),
      );
    }
  }
}