import { Request, Response } from 'express';
import { catchAsyncError } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/response';
import { courseService } from './course.service';

export const courseController = {
  create: catchAsyncError(async (req: Request, res: Response) => {
    sendSuccess(res, await courseService.create(req.body), 'Course created', 201);
  }),

  list: catchAsyncError(async (_req: Request, res: Response) => {
    sendSuccess(res, await courseService.list(), 'Courses retrieved');
  }),

  getById: catchAsyncError(async (req: Request, res: Response) => {
    sendSuccess(res, await courseService.getById(req.params.id), 'Course retrieved');
  }),
};
