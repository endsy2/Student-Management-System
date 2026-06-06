import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../config/themes.dart';
import '../../models/fee.model.dart';
import '../../providers/fee.provider.dart';
import '../../providers/student.provider.dart';
import '../../utils/formats.dart';
import '../../widgets/common/loading_widget.dart';
import 'payment_sheet.dart';

class FeesScreen extends StatefulWidget {
  const FeesScreen({super.key});

  @override
  State<FeesScreen> createState() => _FeesScreenState();
}

class _FeesScreenState extends State<FeesScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    final id = context.read<StudentProvider>().studentId;
    if (id != null) await context.read<FeeProvider>().load(id);
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<FeeProvider>();
    final ledger = provider.ledger;

    return Scaffold(
      appBar: AppBar(title: const Text('Fees')),
      body: provider.isLoading && ledger == null
          ? const LoadingWidget()
          : provider.error != null && ledger == null
              ? StatusView(
                  icon: Icons.error_outline,
                  title: 'Could not load fees',
                  subtitle: provider.error,
                  onRetry: _load,
                )
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView(
                    padding: const EdgeInsets.all(16),
                    children: [
                      if (ledger != null) _BalanceCard(ledger: ledger),
                      const SizedBox(height: 16),
                      if (ledger == null || ledger.lines.isEmpty)
                        const StatusView(
                          icon: Icons.receipt_long_outlined,
                          title: 'No fees assigned',
                        )
                      else
                        for (final line in ledger.lines)
                          _FeeLineCard(
                            line: line,
                            onPay: () => _openPaymentSheet(line),
                          ),
                    ],
                  ),
                ),
    );
  }

  Future<void> _openPaymentSheet(FeeLine line) async {
    final studentId = context.read<StudentProvider>().studentId;
    if (studentId == null) return;

    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (_) => PaymentSheet(line: line, studentId: studentId),
    );
  }
}

class _BalanceCard extends StatelessWidget {
  const _BalanceCard({required this.ledger});
  final FeeLedger ledger;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final hasBalance = ledger.totalBalance > 0;
    return Card(
      color: hasBalance ? AppTheme.warning : AppTheme.success,
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Total outstanding',
                style: theme.textTheme.bodyMedium
                    ?.copyWith(color: Colors.white70)),
            const SizedBox(height: 6),
            Text(Formats.money(ledger.totalBalance),
                style: theme.textTheme.headlineMedium?.copyWith(
                    color: Colors.white, fontWeight: FontWeight.bold)),
            if (ledger.scholarshipPct > 0) ...[
              const SizedBox(height: 8),
              Text('Scholarship applied: ${Formats.percent(ledger.scholarshipPct)}',
                  style: const TextStyle(color: Colors.white70)),
            ],
          ],
        ),
      ),
    );
  }
}

class _FeeLineCard extends StatelessWidget {
  const _FeeLineCard({required this.line, required this.onPay});
  final FeeLine line;
  final VoidCallback onPay;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final statusColor = line.isPaid
        ? AppTheme.success
        : line.isOverdue
            ? AppTheme.danger
            : AppTheme.warning;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(Formats.titleCase(line.feeType),
                      style: theme.textTheme.titleMedium
                          ?.copyWith(fontWeight: FontWeight.w600)),
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: statusColor.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    line.isPaid
                        ? 'Paid'
                        : line.isOverdue
                            ? '${line.daysOverdue}d overdue'
                            : 'Due',
                    style: theme.textTheme.labelMedium?.copyWith(
                        color: statusColor, fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            _row(theme, 'Amount', Formats.money(line.netDue)),
            _row(theme, 'Paid', Formats.money(line.paid)),
            _row(theme, 'Balance', Formats.money(line.balance), bold: true),
            _row(theme, 'Due date', Formats.date(line.dueDate)),
            if (!line.isPaid) ...[
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: onPay,
                  icon: const Icon(Icons.payment),
                  label: const Text('Make payment'),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _row(ThemeData theme, String label, String value,
      {bool bold = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: theme.textTheme.bodyMedium
                  ?.copyWith(color: theme.colorScheme.outline)),
          Text(value,
              style: theme.textTheme.bodyMedium?.copyWith(
                  fontWeight: bold ? FontWeight.bold : FontWeight.w500)),
        ],
      ),
    );
  }
}
