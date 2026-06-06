import { Request, Response } from 'express';
import { catchAsyncError } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/response';
import { classService } from './class.service';

export const classController = {
  create: catchAsyncError(async (req: Request, res: Response) => {
    const cls = await classService.create(req.body);
    sendSuccess(res, cls, 'Class created', 201);
  }),

  list: catchAsyncError(async (_req: Request, res: Response) => {
    sendSuccess(res, await classService.list(), 'Classes retrieved');
  }),

  getById: catchAsyncError(async (req: Request, res: Response) => {
    sendSuccess(res, await classService.getById(req.params.id), 'Class retrieved');
  }),
};
