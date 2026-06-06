'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Alert } from '@/components/common/Alert';
import { authService } from '@/services/auth.service';
import { apiErrorMessage } from '@/services/api';
import type { Role } from '@/types';

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'STUDENT' as Role,
  });
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authService.register(form);
      setOk(true);
      setTimeout(() => router.push('/login'), 1200);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm space-y-4 rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
    >
      <h1 className="text-2xl font-semibold">Create account</h1>
      <Alert variant="error">{error}</Alert>
      {ok && <Alert variant="success">Account created — redirecting to sign in…</Alert>}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="First name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          required
        />
        <Input
          label="Last name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          required
        />
      </div>
      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <Input
        label="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
        minLength={8}
      />
      <Select
        label="Role"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
        options={[
          { value: 'STUDENT', label: 'Student' },
          { value: 'PARENT', label: 'Parent' },
          { value: 'TEACHER', label: 'Teacher' },
          { value: 'ADMIN', label: 'Admin' },
        ]}
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating…' : 'Create account'}
      </Button>
      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
