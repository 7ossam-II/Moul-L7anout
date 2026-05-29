'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type StoreStatus = 'Open' | 'Closed';

interface StoreDetail {
  id: string;
  name: string;
  type: string;
  address: string;
  status: StoreStatus;
  phone: string;
  lkridiEnabled: boolean;
  deliveryAvailable: boolean;
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const DUMMY_STORES: Record<string, StoreDetail> = {
  'store-001': {
    id: 'store-001', name: 'Tacos Maarif',    type: 'Fast Food',  address: 'Rue Maarif, Casablanca',
    status: 'Open',   phone: '0661234567', lkridiEnabled: false, deliveryAvailable: true,
  },
  'store-002': {
    id: 'store-002', name: 'Lkhodra Express', type: 'Vegetables', address: 'Souk Hay Mohammadi, Casa',
    status: 'Open',   phone: '0698765432', lkridiEnabled: true,  deliveryAvailable: true,
  },
  'store-003': {
    id: 'store-003', name: 'Bzar El Attar',   type: 'Spices',     address: 'Médina, Fès',
    status: 'Closed', phone: '0712345678', lkridiEnabled: true,  deliveryAvailable: false,
  },
  'demo-store': {
    id: 'demo-store', name: 'Demo Store',     type: 'General',    address: 'Test Address, Casablanca',
    status: 'Open',   phone: '0600000000', lkridiEnabled: false, deliveryAvailable: false,
  },
};

// ---------------------------------------------------------------------------
// Detail row helper
// ---------------------------------------------------------------------------

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-3 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-500 uppercase tracking-wide w-40 shrink-0">{label}</span>
      <span className="text-sm text-gray-800">{children}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StoreDetailPage() {
  const { storeId } = useParams() as { storeId: string };
  const [store, setStore] = useState<StoreDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    console.log('Fetching store details for', storeId);
    // TODO: axios GET /api/seller/stores/:storeId
    const t = setTimeout(() => {
      const found = DUMMY_STORES[storeId];
      found ? setStore(found) : setNotFound(true);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, [storeId]);

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4 animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-5 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !store) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        <Link href="/seller/stores" className="text-sm hover:underline" style={{ color: '#0F4C81' }}>
          ← Back to Stores
        </Link>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center text-sm text-yellow-800">
          Store <span className="font-mono">{storeId}</span> not found.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Link href="/seller/stores" className="text-sm hover:underline" style={{ color: '#0F4C81' }}>
        ← Back to Stores
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: '#0F4C81' }}>{store.name}</h1>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            store.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {store.status}
        </span>
      </div>

      {/* Store details */}
      <div className="bg-white border border-gray-200 rounded-lg px-5 py-2">
        <DetailRow label="Type">{store.type}</DetailRow>
        <DetailRow label="Address">{store.address}</DetailRow>
        <DetailRow label="Phone">{store.phone}</DetailRow>
        <DetailRow label="LKRIDI">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${store.lkridiEnabled ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
            {store.lkridiEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </DetailRow>
        <DetailRow label="Delivery">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${store.deliveryAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
            {store.deliveryAvailable ? 'Available' : 'Not available'}
          </span>
        </DetailRow>
      </div>

      {/* Management links */}
      <div>
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Manage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href={`/seller/stores/${store.id}/products`}
            className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300"
          >
            <p className="font-medium text-sm text-gray-800">Products</p>
            <p className="text-xs text-gray-400 mt-0.5">Add, edit, or remove products for this store.</p>
          </Link>
          <Link
            href={`/seller/stores/${store.id}/orders`}
            className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300"
          >
            <p className="font-medium text-sm text-gray-800">Orders</p>
            <p className="text-xs text-gray-400 mt-0.5">View and manage orders for this store.</p>
          </Link>
          <Link
            href="/seller/lkridi"
            className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300"
          >
            <p className="font-medium text-sm text-gray-800">LKRIDI</p>
            <p className="text-xs text-gray-400 mt-0.5">Manage loan requests and membership.</p>
          </Link>
          <Link
            href="/seller/workers"
            className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300"
          >
            <p className="font-medium text-sm text-gray-800">Cashiers</p>
            <p className="text-xs text-gray-400 mt-0.5">Manage cashier accounts for this store.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
