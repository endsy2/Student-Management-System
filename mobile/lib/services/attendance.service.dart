import '../models/attendance.model.dart';
import '../utils/formats.dart';
import 'api.service.dart';

/// Attendance API (read-focused for the student/parent app).
class AttendanceService {
  AttendanceService({required ApiService api}) : _api = api;
  final ApiService _api;

  /// GET /attendance/history — records for a student within a date range.
  Future<List<AttendanceRecord>> history({
    required String studentId,
    DateTime? from,
    DateTime? to,
  }) async {
    final data = await _api.get('/attendance/history', query: {
      'studentId': studentId,
      'from': from == null ? null : Formats.isoDate(from),
      'to': to == null ? null : Formats.isoDate(to),
    });

    final list = data is Map<String, dynamic>
        ? (data['items'] ?? data['records'] ?? []) as List<dynamic>
        : (data as List<dynamic>? ?? []);
    return list
        .map((e) => AttendanceRecord.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// GET /attendance/analytics — per-student attendance rate summary.
  Future<AttendanceAnalytics> analytics(String studentId) async {
    final data = await _api.get('/attendance/analytics', query: {
      'studentId': studentId,
    });
    return AttendanceAnalytics.fromJson(data as Map<String, dynamic>);
  }
}
