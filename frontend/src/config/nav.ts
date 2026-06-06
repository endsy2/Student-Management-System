import type { Role } from '@/types';

export interface NavItem {
  label: string;
  href: string;
}

export const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  ADMIN: [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Students', href: '/admin/students' },
    { label: 'Attendance', href: '/admin/attendance' },
    { label: 'Grades', href: '/admin/grades' },
    { label: 'Fees', href: '/admin/fees' },
    { label: 'Settings', href: '/admin/settings' },
  ],
  TEACHER: [
    { label: 'Dashboard', href: '/teacher' },
    { label: 'My Classes', href: '/teacher/my-classes' },
    { label: 'Attendance', href: '/teacher/attendance' },
    { label: 'Grades', href: '/teacher/grades' },
  ],
  STUDENT: [
    { label: 'Dashboard', href: '/student' },
    { label: 'My Schedule', href: '/student/my-schedule' },
    { label: 'My Grades', href: '/student/my-grades' },
    { label: 'Attendance', href: '/student/attendance' },
    { label: 'Fees', href: '/student/fees' },
  ],
  PARENT: [
    { label: 'Dashboard', href: '/parent' },
    { label: 'Child Profile', href: '/parent/child-profile' },
    { label: 'Child Grades', href: '/parent/child-grades' },
    { label: 'Child Attendance', href: '/parent/child-attendance' },
    { label: 'Child Fees', href: '/parent/child-fees' },
  ],
};

export const HOME_BY_ROLE: Record<Role, string> = {
  ADMIN: '/admin',
  TEACHER: '/teacher',
  STUDENT: '/student',
  PARENT: '/parent',
};
