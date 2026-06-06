import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../config/themes.dart';
import '../../models/grade.model.dart';
import '../../providers/grade.provider.dart';
import '../../providers/student.provider.dart';
import '../../utils/formats.dart';
import '../../widgets/common/loading_widget.dart';
import '../../widgets/student/grade_card.dart';

class GradesScreen extends StatefulWidget {
  const GradesScreen({super.key});

  @override
  State<GradesScreen> createState() => _GradesScreenState();
}

class _GradesScreenState extends State<GradesScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    final id = context.read<StudentProvider>().studentId;
    if (id != null) await context.read<GradeProvider>().load(id);
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<GradeProvider>();

    return Scaffold(
      appBar: AppBar(title: const Text('My Grades')),
      body: Builder(builder: (context) {
        if (provider.isLoading && provider.grades == null) {
          return const LoadingWidget();
        }
        if (provider.error != null && provider.grades == null) {
          return StatusView(
            icon: Icons.error_outline,
            title: 'Could not load grades',
            subtitle: provider.error,
            onRetry: _load,
          );
        }
        final data = provider.grades;
        if (data == null || data.grades.isEmpty) {
          return const StatusView(
            icon: Icons.grade_outlined,
            title: 'No grades yet',
            subtitle: 'Grades will appear here once your teachers post them.',
          );
        }
        return RefreshIndicator(
          onRefresh: _load,
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              _OverallCard(data: data),
              const SizedBox(height: 16),
              _GradeChart(grades: data.grades),
              const SizedBox(height: 16),
              Text('All assessments',
                  style: Theme.of(context)
                      .textTheme
                      .titleMedium
                      ?.copyWith(fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              for (final g in data.grades) GradeCard(grade: g),
            ],
          ),
        );
      }),
    );
  }
}

class _OverallCard extends StatelessWidget {
  const _OverallCard({required this.data});
  final StudentGrades data;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      color: AppTheme.primary,
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Overall average',
                    style: theme.textTheme.bodyMedium
                        ?.copyWith(color: Colors.white70)),
                const SizedBox(height: 6),
                Text(Formats.percent(data.overallPercentage),
                    style: theme.textTheme.headlineMedium?.copyWith(
                        color: Colors.white, fontWeight: FontWeight.bold)),
              ],
            ),
            const Spacer(),
            CircleAvatar(
              radius: 32,
              backgroundColor: Colors.white,
              child: Text(data.overallGrade,
                  style: theme.textTheme.headlineSmall?.copyWith(
                      color: AppTheme.primary, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }
}

class _GradeChart extends StatelessWidget {
  const _GradeChart({required this.grades});
  final List<Grade> grades;

  @override
  Widget build(BuildContext context) {
    // Cap to the 8 most recent assessments to keep the chart legible.
    final items = grades.take(8).toList().reversed.toList();

    return Card(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(12, 20, 16, 12),
        child: SizedBox(
          height: 200,
          child: BarChart(
            BarChartData(
              maxY: 100,
              alignment: BarChartAlignment.spaceAround,
              borderData: FlBorderData(show: false),
              gridData: const FlGridData(show: true, drawVerticalLine: false),
              titlesData: FlTitlesData(
                topTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false)),
                rightTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false)),
                leftTitles: const AxisTitles(
                  sideTitles: SideTitles(showTitles: true, reservedSize: 32),
                ),
                bottomTitles: AxisTitles(
                  sideTitles: SideTitles(
                    showTitles: true,
                    getTitlesWidget: (value, meta) {
                      final i = value.toInt();
                      if (i < 0 || i >= items.length) {
                        return const SizedBox.shrink();
                      }
                      final code = items[i].course?.code ?? '';
                      return Padding(
                        padding: const EdgeInsets.only(top: 6),
                        child: Text(code,
                            style: const TextStyle(fontSize: 10)),
                      );
                    },
                  ),
                ),
              ),
              barGroups: [
                for (var i = 0; i < items.length; i++)
                  BarChartGroupData(x: i, barRods: [
                    BarChartRodData(
                      toY: items[i].percentage,
                      color: AppTheme.primary,
                      width: 16,
                      borderRadius: const BorderRadius.vertical(
                          top: Radius.circular(4)),
                    ),
                  ]),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
