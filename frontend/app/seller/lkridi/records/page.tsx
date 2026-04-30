'use client';

import { useState, useEffect } from 'react';
import { lkridiApi } from '@/lib/api/endpoints';
import { 
  Wallet, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Users,
  Zap,
  Sparkles,
  ChevronRight,
  DollarSign,
  ArrowRight
} from 'lucide-react';

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
// Premium Components
// ---------------------------------------------------------------------------

// Premium Stat Card
function PremiumStatCard({ label, value, icon, color, subtitle }: { 
  label: string; 
  value: number; 
  icon: React.ReactNode; 
  color: string;
  subtitle?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="relative cursor-pointer">
      <div className="absolute inset-0 rounded-2xl transition-opacity duration-500 blur-xl" style={{ background: `radial-gradient(circle at 30% 20%, ${color}40, transparent)`, opacity: isHovered ? 0.6 : 0 }} />
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-4 shadow-lg transition-all duration-500" style={{ transform: isHovered ? 'translateY(-4px)' : 'none' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 rounded-xl transition-all duration-300" style={{ backgroundColor: `${color}15` }}>{icon}</div>
        </div>
        <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        {subtitle && <p className="text-[10px] text-gray-400 mt-1">{subtitle}</p>}
        <div className="absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-500 w-0 group-hover:w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      </div>
    </div>
  );
}

// Premium Progress Bar
function PremiumProgressBar({ value, total, color = '#FF6B35' }: { value: number; total: number; color?: string }) {
  const percentage = (value / total) * 100;
  
  return (
    <div className="relative">
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>Paid: {value.toLocaleString()} MAD</span>
        <span>Total: {total.toLocaleString()} MAD</span>
      </div>
    </div>
  );
}

