import { Request, Response } from 'express';
import { catchAsyncError } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/response';
import { feeService } from './fee.service';

export const feeController = {
  createFee: catchAsyncError(async (req: Request, res: Response) => {
    const fee = await feeService.createFee(req.body);
    sendSuccess(res, fee, 'Fee created', 201);
  }),

  listFees: catchAsyncError(async (_req: Request, res: Response) => {
    const fees = await feeService.listFees();
    sendSuccess(res, fees, 'Fees retrieved');
  }),

  recordPayment: catchAsyncError(async (req: Request, res: Response) => {
    const payment = await feeService.recordPayment(req.body);
    sendSuccess(res, payment, 'Payment recorded', 201);
  }),

  studentLedger: catchAsyncError(async (req: Request, res: Response) => {
    const ledger = await feeService.studentLedger(req.params.studentId);
    sendSuccess(res, ledger, 'Student fee ledger');
  }),

  overdue: catchAsyncError(async (_req: Request, res: Response) => {
    const result = await feeService.overdue();
    sendSuccess(res, result, 'Overdue payments');
  }),

  financialReport: catchAsyncError(async (_req: Request, res: Response) => {
    const report = await feeService.financialReport();
    sendSuccess(res, report, 'Financial report');
  }),

  createScholarship: catchAsyncError(async (req: Request, res: Response) => {
    const scholarship = await feeService.createScholarship(req.body);
    sendSuccess(res, scholarship, 'Scholarship created', 201);
  }),
};
