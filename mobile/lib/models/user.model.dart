/// A user account. Shape matches the backend `publicUser` projection
/// returned by `/auth/login`, `/auth/register` and `/auth/me`.
class User {
  final String id;
  final String email;
  final String role; // ADMIN | TEACHER | STUDENT | PARENT
  final String firstName;
  final String lastName;

  const User({
    required this.id,
    required this.email,
    required this.role,
    required this.firstName,
    required this.lastName,
  });

  String get fullName => '$firstName $lastName'.trim();

  String get initials {
    final f = firstName.isNotEmpty ? firstName[0] : '';
    final l = lastName.isNotEmpty ? lastName[0] : '';
    final result = (f + l).toUpperCase();
    return result.isEmpty ? '?' : result;
  }

  factory User.fromJson(Map<String, dynamic> json) => User(
        id: json['id'] as String,
        email: (json['email'] ?? '') as String,
        role: (json['role'] ?? 'STUDENT') as String,
        firstName: (json['firstName'] ?? '') as String,
        lastName: (json['lastName'] ?? '') as String,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'email': email,
        'role': role,
        'firstName': firstName,
        'lastName': lastName,
      };
}

/// Result of a successful login: the user plus its token pair.
class AuthResult {
  final User user;
  final String accessToken;
  final String refreshToken;

  const AuthResult({
    required this.user,
    required this.accessToken,
    required this.refreshToken,
  });

  factory AuthResult.fromJson(Map<String, dynamic> json) => AuthResult(
        user: User.fromJson(json['user'] as Map<String, dynamic>),
        accessToken: json['accessToken'] as String,
        refreshToken: json['refreshToken'] as String,
      );
}
