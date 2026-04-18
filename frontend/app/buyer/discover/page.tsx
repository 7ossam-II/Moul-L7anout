'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { storesApi } from '@/lib/api/endpoints';
import type { ApiResponse, Store } from '@/lib/types/api.types';
import Link from 'next/link';

export default function DiscoverPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  const { data: stores, isLoading, error } = useQuery<ApiResponse<Store[]>>({
    queryKey: ['nearby-stores', location],
    queryFn: (): Promise<ApiResponse<Store[]>> => {
      if (!location) return Promise.resolve({ success: true, data: [] });
      return storesApi.getNearby(location.lat, location.lng, 5000);
    },
    enabled: !!location,
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-sm z-10 p-4">
        <h1 className="text-2xl font-bold">Discover Stores</h1>
        <p className="text-gray-600 text-sm">Find nearby sellers and kiosks</p>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading && <p className="text-center text-gray-600">Loading stores...</p>}
        {error && <p className="text-center text-red-600">Error loading stores</p>}

        {stores && stores.data && stores.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {stores.data.map((store: Store) => (
              <Link key={store.id} href={`/buyer/store/${store.id}`}>
                <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition cursor-pointer">
                  {store.logo && (
                    <img
                      src={store.logo}
                      alt={store.name}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  )}
                  <h3 className="font-bold text-lg">{store.name}</h3>
                  <p className="text-gray-600 text-sm">{store.address}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-yellow-500">★ {store.rating}</span>
                    <span className={`text-sm ${store.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                      {store.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No stores found nearby</p>
        )}
      </div>
    </div>
  );
}
