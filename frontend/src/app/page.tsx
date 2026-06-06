import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-bold text-brand">School Management System</h1>
      <p className="max-w-md text-gray-600">
        Unified portal for admins, teachers, students and parents — attendance, grades, fees and
        more.
      </p>
      <Link
        href="/login"
        className="rounded-md bg-brand px-6 py-3 font-medium text-white hover:bg-brand-dark"
      >
        Sign in
      </Link>
    </main>
  );
}
