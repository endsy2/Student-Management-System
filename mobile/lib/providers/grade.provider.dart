import 'package:flutter/foundation.dart';

import '../models/grade.model.dart';
import '../services/grade.service.dart';

/// Loads grades + overall average for the active student.
class GradeProvider extends ChangeNotifier {
  GradeProvider(this._service);

  final GradeService _service;

  StudentGrades? _grades;
  bool _isLoading = false;
  String? _error;

  StudentGrades? get grades => _grades;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> load(String studentId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      _grades = await _service.byStudent(studentId);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
