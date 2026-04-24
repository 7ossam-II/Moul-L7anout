'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { workerApi, storesApi } from '@/lib/api/endpoints';
import type { Worker, ApiStoreListItem } from '@/lib/types/api.types';

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const cashierSchema = z
  .object({
    name: z.string().min(1, 'Full name is required').max(100),
    phone: z
      .string()
      .regex(/^(\+212|0)[5-7]\d{8}$/, 'Enter a valid Moroccan phone number (e.g. 0612345678)'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
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
}

// ---------------------------------------------------------------------------
// Field error helper
// ---------------------------------------------------------------------------

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function WorkersPage() {
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [storeId, setStoreId] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CashierFormData>({ resolver: zodResolver(cashierSchema) });

  useEffect(() => {
    storesApi.getMyStores()
      .then((res) => {
        const stores = (res.data ?? []) as ApiStoreListItem[];
        const id = stores[0] ? String(stores[0].id) : '';
        setStoreId(id);
        if (!id) { setLoading(false); return; }
        return workerApi.getStoreWorkers(id).then((wRes) => {
          const workers = (wRes.data ?? []) as Worker[];
          setCashiers(workers.map((w) => ({
            id: w.id,
            name: w.user?.name ?? '—',
            phone: w.user?.phone ?? '—',
            status: w.status === 'active' ? 'Active' : 'Inactive',
          })));
        });
      })
      .catch((err: Error) => setError(err.message ?? 'Failed to load cashiers.'))
      .finally(() => setLoading(false));
  }, []);

  function onSubmit(data: CashierFormData) {
    if (!storeId) return;
    workerApi.inviteWorker(storeId, {
      name: data.name,
      phone: data.phone,
      email: `${data.phone}@placeholder.com`,
      permissions: {
        canManageProducts: true,
        canManageOrders: true,
        canDeleteProducts: false,
        canViewEarnings: false,
        canManageWorkers: false,
        canEditStore: false,
      },
    }).then((res) => {
      const w = res.data as Worker | undefined;
      const newCashier: Cashier = {
        id: w?.id ?? `c-${Date.now()}`,
        name: data.name,
        phone: data.phone,
        status: 'Active',
      };
      setCashiers((prev) => [newCashier, ...prev]);
      reset();
      setShowForm(false);
    }).catch((err: Error) => setError(err.message));
  }

  function handleDeactivate(id: string) {
    workerApi.updateWorkerPermissions(storeId, id, {}).catch(() => {});
    setCashiers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Inactive' } : c))
    );
  }

  function handleActivate(id: string) {
    setCashiers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Active' } : c))
    );
  }

  function handleDelete(id: string) {
    workerApi.removeWorker(storeId, id)
      .then(() => setCashiers((prev) => prev.filter((c) => c.id !== id)))
      .catch((err: Error) => setError(err.message));
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#0F4C81' }}>
            Cashier Management
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your store's cashier accounts.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2 rounded text-white text-sm font-medium shrink-0"
          style={{ backgroundColor: '#0F4C81' }}
        >
          {showForm ? 'Cancel' : 'Add Cashier'}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* FR7.6 notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
        Cashiers cannot manage LKRIDI or store settings. They can only process orders and manage products.
      </div>

      {/* Create Cashier Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">New Cashier Account</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name')}
                type="text"
                placeholder="e.g. Amine Berrada"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <FieldError message={errors.name?.message} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                {...register('phone')}
                type="tel"
                placeholder="0612345678"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <FieldError message={errors.phone?.message} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                {...register('password')}
                type="password"
                placeholder="Min 8 characters"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <FieldError message={errors.password?.message} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="Repeat password"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <FieldError message={errors.confirmPassword?.message} />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded text-white text-sm font-medium disabled:opacity-60"
              style={{ backgroundColor: '#FF6B35' }}
            >
              {isSubmitting ? 'Creating...' : 'Create Cashier Account'}
            </button>
          </form>
        </div>
      )}

      {/* Cashier List */}
      <section>
        <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
          Cashiers ({cashiers.length})
        </h2>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : cashiers.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-sm text-gray-400">
            No cashier accounts yet.
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                    <th className="px-4 py-3 border-b border-gray-200">Name</th>
                    <th className="px-4 py-3 border-b border-gray-200">Phone</th>
                    <th className="px-4 py-3 border-b border-gray-200">Status</th>
                    <th className="px-4 py-3 border-b border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {cashiers.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                      <td className="px-4 py-3 text-gray-600">{c.phone}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {c.status === 'Active' ? (
                            <button onClick={() => handleDeactivate(c.id)} className="px-3 py-1 rounded text-white text-xs font-medium" style={{ backgroundColor: '#0F4C81' }}>
                              Deactivate
                            </button>
                          ) : (
                            <button onClick={() => handleActivate(c.id)} className="px-3 py-1 rounded text-white text-xs font-medium" style={{ backgroundColor: '#FF6B35' }}>
                              Activate
                            </button>
                          )}
                          <button onClick={() => handleDelete(c.id)} className="px-3 py-1 rounded text-xs font-medium border border-red-300 text-red-600 hover:bg-red-50">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-3">
              {cashiers.map((c) => (
                <div key={c.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm text-gray-800">{c.name}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{c.phone}</p>
                  <div className="flex gap-2">
                    {c.status === 'Active' ? (
                      <button onClick={() => handleDeactivate(c.id)} className="px-3 py-1 rounded text-white text-xs font-medium" style={{ backgroundColor: '#0F4C81' }}>
                        Deactivate
                      </button>
                    ) : (
                      <button onClick={() => handleActivate(c.id)} className="px-3 py-1 rounded text-white text-xs font-medium" style={{ backgroundColor: '#FF6B35' }}>
                        Activate
                      </button>
                    )}
                    <button onClick={() => handleDelete(c.id)} className="px-3 py-1 rounded text-xs font-medium border border-red-300 text-red-600">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

    </div>
  );
}
