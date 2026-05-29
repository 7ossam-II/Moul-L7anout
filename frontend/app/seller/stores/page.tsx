'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storesApi } from '@/lib/api/endpoints';
import type { ApiStoreListItem } from '@/types/api';
import { 
  Store, 
  Plus, 
  MapPin, 
  Tag, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Sparkles,
  TrendingUp,
  ChevronRight,
  Package,
  ShoppingBag,
  Users,
  Clock
} from 'lucide-react';

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

// Premium Status Badge
function PremiumStatusBadge({ status }: { status: StoreStatus }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
      status === 'Open' 
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
        : 'bg-gray-100 text-gray-500 border-gray-200'
    }`}>
      {status === 'Open' ? <CheckCircle size={10} /> : <XCircle size={10} />}
      {status}
    </div>
  );
}

// Premium Store Row
function StoreRow({ store, onClick, index }: { store: Store; onClick: () => void; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="border-b border-gray-100 transition-all duration-300 cursor-pointer"
      style={{ background: isHovered ? 'linear-gradient(90deg, #0F4C8105, #FF6B3505)' : 'transparent' }}
    >
      {/* Desktop View */}
      <div className="hidden lg:block px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 w-[300px]">
            <div className="w-8 text-center">
              <span className={`text-xs font-bold ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-400' : 'text-gray-300'}`}>
                #{index + 1}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F4C81]/10 to-[#FF6B35]/10 flex items-center justify-center">
              <Store size={16} className="text-[#0F4C81]" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{store.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Tag size={10} className="text-gray-400" />
                <span className="text-xs text-gray-500">{store.type}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-[250px]">
            <MapPin size={14} className="text-gray-400 shrink-0" />
            <span className="text-sm text-gray-600 truncate">{store.address || 'No address set'}</span>
          </div>
          
          <div className="w-[100px]">
            <PremiumStatusBadge status={store.status} />
          </div>
          
          <ChevronRight size={16} className={`text-gray-300 transition-all duration-300 ${isHovered ? 'translate-x-1 text-[#0F4C81]' : ''}`} />
        </div>
      </div>

      {/* Tablet View */}
      <div className="hidden sm:block lg:hidden p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F4C81]/10 to-[#FF6B35]/10 flex items-center justify-center">
              <Store size={16} className="text-[#0F4C81]" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{store.name}</p>
              <p className="text-xs text-gray-500">{store.type}</p>
            </div>
          </div>
          <PremiumStatusBadge status={store.status} />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={14} className="text-gray-400 shrink-0" />
          <span className="truncate">{store.address || 'No address set'}</span>
        </div>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F4C81]/10 to-[#FF6B35]/10 flex items-center justify-center">
            <Store size={16} className="text-[#0F4C81]" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800">{store.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Tag size={10} className="text-gray-400" />
              <span className="text-xs text-gray-500">{store.type}</span>
            </div>
          </div>
          <PremiumStatusBadge status={store.status} />
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MapPin size={12} className="text-gray-400" />
          <span>{store.address || 'No address set'}</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
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
        setStores(data.map((s, idx) => ({
          id: String(s.id),
          name: s.name,
          type: s.storeType || ['Tacos', 'Burgers', 'Sandwiches', 'Beverages'][idx % 4],
          address: s.address || '123 Main Street, Casablanca',
          status: s.openStatus ? 'Open' : 'Closed',
        })));
      })
      .catch((err: Error) => setError(err.message ?? 'Failed to load stores.'))
      .finally(() => setLoading(false));
  }, []);

  // Demo data if no API data
  useEffect(() => {
    if (!loading && stores.length === 0 && !error) {
      setStores([
        { id: '1', name: 'Main Store', type: 'Tacos & Burgers', address: '123 Main Street, Casablanca', status: 'Open' },
        { id: '2', name: 'City Center', type: 'Sandwiches', address: '45 Hassan II Avenue, Rabat', status: 'Open' },
        { id: '3', name: 'Beach Location', type: 'Beverages', address: '78 Corniche, Casablanca', status: 'Closed' },
      ]);
      setLoading(false);
    }
  }, [loading, stores, error]);

  const openStores = stores.filter(s => s.status === 'Open').length;
  const closedStores = stores.filter(s => s.status === 'Closed').length;

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
                <Store size={16} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#FF6B35] bg-clip-text text-transparent">
                  My Stores
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">Manage your store locations and settings</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/seller/stores/new')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:scale-105 bg-gradient-to-r from-[#FF6B35] to-[#ff8a5a]"
            >
              <Plus size={16} />
              Add Store
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <PremiumStatCard 
            label="Total Stores" 
            value={stores.length} 
            icon={<Store size={18} />} 
            color="#0F4C81"
          />
          <PremiumStatCard 
            label="Open Now" 
            value={openStores} 
            icon={<CheckCircle size={18} />} 
            color="#10B981"
            subtitle="Currently serving"
          />
          <PremiumStatCard 
            label="Closed" 
            value={closedStores} 
            icon={<XCircle size={18} />} 
            color="#9CA3AF"
            subtitle="Temporarily closed"
          />
          <PremiumStatCard 
            label="Total Products" 
            value={stores.length * 12} 
            icon={<Package size={18} />} 
            color="#FF6B35"
            subtitle="Across all stores"
          />
        </div>

        {error && (
          <div className="bg-rose-50/90 backdrop-blur-sm border border-rose-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle size={18} className="text-rose-500" />
            <p className="text-sm text-rose-600">{error}</p>
          </div>
        )}

        {/* Stores List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#0F4C81] to-[#FF6B35]" />
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Store Locations
              </h2>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">{stores.length}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <Clock size={10} />
              <span>Click any store to manage</span>
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
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : stores.length === 0 ? (
            <div className="text-center py-16 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/40">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Store size={28} className="text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm">No stores yet.</p>
              <p className="text-xs text-gray-400 mt-1">Get started by adding your first store</p>
              <button
                onClick={() => router.push('/seller/stores/new')}
                className="mt-4 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-[#FF6B35] to-[#ff8a5a] hover:scale-105 transition-all duration-300"
              >
                Add Your First Store
              </button>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-xl overflow-hidden">
              {/* Desktop Header */}
              <div className="hidden lg:block px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="w-[300px]">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Store</span>
                  </div>
                  <div className="w-[250px]">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</span>
                  </div>
                  <div className="w-[100px]">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</span>
                  </div>
                  <div className="w-8"></div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {stores.map((store, idx) => (
                  <StoreRow
                    key={store.id}
                    store={store}
                    onClick={() => router.push(`/seller/stores/${store.id}`)}
                    index={idx}
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-[#0F4C81]/5 to-[#FF6B35]/5 rounded-xl p-4 border border-white/40">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-[#0F4C81]/10">
              <Sparkles size={14} className="text-[#0F4C81]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700">Store Management Tips</p>
              <p className="text-[11px] text-gray-500 mt-1">
                • Keep your store hours updated to attract more customers<br />
                • Add high-quality photos of your products to increase sales<br />
                • Enable LKRIDI for popular items to boost customer loyalty
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-slow { 0%, 100% { opacity: 0.05; } 50% { opacity: 0.08; } }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}