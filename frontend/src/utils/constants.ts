import type { AssessmentType, AttendanceStatus, FeeType, PaymentMethod } from '@/types';

export const ATTENDANCE_STATUSES: { value: AttendanceStatus; label: string }[] = [
  { value: 'PRESENT', label: 'Present' },
  { value: 'ABSENT', label: 'Absent' },
  { value: 'LATE', label: 'Late' },
  { value: 'EXCUSED', label: 'Excused' },
];

export const ASSESSMENT_TYPES: { value: AssessmentType; label: string }[] = [
  { value: 'ASSIGNMENT', label: 'Assignment' },
  { value: 'QUIZ', label: 'Quiz' },
  { value: 'PROJECT', label: 'Project' },
  { value: 'EXAM', label: 'Exam' },
  { value: 'MIDTERM', label: 'Midterm' },
  { value: 'FINAL', label: 'Final' },
];

export const FEE_TYPES: { value: FeeType; label: string }[] = [
  { value: 'TUITION', label: 'Tuition' },
  { value: 'ADMISSION', label: 'Admission' },
  { value: 'EXAM', label: 'Exam' },
  { value: 'TRANSPORT', label: 'Transport' },
  { value: 'LIBRARY', label: 'Library' },
];

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'CASH', label: 'Cash' },
  { value: 'ONLINE', label: 'Online' },
  { value: 'BANK', label: 'Bank' },
];
