'use client';

import { useState, useEffect } from 'react';
import { lkridiApi } from '@/lib/api/endpoints';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MembershipRequest {
  id: string;
  buyerName: string;
  phone: string;
  requestDate: string;
}

interface LoanRequest {
  id: string;
  buyerName: string;
  products: string;
  totalAmount: number;
  requestDate: string;
}

interface ApprovedMember {
  id: string;
  buyerName: string;
  phone: string;
  approvedDate: string;
  totalLoans: number;
}

type Tab = 'membership' | 'approved' | 'loan';

// ---------------------------------------------------------------------------
// Shared action buttons
// ---------------------------------------------------------------------------

function ActionButtons({
  id,
  onApprove,
  onDecline,
}: {
  id: string;
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onApprove(id)}
        className="px-3 py-1 rounded text-white text-xs font-medium"
        style={{ backgroundColor: '#0F4C81' }}
      >
        Approve
      </button>
      <button
        onClick={() => onDecline(id)}
        className="px-3 py-1 rounded text-white text-xs font-medium"
        style={{ backgroundColor: '#FF6B35' }}
      >
        Decline
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab panels
// ---------------------------------------------------------------------------

function MembershipTab() {
  const [requests, setRequests] = useState<MembershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    lkridiApi.getMembership()
      .then((res) => {
        const data = res.data;
        if (data && 'approvalStatus' in data && data.approvalStatus === 'PENDING') {
          setRequests([{
            id: String((data as { id?: string | number }).id ?? ''),
            buyerName: '—',
            phone: '—',
            requestDate: '—',
          }]);
        }
      })
      .catch((err: Error) => setError(err.message ?? 'Failed to load membership requests.'))
      .finally(() => setLoading(false));
  }, []);

  function handleApprove(id: string) {
    lkridiApi.approveMembership(id, true)
      .then(() => setRequests((prev) => prev.filter((r) => r.id !== id)))
      .catch((err: Error) => setError(err.message));
  }

  function handleDecline(id: string) {
    lkridiApi.approveMembership(id, false)
      .then(() => setRequests((prev) => prev.filter((r) => r.id !== id)))
      .catch((err: Error) => setError(err.message));
  }

  if (loading) return <TableSkeleton />;
  if (error) return <ErrorState message={error} />;
  if (requests.length === 0) return <EmptyState message="No pending membership requests." />;

  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3 border-b border-gray-200">Buyer Name</th>
              <th className="px-4 py-3 border-b border-gray-200">Phone</th>
              <th className="px-4 py-3 border-b border-gray-200">Request Date</th>
              <th className="px-4 py-3 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{r.buyerName}</td>
                <td className="px-4 py-3 text-gray-600">{r.phone}</td>
                <td className="px-4 py-3 text-gray-500">{r.requestDate}</td>
                <td className="px-4 py-3">
                  <ActionButtons id={r.id} onApprove={handleApprove} onDecline={handleDecline} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile */}
      <div className="sm:hidden space-y-3">
        {requests.map((r) => (
          <div key={r.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
            <p className="font-medium text-sm text-gray-800">{r.buyerName}</p>
            <p className="text-xs text-gray-500">{r.phone} · {r.requestDate}</p>
            <ActionButtons id={r.id} onApprove={handleApprove} onDecline={handleDecline} />
          </div>
        ))}
      </div>
    </>
  );
}

