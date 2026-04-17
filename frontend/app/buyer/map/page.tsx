'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { storesApi } from '@/lib/api/endpoints';
import Link from 'next/link';

export default function MapPage() {
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

  const { data: stores, isLoading } = useQuery({
    queryKey: ['nearby-stores-map', location],
    queryFn: () => {
      if (!location) return Promise.resolve([]);
      return storesApi.getNearby(location.lat, location.lng, 5000);
    },
    enabled: !!location,
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold">Map View</h1>
        <p className="text-gray-600 text-sm">Nearby stores on the map</p>
      </div>

      <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
        <p className="text-gray-600">Map integration coming soon</p>
      </div>

      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Nearby Stores</h2>
        {isLoading && <p className="text-center text-gray-600">Loading...</p>}
        {stores && stores.data && stores.data.length > 0 ? (
          <div className="space-y-3">
            {stores.data.map((store: any) => (
              <Link key={store._id} href={`/buyer/store/${store._id}`}>
                <div className="bg-white rounded-lg p-3 shadow hover:shadow-md transition cursor-pointer">
                  <h3 className="font-bold">{store.name}</h3>
                  <p className="text-sm text-gray-600">{store.address}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No stores found</p>
        )}
      </div>
    </div>
  );
}
