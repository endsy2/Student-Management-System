'use client';

import { PortalLayout } from '@/components/common/PortalLayout';
import { StudentScopedView } from '@/components/students/StudentScopedView';
import { FeeLedgerView } from '@/components/fees/FeeLedgerView';

export default function ChildFeesPage() {
  return (
    <PortalLayout allow={['PARENT', 'ADMIN']} title="Child Fees">
      <StudentScopedView storageKey="parent.child">
        {(id) => <FeeLedgerView studentId={id} canPay />}
      </StudentScopedView>
    </PortalLayout>
  );
}
