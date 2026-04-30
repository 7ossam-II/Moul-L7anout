'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  XCircle,
  Search,
  Calendar,
  ChevronLeft,
  Eye,
  Download,
  RefreshCw,
  CreditCard,
  Wallet,
  User,
  AlertCircle,
  Zap,
  TrendingUp,
  TrendingDown,
  Filter,
  BarChart3,
  LineChart,
  PieChart,
  Users,
  Package,
  Award,
  Flame,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ordersApi } from '@/lib/api/endpoints';
import type { ApiOrder } from '@/types/api';
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

type OrderStatus = 'Pending' | 'Completed' | 'Cancelled';
type PaymentMethod = 'Online' | 'Offline' | 'LKRIDI';
type ChartTimeRange = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface Order {
  id: string;
  customer: string;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  date: string;
  createdAt?: string;
}

interface CustomerWithOrders {
  customerId: string;
  customerName: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
  orders: Order[];
}

type FilterTab = 'All' | OrderStatus;

// ---------------------------------------------------------------------------
// Demo Data for Chart
// ---------------------------------------------------------------------------

const generateDailyData = () => {
  return [
    { date: 'Mon', orders: 12, revenue: 3600 },
    { date: 'Tue', orders: 15, revenue: 4500 },
    { date: 'Wed', orders: 10, revenue: 3000 },
    { date: 'Thu', orders: 18, revenue: 5400 },
    { date: 'Fri', orders: 25, revenue: 7500 },
    { date: 'Sat', orders: 30, revenue: 9000 },
    { date: 'Sun', orders: 22, revenue: 6600 },
  ];
};

const generateWeeklyData = () => {
  return [
    { week: 'Week 1', orders: 85, revenue: 25500 },
    { week: 'Week 2', orders: 92, revenue: 27600 },
    { week: 'Week 3', orders: 78, revenue: 23400 },
    { week: 'Week 4', orders: 105, revenue: 31500 },
  ];
};

const generateMonthlyData = () => {
  return [
    { month: 'Jan', orders: 320, revenue: 96000 },
    { month: 'Feb', orders: 290, revenue: 87000 },
    { month: 'Mar', orders: 410, revenue: 123000 },
    { month: 'Apr', orders: 380, revenue: 114000 },
    { month: 'May', orders: 450, revenue: 135000 },
    { month: 'Jun', orders: 520, revenue: 156000 },
  ];
};

const generateYearlyData = () => {
  return [
    { year: '2020', orders: 1800, revenue: 540000 },
    { year: '2021', orders: 2100, revenue: 630000 },
    { year: '2022', orders: 2800, revenue: 840000 },
    { year: '2023', orders: 3500, revenue: 1050000 },
    { year: '2024', orders: 2200, revenue: 660000 },
  ];
};

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
// Chart Components (simplified)
// ---------------------------------------------------------------------------

