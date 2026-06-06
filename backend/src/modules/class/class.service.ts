import { prisma } from '@/config/database';
import { ApiError } from '@/utils/ApiError';
import type { CreateClassInput } from './class.validators';

export const classService = {
  create(input: CreateClassInput) {
    return prisma.class.create({ data: input });
  },

  list() {
    return prisma.class.findMany({
      orderBy: { createdAt: 'desc' },
      include: { teacher: { select: { firstName: true, lastName: true } }, _count: { select: { enrollments: true } } },
    });
  },

  async getById(id: string) {
    const cls = await prisma.class.findUnique({
      where: { id },
      include: {
        teacher: { select: { firstName: true, lastName: true } },
        enrollments: {
          include: {
            student: { select: { id: true, studentId: true, firstName: true, lastName: true } },
          },
        },
      },
    });
    if (!cls) throw ApiError.notFound('Class not found', 'CLASS_NOT_FOUND');
    return cls;
  },
};
