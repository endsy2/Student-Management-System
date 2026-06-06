'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { NAV_BY_ROLE } from '@/config/nav';
import { Button } from './Button';
import { Loading } from './Loading';
import type { Role } from '@/types';

/** Auth guard + sidebar/header chrome for every dashboard page. */
export function PortalLayout({
  allow,
  title,
  children,
}: {
  allow: Role[];
  title: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, loadSession, logout } = useAuthStore();

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (loading) return;
    if (!user || !allow.includes(user.role)) router.replace('/login');
  }, [loading, user, allow, router]);

  if (loading || !user) {
    return <Loading label="Authenticating…" />;
  }

  const nav = NAV_BY_ROLE[user.role];

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 flex-col border-r border-gray-200 bg-white sm:flex">
        <div className="border-b border-gray-200 px-5 py-4">
          <p className="text-sm font-semibold text-brand">SMS</p>
          <p className="text-xs text-gray-500">{user.role} portal</p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-sm ${
                  active ? 'bg-brand text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold">{title}</h1>
            <p className="text-xs text-gray-500">
              {user.firstName} {user.lastName} · {user.email}
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={async () => {
              await logout();
              router.replace('/login');
            }}
          >
            Sign out
          </Button>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
