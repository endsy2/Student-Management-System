import 'package:flutter/material.dart';

import '../../config/themes.dart';

/// Rounded gradient header at the top of the dashboard: a time-aware greeting,
/// the student's name, an avatar, and a settings shortcut. A subtle decorative
/// circle adds depth.
class HeroHeader extends StatelessWidget {
  const HeroHeader({
    super.key,
    required this.name,
    required this.initials,
    required this.onSettings,
    required this.onQr,
  });

  final String name;
  final String initials;
  final VoidCallback onSettings;
  final VoidCallback onQr;

  ({String greeting, String emoji}) _greeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return (greeting: 'Good morning', emoji: '☀️');
    if (hour < 17) return (greeting: 'Good afternoon', emoji: '🌤️');
    return (greeting: 'Good evening', emoji: '🌙');
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final g = _greeting();

    return Container(
      decoration: BoxDecoration(
        gradient: AppTheme.linear(AppTheme.heroGradient),
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(20),
          bottomRight: Radius.circular(20),
        ),
        boxShadow: AppTheme.softShadow(AppTheme.primary),
      ),
      child: Stack(
        children: [
          // Decorative translucent circle.
          Positioned(
            top: -30,
            right: -20,
            child: Container(
              width: 140,
              height: 140,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.10),
                shape: BoxShape.circle,
              ),
            ),
          ),
          Padding(
            padding: EdgeInsets.fromLTRB(
              20,
              MediaQuery.of(context).padding.top + 16,
              20,
              26,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      radius: 24,
                      backgroundColor: Colors.white,
                      child: Text(
                        initials,
                        style: theme.textTheme.titleMedium?.copyWith(
                          color: AppTheme.primary,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${g.greeting} ${g.emoji}',
                            style: theme.textTheme.bodyMedium?.copyWith(
                              color: Colors.white.withValues(alpha: 0.9),
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          Text(
                            name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: theme.textTheme.titleLarge?.copyWith(
                              color: Colors.white,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ],
                      ),
                    ),
                    _circleButton(Icons.qr_code_2_rounded, onQr),
                    const SizedBox(width: 8),
                    _circleButton(Icons.settings_outlined, onSettings),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _circleButton(IconData icon, VoidCallback onTap) {
    return Material(
      color: Colors.white.withValues(alpha: 0.18),
      shape: const CircleBorder(),
      child: InkWell(
        customBorder: const CircleBorder(),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(8),
          child: Icon(icon, color: Colors.white, size: 22),
        ),
      ),
    );
  }
}
