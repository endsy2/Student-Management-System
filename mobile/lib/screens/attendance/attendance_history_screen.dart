import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/attendance.provider.dart';
import '../../providers/student.provider.dart';
import '../../utils/formats.dart';
import '../../widgets/common/loading_widget.dart';
import '../../widgets/attendance/attendance_card.dart';

/// Full attendance history with an optional date-range filter.
class AttendanceHistoryScreen extends StatefulWidget {
  const AttendanceHistoryScreen({super.key});

  @override
  State<AttendanceHistoryScreen> createState() =>
      _AttendanceHistoryScreenState();
}

class _AttendanceHistoryScreenState extends State<AttendanceHistoryScreen> {
  DateTimeRange? _range;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    final id = context.read<StudentProvider>().studentId;
    if (id == null) return;
    await context.read<AttendanceProvider>().load(
          id,
          from: _range?.start,
          to: _range?.end,
        );
  }

  Future<void> _pickRange() async {
    final now = DateTime.now();
    final picked = await showDateRangePicker(
      context: context,
      firstDate: DateTime(now.year - 2),
      lastDate: now,
      initialDateRange: _range,
    );
    if (picked != null) {
      setState(() => _range = picked);
      await _load();
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AttendanceProvider>();
    final records = provider.records;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Attendance History'),
        actions: [
          if (_range != null)
            IconButton(
              tooltip: 'Clear filter',
              icon: const Icon(Icons.filter_alt_off),
              onPressed: () {
                setState(() => _range = null);
                _load();
              },
            ),
          IconButton(
            tooltip: 'Filter by date',
            icon: const Icon(Icons.date_range),
            onPressed: _pickRange,
          ),
        ],
      ),
      body: Column(
        children: [
          if (_range != null)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              color: Theme.of(context).colorScheme.surfaceContainerHighest,
              child: Text(
                '${Formats.date(_range!.start)}  →  ${Formats.date(_range!.end)}',
                textAlign: TextAlign.center,
              ),
            ),
          Expanded(
            child: provider.isLoading && records.isEmpty
                ? const LoadingWidget()
                : records.isEmpty
                    ? StatusView(
                        icon: Icons.event_busy,
                        title: 'No records',
                        subtitle: 'No attendance found for this period.',
                        onRetry: _load,
                      )
                    : RefreshIndicator(
                        onRefresh: _load,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: records.length,
                          itemBuilder: (_, i) =>
                              AttendanceCard(record: records[i]),
                        ),
                      ),
          ),
        ],
      ),
    );
  }
}
