'use client';

import { PortalLayout } from '@/components/common/PortalLayout';
import { Card } from '@/components/common/Card';
import { useAuthStore } from '@/store/auth.store';

export default function AdminSettingsPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <PortalLayout allow={['ADMIN']} title="Settings">
      <Card title="Account">
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs uppercase text-gray-400">Name</dt>
            <dd>
              {user?.firstName} {user?.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-gray-400">Email</dt>
            <dd>{user?.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-gray-400">Role</dt>
            <dd>{user?.role}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-gray-400">
          Editable settings (grade scale, late threshold, notification preferences) are part of a
          later phase.
        </p>
      </Card>
    </PortalLayout>
  );
}
