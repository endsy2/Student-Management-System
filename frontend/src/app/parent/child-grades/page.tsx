'use client';

import { PortalLayout } from '@/components/common/PortalLayout';
import { StudentScopedView } from '@/components/students/StudentScopedView';
import { StudentGradesView } from '@/components/grades/StudentGradesView';

export default function ChildGradesPage() {
  return (
    <PortalLayout allow={['PARENT', 'ADMIN']} title="Child Grades">
      <StudentScopedView storageKey="parent.child">
        {(id) => <StudentGradesView studentId={id} />}
      </StudentScopedView>
    </PortalLayout>
  );
}
