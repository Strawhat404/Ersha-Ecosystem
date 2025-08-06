import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:ersha_ecosystem_mobile/src/features/marketplace/domain/product_model.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';

class MarketplaceService {
  final String _baseUrl = dotenv.env['API_BASE_URL'] ?? 'http://10.0.2.2:8000/api';

  Future<List<Product>> getProducts({String? userRole, String? userId}) async {
    debugPrint('Fetching products from $_baseUrl/products/');
    debugPrint('User role: $userRole, User ID: $userId');
    
    final response = await http.get(Uri.parse('$_baseUrl/products/'));
    debugPrint('Get products response: ${response.statusCode}');

    if (response.statusCode == 200) {
      final decodedBody = jsonDecode(response.body);
      debugPrint('Raw API response body: $decodedBody');
      debugPrint('Response body type: ${decodedBody.runtimeType}');
      
      List<Product> allProducts = [];
      
      if (decodedBody is List) {
        // API returned an array of products
        debugPrint('API returned a List of ${decodedBody.length} products');
        allProducts = decodedBody.map((dynamic item) {
          debugPrint('=== RAW PRODUCT JSON ===');
          debugPrint('Full product JSON: $item');
          debugPrint('Image field: ${item['image']}');
          debugPrint('Images field: ${item['images']}');
          debugPrint('========================');
          return Product.fromJson(item);
        }).toList();
      } else if (decodedBody is Map<String, dynamic>) {
        // Check if this is a paginated response with 'results' field
        if (decodedBody.containsKey('results') && decodedBody['results'] is List) {
          debugPrint('API returned a paginated response with ${decodedBody['count']} total products');
          final results = decodedBody['results'] as List;
          debugPrint('Processing ${results.length} products from results array');
          allProducts = results.map((dynamic item) {
            debugPrint('=== RAW PRODUCT JSON ===');
            debugPrint('Full product JSON: $item');
            debugPrint('Image field: ${item['image']}');
            debugPrint('Images field: ${item['images']}');
            debugPrint('========================');
            return Product.fromJson(item);
          }).toList();
        } else {
          // API returned a single product object
          debugPrint('API returned a single product Map');
          debugPrint('=== RAW SINGLE PRODUCT JSON ===');
          debugPrint('Full product JSON: $decodedBody');
          debugPrint('Image field: ${decodedBody['image']}');
          debugPrint('Images field: ${decodedBody['images']}');
          debugPrint('===============================');
          allProducts = [Product.fromJson(decodedBody)];
        }
      } else {
        debugPrint('Unexpected API response format: ${decodedBody.runtimeType}');
        throw Exception('Unexpected API response format');
      }
      
      debugPrint('Successfully fetched ${allProducts.length} total products.');
      
      // Apply role-based filtering
      debugPrint('About to call _filterProductsByRole with userRole: $userRole, userId: $userId');
      List<Product> filteredProducts = _filterProductsByRole(allProducts, userRole, userId);
      debugPrint('After filtering: ${filteredProducts.length} products for role: $userRole');
      
      return filteredProducts;
    } else {
      debugPrint('Failed to load products. Body: ${response.body}');
      throw Exception('Failed to load products');
    }
  }
  
  /// Filter products based on user role and ownership
  List<Product> _filterProductsByRole(List<Product> products, String? userRole, String? userId) {
    debugPrint('=== FILTERING DEBUG ===');
    debugPrint('Input: userRole=$userRole, userId=$userId');
    debugPrint('Total products received: ${products.length}');
    
    // Debug: Print all products and their farmer IDs
    for (int i = 0; i < products.length; i++) {
      debugPrint('Product $i: name="${products[i].name}", farmerId="${products[i].farmerId}"');
    }
    
    if (userRole == null || userId == null) {
      debugPrint('No user role or ID provided, returning all ${products.length} products');
      return products; // Return all products if no role specified
    }
    
    switch (userRole.toLowerCase()) {
      case 'farmer':
        // Farmers see only their own products
        debugPrint('Filtering for farmer with userId: $userId');
        final farmerProducts = products.where((product) {
          final matches = product.farmerId == userId;
          debugPrint('Product "${product.name}" farmerId="${product.farmerId}" matches userId="$userId": $matches');
          return matches;
        }).toList();
        debugPrint('Farmer filter result: ${farmerProducts.length} products for farmer $userId');
        return farmerProducts;
        
      case 'buyer':
      case 'merchant':
      case 'agricultural_business':
        // Merchants/buyers see all products from all farmers
        debugPrint('Merchant filter: showing all ${products.length} products');
        return products;
        
      default:
        debugPrint('Unknown role $userRole, returning all ${products.length} products');
        return products;
    }
  }

