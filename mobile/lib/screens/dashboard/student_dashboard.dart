import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../config/themes.dart';
import '../../models/grade.model.dart';
import '../../providers/attendance.provider.dart';
import '../../providers/auth.provider.dart';
import '../../providers/fee.provider.dart';
import '../../providers/grade.provider.dart';
import '../../providers/student.provider.dart';
import '../../routes/app_routes.dart';
import '../../utils/formats.dart';
import '../../widgets/common/fade_slide_in.dart';
import '../../widgets/common/loading_widget.dart';
import '../../widgets/common/progress_ring.dart';
import '../../widgets/dashboard/achievement_chip.dart';
import '../../widgets/dashboard/feature_tile.dart';
import '../../widgets/dashboard/hero_header.dart';
import '../../widgets/student/grade_card.dart';

/// The Home tab: a colourful, gamified overview of the student's day.
///
/// [onSelectTab] jumps to a sibling tab in the [MainShell]; [onRefresh]
/// re-runs the shell-level data bootstrap for pull-to-refresh.
class StudentDashboard extends StatelessWidget {
  const StudentDashboard({
    super.key,
    required this.onSelectTab,
    required this.onRefresh,
  });

  final void Function(int index) onSelectTab;
  final Future<void> Function() onRefresh;

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;
    final studentProvider = context.watch<StudentProvider>();

    return Scaffold(
      body: RefreshIndicator(
        onRefresh: onRefresh,
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            HeroHeader(
              name: user?.fullName ?? 'Student',
              initials: user?.initials ?? '?',
              onSettings: () =>
                  Navigator.pushNamed(context, AppRoutes.settings),
              onQr: () => Navigator.pushNamed(context, AppRoutes.qrScanner),
            ),
            const SizedBox(height: 20),
            if (studentProvider.isLoading)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 60),
                child: LoadingWidget(message: 'Setting things up…'),
              )
            else if (studentProvider.student == null)
              Padding(
                padding: const EdgeInsets.all(8),
                child: StatusView(
                  icon: Icons.person_off_outlined,
                  title: 'No linked student profile',
                  subtitle: studentProvider.error ??
                      'Ask your school admin to link your account.',
                  onRetry: onRefresh,
                ),
              )
            else
              _DashboardBody(onSelectTab: onSelectTab),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}

class _DashboardBody extends StatelessWidget {
  const _DashboardBody({required this.onSelectTab});

  final void Function(int index) onSelectTab;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const FadeSlideIn(child: _RingsCard()),
          const SizedBox(height: 8),
          FadeSlideIn(
            delay: const Duration(milliseconds: 80),
            child: const _AchievementsRow(),
          ),
          const SizedBox(height: 20),
          FadeSlideIn(
            delay: const Duration(milliseconds: 140),
            child: _sectionTitle(context, 'Explore'),
          ),
          const SizedBox(height: 12),
          FadeSlideIn(
            delay: const Duration(milliseconds: 180),
            child: _QuickTiles(onSelectTab: onSelectTab),
          ),
          const SizedBox(height: 24),
          FadeSlideIn(
            delay: const Duration(milliseconds: 240),
            child: _RecentGrades(onSeeAll: () => onSelectTab(1)),
          ),
        ],
      ),
    );
  }

  Widget _sectionTitle(BuildContext context, String text) {
    return Text(
      text,
      style: Theme.of(context)
          .textTheme
          .titleLarge
          ?.copyWith(fontWeight: FontWeight.w800),
    );
  }
}

/// The two animated rings: attendance rate + overall grade.
class _RingsCard extends StatelessWidget {
  const _RingsCard();

