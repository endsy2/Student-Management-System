/// Attendance status values from the backend `AttendanceStatus` enum.
enum AttendanceStatus { present, absent, late, excused, unknown }

AttendanceStatus attendanceStatusFromString(String? value) {
  switch ((value ?? '').toUpperCase()) {
    case 'PRESENT':
      return AttendanceStatus.present;
    case 'ABSENT':
      return AttendanceStatus.absent;
    case 'LATE':
      return AttendanceStatus.late;
    case 'EXCUSED':
      return AttendanceStatus.excused;
    default:
      return AttendanceStatus.unknown;
  }
}

extension AttendanceStatusX on AttendanceStatus {
  String get label {
    switch (this) {
      case AttendanceStatus.present:
        return 'Present';
      case AttendanceStatus.absent:
        return 'Absent';
      case AttendanceStatus.late:
        return 'Late';
      case AttendanceStatus.excused:
        return 'Excused';
      case AttendanceStatus.unknown:
        return 'Unknown';
    }
  }

  /// The UPPERCASE wire value the API expects.
  String get wire => this == AttendanceStatus.unknown
      ? 'PRESENT'
      : name.toUpperCase();
}

/// A single attendance record.
class AttendanceRecord {
  final String id;
  final String studentId;
  final String classId;
  final DateTime date;
  final AttendanceStatus status;
  final String? notes;

  const AttendanceRecord({
    required this.id,
    required this.studentId,
    required this.classId,
    required this.date,
    required this.status,
    this.notes,
  });

  factory AttendanceRecord.fromJson(Map<String, dynamic> json) =>
      AttendanceRecord(
        id: (json['id'] ?? '') as String,
        studentId: (json['studentId'] ?? '') as String,
        classId: (json['classId'] ?? '') as String,
        date: DateTime.tryParse(json['date']?.toString() ?? '') ??
            DateTime.now(),
        status: attendanceStatusFromString(json['status'] as String?),
        notes: json['notes'] as String?,
      );
}

/// Per-student attendance analytics returned by `GET /attendance/analytics`.
class AttendanceAnalytics {
  final int total;
  final int present;
  final int absent;
  final int late;
  final int excused;
  final double attendanceRate; // percentage 0–100

  const AttendanceAnalytics({
    required this.total,
    required this.present,
    required this.absent,
    required this.late,
    required this.excused,
    required this.attendanceRate,
  });

  factory AttendanceAnalytics.fromJson(Map<String, dynamic> json) {
    final total = (json['total'] ?? 0) as int;
    final present = (json['present'] ?? 0) as int;
    final rate = json['attendanceRate'];
    return AttendanceAnalytics(
      total: total,
      present: present,
      absent: (json['absent'] ?? 0) as int,
      late: (json['late'] ?? 0) as int,
      excused: (json['excused'] ?? 0) as int,
      attendanceRate: rate is num
          ? rate.toDouble()
          : (total == 0 ? 0 : present / total * 100),
    );
  }
}
