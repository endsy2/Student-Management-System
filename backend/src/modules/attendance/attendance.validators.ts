import { z } from 'zod';
import { AttendanceStatus } from '@prisma/client';

export const markAttendanceSchema = z.object({
  body: z.object({
    studentId: z.string().uuid(),
    classId: z.string().uuid(),
    date: z.coerce.date(),
    status: z.nativeEnum(AttendanceStatus),
    notes: z.string().optional(),
  }),
});

export const bulkMarkSchema = z.object({
  body: z.object({
    classId: z.string().uuid(),
    date: z.coerce.date(),
    records: z
      .array(
        z.object({
          studentId: z.string().uuid(),
          status: z.nativeEnum(AttendanceStatus),
          notes: z.string().optional(),
        }),
      )
      .min(1),
  }),
});

export const classDateParamsSchema = z.object({
  params: z.object({
    classId: z.string().uuid(),
    date: z.coerce.date(),
  }),
});

export const historyQuerySchema = z.object({
  query: z.object({
    studentId: z.string().uuid().optional(),
    classId: z.string().uuid().optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(200).default(50),
  }),
});

export const staffAttendanceSchema = z.object({
  body: z.object({
    staffId: z.string().uuid(),
    date: z.coerce.date(),
    status: z.nativeEnum(AttendanceStatus),
    notes: z.string().optional(),
  }),
});

export type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>['body'];
export type BulkMarkInput = z.infer<typeof bulkMarkSchema>['body'];
export type HistoryQuery = z.infer<typeof historyQuerySchema>['query'];
export type StaffAttendanceInput = z.infer<typeof staffAttendanceSchema>['body'];
