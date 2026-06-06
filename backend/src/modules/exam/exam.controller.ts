import { Request, Response } from 'express';
import { catchAsyncError } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/response';
import { examService } from './exam.service';

export const examController = {
  create: catchAsyncError(async (req: Request, res: Response) => {
    sendSuccess(res, await examService.create(req.body), 'Exam scheduled', 201);
  }),

  list: catchAsyncError(async (_req: Request, res: Response) => {
    sendSuccess(res, await examService.list(), 'Exams retrieved');
  }),

  byCourse: catchAsyncError(async (req: Request, res: Response) => {
    sendSuccess(res, await examService.byCourse(req.params.courseId), 'Course exams');
  }),
};
