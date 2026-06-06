export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export interface User {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
}

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export type StudentStatus = 'ACTIVE' | 'GRADUATED' | 'SUSPENDED' | 'TRANSFERRED';

export interface Guardian {
  firstName: string;
  lastName: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth?: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  status: StudentStatus;
  guardian?: Guardian | null;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  notes?: string | null;
  student?: Pick<Student, 'id' | 'studentId' | 'firstName' | 'lastName'>;
}

export interface AttendanceAnalytics {
  total: number;
  counts: Record<AttendanceStatus, number>;
  attendanceRate: number;
}

export type AssessmentType = 'ASSIGNMENT' | 'QUIZ' | 'PROJECT' | 'EXAM' | 'MIDTERM' | 'FINAL';

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  assessmentType: AssessmentType;
  score: number;
  maxScore: number;
  weight: number;
  letterGrade?: string | null;
  submittedDate: string;
  course?: { code?: string; name?: string };
}

export interface StudentGrades {
  grades: Grade[];
  overallPercentage: number;
  overallGrade: string;
}

export interface CourseAnalytics {
  count: number;
  average: number;
  median: number;
  passRate: number;
  distribution: Record<string, number>;
  atRisk: Pick<Student, 'id' | 'studentId' | 'firstName' | 'lastName'>[];
  topPerformers: Pick<Student, 'id' | 'studentId' | 'firstName' | 'lastName'>[];
}

export type FeeType = 'TUITION' | 'ADMISSION' | 'EXAM' | 'TRANSPORT' | 'LIBRARY';
export type FeeFrequency = 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
export type PaymentMethod = 'CASH' | 'ONLINE' | 'BANK';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'PARTIAL';

export interface Fee {
  id: string;
  feeType: FeeType;
  amount: number;
  frequency: FeeFrequency;
  dueDate: string;
  description?: string | null;
  isActive: boolean;
}

export interface LedgerLine {
  feeId: string;
  feeType: FeeType;
  amount: number;
  scholarshipPct: number;
  netDue: number;
  paid: number;
  balance: number;
  dueDate: string;
  daysOverdue: number;
  isOverdue: boolean;
}

export interface StudentLedger {
  studentId: string;
  scholarshipPct: number;
  totalBalance: number;
  lines: LedgerLine[];
}

export interface FinancialReport {
  totalIncome: number;
  paymentCount: number;
  byFeeType: Record<string, number>;
  monthlyTrend: Record<string, number>;
}

export interface DashboardOverview {
  totalStudents: number;
  totalTeachers: number;
  todayAttendanceRate: number;
  totalRevenue: number;
  overdueStudents: number;
  overdueAmount: number;
}

export interface DashboardAnalytics {
  studentsByGender: { gender: string; count: number }[];
  studentsByStatus: { status: string; count: number }[];
  feeCollectionByType: Record<string, number>;
  monthlyRevenue: Record<string, number>;
  attendanceTrend: { date: string; rate: number }[];
}

export interface ActivityEntry {
  id: string;
  action: string;
  entity: string;
  entityId?: string | null;
  timestamp: string;
  user?: { firstName: string; lastName: string; role: Role } | null;
}
