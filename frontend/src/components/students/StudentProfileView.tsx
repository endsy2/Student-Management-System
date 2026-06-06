'use client';

import { useEffect, useState } from 'react';
import { studentService } from '@/services/student.service';
import { apiErrorMessage } from '@/services/api';
import { Card } from '@/components/common/Card';
import { Alert } from '@/components/common/Alert';
import { Loading } from '@/components/common/Loading';
import type { Student } from '@/types';

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="text-sm text-gray-800">{value || '—'}</dd>
    </div>
  );
}

export function StudentProfileView({ studentId }: { studentId: string }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    studentService
      .get(studentId)
      .then(setStudent)
      .catch((e) => setError(apiErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (!studentId) return <p className="text-gray-500">Select a student to view the profile.</p>;
  if (loading) return <Loading />;

  return (
    <div className="space-y-4">
      <Alert variant="error">{error}</Alert>
      {student && (
        <>
          <Card title="Student">
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Field label="Student ID" value={student.studentId} />
              <Field label="First name" value={student.firstName} />
              <Field label="Last name" value={student.lastName} />
              <Field label="Gender" value={student.gender} />
              <Field
                label="Date of birth"
                value={student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : null}
              />
              <Field label="Status" value={student.status} />
              <Field label="Email" value={student.email} />
              <Field label="Phone" value={student.phone} />
              <Field label="Address" value={student.address} />
            </dl>
          </Card>
          <Card title="Guardian">
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Field label="Name" value={student.guardian ? `${student.guardian.firstName} ${student.guardian.lastName}` : null} />
              <Field label="Phone" value={student.guardian?.phone} />
              <Field label="Email" value={student.guardian?.email} />
            </dl>
          </Card>
        </>
      )}
    </div>
  );
}
