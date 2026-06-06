'use client';

import { useState } from 'react';
import { PortalLayout } from '@/components/common/PortalLayout';
import { GradeEntry } from '@/components/grades/GradeEntry';
import { StudentScopedView } from '@/components/students/StudentScopedView';
import { StudentGradesView } from '@/components/grades/StudentGradesView';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { gradeService } from '@/services/grade.service';
import { apiErrorMessage } from '@/services/api';
import type { CourseAnalytics } from '@/types';

function CourseAnalyticsCard() {
  const [courseId, setCourseId] = useState('');
  const [data, setData] = useState<CourseAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      setData(await gradeService.courseAnalytics(courseId));
    } catch (e) {
      setError(apiErrorMessage(e));
    }
  }

  return (
    <Card title="Course performance analytics">
      <div className="mb-3 flex items-end gap-2">
        <div className="flex-1">
          <Input label="Course ID" value={courseId} onChange={(e) => setCourseId(e.target.value)} />
        </div>
        <Button onClick={load} disabled={!courseId}>
          Load
        </Button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {data && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatsCard label="Average" value={`${data.average}%`} />
          <StatsCard label="Median" value={`${data.median}%`} />
          <StatsCard label="Pass rate" value={`${data.passRate}%`} accent="text-green-600" />
          <StatsCard label="At risk" value={data.atRisk.length} accent="text-red-600" />
        </div>
      )}
    </Card>
  );
}

export default function AdminGradesPage() {
  return (
    <PortalLayout allow={['ADMIN']} title="Grades">
      <div className="space-y-6">
        <GradeEntry />
        <CourseAnalyticsCard />
        <StudentScopedView storageKey="admin.grades.student">
          {(id) => <StudentGradesView studentId={id} />}
        </StudentScopedView>
      </div>
    </PortalLayout>
  );
}
