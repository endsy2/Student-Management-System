'use client';

import { PortalLayout } from '@/components/common/PortalLayout';
import { Card } from '@/components/common/Card';

export default function MySchedulePage() {
  return (
    <PortalLayout allow={['STUDENT', 'ADMIN']} title="My Schedule">
      <Card title="Schedule">
        <p className="text-sm text-gray-600">
          Timetable will appear here once Class/Course scheduling endpoints are added to the
          backend.
        </p>
      </Card>
    </PortalLayout>
  );
}
