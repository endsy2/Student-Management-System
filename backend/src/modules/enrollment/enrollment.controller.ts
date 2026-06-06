import { Request, Response } from 'express';
import { catchAsyncError } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/response';
import { enrollmentService } from './enrollment.service';

export const enrollmentController = {
  create: catchAsyncError(async (req: Request, res: Response) => {
    sendSuccess(res, await enrollmentService.create(req.body), 'Student enrolled', 201);
  }),

  byClass: catchAsyncError(async (req: Request, res: Response) => {
    sendSuccess(res, await enrollmentService.byClass(req.params.classId), 'Class roster');
  }),

  byStudent: catchAsyncError(async (req: Request, res: Response) => {
    sendSuccess(res, await enrollmentService.byStudent(req.params.studentId), 'Student enrollments');
  }),
};
