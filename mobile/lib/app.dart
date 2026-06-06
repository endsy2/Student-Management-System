import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'config/themes.dart';
import 'providers/auth.provider.dart';
import 'routes/route_generator.dart';
import 'screens/auth/login_screen.dart';
import 'screens/dashboard/main_shell.dart';
import 'widgets/common/loading_widget.dart';

class SmsApp extends StatelessWidget {
  const SmsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'School Management',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      onGenerateRoute: RouteGenerator.onGenerateRoute,
      home: const _AuthGate(),
    );
  }
}

/// Decides the first screen based on auth state and reacts to login/logout.
class _AuthGate extends StatelessWidget {
  const _AuthGate();

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, auth, _) {
        switch (auth.status) {
          case AuthStatus.unknown:
            return const Scaffold(body: LoadingWidget(message: 'Starting…'));
          case AuthStatus.authenticated:
            return const MainShell();
          case AuthStatus.unauthenticated:
            return const LoginScreen();
        }
      },
    );
  }
}
