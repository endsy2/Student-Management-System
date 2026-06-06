'use client';

import { PortalLayout } from '@/components/common/PortalLayout';
import { StudentScopedView } from '@/components/students/StudentScopedView';
import { FeeLedgerView } from '@/components/fees/FeeLedgerView';

export default function StudentFeesPage() {
  return (
    <PortalLayout allow={['STUDENT', 'ADMIN']} title="My Fees">
      <StudentScopedView storageKey="student.self">
        {(id) => <FeeLedgerView studentId={id} />}
      </StudentScopedView>
    </PortalLayout>
  );
}
