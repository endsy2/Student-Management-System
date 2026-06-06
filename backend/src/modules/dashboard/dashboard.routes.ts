import { Router } from 'express';
import { Role } from '@prisma/client';
import { dashboardController } from './dashboard.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/rbac.middleware';

const router = Router();

router.use(authenticate, requireRole(Role.ADMIN, Role.TEACHER));

router.get('/overview', dashboardController.overview);
router.get('/analytics', dashboardController.analytics);
router.get('/recent-activity', dashboardController.recentActivity);

export default router;
