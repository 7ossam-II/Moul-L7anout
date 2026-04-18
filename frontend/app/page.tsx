'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api/client';
import { api } from '@/lib/api/endpoints';
import type { Store, User, Worker, WorkerInvitation } from '@/lib/types/api.types';

export default function Home() {
  const [apiStatus, setApiStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [stores, setStores] = useState<Store[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [workerStores, setWorkerStores] = useState<Store[]>([]);
  const [invitations, setInvitations] = useState<WorkerInvitation[]>([]);
  const [storeWorkers, setStoreWorkers] = useState<Worker[]>([]);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'worker' | 'store'>('overview');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string>('');

  // Check API connection
  useEffect(() => {
    const testConnection = async () => {
      try {
        const health = await apiClient.get('/health');
        console.log('✅ API Health:', health);
        setApiStatus('connected');
        setTestResults(prev => ({ ...prev, health: true }));
      } catch (error) {
        console.error('❌ API Error:', error);
        setApiStatus('error');
        setTestResults(prev => ({ ...prev, health: false }));
      }
    };
    testConnection();
  }, []);

  // Test all endpoints
  const runAllTests = async () => {
    console.log('🧪 Running all tests...');
    
    // Test 1: Get Stores
    try {
      const storesRes = await api.stores.getAll();
      if (storesRes.success && storesRes.data) {
        setStores(storesRes.data);
        setTestResults(prev => ({ ...prev, getStores: true }));
        console.log('✅ Get Stores:', storesRes.data.length, 'stores found');
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, getStores: false }));
      console.error('❌ Get Stores failed:', error);
    }

    // Test 2: Get Products
    try {
      const productsRes = await api.products.getAll();
      if (productsRes.success) {
        setTestResults(prev => ({ ...prev, getProducts: true }));
        console.log('✅ Get Products:', productsRes.data?.length, 'products found');
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, getProducts: false }));
      console.error('❌ Get Products failed:', error);
    }

    // Test 3: Get Current User (if logged in)
    try {
      const userRes = await api.auth.getCurrentUser();
      if (userRes.success && userRes.data) {
        setCurrentUser(userRes.data);
        setIsLoggedIn(true);
        setTestResults(prev => ({ ...prev, getCurrentUser: true }));
        console.log('✅ Current User:', userRes.data.name, `(${userRes.data.role})`);
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, getCurrentUser: false }));
      console.log('ℹ️ Not logged in');
    }
  };

  // Test Worker Features
  const testWorkerFeatures = async () => {
    if (!isLoggedIn) {
      alert('Please login first (use worker@example.com / password123)');
      return;
    }

    console.log('🧪 Testing Worker Features...');

    // Test: Get Worker Stores
    try {
      const workerStoresRes = await api.worker.getMyWorkerStores();
      if (workerStoresRes.success && workerStoresRes.data) {
        setWorkerStores(workerStoresRes.data);
        setTestResults(prev => ({ ...prev, workerStores: true }));
        console.log('✅ Worker Stores:', workerStoresRes.data.length, 'stores');
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, workerStores: false }));
      console.error('❌ Worker Stores failed:', error);
    }

    // Test: Get Pending Invitations
    try {
      const invitationsRes = await api.worker.getMyPendingInvitations();
      if (invitationsRes.success && invitationsRes.data) {
        setInvitations(invitationsRes.data);
        setTestResults(prev => ({ ...prev, invitations: true }));
        console.log('✅ Pending Invitations:', invitationsRes.data.length);
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, invitations: false }));
      console.error('❌ Invitations failed:', error);
    }
  };

  // Test Store Worker Management (Seller Only)
  const testStoreWorkerManagement = async (storeId: string) => {
    if (!isLoggedIn) {
      alert('Please login as seller first (seller@example.com / password123)');
      return;
    }

    console.log('🧪 Testing Store Worker Management for store:', storeId);

    // Test: Get Store Workers
    try {
      const workersRes = await api.worker.getStoreWorkers(storeId);
      if (workersRes.success && workersRes.data) {
        setStoreWorkers(workersRes.data);
        setTestResults(prev => ({ ...prev, storeWorkers: true }));
        console.log('✅ Store Workers:', workersRes.data.length, 'workers');
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, storeWorkers: false }));
      console.error('❌ Get Store Workers failed:', error);
    }

    // Test: Check Permission
    try {
      const permRes = await api.worker.checkPermission(storeId, 'canManageOrders');
      if (permRes.success) {
        console.log('✅ Permission Check:', permRes.data);
      }
    } catch (error) {
      console.error('❌ Permission Check failed:', error);
    }
  };

  // Login function
  // Type guard functions
