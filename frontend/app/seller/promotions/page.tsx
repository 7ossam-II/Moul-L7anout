'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { videoApi } from '@/lib/api/endpoints';
import type { VideoAd as ApiVideoAd } from '@/lib/types/api.types';
import { 
  Video, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  XCircle,
  Play,
  Calendar,
  FileText,
  Link as LinkIcon,
  Sparkles,
  TrendingUp,
  Award,
  Crown,
  Eye
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const adSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(300).optional(),
  videoUrl: z.url('Enter a valid URL'),
});

type AdFormData = z.infer<typeof adSchema>;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AdStatus = 'Pending Approval' | 'Approved' | 'Rejected';

interface VideoAd {
  id: string;
  title: string;
  status: AdStatus;
  uploadedAt: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mapStatus(s: string): AdStatus {
  if (s === 'approved' || s === 'active') return 'Approved';
  if (s === 'rejected') return 'Rejected';
  return 'Pending Approval';
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
function PremiumStatusBadge({ status }: { status: AdStatus }) {
  const styles = {
    'Approved': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: <CheckCircle size={10} /> },
    'Pending Approval': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: <Clock size={10} /> },
    'Rejected': { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', icon: <XCircle size={10} /> },
  };
  const style = styles[status];
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
      {style.icon}
      {status}
    </div>
  );
}

