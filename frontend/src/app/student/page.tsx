'use client';

import { PortalLayout } from '@/components/common/PortalLayout';
import { Alert } from '@/components/common/Alert';
import { StudentScopedView } from '@/components/students/StudentScopedView';
import { StudentProfileView } from '@/components/students/StudentProfileView';

export default function StudentDashboardPage() {
  return (
    <PortalLayout allow={['STUDENT', 'ADMIN']} title="Student Dashboard">
      <Alert variant="info">
        Pick your student record below. (Linking login accounts to a student profile is a later
        backend phase — for now you select your record.)
      </Alert>
      <StudentScopedView storageKey="student.self">
        {(id) => <StudentProfileView studentId={id} />}
      </StudentScopedView>
    </PortalLayout>
  );
}
