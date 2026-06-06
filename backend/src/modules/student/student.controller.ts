import { Request, Response } from 'express';
import { catchAsyncError } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/response';
import { ApiError } from '@/utils/ApiError';
import { writeAuditLog } from '@/utils/audit.utils';
import { parseCsv } from '@/utils/csv.utils';
import { studentService } from './student.service';

export const studentController = {
  create: catchAsyncError(async (req: Request, res: Response) => {
    const student = await studentService.create(req.body);
    await writeAuditLog({
      userId: req.user?.id,
      action: 'CREATE',
      entity: 'Student',
      entityId: student.id,
    });
    sendSuccess(res, student, 'Student created successfully', 201);
  }),

  importCsv: catchAsyncError(async (req: Request, res: Response) => {
    if (!req.file) throw ApiError.badRequest('CSV file is required (field "file")', 'NO_FILE');
    const rows = parseCsv(req.file.buffer);
    const result = await studentService.bulkImport(rows);
    await writeAuditLog({
      userId: req.user?.id,
      action: 'IMPORT',
      entity: 'Student',
      details: { created: result.created, failed: result.failed },
    });
    sendSuccess(res, result, `Imported ${result.created} students (${result.failed} failed)`, 201);
  }),

  list: catchAsyncError(async (req: Request, res: Response) => {
    const result = await studentService.list(req.query as never);
    sendSuccess(res, result, 'Students retrieved');
  }),

  getById: catchAsyncError(async (req: Request, res: Response) => {
    const student = await studentService.getById(req.params.id);
    sendSuccess(res, student, 'Student retrieved');
  }),

  update: catchAsyncError(async (req: Request, res: Response) => {
    const student = await studentService.update(req.params.id, req.body);
    await writeAuditLog({
      userId: req.user?.id,
      action: 'UPDATE',
      entity: 'Student',
      entityId: student.id,
    });
    sendSuccess(res, student, 'Student updated');
  }),

  remove: catchAsyncError(async (req: Request, res: Response) => {
    await studentService.remove(req.params.id);
    await writeAuditLog({
      userId: req.user?.id,
      action: 'DELETE',
      entity: 'Student',
      entityId: req.params.id,
    });
    sendSuccess(res, null, 'Student deleted');
  }),
};
