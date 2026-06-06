import { Router } from 'express';
import { Role } from '@prisma/client';
import { examController } from './exam.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/rbac.middleware';
import { validate } from '@/middleware/validate.middleware';
import { courseParamSchema, createExamSchema } from './exam.validators';

const router = Router();
router.use(authenticate);

router.get('/', examController.list);
router.get('/course/:courseId', validate(courseParamSchema), examController.byCourse);
router.post(
  '/',
  requireRole(Role.ADMIN, Role.TEACHER),
  validate(createExamSchema),
  examController.create,
);

export default router;
