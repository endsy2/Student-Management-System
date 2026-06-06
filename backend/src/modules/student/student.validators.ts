import { z } from 'zod';
import { StudentStatus } from '@prisma/client';

const guardianSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
  })
  .optional();

export const createStudentSchema = z.object({
  body: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    dateOfBirth: z.coerce.date(),
    gender: z.string().min(1),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    allergies: z.string().optional(),
    conditions: z.string().optional(),
    medications: z.string().optional(),
    guardian: guardianSchema,
  }),
});

export const updateStudentSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: createStudentSchema.shape.body.partial().extend({
    status: z.nativeEnum(StudentStatus).optional(),
  }),
});

export const listStudentSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().optional(),
    status: z.nativeEnum(StudentStatus).optional(),
    classId: z.string().uuid().optional(),
  }),
});

export const idParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>['body'];
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>['body'];
export type ListStudentQuery = z.infer<typeof listStudentSchema>['query'];
