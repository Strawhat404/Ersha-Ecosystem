import 'package:flutter/material.dart';
import 'dart:io';
import 'package:ersha_ecosystem_mobile/src/features/marketplace/data/marketplace_service.dart';
import 'package:ersha_ecosystem_mobile/src/features/marketplace/domain/product_model.dart';

class MarketplaceProvider with ChangeNotifier {
  final MarketplaceService _marketplaceService = MarketplaceService();
  List<Product> _products = [];
  bool _isLoading = false;
  String? _error;

  List<Product> get products => _products;
  bool get isLoading => _isLoading;
  String? get error => _error;

  MarketplaceProvider() {
    // Don't auto-fetch products in constructor, let the UI trigger it with user context
  }

  Future<void> fetchProducts({String? userRole, String? userId}) async {
    print('=== MARKETPLACE PROVIDER DEBUG ===');
    print('DEBUG: fetchProducts called with userRole: $userRole, userId: $userId');
    
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      print('DEBUG: About to call _marketplaceService.getProducts');
      _products = await _marketplaceService.getProducts(userRole: userRole, userId: userId);
      print('DEBUG: _marketplaceService.getProducts returned ${_products.length} products');
      
      // Debug: Print all products received
      for (int i = 0; i < _products.length; i++) {
        print('DEBUG: Product $i: name="${_products[i].name}", farmerId="${_products[i].farmerId}"');
      }
    } catch (e) {
      print('DEBUG: Error in fetchProducts: $e');
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
      print('DEBUG: fetchProducts completed, _isLoading set to false');
    }
  }

  Future<bool> addProduct(Product product, String imagePath, String token) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      final success = await _marketplaceService.addProduct(product, imagePath, token);
      if (success) {
        // Note: After adding a product, we should refresh with the same user context
        // The UI should call fetchProducts with appropriate user context
      }
      _isLoading = false;
      notifyListeners();
      return success;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateProduct(Product product, File? imageFile) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      final updatedProduct = await _marketplaceService.updateProduct(product, imageFile);
      if (updatedProduct != null) {
        // Update the local product list with the response from backend
        final index = _products.indexWhere((p) => p.id == product.id);
        if (index != -1) {
          _products[index] = updatedProduct;
        }
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> deleteProduct(String productId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      final success = await _marketplaceService.deleteProduct(productId);
      if (success) {
        // Remove the product from local list
        _products.removeWhere((product) => product.id == productId);
      }
      _isLoading = false;
      notifyListeners();
      return success;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
}
