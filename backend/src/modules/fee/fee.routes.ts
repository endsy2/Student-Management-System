import { Router } from 'express';
import { Role } from '@prisma/client';
import { feeController } from './fee.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/rbac.middleware';
import { validate } from '@/middleware/validate.middleware';
import {
  createFeeSchema,
  createScholarshipSchema,
  recordPaymentSchema,
  studentParamSchema,
} from './fee.validators';

const router = Router();

router.use(authenticate);

router.get('/', feeController.listFees);
router.get('/reports/financial', requireRole(Role.ADMIN), feeController.financialReport);
router.get('/payments/overdue', requireRole(Role.ADMIN, Role.TEACHER), feeController.overdue);
router.get('/student/:studentId', validate(studentParamSchema), feeController.studentLedger);

router.post('/', requireRole(Role.ADMIN), validate(createFeeSchema), feeController.createFee);
router.post(
  '/payments',
  requireRole(Role.ADMIN),
  validate(recordPaymentSchema),
  feeController.recordPayment,
);
router.post(
  '/scholarships',
  requireRole(Role.ADMIN),
  validate(createScholarshipSchema),
  feeController.createScholarship,
);

export default router;
