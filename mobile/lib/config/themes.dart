import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Design system aligned with the **web admin** portal:
/// brand blue (#2563eb) on a light gray (#F9FAFB) background, white cards with
/// subtle gray-200 borders, the Inter typeface, and small (8–12px) radii.
///
/// Legacy colour/gradient names are preserved so existing widgets keep
/// compiling; the palette is remapped to the web's Tailwind colours.
class AppTheme {
  const AppTheme._();

  // Core palette — matches the web Tailwind theme.
  static const Color primary = Color(0xFF2563EB); // blue-600 (brand)
  static const Color primaryDark = Color(0xFF1D4ED8); // blue-700 (brand-dark)
  static const Color accent = Color(0xFF7C3AED); // violet-600
  static const Color success = Color(0xFF16A34A); // green-600
  static const Color warning = Color(0xFFF59E0B); // amber-500
  static const Color danger = Color(0xFFDC2626); // red-600
  static const Color info = Color(0xFF0891B2); // cyan-600
  static const Color ink = Color(0xFF111827); // gray-900 text
  static const Color muted = Color(0xFF6B7280); // gray-500 secondary text
  static const Color surfaceBg = Color(0xFFF9FAFB); // gray-50 app background
  static const Color border = Color(0xFFE5E7EB); // gray-200 card/input border

  // Gradient pairs, recoloured to the web brand/accent families. Kept so the
  // hero/feature/ring widgets compile, but now sit within the web palette.
  static const List<Color> heroGradient = [Color(0xFF2563EB), Color(0xFF1D4ED8)];
  static const List<Color> gradeGradient = [Color(0xFF2563EB), Color(0xFF3B82F6)];
  static const List<Color> attendanceGradient = [Color(0xFF16A34A), Color(0xFF22C55E)];
  static const List<Color> feeGradient = [Color(0xFFF59E0B), Color(0xFFFBBF24)];
  static const List<Color> qrGradient = [Color(0xFF0891B2), Color(0xFF06B6D4)];
  static const List<Color> profileGradient = [Color(0xFF7C3AED), Color(0xFF8B5CF6)];

  /// Helper to build a 45° linear gradient from a colour pair.
  static LinearGradient linear(List<Color> colors) => LinearGradient(
        colors: colors,
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      );

  /// Subtle elevation matching the web's `shadow-sm` on cards/banners.
  static List<BoxShadow> softShadow(Color color) => [
        BoxShadow(
          color: color.withValues(alpha: 0.18),
          blurRadius: 12,
          offset: const Offset(0, 4),
        ),
      ];

  static ThemeData get light {
    final scheme = ColorScheme.fromSeed(
      seedColor: primary,
      brightness: Brightness.light,
    ).copyWith(surface: Colors.white, outline: muted);

    final textTheme = GoogleFonts.interTextTheme().apply(
      bodyColor: ink,
      displayColor: ink,
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      scaffoldBackgroundColor: surfaceBg,
      textTheme: textTheme,
      appBarTheme: AppBarTheme(
        centerTitle: false,
        elevation: 0,
        scrolledUnderElevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: ink,
        titleTextStyle: GoogleFonts.inter(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: ink,
        ),
      ),
      cardTheme: CardThemeData(
        elevation: 0,
        color: Colors.white,
        margin: const EdgeInsets.only(bottom: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: border),
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: surfaceBg,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(999),
          side: const BorderSide(color: border),
        ),
        labelStyle: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600),
      ),
      navigationBarTheme: NavigationBarThemeData(
        height: 64,
        backgroundColor: Colors.white,
        elevation: 0,
        indicatorColor: primary.withValues(alpha: 0.12),
        labelTextStyle: WidgetStateProperty.all(
          GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600),
        ),
        iconTheme: WidgetStateProperty.resolveWith((states) {
          final selected = states.contains(WidgetState.selected);
          return IconThemeData(color: selected ? primary : muted);
        }),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
        hintStyle: const TextStyle(color: muted),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: primary, width: 1.5),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: Colors.white,
          minimumSize: const Size.fromHeight(48),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          textStyle: GoogleFonts.inter(
            fontSize: 15,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: ink,
          minimumSize: const Size.fromHeight(48),
          side: const BorderSide(color: border),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          textStyle: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600),
        ),
      ),
    );
  }
}
