import { Prisma } from '@prisma/client';
import { prisma } from '@/config/database';
import { redis } from '@/config/redis';
import { ApiError } from '@/utils/ApiError';
import type {
  CreateStudentInput,
  ListStudentQuery,
  UpdateStudentInput,
} from './student.validators';

const CACHE_PREFIX = 'student:';
const CACHE_TTL_SECONDS = 60 * 60; // 1 hour

/** Generates the next human-facing student id, e.g. STU-00001. */
async function generateStudentId(): Promise<string> {
  const count = await prisma.student.count();
  return `STU-${String(count + 1).padStart(5, '0')}`;
}

export const studentService = {
  async create(input: CreateStudentInput) {
    const { guardian, ...student } = input;
    const studentId = await generateStudentId();

    return prisma.student.create({
      data: {
        ...student,
        studentId,
        guardian: guardian ? { create: guardian } : undefined,
      },
      include: { guardian: true },
    });
  },

  /** Bulk-create students from parsed CSV rows. Returns a per-row result summary. */
  async bulkImport(rows: Record<string, string>[]) {
    const results = { created: 0, failed: 0, errors: [] as { row: number; error: string }[] };

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      try {
        if (!r.firstName || !r.lastName || !r.dateOfBirth || !r.gender) {
          throw new Error('Missing required column (firstName, lastName, dateOfBirth, gender)');
        }
        await this.create({
          firstName: r.firstName,
          lastName: r.lastName,
          dateOfBirth: new Date(r.dateOfBirth),
          gender: r.gender,
          email: r.email || undefined,
          phone: r.phone || undefined,
          address: r.address || undefined,
        });
        results.created++;
      } catch (err) {
        results.failed++;
        results.errors.push({ row: i + 2, error: (err as Error).message }); // +2: header + 1-indexed
      }
    }

    return results;
  },

  async list(query: ListStudentQuery) {
    const { page, limit, search, status, classId } = query;

    const where: Prisma.StudentWhereInput = {
      deletedAt: null,
      ...(status ? { status } : {}),
      ...(classId ? { enrollments: { some: { classId } } } : {}),
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { studentId: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.student.findMany({
        where,
        include: { guardian: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.student.count({ where }),
    ]);

    return {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getById(id: string) {
    const cached = await redis.get(`${CACHE_PREFIX}${id}`);
    if (cached) return JSON.parse(cached);

    const student = await prisma.student.findFirst({
      where: { id, deletedAt: null },
      include: { guardian: true },
    });
    if (!student) throw ApiError.notFound('Student not found', 'STUDENT_NOT_FOUND');

    await redis.set(`${CACHE_PREFIX}${id}`, JSON.stringify(student), 'EX', CACHE_TTL_SECONDS);
    return student;
  },

  async update(id: string, input: UpdateStudentInput) {
    await this.getById(id); // ensures existence
    const { guardian, ...rest } = input;

    const student = await prisma.student.update({
      where: { id },
      data: {
        ...rest,
        guardian: guardian ? { create: guardian } : undefined,
      },
      include: { guardian: true },
    });

    await redis.del(`${CACHE_PREFIX}${id}`);
    return student;
  },

  /** Soft delete — preserves history per spec. */
  async remove(id: string) {
    await this.getById(id);
    await prisma.student.update({ where: { id }, data: { deletedAt: new Date() } });
    await redis.del(`${CACHE_PREFIX}${id}`);
  },
};
