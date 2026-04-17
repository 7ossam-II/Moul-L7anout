'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api/endpoints';
import apiClient from '@/lib/api/client';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);

    try {
      const res = await api.auth.verifyOtp(phone, otp);
      
      if (res.success) {
        // ← FIXED: Added /auth/ prefix
        router.push('/auth/login');
      } else {
        setError(res.message || 'Verification failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      // Use apiClient directly since resendOtp might not be typed yet
      const res = await apiClient.post<{ sent: boolean }>('/v1/auth/resend-otp', { phone });
      
      if (res.success) {
        setCountdown(60);
        alert('New verification code sent!');
      } else {
        alert('Failed to resend code. Please try again.');
      }
    } catch (err) {
      alert('Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center">Verify Phone</h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            Enter the 6-digit code sent to {phone}
          </p>
          <p className="mt-1 text-xs text-center text-gray-500">
            (Any 6-digit code works in mock mode)
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              id="otp"
              type="text"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-center text-2xl tracking-widest"
              placeholder="000000"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>

          <div className="text-center">
            {countdown > 0 ? (
              <span className="text-sm text-gray-500">
                Resend code in {countdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50"
              >
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </button>
            )}
          </div>
          
          <div className="text-center">
            <button
              type="button"
              // ← FIXED: Added /auth/ prefix
              onClick={() => router.push('/auth/login')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}