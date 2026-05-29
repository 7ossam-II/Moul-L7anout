'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LkridiRequestsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/seller/lkridi');
  }, [router]);

  return (
    <div className="p-6 text-sm text-gray-500">
      The new LKRIDI hub is at /seller/lkridi. You will be redirected…
    </div>
  );
}
