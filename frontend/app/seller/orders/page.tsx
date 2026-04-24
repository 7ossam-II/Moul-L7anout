'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ordersApi } from '@/lib/api/endpoints';
import type { ApiOrder } from '@/types/api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type OrderStatus = 'Pending' | 'Completed' | 'Cancelled';
type PaymentMethod = 'Online' | 'Offline' | 'LKRIDI';

interface Order {
  id: string;
  customer: string;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  date: string;
}

type FilterTab = 'All' | OrderStatus;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mapStatus(s: string): OrderStatus {
  if (s === 'ACCOMPLISHED') return 'Completed';
  if (s === 'REFUNDED' || s === 'cancelled') return 'Cancelled';
  return 'Pending';
}

function mapPayment(m: string): PaymentMethod {
  if (m === 'ONLINE') return 'Online';
  if (m === 'LKRIDI') return 'LKRIDI';
  return 'Offline';
}

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending:   'bg-yellow-100 text-yellow-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-600',
};

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

const PAYMENT_STYLES: Record<PaymentMethod, string> = {
  Online:  'bg-blue-100 text-blue-700',
  Offline: 'bg-gray-100 text-gray-600',
  LKRIDI:  'bg-orange-100 text-orange-700',
};

function PaymentBadge({ method }: { method: PaymentMethod }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PAYMENT_STYLES[method]}`}>
      {method}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const TABS: FilterTab[] = ['All', 'Pending', 'Completed', 'Cancelled'];

export default function SellerOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('All');

  useEffect(() => {
    ordersApi.getAll()
      .then((res) => {
        const data = (res.data ?? []) as ApiOrder[];
        setOrders(data.map((o) => ({
          id: String(o.id),
          customer: String(o.buyerId),
          total: o.totalAmount,
          status: mapStatus(o.orderStatus),
          paymentMethod: mapPayment(o.paymentMethod),
          date: o.createdAt?.split('T')[0] ?? '',
        })));
      })
      .catch((err: Error) => setError(err.message ?? 'Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeTab === 'All'
    ? orders
    : orders.filter((o) => o.status === activeTab);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-1" style={{ color: '#0F4C81' }}>
        Orders
      </h1>
      <p className="text-sm text-gray-500 mb-6">Manage and track your customer orders.</p>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? 'border-blue-800 text-blue-800'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            style={activeTab === tab ? { borderColor: '#0F4C81', color: '#0F4C81' } : {}}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-sm text-gray-400">
          No {activeTab !== 'All' ? activeTab.toLowerCase() : ''} orders found.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-3 border-b border-gray-200">Order ID</th>
                  <th className="px-4 py-3 border-b border-gray-200">Customer</th>
                  <th className="px-4 py-3 border-b border-gray-200">Total (MAD)</th>
                  <th className="px-4 py-3 border-b border-gray-200">Payment</th>
                  <th className="px-4 py-3 border-b border-gray-200">Status</th>
                  <th className="px-4 py-3 border-b border-gray-200">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => router.push(`/seller/orders/${order.id}`)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">{order.id}</td>
                    <td className="px-4 py-3 text-gray-600">{order.customer}</td>
                    <td className="px-4 py-3 text-gray-800">{order.total.toLocaleString()}</td>
                    <td className="px-4 py-3"><PaymentBadge method={order.paymentMethod} /></td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-3 text-gray-500">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {filtered.map((order) => (
              <div
                key={order.id}
                onClick={() => router.push(`/seller/orders/${order.id}`)}
                className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer active:bg-gray-50"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-gray-800">{order.id}</span>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-xs text-gray-500">{order.customer}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>MAD {order.total.toLocaleString()}</span>
                  <PaymentBadge method={order.paymentMethod} />
                  <span>{order.date}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}