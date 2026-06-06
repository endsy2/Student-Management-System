/// A course. Often arrives nested inside a grade as `{ code, name }`.
class Course {
  final String? id;
  final String code;
  final String name;
  final String? description;
  final int? creditHours;

  const Course({
    this.id,
    required this.code,
    required this.name,
    this.description,
    this.creditHours,
  });

  factory Course.fromJson(Map<String, dynamic> json) => Course(
        id: json['id'] as String?,
        code: (json['code'] ?? '') as String,
        name: (json['name'] ?? '') as String,
        description: json['description'] as String?,
        creditHours: json['creditHours'] as int?,
      );
}
