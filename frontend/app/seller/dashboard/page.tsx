'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Star,
  Truck,
  Plus,
  Eye,
  CreditCard,
  AlertCircle,
  ChevronRight,
  Store,
  MapPin,
  Bell,
  Menu,
  X,
  Activity,
  DollarSign,
  Target,
  Sparkles,
  Zap,
  Shield,
  Award,
  ArrowUpRight,
  Calendar,
  BarChart3,
  LineChart,
  PieChart,
  Download,
  RefreshCw,
  TrendingDown,
  Users,
  Video,
  Play,
  Heart,
  Share2,
  MessageCircle,
  UserPlus,
  ShoppingCart as CartIcon,
  Repeat,
  ThumbsUp,
  Clock as ClockIcon,
  Settings,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { storesApi } from '@/lib/api/endpoints';
import type { ApiStoreListItem } from '@/types/api';
import {
  LineChart as ReLineChart,
  Line,
  BarChart as ReBarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StatCard {
  label: string;
  value: number;
  prefix?: string;
  icon?: React.ReactNode;
  trend?: number;
  color: string;
  gradient: string;
}

interface Activity {
  id: number;
  text: string;
  time?: string;
  type?: 'order' | 'product' | 'lkridi' | 'system';
}

interface Customer {
  id: number;
  name: string;
  avatar: string;
  totalSpent: number;
  ordersCount: number;
  lastOrder: string;
  isNew?: boolean;
}

interface VideoMetric {
  id: number;
  title: string;
  thumbnail: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  uploadDate: string;
  engagement: number;
}

type TimeRange = 'daily' | 'weekly' | 'monthly' | 'yearly';

// ---------------------------------------------------------------------------
// Demo Data Generators
// ---------------------------------------------------------------------------

const generateDailyData = () => {
  const data = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: Math.floor(500 + Math.random() * 1500),
      orders: Math.floor(10 + Math.random() * 40),
      products: Math.floor(5 + Math.random() * 20),
    });
  }
  return data;
};

const generateWeeklyData = () => {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  return weeks.map(week => ({
    week,
    revenue: Math.floor(3000 + Math.random() * 4000),
    orders: Math.floor(80 + Math.random() * 100),
    products: Math.floor(30 + Math.random() * 50),
  }));
};

const generateMonthlyData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    revenue: Math.floor(8000 + Math.random() * 12000),
    orders: Math.floor(200 + Math.random() * 300),
    products: Math.floor(80 + Math.random() * 120),
  }));
};

const generateYearlyData = () => {
  const years = ['2022', '2023', '2024'];
  return years.map(year => ({
    year,
    revenue: Math.floor(50000 + Math.random() * 80000),
    orders: Math.floor(1500 + Math.random() * 2000),
    products: Math.floor(500 + Math.random() * 800),
  }));
};

const categoryData = [
  { name: 'Fast Food', value: 45, color: '#0F4C81' },
  { name: 'Groceries', value: 30, color: '#FF6B35' },
  { name: 'Beverages', value: 15, color: '#10B981' },
  { name: 'Other', value: 10, color: '#8B5CF6' },
];

// Demo customers data
const recentCustomers: Customer[] = [
  { id: 1, name: 'Ahmed Benjelloun', avatar: 'A', totalSpent: 2450, ordersCount: 12, lastOrder: '2 hours ago', isNew: false },
  { id: 2, name: 'Fatima Zahra', avatar: 'F', totalSpent: 1890, ordersCount: 8, lastOrder: '5 hours ago', isNew: false },
  { id: 3, name: 'Youssef El Mansouri', avatar: 'Y', totalSpent: 3420, ordersCount: 18, lastOrder: '1 day ago', isNew: false },
  { id: 4, name: 'Khadija Ouazzani', avatar: 'K', totalSpent: 980, ordersCount: 5, lastOrder: '2 days ago', isNew: true },
  { id: 5, name: 'Mehdi Tazi', avatar: 'M', totalSpent: 5670, ordersCount: 24, lastOrder: '3 days ago', isNew: false },
  { id: 6, name: 'Sara Benali', avatar: 'S', totalSpent: 2100, ordersCount: 11, lastOrder: '4 days ago', isNew: false },
];

