import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../config/constants.dart';
import '../models/user.model.dart';

/// Persists tokens and the cached user in the platform secure store
/// (Keystore / Keychain).
class LocalStorageService {
  LocalStorageService({FlutterSecureStorage? storage})
      : _storage = storage ?? const FlutterSecureStorage();

  final FlutterSecureStorage _storage;

  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    await _storage.write(key: AppConstants.accessTokenKey, value: accessToken);
    await _storage.write(
        key: AppConstants.refreshTokenKey, value: refreshToken);
  }

  Future<void> saveUser(User user) =>
      _storage.write(key: AppConstants.userKey, value: jsonEncode(user.toJson()));

  Future<String?> get accessToken =>
      _storage.read(key: AppConstants.accessTokenKey);

  Future<String?> get refreshToken =>
      _storage.read(key: AppConstants.refreshTokenKey);

  Future<User?> get cachedUser async {
    final raw = await _storage.read(key: AppConstants.userKey);
    if (raw == null) return null;
    try {
      return User.fromJson(jsonDecode(raw) as Map<String, dynamic>);
    } catch (_) {
      return null;
    }
  }

  Future<void> clear() async {
    await _storage.delete(key: AppConstants.accessTokenKey);
    await _storage.delete(key: AppConstants.refreshTokenKey);
    await _storage.delete(key: AppConstants.userKey);
  }
}
