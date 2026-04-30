'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Types (mirrors global orders page)
// ---------------------------------------------------------------------------

type OrderStatus = 'Pending' | 'Completed' | 'Cancelled';

interface Order {
  id: string;
  customer: string;
  total: number;
  status: OrderStatus;
  date: string;
}

// ---------------------------------------------------------------------------
// Dummy data keyed by storeId
// ---------------------------------------------------------------------------

const DUMMY_ORDERS_BY_STORE: Record<string, Order[]> = {
  'store-001': [
    { id: 'ORD-101', customer: 'Youssef El Amrani',    total: 320,  status: 'Pending',   date: '2026-04-22' },
    { id: 'ORD-102', customer: 'Fatima Zahra Benhida', total: 85,   status: 'Completed', date: '2026-04-21' },
    { id: 'ORD-103', customer: 'Karim Tazi',           total: 210,  status: 'Cancelled', date: '2026-04-20' },
  ],
  'store-002': [
    { id: 'ORD-201', customer: 'Nadia Benali',         total: 140,  status: 'Completed', date: '2026-04-22' },
    { id: 'ORD-202', customer: 'Omar Chraibi',         total: 95,   status: 'Pending',   date: '2026-04-21' },
  ],
  'store-003': [
    { id: 'ORD-301', customer: 'Salma Idrissi',        total: 450,  status: 'Pending',   date: '2026-04-20' },
  ],
  'demo-store': [
    { id: 'ORD-001', customer: 'Youssef El Amrani',    total: 320,  status: 'Pending',   date: '2026-04-22' },
    { id: 'ORD-002', customer: 'Fatima Zahra Benhida', total: 850,  status: 'Completed', date: '2026-04-21' },
  ],
};

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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StoreOrdersPage() {
  const { storeId } = useParams() as { storeId: string };
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Fetching orders for store', storeId);
    // TODO: axios GET /api/seller/stores/:storeId/orders
    const t = setTimeout(() => {
      setOrders(DUMMY_ORDERS_BY_STORE[storeId] ?? []);
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, [storeId]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Link href={`/seller/stores/${storeId}`} className="text-sm hover:underline" style={{ color: '#0F4C81' }}>
        ← Back to Store
      </Link>

      <h1 className="text-2xl font-bold" style={{ color: '#0F4C81' }}>Orders</h1>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-sm text-gray-400">
          No orders for this store yet.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto bg-white border border-gray-200 rounded-lg">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-3 border-b border-gray-200">Order ID</th>
                  <th className="px-4 py-3 border-b border-gray-200">Customer</th>
                  <th className="px-4 py-3 border-b border-gray-200">Total (MAD)</th>
                  <th className="px-4 py-3 border-b border-gray-200">Status</th>
                  <th className="px-4 py-3 border-b border-gray-200">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{order.id}</td>
                    <td className="px-4 py-3 text-gray-600">{order.customer}</td>
                    <td className="px-4 py-3 text-gray-800">{order.total.toLocaleString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-3 text-gray-500">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-gray-800">{order.id}</span>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-xs text-gray-500">{order.customer}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>MAD {order.total.toLocaleString()}</span>
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
