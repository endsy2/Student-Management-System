import 'package:flutter_test/flutter_test.dart';
import 'package:sms_mobile/models/attendance.model.dart';
import 'package:sms_mobile/models/fee.model.dart';
import 'package:sms_mobile/models/grade.model.dart';
import 'package:sms_mobile/models/user.model.dart';

void main() {
  group('AuthResult', () {
    test('parses the /auth/login envelope data', () {
      final result = AuthResult.fromJson({
        'user': {
          'id': 'u1',
          'email': 'a@b.com',
          'role': 'STUDENT',
          'firstName': 'Ada',
          'lastName': 'Lovelace',
        },
        'accessToken': 'access',
        'refreshToken': 'refresh',
      });

      expect(result.user.fullName, 'Ada Lovelace');
      expect(result.user.initials, 'AL');
      expect(result.accessToken, 'access');
      expect(result.refreshToken, 'refresh');
    });
  });

  group('attendance status mapping', () {
    test('maps wire enum values both ways', () {
      expect(attendanceStatusFromString('LATE'), AttendanceStatus.late);
      expect(attendanceStatusFromString('weird'), AttendanceStatus.unknown);
      expect(AttendanceStatus.present.wire, 'PRESENT');
      expect(AttendanceStatus.excused.label, 'Excused');
    });
  });

  group('Grade', () {
    test('computes percentage and reads nested course', () {
      final grade = Grade.fromJson({
        'id': 'g1',
        'studentId': 's1',
        'courseId': 'c1',
        'assessmentType': 'EXAM',
        'score': 45,
        'maxScore': 50,
        'weight': 1,
        'letterGrade': 'A',
        'course': {'code': 'MATH101', 'name': 'Mathematics'},
      });

      expect(grade.percentage, closeTo(90, 0.001));
      expect(grade.course?.code, 'MATH101');
    });
  });

  group('FeeLedger', () {
    test('parses balance lines', () {
      final ledger = FeeLedger.fromJson({
        'studentId': 's1',
        'scholarshipPct': 10,
        'totalBalance': 90,
        'lines': [
          {
            'feeId': 'f1',
            'feeType': 'TUITION',
            'amount': 100,
            'scholarshipPct': 10,
            'netDue': 90,
            'paid': 0,
            'balance': 90,
            'daysOverdue': 3,
            'isOverdue': true,
          }
        ],
      });

      expect(ledger.lines, hasLength(1));
      expect(ledger.lines.first.isPaid, isFalse);
      expect(ledger.lines.first.isOverdue, isTrue);
      expect(PaymentMethod.bank.wire, 'BANK');
    });
  });
}
