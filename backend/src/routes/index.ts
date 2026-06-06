import { Router } from 'express';
import authRoutes from '@/modules/auth/auth.routes';
import studentRoutes from '@/modules/student/student.routes';
import attendanceRoutes from '@/modules/attendance/attendance.routes';
import gradeRoutes from '@/modules/grade/grade.routes';
import feeRoutes from '@/modules/fee/fee.routes';
import dashboardRoutes from '@/modules/dashboard/dashboard.routes';
import classRoutes from '@/modules/class/class.routes';
import courseRoutes from '@/modules/course/course.routes';
import enrollmentRoutes from '@/modules/enrollment/enrollment.routes';
import examRoutes from '@/modules/exam/exam.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' }, timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/grades', gradeRoutes);
router.use('/fees', feeRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/classes', classRoutes);
router.use('/courses', courseRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/exams', examRoutes);

export default router;
