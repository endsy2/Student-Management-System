import { z } from 'zod';

export const createClassSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    gradeLevel: z.string().min(1),
    capacity: z.number().int().positive().default(30),
    academicYear: z.string().min(1),
    teacherId: z.string().uuid().optional(),
  }),
});

export const idParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export type CreateClassInput = z.infer<typeof createClassSchema>['body'];
