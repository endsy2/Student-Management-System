import 'package:flutter/material.dart';

import '../../config/themes.dart';

/// A small badge representing a student achievement (e.g. "Honor Roll").
class Achievement {
  const Achievement({
    required this.emoji,
    required this.label,
    required this.color,
  });

  final String emoji;
  final String label;
  final Color color;
}

class AchievementChip extends StatelessWidget {
  const AchievementChip({super.key, required this.achievement});

  final Achievement achievement;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: achievement.color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(30),
        border: Border.all(color: achievement.color.withValues(alpha: 0.35)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(achievement.emoji, style: const TextStyle(fontSize: 16)),
          const SizedBox(width: 8),
          Text(
            achievement.label,
            style: theme.textTheme.labelLarge?.copyWith(
              color: AppTheme.ink,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}