  @override
  Widget build(BuildContext context) {
    final attendance = context.watch<AttendanceProvider>().analytics;
    final grades = context.watch<GradeProvider>().grades;

    return Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 22),
        child: Row(
          children: [
            Expanded(
              child: ProgressRing(
                percent: attendance?.attendanceRate ?? 0,
                gradient: AppTheme.attendanceGradient,
                icon: Icons.event_available_rounded,
                centerText: Formats.percent(attendance?.attendanceRate ?? 0),
                caption: 'Attendance',
              ),
            ),
            Container(width: 1, height: 96, color: const Color(0xFFEDEFF5)),
            Expanded(
              child: ProgressRing(
                percent: grades?.overallPercentage ?? 0,
                gradient: AppTheme.gradeGradient,
                icon: Icons.workspace_premium_rounded,
                centerText: grades?.overallGrade ?? '—',
                caption: 'Overall grade',
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Achievement badges derived from current attendance + grade performance.
class _AchievementsRow extends StatelessWidget {
  const _AchievementsRow();

  List<Achievement> _earned(double rate, double overall, int assessments) {
    final out = <Achievement>[];
    if (rate >= 95) {
      out.add(const Achievement(
          emoji: '🔥', label: 'Great Attendance', color: AppTheme.success));
    }
    if (overall >= 90) {
      out.add(const Achievement(
          emoji: '🏆', label: 'Honor Roll', color: AppTheme.warning));
    } else if (overall >= 75) {
      out.add(const Achievement(
          emoji: '⭐', label: 'On Track', color: AppTheme.primary));
    }
    if (assessments >= 5) {
      out.add(const Achievement(
          emoji: '📚', label: 'Active Learner', color: AppTheme.info));
    }
    if (out.isEmpty) {
      out.add(const Achievement(
          emoji: '🚀', label: 'Getting Started', color: AppTheme.accent));
    }
    return out;
  }

  @override
  Widget build(BuildContext context) {
    final rate =
        context.watch<AttendanceProvider>().analytics?.attendanceRate ?? 0;
    final grades = context.watch<GradeProvider>().grades;
    final badges = _earned(
      rate,
      grades?.overallPercentage ?? 0,
      grades?.grades.length ?? 0,
    );

    return SizedBox(
      height: 44,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: badges.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (_, i) => AchievementChip(achievement: badges[i]),
      ),
    );
  }
}

class _QuickTiles extends StatelessWidget {
  const _QuickTiles({required this.onSelectTab});

  final void Function(int index) onSelectTab;

  @override
  Widget build(BuildContext context) {
    final grades = context.watch<GradeProvider>().grades;
    final ledger = context.watch<FeeProvider>().ledger;
    final attendance = context.watch<AttendanceProvider>().analytics;

    final tiles = [
      FeatureTile(
        label: 'My Grades',
        value: grades?.overallGrade ?? '—',
        icon: Icons.auto_graph_rounded,
        gradient: AppTheme.gradeGradient,
        onTap: () => onSelectTab(1),
      ),
      FeatureTile(
        label: 'Attendance',
        value: Formats.percent(attendance?.attendanceRate ?? 0),
        icon: Icons.event_available_rounded,
        gradient: AppTheme.attendanceGradient,
        onTap: () => onSelectTab(2),
      ),
      FeatureTile(
        label: 'Fees Due',
        value: Formats.money(ledger?.totalBalance ?? 0),
        icon: Icons.account_balance_wallet_rounded,
        gradient: AppTheme.feeGradient,
        onTap: () => onSelectTab(3),
      ),
      FeatureTile(
        label: 'My QR Code',
        value: 'Scan',
        icon: Icons.qr_code_2_rounded,
        gradient: AppTheme.qrGradient,
        onTap: () => Navigator.pushNamed(context, AppRoutes.qrScanner),
      ),
    ];

    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 14,
      crossAxisSpacing: 14,
      childAspectRatio: 1.45,
      children: tiles,
    );
  }
}

class _RecentGrades extends StatelessWidget {
  const _RecentGrades({required this.onSeeAll});

  final VoidCallback onSeeAll;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final grades = context.watch<GradeProvider>().grades?.grades ?? <Grade>[];
    if (grades.isEmpty) return const SizedBox.shrink();

    final recent = grades.take(3).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Recent grades',
                style: theme.textTheme.titleLarge
                    ?.copyWith(fontWeight: FontWeight.w800)),
            TextButton(onPressed: onSeeAll, child: const Text('See all')),
          ],
        ),
        const SizedBox(height: 4),
        for (final g in recent) GradeCard(grade: g),
      ],
    );
  }
}
