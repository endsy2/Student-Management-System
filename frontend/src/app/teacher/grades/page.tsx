'use client';

import { PortalLayout } from '@/components/common/PortalLayout';
import { GradeEntry } from '@/components/grades/GradeEntry';
import { StudentScopedView } from '@/components/students/StudentScopedView';
import { StudentGradesView } from '@/components/grades/StudentGradesView';

export default function TeacherGradesPage() {
  return (
    <PortalLayout allow={['TEACHER', 'ADMIN']} title="Grades">
      <div className="space-y-6">
        <GradeEntry />
        <StudentScopedView storageKey="teacher.grades.student">
          {(id) => <StudentGradesView studentId={id} />}
        </StudentScopedView>
      </div>
    </PortalLayout>
  );
}
