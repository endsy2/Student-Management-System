import '../models/api_response.dart';
import '../models/student.model.dart';
import 'api.service.dart';

/// Student profile API.
class StudentService {
  StudentService({required ApiService api}) : _api = api;
  final ApiService _api;

  /// GET /students — paginated list with optional search/status/class filters.
  Future<Paginated<Student>> list({
    int page = 1,
    int limit = 20,
    String? search,
    String? status,
    String? classId,
  }) async {
    final data = await _api.get('/students', query: {
      'page': page,
      'limit': limit,
      'search': search,
      'status': status,
      'classId': classId,
    }) as Map<String, dynamic>;

    return Paginated<Student>(
      items: (data['items'] as List<dynamic>? ?? [])
          .map((e) => Student.fromJson(e as Map<String, dynamic>))
          .toList(),
      pagination:
          Pagination.fromJson(data['pagination'] as Map<String, dynamic>),
    );
  }

  /// GET /students/:id
  Future<Student> getById(String id) async {
    final data = await _api.get('/students/$id');
    return Student.fromJson(data as Map<String, dynamic>);
  }

  /// Resolves the student profile for a logged-in STUDENT user.
  ///
  /// The backend has no "my profile" endpoint and the JWT carries only the
  /// user id/email, so we match the profile by email via the searchable list.
  /// Returns null when no linked profile exists (e.g. a fresh PARENT account).
  Future<Student?> resolveForUser({required String email}) async {
    if (email.isEmpty) return null;
    final result = await list(search: email, limit: 1);
    if (result.items.isEmpty) return null;
    return result.items.first;
  }
}
