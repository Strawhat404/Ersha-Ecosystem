class UserModel {
  final String id;
  final String email;
  final String fullName;
  final String userType;

  UserModel({
    required this.id,
    required this.email,
    required this.fullName,
    required this.userType,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
    id: json['id'].toString(),
    email: json['email'],
    fullName: json['full_name'] ?? '',
    userType: json['user_type'] ?? '',
  );
}