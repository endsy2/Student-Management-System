import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:sms_mobile/widgets/dashboard/stats_card.dart';

void main() {
  testWidgets('StatsCard renders its label and value', (tester) async {
    var tapped = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: StatsCard(
            label: 'Attendance rate',
            value: '95.0%',
            icon: Icons.event_available,
            color: Colors.green,
            onTap: () => tapped = true,
          ),
        ),
      ),
    );

    expect(find.text('Attendance rate'), findsOneWidget);
    expect(find.text('95.0%'), findsOneWidget);

    await tester.tap(find.byType(StatsCard));
    expect(tapped, isTrue);
  });
}
