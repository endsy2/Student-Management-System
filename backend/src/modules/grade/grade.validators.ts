import { z } from 'zod';
import { AssessmentType } from '@prisma/client';

export const createGradeSchema = z.object({
  body: z.object({
    studentId: z.string().uuid(),
    courseId: z.string().uuid(),
    assessmentType: z.nativeEnum(AssessmentType),
    score: z.number().min(0),
    maxScore: z.number().positive(),
    weight: z.number().positive().default(1),
    submittedDate: z.coerce.date().optional(),
  }),
});

export const bulkGradeSchema = z.object({
  body: z.object({
    courseId: z.string().uuid(),
    assessmentType: z.nativeEnum(AssessmentType),
    maxScore: z.number().positive(),
    weight: z.number().positive().default(1),
    entries: z
      .array(z.object({ studentId: z.string().uuid(), score: z.number().min(0) }))
      .min(1),
  }),
});

export const studentParamSchema = z.object({
  params: z.object({ studentId: z.string().uuid() }),
});

export const courseParamSchema = z.object({
  params: z.object({ courseId: z.string().uuid() }),
});

export type CreateGradeInput = z.infer<typeof createGradeSchema>['body'];
export type BulkGradeInput = z.infer<typeof bulkGradeSchema>['body'];
