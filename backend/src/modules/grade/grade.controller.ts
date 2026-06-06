import { Request, Response } from 'express';
import { catchAsyncError } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/response';
import { streamReportCard } from '@/utils/pdf.utils';
import { gradeService } from './grade.service';

export const gradeController = {
  create: catchAsyncError(async (req: Request, res: Response) => {
    const grade = await gradeService.create(req.body);
    sendSuccess(res, grade, 'Grade recorded', 201);
  }),

  bulkCreate: catchAsyncError(async (req: Request, res: Response) => {
    const grades = await gradeService.bulkCreate(req.body);
    sendSuccess(res, { count: grades.length, grades }, 'Grades recorded', 201);
  }),

  byStudent: catchAsyncError(async (req: Request, res: Response) => {
    const result = await gradeService.byStudent(req.params.studentId);
    sendSuccess(res, result, 'Student grades');
  }),

  courseAnalytics: catchAsyncError(async (req: Request, res: Response) => {
    const result = await gradeService.courseAnalytics(req.params.courseId);
    sendSuccess(res, result, 'Course performance analytics');
  }),

  reportCard: catchAsyncError(async (req: Request, res: Response) => {
    const comments = typeof req.query.comments === 'string' ? req.query.comments : undefined;
    const data = await gradeService.reportCardData(req.params.studentId, comments);
    streamReportCard(res, data);
  }),
};
