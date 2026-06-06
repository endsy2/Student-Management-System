import 'package:flutter/foundation.dart';

import '../models/fee.model.dart';
import '../services/fee.service.dart';

/// Loads the fee ledger for the active student and records payments.
class FeeProvider extends ChangeNotifier {
  FeeProvider(this._service);

  final FeeService _service;

  FeeLedger? _ledger;
  bool _isLoading = false;
  String? _error;

  FeeLedger? get ledger => _ledger;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> load(String studentId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      _ledger = await _service.ledger(studentId);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Records a payment then refreshes the ledger. Returns null on success or
  /// an error message to surface in the UI.
  Future<String?> pay({
    required String studentId,
    required String feeId,
    required double amount,
    required PaymentMethod method,
  }) async {
    try {
      await _service.recordPayment(
        studentId: studentId,
        feeId: feeId,
        amountPaid: amount,
        method: method,
      );
      await load(studentId);
      return null;
    } catch (e) {
      return e.toString();
    }
  }
}
