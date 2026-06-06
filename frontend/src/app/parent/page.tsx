'use client';

import { PortalLayout } from '@/components/common/PortalLayout';
import { Alert } from '@/components/common/Alert';
import { StudentScopedView } from '@/components/students/StudentScopedView';
import { StudentProfileView } from '@/components/students/StudentProfileView';

export default function ParentDashboardPage() {
  return (
    <PortalLayout allow={['PARENT', 'ADMIN']} title="Parent Dashboard">
      <Alert variant="info">
        Select your child below. (Linking parent accounts to a child record is a later backend
        phase.)
      </Alert>
      <StudentScopedView storageKey="parent.child">
        {(id) => <StudentProfileView studentId={id} />}
      </StudentScopedView>
    </PortalLayout>
  );
}
