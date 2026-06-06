import { Router } from 'express';
import { Role } from '@prisma/client';
import { courseController } from './course.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/rbac.middleware';
import { validate } from '@/middleware/validate.middleware';
import { createCourseSchema, idParamSchema } from './course.validators';

const router = Router();
router.use(authenticate);

router.get('/', courseController.list);
router.get('/:id', validate(idParamSchema), courseController.getById);
router.post('/', requireRole(Role.ADMIN), validate(createCourseSchema), courseController.create);

export default router;
