'use client';

import { PortalLayout } from '@/components/common/PortalLayout';
import { StudentScopedView } from '@/components/students/StudentScopedView';
import { StudentProfileView } from '@/components/students/StudentProfileView';

export default function ChildProfilePage() {
  return (
    <PortalLayout allow={['PARENT', 'ADMIN']} title="Child Profile">
      <StudentScopedView storageKey="parent.child">
        {(id) => <StudentProfileView studentId={id} />}
      </StudentScopedView>
    </PortalLayout>
  );
}
