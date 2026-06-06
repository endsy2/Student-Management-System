import 'package:flutter/material.dart';

import '../../config/themes.dart';
import '../../models/grade.model.dart';
import '../../utils/formats.dart';

/// One grade row: course, assessment type, score and a letter-grade chip.
class GradeCard extends StatelessWidget {
  const GradeCard({super.key, required this.grade});

  final Grade grade;

  Color _colorFor(double pct) {
    if (pct >= 90) return AppTheme.success;
    if (pct >= 60) return AppTheme.primary;
    return AppTheme.danger;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final pct = grade.percentage;
    final color = _colorFor(pct);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(grade.course?.name ?? grade.courseId,
                      style: theme.textTheme.titleMedium
                          ?.copyWith(fontWeight: FontWeight.w600)),
                  const SizedBox(height: 4),
                  Text(
                    '${Formats.titleCase(grade.assessmentType)} • '
                    '${grade.score.toStringAsFixed(0)}/${grade.maxScore.toStringAsFixed(0)} • '
                    '${Formats.date(grade.submittedDate)}',
                    style: theme.textTheme.bodySmall
                        ?.copyWith(color: theme.colorScheme.outline),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    grade.letterGrade ?? '—',
                    style: theme.textTheme.titleMedium
                        ?.copyWith(color: color, fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 4),
                Text(Formats.percent(pct),
                    style: theme.textTheme.bodySmall?.copyWith(color: color)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
