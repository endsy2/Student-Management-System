import { prisma } from '@/config/database';
import { ApiError } from '@/utils/ApiError';
import type { CreateCourseInput } from './course.validators';

export const courseService = {
  create(input: CreateCourseInput) {
    return prisma.course.create({ data: input });
  },

  list() {
    return prisma.course.findMany({
      orderBy: { code: 'asc' },
      include: { teacher: { select: { firstName: true, lastName: true } } },
    });
  },

  async getById(id: string) {
    const course = await prisma.course.findUnique({
      where: { id },
      include: { teacher: { select: { firstName: true, lastName: true } }, exams: true },
    });
    if (!course) throw ApiError.notFound('Course not found', 'COURSE_NOT_FOUND');
    return course;
  },
};
