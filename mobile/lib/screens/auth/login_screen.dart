import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../config/themes.dart';
import '../../providers/auth.provider.dart';
import '../../utils/validators.dart';
import '../../widgets/common/custom_button.dart';
import '../../widgets/common/custom_input.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscure = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    FocusScope.of(context).unfocus();

    final auth = context.read<AuthProvider>();
    final ok = await auth.login(
      _emailController.text,
      _passwordController.text,
    );
    if (!ok && mounted && auth.errorMessage != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(auth.errorMessage!)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isBusy = context.select<AuthProvider, bool>((a) => a.isBusy);

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(gradient: AppTheme.linear(AppTheme.heroGradient)),
        child: SafeArea(
          child: SingleChildScrollView(
            child: Column(
              children: [
                // Branded header.
                Padding(
                  padding: const EdgeInsets.fromLTRB(24, 48, 24, 36),
                  child: Column(
                    children: [
                      Container(
                        height: 88,
                        width: 88,
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.20),
                          borderRadius: BorderRadius.circular(26),
                        ),
                        child: const Text('🎓', style: TextStyle(fontSize: 44)),
                      ),
                      const SizedBox(height: 20),
                      Text(
                        'Welcome back!',
                        style: theme.textTheme.headlineMedium?.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Sign in to continue your journey',
                        style: theme.textTheme.bodyLarge?.copyWith(
                          color: Colors.white.withValues(alpha: 0.9),
                        ),
                      ),
                    ],
                  ),
                ),
                // White rounded form sheet.
                Container(
                  width: double.infinity,
                  constraints: BoxConstraints(
                    minHeight: MediaQuery.of(context).size.height * 0.5,
                  ),
                  decoration: const BoxDecoration(
                    color: AppTheme.surfaceBg,
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(32),
                      topRight: Radius.circular(32),
                    ),
                  ),
                  padding: const EdgeInsets.fromLTRB(24, 32, 24, 24),
                  child: Center(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 420),
                      child: Form(
                        key: _formKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            CustomInput(
                              label: 'Email',
                              controller: _emailController,
                              hint: 'you@school.edu',
                              keyboardType: TextInputType.emailAddress,
                              prefixIcon: Icons.mail_outline_rounded,
                              validator: Validators.email,
                            ),
                            const SizedBox(height: 18),
                            CustomInput(
                              label: 'Password',
                              controller: _passwordController,
                              hint: '••••••••',
                              obscureText: _obscure,
                              prefixIcon: Icons.lock_outline_rounded,
                              validator: Validators.password,
                              onSubmitted: (_) => _submit(),
                              suffix: IconButton(
                                icon: Icon(_obscure
                                    ? Icons.visibility_outlined
                                    : Icons.visibility_off_outlined),
                                onPressed: () =>
                                    setState(() => _obscure = !_obscure),
                              ),
                            ),
                            const SizedBox(height: 28),
                            CustomButton(
                              label: 'Sign In',
                              icon: Icons.arrow_forward_rounded,
                              isLoading: isBusy,
                              onPressed: _submit,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              'Trouble signing in? Contact your school admin.',
                              textAlign: TextAlign.center,
                              style: theme.textTheme.bodySmall
                                  ?.copyWith(color: AppTheme.muted),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
