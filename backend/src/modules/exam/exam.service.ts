import { prisma } from '@/config/database';
import type { CreateExamInput } from './exam.validators';

export const examService = {
  create(input: CreateExamInput) {
    return prisma.exam.create({ data: input });
  },

  list() {
    return prisma.exam.findMany({
      orderBy: { date: 'asc' },
      include: { course: { select: { code: true, name: true } } },
    });
  },

  byCourse(courseId: string) {
    return prisma.exam.findMany({ where: { courseId }, orderBy: { date: 'asc' } });
  },
};
