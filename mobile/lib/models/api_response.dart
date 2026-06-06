/// Mirrors the backend success/error envelope:
/// `{ success, data, message, timestamp }` or `{ success, error, code }`.
class ApiResponse<T> {
  final bool success;
  final T? data;
  final String? message;

  const ApiResponse({required this.success, this.data, this.message});
}

/// Pagination block returned by list endpoints (e.g. `GET /students`).
class Pagination {
  final int page;
  final int limit;
  final int total;
  final int totalPages;

  const Pagination({
    required this.page,
    required this.limit,
    required this.total,
    required this.totalPages,
  });

  factory Pagination.fromJson(Map<String, dynamic> json) => Pagination(
        page: (json['page'] ?? 1) as int,
        limit: (json['limit'] ?? 20) as int,
        total: (json['total'] ?? 0) as int,
        totalPages: (json['totalPages'] ?? 1) as int,
      );
}

/// A paginated payload of `items` + `pagination`.
class Paginated<T> {
  final List<T> items;
  final Pagination pagination;

  const Paginated({required this.items, required this.pagination});
}

/// Thrown by [ApiService] for non-2xx responses or transport failures.
/// Carries the backend `code` so the UI can branch (e.g. on `EXPIRED_REFRESH`).
class ApiException implements Exception {
  final String message;
  final String code;
  final int? statusCode;

  const ApiException(this.message, {this.code = 'ERROR', this.statusCode});

  bool get isUnauthorized => statusCode == 401;

  @override
  String toString() => message;
}
