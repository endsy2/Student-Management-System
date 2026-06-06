import { prisma } from '@/config/database';
import type { CreateEnrollmentInput } from './enrollment.validators';

export const enrollmentService = {
  create(input: CreateEnrollmentInput) {
    return prisma.enrollment.create({ data: input });
  },

  /** Roster for a class. */
  byClass(classId: string) {
    return prisma.enrollment.findMany({
      where: { classId },
      include: {
        student: { select: { id: true, studentId: true, firstName: true, lastName: true, status: true } },
        course: { select: { code: true, name: true } },
      },
    });
  },

  byStudent(studentId: string) {
    return prisma.enrollment.findMany({
      where: { studentId },
      include: {
        class: { select: { name: true, gradeLevel: true, academicYear: true } },
        course: { select: { code: true, name: true } },
      },
    });
  },
};
