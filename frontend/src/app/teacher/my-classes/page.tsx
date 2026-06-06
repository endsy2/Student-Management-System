'use client';

import { PortalLayout } from '@/components/common/PortalLayout';
import { Card } from '@/components/common/Card';

export default function MyClassesPage() {
  return (
    <PortalLayout allow={['TEACHER', 'ADMIN']} title="My Classes">
      <Card title="Classes">
        <p className="text-sm text-gray-600">
          Class rosters will appear here once the backend exposes Class/Course endpoints. For now,
          attendance and grades accept a class/course ID directly.
        </p>
      </Card>
    </PortalLayout>
  );
}
