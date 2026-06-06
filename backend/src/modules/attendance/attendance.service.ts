import { Prisma, AttendanceStatus } from '@prisma/client';
import { prisma } from '@/config/database';
import { getIO } from '@/config/socket';
import type {
  BulkMarkInput,
  HistoryQuery,
  MarkAttendanceInput,
  StaffAttendanceInput,
} from './attendance.validators';

/** Normalises a date to midnight so one record exists per student/class/day. */
function atMidnight(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function emitClassUpdate(classId: string, payload: unknown): void {
  try {
    getIO().to(`class:${classId}`).emit('attendance:update', payload);
  } catch {
    // socket not initialised (e.g. during tests) — ignore
  }
}

export const attendanceService = {
  async mark(input: MarkAttendanceInput, markedBy?: string) {
    const date = atMidnight(input.date);
    const record = await prisma.attendance.upsert({
      where: {
        studentId_classId_date: { studentId: input.studentId, classId: input.classId, date },
      },
      create: { ...input, date, markedBy },
      update: { status: input.status, notes: input.notes, markedBy },
    });
    emitClassUpdate(input.classId, { type: 'single', record });
    return record;
  },

  async bulkMark(input: BulkMarkInput, markedBy?: string) {
    const date = atMidnight(input.date);
    const results = await prisma.$transaction(
      input.records.map((r) =>
        prisma.attendance.upsert({
          where: {
            studentId_classId_date: { studentId: r.studentId, classId: input.classId, date },
          },
          create: {
            studentId: r.studentId,
            classId: input.classId,
            date,
            status: r.status,
            notes: r.notes,
            markedBy,
          },
          update: { status: r.status, notes: r.notes, markedBy },
        }),
      ),
    );
    emitClassUpdate(input.classId, { type: 'bulk', count: results.length, date });
    return results;
  },

  async getByClassAndDate(classId: string, date: Date) {
    return prisma.attendance.findMany({
      where: { classId, date: atMidnight(date) },
      include: { student: { select: { id: true, studentId: true, firstName: true, lastName: true } } },
      orderBy: { student: { lastName: 'asc' } },
    });
  },

  async history(query: HistoryQuery) {
    const { studentId, classId, from, to, page, limit } = query;
    const where: Prisma.AttendanceWhereInput = {
      ...(studentId ? { studentId } : {}),
      ...(classId ? { classId } : {}),
      ...(from || to
        ? { date: { ...(from ? { gte: atMidnight(from) } : {}), ...(to ? { lte: atMidnight(to) } : {}) } }
        : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.attendance.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      prisma.attendance.count({ where }),
    ]);

    return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  /** Attendance rate = (present + late) / total, plus a per-status breakdown. */
  async analytics(params: { studentId?: string; classId?: string; from?: Date; to?: Date }) {
    const where: Prisma.AttendanceWhereInput = {
      ...(params.studentId ? { studentId: params.studentId } : {}),
      ...(params.classId ? { classId: params.classId } : {}),
      ...(params.from || params.to
        ? {
            date: {
              ...(params.from ? { gte: atMidnight(params.from) } : {}),
              ...(params.to ? { lte: atMidnight(params.to) } : {}),
            },
          }
        : {}),
    };

    const grouped = await prisma.attendance.groupBy({
      by: ['status'],
      where,
      _count: { _all: true },
    });

    const counts: Record<AttendanceStatus, number> = {
      PRESENT: 0,
      ABSENT: 0,
      LATE: 0,
      EXCUSED: 0,
    };
    grouped.forEach((g) => (counts[g.status] = g._count._all));

    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const attendanceRate = total === 0 ? 0 : Math.round(((counts.PRESENT + counts.LATE) / total) * 100);

    return { total, counts, attendanceRate };
  },

  async markStaff(input: StaffAttendanceInput) {
    const date = atMidnight(input.date);
    return prisma.staffAttendance.upsert({
      where: { staffId_date: { staffId: input.staffId, date } },
      create: { ...input, date },
      update: { status: input.status, notes: input.notes },
    });
  },
};
