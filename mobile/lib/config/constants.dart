/// App-wide constants. Values mirror the backend enums and storage contracts.
class AppConstants {
  const AppConstants._();

  // Secure-storage keys
  static const String accessTokenKey = 'access_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userKey = 'auth_user';

  // Request handling
  static const Duration requestTimeout = Duration(seconds: 20);

  // Socket.io events (see backend/src/config/socket.ts)
  static const String socketAttendanceJoin = 'attendance:join';
  static const String socketAttendanceUpdate = 'attendance:update';
}

/// Roles as defined by the backend `Role` enum.
class Roles {
  const Roles._();
  static const String admin = 'ADMIN';
  static const String teacher = 'TEACHER';
  static const String student = 'STUDENT';
  static const String parent = 'PARENT';
}
