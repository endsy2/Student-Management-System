import 'package:intl/intl.dart';

/// Formatting helpers for dates, currency and percentages.
class Formats {
  const Formats._();

  static final DateFormat _date = DateFormat('MMM d, yyyy');
  static final DateFormat _dateTime = DateFormat('MMM d, yyyy • h:mm a');
  static final DateFormat _isoDate = DateFormat('yyyy-MM-dd');
  static final NumberFormat _currency =
      NumberFormat.currency(symbol: '\$', decimalDigits: 2);

  static String date(DateTime? value) =>
      value == null ? '—' : _date.format(value.toLocal());

  static String dateTime(DateTime? value) =>
      value == null ? '—' : _dateTime.format(value.toLocal());

  /// `yyyy-MM-dd` — the shape the attendance endpoints expect in the path.
  static String isoDate(DateTime value) => _isoDate.format(value);

  static String money(num? value) => _currency.format(value ?? 0);

  static String percent(num? value) =>
      value == null ? '—' : '${value.toStringAsFixed(1)}%';

  /// Turns `EXCUSED` / `partial` into `Excused` / `Partial`.
  static String titleCase(String value) {
    if (value.isEmpty) return value;
    final lower = value.toLowerCase();
    return lower[0].toUpperCase() + lower.substring(1);
  }
}
