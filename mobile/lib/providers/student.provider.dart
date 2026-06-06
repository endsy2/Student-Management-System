import 'package:flutter/foundation.dart';

import '../models/student.model.dart';
import '../models/user.model.dart';
import '../services/student.service.dart';

/// Holds the "active student" context the rest of the screens hang off of.
class StudentProvider extends ChangeNotifier {
  StudentProvider(this._service);

  final StudentService _service;

  Student? _student;
  bool _isLoading = false;
  String? _error;

  Student? get student => _student;
  String? get studentId => _student?.id;
  bool get isLoading => _isLoading;
  String? get error => _error;

  /// Resolves and caches the profile for the signed-in user.
  Future<void> loadForUser(User user) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      _student = await _service.resolveForUser(email: user.email);
      if (_student == null) {
        _error = 'No student profile is linked to this account.';
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clear() {
    _student = null;
    _error = null;
    notifyListeners();
  }
}
