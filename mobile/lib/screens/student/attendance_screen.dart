import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../config/themes.dart';
import '../../models/attendance.model.dart';
import '../../providers/attendance.provider.dart';
import '../../providers/student.provider.dart';
import '../../routes/app_routes.dart';
import '../../utils/formats.dart';
import '../../widgets/common/loading_widget.dart';
import '../../widgets/attendance/attendance_card.dart';

class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({super.key});

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    final id = context.read<StudentProvider>().studentId;
    if (id != null) await context.read<AttendanceProvider>().load(id);
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AttendanceProvider>();
    final analytics = provider.analytics;
    final recent = provider.records.take(10).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Attendance'),
        actions: [
          IconButton(
            tooltip: 'Full history',
            icon: const Icon(Icons.history),
            onPressed: () =>
                Navigator.pushNamed(context, AppRoutes.attendanceHistory),
          ),
        ],
      ),
      body: provider.isLoading && analytics == null
          ? const LoadingWidget()
          : provider.error != null && analytics == null
              ? StatusView(
                  icon: Icons.error_outline,
                  title: 'Could not load attendance',
                  subtitle: provider.error,
                  onRetry: _load,
                )
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView(
                    padding: const EdgeInsets.all(16),
                    children: [
                      if (analytics != null) _AnalyticsCard(analytics: analytics),
                      const SizedBox(height: 20),
                      Text('Recent records',
                          style: Theme.of(context)
                              .textTheme
                              .titleMedium
                              ?.copyWith(fontWeight: FontWeight.w600)),
                      const SizedBox(height: 8),
                      if (recent.isEmpty)
                        const Padding(
                          padding: EdgeInsets.symmetric(vertical: 32),
                          child: StatusView(
                            icon: Icons.event_busy,
                            title: 'No attendance records',
                          ),
                        )
                      else
                        for (final r in recent) AttendanceCard(record: r),
                    ],
                  ),
                ),
    );
  }
}

class _AnalyticsCard extends StatelessWidget {
  const _AnalyticsCard({required this.analytics});
  final AttendanceAnalytics analytics;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Text('Attendance rate',
                style: theme.textTheme.bodyMedium
                    ?.copyWith(color: theme.colorScheme.outline)),
            const SizedBox(height: 6),
            Text(Formats.percent(analytics.attendanceRate),
                style: theme.textTheme.displaySmall?.copyWith(
                    color: AppTheme.success, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _Stat(label: 'Present', value: analytics.present, color: AppTheme.success),
                _Stat(label: 'Late', value: analytics.late, color: AppTheme.warning),
                _Stat(label: 'Excused', value: analytics.excused, color: AppTheme.primary),
                _Stat(label: 'Absent', value: analytics.absent, color: AppTheme.danger),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  const _Stat({required this.label, required this.value, required this.color});
  final String label;
  final int value;
  final Color color;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Column(
      children: [
        Text('$value',
            style: theme.textTheme.titleLarge
                ?.copyWith(color: color, fontWeight: FontWeight.bold)),
        Text(label,
            style: theme.textTheme.bodySmall
                ?.copyWith(color: theme.colorScheme.outline)),
      ],
    );
  }
}
