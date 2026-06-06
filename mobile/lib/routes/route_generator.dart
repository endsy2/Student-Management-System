import 'package:flutter/material.dart';

import '../screens/attendance/attendance_history_screen.dart';
import '../screens/attendance/qrscanner_screen.dart';
import '../screens/auth/login_screen.dart';
import '../screens/dashboard/main_shell.dart';
import '../screens/settings/settings_screen.dart';
import '../screens/student/attendance_screen.dart';
import '../screens/student/fees_screen.dart';
import '../screens/student/grades_screen.dart';
import '../screens/student/profile_screen.dart';
import 'app_routes.dart';

/// Maps route names to screens. Registered on [MaterialApp.onGenerateRoute].
class RouteGenerator {
  const RouteGenerator._();

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    Widget page;
    switch (settings.name) {
      case AppRoutes.login:
        page = const LoginScreen();
        break;
      case AppRoutes.dashboard:
      case AppRoutes.root:
        page = const MainShell();
        break;
      case AppRoutes.profile:
        page = const ProfileScreen();
        break;
      case AppRoutes.grades:
        page = const GradesScreen();
        break;
      case AppRoutes.attendance:
        page = const AttendanceScreen();
        break;
      case AppRoutes.attendanceHistory:
        page = const AttendanceHistoryScreen();
        break;
      case AppRoutes.qrScanner:
        page = const QrScannerScreen();
        break;
      case AppRoutes.fees:
        page = const FeesScreen();
        break;
      case AppRoutes.settings:
        page = const SettingsScreen();
        break;
      default:
        page = Scaffold(
          appBar: AppBar(title: const Text('Not found')),
          body: Center(child: Text('No route for ${settings.name}')),
        );
    }
    return MaterialPageRoute(builder: (_) => page, settings: settings);
  }
}
