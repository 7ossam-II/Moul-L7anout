'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { productsApi } from '@/lib/api/endpoints';

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
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
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
      <div className="p-6 max-w-xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <p className="text-green-700 font-medium">
            {editId ? 'Product updated!' : 'Product added!'}
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 px-4 py-2 rounded text-white text-sm"
            style={{ backgroundColor: '#0F4C81' }}
          >
            Add Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-1" style={{ color: '#0F4C81' }}>
        {editId ? 'Edit Product' : 'Add Product'}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {editId ? 'Update the product details below.' : 'Fill in the details for your new product.'}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded px-4 py-3 text-sm text-red-600">
            {submitError}
          </div>
        )}

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('name')}
            type="text"
            placeholder="e.g. Harira Soup"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          <FieldError message={errors.name?.message} />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            {...register('category')}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (MAD) <span className="text-red-500">*</span>
          </label>
          <input
            {...register('price')}
            type="number"
            min={0}
            step="0.01"
            placeholder="0.00"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          <FieldError message={errors.price?.message} />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Short description (max 500 characters)"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
          />
          <FieldError message={errors.description?.message} />
        </div>

        {/* Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handlePhotoChange}
            className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:text-white"
            style={{ '--file-bg': '#0F4C81' } as React.CSSProperties}
          />
          {photoFile && (
            <p className="text-xs text-green-600 mt-1">{photoFile.name} selected</p>
          )}
          {photoError && <p className="text-xs text-red-500 mt-1">{photoError}</p>}
        </div>

        {/* Stock Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock Quantity <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            {...register('quantity')}
            type="number"
            min={0}
            placeholder="Leave blank if unlimited"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          <FieldError message={errors.quantity?.message} />
        </div>

        {/* Availability Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
          <label className="flex items-center gap-3 cursor-pointer w-fit">
            <input
              {...register('isAvailable')}
              type="checkbox"
              className="w-4 h-4 accent-blue-700"
            />
            <span className="text-sm text-gray-700">
              {isAvailable ? 'Available' : 'Not available'}
            </span>
          </label>
        </div>

        {/* Expected Availability Date — shown only when unavailable */}
        {!isAvailable && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Availability Date <span className="text-red-500">*</span>
            </label>
            <input
              {...register('expectedAvailabilityDate')}
              type="date"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <FieldError message={errors.expectedAvailabilityDate?.message} />
          </div>
        )}

        {/* LKRIDI Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">LKRIDI</label>
          <label className="flex items-center gap-3 cursor-pointer w-fit">
            <input
              {...register('lkridiEnabled')}
              type="checkbox"
              className="w-4 h-4 accent-orange-500"
            />
            <span className="text-sm text-gray-700">Enable LKRIDI for this product</span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded text-white text-sm font-medium disabled:opacity-60"
            style={{ backgroundColor: '#FF6B35' }}
          >
            {isSubmitting ? 'Submitting...' : editId ? 'Update Product' : 'Add Product'}
          </button>
        </div>

      </form>
    </div>
  );
}
