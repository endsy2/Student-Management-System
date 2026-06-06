import 'package:flutter/material.dart';

import '../../config/themes.dart';
import '../../models/attendance.model.dart';
import '../../utils/formats.dart';

/// One attendance history row with a status-coloured leading badge.
class AttendanceCard extends StatelessWidget {
  const AttendanceCard({super.key, required this.record});

  final AttendanceRecord record;

  ({Color color, IconData icon}) _style(AttendanceStatus status) {
    switch (status) {
      case AttendanceStatus.present:
        return (color: AppTheme.success, icon: Icons.check_circle);
      case AttendanceStatus.late:
        return (color: AppTheme.warning, icon: Icons.schedule);
      case AttendanceStatus.excused:
        return (color: AppTheme.primary, icon: Icons.event_available);
      case AttendanceStatus.absent:
      case AttendanceStatus.unknown:
        return (color: AppTheme.danger, icon: Icons.cancel);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final s = _style(record.status);

    return Card(
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: s.color.withValues(alpha: 0.12),
          child: Icon(s.icon, color: s.color),
        ),
        title: Text(record.status.label,
            style: theme.textTheme.titleMedium
                ?.copyWith(fontWeight: FontWeight.w600)),
        subtitle: Text(Formats.date(record.date)),
        trailing: record.notes == null || record.notes!.isEmpty
            ? null
            : Tooltip(
                message: record.notes!,
                child: const Icon(Icons.sticky_note_2_outlined, size: 20),
              ),
      ),
    );
  }
}
