'use client';

import { useEffect, useState } from 'react';
import { gradeService } from '@/services/grade.service';
import { apiErrorMessage } from '@/services/api';
import { Card } from '@/components/common/Card';
import { Alert } from '@/components/common/Alert';
import { Loading } from '@/components/common/Loading';
import { Button } from '@/components/common/Button';
import { Table } from '@/components/common/Table';
import type { Grade, StudentGrades } from '@/types';

export function StudentGradesView({ studentId }: { studentId: string }) {
  const [data, setData] = useState<StudentGrades | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    gradeService
      .byStudent(studentId)
      .then(setData)
      .catch((e) => setError(apiErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (!studentId) return <p className="text-gray-500">Select a student to view grades.</p>;
  if (loading) return <Loading />;

  return (
    <div className="space-y-4">
      <Alert variant="error">{error}</Alert>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Overall:{' '}
          <span className="text-lg font-semibold text-brand">{data?.overallPercentage ?? 0}%</span>{' '}
          ({data?.overallGrade ?? '—'})
        </p>
        <Button onClick={() => gradeService.downloadReportCard(studentId)}>Download report card</Button>
      </div>
      <Card title="Grades">
        <Table<Grade>
          rowKey={(g) => g.id}
          rows={data?.grades ?? []}
          empty="No grades recorded."
          columns={[
            { header: 'Course', cell: (g) => g.course?.name ?? g.courseId.slice(0, 8) },
            { header: 'Assessment', cell: (g) => g.assessmentType },
            { header: 'Score', cell: (g) => `${g.score}/${g.maxScore}` },
            { header: 'Weight', cell: (g) => g.weight },
            { header: 'Grade', cell: (g) => g.letterGrade ?? '—' },
          ]}
        />
      </Card>
    </div>
  );
}
