'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  QrCode, 
  Camera, 
  ChevronLeft, 
  Scan, 
  Sparkles,
  CheckCircle,
  AlertCircle,
  Package,
  ShoppingBag,
  Clock,
  Zap,
  ArrowRight
} from 'lucide-react';

const DUMMY_ORDER_ID = 'ORD-001';

export default function QrScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);

  function handleSimulateScan() {
    setIsScanning(true);
    console.log('QR scanned', DUMMY_ORDER_ID);
    
    // Simulate scan processing
    setTimeout(() => {
      setScanResult({
        success: true,
        message: `Order ${DUMMY_ORDER_ID} verified successfully!`
      });
      setIsScanning(false);
      
      // Clear result after 3 seconds
      setTimeout(() => {
        setScanResult(null);
      }, 3000);
    }, 1500);
  }

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
          <div className="flex items-center gap-4">
            <Link 
              href="/seller/orders" 
              className="p-2.5 rounded-xl hover:bg-white/50 transition-all duration-300 hover:scale-105 group"
            >
              <ChevronLeft size={20} className="text-gray-500 group-hover:text-[#0F4C81]" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#FF6B35] flex items-center justify-center">
                <QrCode size={16} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#FF6B35] bg-clip-text text-transparent">
                  QR Scanner
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">Scan buyer QR codes to verify orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8 max-w-2xl mx-auto">
        
        {/* Scanner Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-xl overflow-hidden">
          {/* Scanner Area */}
          <div className="relative p-6">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
              {/* Scan Frame */}
              <div className="aspect-square flex items-center justify-center relative">
                {/* Animated scanning line */}
                {isScanning && (
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF6B35] to-transparent animate-scanLine" />
                  </div>
                )}
                
                {/* QR Code Placeholder */}
                <div className="text-center z-10">
                  <div className="w-32 h-32 mx-auto mb-4 relative">
                    <div className="absolute inset-0 border-4 border-white/20 rounded-2xl" />
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#FF6B35] rounded-tl-2xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#FF6B35] rounded-tr-2xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#FF6B35] rounded-bl-2xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#FF6B35] rounded-br-2xl" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <QrCode size={48} className="text-white/60" />
                    </div>
                  </div>
                  <p className="text-white/70 text-sm">
                    {isScanning ? 'Scanning...' : 'Position QR code in frame'}
                  </p>
                </div>
              </div>
            </div>

            {/* Scanner Controls */}
            <div className="mt-6 space-y-4">
              <button
                onClick={handleSimulateScan}
                disabled={isScanning}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 ${
                  isScanning ? 'bg-gray-400' : 'bg-gradient-to-r from-[#FF6B35] to-[#ff8a5a]'
                }`}
              >
                {isScanning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Camera size={18} />
                    Start Scanning
                  </>
                )}
              </button>

              {/* Scan Result */}
              {scanResult && (
                <div className={`p-4 rounded-xl flex items-start gap-3 animate-fadeIn ${
                  scanResult.success 
                    ? 'bg-emerald-50 border border-emerald-200' 
                    : 'bg-rose-50 border border-rose-200'
                }`}>
                  {scanResult.success ? (
                    <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${scanResult.success ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {scanResult.success ? 'Success!' : 'Error'}
                    </p>
                    <p className={`text-xs ${scanResult.success ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {scanResult.message}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-blue-50">
              <Sparkles size={14} className="text-blue-500" />
            </div>
            <h3 className="text-sm font-semibold text-gray-800">How to scan</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#0F4C81]/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-[#0F4C81]">1</span>
              </div>
              <p className="text-sm text-gray-600">Ask the buyer to show their order QR code</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#0F4C81]/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-[#0F4C81]">2</span>
              </div>
              <p className="text-sm text-gray-600">Position the QR code inside the scanning frame</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#0F4C81]/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-[#0F4C81]">3</span>
              </div>
              <p className="text-sm text-gray-600">Once verified, confirm order completion with the buyer</p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-6 bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm rounded-xl border border-amber-200 p-4">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-amber-100">
              <Zap size={14} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-amber-800">Camera Integration Status</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Camera integration is pending API development. Use the simulate button for testing.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Scans Placeholder */}
        <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-purple-50">
              <Clock size={14} className="text-purple-500" />
            </div>
            <h3 className="text-sm font-semibold text-gray-800">Recent Scans</h3>
          </div>
          <div className="text-center py-6">
            <Scan size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-400">No recent scans</p>
            <p className="text-[10px] text-gray-400 mt-1">Scanned QR codes will appear here</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.05; transform: scale(1); }
          50% { opacity: 0.08; transform: scale(1.05); }
        }
        
        @keyframes scanLine {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(1000%);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-scanLine {
          animation: scanLine 2s linear infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}