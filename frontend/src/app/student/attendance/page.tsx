'use client';

import { PortalLayout } from '@/components/common/PortalLayout';
import { StudentScopedView } from '@/components/students/StudentScopedView';
import { AttendanceHistoryView } from '@/components/attendance/AttendanceHistoryView';

export default function StudentAttendancePage() {
  return (
    <PortalLayout allow={['STUDENT', 'ADMIN']} title="My Attendance">
      <StudentScopedView storageKey="student.self">
        {(id) => <AttendanceHistoryView studentId={id} />}
      </StudentScopedView>
    </PortalLayout>
  );
}
