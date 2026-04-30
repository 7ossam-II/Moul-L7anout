'use client';

import { useState, useEffect } from 'react';
import { lkridiApi } from '@/lib/api/endpoints';
import { 
  Users, 
  UserCheck, 
  HandCoins, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  Trash2,
  Calendar,
  Phone,
  Package,
  Wallet,
  Zap,
  Sparkles,
  ChevronRight,
  Award,
  TrendingUp,
  AlertCircle,
  Star,
  Crown,
  Gem,
  Rocket,
  Shield,
  Heart
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MembershipRequest {
  id: string;
  buyerName: string;
  phone: string;
  requestDate: string;
}

interface LoanRequest {
  id: string;
  buyerName: string;
  products: string;
  totalAmount: number;
  requestDate: string;
}

interface ApprovedMember {
  id: string;
  buyerName: string;
  phone: string;
  approvedDate: string;
  totalLoans: number;
}

type Tab = 'membership' | 'approved' | 'loan';

// ---------------------------------------------------------------------------
// Ultra-Premium Components
// ---------------------------------------------------------------------------

// 3D Glowing Stat Card
function GlowingStatCard({ label, value, icon, color, subtitle, gradient }: { 
  label: string; 
  value: number; 
  icon: React.ReactNode; 
  color: string;
  subtitle?: string;
  gradient: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group cursor-pointer"
    >
      {/* Animated gradient border */}
      <div className={`absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl ${gradient}`} />
      
      <div 
        className="relative overflow-hidden rounded-2xl transition-all duration-500"
        style={{ 
          transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
          background: `linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))`,
          boxShadow: isHovered ? `0 25px 40px -12px ${color}` : '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        {/* Animated shimmer */}
        <div className={`absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/50 to-transparent`} />
        
        <div className="relative p-5">
          <div className="flex items-center justify-between mb-3">
            <div 
              className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
              style={{ background: `linear-gradient(135deg, ${color}20, ${color}05)` }}
            >
              {icon}
            </div>
            {isHovered && <Sparkles size={16} style={{ color }} className="animate-pulse" />}
          </div>
          <p className="text-3xl font-bold" style={{ color }}>{value.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
          {subtitle && <p className="text-[10px] text-gray-400 mt-1">{subtitle}</p>}
          
          {/* Animated progress bar */}
          <div 
            className="absolute bottom-0 left-0 h-1 rounded-full transition-all duration-700 group-hover:w-full w-0"
            style={{ background: `linear-gradient(90deg, ${color}, ${color === '#0F4C81' ? '#FF6B35' : color})` }}
          />
        </div>
      </div>
    </div>
  );
}

// Premium Glass Action Buttons
function GlassActionButtons({
  id,
  onApprove,
  onDecline,
  approveText = "Approve",
  declineText = "Decline"
}: {
  id: string;
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
  approveText?: string;
  declineText?: string;
}) {
  const [isHoveredApprove, setIsHoveredApprove] = useState(false);
  const [isHoveredDecline, setIsHoveredDecline] = useState(false);

  return (
    <div className="flex gap-3">
      <button
        onClick={() => onApprove(id)}
        onMouseEnter={() => setIsHoveredApprove(true)}
        onMouseLeave={() => setIsHoveredApprove(false)}
        className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all duration-300 overflow-hidden group"
        style={{
          background: `linear-gradient(135deg, #0F4C81, #1a5c9e)`,
          boxShadow: isHoveredApprove ? `0 8px 25px -6px #0F4C81` : `0 2px 10px -4px #0F4C81`,
          transform: isHoveredApprove ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
        }}
      >
        <span className="relative z-10 flex items-center gap-2">
          <CheckCircle size={14} />
          {approveText}
        </span>
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </button>
      <button
        onClick={() => onDecline(id)}
        onMouseEnter={() => setIsHoveredDecline(true)}
        onMouseLeave={() => setIsHoveredDecline(false)}
        className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all duration-300 overflow-hidden group"
        style={{
          background: `linear-gradient(135deg, #FF6B35, #ff8a5a)`,
          boxShadow: isHoveredDecline ? `0 8px 25px -6px #FF6B35` : `0 2px 10px -4px #FF6B35`,
          transform: isHoveredDecline ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
        }}
      >
        <span className="relative z-10 flex items-center gap-2">
          <XCircle size={14} />
          {declineText}
        </span>
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </button>
    </div>
  );
}

// 3D Premium Tabs
function Premium3DTabs({ activeTab, setActiveTab }: { activeTab: Tab; setActiveTab: (tab: Tab) => void }) {
  const tabs = [
    { key: 'membership', label: 'Membership Requests', icon: <Users size={16} />, color: '#0F4C81', glow: 'from-[#0F4C81]/20 to-transparent' },
    { key: 'approved', label: 'Approved Members', icon: <UserCheck size={16} />, color: '#10B981', glow: 'from-[#10B981]/20 to-transparent' },
    { key: 'loan', label: 'Loan Requests', icon: <HandCoins size={16} />, color: '#FF6B35', glow: 'from-[#FF6B35]/20 to-transparent' },
  ];

  return (
    <div className="flex gap-2 bg-white/40 backdrop-blur-md rounded-2xl p-1.5 shadow-inner">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key as Tab)}
          className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-500 overflow-hidden ${
            activeTab === tab.key
              ? 'text-white shadow-2xl'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          style={activeTab === tab.key ? { 
            background: `linear-gradient(135deg, ${tab.color}, ${tab.color === '#0F4C81' ? '#1a5c9e' : tab.color === '#10B981' ? '#059669' : '#ea580c'})`,
            boxShadow: `0 4px 15px -3px ${tab.color}80`
          } : {}}
        >
          {/* Glow effect on active */}
          {activeTab === tab.key && (
            <div className={`absolute inset-0 bg-gradient-to-r ${tab.glow} opacity-50 rounded-xl animate-pulse`} />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {tab.icon}
            {tab.label}
          </span>
          {activeTab === tab.key && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/50 rounded-full blur-sm animate-pulse" />
          )}
        </button>
      ))}
    </div>
  );
}

// Premium Glowing Row for Membership
function GlowingMembershipRow({ request, onApprove, onDecline, index }: { request: MembershipRequest; onApprove: (id: string) => void; onDecline: (id: string) => void; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative transition-all duration-500 group"
      style={{ transform: isHovered ? 'scale(1.01)' : 'scale(1)' }}
    >
      {/* Glowing border on hover */}
      {isHovered && (
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#0F4C81]/30 to-[#FF6B35]/30 blur-xl opacity-70" />
      )}
      
      <div className={`relative border-b border-gray-100 transition-all duration-300 rounded-xl overflow-hidden ${
        isHovered ? 'bg-white shadow-xl' : 'bg-white/80'
      }`}>
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Animated rank badge */}
            <div className="relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                index === 0 ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg' : 
                index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-white' : 
                index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white' : 
                'bg-gray-100 text-gray-400'
              }`}>
                {index + 1}
              </div>
              {index === 0 && <Crown size={10} className="absolute -top-1 -right-1 text-amber-500" />}
            </div>
            
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`} style={{ background: `linear-gradient(135deg, #0F4C8115, #FF6B3515)` }}>
              <Users size={20} className="text-[#0F4C81]" />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-lg">{request.buyerName}</p>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1.5">
                  <Phone size={12} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{request.phone}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-300" />
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{request.requestDate}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <GlassActionButtons id={request.id} onApprove={onApprove} onDecline={onDecline} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Premium Approved Member Card
function GlowingApprovedCard({ member, onRemove, index }: { member: ApprovedMember; onRemove: (id: string) => void; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative transition-all duration-500"
      style={{ transform: isHovered ? 'translateY(-4px)' : 'translateY(0)' }}
    >
      {isHovered && (
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#10B981]/30 to-[#0F4C81]/30 blur-xl opacity-70" />
      )}
      
      <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
        isHovered ? 'bg-white shadow-2xl' : 'bg-white/90 shadow-lg'
      }`}>
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  index === 0 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-emerald-100'
                }`}>
                  <UserCheck size={22} className={index === 0 ? 'text-white' : 'text-emerald-500'} />
                </div>
                {index === 0 && <Crown size={12} className="absolute -top-1 -right-1 text-amber-500" />}
              </div>
              <div>
                <p className="font-bold text-gray-800 text-lg">{member.buyerName}</p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Phone size={12} className="text-gray-400" />
                    <span className="text-sm text-gray-500">{member.phone}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-300" />
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-gray-400" />
                    <span className="text-sm text-gray-500">{member.approvedDate}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-300" />
                  <div className="flex items-center gap-1.5">
                    <Wallet size={12} className="text-[#0F4C81]" />
                    <span className="text-sm font-semibold text-gray-800">{member.totalLoans} loans</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium bg-[#0F4C81]/10 text-[#0F4C81] hover:bg-[#0F4C81]/20 transition-all duration-300 hover:scale-105">
                <Eye size={14} /> View Details
              </button>
              <button
                onClick={() => onRemove(member.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-all duration-300 hover:scale-105"
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </div>
          
          {/* Trust score bar */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-gray-500 flex items-center gap-1"><Shield size={12} /> Trust Score</span>
              <span className="font-semibold text-gray-700">92%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#0F4C81] to-[#FF6B35] transition-all duration-700" style={{ width: '92%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Premium Loan Card
function GlowingLoanCard({ request, onApprove, onDecline, index }: { request: LoanRequest; onApprove: (id: string) => void; onDecline: (id: string) => void; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative transition-all duration-500"
      style={{ transform: isHovered ? 'translateY(-4px)' : 'translateY(0)' }}
    >
      {isHovered && (
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#FF6B35]/30 to-[#0F4C81]/30 blur-xl opacity-70" />
      )}
      
      <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
        isHovered ? 'bg-white shadow-2xl' : 'bg-white/90 shadow-lg'
      }`}>
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  index === 0 ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 'bg-orange-50'
                }`}>
                  <HandCoins size={22} className={index === 0 ? 'text-white' : 'text-orange-500'} />
                </div>
                {index === 0 && <Crown size={12} className="absolute -top-1 -right-1 text-amber-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-800 text-lg">{request.buyerName}</p>
                  <div className="flex items-center gap-1">
                    <Gem size={14} className="text-[#FF6B35]" />
                    <span className="text-2xl font-bold text-[#FF6B35]">MAD {request.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-1 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Package size={12} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{request.products}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-300" />
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-gray-400" />
                    <span className="text-sm text-gray-500">{request.requestDate}</span>
                  </div>
                </div>
              </div>
            </div>
            <GlassActionButtons id={request.id} onApprove={onApprove} onDecline={onDecline} />
          </div>
          
          {/* Urgency indicator */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Response time</span>
                  <span className="text-amber-600 font-medium">Urgent</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#FF6B35] to-red-500 animate-pulse" style={{ width: '75%' }} />
                </div>
              </div>
              <Rocket size={16} className="text-[#FF6B35] animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile Card Components
function MobileMembershipCard({ request, onApprove, onDecline }: { request: MembershipRequest; onApprove: (id: string) => void; onDecline: (id: string) => void }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-5 shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F4C81]/10 to-[#FF6B35]/10 flex items-center justify-center">
          <Users size={18} className="text-[#0F4C81]" />
        </div>
        <div>
          <p className="font-bold text-gray-800">{request.buyerName}</p>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Calendar size={10} /> {request.requestDate}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Phone size={12} />
        <span>{request.phone}</span>
      </div>
      <GlassActionButtons id={request.id} onApprove={onApprove} onDecline={onDecline} />
    </div>
  );
}

function MobileApprovedCard({ member, onRemove }: { member: ApprovedMember; onRemove: (id: string) => void }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-5 shadow-lg border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <UserCheck size={18} className="text-emerald-500" />
          </div>
          <div>
            <p className="font-bold text-gray-800">{member.buyerName}</p>
            <p className="text-xs text-gray-400">{member.approvedDate}</p>
          </div>
        </div>
        <span className="text-sm font-bold text-[#0F4C81]">{member.totalLoans} loans</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Phone size={12} />
        <span>{member.phone}</span>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium bg-[#0F4C81]/10 text-[#0F4C81]">
          <Eye size={14} /> View
        </button>
        <button onClick={() => onRemove(member.id)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium bg-red-50 text-red-500">
          <Trash2 size={14} /> Remove
        </button>
      </div>
    </div>
  );
}

function MobileLoanCard({ request, onApprove, onDecline }: { request: LoanRequest; onApprove: (id: string) => void; onDecline: (id: string) => void }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-5 shadow-lg border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <HandCoins size={18} className="text-orange-500" />
          </div>
          <div>
            <p className="font-bold text-gray-800">{request.buyerName}</p>
            <p className="text-xs text-gray-400">{request.products}</p>
          </div>
        </div>
        <span className="text-lg font-bold text-[#FF6B35]">MAD {request.totalAmount.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
        <Calendar size={10} />
        <span>{request.requestDate}</span>
      </div>
      <GlassActionButtons id={request.id} onApprove={onApprove} onDecline={onDecline} />
    </div>
  );
}

// Shared Helpers
function TableSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 animate-pulse">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gray-200 rounded-xl" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message, icon }: { message: string; icon?: React.ReactNode }) {
  return (
    <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/40">
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
        {icon || <Users size={32} className="text-gray-300" />}
      </div>
      <p className="text-gray-500 text-base">{message}</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="bg-rose-50/90 backdrop-blur-sm border border-rose-200 rounded-xl p-4 flex items-center gap-3">
      <AlertCircle size={18} className="text-rose-500" />
      <p className="text-sm text-rose-600">{message}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab Panels
// ---------------------------------------------------------------------------

function MembershipTab() {
  const [requests, setRequests] = useState<MembershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    lkridiApi.getMembership()
      .then((res) => {
        const data = res.data;
        if (data && 'approvalStatus' in data && data.approvalStatus === 'PENDING') {
          setRequests([{
            id: String((data as { id?: string | number }).id ?? ''),
            buyerName: 'Ahmed Benjelloun',
            phone: '+212 6XX XXX XXX',
            requestDate: '2024-01-15',
          }, {
            id: '2',
            buyerName: 'Fatima Zahra',
            phone: '+212 6XX XXX XXX',
            requestDate: '2024-01-14',
          }, {
            id: '3',
            buyerName: 'Youssef El Mansouri',
            phone: '+212 6XX XXX XXX',
            requestDate: '2024-01-13',
          }]);
        }
      })
      .catch((err: Error) => setError(err.message ?? 'Failed to load membership requests.'))
      .finally(() => setLoading(false));
  }, []);

  function handleApprove(id: string) {
    lkridiApi.approveMembership(id, true)
      .then(() => setRequests((prev) => prev.filter((r) => r.id !== id)))
      .catch((err: Error) => setError(err.message));
  }

  function handleDecline(id: string) {
    lkridiApi.approveMembership(id, false)
      .then(() => setRequests((prev) => prev.filter((r) => r.id !== id)))
      .catch((err: Error) => setError(err.message));
  }

  if (loading) return <TableSkeleton />;
  if (error) return <ErrorState message={error} />;
  if (requests.length === 0) return <EmptyState message="No pending membership requests." icon={<Users size={32} />} />;

  return (
    <div className="space-y-4">
      {requests.map((request, idx) => (
        <GlowingMembershipRow key={request.id} request={request} onApprove={handleApprove} onDecline={handleDecline} index={idx} />
      ))}
      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        {requests.map((request) => (
          <MobileMembershipCard key={request.id} request={request} onApprove={handleApprove} onDecline={handleDecline} />
        ))}
      </div>
    </div>
  );
}

function ApprovedMembersTab() {
  const [members, setMembers] = useState<ApprovedMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    lkridiApi.getMembership()
      .then((res) => {
        const data = res.data;
        if (data && 'approvalStatus' in data && data.approvalStatus === 'APPROVED') {
          setMembers([{
            id: String((data as { id?: string | number }).id ?? ''),
            buyerName: 'Ahmed Benjelloun',
            phone: '+212 6XX XXX XXX',
            approvedDate: '2024-01-10',
            totalLoans: 3,
          }, {
            id: '2',
            buyerName: 'Sara Benali',
            phone: '+212 6XX XXX XXX',
            approvedDate: '2024-01-08',
            totalLoans: 2,
          }, {
            id: '3',
            buyerName: 'Mehdi Tazi',
            phone: '+212 6XX XXX XXX',
            approvedDate: '2024-01-05',
            totalLoans: 5,
          }]);
        }
      })
      .catch((err: Error) => setError(err.message ?? 'Failed to load approved members.'))
      .finally(() => setLoading(false));
  }, []);

  function handleRemove(id: string) {
    lkridiApi.approveMembership(id, false)
      .then(() => setMembers((prev) => prev.filter((m) => m.id !== id)))
      .catch((err: Error) => setError(err.message));
  }

  if (loading) return <TableSkeleton />;
  if (error) return <ErrorState message={error} />;
  if (members.length === 0) return <EmptyState message="No approved members yet." icon={<UserCheck size={32} />} />;

  return (
    <div className="space-y-4">
      {members.map((member, idx) => (
        <GlowingApprovedCard key={member.id} member={member} onRemove={handleRemove} index={idx} />
      ))}
      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        {members.map((member) => (
          <MobileApprovedCard key={member.id} member={member} onRemove={handleRemove} />
        ))}
      </div>
    </div>
  );
}

function LoanTab() {
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    lkridiApi.getTransactions()
      .then(() => {
        setRequests([
          { id: '1', buyerName: 'Ahmed Benjelloun', products: 'Tacos, Burger, Fries', totalAmount: 450, requestDate: '2024-01-15' },
          { id: '2', buyerName: 'Fatima Zahra', products: 'Sandwiches x3', totalAmount: 230, requestDate: '2024-01-14' },
          { id: '3', buyerName: 'Youssef El Mansouri', products: 'Family Meal Deal', totalAmount: 890, requestDate: '2024-01-13' },
        ]);
      })
      .catch((err: Error) => setError(err.message ?? 'Failed to load loan requests.'))
      .finally(() => setLoading(false));
  }, []);

  function handleApprove(id: string) {
    lkridiApi.acceptOrder(id)
      .then(() => setRequests((prev) => prev.filter((r) => r.id !== id)))
      .catch((err: Error) => setError(err.message));
  }

  function handleDecline(id: string) {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }

  if (loading) return <TableSkeleton />;
  if (error) return <ErrorState message={error} />;
  if (requests.length === 0) return <EmptyState message="No pending loan requests." icon={<HandCoins size={32} />} />;

  return (
    <div className="space-y-4">
      {requests.map((request, idx) => (
        <GlowingLoanCard key={request.id} request={request} onApprove={handleApprove} onDecline={handleDecline} index={idx} />
      ))}
      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        {requests.map((request) => (
          <MobileLoanCard key={request.id} request={request} onApprove={handleApprove} onDecline={handleDecline} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function LkridiHubPage() {
  const [activeTab, setActiveTab] = useState<Tab>('membership');

  const stats = {
    pendingMembership: 3,
    approvedMembers: 3,
    pendingLoans: 3,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/30">
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-[#0F4C81] rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse-slow" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-[#FF6B35] rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse-slow delay-1000" />
        <div className="absolute top-1/3 left-1/2 w-64 h-64 bg-gradient-to-r from-[#0F4C81]/10 to-[#FF6B35]/10 rounded-full blur-3xl animate-spin-slow" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/60 backdrop-blur-2xl border-b border-white/20 shadow-sm">
        <div className="px-6 lg:px-8 py-5">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0F4C81] to-[#FF6B35] blur-lg animate-pulse" />
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#FF6B35] flex items-center justify-center shadow-lg">
                  <Zap size={18} className="text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#FF6B35] bg-clip-text text-transparent">
                LKRIDI Management
              </h1>
              <div className="px-2 py-1 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 text-[10px] font-bold flex items-center gap-1">
                <Sparkles size={10} /> Trust Network
              </div>
            </div>
            <p className="text-sm text-gray-500 ml-12">
              Manage buyer memberships and loan requests securely
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlowingStatCard 
            label="Pending Membership" 
            value={stats.pendingMembership} 
            icon={<Users size={22} className="text-[#0F4C81]" />} 
            color="#0F4C81"
            subtitle="Awaiting your approval"
            gradient="bg-gradient-to-r from-[#0F4C81] via-[#0F4C81]/50 to-transparent"
          />
          <GlowingStatCard 
            label="Approved Members" 
            value={stats.approvedMembers} 
            icon={<UserCheck size={22} className="text-[#10B981]" />} 
            color="#10B981"
            subtitle="Active in trust network"
            gradient="bg-gradient-to-r from-[#10B981] via-[#10B981]/50 to-transparent"
          />
          <GlowingStatCard 
            label="Pending Loans" 
            value={stats.pendingLoans} 
            icon={<HandCoins size={22} className="text-[#FF6B35]" />} 
            color="#FF6B35"
            subtitle="Requires your review"
            gradient="bg-gradient-to-r from-[#FF6B35] via-[#FF6B35]/50 to-transparent"
          />
        </div>

        {/* Premium Tabs */}
        <Premium3DTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Panel */}
        {activeTab === 'membership' ? <MembershipTab /> : activeTab === 'approved' ? <ApprovedMembersTab /> : <LoanTab />}
      </div>

      <style jsx global>{`
        @keyframes pulse-slow { 0%, 100% { opacity: 0.05; transform: scale(1); } 50% { opacity: 0.08; transform: scale(1.05); } }
        @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-bounce { animation: bounce 1s ease-in-out infinite; }
      `}</style>
    </div>
  );
}