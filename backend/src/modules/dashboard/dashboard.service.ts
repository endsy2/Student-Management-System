import { AttendanceStatus } from '@prisma/client';
import { prisma } from '@/config/database';
import { redis } from '@/config/redis';
import { feeService } from '@/modules/fee/fee.service';

const OVERVIEW_KEY = 'dashboard:overview';
const OVERVIEW_TTL = 5 * 60; // 5 minutes

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export const dashboardService = {
  async overview() {
    const cached = await redis.get(OVERVIEW_KEY);
    if (cached) return JSON.parse(cached);

    const today = startOfToday();

    const [totalStudents, totalTeachers, todayRecords, financial] = await Promise.all([
      prisma.student.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { role: 'TEACHER', isActive: true } }),
      prisma.attendance.findMany({ where: { date: today }, select: { status: true } }),
      feeService.financialReport(),
    ]);

    const present = todayRecords.filter(
      (r) => r.status === AttendanceStatus.PRESENT || r.status === AttendanceStatus.LATE,
    ).length;
    const todayAttendanceRate =
      todayRecords.length === 0 ? 0 : Math.round((present / todayRecords.length) * 100);

    const overdue = await feeService.overdue();
    const overdueAmount = Math.round(overdue.reduce((s, o) => s + o.totalOverdue, 0) * 100) / 100;

    const data = {
      totalStudents,
      totalTeachers,
      todayAttendanceRate,
      totalRevenue: financial.totalIncome,
      overdueStudents: overdue.length,
      overdueAmount,
    };

    await redis.set(OVERVIEW_KEY, JSON.stringify(data), 'EX', OVERVIEW_TTL);
    return data;
  },

  async analytics() {
    const [byGender, byStatus, financial] = await Promise.all([
      prisma.student.groupBy({ by: ['gender'], where: { deletedAt: null }, _count: { _all: true } }),
      prisma.student.groupBy({ by: ['status'], where: { deletedAt: null }, _count: { _all: true } }),
      feeService.financialReport(),
    ]);

    // Attendance trend over the last 14 days.
    const since = new Date();
    since.setDate(since.getDate() - 14);
    since.setHours(0, 0, 0, 0);
    const attendance = await prisma.attendance.findMany({
      where: { date: { gte: since } },
      select: { date: true, status: true },
    });

    const trend: Record<string, { present: number; total: number }> = {};
    attendance.forEach((a) => {
      const key = a.date.toISOString().slice(0, 10);
      trend[key] ??= { present: 0, total: 0 };
      trend[key].total += 1;
      if (a.status === AttendanceStatus.PRESENT || a.status === AttendanceStatus.LATE) {
        trend[key].present += 1;
      }
    });

    const attendanceTrend = Object.entries(trend)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, v]) => ({ date, rate: Math.round((v.present / v.total) * 100) }));

    return {
      studentsByGender: byGender.map((g) => ({ gender: g.gender, count: g._count._all })),
      studentsByStatus: byStatus.map((s) => ({ status: s.status, count: s._count._all })),
      feeCollectionByType: financial.byFeeType,
      monthlyRevenue: financial.monthlyTrend,
      attendanceTrend,
    };
  },

  recentActivity() {
    return prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 20,
      include: { user: { select: { firstName: true, lastName: true, role: true } } },
    });
  },
};