// Demo video metrics
const videoMetrics: VideoMetric[] = [
  { id: 1, title: 'New Tacos BLKFTLAN Promotion', thumbnail: '🎬', views: 15420, likes: 2340, shares: 890, comments: 156, uploadDate: '3 days ago', engagement: 22 },
  { id: 2, title: 'Behind the Scenes - Kitchen', thumbnail: '🎥', views: 8920, likes: 1230, shares: 450, comments: 89, uploadDate: '1 week ago', engagement: 18 },
  { id: 3, title: 'Customer Testimonials', thumbnail: '📹', views: 12450, likes: 1980, shares: 670, comments: 124, uploadDate: '2 weeks ago', engagement: 20 },
];

// ---------------------------------------------------------------------------
// Chart Components
// ---------------------------------------------------------------------------

function CustomTooltip({ active, payload, label, unit = 'MAD' }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-100 p-3">
        <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
        {payload.map((p: any, idx: number) => (
          <p key={idx} className="text-sm font-semibold" style={{ color: p.color }}>
            {p.name}: {unit === 'MAD' ? `${unit} ${p.value.toLocaleString()}` : p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function RevenueChart({ data, timeRange }: { data: any[]; timeRange: TimeRange }) {
  const xAxisKey = timeRange === 'daily' ? 'date' : timeRange === 'weekly' ? 'week' : timeRange === 'monthly' ? 'month' : 'year';

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-50">
            <DollarSign size={16} className="text-emerald-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-700">Revenue Overview</h3>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0F4C81" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#0F4C81" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey={xAxisKey} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
          <Tooltip content={<CustomTooltip unit="MAD" />} />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#0F4C81" 
            strokeWidth={2}
            fill="url(#revenueGradient)"
            name="Revenue"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function OrdersChart({ data, timeRange }: { data: any[]; timeRange: TimeRange }) {
  const xAxisKey = timeRange === 'daily' ? 'date' : timeRange === 'weekly' ? 'week' : timeRange === 'monthly' ? 'month' : 'year';

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-blue-50">
          <ShoppingBag size={16} className="text-blue-500" />
        </div>
        <h3 className="text-sm font-medium text-gray-700">Orders Trend</h3>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <ReBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey={xAxisKey} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip unit="" />} />
          <Bar dataKey="orders" fill="#FF6B35" radius={[4, 4, 0, 0]} name="Orders" />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}

function CategoryPieChart() {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-purple-50">
          <PieChart size={16} className="text-purple-500" />
        </div>
        <h3 className="text-sm font-medium text-gray-700">Sales by Category</h3>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <RePieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Right Sidebar Components
// ---------------------------------------------------------------------------

function RecentCustomersList() {
  const [customers] = useState<Customer[]>(recentCustomers);
  
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50">
            <Users size={16} className="text-emerald-500" />
          </div>
          <h3 className="font-semibold text-gray-800">Recent Customers</h3>
        </div>
        <button className="text-xs text-[#0F4C81] font-medium hover:underline">
          View All
        </button>
      </div>
      <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
        {customers.map((customer, idx) => (
          <div key={customer.id} className="p-4 hover:bg-white/40 transition-all duration-200 group">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-semibold text-sm shadow-md ${
                customer.isNew 
                  ? 'from-[#FF6B35] to-orange-400' 
                  : 'from-[#0F4C81] to-blue-600'
              }`}>
                {customer.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-800 truncate">{customer.name}</p>
                  {customer.isNew && (
                    <span className="px-1.5 py-0.5 bg-[#FF6B35]/10 text-[#FF6B35] text-[9px] font-bold rounded-full">NEW</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-500">MAD {customer.totalSpent.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{customer.ordersCount} orders</span>
                </div>
                <div className="flex items-center gap-1 mt-1.5">
                  <ClockIcon size={10} className="text-gray-300" />
                  <span className="text-[10px] text-gray-400">Last order: {customer.lastOrder}</span>
                </div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-[#0F4C81]/10">
                <MessageCircle size={14} className="text-[#0F4C81]" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-100 bg-white/30">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Total customers: 156</span>
          <span className="text-emerald-600 flex items-center gap-1">
            <UserPlus size={12} />
            +12 this week
          </span>
        </div>
      </div>
    </div>
  );
}

function VideoAnalytics() {
  const [videos] = useState<VideoMetric[]>(videoMetrics);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  
  const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
  const totalLikes = videos.reduce((sum, v) => sum + v.likes, 0);
  const avgEngagement = Math.round(videos.reduce((sum, v) => sum + v.engagement, 0) / videos.length);
  
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-50">
            <Video size={16} className="text-rose-500" />
          </div>
          <h3 className="font-semibold text-gray-800">Video Analytics</h3>
        </div>
        <button className="text-xs text-[#0F4C81] font-medium hover:underline">
          Upload New
        </button>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 p-4 bg-gradient-to-r from-[#0F4C81]/5 to-[#FF6B35]/5 border-b border-gray-100">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">{totalViews.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">Total Views</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">{totalLikes.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">Total Likes</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">{avgEngagement}%</p>
          <p className="text-[10px] text-gray-500">Avg Engagement</p>
        </div>
      </div>
      
      {/* Video List */}
      <div className="divide-y divide-gray-100 max-h-[350px] overflow-y-auto">
        {videos.map((video) => (
          <div 
            key={video.id} 
            className={`p-4 hover:bg-white/40 transition-all duration-200 cursor-pointer group ${selectedVideo === video.id ? 'bg-white/50' : ''}`}
            onClick={() => setSelectedVideo(selectedVideo === video.id ? null : video.id)}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center text-2xl shadow-md relative overflow-hidden group-hover:scale-105 transition-transform">
                <span>{video.thumbnail}</span>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={16} className="text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">{video.title}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Uploaded {video.uploadDate}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">{video.views.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">views</p>
              </div>
            </div>
            
            {/* Expanded engagement metrics */}
            {selectedVideo === video.id && (
              <div className="mt-3 pt-3 border-t border-gray-100 animate-slideDown">
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-1.5">
                    <Heart size={12} className="text-rose-400" />
                    <span className="text-xs text-gray-600">{video.likes.toLocaleString()} likes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Share2 size={12} className="text-blue-400" />
                    <span className="text-xs text-gray-600">{video.shares.toLocaleString()} shares</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle size={12} className="text-green-400" />
                    <span className="text-xs text-gray-600">{video.comments} comments</span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
                    <span>Engagement Rate</span>
                    <span>{video.engagement}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-[#0F4C81] to-[#FF6B35] transition-all duration-500"
                      style={{ width: `${video.engagement}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-gray-100 bg-white/30">
        <button className="w-full text-center text-xs text-[#0F4C81] font-medium hover:underline flex items-center justify-center gap-1">
          <TrendingUp size={12} />
          View Detailed Analytics
        </button>
      </div>
    </div>
  );
}

function CustomerInsights() {
  const totalCustomers = 156;
  const newCustomers = 12;
  const returningRate = 68;
  
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-blue-50">
          <Target size={14} className="text-blue-500" />
        </div>
        <h3 className="font-semibold text-gray-800 text-sm">Customer Insights</h3>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Returning Customers</span>
            <span className="font-medium text-gray-700">{returningRate}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-[#0F4C81] to-[#FF6B35]" style={{ width: `${returningRate}%` }} />
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Avg. Order Value</p>
            <p className="text-sm font-bold text-gray-800">MAD 185</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Customer Lifetime</p>
            <p className="text-sm font-bold text-gray-800">8.5 months</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Premium Components
// ---------------------------------------------------------------------------

function AnimatedCounter({ value, prefix = '', duration = 800 }: { value: number; prefix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const end = value;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return (
    <span ref={countRef} className="tabular-nums">
      {prefix}{count.toLocaleString()}
    </span>
  );
}

function StatCardItem({ label, value, prefix = '', icon, trend, color }: StatCard) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-2xl transition-all duration-500"
      style={{ transform: isHovered ? 'translateY(-6px)' : 'translateY(0)' }}
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(135deg, ${color}08, ${color}02)` }}
      />
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: `0 0 0 1px ${color}20, 0 8px 30px ${color}15` }}
      />
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div 
            className="relative p-2 rounded-xl transition-all duration-300 group-hover:scale-110"
            style={{ background: `linear-gradient(135deg, ${color}15, ${color}05)` }}
          >
            {icon}
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
              trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}>
              <Zap size={8} />
              <span>{trend >= 0 ? `+${trend}%` : `${trend}%`}</span>
            </div>
          )}
        </div>
        <p className="text-xl font-bold text-gray-900 tracking-tight">
          <AnimatedCounter value={value} prefix={prefix} />
        </p>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">{label}</p>
        <div 
          className="absolute bottom-0 left-0 h-0.5 transition-all duration-500 group-hover:w-full w-0"
          style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
        />
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-4 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 bg-gray-100 rounded-xl animate-pulse" />
        <div className="w-10 h-4 bg-gray-100 rounded-full animate-pulse" />
      </div>
      <div className="h-6 bg-gray-100 rounded w-20 mb-1 animate-pulse" />
      <div className="h-3 bg-gray-100 rounded w-16 animate-pulse" />
    </div>
  );
}

function GlassButton({ onClick, children, color = '#0F4C81', icon, variant = 'solid' }: { 
  onClick: () => void; 
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
        className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 overflow-hidden"
        style={{
          background: isHovered ? `${color}10` : 'transparent',
          border: `1px solid ${color}30`,
          color: color,
          transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
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
      className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-white transition-all duration-300 overflow-hidden group"
      style={{
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        boxShadow: isHovered ? `0 4px 12px -4px ${color}` : `0 1px 5px -2px ${color}`,
        transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
      }}
    >
      <span className="relative z-10 flex items-center gap-1.5">
        {icon}
        {children}
      </span>
      <div 
        className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }}
      />
    </button>
  );
}

function StoreStatusGlow({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="relative">
      <div 
        className="absolute inset-0 rounded-xl animate-pulse"
        style={{
          background: isOpen ? 'radial-gradient(circle, #10B98120, transparent)' : 'none',
          filter: 'blur(8px)',
        }}
      />
      <div className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium ${
        isOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
      }`}>
        <div className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
        {isOpen ? 'Open for Business' : 'Closed'}
      </div>
    </div>
  );
}

function ActivityItem({ activity, index }: { activity: Activity; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getIconAndColor = () => {
    switch (activity.type) {
      case 'order': return { icon: <ShoppingBag size={12} />, color: '#0F4C81', bg: '#0F4C8110' };
      case 'product': return { icon: <Package size={12} />, color: '#8B5CF6', bg: '#8B5CF610' };
      case 'lkridi': return { icon: <CreditCard size={12} />, color: '#FF6B35', bg: '#FF6B3510' };
      default: return { icon: <Activity size={12} />, color: '#6B7280', bg: '#F3F4F6' };
    }
  };
  
  const { icon: ItemIcon, color, bg } = getIconAndColor();

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex items-center justify-between py-2 border-b border-gray-50 last:border-0 transition-all duration-300 rounded-lg"
      style={{ 
        background: isHovered ? `${color}04` : 'transparent',
        transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
      }}
    >
      <div className="flex items-center gap-2">
        <div 
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{ backgroundColor: bg }}
        >
          <div style={{ color }}>{ItemIcon}</div>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-700">{activity.text}</p>
          {activity.time && <p className="text-[10px] text-gray-400 mt-0.5">{activity.time}</p>}
        </div>
      </div>
      <ChevronRight 
        size={12} 
        className="transition-all duration-300" 
        style={{ 
          color: isHovered ? color : '#E5E7EB',
          transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
        }}
      />
    </div>
  );
}

// Main Dashboard Component
export default function SellerDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<StatCard[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firstStore, setFirstStore] = useState<{ id: string; isOpen: boolean; name?: string } | null>(null);
  const [ratingAvg, setRatingAvg] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  
  // Chart data states
  const [dailyData, setDailyData] = useState(generateDailyData());
  const [weeklyData, setWeeklyData] = useState(generateWeeklyData());
  const [monthlyData, setMonthlyData] = useState(generateMonthlyData());
  const [yearlyData, setYearlyData] = useState(generateYearlyData());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getCurrentData = () => {
    switch (timeRange) {
      case 'daily': return dailyData;
      case 'weekly': return weeklyData;
      case 'monthly': return monthlyData;
      case 'yearly': return yearlyData;
      default: return monthlyData;
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setDailyData(generateDailyData());
      setWeeklyData(generateWeeklyData());
      setMonthlyData(generateMonthlyData());
      setYearlyData(generateYearlyData());
      setIsRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
    storesApi.getMyStores()
      .then((res) => {
        const stores = (res.data ?? []) as ApiStoreListItem[];
        if (stores.length === 0) { setLoading(false); return; }

        const first = stores[0];
        setFirstStore({ 
          id: String(first.id), 
          isOpen: first.openStatus ?? false,
          name: first.name
        });
        setRatingAvg(first.ratingAvg ?? null);

        setActivity([
          { id: 1, text: 'New order #1234 received from Ahmed', time: '2 min ago', type: 'order' },
          { id: 2, text: 'Product "Tacos Blkfotlan" was viewed 45 times', time: '1 hour ago', type: 'product' },
          { id: 3, text: 'LKRIDI request from Fatima - 450 MAD', time: '3 hours ago', type: 'lkridi' },
          { id: 4, text: 'Order #1230 marked as completed', time: '5 hours ago', type: 'order' },
          { id: 5, text: 'New product "Chicken Grill" added', time: 'yesterday', type: 'product' },
        ]);

        return storesApi.getStoreStats(String(first.id)).then((statsRes) => {
          const s = statsRes.data;
          if (!s) return;
          setStats([
            { label: 'Revenue', value: s.totalRevenue, prefix: 'MAD ', icon: <DollarSign size={16} />, trend: 12, color: '#0F4C81', gradient: 'from-teal-600 to-blue-600' },
            { label: 'Orders', value: s.totalOrders, icon: <ShoppingBag size={16} />, trend: 8, color: '#0F4C81', gradient: 'from-blue-600 to-indigo-600' },
            { label: 'Pending', value: s.pendingOrders, icon: <Clock size={16} />, color: '#FF6B35', gradient: 'from-orange-500 to-red-500' },
            { label: 'Products', value: s.totalProducts, icon: <Package size={16} />, trend: 5, color: '#0F4C81', gradient: 'from-teal-600 to-cyan-600' },
          ]);
        });
      })
      .catch((err: Error) => setError(err.message ?? 'Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  const storeId = firstStore?.id ?? 'demo-store';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/80">
      
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-72 bg-white/95 backdrop-blur-xl z-50 shadow-2xl transition-transform duration-300 transform translate-x-0 border-r border-white/20">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#0F4C81] to-[#FF6B35] flex items-center justify-center">
                  <Store size={16} className="text-white" />
                </div>
                <span className="font-bold text-lg" style={{ color: '#0F4C81' }}>Moul L7anout</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {[
                { name: 'Dashboard', icon: <Activity size={18} />, active: true },
                { name: 'Products', icon: <Package size={18} /> },
                { name: 'Orders', icon: <ShoppingBag size={18} /> },
                { name: 'LKRIDI', icon: <CreditCard size={18} /> },
                { name: 'Analytics', icon: <BarChart3 size={18} /> },
                { name: 'Settings', icon: <Settings size={18} /> },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    if (item.name === 'Products') router.push('/seller/products');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    item.active 
                      ? 'text-[#0F4C81] bg-[#0F4C81]/5' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  {item.name}
                  {item.active && (
                    <div className="ml-auto w-1 h-6 rounded-full bg-[#0F4C81]" />
                  )}
                </button>
              ))}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                <HelpCircle size={18} />
                Help & Support
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Content - Two Column Layout */}
      <div className="relative z-10">
        
        {/* Premium Header */}
        <div className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
          <div className="px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Menu size={20} />
              </button>
              <div className="hidden lg:flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#0F4C81] to-[#FF6B35] flex items-center justify-center">
                  <Store size={16} className="text-white" />
                </div>
                <span className="font-bold text-lg" style={{ color: '#0F4C81' }}>Moul L7anout</span>
              </div>
              <div className="h-8 w-px bg-gray-200 hidden lg:block" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-xs text-gray-400">{greeting}, {firstStore?.name || 'Store Owner'} ✨</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <RefreshCw size={18} className={`text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Bell size={18} className="text-gray-500" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B35] rounded-full ring-2 ring-white" />
              </button>
              <div className="h-6 w-px bg-gray-200" />
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-medium text-gray-700">Store Owner</p>
                  <p className="text-xs text-gray-400">{firstStore?.name || 'Loading...'}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#FF6B35] flex items-center justify-center text-white text-sm font-medium shadow-lg">
                  A
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Grid - Left Content + Right Sidebar */}
        <div className="px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* LEFT COLUMN - Main Content (70% width on desktop) */}
            <div className="flex-1 lg:w-2/3 space-y-6">
              
              {/* Welcome Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F4C81] to-[#FF6B35] p-5 text-white">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24" />
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/5 rounded-full -ml-18 -mb-18" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs opacity-90 mb-1">Welcome back!</p>
                    <p className="text-xl font-bold tracking-tight">{greeting}, {firstStore?.name || 'Store Owner'}</p>
                    <p className="text-xs opacity-80 mt-1">Here's what's happening with your store today.</p>
                  </div>
                  <div className="mt-3 sm:mt-0 flex gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm text-xs">
                      <Sparkles size={12} />
                      <span className="font-medium">Pro Plan</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm text-xs">
                      <Award size={12} />
                      <span className="font-medium">Top Seller</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {firstStore && <StoreStatusGlow isOpen={firstStore.isOpen} />}
                  <GlassButton 
                    onClick={() => {}} 
                    icon={<MapPin size={12} />}
                    color="#FF6B35"
                    variant="outline"
                  >
                    Live Tracking Off
                  </GlassButton>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 text-gray-600">
                    <Calendar size={10} />
                    <span>Last 30 days</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid - 4 compact cards */}
              <section>
                {error && (
                  <div className="bg-rose-50/80 backdrop-blur-sm border border-rose-200 rounded-xl p-3 mb-4 flex items-center gap-2">
                    <AlertCircle size={16} className="text-rose-500" />
                    <p className="text-xs text-rose-600">{error}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {loading
                    ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                    : stats.map((s, i) => (
                        <div key={s.label} className="animate-slideIn" style={{ animationDelay: `${i * 50}ms` }}>
                          <StatCardItem {...s} />
                        </div>
                      ))
                  }
                </div>
              </section>

              {/* Time Range Selector */}
              <section>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <BarChart3 size={12} />
                    Analytics & Reports
                  </h2>
                  <div className="flex gap-1.5">
                    {[
                      { key: 'daily', label: 'Daily' },
                      { key: 'weekly', label: 'Weekly' },
                      { key: 'monthly', label: 'Monthly' },
                      { key: 'yearly', label: 'Yearly' },
                    ].map((range) => (
                      <button
                        key={range.key}
                        onClick={() => setTimeRange(range.key as TimeRange)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all duration-200 ${
                          timeRange === range.key
                            ? 'bg-[#0F4C81] text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Revenue Chart */}
              <RevenueChart data={getCurrentData()} timeRange={timeRange} />

              {/* Orders Chart + Category Pie - Two columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <OrdersChart data={getCurrentData()} timeRange={timeRange} />
                <CategoryPieChart />
              </div>

              {/* Quick Actions */}
              <section>
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Zap size={12} />
                  Quick Actions
                </h2>
                <div className="flex flex-wrap gap-2">
                  <GlassButton 
                    onClick={() => router.push(`/seller/stores/${storeId}/products`)} 
                    icon={<Plus size={12} />}
                    color="#0F4C81"
                  >
                    Add Product
                  </GlassButton>
                  <GlassButton 
                    onClick={() => router.push('/seller/products')} 
                    icon={<Eye size={12} />}
                    color="#0F4C81"
                    variant="outline"
                  >
                    Manage Products
                  </GlassButton>
                  <GlassButton 
                    onClick={() => router.push('/seller/orders')} 
                    icon={<ShoppingBag size={12} />}
                    color="#0F4C81"
                    variant="outline"
                  >
                    View Orders
                  </GlassButton>
                  <GlassButton 
                    onClick={() => router.push('/seller/lkridi')} 
                    icon={<CreditCard size={12} />}
                    color="#FF6B35"
                  >
                    Manage LKRIDI
                  </GlassButton>
                </div>
              </section>

              {/* Recent Activity (shorter version) */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity size={12} />
                    Recent Activity
                  </h2>
                  <button className="text-[10px] text-[#0F4C81] font-medium hover:underline">View All</button>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 p-4 shadow-lg">
                  {loading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 py-1">
                          <div className="w-7 h-7 bg-gray-100 rounded-lg animate-pulse" />
                          <div className="flex-1">
                            <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse" />
                            <div className="h-2 bg-gray-100 rounded w-1/2 mt-1 animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      {activity.slice(0, 4).map((item, idx) => (
                        <ActivityItem key={item.id} activity={item} index={idx} />
                      ))}
                    </div>
                  )}
                </div>
              </section>

            </div>

            {/* RIGHT SIDEBAR - Customers & Video Analytics (30% width on desktop) */}
            <div className="lg:w-1/3 space-y-5">
              
              {/* Recent Customers */}
              <RecentCustomersList />
              
              {/* Video Analytics */}
              <VideoAnalytics />
              
              {/* Customer Insights */}
              <CustomerInsights />
              
              {/* Store Rating Summary */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-amber-50">
                    <Star size={14} className="text-amber-500" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">Store Rating</h3>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-3xl font-bold text-gray-900">{ratingAvg !== null ? ratingAvg.toFixed(1) : '4.8'}</p>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map((star) => (
                      <Star 
                        key={star} 
                        size={14} 
                        className={`${star <= Math.floor(ratingAvg || 4.8) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">(124 reviews)</span>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Response Rate</span>
                    <span className="font-medium text-gray-700">98%</span>
                  </div>
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500" style={{ width: '98%' }} />
                  </div>
                </div>
              </div>
              
              {/* Pro Tip */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF6B35]/10 to-[#FF6B35]/5 p-4 border border-[#FF6B35]/20">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#FF6B35]/10 rounded-full -mr-10 -mt-10" />
                <div className="relative">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles size={12} className="text-[#FF6B35]" />
                    <p className="text-[10px] font-bold text-[#FF6B35] uppercase tracking-wide">Pro Insight</p>
                  </div>
                  <p className="text-xs font-medium text-gray-700">Enable LKRIDI for your popular products to increase sales by up to 40%</p>
                  <button className="mt-2 text-[10px] text-[#FF6B35] font-medium hover:underline flex items-center gap-0.5">
                    Learn more
                    <ArrowUpRight size={10} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(15px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
          opacity: 0;
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
