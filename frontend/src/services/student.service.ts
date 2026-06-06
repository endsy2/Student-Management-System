import { api } from './api';
import type { Paginated, Student } from '@/types';

export interface StudentListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface StudentInput {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email?: string;
  phone?: string;
  address?: string;
  guardian?: {
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
  };
}

export const studentService = {
  async list(params: StudentListParams = {}): Promise<Paginated<Student>> {
    const { data } = await api.get('/students', { params });
    return data.data as Paginated<Student>;
  },

  async get(id: string): Promise<Student> {
    const { data } = await api.get(`/students/${id}`);
    return data.data as Student;
  },

  async create(input: StudentInput): Promise<Student> {
    const { data } = await api.post('/students', input);
    return data.data as Student;
  },

  async update(id: string, input: Partial<StudentInput> & { status?: string }): Promise<Student> {
    const { data } = await api.patch(`/students/${id}`, input);
    return data.data as Student;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/students/${id}`);
  },

  async importCsv(file: File): Promise<{ created: number; failed: number; errors: { row: number; error: string }[] }> {
    const fd = new FormData();
    fd.append('file', file);
    const { data } = await api.post('/students/import', fd);
    return data.data;
  },
};
