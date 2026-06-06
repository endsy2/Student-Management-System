'use client';

import { PortalLayout } from '@/components/common/PortalLayout';
import { AttendanceMarker } from '@/components/attendance/AttendanceMarker';
import { LiveAttendanceBoard } from '@/components/attendance/LiveAttendanceBoard';
import { StudentScopedView } from '@/components/students/StudentScopedView';
import { AttendanceHistoryView } from '@/components/attendance/AttendanceHistoryView';

export default function AdminAttendancePage() {
  return (
    <PortalLayout allow={['ADMIN']} title="Attendance">
      <div className="space-y-6">
        <LiveAttendanceBoard />
        <AttendanceMarker />
        <StudentScopedView storageKey="admin.attendance.student">
          {(id) => <AttendanceHistoryView studentId={id} />}
        </StudentScopedView>
      </div>
    </PortalLayout>
  );
}
