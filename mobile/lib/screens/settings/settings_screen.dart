import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../config/environment.dart';
import '../../providers/auth.provider.dart';
import '../../providers/student.provider.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;

    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        children: [
          if (user != null)
            ListTile(
              leading: const CircleAvatar(child: Icon(Icons.person)),
              title: Text(user.fullName),
              subtitle: Text('${user.email}\n${user.role}'),
              isThreeLine: true,
            ),
          const Divider(),
          const ListTile(
            leading: Icon(Icons.notifications_outlined),
            title: Text('Notifications'),
            trailing: Icon(Icons.chevron_right),
          ),
          ListTile(
            leading: const Icon(Icons.dns_outlined),
            title: const Text('API endpoint'),
            subtitle: Text(Environment.apiBaseUrl),
          ),
          const AboutListTile(
            icon: Icon(Icons.info_outline),
            applicationName: 'School Management',
            applicationVersion: '0.1.0',
            child: Text('About'),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout, color: Colors.red),
            title: const Text('Log out',
                style: TextStyle(color: Colors.red)),
            onTap: () => _confirmLogout(context),
          ),
        ],
      ),
    );
  }

  Future<void> _confirmLogout(BuildContext context) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Log out?'),
        content: const Text('You will need to sign in again.'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Cancel')),
          FilledButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text('Log out')),
        ],
      ),
    );

    if (confirmed != true || !context.mounted) return;
    context.read<StudentProvider>().clear();
    await context.read<AuthProvider>().logout();
    // The AuthGate listens to AuthProvider and returns to the login screen,
    // so pop back to the root to let it take over.
    if (context.mounted) {
      Navigator.of(context).popUntil((route) => route.isFirst);
    }
  }
}
