import { z } from 'zod';
import { FeeFrequency, FeeType, PaymentMethod, PaymentStatus } from '@prisma/client';

export const createFeeSchema = z.object({
  body: z.object({
    feeType: z.nativeEnum(FeeType),
    amount: z.number().positive(),
    frequency: z.nativeEnum(FeeFrequency),
    dueDate: z.coerce.date(),
    description: z.string().optional(),
  }),
});

export const recordPaymentSchema = z.object({
  body: z.object({
    studentId: z.string().uuid(),
    feeId: z.string().uuid(),
    amountPaid: z.number().positive(),
    paymentMethod: z.nativeEnum(PaymentMethod),
    transactionId: z.string().optional(),
    status: z.nativeEnum(PaymentStatus).optional(),
  }),
});

export const createScholarshipSchema = z.object({
  body: z.object({
    studentId: z.string().uuid(),
    percentage: z.number().min(0).max(100),
    reason: z.string().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
  }),
});

export const studentParamSchema = z.object({
  params: z.object({ studentId: z.string().uuid() }),
});

export type CreateFeeInput = z.infer<typeof createFeeSchema>['body'];
export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>['body'];
export type CreateScholarshipInput = z.infer<typeof createScholarshipSchema>['body'];
