import { api } from './api';
import type { AttendanceAnalytics, AttendanceRecord, AttendanceStatus, Paginated } from '@/types';

export const attendanceService = {
  async byClassDate(classId: string, date: string): Promise<AttendanceRecord[]> {
    const { data } = await api.get(`/attendance/class/${classId}/date/${date}`);
    return data.data as AttendanceRecord[];
  },

  async history(params: {
    studentId?: string;
    classId?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }): Promise<Paginated<AttendanceRecord>> {
    const { data } = await api.get('/attendance/history', { params });
    return data.data as Paginated<AttendanceRecord>;
  },

  async analytics(params: {
    studentId?: string;
    classId?: string;
    from?: string;
    to?: string;
  }): Promise<AttendanceAnalytics> {
    const { data } = await api.get('/attendance/analytics', { params });
    return data.data as AttendanceAnalytics;
  },

  async mark(input: {
    studentId: string;
    classId: string;
    date: string;
    status: AttendanceStatus;
    notes?: string;
  }): Promise<AttendanceRecord> {
    const { data } = await api.post('/attendance', input);
    return data.data as AttendanceRecord;
  },

  async bulkMark(input: {
    classId: string;
    date: string;
    records: { studentId: string; status: AttendanceStatus; notes?: string }[];
  }): Promise<{ count: number }> {
    const { data } = await api.post('/attendance/bulk', input);
    return data.data as { count: number };
  },
};
