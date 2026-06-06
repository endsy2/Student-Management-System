import { Router } from 'express';
import { Role } from '@prisma/client';
import { classController } from './class.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/rbac.middleware';
import { validate } from '@/middleware/validate.middleware';
import { createClassSchema, idParamSchema } from './class.validators';

const router = Router();
router.use(authenticate);

router.get('/', classController.list);
router.get('/:id', validate(idParamSchema), classController.getById);
router.post('/', requireRole(Role.ADMIN), validate(createClassSchema), classController.create);

export default router;
