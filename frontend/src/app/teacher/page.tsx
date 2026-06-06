'use client';

import { useEffect, useState } from 'react';
import { PortalLayout } from '@/components/common/PortalLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Alert } from '@/components/common/Alert';
import { dashboardService } from '@/services/dashboard.service';
import { apiErrorMessage } from '@/services/api';
import type { DashboardOverview } from '@/types';

export default function TeacherDashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardService
      .overview()
      .then(setOverview)
      .catch((e) => setError(apiErrorMessage(e)));
  }, []);

  return (
    <PortalLayout allow={['TEACHER', 'ADMIN']} title="Teacher Dashboard">
      <Alert variant="error">{error}</Alert>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard label="Total students" value={overview?.totalStudents ?? '—'} />
        <StatsCard label="Today's attendance" value={overview ? `${overview.todayAttendanceRate}%` : '—'} />
        <StatsCard label="Teachers" value={overview?.totalTeachers ?? '—'} />
      </section>
      <p className="mt-6 text-sm text-gray-600">
        Use the sidebar to mark attendance and record grades for your classes.
      </p>
    </PortalLayout>
  );
}
