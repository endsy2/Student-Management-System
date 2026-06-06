import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Reads runtime configuration from the bundled `.env` asset.
///
/// Falls back to Android-emulator-friendly defaults so the app still boots if
/// `.env` is missing during development.
class Environment {
  const Environment._();

  static String get apiBaseUrl =>
      dotenv.maybeGet('API_BASE_URL') ?? 'http://10.0.2.2:4000/api/v1';

  static String get socketUrl =>
      dotenv.maybeGet('SOCKET_URL') ?? 'http://10.0.2.2:4000';
}
