import 'package:flutter/foundation.dart';

import '../models/api_response.dart';
import '../models/user.model.dart';
import '../services/auth.service.dart';

enum AuthStatus { unknown, authenticated, unauthenticated }

/// Owns authentication state for the whole app.
class AuthProvider extends ChangeNotifier {
  AuthProvider(this._service);

  final AuthService _service;

  AuthStatus _status = AuthStatus.unknown;
  User? _user;
  bool _isBusy = false;
  String? _errorMessage;

  AuthStatus get status => _status;
  User? get user => _user;
  bool get isBusy => _isBusy;
  String? get errorMessage => _errorMessage;

  /// Restores a prior session from secure storage on app launch.
  Future<void> bootstrap() async {
    final hasSession = await _service.hasSession();
    if (!hasSession) {
      _setStatus(AuthStatus.unauthenticated);
      return;
    }
    _user = await _service.cachedUser();
    _setStatus(AuthStatus.authenticated);

    // Refresh the profile in the background; ignore transient failures.
    try {
      _user = await _service.me();
      notifyListeners();
    } catch (_) {/* keep cached user */}
  }

  Future<bool> login(String email, String password) async {
    _isBusy = true;
    _errorMessage = null;
    notifyListeners();
    try {
      _user = await _service.login(email, password);
      _isBusy = false;
      _setStatus(AuthStatus.authenticated);
      return true;
    } on ApiException catch (e) {
      _errorMessage = e.message;
      _isBusy = false;
      notifyListeners();
      return false;
    } catch (e) {
      _errorMessage = 'Something went wrong. Please try again.';
      _isBusy = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    await _service.logout();
    _user = null;
    _setStatus(AuthStatus.unauthenticated);
  }

  void _setStatus(AuthStatus status) {
    _status = status;
    notifyListeners();
  }
}
