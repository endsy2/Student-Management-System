import { z } from 'zod';

export const createCourseSchema = z.object({
  body: z.object({
    code: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
    creditHours: z.number().int().positive().default(3),
    teacherId: z.string().uuid().optional(),
  }),
});

export const idParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>['body'];
