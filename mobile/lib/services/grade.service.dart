import '../models/grade.model.dart';
import 'api.service.dart';

/// Grade API (student/parent grade viewing).
class GradeService {
  GradeService({required ApiService api}) : _api = api;
  final ApiService _api;

  /// GET /grades/student/:studentId
  Future<StudentGrades> byStudent(String studentId) async {
    final data = await _api.get('/grades/student/$studentId');
    return StudentGrades.fromJson(data as Map<String, dynamic>);
  }
}