// Premium Record Row
function RecordRow({
  record,
  onMarkPaid,
  onConfirmReceived,
  onSetDeadline,
  index,
}: {
  record: LkridiRecord;
  onMarkPaid: (id: string) => void;
  onConfirmReceived: (id: string) => void;
  onSetDeadline: (id: string, date: string) => void;
  index: number;
}) {
  const [deadline, setDeadline] = useState(record.dueDate ?? '');
  const [isHovered, setIsHovered] = useState(false);
  const paidAmount = record.totalAmount - record.remainingAmount;
  const paidRatio = (paidAmount / record.totalAmount) * 100;
  const isAwaiting = record.status === 'awaiting_buyer_confirmation';

  function handleDeadlineChange(e: React.ChangeEvent<HTMLInputElement>) {
    const date = e.target.value;
    setDeadline(date);
    onSetDeadline(record.id, date);
  }

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="border-b border-gray-100 transition-all duration-300"
      style={{ background: isHovered ? 'linear-gradient(90deg, #0F4C8105, #FF6B3505)' : 'transparent' }}
    >
      {/* Desktop View */}
      <div className="hidden lg:block px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Buyer Info */}
          <div className="flex items-center gap-4 w-[200px]">
            <div className="w-8 text-center">
              <span className={`text-xs font-bold ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-400' : 'text-gray-300'}`}>
                #{index + 1}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F4C81]/10 to-[#FF6B35]/10 flex items-center justify-center">
              <Users size={16} className="text-[#0F4C81]" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{record.buyerName}</p>
              {isAwaiting && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock size={10} className="text-amber-500" />
                  <span className="text-[10px] text-amber-600">Awaiting confirmation</span>
                </div>
              )}
            </div>
          </div>

          {/* Total Amount */}
          <div className="w-[150px]">
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-semibold text-gray-800">{record.totalAmount.toLocaleString()} MAD</p>
          </div>

          {/* Remaining Amount + Progress */}
          <div className="w-[200px]">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-gray-500">Remaining</p>
              <p className="font-bold text-[#FF6B35]">{record.remainingAmount.toLocaleString()} MAD</p>
            </div>
            <PremiumProgressBar value={paidAmount} total={record.totalAmount} color="#10B981" />
          </div>

          {/* Deadline */}
          <div className="w-[150px]">
            <div className="flex items-center gap-1 mb-1">
              <Calendar size={12} className="text-gray-400" />
              <p className="text-sm text-gray-500">Deadline</p>
            </div>
            <input
              type="date"
              value={deadline}
              onChange={handleDeadlineChange}
              disabled={isAwaiting}
              className={`border rounded-lg px-2 py-1.5 text-sm bg-white transition-all ${
                isAwaiting ? 'border-gray-200 text-gray-400' : 'border-gray-200 focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81]'
              }`}
            />
          </div>

          {/* Actions */}
          <div className="w-[160px]">
            {isAwaiting ? (
              <button
                onClick={() => onConfirmReceived(record.id)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all duration-300 hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #0F4C81, #1a5c9e)' }}
              >
                <CheckCircle size={12} />
                Confirm Payment
              </button>
            ) : (
              <button
                onClick={() => onMarkPaid(record.id)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all duration-300 hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #FF6B35, #ff8a5a)' }}
              >
                <Wallet size={12} />
                Mark as Paid
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0F4C81]/10 to-[#FF6B35]/10 flex items-center justify-center">
              <Users size={14} className="text-[#0F4C81]" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{record.buyerName}</p>
              {isAwaiting && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[9px] font-medium mt-0.5">
                  <Clock size={8} /> Awaiting
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Remaining</p>
            <p className="text-lg font-bold text-[#FF6B35]">{record.remainingAmount.toLocaleString()} MAD</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Amount</span>
            <span className="font-semibold text-gray-800">{record.totalAmount.toLocaleString()} MAD</span>
          </div>
          
          <PremiumProgressBar value={paidAmount} total={record.totalAmount} color="#10B981" />
          
          <div>
            <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
              <Calendar size={10} /> Repayment Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={handleDeadlineChange}
              disabled={isAwaiting}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81] transition-all"
            />
          </div>

          <button
            onClick={() => isAwaiting ? onConfirmReceived(record.id) : onMarkPaid(record.id)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] ${
              isAwaiting ? 'bg-[#0F4C81]' : 'bg-[#FF6B35]'
            }`}
          >
            {isAwaiting ? <CheckCircle size={14} /> : <Wallet size={14} />}
            {isAwaiting ? 'Confirm Payment Received' : 'Mark as Paid'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Premium Records Table
function RecordsTable({
  records,
  onMarkPaid,
  onConfirmReceived,
  onSetDeadline,
  title,
}: {
  records: LkridiRecord[];
  onMarkPaid: (id: string) => void;
  onConfirmReceived: (id: string) => void;
  onSetDeadline: (id: string, date: string) => void;
  title?: string;
}) {
  if (records.length === 0) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-xl overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-gray-100/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center">
              <TrendingUp size={12} className="text-[#FF6B35]" />
            </div>
            <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
            <span className="ml-auto text-xs bg-white/80 px-2 py-0.5 rounded-full text-gray-500">{records.length} items</span>
          </div>
        </div>
      )}
      
      {/* Desktop Header */}
      <div className="hidden lg:block px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="w-[200px]">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Buyer</span>
          </div>
          <div className="w-[150px]">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</span>
          </div>
          <div className="w-[200px]">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Remaining</span>
          </div>
          <div className="w-[150px]">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Deadline</span>
          </div>
          <div className="w-[160px]">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</span>
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {records.map((record, idx) => (
          <RecordRow
            key={record.id}
            record={record}
            onMarkPaid={onMarkPaid}
            onConfirmReceived={onConfirmReceived}
            onSetDeadline={onSetDeadline}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
}

// Section Component
function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#0F4C81] to-[#FF6B35]" />
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
          {title}
          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">{count}</span>
        </h2>
      </div>
      {children}
    </section>
  );
}

// Empty State Component
function EmptyState({ message, icon }: { message: string; icon?: React.ReactNode }) {
  return (
    <div className="text-center py-16 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/40">
      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
        {icon || <Wallet size={28} className="text-gray-300" />}
      </div>
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function LkridiRecordsPage() {
  const [records, setRecords] = useState<LkridiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    lkridiApi.getTransactions()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setRecords(data.map((r: Record<string, unknown>, idx: number) => ({
          id: String(r.id ?? idx),
          buyerName: String(r.buyerName ?? r.buyerId ?? `Buyer ${idx + 1}`),
          totalAmount: Number(r.amount ?? r.totalAmount ?? 1500),
          remainingAmount: Number(r.remainingAmount ?? r.amount ?? 500),
          dueDate: (r.dueDate as string | null) ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
  const awaiting = records.filter((r) => r.status === 'awaiting_buyer_confirmation');
  const totalOutstanding = outstanding.reduce((sum, r) => sum + r.remainingAmount, 0);
  const totalLoans = records.reduce((sum, r) => sum + r.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/30">
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-[#0F4C81] rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse-slow" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-[#FF6B35] rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse-slow delay-1000" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/60 backdrop-blur-2xl border-b border-white/20 shadow-sm">
        <div className="px-6 lg:px-8 py-5">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#FF6B35] flex items-center justify-center">
                <Wallet size={16} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#FF6B35] bg-clip-text text-transparent">
                LKRIDI Records
              </h1>
            </div>
            <p className="text-sm text-gray-500 ml-11">
              Track outstanding loans and manage repayments
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <PremiumStatCard 
            label="Outstanding Loans" 
            value={outstanding.length} 
            icon={<Wallet size={18} />} 
            color="#FF6B35"
            subtitle="Awaiting payment"
          />
          <PremiumStatCard 
            label="Total Outstanding Amount" 
            value={totalOutstanding} 
            icon={<DollarSign size={18} />} 
            color="#FF6B35"
            subtitle="MAD"
          />
          <PremiumStatCard 
            label="Awaiting Confirmation" 
            value={awaiting.length} 
            icon={<Clock size={18} />} 
            color="#F59E0B"
            subtitle="Buyer action needed"
          />
          <PremiumStatCard 
            label="Total Loans Given" 
            value={totalLoans} 
            icon={<TrendingUp size={18} />} 
            color="#0F4C81"
            subtitle="MAD"
          />
        </div>

        {error && (
          <div className="bg-rose-50/90 backdrop-blur-sm border border-rose-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle size={18} className="text-rose-500" />
            <p className="text-sm text-rose-600">{error}</p>
          </div>
        )}

        {loading ? (
          <LoadingSkeleton />
        ) : records.length === 0 ? (
          <EmptyState 
            message="No outstanding LKRIDI loans." 
            icon={<Wallet size={28} />}
          />
        ) : (
          <div className="space-y-8">
            {/* Outstanding Section */}
            {outstanding.length > 0 && (
              <Section title="Outstanding Loans" count={outstanding.length}>
                <RecordsTable
                  records={outstanding}
                  onMarkPaid={handleMarkPaid}
                  onConfirmReceived={handleConfirmReceived}
                  onSetDeadline={handleSetDeadline}
                />
              </Section>
            )}

            {/* Awaiting Buyer Section */}
            {awaiting.length > 0 && (
              <Section title="Awaiting Buyer Confirmation" count={awaiting.length}>
                <RecordsTable
                  records={awaiting}
                  onMarkPaid={handleMarkPaid}
                  onConfirmReceived={handleConfirmReceived}
                  onSetDeadline={handleSetDeadline}
                />
              </Section>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes pulse-slow { 0%, 100% { opacity: 0.05; } 50% { opacity: 0.08; } }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}