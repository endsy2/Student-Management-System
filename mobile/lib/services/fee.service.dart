import '../models/fee.model.dart';
import 'api.service.dart';

/// Fee API: ledger viewing and payment recording.
class FeeService {
  FeeService({required ApiService api}) : _api = api;
  final ApiService _api;

  /// GET /fees/student/:studentId — per-fee balance ledger.
  Future<FeeLedger> ledger(String studentId) async {
    final data = await _api.get('/fees/student/$studentId');
    return FeeLedger.fromJson(data as Map<String, dynamic>);
  }

  /// POST /fees/payments — records a payment against a fee.
  /// Note: the backend restricts this to ADMIN; the screen surfaces the
  /// resulting authorization error gracefully for non-admin users.
  Future<void> recordPayment({
    required String studentId,
    required String feeId,
    required double amountPaid,
    required PaymentMethod method,
    String? transactionId,
  }) async {
    await _api.post('/fees/payments', body: {
      'studentId': studentId,
      'feeId': feeId,
      'amountPaid': amountPaid,
      'paymentMethod': method.wire,
      if (transactionId != null) 'transactionId': transactionId,
    });
  }
}
