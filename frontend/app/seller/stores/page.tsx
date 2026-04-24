'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storesApi } from '@/lib/api/endpoints';
import type { ApiStoreListItem } from '@/types/api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type StoreStatus = 'Open' | 'Closed';

interface Store {
  id: string;
  name: string;
  type: string;
  address: string;
  status: StoreStatus;
}

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: StoreStatus }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
      }`}
    >
      {status}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StoresPage() {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    storesApi.getMyStores()
      .then((res) => {
        const data = (res.data ?? []) as ApiStoreListItem[];
        setStores(data.map((s) => ({
          id: String(s.id),
          name: s.name,
          type: s.storeType,
          address: '',
          status: s.openStatus ? 'Open' : 'Closed',
        })));
      })
      .catch((err: Error) => setError(err.message ?? 'Failed to load stores.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#0F4C81' }}>My Stores</h1>
          <p className="text-sm text-gray-500 mt-0.5">Click a store to manage it.</p>
        </div>
        <button
          onClick={() => router.push('/seller/stores/new')}
          className="px-4 py-2 rounded text-white text-sm font-medium"
          style={{ backgroundColor: '#FF6B35' }}
        >
          + Add Store
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : stores.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-sm text-gray-400">
          No stores yet. Add your first store.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto bg-white border border-gray-200 rounded-lg">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-3 border-b border-gray-200">Store Name</th>
                  <th className="px-4 py-3 border-b border-gray-200">Type</th>
                  <th className="px-4 py-3 border-b border-gray-200">Address</th>
                  <th className="px-4 py-3 border-b border-gray-200">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stores.map((store) => (
                  <tr
                    key={store.id}
                    onClick={() => router.push(`/seller/stores/${store.id}`)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">{store.name}</td>
                    <td className="px-4 py-3 text-gray-500">{store.type}</td>
                    <td className="px-4 py-3 text-gray-600">{store.address || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={store.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {stores.map((store) => (
              <div
                key={store.id}
                onClick={() => router.push(`/seller/stores/${store.id}`)}
                className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer active:bg-gray-50"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm text-gray-800">{store.name}</p>
                  <StatusBadge status={store.status} />
                </div>
                <p className="text-xs text-gray-500">{store.type}</p>
                <p className="text-xs text-gray-400 mt-0.5">{store.address || '—'}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
