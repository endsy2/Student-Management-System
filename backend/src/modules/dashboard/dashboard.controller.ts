import { Request, Response } from 'express';
import { catchAsyncError } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/response';
import { dashboardService } from './dashboard.service';

export const dashboardController = {
  overview: catchAsyncError(async (_req: Request, res: Response) => {
    const data = await dashboardService.overview();
    sendSuccess(res, data, 'Dashboard overview');
  }),

  analytics: catchAsyncError(async (_req: Request, res: Response) => {
    const data = await dashboardService.analytics();
    sendSuccess(res, data, 'Dashboard analytics');
  }),

  recentActivity: catchAsyncError(async (_req: Request, res: Response) => {
    const data = await dashboardService.recentActivity();
    sendSuccess(res, data, 'Recent activity');
  }),
};
