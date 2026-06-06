import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;

import '../config/constants.dart';
import '../config/environment.dart';
import '../models/api_response.dart';
import 'local_storage.service.dart';

/// Signature for the token-refresh callback wired in by [AuthService].
/// Returns the new access token, or `null` if refresh failed.
typedef RefreshCallback = Future<String?> Function();

/// Thin REST client over `package:http`.
///
/// Responsibilities:
/// - prefix requests with the configured base URL,
/// - attach the bearer token,
/// - unwrap the `{ success, data, ... }` envelope,
/// - on a 401, attempt a single token refresh and retry.
class ApiService {
  ApiService({required LocalStorageService storage, http.Client? client})
      : _storage = storage,
        _client = client ?? http.Client();

  final LocalStorageService _storage;
  final http.Client _client;

  /// Set by [AuthService] after construction to avoid a circular dependency.
  RefreshCallback? onRefresh;

  Uri _uri(String path, [Map<String, dynamic>? query]) {
    final base = Environment.apiBaseUrl;
    final normalized = path.startsWith('/') ? path : '/$path';

    // Drop null/empty values so they don't appear as `?key=` in the URL.
    final stringQuery = <String, String>{};
    if (query != null) {
      query.forEach((key, value) {
        final str = value?.toString() ?? '';
        if (str.isNotEmpty) stringQuery[key] = str;
      });
    }

    return Uri.parse('$base$normalized').replace(
      queryParameters: stringQuery.isEmpty ? null : stringQuery,
    );
  }

  Future<Map<String, String>> _headers() async {
    final token = await _storage.accessToken;
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<dynamic> get(String path, {Map<String, dynamic>? query}) =>
      _send(() async => _client
          .get(_uri(path, query), headers: await _headers())
          .timeout(AppConstants.requestTimeout));

  Future<dynamic> post(String path, {Object? body}) =>
      _send(() async => _client
          .post(_uri(path),
              headers: await _headers(), body: jsonEncode(body ?? {}))
          .timeout(AppConstants.requestTimeout));

  Future<dynamic> patch(String path, {Object? body}) =>
      _send(() async => _client
          .patch(_uri(path),
              headers: await _headers(), body: jsonEncode(body ?? {}))
          .timeout(AppConstants.requestTimeout));

  Future<dynamic> delete(String path) =>
      _send(() async => _client
          .delete(_uri(path), headers: await _headers())
          .timeout(AppConstants.requestTimeout));

  /// Runs [request], refreshing the token and retrying once on a 401.
  Future<dynamic> _send(
    Future<http.Response> Function() request, {
    bool isRetry = false,
  }) async {
    http.Response response;
    try {
      response = await request();
    } on TimeoutException {
      throw const ApiException('Request timed out', code: 'TIMEOUT');
    } catch (e) {
      throw ApiException('Network error: $e', code: 'NETWORK');
    }

    if (response.statusCode == 401 && !isRetry && onRefresh != null) {
      final newToken = await onRefresh!();
      if (newToken != null) {
        return _send(request, isRetry: true);
      }
    }

    return _decode(response);
  }

  dynamic _decode(http.Response response) {
    final isJson = (response.headers['content-type'] ?? '').contains('json');
    final dynamic body = response.body.isNotEmpty && isJson
        ? jsonDecode(response.body)
        : null;

    final ok = response.statusCode >= 200 && response.statusCode < 300;
    if (ok) {
      if (body is Map<String, dynamic>) return body['data'];
      return body;
    }

    final map = body is Map<String, dynamic> ? body : const {};
    throw ApiException(
      (map['error'] ?? 'Request failed (${response.statusCode})').toString(),
      code: (map['code'] ?? 'ERROR').toString(),
      statusCode: response.statusCode,
    );
  }

  void dispose() => _client.close();
}
