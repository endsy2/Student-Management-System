'use client';

import { useCallback, useEffect, useState } from 'react';
import { feeService } from '@/services/fee.service';
import { apiErrorMessage } from '@/services/api';
import { Card } from '@/components/common/Card';
import { Alert } from '@/components/common/Alert';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Table } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { formatCurrency, formatDate } from '@/utils/format';
import { PAYMENT_METHODS } from '@/utils/constants';
import type { LedgerLine, PaymentMethod, StudentLedger } from '@/types';

export function FeeLedgerView({ studentId, canPay }: { studentId: string; canPay?: boolean }) {
  const [ledger, setLedger] = useState<StudentLedger | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [payFor, setPayFor] = useState<LedgerLine | null>(null);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    if (!studentId) return;
    feeService
      .ledger(studentId)
      .then(setLedger)
      .catch((e) => setError(apiErrorMessage(e)));
  }, [studentId]);

  useEffect(load, [load]);

  async function submitPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!payFor) return;
    setSaving(true);
    setError(null);
    try {
      await feeService.recordPayment({
        studentId,
        feeId: payFor.feeId,
        amountPaid: Number(amount),
        paymentMethod: method,
      });
      setPayFor(null);
      setAmount('');
      load();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (!studentId) return <p className="text-gray-500">Select a student to view fees.</p>;

  return (
    <div className="space-y-4">
      <Alert variant="error">{error}</Alert>
      <div className="grid grid-cols-2 gap-4">
        <StatsCard label="Total balance" value={formatCurrency(ledger?.totalBalance)} accent="text-red-600" />
        <StatsCard label="Scholarship" value={`${ledger?.scholarshipPct ?? 0}%`} accent="text-green-600" />
      </div>
      <Card title="Fee ledger">
        <Table<LedgerLine>
          rowKey={(l) => l.feeId}
          rows={ledger?.lines ?? []}
          empty="No fees configured."
          columns={[
            { header: 'Fee', cell: (l) => l.feeType },
            { header: 'Net due', cell: (l) => formatCurrency(l.netDue) },
            { header: 'Paid', cell: (l) => formatCurrency(l.paid) },
            { header: 'Balance', cell: (l) => formatCurrency(l.balance) },
            {
              header: 'Due',
              cell: (l) => (
                <span className={l.isOverdue ? 'text-red-600' : ''}>
                  {formatDate(l.dueDate)}
                  {l.isOverdue ? ` (${l.daysOverdue}d overdue)` : ''}
                </span>
              ),
            },
            {
              header: '',
              cell: (l) =>
                canPay && l.balance > 0 ? (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setPayFor(l);
                      setAmount(String(l.balance));
                    }}
                  >
                    Pay
                  </Button>
                ) : null,
            },
          ]}
        />
      </Card>

      <Modal open={!!payFor} title={`Record payment — ${payFor?.feeType}`} onClose={() => setPayFor(null)}>
        <form onSubmit={submitPayment} className="space-y-3">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <Select
            label="Method"
            value={method}
            onChange={(e) => setMethod(e.target.value as PaymentMethod)}
            options={PAYMENT_METHODS}
          />
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? 'Saving…' : 'Record payment'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
