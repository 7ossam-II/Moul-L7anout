'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { productsApi } from '@/lib/api/endpoints';
import { 
  Package, 
  ArrowLeft, 
  Upload, 
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Tag,
  Layers,
  Calendar,
  Zap
} from 'lucide-react';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const productSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100, 'Max 100 characters'),
    category: z.enum(['Electronics', 'Food', 'Fashion', 'Home', 'Other'], {
      errorMap: () => ({ message: 'Select a category' }),
    }),
    price: z.coerce.number({ invalid_type_error: 'Price is required' }).min(0, 'Min 0'),
    description: z.string().max(500, 'Max 500 characters').optional(),
    quantity: z.coerce.number().min(0, 'Min 0').optional(),
    isAvailable: z.boolean(),
    expectedAvailabilityDate: z.string().optional(),
    lkridiEnabled: z.boolean(),
  })
  .refine(
    (data) => data.isAvailable || !!data.expectedAvailabilityDate,
    {
      message: 'Expected availability date is required when product is unavailable',
      path: ['expectedAvailabilityDate'],
    }
  );

type ProductFormData = z.infer<typeof productSchema>;

// ---------------------------------------------------------------------------
// Field error helper
// ---------------------------------------------------------------------------

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
      <AlertCircle size={12} />
      {message}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const BLANK_DEFAULTS = {
  isAvailable: true as const,
  lkridiEnabled: false,
  name: '',
  price: 0,
  description: '',
  quantity: undefined,
  expectedAvailabilityDate: '',
};

