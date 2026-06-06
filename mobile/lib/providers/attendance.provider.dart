import 'package:flutter/foundation.dart';

import '../models/attendance.model.dart';
import '../services/attendance.service.dart';

/// Loads attendance history + analytics for the active student.
class AttendanceProvider extends ChangeNotifier {
  AttendanceProvider(this._service);

  final AttendanceService _service;

  List<AttendanceRecord> _records = [];
  AttendanceAnalytics? _analytics;
  bool _isLoading = false;
  String? _error;

  List<AttendanceRecord> get records => _records;
  AttendanceAnalytics? get analytics => _analytics;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> load(String studentId, {DateTime? from, DateTime? to}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      final results = await Future.wait([
        _service.history(studentId: studentId, from: from, to: to),
        _service.analytics(studentId),
      ]);
      _records = results[0] as List<AttendanceRecord>;
      _analytics = results[1] as AttendanceAnalytics;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
