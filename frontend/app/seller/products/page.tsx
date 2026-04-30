'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Search, Edit, Trash2, Package, CreditCard, Image as ImageIcon,
  AlertCircle, ChevronLeft, TrendingUp, Grid3x3, List, Star, Download,
  RefreshCw, CheckCircle, XCircle, Eye, Sparkles, Zap, Filter, SlidersHorizontal,
  Tag, Clock, ShoppingCart, Wallet, Box, TrendingDown, ChevronDown,
  Calendar, LineChart, BarChart3, PieChart, Crown, Flame, Award
} from 'lucide-react';
import { productsApi, storesApi } from '@/lib/api/endpoints';
import type { ApiProduct, ApiStoreListItem } from '@/types/api';
import {
  LineChart as ReLineChart,
  Line,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

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
  salesCount?: number;
  rating?: number;
  description?: string;
}

type ViewMode = 'table' | 'grid';
type SortField = 'name' | 'price' | 'sales' | 'rating';
type SortOrder = 'asc' | 'desc';

// ---------------------------------------------------------------------------
// Demo Data for Analytics
// ---------------------------------------------------------------------------

const generateDailySalesData = () => {
  return [
    { day: 'Mon', sales: 45, revenue: 5400 },
    { day: 'Tue', sales: 52, revenue: 6240 },
    { day: 'Wed', sales: 48, revenue: 5760 },
    { day: 'Thu', sales: 61, revenue: 7320 },
    { day: 'Fri', sales: 78, revenue: 9360 },
    { day: 'Sat', sales: 95, revenue: 11400 },
    { day: 'Sun', sales: 67, revenue: 8040 },
  ];
};

const generateMonthlySalesData = () => {
  return [
    { month: 'Jan', sales: 420, revenue: 50400 },
    { month: 'Feb', sales: 380, revenue: 45600 },
    { month: 'Mar', sales: 510, revenue: 61200 },
    { month: 'Apr', sales: 480, revenue: 57600 },
    { month: 'May', sales: 560, revenue: 67200 },
    { month: 'Jun', sales: 620, revenue: 74400 },
  ];
};

const trendingProducts = [
  { id: 1, name: 'Tacos Blkfotlan', sales: 245, growth: '+32%', category: 'Tacos', image: '🌮' },
  { id: 2, name: 'Grilled Chicken', sales: 198, growth: '+28%', category: 'Burgers', image: '🍗' },
  { id: 3, name: 'Merguez Sandwich', sales: 167, growth: '+15%', category: 'Sandwiches', image: '🥙' },
  { id: 4, name: 'Fresh Orange Juice', sales: 143, growth: '+22%', category: 'Beverages', image: '🧃' },
  { id: 5, name: 'Spicy Wings', sales: 128, growth: '+18%', category: 'Sides', image: '🍗' },
];

// ---------------------------------------------------------------------------
// Analytics Components
// ---------------------------------------------------------------------------

function SalesChart({ view }: { view: 'daily' | 'monthly' }) {
  const data = view === 'daily' ? generateDailySalesData() : generateMonthlySalesData();
  const xKey = view === 'daily' ? 'day' : 'month';
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50">
            <LineChart size={14} className="text-emerald-500" />
          </div>
          <h3 className="text-sm font-semibold text-gray-700">Sales Overview</h3>
        </div>
        <span className="text-[10px] text-gray-400">{view === 'daily' ? 'Last 7 days' : 'Last 6 months'}</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0F4C81" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#0F4C81" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey={xKey} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} hide />
          <Tooltip 
            contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            labelStyle={{ fontSize: '11px', fontWeight: 'bold' }}
          />
          <Area type="monotone" dataKey="sales" stroke="#0F4C81" strokeWidth={2} fill="url(#salesGradient)" name="Sales" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function RevenueChart({ view }: { view: 'daily' | 'monthly' }) {
  const data = view === 'daily' ? generateDailySalesData() : generateMonthlySalesData();
  const xKey = view === 'daily' ? 'day' : 'month';
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50">
            <BarChart3 size={14} className="text-blue-500" />
          </div>
          <h3 className="text-sm font-semibold text-gray-700">Revenue</h3>
        </div>
        <span className="text-[10px] text-gray-400">{view === 'daily' ? 'Last 7 days' : 'Last 6 months'}</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <ReBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey={xKey} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} hide />
          <Tooltip 
            contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            labelStyle={{ fontSize: '11px', fontWeight: 'bold' }}
            formatter={(value: number) => [`MAD ${value.toLocaleString()}`, 'Revenue']}
          />
          <Bar dataKey="revenue" fill="#FF6B35" radius={[4, 4, 0, 0]} name="Revenue" />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}

