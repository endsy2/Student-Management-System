import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/fee.model.dart';
import '../../providers/fee.provider.dart';
import '../../utils/formats.dart';
import '../../widgets/common/custom_button.dart';
import '../../widgets/common/custom_input.dart';

/// Bottom sheet for recording a payment against a single [FeeLine].
///
/// The backend restricts `POST /fees/payments` to ADMIN, so a STUDENT/PARENT
/// will receive an authorization error here — surfaced inline rather than
/// crashing. The screen models the full payment-method selection per spec.
class PaymentSheet extends StatefulWidget {
  const PaymentSheet({super.key, required this.line, required this.studentId});

  final FeeLine line;
  final String studentId;

  @override
  State<PaymentSheet> createState() => _PaymentSheetState();
}

class _PaymentSheetState extends State<PaymentSheet> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _amountController;
  PaymentMethod _method = PaymentMethod.online;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _amountController = TextEditingController(
      text: widget.line.balance.toStringAsFixed(2),
    );
  }

  @override
  void dispose() {
    _amountController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    final amount = double.tryParse(_amountController.text.trim());
    if (amount == null || amount <= 0) return;

    setState(() => _isSubmitting = true);
    final error = await context.read<FeeProvider>().pay(
          studentId: widget.studentId,
          feeId: widget.line.feeId,
          amount: amount,
          method: _method,
        );
    if (!mounted) return;
    setState(() => _isSubmitting = false);

    if (error == null) {
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Payment recorded')),
      );
    } else {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text(error)));
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
      ),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('Pay ${Formats.titleCase(widget.line.feeType)}',
                style: theme.textTheme.titleLarge
                    ?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Text('Balance due: ${Formats.money(widget.line.balance)}',
                style: theme.textTheme.bodyMedium
                    ?.copyWith(color: theme.colorScheme.outline)),
            const SizedBox(height: 20),
            CustomInput(
              label: 'Amount',
              controller: _amountController,
              keyboardType:
                  const TextInputType.numberWithOptions(decimal: true),
              prefixIcon: Icons.attach_money,
              validator: (v) {
                final value = double.tryParse(v?.trim() ?? '');
                if (value == null || value <= 0) return 'Enter a valid amount';
                return null;
              },
            ),
            const SizedBox(height: 16),
            Text('Payment method',
                style: theme.textTheme.labelLarge
                    ?.copyWith(fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            SegmentedButton<PaymentMethod>(
              segments: const [
                ButtonSegment(
                    value: PaymentMethod.online,
                    label: Text('Online'),
                    icon: Icon(Icons.credit_card)),
                ButtonSegment(
                    value: PaymentMethod.bank,
                    label: Text('Bank'),
                    icon: Icon(Icons.account_balance)),
                ButtonSegment(
                    value: PaymentMethod.cash,
                    label: Text('Cash'),
                    icon: Icon(Icons.money)),
              ],
              selected: {_method},
              onSelectionChanged: (s) => setState(() => _method = s.first),
            ),
            const SizedBox(height: 24),
            CustomButton(
              label: 'Confirm payment',
              icon: Icons.check,
              isLoading: _isSubmitting,
              onPressed: _submit,
            ),
          ],
        ),
      ),
    );
  }
}
