double _toDouble(dynamic value) {
  if (value is num) return value.toDouble();
  return double.tryParse(value?.toString() ?? '') ?? 0;
}

/// Payment methods from the backend `PaymentMethod` enum.
enum PaymentMethod { cash, online, bank }

extension PaymentMethodX on PaymentMethod {
  String get wire => name.toUpperCase(); // CASH | ONLINE | BANK
  String get label {
    switch (this) {
      case PaymentMethod.cash:
        return 'Cash';
      case PaymentMethod.online:
        return 'Online';
      case PaymentMethod.bank:
        return 'Bank Transfer';
    }
  }
}

/// A fee definition from `GET /fees`.
class Fee {
  final String id;
  final String feeType; // TUITION | ADMISSION | EXAM | TRANSPORT | LIBRARY
  final double amount;
  final String frequency; // MONTHLY | QUARTERLY | YEARLY
  final DateTime? dueDate;
  final String? description;

  const Fee({
    required this.id,
    required this.feeType,
    required this.amount,
    required this.frequency,
    this.dueDate,
    this.description,
  });

  factory Fee.fromJson(Map<String, dynamic> json) => Fee(
        id: json['id'] as String,
        feeType: (json['feeType'] ?? '') as String,
        amount: _toDouble(json['amount']),
        frequency: (json['frequency'] ?? '') as String,
        dueDate: DateTime.tryParse(json['dueDate']?.toString() ?? ''),
        description: json['description'] as String?,
      );
}

/// One balance line in a student's ledger (`GET /fees/student/:id`).
class FeeLine {
  final String feeId;
  final String feeType;
  final double amount;
  final double scholarshipPct;
  final double netDue;
  final double paid;
  final double balance;
  final DateTime? dueDate;
  final int daysOverdue;
  final bool isOverdue;

  const FeeLine({
    required this.feeId,
    required this.feeType,
    required this.amount,
    required this.scholarshipPct,
    required this.netDue,
    required this.paid,
    required this.balance,
    required this.daysOverdue,
    required this.isOverdue,
    this.dueDate,
  });

  bool get isPaid => balance <= 0;

  factory FeeLine.fromJson(Map<String, dynamic> json) => FeeLine(
        feeId: (json['feeId'] ?? '') as String,
        feeType: (json['feeType'] ?? '') as String,
        amount: _toDouble(json['amount']),
        scholarshipPct: _toDouble(json['scholarshipPct']),
        netDue: _toDouble(json['netDue']),
        paid: _toDouble(json['paid']),
        balance: _toDouble(json['balance']),
        dueDate: DateTime.tryParse(json['dueDate']?.toString() ?? ''),
        daysOverdue: (json['daysOverdue'] ?? 0) as int,
        isOverdue: (json['isOverdue'] ?? false) as bool,
      );
}

/// Full ledger payload of `GET /fees/student/:studentId`.
class FeeLedger {
  final String studentId;
  final double scholarshipPct;
  final double totalBalance;
  final List<FeeLine> lines;

  const FeeLedger({
    required this.studentId,
    required this.scholarshipPct,
    required this.totalBalance,
    required this.lines,
  });

  factory FeeLedger.fromJson(Map<String, dynamic> json) => FeeLedger(
        studentId: (json['studentId'] ?? '') as String,
        scholarshipPct: _toDouble(json['scholarshipPct']),
        totalBalance: _toDouble(json['totalBalance']),
        lines: (json['lines'] as List<dynamic>? ?? [])
            .map((e) => FeeLine.fromJson(e as Map<String, dynamic>))
            .toList(),
      );
}
