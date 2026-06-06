import { PaymentStatus } from '@prisma/client';
import { prisma } from '@/config/database';
import type {
  CreateFeeInput,
  CreateScholarshipInput,
  RecordPaymentInput,
} from './fee.validators';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const feeService = {
  createFee(input: CreateFeeInput) {
    return prisma.fee.create({ data: input });
  },

  listFees() {
    return prisma.fee.findMany({ where: { isActive: true }, orderBy: { dueDate: 'asc' } });
  },

  recordPayment(input: RecordPaymentInput) {
    return prisma.feePayment.create({
      data: {
        studentId: input.studentId,
        feeId: input.feeId,
        amountPaid: input.amountPaid,
        paymentMethod: input.paymentMethod,
        transactionId: input.transactionId,
        status: input.status ?? PaymentStatus.COMPLETED,
      },
    });
  },

  /** Highest active scholarship percentage for a student (0 if none). */
  async activeScholarshipPct(studentId: string): Promise<number> {
    const now = new Date();
    const scholarships = await prisma.scholarship.findMany({
      where: {
        studentId,
        startDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
    });
    return scholarships.reduce((max, s) => Math.max(max, s.percentage), 0);
  },

  /** Per-fee balance ledger for a student, with scholarship discount and overdue days. */
  async studentLedger(studentId: string) {
    const [fees, payments, scholarshipPct] = await Promise.all([
      prisma.fee.findMany({ where: { isActive: true } }),
      prisma.feePayment.findMany({ where: { studentId } }),
      this.activeScholarshipPct(studentId),
    ]);

    const now = new Date();
    const lines = fees.map((fee) => {
      const netDue = Math.round(fee.amount * (1 - scholarshipPct / 100) * 100) / 100;
      const paid = payments
        .filter((p) => p.feeId === fee.id && p.status !== PaymentStatus.FAILED)
        .reduce((sum, p) => sum + p.amountPaid, 0);
      const balance = Math.round((netDue - paid) * 100) / 100;
      const daysOverdue =
        balance > 0 && fee.dueDate < now
          ? Math.floor((now.getTime() - fee.dueDate.getTime()) / MS_PER_DAY)
          : 0;
      return {
        feeId: fee.id,
        feeType: fee.feeType,
        amount: fee.amount,
        scholarshipPct,
        netDue,
        paid,
        balance,
        dueDate: fee.dueDate,
        daysOverdue,
        isOverdue: daysOverdue > 0,
      };
    });

    const totalBalance = Math.round(lines.reduce((s, l) => s + Math.max(l.balance, 0), 0) * 100) / 100;
    return { studentId, scholarshipPct, totalBalance, lines };
  },

  /** All students with an outstanding balance on an overdue fee. */
  async overdue() {
    const students = await prisma.student.findMany({
      where: { deletedAt: null },
      select: { id: true, studentId: true, firstName: true, lastName: true },
    });
    const result = [];
    for (const s of students) {
      const ledger = await this.studentLedger(s.id);
      const overdueLines = ledger.lines.filter((l) => l.isOverdue);
      if (overdueLines.length > 0) {
        result.push({ student: s, totalOverdue: overdueLines.reduce((sum, l) => sum + l.balance, 0), lines: overdueLines });
      }
    }
    return result;
  },

  /** Financial summary: total income, revenue by fee type, monthly trend. */
  async financialReport() {
    const payments = await prisma.feePayment.findMany({
      where: { status: { not: PaymentStatus.FAILED } },
      include: { fee: { select: { feeType: true } } },
    });

    const totalIncome = Math.round(payments.reduce((s, p) => s + p.amountPaid, 0) * 100) / 100;

    const byFeeType: Record<string, number> = {};
    const monthly: Record<string, number> = {};
    payments.forEach((p) => {
      byFeeType[p.fee.feeType] = (byFeeType[p.fee.feeType] ?? 0) + p.amountPaid;
      const month = p.paymentDate.toISOString().slice(0, 7); // YYYY-MM
      monthly[month] = (monthly[month] ?? 0) + p.amountPaid;
    });

    return { totalIncome, paymentCount: payments.length, byFeeType, monthlyTrend: monthly };
  },

  createScholarship(input: CreateScholarshipInput) {
    return prisma.scholarship.create({ data: input });
  },
};
