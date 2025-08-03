// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UserModel _$UserModelFromJson(Map<String, dynamic> json) => UserModel(
  id: (json['id'] as num).toInt(),
  email: json['email'] as String,
  username: json['username'] as String,
  firstName: json['first_name'] as String,
  lastName: json['last_name'] as String,
  phone: json['phone'] as String,
  region: json['region'] as String,
  faydaId: json['fayda_id'] as String?,
  userType: json['user_type'] as String,
  verificationStatus: json['verification_status'] as String,
  verifiedAt: json['verified_at'] as String?,
  isVerified: json['is_verified'] as bool,
);

Map<String, dynamic> _$UserModelToJson(UserModel instance) => <String, dynamic>{
  'id': instance.id,
  'email': instance.email,
  'username': instance.username,
  'first_name': instance.firstName,
  'last_name': instance.lastName,
  'phone': instance.phone,
  'region': instance.region,
  'fayda_id': instance.faydaId,
  'user_type': instance.userType,
  'verification_status': instance.verificationStatus,
  'verified_at': instance.verifiedAt,
  'is_verified': instance.isVerified,
};

AuthResponse _$AuthResponseFromJson(Map<String, dynamic> json) => AuthResponse(
  user: UserModel.fromJson(json['user'] as Map<String, dynamic>),
  access: json['access'] as String,
  refresh: json['refresh'] as String,
);

Map<String, dynamic> _$AuthResponseToJson(AuthResponse instance) =>
    <String, dynamic>{
      'user': instance.user,
      'access': instance.access,
      'refresh': instance.refresh,
    };

LoginRequest _$LoginRequestFromJson(Map<String, dynamic> json) => LoginRequest(
  email: json['email'] as String,
  password: json['password'] as String,
);

Map<String, dynamic> _$LoginRequestToJson(LoginRequest instance) =>
    <String, dynamic>{'email': instance.email, 'password': instance.password};

RegisterRequest _$RegisterRequestFromJson(Map<String, dynamic> json) =>
    RegisterRequest(
      email: json['email'] as String,
      password: json['password'] as String,
      passwordConfirm: json['password_confirm'] as String,
      username: json['username'] as String,
      firstName: json['first_name'] as String,
      lastName: json['last_name'] as String,
      phone: json['phone'] as String,
      region: json['region'] as String,
      userType: json['user_type'] as String,
      location: json['location'] as String,
      farmSize: json['farm_size'] as String?,
      businessLicenseNumber: json['business_license_number'] as String?,
    );

Map<String, dynamic> _$RegisterRequestToJson(RegisterRequest instance) =>
    <String, dynamic>{
      'email': instance.email,
      'password': instance.password,
      'password_confirm': instance.passwordConfirm,
      'username': instance.username,
      'first_name': instance.firstName,
      'last_name': instance.lastName,
      'phone': instance.phone,
      'region': instance.region,
      'user_type': instance.userType,
      'location': instance.location,
      'farm_size': instance.farmSize,
      'business_license_number': instance.businessLicenseNumber,
    };
