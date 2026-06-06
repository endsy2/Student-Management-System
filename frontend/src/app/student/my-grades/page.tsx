'use client';

import { PortalLayout } from '@/components/common/PortalLayout';
import { StudentScopedView } from '@/components/students/StudentScopedView';
import { StudentGradesView } from '@/components/grades/StudentGradesView';

export default function MyGradesPage() {
  return (
    <PortalLayout allow={['STUDENT', 'ADMIN']} title="My Grades">
      <StudentScopedView storageKey="student.self">
        {(id) => <StudentGradesView studentId={id} />}
      </StudentScopedView>
    </PortalLayout>
  );
}
