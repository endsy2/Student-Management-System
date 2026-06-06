/// Parsing helpers shared across models.
DateTime? _parseDate(dynamic value) {
  if (value == null) return null;
  return DateTime.tryParse(value.toString());
}

class Guardian {
  final String id;
  final String firstName;
  final String lastName;
  final String? phone;
  final String? email;
  final String? address;

  const Guardian({
    required this.id,
    required this.firstName,
    required this.lastName,
    this.phone,
    this.email,
    this.address,
  });

  String get fullName => '$firstName $lastName'.trim();

  factory Guardian.fromJson(Map<String, dynamic> json) => Guardian(
        id: (json['id'] ?? '') as String,
        firstName: (json['firstName'] ?? '') as String,
        lastName: (json['lastName'] ?? '') as String,
        phone: json['phone'] as String?,
        email: json['email'] as String?,
        address: json['address'] as String?,
      );
}

/// A student profile. Mirrors the Prisma `Student` model (+ included guardian).
class Student {
  final String id;
  final String studentId; // human-facing, e.g. STU-00001
  final String firstName;
  final String lastName;
  final DateTime? dateOfBirth;
  final String gender;
  final String? address;
  final String? phone;
  final String? email;
  final String status; // ACTIVE | GRADUATED | SUSPENDED | TRANSFERRED
  final String? allergies;
  final String? conditions;
  final String? medications;
  final Guardian? guardian;

  const Student({
    required this.id,
    required this.studentId,
    required this.firstName,
    required this.lastName,
    required this.gender,
    required this.status,
    this.dateOfBirth,
    this.address,
    this.phone,
    this.email,
    this.allergies,
    this.conditions,
    this.medications,
    this.guardian,
  });

  String get fullName => '$firstName $lastName'.trim();

  factory Student.fromJson(Map<String, dynamic> json) => Student(
        id: json['id'] as String,
        studentId: (json['studentId'] ?? '') as String,
        firstName: (json['firstName'] ?? '') as String,
        lastName: (json['lastName'] ?? '') as String,
        dateOfBirth: _parseDate(json['dateOfBirth']),
        gender: (json['gender'] ?? '') as String,
        address: json['address'] as String?,
        phone: json['phone'] as String?,
        email: json['email'] as String?,
        status: (json['status'] ?? 'ACTIVE') as String,
        allergies: json['allergies'] as String?,
        conditions: json['conditions'] as String?,
        medications: json['medications'] as String?,
        guardian: json['guardian'] is Map<String, dynamic>
            ? Guardian.fromJson(json['guardian'] as Map<String, dynamic>)
            : null,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'studentId': studentId,
        'firstName': firstName,
        'lastName': lastName,
        'dateOfBirth': dateOfBirth?.toIso8601String(),
        'gender': gender,
        'address': address,
        'phone': phone,
        'email': email,
        'status': status,
        'allergies': allergies,
        'conditions': conditions,
        'medications': medications,
      };
}
