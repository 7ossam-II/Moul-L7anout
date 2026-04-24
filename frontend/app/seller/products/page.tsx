'use client';

import { useState, useEffect, useRef } from 'react';
import { productsApi, storesApi } from '@/lib/api/endpoints';
import type { ApiProduct, ApiStoreListItem } from '@/types/api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Product {
  id: string;
  name: string;
  price: number;
  photo: string | null;
  quantity: number | null;
  availability: boolean;
  expectedAvailabilityDate: string | null;
  lkridiEligible: boolean;
  category: string;
}

// ---------------------------------------------------------------------------
// Inline editable cell
// ---------------------------------------------------------------------------

function EditableCell({
  value,
  productId,
  field,
  onSave,
}: {
  value: number | null;
  productId: string;
  field: 'price' | 'quantity';
  onSave: (id: string, field: 'price' | 'quantity', value: number | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value ?? ''));
  const inputRef = useRef<HTMLInputElement>(null);

  function startEdit() {
    setDraft(String(value ?? ''));
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function commit() {
    setEditing(false);
    const parsed = draft === '' ? null : Number(draft);
    if (parsed === value) return;
    onSave(productId, field, parsed);
    productsApi.update(productId, { [field === 'price' ? 'price' : 'quantity']: parsed } as Parameters<typeof productsApi.update>[1]).catch(() => {});
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="number"
        min={0}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        className="w-20 border border-gray-300 rounded px-2 py-0.5 text-sm focus:outline-none focus:border-blue-500"
      />
    );
  }

  return (
    <button
      onClick={startEdit}
      title="Click to edit"
      className="text-sm text-gray-800 hover:bg-gray-100 px-2 py-0.5 rounded cursor-text text-left"
    >
      {value === null ? <span className="text-gray-400 italic">∞</span> : value.toLocaleString()}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Status toggle
// ---------------------------------------------------------------------------

function StatusToggle({
  productId,
  availability,
  onChange,
}: {
  productId: string;
  availability: boolean;
  onChange: (id: string, value: boolean) => void;
}) {
  function handleChange() {
    const next = !availability;
    onChange(productId, next);
    productsApi.update(productId, { inStock: next } as Parameters<typeof productsApi.update>[1]).catch(() => {
      onChange(productId, !next);
    });
  }

  return (
    <button
      onClick={handleChange}
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        availability ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
      }`}
    >
      {availability ? 'Available' : 'Unavailable'}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProductsInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [storeId, setStoreId] = useState('demo-store');

  useEffect(() => {
    storesApi.getMyStores()
      .then((res) => {
        const stores = (res.data ?? []) as ApiStoreListItem[];
        const id = stores[0] ? String(stores[0].id) : 'demo-store';
        setStoreId(id);
        return productsApi.getAll({ storeId: id });
      })
      .then((res) => {
        const data = (res.data ?? []) as ApiProduct[];
        setProducts(data.map((p) => ({
          id: String(p.id),
          name: p.name,
          price: p.price,
          photo: p.photoUrl,
          quantity: null,
          availability: p.availableStatus,
          expectedAvailabilityDate: p.expectedAvailabilityDate,
          lkridiEligible: false,
          category: '',
        })));
      })
      .catch((err: Error) => setError(err.message ?? 'Failed to load products.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleSaveCell(id: string, field: 'price' | 'quantity', value: number | null) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  }

  function handleToggleStatus(id: string, value: boolean) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, availability: value } : p))
    );
  }

  function handleDelete(id: string) {
    productsApi.delete(id).then(() => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }).catch((err: Error) => setError(err.message ?? 'Failed to delete product.'));
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#0F4C81' }}>Product Inventory</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} products · click a price or quantity value to edit inline</p>
        </div>
        <a
          href={`/seller/stores/${storeId}/products`}
          className="px-4 py-2 rounded text-white text-sm font-medium text-center"
          style={{ backgroundColor: '#FF6B35' }}
        >
          + Add Product
        </a>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Search */}
      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product name..."
          className="w-full sm:w-72 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-sm text-gray-400">
          No products match your search.
        </div>
      ) : (
        <>
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-3 border-b border-gray-200 w-12">Image</th>
                  <th className="px-4 py-3 border-b border-gray-200">Name</th>
                  <th className="px-4 py-3 border-b border-gray-200">Category</th>
                  <th className="px-4 py-3 border-b border-gray-200">Price (MAD)</th>
                  <th className="px-4 py-3 border-b border-gray-200">Quantity</th>
                  <th className="px-4 py-3 border-b border-gray-200">LKRIDI</th>
                  <th className="px-4 py-3 border-b border-gray-200">Status</th>
                  <th className="px-4 py-3 border-b border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {product.photo ? (
                        <img src={product.photo} alt={product.name} className="w-9 h-9 rounded object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">IMG</div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{product.name}</td>
                    <td className="px-4 py-3 text-gray-500">{product.category || '—'}</td>
                    <td className="px-4 py-3">
                      <EditableCell value={product.price} productId={product.id} field="price" onSave={handleSaveCell} />
                    </td>
                    <td className="px-4 py-3">
                      <EditableCell value={product.quantity} productId={product.id} field="quantity" onSave={handleSaveCell} />
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.lkridiEligible ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                        {product.lkridiEligible ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusToggle productId={product.id} availability={product.availability} onChange={handleToggleStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <a
                          href={`/seller/stores/${storeId}/products?edit=${product.id}`}
                          className="px-3 py-1 rounded text-white text-xs font-medium"
                          style={{ backgroundColor: '#0F4C81' }}
                        >
                          Edit
                        </a>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-3 py-1 rounded text-xs font-medium border border-red-300 text-red-600 hover:bg-red-50"
                        >
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
            {filtered.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs shrink-0">IMG</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800 truncate">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.category || '—'}</p>
                  </div>
                  <StatusToggle productId={product.id} availability={product.availability} onChange={handleToggleStatus} />
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Price</p>
                    <EditableCell value={product.price} productId={product.id} field="price" onSave={handleSaveCell} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Quantity</p>
                    <EditableCell value={product.quantity} productId={product.id} field="quantity" onSave={handleSaveCell} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">LKRIDI</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.lkridiEligible ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                      {product.lkridiEligible ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/seller/stores/${storeId}/products?edit=${product.id}`}
                    className="flex-1 py-1.5 rounded text-white text-xs font-medium text-center"
                    style={{ backgroundColor: '#0F4C81' }}
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 py-1.5 rounded text-xs font-medium border border-red-300 text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
