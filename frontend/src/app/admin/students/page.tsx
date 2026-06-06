'use client';

import { PortalLayout } from '@/components/common/PortalLayout';
import { StudentsManager } from '@/components/students/StudentsManager';

export default function AdminStudentsPage() {
  return (
    <PortalLayout allow={['ADMIN']} title="Students">
      <StudentsManager canEdit />
    </PortalLayout>
  );
}
