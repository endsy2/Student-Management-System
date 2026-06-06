import { api } from './api';
import type {
  Fee,
  FeeFrequency,
  FeeType,
  FinancialReport,
  PaymentMethod,
  PaymentStatus,
  StudentLedger,
} from '@/types';

export const feeService = {
  async list(): Promise<Fee[]> {
    const { data } = await api.get('/fees');
    return data.data as Fee[];
  },

  async create(input: {
    feeType: FeeType;
    amount: number;
    frequency: FeeFrequency;
    dueDate: string;
    description?: string;
  }): Promise<Fee> {
    const { data } = await api.post('/fees', input);
    return data.data as Fee;
  },

  async ledger(studentId: string): Promise<StudentLedger> {
    const { data } = await api.get(`/fees/student/${studentId}`);
    return data.data as StudentLedger;
  },

  async recordPayment(input: {
    studentId: string;
    feeId: string;
    amountPaid: number;
    paymentMethod: PaymentMethod;
    transactionId?: string;
    status?: PaymentStatus;
  }): Promise<unknown> {
    const { data } = await api.post('/fees/payments', input);
    return data.data;
  },

  async financialReport(): Promise<FinancialReport> {
    const { data } = await api.get('/fees/reports/financial');
    return data.data as FinancialReport;
  },

  async createScholarship(input: {
    studentId: string;
    percentage: number;
    reason?: string;
    startDate: string;
    endDate?: string;
  }): Promise<unknown> {
    const { data } = await api.post('/fees/scholarships', input);
    return data.data;
  },
};
