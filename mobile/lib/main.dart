import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';

import 'app.dart';
import 'providers/attendance.provider.dart';
import 'providers/auth.provider.dart';
import 'providers/fee.provider.dart';
import 'providers/grade.provider.dart';
import 'providers/student.provider.dart';
import 'services/api.service.dart';
import 'services/attendance.service.dart';
import 'services/auth.service.dart';
import 'services/fee.service.dart';
import 'services/grade.service.dart';
import 'services/local_storage.service.dart';
import 'services/socket.service.dart';
import 'services/student.service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Load configuration; tolerate a missing .env in case it wasn't bundled.
  try {
    await dotenv.load(fileName: '.env');
  } catch (_) {/* defaults in Environment kick in */}

  final storage = LocalStorageService();
  final api = ApiService(storage: storage);
  // Wire token refresh back into the client to break the import cycle.
  final authService = AuthService(api: api, storage: storage);
  api.onRefresh = authService.refreshTokens;

  runApp(
    MultiProvider(
      providers: [
        Provider<LocalStorageService>.value(value: storage),
        Provider<ApiService>.value(value: api),
        Provider<SocketService>(create: (_) => SocketService(storage: storage)),
        ChangeNotifierProvider(
          create: (_) => AuthProvider(authService)..bootstrap(),
        ),
        ChangeNotifierProvider(
          create: (_) => StudentProvider(StudentService(api: api)),
        ),
        ChangeNotifierProvider(
          create: (_) => AttendanceProvider(AttendanceService(api: api)),
        ),
        ChangeNotifierProvider(
          create: (_) => GradeProvider(GradeService(api: api)),
        ),
        ChangeNotifierProvider(
          create: (_) => FeeProvider(FeeService(api: api)),
        ),
      ],
      child: const SmsApp(),
    ),
  );
}
