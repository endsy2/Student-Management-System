import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../config/themes.dart';

/// An animated circular progress ring with a gradient stroke and a value in
/// the centre. Used on the dashboard for attendance and grade summaries.
class ProgressRing extends StatelessWidget {
  const ProgressRing({
    super.key,
    required this.percent,
    required this.gradient,
    required this.centerText,
    required this.caption,
    this.icon,
    this.size = 116,
    this.stroke = 12,
  });

  /// 0–100.
  final double percent;
  final List<Color> gradient;
  final String centerText;
  final String caption;
  final IconData? icon;
  final double size;
  final double stroke;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final clamped = percent.clamp(0, 100) / 100;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: size,
          height: size,
          child: TweenAnimationBuilder<double>(
            tween: Tween(begin: 0, end: clamped.toDouble()),
            duration: const Duration(milliseconds: 1100),
            curve: Curves.easeOutCubic,
            builder: (context, value, _) {
              return CustomPaint(
                painter: _RingPainter(progress: value, colors: gradient, stroke: stroke),
                child: Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (icon != null)
                        Icon(icon, size: 18, color: gradient.last),
                      Text(
                        centerText,
                        style: theme.textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.w800,
                          color: AppTheme.ink,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 10),
        Text(
          caption,
          style: theme.textTheme.bodyMedium
              ?.copyWith(color: AppTheme.muted, fontWeight: FontWeight.w600),
        ),
      ],
    );
  }
}

class _RingPainter extends CustomPainter {
  _RingPainter({
    required this.progress,
    required this.colors,
    required this.stroke,
  });

  final double progress;
  final List<Color> colors;
  final double stroke;

  @override
  void paint(Canvas canvas, Size size) {
    final center = size.center(Offset.zero);
    final radius = (size.shortestSide - stroke) / 2;
    final rect = Rect.fromCircle(center: center, radius: radius);

    final track = Paint()
      ..color = const Color(0xFFEDEFF5)
      ..style = PaintingStyle.stroke
      ..strokeWidth = stroke
      ..strokeCap = StrokeCap.round;
    canvas.drawCircle(center, radius, track);

    if (progress <= 0) return;

    final arc = Paint()
      ..shader = SweepGradient(
        startAngle: -math.pi / 2,
        endAngle: 3 * math.pi / 2,
        colors: colors,
      ).createShader(rect)
      ..style = PaintingStyle.stroke
      ..strokeWidth = stroke
      ..strokeCap = StrokeCap.round;

    canvas.drawArc(rect, -math.pi / 2, 2 * math.pi * progress, false, arc);
  }

  @override
  bool shouldRepaint(covariant _RingPainter old) =>
      old.progress != progress || old.colors != colors;
}
