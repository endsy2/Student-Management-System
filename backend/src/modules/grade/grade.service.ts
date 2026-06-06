import { prisma } from '@/config/database';
import { ApiError } from '@/utils/ApiError';
import { toLetterGrade, weightedAverage } from '@/utils/grade.utils';
import type { BulkGradeInput, CreateGradeInput } from './grade.validators';

export const gradeService = {
  async create(input: CreateGradeInput) {
    const percentage = (input.score / input.maxScore) * 100;
    return prisma.grade.create({
      data: {
        studentId: input.studentId,
        courseId: input.courseId,
        assessmentType: input.assessmentType,
        score: input.score,
        maxScore: input.maxScore,
        weight: input.weight,
        submittedDate: input.submittedDate ?? new Date(),
        letterGrade: toLetterGrade(percentage),
      },
    });
  },

  async bulkCreate(input: BulkGradeInput) {
    return prisma.$transaction(
      input.entries.map((e) =>
        prisma.grade.create({
          data: {
            studentId: e.studentId,
            courseId: input.courseId,
            assessmentType: input.assessmentType,
            score: e.score,
            maxScore: input.maxScore,
            weight: input.weight,
            letterGrade: toLetterGrade((e.score / input.maxScore) * 100),
          },
        }),
      ),
    );
  },

  async byStudent(studentId: string) {
    const grades = await prisma.grade.findMany({
      where: { studentId },
      include: { course: { select: { code: true, name: true } } },
      orderBy: { submittedDate: 'desc' },
    });
    const overall = weightedAverage(grades);
    return { grades, overallPercentage: overall, overallGrade: toLetterGrade(overall) };
  },

  /** Class/course performance: average, median, pass rate, distribution, at-risk & top students. */
  async courseAnalytics(courseId: string) {
    const grades = await prisma.grade.findMany({
      where: { courseId },
      include: { student: { select: { id: true, studentId: true, firstName: true, lastName: true } } },
    });

    if (grades.length === 0) {
      return { count: 0, average: 0, median: 0, passRate: 0, distribution: {}, atRisk: [], topPerformers: [] };
    }

    const percentages = grades.map((g) => (g.score / g.maxScore) * 100);
    const sorted = [...percentages].sort((a, b) => a - b);
    const average = Math.round((percentages.reduce((a, b) => a + b, 0) / percentages.length) * 100) / 100;
    const mid = Math.floor(sorted.length / 2);
    const median =
      sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    const passRate = Math.round((percentages.filter((p) => p >= 60).length / percentages.length) * 100);

    const distribution: Record<string, number> = {};
    percentages.forEach((p) => {
      const letter = toLetterGrade(p);
      distribution[letter] = (distribution[letter] ?? 0) + 1;
    });

    const atRisk = grades
      .filter((g) => (g.score / g.maxScore) * 100 < 60)
      .map((g) => g.student);
    const topPerformers = grades
      .filter((g) => (g.score / g.maxScore) * 100 > 90)
      .map((g) => g.student);

    return { count: grades.length, average, median, passRate, distribution, atRisk, topPerformers };
  },

  async reportCardData(studentId: string, comments?: string) {
    const student = await prisma.student.findFirst({
      where: { id: studentId, deletedAt: null },
      select: { studentId: true, firstName: true, lastName: true },
    });
    if (!student) throw ApiError.notFound('Student not found', 'STUDENT_NOT_FOUND');

    const grades = await prisma.grade.findMany({
      where: { studentId },
      include: { course: { select: { name: true } } },
      orderBy: { submittedDate: 'desc' },
    });

    const overall = weightedAverage(grades);
    return {
      student,
      generatedAt: new Date(),
      overallPercentage: overall,
      overallGrade: toLetterGrade(overall),
      comments,
      rows: grades.map((g) => {
        const percentage = Math.round((g.score / g.maxScore) * 10000) / 100;
        return {
          course: g.course.name,
          assessmentType: g.assessmentType,
          score: g.score,
          maxScore: g.maxScore,
          percentage,
          letterGrade: g.letterGrade ?? toLetterGrade(percentage),
        };
      }),
    };
  },
};
