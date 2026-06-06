import { Router } from 'express';
import { Role } from '@prisma/client';
import { studentController } from './student.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/rbac.middleware';
import { validate } from '@/middleware/validate.middleware';
import { uploadCsv } from '@/middleware/upload.middleware';
import {
  createStudentSchema,
  idParamSchema,
  listStudentSchema,
  updateStudentSchema,
} from './student.validators';

const router = Router();

router.use(authenticate);

router.get('/', validate(listStudentSchema), studentController.list);
router.get('/:id', validate(idParamSchema), studentController.getById);

router.post('/import', requireRole(Role.ADMIN), uploadCsv, studentController.importCsv);
router.post(
  '/',
  requireRole(Role.ADMIN, Role.TEACHER),
  validate(createStudentSchema),
  studentController.create,
);
router.patch(
  '/:id',
  requireRole(Role.ADMIN, Role.TEACHER),
  validate(updateStudentSchema),
  studentController.update,
);
router.delete('/:id', requireRole(Role.ADMIN), validate(idParamSchema), studentController.remove);

export default router;