function isAuthResponseData(obj: unknown): obj is { user: User; token: string; refreshToken?: string } {
  return typeof obj === 'object' && obj !== null && 'user' in obj && 'token' in obj;
}

function isWrappedAuthResponse(obj: unknown): obj is { success: boolean; data: { user: User; token: string } } {
  return typeof obj === 'object' && obj !== null && 'success' in obj && 'data' in obj;
}

// Login function - clean typed version
const handleLogin = async () => {
  try {
    const res = await api.auth.login({ 
      email: loginEmail || 'buyer@example.com', 
      password: loginPassword || 'password123' 
    });
    
    console.log('Login response:', res);
    
    if (res.success && res.data) {
      const innerData = res.data;
      
      // Check if double-wrapped
      if (isWrappedAuthResponse(innerData) && innerData.success) {
        const { user, token } = innerData.data;
        localStorage.setItem('authToken', token);
        setCurrentUser(user);
        setIsLoggedIn(true);
        console.log('✅ Logged in as:', user.role);
      } 
      // Check if single-wrapped
      else if (isAuthResponseData(innerData)) {
        const { user, token } = innerData;
        localStorage.setItem('authToken', token);
        setCurrentUser(user);
        setIsLoggedIn(true);
        console.log('✅ Logged in as:', user.role);
      }
      
      runAllTests();
    }
  } catch (error) {
    console.error('❌ Login failed:', error);
    alert('Login failed. Try: buyer@example.com / password123');
  }
};

  // Quick login presets
  const quickLogin = (role: string) => {
    const credentials: Record<string, { email: string; password: string }> = {
      buyer: { email: 'buyer@example.com', password: 'password123' },
      seller: { email: 'seller@example.com', password: 'password123' },
      worker: { email: 'worker@example.com', password: 'password123' },
      worker2: { email: 'worker2@example.com', password: 'password123' },
      delivery: { email: 'delivery@example.com', password: 'password123' },
      admin: { email: 'admin@example.com', password: 'password123' },
    };
    const cred = credentials[role];
    if (cred) {
      setLoginEmail(cred.email);
      setLoginPassword(cred.password);
      setTimeout(() => handleLogin(), 100);
    }
  };

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🚀 API Testing Dashboard</h1>
      
      {/* Status Bar */}
      <div className="mb-6 p-4 rounded-lg border">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-semibold">API Status:</span>
            <span className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${apiStatus === 'loading' ? 'bg-yellow-200 text-yellow-800' : ''}
              ${apiStatus === 'connected' ? 'bg-green-200 text-green-800' : ''}
              ${apiStatus === 'error' ? 'bg-red-200 text-red-800' : ''}
            `}>
              {apiStatus === 'loading' && '🔄 Testing...'}
              {apiStatus === 'connected' && '✅ Connected'}
              {apiStatus === 'error' && '❌ Error'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-semibold">Mock Mode:</span>
            <span className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${process.env.NEXT_PUBLIC_USE_MOCK === 'true' ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-800'}
            `}>
              {process.env.NEXT_PUBLIC_USE_MOCK === 'true' ? '🎭 Mock' : '🔌 Real API'}
            </span>
          </div>
          
          {currentUser && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">Logged in as:</span>
              <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                {currentUser.name} ({currentUser.role})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Login Section */}
      {!isLoggedIn && (
        <div className="mb-6 p-4 rounded-lg border bg-gray-50">
          <h2 className="text-xl font-semibold mb-3">🔐 Login</h2>
          <div className="flex gap-2 mb-3 flex-wrap">
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="px-3 py-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="px-3 py-2 border rounded"
            />
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Login
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm text-gray-600 mr-2">Quick Login:</span>
            {['buyer', 'seller', 'worker', 'worker2', 'delivery', 'admin'].map(role => (
              <button
                key={role}
                onClick={() => quickLogin(role)}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                {role}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Password for all accounts: password123</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={runAllTests}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          🧪 Run All Tests
        </button>
        {isLoggedIn && currentUser?.role === 'worker' && (
          <button
            onClick={testWorkerFeatures}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            👷 Test Worker Features
          </button>
        )}
        {isLoggedIn && (currentUser?.role === 'seller' || currentUser?.role === 'admin') && stores.length > 0 && (
          <>
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              <option value="">Select Store</option>
              {stores.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
            <button
              onClick={() => testStoreWorkerManagement(selectedStore)}
              disabled={!selectedStore}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              🏪 Test Store Workers
            </button>
          </>
        )}
      </div>

      {/* Test Results Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {Object.entries(testResults).map(([test, passed]) => (
          <div key={test} className={`
            p-3 rounded border flex items-center justify-between
            ${passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}
          `}>
            <span className="text-sm font-medium">{test}</span>
            <span>{passed ? '✅' : '❌'}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b mb-4">
        <nav className="flex gap-4">
          {(['overview', 'worker', 'store'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-2 font-medium capitalize
                ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stores */}
          <div>
            <h3 className="text-lg font-semibold mb-2">🏪 Stores ({stores.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {stores.slice(0, 4).map(store => (
                <div key={store.id} className="p-3 border rounded">
                  <p className="font-medium">{store.name}</p>
                  <p className="text-sm text-gray-600">{store.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Workers: {store.workerIds?.length || 0}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Current User Info */}
          {currentUser && (
            <div>
              <h3 className="text-lg font-semibold mb-2">👤 Current User</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(currentUser, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {activeTab === 'worker' && (
        <div className="space-y-6">
          {/* Worker Stores */}
          <div>
            <h3 className="text-lg font-semibold mb-2">👷 My Worker Stores ({workerStores.length})</h3>
            {workerStores.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {workerStores.map(store => (
                  <div key={store.id} className="p-3 border rounded">
                    <p className="font-medium">{store.name}</p>
                    <p className="text-sm text-gray-600">{store.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No worker stores found. Login as worker to see.</p>
            )}
          </div>

          {/* Pending Invitations */}
          <div>
            <h3 className="text-lg font-semibold mb-2">📨 Pending Invitations ({invitations.length})</h3>
            {invitations.length > 0 ? (
              <div className="space-y-2">
                {invitations.map(inv => (
                  <div key={inv.workerId} className="p-3 border rounded">
                    <p className="font-medium">{inv.store.name}</p>
                    <p className="text-sm text-gray-600">Invited by: {inv.invitedBy.name}</p>
                    <div className="flex gap-2 mt-2">
                      <button className="px-3 py-1 text-sm bg-green-500 text-white rounded">
                        Accept
                      </button>
                      <button className="px-3 py-1 text-sm bg-red-500 text-white rounded">
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No pending invitations.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'store' && (
        <div className="space-y-6">
          {/* Store Workers */}
          <div>
            <h3 className="text-lg font-semibold mb-2">👥 Store Workers ({storeWorkers.length})</h3>
            {storeWorkers.length > 0 ? (
              <div className="space-y-2">
                {storeWorkers.map(worker => (
                  <div key={worker.id} className="p-3 border rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{worker.user?.name || worker.userId}</p>
                        <p className="text-sm text-gray-600">{worker.user?.email}</p>
                      </div>
                      <span className={`
                        px-2 py-1 rounded text-xs
                        ${worker.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        ${worker.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${worker.status === 'inactive' ? 'bg-gray-100 text-gray-800' : ''}
                      `}>
                        {worker.status}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-600">Permissions:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(worker.permissions).map(([perm, value]) => (
                          <span key={perm} className={`
                            text-xs px-2 py-0.5 rounded
                            ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}
                          `}>
                            {perm}: {value ? '✅' : '❌'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Select a store and click &quot;Test Store Workers&quot; to see workers.</p>
            )}
          </div>

          {/* Invite Worker Form */}
          {selectedStore && (
            <div>
              <h3 className="text-lg font-semibold mb-2">📧 Invite New Worker</h3>
              <div className="p-4 border rounded bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="email" placeholder="Email" className="px-3 py-2 border rounded" />
                  <input type="text" placeholder="Name" className="px-3 py-2 border rounded" />
                  <input type="tel" placeholder="Phone (optional)" className="px-3 py-2 border rounded" />
                </div>
                <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Send Invitation
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}