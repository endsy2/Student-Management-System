'use client';

import { PortalLayout } from '@/components/common/PortalLayout';
import { StudentScopedView } from '@/components/students/StudentScopedView';
import { AttendanceHistoryView } from '@/components/attendance/AttendanceHistoryView';

export default function ChildAttendancePage() {
  return (
    <PortalLayout allow={['PARENT', 'ADMIN']} title="Child Attendance">
      <StudentScopedView storageKey="parent.child">
        {(id) => <AttendanceHistoryView studentId={id} />}
      </StudentScopedView>
    </PortalLayout>
  );
}
