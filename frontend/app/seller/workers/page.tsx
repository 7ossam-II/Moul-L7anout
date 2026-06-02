'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { storesApi, sellerCashierApi } from '@/lib/api/endpoints';
import type { ApiStoreListItem } from '@/lib/types/api.types';
import {
  Users,
  UserPlus,
  Phone,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Trash2,
  UserCheck,
  UserX,
  Store,
  Sparkles,
  TrendingUp
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const cashierSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100),
  phone: z
    .string()
    .regex(/^(06|07)[0-9]{8}$/, 'Enter a valid Moroccan phone number (e.g. 0612345678)'),
  // password optional – backend may not require it yet
  password: z.string().min(6).optional(),
});

type CashierFormData = z.infer<typeof cashierSchema>;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Cashier {
  id: string;
  name: string;
  phone: string;
  status: 'Active' | 'Inactive';
  storeId: number;
  storeName: string;
}

// ---------------------------------------------------------------------------
// Premium Components
// ---------------------------------------------------------------------------

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

function PremiumStatusBadge({ status }: { status: 'Active' | 'Inactive' }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
      status === 'Active' 
        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
        : 'bg-gray-100 text-gray-500 border border-gray-200'
    }`}>
      {status === 'Active' ? <CheckCircle size={10} /> : <XCircle size={10} />}
      {status}
    </div>
  );
}

function CashierRow({ cashier, onDelete, index }: {
  cashier: Cashier;
  onDelete: (id: string) => void;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="border-b border-gray-100 transition-all duration-300"
      style={{ background: isHovered ? 'linear-gradient(90deg, #0F4C8105, #FF6B3505)' : 'transparent' }}
    >
      {/* Desktop View */}
      <div className="hidden lg:block px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 w-[250px]">
            <div className="w-8 text-center">
              <span className={`text-xs font-bold ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-400' : 'text-gray-300'}`}>
                #{index + 1}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F4C81]/10 to-[#FF6B35]/10 flex items-center justify-center">
              <Users size={16} className="text-[#0F4C81]" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{cashier.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Phone size={10} className="text-gray-400" />
                <span className="text-xs text-gray-500">{cashier.phone}</span>
              </div>
            </div>
          </div>

          <div className="w-[120px]">
            <PremiumStatusBadge status={cashier.status} />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onDelete(cashier.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-all duration-300 hover:scale-105"
            >
              <Trash2 size={12} />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0F4C81]/10 to-[#FF6B35]/10 flex items-center justify-center">
              <Users size={14} className="text-[#0F4C81]" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{cashier.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Phone size={10} className="text-gray-400" />
                <span className="text-xs text-gray-500">{cashier.phone}</span>
              </div>
            </div>
          </div>
          <PremiumStatusBadge status={cashier.status} />
        </div>
        <button
          onClick={() => onDelete(cashier.id)}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-all duration-300"
        >
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </div>
  );
}

function CreateCashierForm({ onSubmit, isSubmitting, onCancel }: {
  onSubmit: (data: CashierFormData) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CashierFormData>({ resolver: zodResolver(cashierSchema) });

  const handleFormSubmit = (data: CashierFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-gray-100/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#FF6B35]/10">
            <UserPlus size={14} className="text-[#FF6B35]" />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">Add New Cashier</h3>
          <span className="ml-auto text-[10px] text-gray-400">Fill in the details below</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('fullName')}
            type="text"
            placeholder="e.g., Amine Berrada"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 text-sm focus:outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/20 transition-all"
          />
          {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              {...register('phone')}
              type="tel"
              placeholder="0612345678"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 text-sm focus:outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/20 transition-all"
            />
          </div>
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #ff8a5a)' }}
          >
            {isSubmitting ? 'Creating...' : 'Create Cashier Account'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function WorkersPage() {
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [storeId, setStoreId] = useState<number | null>(null);

  useEffect(() => {
    // First get the seller's first store (to know storeId)
    storesApi.getMyStores()
      .then((res) => {
        const stores = (res.data ?? []) as ApiStoreListItem[];
        if (stores.length === 0) {
          setError('No store found. Please create a store first.');
          setLoading(false);
          return;
        }
        const firstStoreId = stores[0].id;
        setStoreId(firstStoreId);
        return sellerCashierApi.getCashiers().then((cashierRes) => {
          const data = cashierRes.data;
          if (Array.isArray(data)) {
            const mapped = data.map((c: any) => ({
              id: String(c.id),
              name: c.name,
              phone: c.phone,
              status: c.active ? 'Active' : 'Inactive',
              storeId: c.storeId,
              storeName: c.storeName,
            }));
            setCashiers(mapped);
          } else {
            setCashiers([]);
          }
        });
      })
      .catch((err: Error) => setError(err.message ?? 'Failed to load cashiers.'))
      .finally(() => setLoading(false));
  }, []);

  // Helper to create cashier via API
  const createCashierApi = async (data: CashierFormData) => {
    if (!storeId) throw new Error('No store available');
    const res = await sellerCashierApi.createCashier({
      storeId,
      phone: data.phone,
      fullName: data.fullName,
      // password is optional; backend may ignore it
    });
    return res.data;
  };

async function onSubmit(data: CashierFormData) {
  try {
    const res = await sellerCashierApi.createCashier({
      storeId: storeId!,
      phone: data.phone,
      fullName: data.fullName,
    });
    // The API returns { success: true, data: { id, name, phone, active, storeId, storeName } }
    const newCashierData = (res as any).data; // or cast to a proper type
    const newCashier: Cashier = {
      id: String(newCashierData.id),
      name: newCashierData.name,
      phone: newCashierData.phone,
      status: newCashierData.active ? 'Active' : 'Inactive',
      storeId: newCashierData.storeId,
      storeName: newCashierData.storeName,
    };
    setCashiers((prev) => [newCashier, ...prev]);
    setShowForm(false);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to create cashier');
  }
}

  async function handleDelete(id: string) {
    try {
      await sellerCashierApi.removeCashier(id);
      setCashiers((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete cashier');
    }
  }

  const activeCount = cashiers.filter(c => c.status === 'Active').length;
  const inactiveCount = cashiers.filter(c => c.status === 'Inactive').length;

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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#FF6B35] flex items-center justify-center">
                <Users size={16} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#FF6B35] bg-clip-text text-transparent">
                  Cashier Management
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">Manage your store's cashier accounts</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm((v) => !v)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:scale-105 ${
                showForm ? 'bg-gray-500' : 'bg-gradient-to-r from-[#0F4C81] to-[#1a5c9e]'
              }`}
            >
              <UserPlus size={16} />
              {showForm ? 'Cancel' : 'Add Cashier'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <PremiumStatCard
            label="Total Cashiers"
            value={cashiers.length}
            icon={<Users size={18} />}
            color="#0F4C81"
          />
          <PremiumStatCard
            label="Active"
            value={activeCount}
            icon={<UserCheck size={18} />}
            color="#10B981"
            subtitle="Currently working"
          />
          <PremiumStatCard
            label="Inactive"
            value={inactiveCount}
            icon={<UserX size={18} />}
            color="#9CA3AF"
            subtitle="Suspended accounts"
          />
          <PremiumStatCard
            label="Stores"
            value={storeId ? 1 : 0}
            icon={<Store size={18} />}
            color="#FF6B35"
            subtitle="Your store"
          />
        </div>

        {/* FR7.6 Notice */}
        <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm rounded-xl border border-amber-200 p-4">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-amber-100">
              <Shield size={14} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800">Cashier Permissions</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Cashiers cannot manage LKRIDI or store settings. They can only process orders and manage products.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50/90 backdrop-blur-sm border border-rose-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle size={18} className="text-rose-500" />
            <p className="text-sm text-rose-600">{error}</p>
          </div>
        )}

        {/* Create Cashier Form */}
        {showForm && (
          <CreateCashierForm
            onSubmit={onSubmit}
            isSubmitting={false}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Cashier List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#0F4C81] to-[#FF6B35]" />
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Cashiers
              </h2>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">{cashiers.length}</span>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
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
          ) : cashiers.length === 0 ? (
            <div className="text-center py-16 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/40">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users size={28} className="text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm">No cashier accounts yet.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-[#0F4C81] to-[#1a5c9e] hover:scale-105 transition-all duration-300"
              >
                Add Your First Cashier
              </button>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-xl overflow-hidden">
              {/* Desktop Header */}
              <div className="hidden lg:block px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="w-[250px]">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cashier</span>
                  </div>
                  <div className="w-[120px]">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</span>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {cashiers.map((cashier, idx) => (
                  <CashierRow
                    key={cashier.id}
                    cashier={cashier}
                    onDelete={handleDelete}
                    index={idx}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      <style jsx global>{`
        @keyframes pulse-slow { 0%, 100% { opacity: 0.05; } 50% { opacity: 0.08; } }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}