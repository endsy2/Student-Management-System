import { z } from 'zod';
import { EnrollmentStatus } from '@prisma/client';

export const createEnrollmentSchema = z.object({
  body: z.object({
    studentId: z.string().uuid(),
    classId: z.string().uuid(),
    courseId: z.string().uuid().optional(),
    academicYear: z.string().min(1),
    status: z.nativeEnum(EnrollmentStatus).optional(),
  }),
});

export const classParamSchema = z.object({
  params: z.object({ classId: z.string().uuid() }),
});

export const studentParamSchema = z.object({
  params: z.object({ studentId: z.string().uuid() }),
});

export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>['body'];
