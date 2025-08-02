import 'package:json_annotation/json_annotation.dart';

part 'user_model.g.dart';

@JsonSerializable()
class UserModel {
  final int id;
  final String email;
  final String username;
  @JsonKey(name: 'first_name')
  final String firstName;
  @JsonKey(name: 'last_name')
  final String lastName;
  final String phone;
  final String region;
  @JsonKey(name: 'fayda_id')
  final String? faydaId;
  @JsonKey(name: 'user_type')
  final String userType;
  @JsonKey(name: 'verification_status')
  final String verificationStatus;
  @JsonKey(name: 'verified_at')
  final String? verifiedAt;
  @JsonKey(name: 'is_verified')
  final bool isVerified;

  UserModel({
    required this.id,
    required this.email,
    required this.username,
    required this.firstName,
    required this.lastName,
    required this.phone,
    required this.region,
    this.faydaId,
    required this.userType,
    required this.verificationStatus,
    this.verifiedAt,
    required this.isVerified,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) => _$UserModelFromJson(json);
  Map<String, dynamic> toJson() => _$UserModelToJson(this);

  // Helper methods
  String get fullName => '$firstName $lastName';
  bool get isFarmer => userType == 'farmer';
  bool get isMerchant => userType == 'buyer' || userType == 'agricultural_business';
}

@JsonSerializable()
class AuthResponse {
  final UserModel user;
  final String access;
  final String refresh;

  AuthResponse({
    required this.user,
    required this.access,
    required this.refresh,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) => _$AuthResponseFromJson(json);
  Map<String, dynamic> toJson() => _$AuthResponseToJson(this);
}

@JsonSerializable()
class LoginRequest {
  final String email;
  final String password;

  LoginRequest({
    required this.email,
    required this.password,
  });

  factory LoginRequest.fromJson(Map<String, dynamic> json) => _$LoginRequestFromJson(json);
  Map<String, dynamic> toJson() => _$LoginRequestToJson(this);
}

@JsonSerializable()
class RegisterRequest {
  final String email;
  final String password;
  @JsonKey(name: 'password_confirm')
  final String passwordConfirm;
  final String username;
  @JsonKey(name: 'first_name')
  final String firstName;
  @JsonKey(name: 'last_name')
  final String lastName;
  final String phone;
  final String region;
  @JsonKey(name: 'user_type')
  final String userType;
  final String location;
  @JsonKey(name: 'farm_size')
  final String? farmSize;
  @JsonKey(name: 'business_license_number')
  final String? businessLicenseNumber;

  RegisterRequest({
    required this.email,
    required this.password,
    required this.passwordConfirm,
    required this.username,
    required this.firstName,
    required this.lastName,
    required this.phone,
    required this.region,
    required this.userType,
    required this.location,
    this.farmSize,
    this.businessLicenseNumber,
  });

  factory RegisterRequest.fromJson(Map<String, dynamic> json) => _$RegisterRequestFromJson(json);
  Map<String, dynamic> toJson() => _$RegisterRequestToJson(this);
}
