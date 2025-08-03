import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../data/models/user_model.dart';
import '../data/services/auth_service.dart';

enum AuthState {
  initial,
  loading,
  authenticated,
  unauthenticated,
  error,
}

class AuthProvider extends ChangeNotifier {
  AuthState _state = AuthState.initial;
  UserModel? _user;
  String? _errorMessage;
  AuthService? _authService;
  bool _isInitialized = false;

  AuthState get state => _state;
  UserModel? get user => _user;
  String? get errorMessage => _errorMessage;
  bool get isAuthenticated => _state == AuthState.authenticated && _user != null;
  bool get isLoading => _state == AuthState.loading;

  AuthProvider() {
    _initializeAuthService();
  }

  Future<void> _initializeAuthService() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _authService = AuthService(prefs);
      _isInitialized = true;
      await checkAuthStatus();
    } catch (e) {
      print('DEBUG AuthProvider: Failed to initialize AuthService: $e');
      _setError('Failed to initialize authentication service');
    }
  }

  Future<void> _ensureInitialized() async {
    if (!_isInitialized || _authService == null) {
      await _initializeAuthService();
    }
  }

  // Check if user is already logged in
  Future<void> checkAuthStatus() async {
    try {
      _setState(AuthState.loading);
      
      if (_authService == null) {
        _setState(AuthState.unauthenticated);
        return;
      }
      
      final isLoggedIn = await _authService!.isLoggedIn();
      if (isLoggedIn) {
        _user = await _authService!.getCurrentUser();
        _setState(AuthState.authenticated);
      } else {
        _setState(AuthState.unauthenticated);
      }
    } catch (e) {
      _setError('Failed to check authentication status');
    }
  }

  // Login user
  Future<bool> login(String email, String password) async {
    try {
      _setState(AuthState.loading);
      _clearError();

      // Ensure AuthService is initialized
      await _ensureInitialized();
      if (_authService == null) {
        throw Exception('Authentication service failed to initialize');
      }

      final loginRequest = LoginRequest(
        email: email.trim(),
        password: password,
      );

      final authResponse = await _authService!.login(loginRequest);
      _user = authResponse.user;
      _setState(AuthState.authenticated);
      
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }

  // Register user
  Future<bool> register({
    required String email,
    required String password,
    required String passwordConfirm,
    required String username,
    required String firstName,
    required String lastName,
    required String phone,
    required String region,
    required String userType,
    required String location,
    String? farmSize,
    String? businessLicenseNumber,
  }) async {
    try {
      print('DEBUG AuthProvider: Starting registration');
      _setState(AuthState.loading);
      _clearError();

      // Ensure AuthService is initialized
      await _ensureInitialized();
      if (_authService == null) {
        throw Exception('Authentication service failed to initialize');
      }

      final registerRequest = RegisterRequest(
        email: email.trim(),
        password: password,
        passwordConfirm: passwordConfirm,
        username: username,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        region: region,
        userType: userType,
        location: location.trim(),
        farmSize: farmSize?.trim(),
        businessLicenseNumber: businessLicenseNumber?.trim(),
      );

      print('DEBUG AuthProvider: RegisterRequest created: ${registerRequest.toJson()}');
      
      final authResponse = await _authService!.register(registerRequest);
      print('DEBUG AuthProvider: AuthService.register completed successfully');
      
      _user = authResponse.user;
      _setState(AuthState.authenticated);
      
      print('DEBUG AuthProvider: Registration successful, user: ${_user?.toJson()}');
      return true;
    } catch (e, stackTrace) {
      print('DEBUG AuthProvider: Registration failed with error: $e');
      print('DEBUG AuthProvider: Stack trace: $stackTrace');
      _setError(e.toString());
      return false;
    }
  }

  // Logout user
  Future<void> logout() async {
    try {
      _setState(AuthState.loading);
      
      if (_authService != null) {
        await _authService!.logout();
      }
      
      _user = null;
      _setState(AuthState.unauthenticated);
    } catch (e) {
      // Even if logout fails on server, clear local data
      _user = null;
      _setState(AuthState.unauthenticated);
    }
  }

  // Update user profile
  Future<bool> updateProfile(Map<String, dynamic> data) async {
    try {
      _setState(AuthState.loading);
      _clearError();

      // Ensure AuthService is initialized
      await _ensureInitialized();
      if (_authService == null) {
        throw Exception('Authentication service failed to initialize');
      }

      final updatedUser = await _authService!.updateProfile(data);
      _user = updatedUser;
      _setState(AuthState.authenticated);
      
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }

  // Clear error message
  void clearError() {
    _clearError();
  }

  // Private helper methods
  void _setState(AuthState newState) {
    _state = newState;
    notifyListeners();
  }

  void _setError(String error) {
    _errorMessage = error;
    _state = AuthState.error;
    notifyListeners();
  }

  void _clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  @override
  void dispose() {
    super.dispose();
  }
}