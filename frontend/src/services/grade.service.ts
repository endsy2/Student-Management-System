import { api, tokenStore } from './api';
import type { AssessmentType, CourseAnalytics, Grade, StudentGrades } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export const gradeService = {
  async byStudent(studentId: string): Promise<StudentGrades> {
    const { data } = await api.get(`/grades/student/${studentId}`);
    return data.data as StudentGrades;
  },

  async courseAnalytics(courseId: string): Promise<CourseAnalytics> {
    const { data } = await api.get(`/grades/course/${courseId}`);
    return data.data as CourseAnalytics;
  },

  async create(input: {
    studentId: string;
    courseId: string;
    assessmentType: AssessmentType;
    score: number;
    maxScore: number;
    weight?: number;
  }): Promise<Grade> {
    const { data } = await api.post('/grades', input);
    return data.data as Grade;
  },

  /** Report card is a PDF stream; returns an authenticated URL for download. */
  reportCardUrl(studentId: string, comments?: string): string {
    const token = tokenStore.access ?? '';
    const q = new URLSearchParams({ token, ...(comments ? { comments } : {}) });
    return `${API_URL}/grades/student/${studentId}/report-card?${q.toString()}`;
  },

  async downloadReportCard(studentId: string, comments?: string): Promise<void> {
    const res = await api.get(`/grades/student/${studentId}/report-card`, {
      params: comments ? { comments } : {},
      responseType: 'blob',
    });
    const url = URL.createObjectURL(res.data as Blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-card-${studentId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  },
};