function TrendingProductsList() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-50">
            <Flame size={14} className="text-orange-500" />
          </div>
          <h3 className="text-sm font-semibold text-gray-700">Trending Products</h3>
          <span className="ml-auto text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">This week</span>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {trendingProducts.map((product, idx) => (
          <div key={product.id} className="p-3 hover:bg-gray-50/50 transition-all duration-200 group">
            <div className="flex items-center gap-3">
              <div className="w-8 text-center">
                <span className={`text-xs font-bold ${idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-orange-400' : 'text-gray-300'}`}>
                  #{idx + 1}
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-lg">
                {product.image}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                <p className="text-[10px] text-gray-400">{product.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{product.sales}</p>
                <p className="text-[10px] text-emerald-500">{product.growth}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryStats() {
  const categories = [
    { name: 'Tacos', count: 24, percentage: 35, color: '#0F4C81' },
    { name: 'Burgers', count: 18, percentage: 26, color: '#FF6B35' },
    { name: 'Beverages', count: 15, percentage: 22, color: '#10B981' },
    { name: 'Sides', count: 12, percentage: 17, color: '#8B5CF6' },
  ];
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-purple-50">
          <PieChart size={14} className="text-purple-500" />
        </div>
        <h3 className="text-sm font-semibold text-gray-700">Category Distribution</h3>
      </div>
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.name}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">{cat.name}</span>
              <span className="text-gray-500">{cat.count} products</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Existing Components (simplified for brevity - keep your existing components)
// ---------------------------------------------------------------------------

// Apple-style Simple Search Bar
function AppleStyleSearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="relative">
      <div className="relative">
        <Search 
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200 ${
            isFocused ? 'text-[#0F4C81]' : 'text-gray-400'
          }`} 
          size={18} 
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search"
          className="w-full sm:w-80 pl-11 pr-4 py-2.5 rounded-xl bg-[#F5F5F7] text-sm transition-all duration-200 outline-none"
          style={{
            backgroundColor: isFocused ? '#FFFFFF' : '#F5F5F7',
            boxShadow: isFocused ? '0 0 0 2px rgba(15, 76, 129, 0.15)' : 'none',
          }}
        />
      </div>
    </div>
  );
}

// Apple-style Simple Sort Dropdown
function AppleStyleSortDropdown({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const options = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' },
    { value: 'sales-desc', label: 'Best Selling' },
    { value: 'rating-desc', label: 'Highest Rated' },
  ];
  
  const currentOption = options.find(opt => opt.value === value) || options[0];
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5F5F7] text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-[#EAEAEF] outline-none"
      >
        <span>{currentOption.label}</span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => { onChange(option.value); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                value === option.value ? 'bg-[#0F4C81]/5 text-[#0F4C81] font-medium' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Premium Button
function PremiumButton({ onClick, children, color = '#0F4C81', icon, variant = 'solid' }: { 
  onClick?: () => void; 
  children: React.ReactNode; 
  color?: string;
  icon?: React.ReactNode;
  variant?: 'solid' | 'outline';
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  if (variant === 'outline') {
    return (
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
        style={{
          background: isHovered ? `${color}10` : 'transparent',
          border: `1.5px solid ${color}40`,
          color: color,
        }}
      >
        {icon}
        {children}
      </button>
    );
  }
  
  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
      style={{
        background: `linear-gradient(135deg, ${color}, ${color === '#0F4C81' ? '#1a5c9e' : '#ff7a4a'})`,
        boxShadow: isHovered ? `0 8px 20px -6px ${color}` : `0 2px 8px -4px ${color}`,
      }}
    >
      {icon}
      {children}
    </button>
  );
}

// Keep your existing PremiumEditableCell, PremiumStatusToggle, PremiumProductCard components here
// (they remain the same as in your original code)

// Main Page Component
export default function ProductsInventoryPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [storeId, setStoreId] = useState('demo-store');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'unavailable'>('all');
  const [filterLkridi, setFilterLkridi] = useState<'all' | 'yes' | 'no'>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [chartView, setChartView] = useState<'daily' | 'monthly'>('daily');

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
        setProducts(data.map((p, index) => ({
          id: String(p.id),
          name: p.name,
          price: p.price,
          photo: p.photoUrl,
          quantity: null,
          availability: p.availableStatus,
          expectedAvailabilityDate: p.expectedAvailabilityDate,
          lkridiEligible: index % 2 === 0,
          category: ['Tacos', 'Burgers', 'Sandwiches', 'Beverages', 'Sides', 'Desserts'][index % 6],
          salesCount: Math.floor(Math.random() * 300),
          rating: parseFloat((3 + Math.random() * 2).toFixed(1)),
          description: 'Delicious product made with fresh ingredients.',
        })));
      })
      .catch((err: Error) => setError(err.message ?? 'Failed to load products.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredAndSorted = products
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'available' && p.availability) ||
        (filterStatus === 'unavailable' && !p.availability);
      const matchesLkridi = filterLkridi === 'all' ||
        (filterLkridi === 'yes' && p.lkridiEligible) ||
        (filterLkridi === 'no' && !p.lkridiEligible);
      return matchesSearch && matchesStatus && matchesLkridi;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') comparison = a.name.localeCompare(b.name);
      if (sortField === 'price') comparison = a.price - b.price;
      if (sortField === 'sales') comparison = (a.salesCount || 0) - (b.salesCount || 0);
      if (sortField === 'rating') comparison = (a.rating || 0) - (b.rating || 0);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const stats = {
    total: products.length,
    available: products.filter(p => p.availability).length,
    lkridiEligible: products.filter(p => p.lkridiEligible).length,
    totalValue: products.reduce((sum, p) => sum + p.price, 0),
  };

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
    if (confirm('Are you sure you want to delete this product?')) {
      productsApi.delete(id).then(() => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }).catch((err: Error) => setError(err.message ?? 'Failed to delete product.'));
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/30">
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-[#0F4C81] rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse-slow" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-[#FF6B35] rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse-slow delay-1000" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/60 backdrop-blur-2xl border-b border-white/20 shadow-sm">
        <div className="px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/seller/dashboard')}
                className="p-2.5 rounded-xl hover:bg-white/50 transition-all duration-300 hover:scale-105 group"
              >
                <ChevronLeft size={20} className="text-gray-500 group-hover:text-[#0F4C81]" />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#FF6B35] bg-clip-text text-transparent">
                  Product Inventory
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">Manage your products, prices, and availability</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PremiumButton 
                onClick={() => setShowFilters(!showFilters)} 
                icon={<SlidersHorizontal size={16} />}
                color="#0F4C81"
                variant="outline"
              >
                Filters
              </PremiumButton>
              <PremiumButton 
                onClick={() => router.push(`/seller/stores/${storeId}/products`)} 
                icon={<Plus size={16} />}
                color="#FF6B35"
              >
                Add Product
              </PremiumButton>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout - Left Sidebar + Right Content */}
      <div className="flex flex-col lg:flex-row gap-6 p-6 lg:p-8 max-w-full">
        
        {/* LEFT SIDEBAR - Analytics & Insights */}
        <div className="lg:w-80 space-y-5">
          {/* Chart Toggle */}
          <div className="flex gap-2 bg-white/60 backdrop-blur-sm rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setChartView('daily')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                chartView === 'daily' ? 'bg-[#0F4C81] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setChartView('monthly')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                chartView === 'monthly' ? 'bg-[#0F4C81] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Monthly
            </button>
          </div>

          {/* Sales Chart */}
          <SalesChart view={chartView} />
          
          {/* Revenue Chart */}
          <RevenueChart view={chartView} />
          
          {/* Trending Products */}
          <TrendingProductsList />
          
          {/* Category Distribution */}
          <CategoryStats />
          
          {/* Quick Stats Summary */}
          <div className="bg-gradient-to-r from-[#0F4C81]/5 to-[#FF6B35]/5 rounded-2xl p-4 border border-white/40">
            <div className="flex items-center gap-2 mb-2">
              <Award size={14} className="text-[#0F4C81]" />
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Quick Stats</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Avg. Product Price</span>
                <span className="font-semibold text-gray-800">MAD {Math.round(stats.totalValue / (stats.total || 1))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Top Category</span>
                <span className="font-semibold text-gray-800">Tacos (35%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">LKRIDI Rate</span>
                <span className="font-semibold text-gray-800">{Math.round((stats.lkridiEligible / (stats.total || 1)) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT - Main Product Management */}
        <div className="flex-1 min-w-0 space-y-6">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Total Products</span>
                <Package size={16} className="text-[#0F4C81]" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Available</span>
                <CheckCircle size={16} className="text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.available}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">LKRIDI Eligible</span>
                <Zap size={16} className="text-[#FF6B35]" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.lkridiEligible}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Total Value</span>
                <Wallet size={16} className="text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">MAD {stats.totalValue.toLocaleString()}</p>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <AppleStyleSearchBar value={search} onChange={setSearch} />
            <div className="flex items-center gap-2">
              <AppleStyleSortDropdown 
                value={`${sortField}-${sortOrder}`} 
                onChange={(val) => {
                  const [field, order] = val.split('-');
                  setSortField(field as SortField);
                  setSortOrder(order as SortOrder);
                }} 
              />
              <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white/70">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 px-4 transition-all duration-300 ${viewMode === 'grid' ? 'bg-gradient-to-r from-[#0F4C81] to-[#FF6B35] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <Grid3x3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2.5 px-4 transition-all duration-300 ${viewMode === 'table' ? 'bg-gradient-to-r from-[#0F4C81] to-[#FF6B35] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Filters Panel */}
          <div className={`overflow-hidden transition-all duration-500 ${showFilters ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100 p-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <div className="flex gap-2">
                  {['all', 'available', 'unavailable'].map(status => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status as any)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        filterStatus === status ? 'bg-[#0F4C81] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-600">LKRIDI:</span>
                <div className="flex gap-2">
                  {['all', 'yes', 'no'].map(option => (
                    <button
                      key={option}
                      onClick={() => setFilterLkridi(option as any)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        filterLkridi === option ? 'bg-[#FF6B35] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {option === 'yes' ? 'Enabled' : option === 'no' ? 'Disabled' : 'All'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50/90 backdrop-blur-sm border border-rose-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle size={18} className="text-rose-500" />
              <p className="text-sm text-rose-600">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="bg-white/60 rounded-2xl p-5 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-xl mb-4" />
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredAndSorted.length === 0 && (
            <div className="text-center py-20 bg-white/40 rounded-3xl border border-white/40">
              <Package size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-sm text-gray-400 mb-5">Get started by adding your first product</p>
              <PremiumButton onClick={() => router.push(`/seller/stores/${storeId}/products`)} icon={<Plus size={16} />} color="#FF6B35">
                Add Your First Product
              </PremiumButton>
            </div>
          )}

          {/* Grid View */}
          {!loading && filteredAndSorted.length > 0 && viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredAndSorted.map((product, idx) => (
                <div key={product.id} className="animate-slideIn" style={{ animationDelay: `${idx * 50}ms` }}>
                  <PremiumCutoutCard color={product.lkridiEligible ? '#FF6B35' : '#0F4C81'} accentColor={product.lkridiEligible ? '#0F4C81' : '#FF6B35'}>
                    <div className="p-4">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3">
                        {product.photo ? (
                          <img src={product.photo} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={32} className="text-gray-300" />
                          </div>
                        )}
                        {product.lkridiEligible && (
                          <span className="absolute top-2 right-2 bg-[#FF6B35] text-white text-[10px] px-2 py-0.5 rounded-full">LKRIDI</span>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-800">{product.name}</h3>
                      <p className="text-xs text-gray-400">{product.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xl font-bold text-gray-900">MAD {product.price}</span>
                        <PremiumStatusToggle productId={product.id} availability={product.availability} onChange={handleToggleStatus} />
                      </div>
                    </div>
                  </PremiumCutoutCard>
                </div>
              ))}
            </div>
          )}

          {/* Table View */}
          {!loading && filteredAndSorted.length > 0 && viewMode === 'table' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Product</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Category</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Price</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">LKRIDI</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Sales</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredAndSorted.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">{product.name}</div>
                        </td>
                        <td className="px-5 py-3">{product.category}</td>
                        <td className="px-5 py-3">MAD {product.price}</td>
                        <td className="px-5 py-3">{product.lkridiEligible ? 'Yes' : 'No'}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${product.availability ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                            {product.availability ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="px-5 py-3">{product.salesCount || 0}</td>
                        <td className="px-5 py-3">
                          <div className="flex gap-2">
                            <button className="p-1 text-[#0F4C81]"><Edit size={16} /></button>
                            <button onClick={() => handleDelete(product.id)} className="p-1 text-red-500"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer */}
          {!loading && filteredAndSorted.length > 0 && (
            <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Showing {filteredAndSorted.length} of {products.length} products</span>
              </div>
              <PremiumButton onClick={() => {}} icon={<Download size={14} />} color="#0F4C81" variant="outline">
                Export Report
              </PremiumButton>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.05; transform: scale(1); }
          50% { opacity: 0.08; transform: scale(1.05); }
        }
        .animate-slideIn { animation: slideIn 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards; opacity: 0; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

// Keep these component definitions (they're referenced above)
function PremiumCutoutCard({ children, color = '#0F4C81', accentColor = '#FF6B35' }: { children: React.ReactNode; color?: string; accentColor?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="group relative transition-all duration-500" style={{ transform: isHovered ? 'translateY(-4px)' : 'none' }}>
      <div className="relative overflow-hidden rounded-2xl" style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0% 100%)" }}>
        <div className="relative bg-white/90 border border-gray-100 shadow-md">{children}</div>
      </div>
      <div className="absolute bottom-0 right-0 w-[48px] h-[48px] flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: `linear-gradient(135deg, transparent 50%, ${color} 50%)`, borderBottomRightRadius: '14px' }}>
        <Sparkles size={14} className="text-white" />
      </div>
    </div>
  );
}

function PremiumStatusToggle({ productId, availability, onChange }: { productId: string; availability: boolean; onChange: (id: string, value: boolean) => void }) {
  return (
    <button onClick={() => onChange(productId, !availability)} className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${availability ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
      <div className="flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${availability ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
        {availability ? 'Available' : 'Unavailable'}
      </div>
    </button>
  );
}