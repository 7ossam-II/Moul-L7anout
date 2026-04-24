'use client';

import { useState, useEffect } from 'react';
import { lkridiApi } from '@/lib/api/endpoints';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type RecordStatus = 'outstanding' | 'awaiting_buyer_confirmation' | 'paid';

interface LkridiRecord {
  id: string;
  buyerName: string;
  totalAmount: number;
  remainingAmount: number;
  dueDate: string | null;
  status: RecordStatus;
}

// ---------------------------------------------------------------------------
// Row
// ---------------------------------------------------------------------------

function RecordRow({
  record,
  onMarkPaid,
  onConfirmReceived,
  onSetDeadline,
}: {
  record: LkridiRecord;
  onMarkPaid: (id: string) => void;
  onConfirmReceived: (id: string) => void;
  onSetDeadline: (id: string, date: string) => void;
}) {
  const [deadline, setDeadline] = useState(record.dueDate ?? '');
  const paidRatio = ((record.totalAmount - record.remainingAmount) / record.totalAmount) * 100;
  const isAwaiting = record.status === 'awaiting_buyer_confirmation';

  function handleDeadlineChange(e: React.ChangeEvent<HTMLInputElement>) {
    const date = e.target.value;
    setDeadline(date);
    onSetDeadline(record.id, date);
  }

  const actions = (
    <div className="flex flex-col gap-2">
      {isAwaiting ? (
        <button
          onClick={() => onConfirmReceived(record.id)}
          className="px-3 py-1 rounded text-white text-xs font-medium"
          style={{ backgroundColor: '#0F4C81' }}
        >
          Confirm Payment Received
        </button>
      ) : (
        <button
          onClick={() => onMarkPaid(record.id)}
          className="px-3 py-1 rounded text-white text-xs font-medium"
          style={{ backgroundColor: '#FF6B35' }}
        >
          Mark as Paid
        </button>
      )}
    </div>
  );

  const awaitingBadge = isAwaiting && (
    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
      Waiting for buyer confirmation
    </span>
  );

  return (
    <>
      {/* Desktop row */}
      <tr className="hidden sm:table-row hover:bg-gray-50">
        <td className="px-4 py-4 font-medium text-gray-800">
          <div>{record.buyerName}</div>
          {awaitingBadge}
        </td>
        <td className="px-4 py-4 text-gray-700">{record.totalAmount.toLocaleString()} MAD</td>
        <td className="px-4 py-4">
          <span className="font-semibold" style={{ color: '#FF6B35' }}>
            {record.remainingAmount.toLocaleString()} MAD
          </span>
          <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1">
            <div className="h-1.5 rounded-full bg-green-400" style={{ width: `${paidRatio}%` }} />
          </div>
        </td>
        <td className="px-4 py-4">
          <input
            type="date"
            value={deadline}
            onChange={handleDeadlineChange}
            disabled={isAwaiting}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
        </td>
        <td className="px-4 py-4">{actions}</td>
      </tr>

      {/* Mobile card */}
      <tr className="sm:hidden">
        <td colSpan={5} className="px-0 py-1">
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-sm text-gray-800">{record.buyerName}</p>
                {awaitingBadge}
              </div>
              {actions}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
              <div>
                <p>Total</p>
                <p className="font-medium text-gray-800">{record.totalAmount.toLocaleString()} MAD</p>
              </div>
              <div>
                <p>Remaining</p>
                <p className="font-semibold" style={{ color: '#FF6B35' }}>
                  {record.remainingAmount.toLocaleString()} MAD
                </p>
              </div>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full">
              <div className="h-1.5 rounded-full bg-green-400" style={{ width: `${paidRatio}%` }} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Repayment Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={handleDeadlineChange}
                disabled={isAwaiting}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
              />
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}

// ---------------------------------------------------------------------------
// Table wrapper
// ---------------------------------------------------------------------------

function RecordsTable({
  records,
  onMarkPaid,
  onConfirmReceived,
  onSetDeadline,
}: {
  records: LkridiRecord[];
  onMarkPaid: (id: string) => void;
  onConfirmReceived: (id: string) => void;
  onSetDeadline: (id: string, date: string) => void;
}) {
  if (records.length === 0) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm border-collapse">
        <thead className="hidden sm:table-header-group">
          <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
            <th className="px-4 py-3 border-b border-gray-200">Buyer</th>
            <th className="px-4 py-3 border-b border-gray-200">Total (MAD)</th>
            <th className="px-4 py-3 border-b border-gray-200">Remaining</th>
            <th className="px-4 py-3 border-b border-gray-200">Repayment Deadline</th>
            <th className="px-4 py-3 border-b border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {records.map((record) => (
            <RecordRow
              key={record.id}
              record={record}
              onMarkPaid={onMarkPaid}
              onConfirmReceived={onConfirmReceived}
              onSetDeadline={onSetDeadline}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function LkridiRecordsPage() {
  const [records, setRecords] = useState<LkridiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    lkridiApi.getTransactions()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setRecords(data.map((r: Record<string, unknown>) => ({
          id: String(r.id ?? ''),
          buyerName: String(r.buyerName ?? r.buyerId ?? '—'),
          totalAmount: Number(r.amount ?? r.totalAmount ?? 0),
          remainingAmount: Number(r.remainingAmount ?? r.amount ?? 0),
          dueDate: (r.dueDate as string | null) ?? null,
          status: (r.repaymentStatus === 'PAID' ? 'paid' : r.status === 'awaiting_buyer_confirmation' ? 'awaiting_buyer_confirmation' : 'outstanding') as RecordStatus,
        })));
      })
      .catch((err: Error) => setError(err.message ?? 'Failed to load LKRIDI records.'))
      .finally(() => setLoading(false));
  }, []);

  function handleMarkPaid(id: string) {
    lkridiApi.repayLoan(id, 0, 0)
      .then(() => {
        setRecords((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: 'awaiting_buyer_confirmation' } : r))
        );
      })
      .catch((err: Error) => setError(err.message));
  }

  function handleConfirmReceived(id: string) {
    lkridiApi.confirmPayment(id)
      .then(() => setRecords((prev) => prev.filter((r) => r.id !== id)))
      .catch((err: Error) => setError(err.message));
  }

  function handleSetDeadline(id: string, date: string) {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, dueDate: date } : r)));
  }

  const outstanding = records.filter((r) => r.status === 'outstanding');
  const awaiting    = records.filter((r) => r.status === 'awaiting_buyer_confirmation');
  const totalOutstanding = outstanding.reduce((sum, r) => sum + r.remainingAmount, 0);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#0F4C81' }}>LKRIDI Records</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Outstanding loans — both parties must confirm before a record is removed.
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && outstanding.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg px-5 py-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">Total outstanding</span>
          <span className="text-lg font-bold" style={{ color: '#FF6B35' }}>
            {totalOutstanding.toLocaleString()} MAD
          </span>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-sm text-gray-400">
          No outstanding LKRIDI loans.
        </div>
      ) : (
        <div className="space-y-8">
          {/* Outstanding section */}
          <section>
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
              Outstanding ({outstanding.length})
            </h2>
            {outstanding.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-sm text-gray-400">
                No outstanding loans.
              </div>
            ) : (
              <RecordsTable
                records={outstanding}
                onMarkPaid={handleMarkPaid}
                onConfirmReceived={handleConfirmReceived}
                onSetDeadline={handleSetDeadline}
              />
            )}
          </section>

          {/* Awaiting buyer section */}
          {awaiting.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                Awaiting Buyer ({awaiting.length})
              </h2>
              <RecordsTable
                records={awaiting}
                onMarkPaid={handleMarkPaid}
                onConfirmReceived={handleConfirmReceived}
                onSetDeadline={handleSetDeadline}
              />
            </section>
          )}
        </div>
      )}
    </div>
  );
}
