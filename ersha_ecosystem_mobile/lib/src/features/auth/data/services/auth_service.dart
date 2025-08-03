import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import '../models/user_model.dart';

class AuthService {
  static const String baseUrl = 'http://127.0.0.1:8000/api';
  static const String tokenKey = 'auth_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userKey = 'user_data';
  
  final Dio _dio;
  final SharedPreferences _prefs;
  
  AuthService(this._prefs) : _dio = Dio() {
    _dio.options.baseUrl = baseUrl;
    _dio.options.connectTimeout = const Duration(seconds: 30);
    _dio.options.receiveTimeout = const Duration(seconds: 30);
    
    // Add interceptor for authentication
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await getAccessToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          // Token expired, try to refresh
          final refreshed = await _refreshToken();
          if (refreshed) {
            // Retry the request with new token
            final token = await getAccessToken();
            error.requestOptions.headers['Authorization'] = 'Bearer $token';
            final response = await _dio.fetch(error.requestOptions);
            handler.resolve(response);
            return;
          }
        }
        handler.next(error);
      },
    ));
  }

  // Check if user is logged in
  Future<bool> isLoggedIn() async {
    final token = await getAccessToken();
    final user = await getCurrentUser();
    return token != null && user != null;
  }

  // Get current user from local storage
  Future<UserModel?> getCurrentUser() async {
    final userJson = _prefs.getString(userKey);
    if (userJson != null) {
      return UserModel.fromJson(json.decode(userJson));
    }
    return null;
  }

  // Get access token from local storage
  Future<String?> getAccessToken() async {
    return _prefs.getString(tokenKey);
  }

  // Get refresh token from local storage
  Future<String?> getRefreshToken() async {
    return _prefs.getString(refreshTokenKey);
  }

  // Check internet connectivity
  Future<bool> hasInternetConnection() async {
    final connectivityResult = await Connectivity().checkConnectivity();
    return connectivityResult != ConnectivityResult.none;
  }

  // Login user
  Future<AuthResponse> login(LoginRequest request) async {
    try {
      // Check internet connection
      if (!await hasInternetConnection()) {
        throw Exception('No internet connection. Please check your network and try again.');
      }

      final response = await _dio.post('/auth/login/', data: request.toJson());
      
      if (response.statusCode == 200) {
        final authResponse = AuthResponse.fromJson(response.data);
        
        // Only allow farmers and merchants on mobile
        if (!authResponse.user.isFarmer && !authResponse.user.isMerchant) {
          throw Exception('Only farmers and merchants can access the mobile app.');
        }
        
        // Store tokens and user data locally
        await _storeAuthData(authResponse);
        
        return authResponse;
      } else {
        throw Exception('Login failed. Please check your credentials.');
      }
    } on DioException catch (e) {
      if (e.response?.statusCode == 400) {
        final errorData = e.response?.data;
        if (errorData is Map<String, dynamic>) {
          if (errorData.containsKey('error')) {
            throw Exception(errorData['error']);
          } else if (errorData.containsKey('email')) {
            throw Exception(errorData['email'][0]);
          } else if (errorData.containsKey('password')) {
            throw Exception(errorData['password'][0]);
          }
        }
        throw Exception('Invalid credentials. Please try again.');
      } else if (e.response?.statusCode == 401) {
        throw Exception('Invalid email or password.');
      } else if (e.type == DioExceptionType.connectionTimeout) {
        throw Exception('Connection timeout. Please check your internet connection.');
      } else if (e.type == DioExceptionType.receiveTimeout) {
        throw Exception('Server response timeout. Please try again.');
      }
      throw Exception('Network error. Please check your connection and try again.');
    } catch (e) {
      if (e is Exception) rethrow;
      throw Exception('An unexpected error occurred. Please try again.');
    }
  }

  // Register user
  Future<AuthResponse> register(RegisterRequest request) async {
    try {
      print('DEBUG AuthService: Starting register method');
      print('DEBUG AuthService: Request data: ${request.toJson()}');
      
      // Check internet connection
      if (!await hasInternetConnection()) {
        print('DEBUG AuthService: No internet connection');
        throw Exception('No internet connection. Please check your network and try again.');
      }
      print('DEBUG AuthService: Internet connection available');

      // Only allow farmer and buyer/merchant registration on mobile
      if (request.userType != 'farmer' && request.userType != 'buyer') {
        print('DEBUG AuthService: Invalid user type: ${request.userType}');
        throw Exception('Only farmers and merchants can register on the mobile app.');
      }
      print('DEBUG AuthService: User type validation passed: ${request.userType}');

      print('DEBUG AuthService: Making API call to /auth/register/');
      print('DEBUG AuthService: Base URL: $baseUrl');
      
      final response = await _dio.post('/auth/register/', data: request.toJson());
      
      print('DEBUG AuthService: API response status: ${response.statusCode}');
      print('DEBUG AuthService: API response data: ${response.data}');
      
      if (response.statusCode == 201) {
        print('DEBUG AuthService: Registration successful, parsing response');
        final authResponse = AuthResponse.fromJson(response.data);
        
        // Store tokens and user data locally
        await _storeAuthData(authResponse);
        print('DEBUG AuthService: Auth data stored locally');
        
        return authResponse;
      } else {
        print('DEBUG AuthService: Unexpected status code: ${response.statusCode}');
        throw Exception('Registration failed. Please try again.');
      }
    } on DioException catch (e) {
      print('DEBUG AuthService: DioException caught');
      print('DEBUG AuthService: Error type: ${e.type}');
      print('DEBUG AuthService: Error message: ${e.message}');
      print('DEBUG AuthService: Response status: ${e.response?.statusCode}');
      print('DEBUG AuthService: Response data: ${e.response?.data}');
      
      if (e.response?.statusCode == 400) {
        final errorData = e.response?.data;
        if (errorData is Map<String, dynamic>) {
          // Handle specific validation errors
          final errors = <String>[];
          errorData.forEach((key, value) {
            if (value is List && value.isNotEmpty) {
              errors.add('$key: ${value.first}');
            }
          });
          if (errors.isNotEmpty) {
            final errorMessage = errors.join('\n');
            print('DEBUG AuthService: Validation errors: $errorMessage');
            throw Exception(errorMessage);
          }
        }
        throw Exception('Registration failed. Please check your information.');
      } else if (e.type == DioExceptionType.connectionTimeout) {
        print('DEBUG AuthService: Connection timeout');
        throw Exception('Connection timeout. Please check your internet connection.');
      } else if (e.type == DioExceptionType.receiveTimeout) {
        print('DEBUG AuthService: Receive timeout');
        throw Exception('Server response timeout. Please try again.');
      }
      print('DEBUG AuthService: Network error');
      throw Exception('Network error. Please check your connection and try again.');
    } catch (e, stackTrace) {
      print('DEBUG AuthService: General exception caught: $e');
      print('DEBUG AuthService: Stack trace: $stackTrace');
      if (e is Exception) rethrow;
      throw Exception('An unexpected error occurred. Please try again.');
    }
  }

  // Logout user
  Future<void> logout() async {
    try {
      // Try to logout from server if connected
      if (await hasInternetConnection()) {
        final refreshToken = await getRefreshToken();
        if (refreshToken != null) {
          await _dio.post('/users/logout/', data: {'refresh': refreshToken});
        }
      }
    } catch (e) {
      // Continue with local logout even if server logout fails
    } finally {
      // Always clear local data
      await _clearAuthData();
    }
  }

  // Refresh access token
  Future<bool> _refreshToken() async {
    try {
      final refreshToken = await getRefreshToken();
      if (refreshToken == null) return false;

      final response = await _dio.post('/token/refresh/', data: {
        'refresh': refreshToken,
      });

      if (response.statusCode == 200) {
        final newAccessToken = response.data['access'];
        await _prefs.setString(tokenKey, newAccessToken);
        return true;
      }
    } catch (e) {
      // Refresh failed, clear auth data
      await _clearAuthData();
    }
    return false;
  }

  // Store authentication data locally
  Future<void> _storeAuthData(AuthResponse authResponse) async {
    await _prefs.setString(tokenKey, authResponse.access);
    await _prefs.setString(refreshTokenKey, authResponse.refresh);
    await _prefs.setString(userKey, json.encode(authResponse.user.toJson()));
  }

  // Clear authentication data
  Future<void> _clearAuthData() async {
    await _prefs.remove(tokenKey);
    await _prefs.remove(refreshTokenKey);
    await _prefs.remove(userKey);
  }

  // Update user profile (for future use)
  Future<UserModel> updateProfile(Map<String, dynamic> data) async {
    try {
      if (!await hasInternetConnection()) {
        throw Exception('No internet connection. Please check your network and try again.');
      }

      final response = await _dio.put('/users/profile/', data: data);
      
      if (response.statusCode == 200) {
        final updatedUser = UserModel.fromJson(response.data['user']);
        await _prefs.setString(userKey, json.encode(updatedUser.toJson()));
        return updatedUser;
      } else {
        throw Exception('Failed to update profile.');
      }
    } on DioException catch (e) {
      if (e.response?.statusCode == 400) {
        final errorData = e.response?.data;
        if (errorData is Map<String, dynamic>) {
          final errors = <String>[];
          errorData.forEach((key, value) {
            if (value is List && value.isNotEmpty) {
              errors.add('$key: ${value.first}');
            }
          });
          if (errors.isNotEmpty) {
            throw Exception(errors.join('\n'));
          }
        }
      }
      throw Exception('Network error. Please check your connection and try again.');
    } catch (e) {
      if (e is Exception) rethrow;
      throw Exception('An unexpected error occurred. Please try again.');
    }
  }
}
