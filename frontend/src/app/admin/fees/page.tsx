'use client';

import { useCallback, useEffect, useState } from 'react';
import { PortalLayout } from '@/components/common/PortalLayout';
import { Card } from '@/components/common/Card';
import { Alert } from '@/components/common/Alert';
import { Table } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Modal } from '@/components/common/Modal';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { StudentScopedView } from '@/components/students/StudentScopedView';
import { FeeLedgerView } from '@/components/fees/FeeLedgerView';
import { feeService } from '@/services/fee.service';
import { apiErrorMessage } from '@/services/api';
import type { Fee, FeeFrequency, FeeType, FinancialReport } from '@/types';

export default function AdminFeesPage() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    feeType: 'TUITION' as FeeType,
    amount: '',
    frequency: 'MONTHLY' as FeeFrequency,
    dueDate: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    Promise.all([feeService.list(), feeService.financialReport()])
      .then(([f, r]) => {
        setFees(f);
        setReport(r);
      })
      .catch((e) => setError(apiErrorMessage(e)));
  }, []);

  useEffect(load, [load]);

  async function createFee(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await feeService.create({
        feeType: form.feeType,
        amount: Number(form.amount),
        frequency: form.frequency,
        dueDate: form.dueDate,
        description: form.description || undefined,
      });
      setOpen(false);
      load();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <PortalLayout allow={['ADMIN']} title="Fees">
      <div className="space-y-6">
        <Alert variant="error">{error}</Alert>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatsCard label="Total income" value={`$${report?.totalIncome ?? 0}`} accent="text-green-600" />
          <StatsCard label="Payments" value={report?.paymentCount ?? 0} />
          <StatsCard label="Fee types" value={Object.keys(report?.byFeeType ?? {}).length} />
        </section>

        <Card title="Fee structures" actions={<Button onClick={() => setOpen(true)}>Add fee</Button>}>
          <Table<Fee>
            rowKey={(f) => f.id}
            rows={fees}
            empty="No fees configured."
            columns={[
              { header: 'Type', cell: (f) => f.feeType },
              { header: 'Amount', cell: (f) => `$${f.amount}` },
              { header: 'Frequency', cell: (f) => f.frequency },
              { header: 'Due', cell: (f) => new Date(f.dueDate).toLocaleDateString() },
            ]}
          />
        </Card>

        <StudentScopedView storageKey="admin.fees.student">
          {(id) => <FeeLedgerView studentId={id} canPay />}
        </StudentScopedView>
      </div>

      <Modal open={open} title="Add fee" onClose={() => setOpen(false)}>
        <form onSubmit={createFee} className="grid grid-cols-2 gap-3">
          <Select
            label="Type"
            value={form.feeType}
            onChange={(e) => setForm({ ...form, feeType: e.target.value as FeeType })}
            options={[
              { value: 'TUITION', label: 'Tuition' },
              { value: 'ADMISSION', label: 'Admission' },
              { value: 'EXAM', label: 'Exam' },
              { value: 'TRANSPORT', label: 'Transport' },
              { value: 'LIBRARY', label: 'Library' },
            ]}
          />
          <Select
            label="Frequency"
            value={form.frequency}
            onChange={(e) => setForm({ ...form, frequency: e.target.value as FeeFrequency })}
            options={[
              { value: 'MONTHLY', label: 'Monthly' },
              { value: 'QUARTERLY', label: 'Quarterly' },
              { value: 'YEARLY', label: 'Yearly' },
            ]}
          />
          <Input
            label="Amount"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
          <Input
            label="Due date"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            required
          />
          <div className="col-span-2">
            <Input
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="col-span-2">
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? 'Saving…' : 'Create fee'}
            </Button>
          </div>
        </form>
      </Modal>
    </PortalLayout>
  );
}