// Premium Ad Row
function AdRow({ ad, onDelete, index }: { ad: VideoAd; onDelete: (id: string) => void; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="border-b border-gray-100 transition-all duration-300"
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
            <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Play size={14} className="text-gray-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{ad.title}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Calendar size={10} className="text-gray-400" />
                <span className="text-xs text-gray-500">{ad.uploadedAt}</span>
              </div>
            </div>
          </div>
          
          <div className="w-[140px]">
            <PremiumStatusBadge status={ad.status} />
          </div>
          
          <button
            onClick={() => onDelete(ad.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-all duration-300 hover:scale-105"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      </div>

      {/* Tablet View */}
      <div className="hidden sm:block lg:hidden p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Play size={14} className="text-gray-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{ad.title}</p>
              <p className="text-xs text-gray-400">{ad.uploadedAt}</p>
            </div>
          </div>
          <PremiumStatusBadge status={ad.status} />
        </div>
        <button
          onClick={() => onDelete(ad.id)}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-all duration-300"
        >
          <Trash2 size={12} /> Delete Ad
        </button>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden p-4">
        <div className="flex gap-3">
          <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shrink-0">
            <Play size={14} className="text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 truncate">{ad.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">{ad.uploadedAt}</span>
              <PremiumStatusBadge status={ad.status} />
            </div>
            <button
              onClick={() => onDelete(ad.id)}
              className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-all duration-300"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Premium Create Ad Form
function CreateAdForm({ onSubmit, isSubmitting, onCancel }: { 
  onSubmit: (data: AdFormData) => void; 
  isSubmitting: boolean; 
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdFormData>({ resolver: zodResolver(adSchema) });

  const handleFormSubmit = (data: AdFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-gray-100/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#0F4C81]/10">
            <Video size={14} className="text-[#0F4C81]" />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">Upload New Video Ad</h3>
          <span className="ml-auto text-[10px] text-gray-400">Fill in the details below</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Video Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              {...register('title')}
              type="text"
              placeholder="e.g., Summer Sale — Maarif Store"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 text-sm focus:outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/20 transition-all"
            />
          </div>
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Short description (max 300 characters)"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 text-sm focus:outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/20 transition-all resize-none"
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Video URL <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              {...register('videoUrl')}
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 text-sm focus:outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/20 transition-all"
            />
          </div>
          {errors.videoUrl && <p className="text-xs text-red-500 mt-1">{errors.videoUrl.message}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #0F4C81, #1a5c9e)' }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit for Review'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Field error helper
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function PromotionsPage() {
  const [ads, setAds] = useState<VideoAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdFormData>({ resolver: zodResolver(adSchema) });

  useEffect(() => {
    videoApi.getAll()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data as ApiVideoAd[] : [];
        setAds(data.map((a, idx) => ({
          id: a.id,
          title: a.title || `Video Ad ${idx + 1}`,
          status: mapStatus(a.status),
          uploadedAt: a.createdAt?.split('T')[0] ?? new Date().toISOString().split('T')[0],
        })));
      })
      .catch((err: Error) => setError(err.message ?? 'Failed to load ads.'))
      .finally(() => setLoading(false));
  }, []);

  // Demo data if no API data
  useEffect(() => {
    if (!loading && ads.length === 0 && !error) {
      setAds([
        { id: '1', title: 'Summer Sale 2024', status: 'Approved', uploadedAt: '2024-01-15' },
        { id: '2', title: 'New Menu Launch', status: 'Pending Approval', uploadedAt: '2024-01-20' },
        { id: '3', title: 'Ramadan Specials', status: 'Approved', uploadedAt: '2024-01-25' },
      ]);
      setLoading(false);
    }
  }, [loading, ads, error]);

  function onSubmit(data: AdFormData) {
    videoApi.upload({
      title: data.title,
      description: data.description,
      videoUrl: data.videoUrl,
      thumbnailUrl: '',
      storeId: '',
    }).then((res) => {
      const a = res.data as ApiVideoAd | undefined;
      const newAd: VideoAd = {
        id: a?.id ?? `ad-${Date.now()}`,
        title: data.title,
        status: 'Pending Approval',
        uploadedAt: new Date().toISOString().split('T')[0],
      };
      setAds((prev) => [newAd, ...prev]);
      reset();
      setShowForm(false);
    }).catch((err: Error) => setError(err.message));
  }

  function handleDelete(id: string) {
    videoApi.delete(id)
      .then(() => setAds((prev) => prev.filter((a) => a.id !== id)))
      .catch((err: Error) => setError(err.message));
  }

  const approvedCount = ads.filter(a => a.status === 'Approved').length;
  const pendingCount = ads.filter(a => a.status === 'Pending Approval').length;
  const rejectedCount = ads.filter(a => a.status === 'Rejected').length;

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
                <Video size={16} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#FF6B35] bg-clip-text text-transparent">
                  Promotional Videos
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">Manage your video ads shown to buyers</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm((v) => !v)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:scale-105 ${
                showForm ? 'bg-gray-500' : 'bg-gradient-to-r from-[#FF6B35] to-[#ff8a5a]'
              }`}
            >
              <Plus size={16} />
              {showForm ? 'Cancel' : 'Upload Ad'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <PremiumStatCard 
            label="Total Ads" 
            value={ads.length} 
            icon={<Video size={18} />} 
            color="#0F4C81"
          />
          <PremiumStatCard 
            label="Approved" 
            value={approvedCount} 
            icon={<CheckCircle size={18} />} 
            color="#10B981"
            subtitle="Live on platform"
          />
          <PremiumStatCard 
            label="Pending" 
            value={pendingCount} 
            icon={<Clock size={18} />} 
            color="#F59E0B"
            subtitle="Awaiting review"
          />
          <PremiumStatCard 
            label="Rejected" 
            value={rejectedCount} 
            icon={<XCircle size={18} />} 
            color="#EF4444"
            subtitle="Needs revision"
          />
        </div>

        {/* Subscription Banner */}
        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-xl border border-blue-200 p-4">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-blue-100">
              <Crown size={14} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-blue-800">Premium Feature</p>
                <span className="text-[10px] bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full">Pro Plan Required</span>
              </div>
              <p className="text-xs text-blue-700 mt-0.5">
                Promotional videos are available with a premium subscription. Upgrade to reach more customers.
              </p>
            </div>
            <button className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-all duration-300">
              Upgrade Now
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50/90 backdrop-blur-sm border border-rose-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle size={18} className="text-rose-500" />
            <p className="text-sm text-rose-600">{error}</p>
          </div>
        )}

        {/* Create Ad Form */}
        {showForm && (
          <CreateAdForm 
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Video List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#0F4C81] to-[#FF6B35]" />
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Your Ads
              </h2>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">{ads.length}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <Eye size={10} />
              <span>Visible to buyers once approved</span>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-9 bg-gray-200 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : ads.length === 0 ? (
            <div className="text-center py-16 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/40">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Video size={28} className="text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm">No video ads uploaded yet.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-[#FF6B35] to-[#ff8a5a] hover:scale-105 transition-all duration-300"
              >
                Upload Your First Ad
              </button>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-xl overflow-hidden">
              {/* Desktop Header */}
              <div className="hidden lg:block px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="w-[300px]">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Video Ad</span>
                  </div>
                  <div className="w-[140px]">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</span>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {ads.map((ad, idx) => (
                  <AdRow
                    key={ad.id}
                    ad={ad}
                    onDelete={handleDelete}
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
            <div className="p-1.5 rounded-lg bg-[#FF6B35]/10">
              <Sparkles size={14} className="text-[#FF6B35]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700">Pro Tips for Better Engagement</p>
              <p className="text-[11px] text-gray-500 mt-1">
                • Keep videos under 30 seconds for better viewer retention<br />
                • Highlight your best-selling products in the first 5 seconds<br />
                • Include a clear call-to-action (e.g., "Order Now", "Visit Store")
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