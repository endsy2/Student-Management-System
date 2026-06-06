import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';

import '../../config/themes.dart';
import '../../providers/student.provider.dart';
import '../../widgets/common/loading_widget.dart';

/// Two modes:
/// - "My QR": renders the student's unique code for a teacher to scan
///   (the per-student QR the spec calls for).
/// - "Scan": opens the camera to read another QR (e.g. a class check-in code).
class QrScannerScreen extends StatefulWidget {
  const QrScannerScreen({super.key});

  @override
  State<QrScannerScreen> createState() => _QrScannerScreenState();
}

class _QrScannerScreenState extends State<QrScannerScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabs = TabController(length: 2, vsync: this);

  @override
  void dispose() {
    _tabs.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Attendance QR'),
        bottom: TabBar(
          controller: _tabs,
          tabs: const [
            Tab(text: 'My QR', icon: Icon(Icons.qr_code_2)),
            Tab(text: 'Scan', icon: Icon(Icons.qr_code_scanner)),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabs,
        children: const [_MyQrTab(), _ScanTab()],
      ),
    );
  }
}

class _MyQrTab extends StatelessWidget {
  const _MyQrTab();

  @override
  Widget build(BuildContext context) {
    final student = context.watch<StudentProvider>().student;
    if (student == null) {
      return const StatusView(
        icon: Icons.qr_code_2,
        title: 'No profile to encode',
      );
    }
    final theme = Theme.of(context);

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: QrImageView(
                data: student.studentId,
                version: QrVersions.auto,
                size: 240,
              ),
            ),
            const SizedBox(height: 24),
            Text(student.fullName,
                style: theme.textTheme.titleLarge
                    ?.copyWith(fontWeight: FontWeight.bold)),
            Text(student.studentId,
                style: theme.textTheme.bodyMedium
                    ?.copyWith(color: theme.colorScheme.outline)),
            const SizedBox(height: 12),
            Text('Show this code to your teacher to mark attendance.',
                textAlign: TextAlign.center,
                style: theme.textTheme.bodyMedium),
          ],
        ),
      ),
    );
  }
}

class _ScanTab extends StatefulWidget {
  const _ScanTab();

  @override
  State<_ScanTab> createState() => _ScanTabState();
}

class _ScanTabState extends State<_ScanTab> {
  final MobileScannerController _controller = MobileScannerController();
  bool _handled = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onDetect(BarcodeCapture capture) {
    if (_handled) return;
    if (capture.barcodes.isEmpty) return;
    final code = capture.barcodes.first.rawValue;
    if (code == null) return;
    _handled = true;
    showDialog<void>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Scanned'),
        content: Text(code),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() => _handled = false);
            },
            child: const Text('Scan again'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        MobileScanner(controller: _controller, onDetect: _onDetect),
        // Simple viewfinder overlay.
        Center(
          child: Container(
            width: 240,
            height: 240,
            decoration: BoxDecoration(
              border: Border.all(color: AppTheme.primary, width: 3),
              borderRadius: BorderRadius.circular(16),
            ),
          ),
        ),
      ],
    );
  }
}
