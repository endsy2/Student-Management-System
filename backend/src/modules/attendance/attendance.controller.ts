import { Request, Response } from 'express';
import { catchAsyncError } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/response';
import { attendanceService } from './attendance.service';

export const attendanceController = {
  mark: catchAsyncError(async (req: Request, res: Response) => {
    const record = await attendanceService.mark(req.body, req.user?.id);
    sendSuccess(res, record, 'Attendance marked', 201);
  }),

  bulkMark: catchAsyncError(async (req: Request, res: Response) => {
    const records = await attendanceService.bulkMark(req.body, req.user?.id);
    sendSuccess(res, { count: records.length, records }, 'Attendance marked', 201);
  }),

  byClassAndDate: catchAsyncError(async (req: Request, res: Response) => {
    const records = await attendanceService.getByClassAndDate(
      req.params.classId,
      new Date(req.params.date),
    );
    sendSuccess(res, records, 'Attendance retrieved');
  }),

  history: catchAsyncError(async (req: Request, res: Response) => {
    const result = await attendanceService.history(req.query as never);
    sendSuccess(res, result, 'Attendance history');
  }),

  analytics: catchAsyncError(async (req: Request, res: Response) => {
    const { studentId, classId, from, to } = req.query as Record<string, string | undefined>;
    const result = await attendanceService.analytics({
      studentId,
      classId,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
    sendSuccess(res, result, 'Attendance analytics');
  }),

  markStaff: catchAsyncError(async (req: Request, res: Response) => {
    const record = await attendanceService.markStaff(req.body);
    sendSuccess(res, record, 'Staff attendance marked', 201);
  }),
};