function OrdersChart({ timeRange }: { timeRange: ChartTimeRange }) {
  const getData = () => {
    switch (timeRange) {
      case 'daily': return generateDailyData();
      case 'weekly': return generateWeeklyData();
      case 'monthly': return generateMonthlyData();
      case 'yearly': return generateYearlyData();
      default: return generateMonthlyData();
    }
  };
  
  const data = getData();
  const xKey = timeRange === 'daily' ? 'date' : timeRange === 'weekly' ? 'week' : timeRange === 'monthly' ? 'month' : 'year';
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50"><LineChart size={14} className="text-blue-500" /></div>
          <h3 className="text-sm font-semibold text-gray-700">Orders Overview</h3>
        </div>
        <span className="text-[10px] text-gray-400">{timeRange === 'daily' ? 'Last 7 days' : timeRange === 'weekly' ? 'Last 4 weeks' : timeRange === 'monthly' ? 'Last 6 months' : 'Last 5 years'}</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs><linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0F4C81" stopOpacity={0.3}/><stop offset="95%" stopColor="#0F4C81" stopOpacity={0}/></linearGradient></defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey={xKey} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} labelStyle={{ fontSize: '11px' }} formatter={(value: number) => [`${value} orders`, 'Orders']} />
          <Area type="monotone" dataKey="orders" stroke="#0F4C81" strokeWidth={2} fill="url(#orderGradient)" name="Orders" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function RevenueChart({ timeRange }: { timeRange: ChartTimeRange }) {
  const getData = () => {
    switch (timeRange) {
      case 'daily': return generateDailyData();
      case 'weekly': return generateWeeklyData();
      case 'monthly': return generateMonthlyData();
      case 'yearly': return generateYearlyData();
      default: return generateMonthlyData();
    }
  };
  
  const data = getData();
  const xKey = timeRange === 'daily' ? 'date' : timeRange === 'weekly' ? 'week' : timeRange === 'monthly' ? 'month' : 'year';
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50"><BarChart3 size={14} className="text-emerald-500" /></div>
          <h3 className="text-sm font-semibold text-gray-700">Revenue</h3>
        </div>
        <span className="text-[10px] text-gray-400">{timeRange === 'daily' ? 'Last 7 days' : timeRange === 'weekly' ? 'Last 4 weeks' : timeRange === 'monthly' ? 'Last 6 months' : 'Last 5 years'}</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <ReBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey={xKey} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} labelStyle={{ fontSize: '11px' }} formatter={(value: number) => [`MAD ${value.toLocaleString()}`, 'Revenue']} />
          <Bar dataKey="revenue" fill="#FF6B35" radius={[4, 4, 0, 0]} name="Revenue" />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ENHANCED Customer Orders Component - Shows ALL customers with their orders
// ---------------------------------------------------------------------------

function EnhancedCustomerOrdersList({ orders }: { orders: Order[] }) {
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
  
  // Aggregate orders by customer with their full order history
  const customerMap = new Map<string, { orders: Order[]; totalSpent: number; lastOrderDate: string }>();
  
  orders.forEach(order => {
    const existing = customerMap.get(order.customer);
    if (existing) {
      existing.orders.push(order);
      existing.totalSpent += order.total;
      if (order.date > existing.lastOrderDate) existing.lastOrderDate = order.date;
    } else {
      customerMap.set(order.customer, {
        orders: [order],
        totalSpent: order.total,
        lastOrderDate: order.date
      });
    }
  });
  
  const customers: CustomerWithOrders[] = Array.from(customerMap.entries())
    .map(([customerId, data]) => ({
      customerId,
      customerName: customerId,
      orderCount: data.orders.length,
      totalSpent: data.totalSpent,
      lastOrderDate: data.lastOrderDate,
      orders: data.orders.sort((a, b) => b.date.localeCompare(a.date))
    }))
    .sort((a, b) => b.orderCount - a.orderCount);
  
  if (customers.length === 0) return null;
  
  const toggleCustomer = (customerId: string) => {
    setExpandedCustomer(expandedCustomer === customerId ? null : customerId);
  };
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-50">
            <Users size={14} className="text-purple-500" />
          </div>
          <h3 className="text-sm font-semibold text-gray-700">All Customers</h3>
          <span className="ml-auto text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{customers.length} customers</span>
        </div>
        <p className="text-[10px] text-gray-400 mt-1">Click on a customer to see their order history</p>
      </div>
      
      <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
        {customers.map((customer, idx) => (
          <div key={customer.customerId} className="transition-all duration-200">
            {/* Customer Header */}
            <div 
              onClick={() => toggleCustomer(customer.customerId)}
              className="p-3 hover:bg-gray-50/50 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 text-center">
                  <span className={`text-xs font-bold ${idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-orange-400' : 'text-gray-300'}`}>
                    #{idx + 1}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0F4C81]/10 to-[#FF6B35]/10 flex items-center justify-center">
                  <User size={14} className="text-[#0F4C81]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{customer.customerName}</p>
                  <p className="text-[10px] text-gray-400">Last order: {customer.lastOrderDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{customer.orderCount}</p>
                  <p className="text-[10px] text-gray-400">orders</p>
                </div>
                <div className="text-right mr-2">
                  <p className="text-sm font-semibold text-[#0F4C81]">MAD {customer.totalSpent.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400">total spent</p>
                </div>
                {expandedCustomer === customer.customerId ? (
                  <ChevronUp size={16} className="text-gray-400" />
                ) : (
                  <ChevronDown size={16} className="text-gray-400" />
                )}
              </div>
              <div className="mt-2 ml-11">
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>Order frequency</span>
                  <span className="font-medium">{Math.round((customer.orderCount / (customers[0]?.orderCount || 1)) * 100)}% of top customer</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#0F4C81] to-[#FF6B35]" style={{ width: `${Math.min(100, (customer.orderCount / (customers[0]?.orderCount || 1)) * 100)}%` }} />
                </div>
              </div>
            </div>
            
            {/* Expanded Order Details */}
            {expandedCustomer === customer.customerId && (
              <div className="bg-gray-50/50 p-3 border-t border-gray-100 animate-fadeIn">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Order History</p>
                <div className="space-y-2">
                  {customer.orders.map((order) => (
                    <div 
                      key={order.id} 
                      onClick={(e) => { e.stopPropagation(); window.location.href = `/seller/orders/${order.id}`; }}
                      className="bg-white rounded-xl p-2 flex items-center justify-between cursor-pointer hover:shadow-md transition-all duration-200 group/order"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#0F4C81]/5 flex items-center justify-center">
                          <ShoppingBag size={12} className="text-[#0F4C81]" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-700">#{order.id.slice(0, 8)}</p>
                          <p className="text-[9px] text-gray-400 flex items-center gap-1"><Calendar size={8} />{order.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <PaymentBadge method={order.paymentMethod} />
                        <StatusBadge status={order.status} />
                        <span className="text-sm font-bold text-gray-900">MAD {order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-gray-100 bg-white/30">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Total customers</span>
          <span className="font-semibold text-gray-800">{customers.length}</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-gray-500">Total orders</span>
          <span className="font-semibold text-gray-800">{orders.length}</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-gray-500">Total revenue</span>
          <span className="font-semibold text-gray-800">MAD {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

// Quick Stats Card
function QuickStatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-3">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${color}15` }}>{icon}</div>
        <div className="flex-1">
          <p className="text-[10px] text-gray-500">{label}</p>
          <p className="text-sm font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

// Premium Components
function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
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
        <div className="absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-500 w-0 group-hover:w-full" style={{ background: `linear-gradient(90deg, ${color}, ${color === '#0F4C81' ? '#FF6B35' : color})` }} />
      </div>
    </div>
  );
}

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="relative">
      <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200 ${isFocused ? 'text-[#0F4C81]' : 'text-gray-400'}`} size={18} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search orders by ID or customer..."
        className="w-full sm:w-80 pl-11 pr-4 py-2.5 rounded-xl bg-[#F5F5F7] text-sm transition-all duration-200 outline-none"
        style={{ backgroundColor: isFocused ? '#FFFFFF' : '#F5F5F7', boxShadow: isFocused ? '0 0 0 2px rgba(15, 76, 129, 0.15)' : 'none' }}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles = {
    Pending: { bg: 'bg-amber-50', text: 'text-amber-700', icon: <Clock size={10} /> },
    Completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: <CheckCircle size={10} /> },
    Cancelled: { bg: 'bg-rose-50', text: 'text-rose-600', icon: <XCircle size={10} /> },
  };
  const style = styles[status];
  return <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>{style.icon}{status}</div>;
}

function PaymentBadge({ method }: { method: PaymentMethod }) {
  const styles = {
    Online: { bg: 'bg-blue-50', text: 'text-blue-700', icon: <CreditCard size={10} /> },
    Offline: { bg: 'bg-gray-100', text: 'text-gray-600', icon: <Wallet size={10} /> },
    LKRIDI: { bg: 'bg-orange-50', text: 'text-orange-700', icon: <Zap size={10} /> },
  };
  const style = styles[method];
  return <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>{style.icon}{method}</div>;
}

function PremiumButton({ onClick, children, color = '#0F4C81', icon, variant = 'solid' }: { onClick?: () => void; children: React.ReactNode; color?: string; icon?: React.ReactNode; variant?: 'solid' | 'outline' }) {
  const [isHovered, setIsHovered] = useState(false);
  if (variant === 'outline') {
    return (
      <button onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={onClick}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
        style={{ background: isHovered ? `${color}10` : 'transparent', border: `1.5px solid ${color}40`, color: color, transform: isHovered ? 'translateY(-1px)' : 'translateY(0)' }}>
        {icon}{children}
      </button>
    );
  }
  return (
    <button onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={onClick}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-300"
      style={{ background: `linear-gradient(135deg, ${color}, ${color === '#0F4C81' ? '#1a5c9e' : '#ff7a4a'})`, boxShadow: isHovered ? `0 8px 20px -6px ${color}` : `0 2px 8px -4px ${color}`, transform: isHovered ? 'translateY(-2px)' : 'translateY(0)' }}>
      {icon}{children}
    </button>
  );
}

function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-4 cursor-pointer transition-all duration-300 shadow-sm"
      style={{ transform: isHovered ? 'translateY(-2px)' : 'none', boxShadow: isHovered ? '0 8px 25px -8px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0F4C81]/10 to-[#FF6B35]/10 flex items-center justify-center"><ShoppingBag size={14} className="text-[#0F4C81]" /></div>
          <span className="font-semibold text-gray-800">#{order.id.slice(0, 8)}</span>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2"><User size={12} className="text-gray-400" /><span className="text-xs">{order.customer}</span></div>
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
        <div><span className="text-lg font-bold text-gray-900">MAD {order.total.toLocaleString()}</span></div>
        <div className="flex items-center gap-2">
          <PaymentBadge method={order.paymentMethod} />
          <div className="flex items-center gap-1 text-xs text-gray-400"><Calendar size={10} /><span>{order.date}</span></div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

const TABS: FilterTab[] = ['All', 'Pending', 'Completed', 'Cancelled'];

export default function SellerOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chartTimeRange, setChartTimeRange] = useState<ChartTimeRange>('monthly');

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
          createdAt: o.createdAt,
        })));
      })
      .catch((err: Error) => setError(err.message ?? 'Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
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
          createdAt: o.createdAt,
        })));
      })
      .catch((err: Error) => setError(err.message ?? 'Failed to load orders.'))
      .finally(() => setIsRefreshing(false));
  };

  const filtered = (activeTab === 'All' ? orders : orders.filter((o) => o.status === activeTab))
    .filter((o) => o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.customer.toLowerCase().includes(searchQuery.toLowerCase()));

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    completed: orders.filter(o => o.status === 'Completed').length,
    cancelled: orders.filter(o => o.status === 'Cancelled').length,
    totalRevenue: orders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + o.total, 0),
  };

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
              <button onClick={() => router.push('/seller/dashboard')} className="p-2.5 rounded-xl hover:bg-white/50 transition-all duration-300 hover:scale-105 group">
                <ChevronLeft size={20} className="text-gray-500 group-hover:text-[#0F4C81]" />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#FF6B35] bg-clip-text text-transparent">Orders</h1>
                <p className="text-sm text-gray-500 mt-0.5">Manage and track your customer orders</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleRefresh} disabled={isRefreshing} className="p-2.5 rounded-xl hover:bg-white/50 transition-all duration-300">
                <RefreshCw size={18} className={`text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <PremiumButton onClick={() => {}} icon={<Download size={16} />} color="#0F4C81" variant="outline">Export</PremiumButton>
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-6 p-6 lg:p-8 max-w-full">
        
        {/* LEFT COLUMN - Orders Management */}
        <div className="flex-1 min-w-0 space-y-6">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard label="Total Orders" value={stats.total} icon={<ShoppingBag size={18} className="text-[#0F4C81]" />} color="#0F4C81" />
            <StatCard label="Pending" value={stats.pending} icon={<Clock size={18} className="text-amber-500" />} color="#F59E0B" />
            <StatCard label="Completed" value={stats.completed} icon={<CheckCircle size={18} className="text-emerald-500" />} color="#10B981" />
            <StatCard label="Cancelled" value={stats.cancelled} icon={<XCircle size={18} className="text-rose-500" />} color="#EF4444" />
            <StatCard label="Revenue" value={stats.totalRevenue} icon={<Wallet size={18} className="text-purple-500" />} color="#8B5CF6" />
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <div className="flex gap-1.5 bg-white/60 backdrop-blur-sm rounded-xl p-1 shadow-sm">
              {TABS.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${activeTab === tab ? 'bg-gradient-to-r from-[#0F4C81] to-[#FF6B35] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="bg-rose-50/90 backdrop-blur-sm border border-rose-200 rounded-xl p-4 flex items-center gap-3"><AlertCircle size={18} className="text-rose-500" /><p className="text-sm text-rose-600">{error}</p></div>}

          {/* Loading State */}
          {loading && (
            <div className="space-y-3">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 animate-pulse">
                  <div className="flex items-center gap-4"><div className="w-12 h-12 bg-gray-200 rounded-xl" /><div className="flex-1 space-y-2"><div className="h-4 bg-gray-200 rounded w-1/4" /><div className="h-3 bg-gray-200 rounded w-1/3" /></div></div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/40">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-5"><ShoppingBag size={40} className="text-gray-300" /></div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No orders found</h3>
              <p className="text-sm text-gray-400 mb-5">{searchQuery ? 'Try a different search term' : `No ${activeTab !== 'All' ? activeTab.toLowerCase() : ''} orders found`}</p>
            </div>
          )}

          {/* Desktop Table View */}
          {!loading && filtered.length > 0 && (
            <div className="hidden lg:block bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-gray-100/50">
                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total (MAD)</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((order) => (
                      <tr key={order.id} className="hover:bg-gradient-to-r hover:from-[#0F4C81]/5 hover:to-[#FF6B35]/5 transition-all duration-300 group cursor-pointer" onClick={() => router.push(`/seller/orders/${order.id}`)}>
                        <td className="px-5 py-4"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-[#0F4C81]/10 flex items-center justify-center"><ShoppingBag size={14} className="text-[#0F4C81]" /></div><span className="font-medium text-gray-800">#{order.id.slice(0, 8)}</span></div></td>
                        <td className="px-5 py-4"><div className="flex items-center gap-2"><User size={14} className="text-gray-400" /><span className="text-gray-600">{order.customer}</span></div></td>
                        <td className="px-5 py-4"><span className="font-semibold text-gray-900">{order.total.toLocaleString()}</span></td>
                        <td className="px-5 py-4"><PaymentBadge method={order.paymentMethod} /></td>
                        <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                        <td className="px-5 py-4"><div className="flex items-center gap-1 text-gray-400"><Calendar size={12} /><span className="text-sm">{order.date}</span></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Mobile Card View */}
          {!loading && filtered.length > 0 && (
            <div className="lg:hidden space-y-3">
              {filtered.map((order) => (<OrderCard key={order.id} order={order} onClick={() => router.push(`/seller/orders/${order.id}`)} />))}
            </div>
          )}

          {/* Footer */}
          {!loading && filtered.length > 0 && (
            <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span>Showing {filtered.length} of {orders.length} orders</span></div>
              <div className="flex items-center gap-1"><Clock size={12} /><span>Last updated: Today</span></div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR - Charts & Customer Insights */}
        <div className="lg:w-[420px] space-y-5">
          
          {/* Chart Time Range Toggle */}
          <div className="flex gap-2 bg-white/60 backdrop-blur-sm rounded-xl p-1 shadow-sm">
            {[
              { key: 'daily', label: 'Daily' },
              { key: 'weekly', label: 'Weekly' },
              { key: 'monthly', label: 'Monthly' },
              { key: 'yearly', label: 'Yearly' },
            ].map((range) => (
              <button
                key={range.key}
                onClick={() => setChartTimeRange(range.key as ChartTimeRange)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  chartTimeRange === range.key
                    ? 'bg-gradient-to-r from-[#0F4C81] to-[#FF6B35] text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Orders Chart */}
          <OrdersChart timeRange={chartTimeRange} />
          
          {/* Revenue Chart */}
          <RevenueChart timeRange={chartTimeRange} />
          
          {/* Quick Stats Summary */}
          <div className="grid grid-cols-2 gap-3">
            <QuickStatCard label="Avg Order Value" value={Math.round(stats.totalRevenue / (stats.completed || 1))} icon={<Wallet size={12} />} color="#8B5CF6" />
            <QuickStatCard label="Conversion Rate" value={Math.round((stats.completed / (stats.total || 1)) * 100)} icon={<TrendingUp size={12} />} color="#10B981" />
          </div>
          
          {/* ENHANCED Customer Orders List - Shows ALL customers with their orders */}
          <EnhancedCustomerOrdersList orders={orders} />
          
          {/* Pro Tip */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF6B35]/10 to-[#FF6B35]/5 p-4 border border-[#FF6B35]/20">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={12} className="text-[#FF6B35]" />
              <p className="text-[10px] font-bold text-[#FF6B35] uppercase tracking-wide">Insight</p>
            </div>
            <p className="text-xs font-medium text-gray-700">Your best performing customer is <strong>{orders.length > 0 ? orders[0]?.customer : '—'}</strong> with {orders.filter(o => o.customer === orders[0]?.customer).length} orders.</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-slow { 0%, 100% { opacity: 0.05; } 50% { opacity: 0.08; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
}