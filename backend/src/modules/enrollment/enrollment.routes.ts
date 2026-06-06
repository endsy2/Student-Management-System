import { Router } from 'express';
import { Role } from '@prisma/client';
import { enrollmentController } from './enrollment.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/rbac.middleware';
import { validate } from '@/middleware/validate.middleware';
import {
  classParamSchema,
  createEnrollmentSchema,
  studentParamSchema,
} from './enrollment.validators';

const router = Router();
router.use(authenticate);

router.get('/class/:classId', validate(classParamSchema), enrollmentController.byClass);
router.get('/student/:studentId', validate(studentParamSchema), enrollmentController.byStudent);
router.post(
  '/',
  requireRole(Role.ADMIN, Role.TEACHER),
  validate(createEnrollmentSchema),
  enrollmentController.create,
);

export default router;
