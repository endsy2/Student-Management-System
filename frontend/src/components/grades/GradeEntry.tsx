'use client';

import { useState } from 'react';
import { gradeService } from '@/services/grade.service';
import { apiErrorMessage } from '@/services/api';
import { Card } from '@/components/common/Card';
import { Alert } from '@/components/common/Alert';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { StudentSelector } from '@/components/students/StudentSelector';
import { ASSESSMENT_TYPES } from '@/utils/constants';
import type { AssessmentType } from '@/types';

export function GradeEntry() {
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [assessmentType, setType] = useState<AssessmentType>('EXAM');
  const [score, setScore] = useState('');
  const [maxScore, setMaxScore] = useState('100');
  const [weight, setWeight] = useState('1');
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    setSaving(true);
    try {
      await gradeService.create({
        studentId,
        courseId,
        assessmentType,
        score: Number(score),
        maxScore: Number(maxScore),
        weight: Number(weight),
      });
      setOk('Grade recorded.');
      setScore('');
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card title="Record grade">
      <Alert variant="error">{error}</Alert>
      <Alert variant="success">{ok}</Alert>
      <StudentSelector value={studentId} onChange={(id) => setStudentId(id)} />
      <form onSubmit={submit} className="grid grid-cols-2 gap-3">
        <Input
          label="Course ID"
          placeholder="UUID of course"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
        />
        <Select
          label="Assessment"
          value={assessmentType}
          onChange={(e) => setType(e.target.value as AssessmentType)}
          options={ASSESSMENT_TYPES}
        />
        <Input label="Score" type="number" value={score} onChange={(e) => setScore(e.target.value)} required />
        <Input
          label="Max score"
          type="number"
          value={maxScore}
          onChange={(e) => setMaxScore(e.target.value)}
          required
        />
        <Input label="Weight" type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
        <div className="col-span-2">
          <Button type="submit" disabled={saving || !studentId}>
            {saving ? 'Saving…' : 'Record grade'}
          </Button>
        </div>
      </form>
      <p className="mt-3 text-xs text-gray-400">
        Course ID is entered manually — the backend has no Course listing endpoint yet.
      </p>
    </Card>
  );
}
