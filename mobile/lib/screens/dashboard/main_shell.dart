import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../config/themes.dart';
import '../../providers/attendance.provider.dart';
import '../../providers/auth.provider.dart';
import '../../providers/fee.provider.dart';
import '../../providers/grade.provider.dart';
import '../../providers/student.provider.dart';
import '../student/attendance_screen.dart';
import '../student/fees_screen.dart';
import '../student/grades_screen.dart';
import '../student/profile_screen.dart';
import 'student_dashboard.dart';

/// The signed-in container: an [IndexedStack] of the five primary tabs behind a
/// Material 3 [NavigationBar]. Owns the one-time data bootstrap so every tab
/// shares the same loaded state.
class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _index = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => bootstrap());
  }

  /// Resolve the active student, then load attendance/grades/fees in parallel.
  Future<void> bootstrap() async {
    final user = context.read<AuthProvider>().user;
    if (user == null) return;
    await context.read<StudentProvider>().loadForUser(user);
    final id = context.read<StudentProvider>().studentId;
    if (id == null) return;
    await Future.wait([
      context.read<AttendanceProvider>().load(id),
      context.read<GradeProvider>().load(id),
      context.read<FeeProvider>().load(id),
    ]);
  }

  void _goToTab(int index) => setState(() => _index = index);

  @override
  Widget build(BuildContext context) {
    final pages = [
      StudentDashboard(onSelectTab: _goToTab, onRefresh: bootstrap),
      const GradesScreen(),
      const AttendanceScreen(),
      const FeesScreen(),
      const ProfileScreen(),
    ];

    return Scaffold(
      body: IndexedStack(index: _index, children: pages),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: _goToTab,
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home_rounded, color: AppTheme.primary),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.auto_graph_outlined),
            selectedIcon: Icon(Icons.auto_graph_rounded, color: AppTheme.primary),
            label: 'Grades',
          ),
          NavigationDestination(
            icon: Icon(Icons.event_available_outlined),
            selectedIcon:
                Icon(Icons.event_available_rounded, color: AppTheme.primary),
            label: 'Attendance',
          ),
          NavigationDestination(
            icon: Icon(Icons.account_balance_wallet_outlined),
            selectedIcon: Icon(Icons.account_balance_wallet_rounded,
                color: AppTheme.primary),
            label: 'Fees',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline_rounded),
            selectedIcon: Icon(Icons.person_rounded, color: AppTheme.primary),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
