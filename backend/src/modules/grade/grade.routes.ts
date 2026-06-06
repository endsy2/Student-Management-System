import { Router } from 'express';
import { Role } from '@prisma/client';
import { gradeController } from './grade.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/rbac.middleware';
import { validate } from '@/middleware/validate.middleware';
import {
  bulkGradeSchema,
  courseParamSchema,
  createGradeSchema,
  studentParamSchema,
} from './grade.validators';

const router = Router();

router.use(authenticate);

router.get('/student/:studentId', validate(studentParamSchema), gradeController.byStudent);
router.get('/student/:studentId/report-card', validate(studentParamSchema), gradeController.reportCard);
router.get('/course/:courseId', validate(courseParamSchema), gradeController.courseAnalytics);

router.post('/', requireRole(Role.ADMIN, Role.TEACHER), validate(createGradeSchema), gradeController.create);
router.post('/bulk', requireRole(Role.ADMIN, Role.TEACHER), validate(bulkGradeSchema), gradeController.bulkCreate);

export default router;
