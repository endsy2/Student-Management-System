'use client';

import { useEffect, useState } from 'react';
import { PortalLayout } from '@/components/common/PortalLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card } from '@/components/common/Card';
import { Alert } from '@/components/common/Alert';
import { Table } from '@/components/common/Table';
import { BarChartCard, LineChartCard, PieChartCard } from '@/components/charts/Charts';
import { dashboardService } from '@/services/dashboard.service';
import { apiErrorMessage } from '@/services/api';
import type { ActivityEntry, DashboardAnalytics, DashboardOverview } from '@/types';

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      dashboardService.overview(),
      dashboardService.analytics(),
      dashboardService.recentActivity(),
    ])
      .then(([ov, an, ac]) => {
        setOverview(ov);
        setAnalytics(an);
        setActivity(ac);
      })
      .catch((e) => setError(apiErrorMessage(e)));
  }, []);

  const genderData = (analytics?.studentsByGender ?? []).map((g) => ({ name: g.gender, value: g.count }));
  const feeData = Object.entries(analytics?.feeCollectionByType ?? {}).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <PortalLayout allow={['ADMIN']} title="Admin Dashboard">
      <Alert variant="error">{error}</Alert>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total students" value={overview?.totalStudents ?? '—'} />
        <StatsCard label="Total teachers" value={overview?.totalTeachers ?? '—'} />
        <StatsCard label="Today's attendance" value={overview ? `${overview.todayAttendanceRate}%` : '—'} />
        <StatsCard label="Total revenue" value={overview ? `$${overview.totalRevenue}` : '—'} accent="text-green-600" />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Attendance trend (14 days)">
          <LineChartCard data={analytics?.attendanceTrend ?? []} xKey="date" yKey="rate" />
        </Card>
        <Card title="Fee collection by type">
          <BarChartCard data={feeData} xKey="name" yKey="value" />
        </Card>
        <Card title="Students by gender">
          <PieChartCard data={genderData} />
        </Card>
        <Card title="Recent activity">
          <Table<ActivityEntry>
            rowKey={(a) => a.id}
            rows={activity}
            empty="No recent activity."
            columns={[
              { header: 'Action', cell: (a) => `${a.action} ${a.entity}` },
              {
                header: 'By',
                cell: (a) => (a.user ? `${a.user.firstName} ${a.user.lastName}` : 'system'),
              },
              { header: 'When', cell: (a) => new Date(a.timestamp).toLocaleString() },
            ]}
          />
        </Card>
      </section>
    </PortalLayout>
  );
}
