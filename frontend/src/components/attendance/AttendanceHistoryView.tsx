'use client';

import { useEffect, useState } from 'react';
import { attendanceService } from '@/services/attendance.service';
import { apiErrorMessage } from '@/services/api';
import { Card } from '@/components/common/Card';
import { Alert } from '@/components/common/Alert';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Table } from '@/components/common/Table';
import { formatDate } from '@/utils/format';
import type { AttendanceAnalytics, AttendanceRecord } from '@/types';

export function AttendanceHistoryView({ studentId }: { studentId: string }) {
  const [analytics, setAnalytics] = useState<AttendanceAnalytics | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) return;
    Promise.all([
      attendanceService.analytics({ studentId }),
      attendanceService.history({ studentId, limit: 60 }),
    ])
      .then(([a, h]) => {
        setAnalytics(a);
        setRecords(h.items);
      })
      .catch((e) => setError(apiErrorMessage(e)));
  }, [studentId]);

  if (!studentId) return <p className="text-gray-500">Select a student to view attendance.</p>;

  return (
    <div className="space-y-4">
      <Alert variant="error">{error}</Alert>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatsCard label="Attendance rate" value={`${analytics?.attendanceRate ?? 0}%`} />
        <StatsCard label="Present" value={analytics?.counts.PRESENT ?? 0} accent="text-green-600" />
        <StatsCard label="Absent" value={analytics?.counts.ABSENT ?? 0} accent="text-red-600" />
        <StatsCard label="Late" value={analytics?.counts.LATE ?? 0} accent="text-amber-600" />
      </div>
      <Card title="History">
        <Table<AttendanceRecord>
          rowKey={(r) => r.id}
          rows={records}
          empty="No attendance records."
          columns={[
            { header: 'Date', cell: (r) => formatDate(r.date) },
            { header: 'Status', cell: (r) => r.status },
            { header: 'Notes', cell: (r) => r.notes ?? '—' },
          ]}
        />
      </Card>
    </div>
  );
}
