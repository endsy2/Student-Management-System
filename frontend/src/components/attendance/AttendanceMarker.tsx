'use client';

import { useState } from 'react';
import { attendanceService } from '@/services/attendance.service';
import { apiErrorMessage } from '@/services/api';
import { Card } from '@/components/common/Card';
import { Alert } from '@/components/common/Alert';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { StudentSelector } from '@/components/students/StudentSelector';
import { ATTENDANCE_STATUSES } from '@/utils/constants';
import type { AttendanceStatus } from '@/types';

export function AttendanceMarker() {
  const [studentId, setStudentId] = useState('');
  const [classId, setClassId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<AttendanceStatus>('PRESENT');
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    setSaving(true);
    try {
      await attendanceService.mark({ studentId, classId, date, status });
      setOk('Attendance marked.');
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card title="Mark attendance">
      <Alert variant="error">{error}</Alert>
      <Alert variant="success">{ok}</Alert>
      <StudentSelector value={studentId} onChange={(id) => setStudentId(id)} />
      <form onSubmit={submit} className="grid grid-cols-2 gap-3">
        <Input
          label="Class ID"
          placeholder="UUID of class"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          required
        />
        <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
          options={ATTENDANCE_STATUSES}
        />
        <div className="col-span-2">
          <Button type="submit" disabled={saving || !studentId}>
            {saving ? 'Saving…' : 'Mark'}
          </Button>
        </div>
      </form>
      <p className="mt-3 text-xs text-gray-400">
        Class ID is entered manually — the backend has no Class listing endpoint yet.
      </p>
    </Card>
  );
}
