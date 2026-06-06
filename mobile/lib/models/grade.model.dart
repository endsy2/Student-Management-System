import 'course.model.dart';

double _toDouble(dynamic value) {
  if (value is num) return value.toDouble();
  return double.tryParse(value?.toString() ?? '') ?? 0;
}

/// A single grade entry. Mirrors the Prisma `Grade` model with the included
/// `course: { code, name }` projection from `GET /grades/student/:id`.
class Grade {
  final String id;
  final String studentId;
  final String courseId;
  final String assessmentType; // ASSIGNMENT | QUIZ | PROJECT | EXAM | ...
  final double score;
  final double maxScore;
  final double weight;
  final String? letterGrade;
  final DateTime? submittedDate;
  final Course? course;

  const Grade({
    required this.id,
    required this.studentId,
    required this.courseId,
    required this.assessmentType,
    required this.score,
    required this.maxScore,
    required this.weight,
    this.letterGrade,
    this.submittedDate,
    this.course,
  });

  double get percentage => maxScore == 0 ? 0 : score / maxScore * 100;

  factory Grade.fromJson(Map<String, dynamic> json) => Grade(
        id: (json['id'] ?? '') as String,
        studentId: (json['studentId'] ?? '') as String,
        courseId: (json['courseId'] ?? '') as String,
        assessmentType: (json['assessmentType'] ?? '') as String,
        score: _toDouble(json['score']),
        maxScore: _toDouble(json['maxScore']),
        weight: _toDouble(json['weight']),
        letterGrade: json['letterGrade'] as String?,
        submittedDate:
            DateTime.tryParse(json['submittedDate']?.toString() ?? ''),
        course: json['course'] is Map<String, dynamic>
            ? Course.fromJson(json['course'] as Map<String, dynamic>)
            : null,
      );
}

/// Full payload of `GET /grades/student/:studentId`.
class StudentGrades {
  final List<Grade> grades;
  final double overallPercentage;
  final String overallGrade;

  const StudentGrades({
    required this.grades,
    required this.overallPercentage,
    required this.overallGrade,
  });

  factory StudentGrades.fromJson(Map<String, dynamic> json) => StudentGrades(
        grades: (json['grades'] as List<dynamic>? ?? [])
            .map((e) => Grade.fromJson(e as Map<String, dynamic>))
            .toList(),
        overallPercentage: _toDouble(json['overallPercentage']),
        overallGrade: (json['overallGrade'] ?? '—') as String,
      );
}
