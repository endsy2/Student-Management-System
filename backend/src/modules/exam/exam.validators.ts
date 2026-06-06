import { z } from 'zod';

export const createExamSchema = z.object({
  body: z.object({
    courseId: z.string().uuid(),
    title: z.string().min(1),
    date: z.coerce.date(),
    time: z.string().optional(),
    duration: z.number().int().positive().optional(),
    location: z.string().optional(),
    maxScore: z.number().positive().default(100),
  }),
});

export const courseParamSchema = z.object({
  params: z.object({ courseId: z.string().uuid() }),
});

export type CreateExamInput = z.infer<typeof createExamSchema>['body'];
