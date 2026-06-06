import { Request, Response } from 'express';
import { catchAsyncError } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/response';
import { ApiError } from '@/utils/ApiError';
import { authService } from './auth.service';

export const authController = {
  register: catchAsyncError(async (req: Request, res: Response) => {
    const user = await authService.register(req.body);
    sendSuccess(res, user, 'Registration successful', 201);
  }),

  login: catchAsyncError(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    sendSuccess(res, result, 'Login successful');
  }),

  refresh: catchAsyncError(async (req: Request, res: Response) => {
    const tokens = await authService.refresh(req.body.refreshToken);
    sendSuccess(res, tokens, 'Token refreshed');
  }),

  logout: catchAsyncError(async (req: Request, res: Response) => {
    const token = req.headers.authorization!.slice(7);
    await authService.logout(req.user!.id, token);
    sendSuccess(res, null, 'Logged out');
  }),

  me: catchAsyncError(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    sendSuccess(res, req.user, 'Current user');
  }),
};
