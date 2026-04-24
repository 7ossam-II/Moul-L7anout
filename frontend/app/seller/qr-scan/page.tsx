'use client';

import Link from 'next/link';

const DUMMY_ORDER_ID = 'ORD-001';

export default function QrScanPage() {
  function handleSimulateScan() {
    console.log('QR scanned', DUMMY_ORDER_ID);
    // TODO: axios POST /api/seller/qr/verify { token: scannedToken }
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-6">
      <Link href="/seller/orders" className="text-sm hover:underline" style={{ color: '#0F4C81' }}>
        ← Back to Orders
      </Link>

      <h1 className="text-2xl font-bold" style={{ color: '#0F4C81' }}>
        Scan Buyer QR
      </h1>

      <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center">
        <p className="text-sm text-gray-400">QR code will appear here</p>
      </div>

      <button
        onClick={handleSimulateScan}
        className="w-full py-3 rounded text-white text-sm font-medium"
        style={{ backgroundColor: '#FF6B35' }}
      >
        Simulate Scan
      </button>

      <p className="text-xs text-center text-gray-400">
        Camera integration pending — waiting on Yahya's scanning API.
      </p>
    </div>
  );
}