  Future<bool> addProduct(Product product, String imagePath, String token) async {
    try {
      final url = Uri.parse('$_baseUrl/products/');
      final request = http.MultipartRequest('POST', url);

      request.headers['Authorization'] = 'Bearer $token';

      request.fields['name'] = product.name;
      request.fields['price'] = product.price.toString();
      request.fields['description'] = product.description;
      request.fields['category'] = product.category;
      request.fields['unit'] = product.unit;
      request.fields['quantity'] = product.quantity.toString();
      request.fields['harvest_date'] = product.harvestDate.toIso8601String().split('T')[0];
      request.fields['farmer'] = product.farmerId;

      // Platform-specific image upload
      if (imagePath.isNotEmpty) {
        if (kIsWeb) {
          // On web, imagePath should be a base64 string or bytes
          // Expecting imagePath to be a base64 string
          final bytes = base64Decode(imagePath);
          request.files.add(http.MultipartFile.fromBytes('image', bytes, filename: 'product_image.png'));
        } else {
          // On mobile, use fromPath
          request.files.add(await http.MultipartFile.fromPath('image', imagePath));
        }
      }

      debugPrint('Adding product to $url');
      debugPrint('Headers: ${request.headers}');
      debugPrint('Fields: ${request.fields}');
      debugPrint('Files: ${request.files.map((f) => f.filename).toList()}');

      final response = await request.send();
      final responseBody = await response.stream.bytesToString();

      debugPrint('Status Code: ${response.statusCode}');
      debugPrint('Response Body: $responseBody');

      if (response.statusCode == 201) {
        return true;
      } else {
        debugPrint('Failed to add product. Status: ${response.statusCode}');
        debugPrint('Response: $responseBody');
        return false;
      }
    } catch (e) {
      debugPrint('Error adding product: $e');
      return false;
    }
  }

  Future<Product?> updateProduct(Product product, File? imageFile) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('access_token');
      
      if (token == null) {
        debugPrint('No access token found');
        return null;
      }

      final url = Uri.parse('$_baseUrl/products/${product.id}/');
      final request = http.MultipartRequest('PUT', url);

      request.headers['Authorization'] = 'Bearer $token';

      request.fields['name'] = product.name;
      request.fields['price'] = product.price.toString();
      request.fields['description'] = product.description;
      request.fields['category'] = product.category;
      request.fields['unit'] = product.unit;
      request.fields['quantity'] = product.quantity.toString();
      request.fields['harvest_date'] = product.harvestDate.toIso8601String().split('T')[0];
      request.fields['organic'] = product.organic.toString();

      // Add image if provided
      if (imageFile != null) {
        request.files.add(await http.MultipartFile.fromPath('image', imageFile.path));
      }

      debugPrint('Updating product at $url');
      debugPrint('Headers: ${request.headers}');
      debugPrint('Fields: ${request.fields}');
      debugPrint('Files: ${request.files.map((f) => f.filename).toList()}');

      final response = await request.send();
      final responseBody = await response.stream.bytesToString();

      debugPrint('Update Status Code: ${response.statusCode}');
      debugPrint('Update Response Body: $responseBody');

      if (response.statusCode == 200) {
        // Parse the updated product from the response
        try {
          final updatedProductData = jsonDecode(responseBody);
          debugPrint('=== UPDATED PRODUCT RESPONSE ===');
          debugPrint('Updated product JSON: $updatedProductData');
          debugPrint('Image field: ${updatedProductData['image']}');
          debugPrint('===============================');
          return Product.fromJson(updatedProductData);
        } catch (e) {
          debugPrint('Error parsing updated product response: $e');
          return null;
        }
      } else {
        debugPrint('Failed to update product. Status: ${response.statusCode}');
        debugPrint('Response: $responseBody');
        return null;
      }
    } catch (e) {
      debugPrint('Error updating product: $e');
      return null;
    }
  }

  Future<bool> deleteProduct(String productId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('access_token');
      
      if (token == null) {
        debugPrint('No access token found');
        return false;
      }

      final url = Uri.parse('$_baseUrl/products/$productId/');
      
      debugPrint('Deleting product at $url');

      final response = await http.delete(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      debugPrint('Delete Status Code: ${response.statusCode}');
      debugPrint('Delete Response Body: ${response.body}');

      if (response.statusCode == 204 || response.statusCode == 200) {
        return true;
      } else {
        debugPrint('Failed to delete product. Status: ${response.statusCode}');
        debugPrint('Response: ${response.body}');
        return false;
      }
    } catch (e) {
      debugPrint('Error deleting product: $e');
      return false;
    }
  }
}
