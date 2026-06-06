import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../config/themes.dart';
import '../../models/student.model.dart';
import '../../providers/student.provider.dart';
import '../../utils/formats.dart';
import '../../widgets/common/loading_widget.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<StudentProvider>();
    final student = provider.student;

    return Scaffold(
      appBar: AppBar(title: const Text('My Profile')),
      body: provider.isLoading
          ? const LoadingWidget()
          : student == null
              ? const StatusView(
                  icon: Icons.person_off_outlined,
                  title: 'Profile unavailable',
                )
              : _ProfileBody(student: student),
    );
  }
}

class _ProfileBody extends StatelessWidget {
  const _ProfileBody({required this.student});
  final Student student;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Center(
          child: Column(
            children: [
              CircleAvatar(
                radius: 40,
                backgroundColor: AppTheme.primary,
                child: Text(
                  student.fullName.isNotEmpty
                      ? student.fullName[0].toUpperCase()
                      : '?',
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 32,
                      fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 12),
              Text(student.fullName,
                  style: theme.textTheme.titleLarge
                      ?.copyWith(fontWeight: FontWeight.bold)),
              Text(student.studentId,
                  style: theme.textTheme.bodyMedium
                      ?.copyWith(color: theme.colorScheme.outline)),
              const SizedBox(height: 8),
              Chip(
                label: Text(Formats.titleCase(student.status)),
                backgroundColor: AppTheme.success.withValues(alpha: 0.12),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        _Section(title: 'Personal', rows: [
          ('Date of birth', Formats.date(student.dateOfBirth)),
          ('Gender', student.gender),
          ('Email', student.email ?? '—'),
          ('Phone', student.phone ?? '—'),
          ('Address', student.address ?? '—'),
        ]),
        if (student.guardian != null)
          _Section(title: 'Guardian', rows: [
            ('Name', student.guardian!.fullName),
            ('Phone', student.guardian!.phone ?? '—'),
            ('Email', student.guardian!.email ?? '—'),
            ('Address', student.guardian!.address ?? '—'),
          ]),
        if (student.allergies != null ||
            student.conditions != null ||
            student.medications != null)
          _Section(title: 'Medical', rows: [
            ('Allergies', student.allergies ?? '—'),
            ('Conditions', student.conditions ?? '—'),
            ('Medications', student.medications ?? '—'),
          ]),
      ],
    );
  }
}

class _Section extends StatelessWidget {
  const _Section({required this.title, required this.rows});
  final String title;
  final List<(String, String)> rows;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title,
                  style: theme.textTheme.titleMedium
                      ?.copyWith(fontWeight: FontWeight.w600)),
              const SizedBox(height: 12),
              for (final row in rows)
                Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        width: 110,
                        child: Text(row.$1,
                            style: theme.textTheme.bodyMedium?.copyWith(
                                color: theme.colorScheme.outline)),
                      ),
                      Expanded(
                        child: Text(row.$2,
                            style: theme.textTheme.bodyMedium
                                ?.copyWith(fontWeight: FontWeight.w500)),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
