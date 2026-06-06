'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { StudentSelector } from './StudentSelector';

/**
 * Renders a student picker, then the given view for the selected student.
 * The selection persists in localStorage under `storageKey`.
 */
export function StudentScopedView({
  storageKey,
  children,
}: {
  storageKey: string;
  children: (studentId: string) => React.ReactNode;
}) {
  const [studentId, setStudentId] = useLocalStorage(storageKey);

  return (
    <div>
      <StudentSelector value={studentId} onChange={(id) => setStudentId(id)} />
      {children(studentId)}
    </div>
  );
}
