'use client';

import { useEffect, useState } from 'react';
import { studentService } from '@/services/student.service';
import { apiErrorMessage } from '@/services/api';
import { Input } from '@/components/common/Input';
import type { Student } from '@/types';

/**
 * Lets any role search and pick a student to view. Stand-in until student/parent
 * accounts are linked to a Student record in the backend.
 */
export function StudentSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string, student: Student) => void;
}) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      studentService
        .list({ search, limit: 8 })
        .then((r) => setResults(r.items))
        .catch((e) => setError(apiErrorMessage(e)));
    }, 250);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
      <Input
        label="Find student"
        placeholder="Search by name or student ID…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-2 flex flex-wrap gap-2">
        {results.map((s) => (
          <button
            key={s.id}
            onClick={() => onChange(s.id, s)}
            className={`rounded-full border px-3 py-1 text-xs ${
              value === s.id ? 'border-brand bg-brand text-white' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {s.firstName} {s.lastName} · {s.studentId}
          </button>
        ))}
        {results.length === 0 && <span className="text-xs text-gray-400">No matches</span>}
      </div>
    </div>
  );
}
