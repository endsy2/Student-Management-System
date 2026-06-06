import { Router } from 'express';
import { Role } from '@prisma/client';
import { attendanceController } from './attendance.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/rbac.middleware';
import { validate } from '@/middleware/validate.middleware';
import {
  bulkMarkSchema,
  classDateParamsSchema,
  historyQuerySchema,
  markAttendanceSchema,
  staffAttendanceSchema,
} from './attendance.validators';

const router = Router();

router.use(authenticate);

router.get('/history', validate(historyQuerySchema), attendanceController.history);
router.get('/analytics', attendanceController.analytics);
router.get(
  '/class/:classId/date/:date',
  validate(classDateParamsSchema),
  attendanceController.byClassAndDate,
);

router.post(
  '/',
  requireRole(Role.ADMIN, Role.TEACHER),
  validate(markAttendanceSchema),
  attendanceController.mark,
);
router.post(
  '/bulk',
  requireRole(Role.ADMIN, Role.TEACHER),
  validate(bulkMarkSchema),
  attendanceController.bulkMark,
);
router.post(
  '/staff',
  requireRole(Role.ADMIN),
  validate(staffAttendanceSchema),
  attendanceController.markStaff,
);

export default router;
