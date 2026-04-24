'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storesApi } from '@/lib/api/endpoints';
import type { ApiStoreDetail, ApiStoreListItem } from '@/types/api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StatCard {
  label: string;
  value: number;
  prefix?: string;
}

interface Activity {
  id: number;
  text: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCardItem({ label, value, prefix = '' }: StatCard) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color: '#0F4C81' }}>
        {prefix}{value.toLocaleString()}
      </p>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
      <div className="h-7 bg-gray-200 rounded w-16" />
    </div>
  );
}

function StoreStatusToggle({ storeId, initialOpen }: { storeId: string; initialOpen: boolean }) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  function handleToggle() {
    const next = !isOpen;
    setIsOpen(next);
    storesApi.update(storeId, { isOpen: next } as Parameters<typeof storesApi.update>[1]).catch(() => {
      setIsOpen(!next);
    });
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Store Status:</span>
      <button
        onClick={handleToggle}
        className="px-4 py-1.5 rounded text-sm font-medium text-white transition-colors"
        style={{ backgroundColor: isOpen ? '#0F4C81' : '#6B7280' }}
      >
        {isOpen ? 'Open for Business' : 'Closed'}
      </button>
    </div>
  );
}

function LiveTrackingToggle() {
  const [isTracking, setIsTracking] = useState(false);

  function handleToggle() {
    setIsTracking((v) => !v);
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Live Tracking:</span>
      <button
        onClick={handleToggle}
        className="px-4 py-1.5 rounded text-sm font-medium text-white transition-colors"
        style={{ backgroundColor: isTracking ? '#FF6B35' : '#6B7280' }}
      >
        {isTracking ? 'Tracking On' : 'Tracking Off'}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SellerDashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState<StatCard[]>([]);
  const [activity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firstStore, setFirstStore] = useState<{ id: string; isOpen: boolean } | null>(null);
  const [ratingAvg, setRatingAvg] = useState<number | null>(null);

  useEffect(() => {
    storesApi.getMyStores()
      .then((res) => {
        const stores = (res.data ?? []) as ApiStoreListItem[];
        if (stores.length === 0) { setLoading(false); return; }

        const first = stores[0];
        setFirstStore({ id: String(first.id), isOpen: first.openStatus ?? false });
        setRatingAvg(first.ratingAvg ?? null);

        return storesApi.getStoreStats(String(first.id)).then((statsRes) => {
          const s = statsRes.data;
          if (!s) return;
          setStats([
            { label: 'Total Revenue',     value: s.totalRevenue,    prefix: 'MAD ' },
            { label: 'Pending Orders',    value: s.pendingOrders },
            { label: 'Total Orders',      value: s.totalOrders },
            { label: 'Product Count',     value: s.totalProducts },
            { label: 'Completed Orders',  value: s.deliveredOrders },
            { label: 'Cancelled Orders',  value: s.cancelledOrders },
            { label: 'Store Rating',      value: s.averageRating },
            { label: 'Ready for Pickup',  value: s.readyOrders },
          ]);
        });
      })
      .catch((err: Error) => setError(err.message ?? 'Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  const storeId = firstStore?.id ?? 'demo-store';

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#0F4C81' }}>
            Seller Dashboard
          </h1>
          <p className="text-sm text-gray-500">Welcome back, store owner.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {firstStore && (
            <StoreStatusToggle storeId={firstStore.id} initialOpen={firstStore.isOpen} />
          )}
          <LiveTrackingToggle />
        </div>
      </div>

      {/* Stat Cards */}
      <section>
        <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
          Overview
        </h2>
        {error && (
          <p className="text-sm text-red-500 mb-3">{error}</p>
        )}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <StatCardSkeleton key={i} />)
            : stats.length > 0
              ? stats.map((s) => <StatCardItem key={s.label} {...s} />)
              : !error && <p className="col-span-4 text-sm text-gray-400 text-center py-4">No store data yet.</p>
          }
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => router.push(`/seller/stores/${storeId}/products`)}
            className="px-4 py-2 rounded text-white text-sm font-medium"
            style={{ backgroundColor: '#0F4C81' }}
          >
            Add Product
          </button>
          <button
            onClick={() => router.push('/seller/products')}
            className="px-4 py-2 rounded text-white text-sm font-medium"
            style={{ backgroundColor: '#0F4C81' }}
          >
            Manage Products
          </button>
          <button
            onClick={() => router.push('/seller/orders')}
            className="px-4 py-2 rounded text-white text-sm font-medium"
            style={{ backgroundColor: '#0F4C81' }}
          >
            View Orders
          </button>
          <button
            onClick={() => router.push('/seller/lkridi')}
            className="px-4 py-2 rounded text-white text-sm font-medium"
            style={{ backgroundColor: '#FF6B35' }}
          >
            Manage LKRIDI
          </button>
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
          Recent Activity
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-5 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : activity.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No recent activity.</p>
          ) : (
            <ul className="space-y-2">
              {activity.map((item) => (
                <li key={item.id} className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                  {item.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Earnings & Statistics + Store Rating */}
      <section>
        <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
          Earnings &amp; Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400 sm:col-span-2">
            Earnings charts coming soon — FR7.4
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col justify-between">
            <p className="text-xs text-gray-500 mb-1">Store Rating</p>
            <p className="text-3xl font-bold" style={{ color: '#0F4C81' }}>
              {ratingAvg !== null ? ratingAvg.toFixed(1) : '—'}
              <span className="text-base font-normal text-gray-400">/5</span>
            </p>
            <p className="text-xs text-gray-400 mt-2">From Yahya's API</p>
          </div>
        </div>
      </section>

      {/* Store Performance placeholder */}
      <section>
        <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
          Store Performance
        </h2>
        <div className="bg-white rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
          Most sold products &amp; busy hours — FR7.4
        </div>
      </section>

    </div>
  );
}