export default function ProductsPage() {
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: BLANK_DEFAULTS,
  });

  useEffect(() => {
    if (!editId) return;
    productsApi.getById(editId)
      .then((res) => {
        const p = res.data;
        if (!p) return;
        reset({
          name:                     p.name,
          category:                 (p.category as ProductFormData['category']) ?? 'Other',
          price:                    p.price,
          description:              p.description ?? '',
          quantity:                 p.quantity ?? undefined,
          isAvailable:              p.inStock,
          expectedAvailabilityDate: '',
          lkridiEnabled:            false,
        });
      })
      .catch(() => {});
  }, [editId]); // eslint-disable-line react-hooks/exhaustive-deps

  const isAvailable = watch('isAvailable');

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setPhotoError(null);
    setPhotoFile(null);
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setPhotoError('Only JPG and PNG files are allowed');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setPhotoError('File must be under 5MB');
      return;
    }
    setPhotoFile(file);
  }

  async function onSubmit(data: ProductFormData) {
    setSubmitError(null);
    try {
      if (editId) {
        await productsApi.update(editId, {
          name:        data.name,
          price:       data.price,
          description: data.description ?? '',
          inStock:     data.isAvailable,
          quantity:    data.quantity ?? 0,
          category:    data.category,
        } as Parameters<typeof productsApi.update>[1]);
      } else {
        await productsApi.create({
          storeId,
          name:        data.name,
          price:       data.price,
          description: data.description ?? '',
          inStock:     data.isAvailable,
          quantity:    data.quantity ?? 0,
          category:    data.category,
        } as Parameters<typeof productsApi.create>[0]);
      }
      reset(BLANK_DEFAULTS);
      setPhotoFile(null);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save product. Please try again.');
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/80 flex items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-8 text-center shadow-xl max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <p className="text-green-700 font-semibold text-lg">
            {editId ? 'Product updated successfully!' : 'Product added successfully!'}
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 px-6 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:scale-105"
            style={{ backgroundColor: '#0F4C81' }}
          >
            Add Another Product
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/80">
      <div className="px-6 lg:px-8 py-6">
        
        {/* Header with back button */}
        <div className="mb-6">
          <Link 
            href={`/seller/stores/${storeId}/products`}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0F4C81] transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#0F4C81] to-[#FF6B35] flex items-center justify-center shadow-lg">
              <Package size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {editId ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {editId ? 'Update your product details below.' : 'Fill in the details to add a new product to your store.'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg overflow-hidden">
            
            <form onSubmit={handleSubmit(onSubmit)}>
              
              {submitError && (
                <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{submitError}</p>
                </div>
              )}

              <div className="p-6 space-y-6">
                
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('name')}
                      type="text"
                      placeholder="e.g., Harira Soup, Beef Tacos, Fresh Orange Juice"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81] transition-all"
                    />
                  </div>
                  <FieldError message={errors.name?.message} />
                </div>

                {/* Category & Price Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('category')}
                      className="w-full px-3 py-2.5 bg-white/80 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81] transition-all"
                    >
                      <option value="">Select a category</option>
                      {['Electronics', 'Food', 'Fashion', 'Home', 'Other'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <FieldError message={errors.category?.message} />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price (MAD) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register('price')}
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81] transition-all"
                      />
                    </div>
                    <FieldError message={errors.price?.message} />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    placeholder="Describe your product... (max 500 characters)"
                    className="w-full px-4 py-2.5 bg-white/80 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81] transition-all resize-none"
                  />
                  <FieldError message={errors.description?.message} />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Photo
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handlePhotoChange}
                      className="w-full opacity-0 absolute inset-0 cursor-pointer z-10"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white/80 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#0F4C81] transition-all group"
                    >
                      <Upload size={20} className="text-gray-400 group-hover:text-[#0F4C81] transition-colors" />
                      <span className="text-sm text-gray-500 group-hover:text-gray-700">
                        {photoFile ? photoFile.name : 'Click or drag to upload image (JPG/PNG, max 5MB)'}
                      </span>
                    </label>
                  </div>
                  {photoFile && (
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <CheckCircle size={12} />
                      {photoFile.name} ready to upload
                    </p>
                  )}
                  {photoError && <FieldError message={photoError} />}
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Layers size={14} />
                      Stock Quantity
                      <span className="text-xs text-gray-400 font-normal">(optional)</span>
                    </div>
                  </label>
                  <input
                    {...register('quantity')}
                    type="number"
                    min={0}
                    placeholder="Leave blank if unlimited"
                    className="w-full px-4 py-2.5 bg-white/80 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81] transition-all"
                  />
                  <FieldError message={errors.quantity?.message} />
                </div>

                {/* Availability Toggle */}
                <div className="bg-white/40 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Availability Status
                      </label>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Toggle to mark as available or unavailable
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        {...register('isAvailable')}
                        type="checkbox"
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10B981]"></div>
                      <span className="ms-3 text-sm font-medium text-gray-700">
                        {isAvailable ? 'Available' : 'Not Available'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Expected Availability Date — shown only when unavailable */}
                {!isAvailable && (
                  <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        Expected Availability Date <span className="text-red-500">*</span>
                      </div>
                    </label>
                    <input
                      {...register('expectedAvailabilityDate')}
                      type="date"
                      className="w-full px-4 py-2.5 bg-white/80 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81] transition-all"
                    />
                    <FieldError message={errors.expectedAvailabilityDate?.message} />
                  </div>
                )}

                {/* LKRIDI Toggle */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Zap size={16} className="text-[#FF6B35]" />
                        <label className="text-sm font-semibold text-gray-700">
                          LKRIDI Quick Payment
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Enable instant payment collection for this product
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        {...register('lkridiEnabled')}
                        type="checkbox"
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B35]"></div>
                      <span className="ms-3 text-sm font-medium text-gray-700">
                        {watch('lkridiEnabled') ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>
                  </div>
                </div>

              </div>

              {/* Submit Button */}
              <div className="border-t border-gray-100 bg-white/40 px-6 py-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 shadow-lg"
                  style={{ 
                    background: 'linear-gradient(135deg, #0F4C81, #FF6B35)',
                  }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {editId ? 'Updating...' : 'Adding...'}
                    </div>
                  ) : (
                    editId ? 'Update Product' : 'Add Product'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}