function ApprovedMembersTab() {
  const [members, setMembers] = useState<ApprovedMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    lkridiApi.getMembership()
      .then((res) => {
        const data = res.data;
        if (data && 'approvalStatus' in data && data.approvalStatus === 'APPROVED') {
          setMembers([{
            id: String((data as { id?: string | number }).id ?? ''),
            buyerName: '—',
            phone: '—',
            approvedDate: '—',
            totalLoans: 0,
          }]);
        }
      })
      .catch((err: Error) => setError(err.message ?? 'Failed to load approved members.'))
      .finally(() => setLoading(false));
  }, []);

  function handleRemove(id: string) {
    lkridiApi.approveMembership(id, false)
      .then(() => setMembers((prev) => prev.filter((m) => m.id !== id)))
      .catch((err: Error) => setError(err.message));
  }

  if (loading) return <TableSkeleton />;
  if (error) return <ErrorState message={error} />;
  if (members.length === 0) return <EmptyState message="No approved members yet." />;

  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3 border-b border-gray-200">Buyer Name</th>
              <th className="px-4 py-3 border-b border-gray-200">Phone</th>
              <th className="px-4 py-3 border-b border-gray-200">Approved Date</th>
              <th className="px-4 py-3 border-b border-gray-200">Total Loans</th>
              <th className="px-4 py-3 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{m.buyerName}</td>
                <td className="px-4 py-3 text-gray-600">{m.phone}</td>
                <td className="px-4 py-3 text-gray-500">{m.approvedDate}</td>
                <td className="px-4 py-3 text-gray-800">{m.totalLoans}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded text-white text-xs font-medium" style={{ backgroundColor: '#0F4C81' }}>
                      View Details
                    </button>
                    <button
                      onClick={() => handleRemove(m.id)}
                      className="px-3 py-1 rounded text-xs font-medium border border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile */}
      <div className="sm:hidden space-y-3">
        {members.map((m) => (
          <div key={m.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-sm text-gray-800">{m.buyerName}</p>
                <p className="text-xs text-gray-500">{m.phone}</p>
              </div>
              <span className="text-xs text-gray-400">{m.approvedDate}</span>
            </div>
            <p className="text-xs text-gray-500">Total Loans: {m.totalLoans}</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded text-white text-xs font-medium" style={{ backgroundColor: '#0F4C81' }}>
                View Details
              </button>
              <button
                onClick={() => handleRemove(m.id)}
                className="px-3 py-1 rounded text-xs font-medium border border-red-300 text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function LoanTab() {
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    lkridiApi.getTransactions()
      .then(() => {
        setRequests([]);
      })
      .catch((err: Error) => setError(err.message ?? 'Failed to load loan requests.'))
      .finally(() => setLoading(false));
  }, []);

  function handleApprove(id: string) {
    lkridiApi.acceptOrder(id)
      .then(() => setRequests((prev) => prev.filter((r) => r.id !== id)))
      .catch((err: Error) => setError(err.message));
  }

  function handleDecline(id: string) {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }

  if (loading) return <TableSkeleton />;
  if (error) return <ErrorState message={error} />;
  if (requests.length === 0) return <EmptyState message="No pending loan requests." />;

  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3 border-b border-gray-200">Buyer Name</th>
              <th className="px-4 py-3 border-b border-gray-200">Product(s)</th>
              <th className="px-4 py-3 border-b border-gray-200">Total (MAD)</th>
              <th className="px-4 py-3 border-b border-gray-200">Request Date</th>
              <th className="px-4 py-3 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{r.buyerName}</td>
                <td className="px-4 py-3 text-gray-600">{r.products}</td>
                <td className="px-4 py-3 text-gray-800">{r.totalAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-500">{r.requestDate}</td>
                <td className="px-4 py-3">
                  <ActionButtons id={r.id} onApprove={handleApprove} onDecline={handleDecline} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile */}
      <div className="sm:hidden space-y-3">
        {requests.map((r) => (
          <div key={r.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-sm text-gray-800">{r.buyerName}</p>
                <p className="text-xs text-gray-500">{r.products}</p>
              </div>
              <span className="text-sm font-medium text-gray-800">MAD {r.totalAmount.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-400">{r.requestDate}</p>
            <ActionButtons id={r.id} onApprove={handleApprove} onDecline={handleDecline} />
          </div>
        ))}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-sm text-gray-400">
      {message}
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-sm text-red-500">
      {message}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function LkridiHubPage() {
  const [activeTab, setActiveTab] = useState<Tab>('membership');

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#0F4C81' }}>
          LKRIDI Management
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Step 1: approve buyer membership. Step 2: approve their loan requests.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {([
          { key: 'membership', label: 'Membership Requests' },
          { key: 'approved',   label: 'Approved Members'    },
          { key: 'loan',       label: 'Loan Requests'       },
        ] as { key: Tab; label: string }[]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === key
                ? 'border-blue-800 text-blue-800'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            style={activeTab === key ? { borderColor: '#0F4C81', color: '#0F4C81' } : {}}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Panel */}
      {activeTab === 'membership' ? <MembershipTab /> : activeTab === 'approved' ? <ApprovedMembersTab /> : <LoanTab />}
    </div>
  );
}
