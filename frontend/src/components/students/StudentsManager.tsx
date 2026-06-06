'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { studentService, StudentInput } from '@/services/student.service';
import { apiErrorMessage } from '@/services/api';
import { Card } from '@/components/common/Card';
import { Alert } from '@/components/common/Alert';
import { Table } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Modal } from '@/components/common/Modal';
import type { Student } from '@/types';

const EMPTY: StudentInput = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: 'male',
  email: '',
  phone: '',
};

export function StudentsManager({ canEdit }: { canEdit: boolean }) {
  const [rows, setRows] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<StudentInput>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setNotice(null);
    try {
      const result = await studentService.importCsv(file);
      setNotice(`Imported ${result.created} students (${result.failed} failed).`);
      load();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  const load = useCallback(() => {
    setLoading(true);
    studentService
      .list({ search, page, limit: 10 })
      .then((r) => {
        setRows(r.items);
        setTotalPages(r.pagination.totalPages);
      })
      .catch((e) => setError(apiErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(load, [load]);

  function openCreate() {
    setEditId(null);
    setForm(EMPTY);
    setOpen(true);
  }

  function openEdit(s: Student) {
    setEditId(s.id);
    setForm({
      firstName: s.firstName,
      lastName: s.lastName,
      dateOfBirth: s.dateOfBirth?.slice(0, 10) ?? '',
      gender: s.gender,
      email: s.email ?? '',
      phone: s.phone ?? '',
    });
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editId) await studentService.update(editId, form);
      else await studentService.create(form);
      setOpen(false);
      load();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function remove(s: Student) {
    if (!confirm(`Delete ${s.firstName} ${s.lastName}?`)) return;
    try {
      await studentService.remove(s.id);
      load();
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  return (
    <div className="space-y-4">
      <Alert variant="error">{error}</Alert>
      {notice && <Alert variant="success">{notice}</Alert>}
      <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={onImportFile} />
      <Card
        title="Students"
        actions={
          canEdit ? (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => fileRef.current?.click()}>
                Import CSV
              </Button>
              <Button onClick={openCreate}>Add student</Button>
            </div>
          ) : undefined
        }
      >
        <div className="mb-3 max-w-xs">
          <Input
            placeholder="Search…"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
        <Table<Student>
          rowKey={(s) => s.id}
          loading={loading}
          rows={rows}
          empty="No students."
          columns={[
            { header: 'Student ID', cell: (s) => <span className="font-mono text-xs">{s.studentId}</span> },
            { header: 'Name', cell: (s) => `${s.firstName} ${s.lastName}` },
            { header: 'Gender', cell: (s) => s.gender },
            { header: 'Status', cell: (s) => s.status },
            {
              header: '',
              cell: (s) =>
                canEdit ? (
                  <div className="flex gap-2">
                    <button className="text-brand hover:underline" onClick={() => openEdit(s)}>
                      Edit
                    </button>
                    <button className="text-red-600 hover:underline" onClick={() => remove(s)}>
                      Delete
                    </button>
                  </div>
                ) : null,
            },
          ]}
        />
        <div className="mt-3 flex items-center justify-end gap-2 text-sm">
          <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </Button>
          <span className="text-gray-500">
            {page} / {totalPages}
          </span>
          <Button variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </Card>

      <Modal open={open} title={editId ? 'Edit student' : 'Add student'} onClose={() => setOpen(false)}>
        <form onSubmit={save} className="grid grid-cols-2 gap-3">
          <Input
            label="First name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
          />
          <Input
            label="Last name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            required
          />
          <Input
            label="Date of birth"
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            required
          />
          <Select
            label="Gender"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
            ]}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <div className="col-span-2">
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? 'Saving…' : editId ? 'Save changes' : 'Create student'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
