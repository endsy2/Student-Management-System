import '../models/user.model.dart';
import 'api.service.dart';
import 'local_storage.service.dart';

/// Authentication API: login, logout, current-user, and silent token refresh.
class AuthService {
  AuthService({required ApiService api, required LocalStorageService storage})
      : _api = api,
        _storage = storage;

  final ApiService _api;
  final LocalStorageService _storage;

  /// POST /auth/login — persists tokens + user and returns the user.
  Future<User> login(String email, String password) async {
    final data = await _api.post('/auth/login', body: {
      'email': email.trim(),
      'password': password,
    });
    final result = AuthResult.fromJson(data as Map<String, dynamic>);
    await _storage.saveTokens(
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    );
    await _storage.saveUser(result.user);
    return result.user;
  }

  /// GET /auth/me — current user from the cached token.
  Future<User> me() async {
    final data = await _api.get('/auth/me');
    return User.fromJson(data as Map<String, dynamic>);
  }

  /// POST /auth/logout — best-effort server revoke, then clear local state.
  Future<void> logout() async {
    try {
      await _api.post('/auth/logout');
    } catch (_) {/* token may already be expired/blacklisted */}
    await _storage.clear();
  }

  /// POST /auth/refresh — rotates the token pair. Returns the new access
  /// token, or null when the refresh token is gone/expired (forces re-login).
  /// Wired into [ApiService.onRefresh].
  Future<String?> refreshTokens() async {
    final refreshToken = await _storage.refreshToken;
    if (refreshToken == null) return null;
    try {
      final data = await _api.post('/auth/refresh', body: {
        'refreshToken': refreshToken,
      });
      final map = data as Map<String, dynamic>;
      final access = map['accessToken'] as String;
      await _storage.saveTokens(
        accessToken: access,
        refreshToken: map['refreshToken'] as String,
      );
      return access;
    } catch (_) {
      await _storage.clear();
      return null;
    }
  }

  Future<User?> cachedUser() => _storage.cachedUser;
  Future<bool> hasSession() async => (await _storage.accessToken) != null;
}
