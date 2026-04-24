'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { videoApi } from '@/lib/api/endpoints';
import type { VideoAd as ApiVideoAd } from '@/lib/types/api.types';

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

const STATUS_STYLES: Record<AdStatus, string> = {
  'Approved':         'bg-green-100 text-green-700',
  'Pending Approval': 'bg-yellow-100 text-yellow-700',
  'Rejected':         'bg-red-100 text-red-600',
};

// ---------------------------------------------------------------------------
// Field error helper
// ---------------------------------------------------------------------------

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

// ---------------------------------------------------------------------------
// Page
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
        setAds(data.map((a) => ({
          id: a.id,
          title: a.title,
          status: mapStatus(a.status),
          uploadedAt: a.createdAt?.split('T')[0] ?? '',
        })));
      })
      .catch((err: Error) => setError(err.message ?? 'Failed to load ads.'))
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#0F4C81' }}>
            Promotional Videos
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your video ads shown to buyers.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2 rounded text-white text-sm font-medium shrink-0"
          style={{ backgroundColor: '#FF6B35' }}
        >
          {showForm ? 'Cancel' : '+ Upload Ad'}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Subscription banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
        Promotional videos are available with a premium subscription.
      </div>

      {/* Upload form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">New Video Ad</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register('title')}
                type="text"
                placeholder="e.g. Summer Sale — Maarif Store"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <FieldError message={errors.title?.message} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Short description (max 300 characters)"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
              />
              <FieldError message={errors.description?.message} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video URL <span className="text-red-500">*</span>
              </label>
              <input
                {...register('videoUrl')}
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <FieldError message={errors.videoUrl?.message} />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded text-white text-sm font-medium disabled:opacity-60"
              style={{ backgroundColor: '#0F4C81' }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Review'}
            </button>
          </form>
        </div>
      )}

      {/* Video list */}
      <section>
        <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
          Your Ads ({ads.length})
        </h2>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : ads.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-sm text-gray-400">
            No video ads uploaded yet.
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                    <th className="px-4 py-3 border-b border-gray-200 w-14">Thumb</th>
                    <th className="px-4 py-3 border-b border-gray-200">Title</th>
                    <th className="px-4 py-3 border-b border-gray-200">Uploaded</th>
                    <th className="px-4 py-3 border-b border-gray-200">Status</th>
                    <th className="px-4 py-3 border-b border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {ads.map((ad) => (
                    <tr key={ad.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="w-10 h-7 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">▶</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">{ad.title}</td>
                      <td className="px-4 py-3 text-gray-500">{ad.uploadedAt}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[ad.status]}`}>
                          {ad.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(ad.id)}
                          className="px-3 py-1 rounded text-xs font-medium border border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-3">
              {ads.map((ad) => (
                <div key={ad.id} className="bg-white border border-gray-200 rounded-lg p-4 flex gap-3">
                  <div className="w-12 h-9 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-sm shrink-0">▶</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800 truncate">{ad.title}</p>
                    <p className="text-xs text-gray-400 mb-2">{ad.uploadedAt}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[ad.status]}`}>
                        {ad.status}
                      </span>
                      <button
                        onClick={() => handleDelete(ad.id)}
                        className="px-2 py-0.5 rounded text-xs border border-red-300 text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

    </div>
  );
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

