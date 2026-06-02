import apiClient from './client';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  Store,
  Product,
  Order,
  LkridiMembership,
  Worker,
  WorkerPermissions,
  WorkerInvitation,
  QRCode,
  Rating,
  ChatMessage,
  Conversation,
  Notification,
  Dispute,
  StoreStats,
} from '../types/api.types';

// ============================================
// Auth API (FR1)
// ============================================

export const authApi = {
  login: (credentials: LoginCredentials) => 
    apiClient.post<AuthResponse>('/auth/login', credentials as unknown as Record<string, unknown>),
  
  register: (data: RegisterData) => 
    apiClient.post<AuthResponse>('/auth/register', data as unknown as Record<string, unknown>),
  
  verifyOtp: (phone: string, otp: string) => 
    apiClient.post<{ verified: boolean }>('/auth/verify-otp', { phone, otp }),
  
  resendOtp: (phone: string) =>
    apiClient.post<{ sent: boolean }>('/auth/resend-otp', { phone }),
  
  getCurrentUser: () => 
    apiClient.get<User>('/auth/me'),
  
  logout: () => 
    apiClient.post('/auth/logout'),
  
  refreshToken: (refreshToken: string) =>
    apiClient.post<{ token: string }>('/auth/refresh', { refreshToken }),
  
  forgotPassword: (email: string) =>
    apiClient.post<{ sent: boolean }>('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, newPassword: string) =>
    apiClient.post<{ success: boolean }>('/auth/reset-password', { token, newPassword }),
  
  updateProfile: (data: Partial<User>) =>
    apiClient.put<User>('/auth/profile', data as unknown as Record<string, unknown>),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post<{ changed: boolean }>('/auth/change-password', { currentPassword, newPassword }),
};

// ============================================
// Stores API (FR2)
// ============================================

export const storesApi = {
  getAll: (params?: { page?: number; limit?: number; lat?: number; lng?: number; radius?: number; category?: string }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return apiClient.get<Store[]>(`/stores${query ? `?${query}` : ''}`);
  },
  
  getById: (id: string) =>
    apiClient.get<Store>(`/stores/${id}`),

  getNearby: (lat: number, lng: number, radius?: number) => {
    const params = new URLSearchParams({ lat: String(lat), lng: String(lng) });
    if (radius) params.append('radius', String(radius));
    return apiClient.get<Store[]>(`/stores?${params.toString()}`);
  },

  create: (data: Partial<Store>) =>
    apiClient.post<Store>('/stores', data as unknown as Record<string, unknown>),

  update: (id: string, data: Partial<Store>) =>
    apiClient.put<Store>(`/stores/${id}`, data as unknown as Record<string, unknown>),

  delete: (id: string) =>
    apiClient.delete(`/stores/${id}`),

  getMyStores: () =>
    apiClient.get<Store[]>('/stores'),

  getStoreStats: (id: string) =>
    apiClient.get<StoreStats>(`/stores/${id}/stats`),
  getSellerStores: () =>
      apiClient.get<Store[]>('/seller/stores'),
};

// seller API

// ============================================
// Products API (FR7.1)
// ============================================

export const productsApi = {
  getAll: (params?: { storeId?: string; category?: string; search?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return apiClient.get<Product[]>(`/stores/${params?.storeId ?? ''}/products${query ? `?${query}` : ''}`);
  },
  
  getById: (id: string) =>
    apiClient.get<Product>(`/products/${id}`),

  getCategories: () =>
    apiClient.get<string[]>('/products/categories'),

  create: (data: Partial<Product>) =>
    apiClient.post<Product>('/products', data as unknown as Record<string, unknown>),

  update: (id: string, data: Partial<Product>) =>
    apiClient.put<Product>(`/products/${id}`, data as unknown as Record<string, unknown>),

  delete: (id: string) =>
    apiClient.delete(`/products/${id}`),
};

// ============================================
// Orders API (FR3)
// ============================================

export const ordersApi = {
  getAll: (params?: { userId?: string; storeId?: string; status?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return apiClient.get<Order[]>(`/orders${query ? `?${query}` : ''}`);
  },
  
  getMyOrders: (params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return apiClient.get<Order[]>(`/orders/my-orders${query ? `?${query}` : ''}`);
  },
  
  getById: (id: string) =>
    apiClient.get<Order>(`/orders/${id}`),

  create: (data: Partial<Order>) =>
    apiClient.post<Order>('/orders', data as unknown as Record<string, unknown>),

  updateStatus: (id: string, status: Order['status']) =>
    apiClient.patch<Order>(`/orders/${id}/status`, { status }),

  cancel: (id: string, reason?: string) =>
    apiClient.post<Order>(`/orders/${id}/cancel`, { reason }),

  accomplish: (orderId: string, userId: number, role: 'BUYER' | 'SELLER') =>
    apiClient.post<{ success: boolean; message: string }>(`/orders/${orderId}/accomplished`, { userId, role }),
};

// ============================================
// QR Code API (FR4)
// ============================================

export const qrApi = {
  generate: (data: { orderId: string; storeId: string; type: 'online' | 'offline' | 'lkridi' | 'delivery' }) =>
    apiClient.post<{ qrCode: string; expiresAt: string | null; orderId: string; storeName: string }>('/v1/qr/generate', data),
  
  validate: (code: string) =>
    apiClient.get<{ valid: boolean; order: Order; store: Partial<Store>; paymentStatus: string; type: string }>(`/v1/qr/${code}`),
  
  scan: (code: string) =>
    apiClient.post<{ scanned: boolean; order: Order; items: Order['items']; paymentStatus: string; totalAmount: number }>(`/v1/qr/${code}/scan`, {}),
  
  accomplish: (code: string) =>
    apiClient.post<{ accomplished: boolean; bothAccomplished: boolean; message: string }>(`/v1/qr/${code}/accomplish`, {}),
  
  getStoreQRCodes: (storeId: string) =>
    apiClient.get<QRCode[]>(`/qr/store/${storeId}`),
  
  deactivate: (codeId: string) =>
    apiClient.post<{ deactivated: boolean }>(`/qr/${codeId}/deactivate`, {}),
};

// ============================================
// Delivery API (FR5)
// ============================================

export const deliveryApi = {
  getAvailableOrders: (params?: { lat?: number; lng?: number; radius?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return apiClient.get<Order[]>(`/delivery/available-orders${query ? `?${query}` : ''}`);
  },
  
  acceptOrder: (orderId: string) =>
    apiClient.post<{ success: boolean }>(`/delivery/orders/${orderId}/accept`, {}),
  
  updateLocation: (orderId: string, lat: number, lng: number) =>
    apiClient.post<{ success: boolean }>(`/delivery/orders/${orderId}/location`, { lat, lng }),
  
  markPickedUp: (orderId: string) =>
    apiClient.post<{ success: boolean }>(`/delivery/orders/${orderId}/picked-up`, {}),
  
  markDelivered: (orderId: string) =>
    apiClient.post<{ success: boolean }>(`/delivery/orders/${orderId}/delivered`, {}),
  
  getMyDeliveries: (params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return apiClient.get<Order[]>(`/delivery/my-deliveries${query ? `?${query}` : ''}`);
  },
};

// ============================================
// LKRIDI API (FR6)
// ============================================

export const lkridiApi = {
  getMembership: () =>
    apiClient.get<LkridiMembership>('/lkridi/membership'),

  requestMembership: (buyerId: number, sellerId: number) =>
    apiClient.post<{ success: boolean; membershipId: number; approvalStatus: string }>('/lkridi/membership/request', { buyerId, sellerId }),

  approveMembership: (membershipId: string, approved: boolean) =>
    apiClient.post<{ success: boolean; approvalStatus: string }>(`/lkridi/membership/${membershipId}/approve`, { approved }),

  createOrder: (data: { buyerId: number; storeId: number; items: { productId: number; quantity: number }[]; deadline: string }) =>
    apiClient.post<{ success: boolean; orderId: number; amountOwed: number; orderStatus: string; qrCode: string }>('/lkridi/orders', data as unknown as Record<string, unknown>),

  acceptOrder: (orderId: string) =>
    apiClient.post<{ success: boolean; orderStatus: string }>(`/lkridi/orders/${orderId}/accept`, {}),

  repayLoan: (orderId: string, buyerId: number, sellerId: number) =>
    apiClient.post<{ success: boolean; message: string }>(`/lkridi/orders/${orderId}/repay`, { buyerId, sellerId }),

  confirmPayment: (recordId: string) =>
    apiClient.post<{ success: boolean; repaymentStatus: string }>(`/lkridi/records/${recordId}/confirm-payment`, {}),

  getTransactions: (params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return apiClient.get(`/lkridi/records${query ? `?${query}` : ''}`);
  },
};


//=========================================
//seller lkridi API
//====================================
export const sellerLkridiApi = {
  // Get stats (pending membership, approved members, pending loans)
  getStats: () => apiClient.get('/seller/lkridi/stats'),

  // Get list of pending membership requests
  getMembershipRequests: () => apiClient.get('/seller/lkridi/membership-requests'),

  // Get list of approved members
  getApprovedMembers: () => apiClient.get('/seller/lkridi/approved-members'),

  // Get list of pending loan requests (LKRIDI orders)
  getLoanRequests: () => apiClient.get('/seller/lkridi/loan-requests'),

  // Approve or decline a membership request
  approveMembership: (membershipId: string, approved: boolean) =>
    apiClient.post(`/seller/lkridi/membership/${membershipId}/approve`, { approved }),

  // Approve or decline a loan request (order)
  approveLoan: (orderId: string, approved: boolean, deadline?: string) =>
    apiClient.post(`/seller/lkridi/orders/${orderId}/approve`, { approved, deadline }),
  getRecords: () => apiClient.get('/seller/lkridi/records'),
  markAsPaid: (recordId: string, confirmed: boolean) =>
  apiClient.post(`/seller/lkridi/records/${recordId}/mark-paid`, { confirmed }),
};
//============================================


// ============================================
// Worker API (FR7.6)
// ============================================

export const workerApi = {
  getMyWorkerStores: () => 
    apiClient.get<Store[]>('/workers/my-stores'),
  
  getMyPendingInvitations: () =>
    apiClient.get<WorkerInvitation[]>('/workers/invitations'),
  
  acceptInvitation: (workerId: string, password: string) =>
    apiClient.post<{ accepted: boolean }>(`/workers/invitations/${workerId}/accept`, { password }),
  
  declineInvitation: (workerId: string) =>
    apiClient.post<{ declined: boolean }>(`/workers/invitations/${workerId}/decline`, {}),
  
  getStoreWorkers: (storeId: string) =>
    apiClient.get<Worker[]>(`/stores/${storeId}/workers`),

  inviteWorker: (storeId: string, data: { email: string; name: string; phone?: string; permissions: Partial<WorkerPermissions> }) =>
    apiClient.post<Worker>(`/stores/${storeId}/workers`, data as unknown as Record<string, unknown>),

  updateWorkerPermissions: (storeId: string, workerId: string, permissions: Partial<WorkerPermissions>) =>
    apiClient.put<Worker>(`/stores/${storeId}/workers/${workerId}`, { permissions }),

  removeWorker: (storeId: string, workerId: string) =>
    apiClient.delete<{ removed: boolean; workerId: string }>(`/stores/${storeId}/workers/${workerId}`),
  
  checkPermission: (storeId: string, permission: keyof WorkerPermissions) =>
    apiClient.get<{ hasPermission: boolean }>(`/workers/stores/${storeId}/check-permission?permission=${permission}`),
};

// ============================================
// Chat API (FR8.1)
// ============================================

export const chatApi = {
  getConversations: () =>
    apiClient.get<Conversation[]>('/chat/conversations'),
  
  getMessages: (conversationId: string) =>
    apiClient.get<ChatMessage[]>(`/chat/${conversationId}`),
  
  sendMessage: (conversationId: string, message: string, type: 'text' | 'image' = 'text') =>
    apiClient.post<ChatMessage>(`/chat/${conversationId}`, { message, type }),
  
  markAsRead: (conversationId: string) =>
    apiClient.post(`/chat/${conversationId}/read`, {}),
};

// ============================================
// Notifications API (FR8.2)
// ============================================

export const notificationsApi = {
  getAll: () =>
    apiClient.get<Notification[]>('/notifications'),
  
  markAsRead: (id: string) =>
    apiClient.patch(`/notifications/${id}/read`, {}),
  
  markAllAsRead: () =>
    apiClient.patch('/notifications/read-all', {}),
};

// ============================================
// Ratings API (FR10.3)
// ============================================

export const ratingsApi = {
  getStoreRatings: (storeId: string, params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return apiClient.get<Rating[]>(`/stores/${storeId}/ratings${query ? `?${query}` : ''}`);
  },
  
  create: (data: { storeId: string; orderId: string; rating: number; comment?: string; isAnonymous?: boolean }) =>
    apiClient.post<Rating>('/ratings', data),
};

// ============================================
// Video API (FR9)
// ============================================

export const videoApi = {
  getAll: (params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return apiClient.get(`/videos${query ? `?${query}` : ''}`);
  },
  
  getById: (id: string) =>
    apiClient.get(`/videos/${id}`),
  
  upload: (data: { title: string; description?: string; videoUrl: string; thumbnailUrl: string; storeId: string }) =>
    apiClient.post('/videos', data),
  
  delete: (id: string) =>
    apiClient.delete(`/videos/${id}`),
  
  like: (id: string) =>
    apiClient.post(`/videos/${id}/like`, {}),
};

// ============================================
// Analytics API (FR10)
// ============================================

export const analyticsApi = {
  getBuyerStats: (buyerId: string) =>
    apiClient.get(`/analytics/buyer/${buyerId}`),
  
  getSellerStats: (sellerId: string) =>
    apiClient.get(`/analytics/seller/${sellerId}`),
};

// ============================================
// Admin API (FR11)
// ============================================

export const adminApi = {
  getStats: () =>
    apiClient.get('/admin/stats'),
  
  getUsers: (params?: { page?: number; limit?: number; role?: string }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return apiClient.get(`/admin/users${query ? `?${query}` : ''}`);
  },
  
  getPendingSellers: () =>
    apiClient.get('/admin/sellers/pending'),
  
  approveSeller: (sellerId: string) =>
    apiClient.post(`/admin/sellers/${sellerId}/approve`, {}),
  
  rejectSeller: (sellerId: string, reason?: string) =>
    apiClient.post(`/admin/sellers/${sellerId}/reject`, { reason }),
  
  getDisputes: (params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return apiClient.get(`/admin/disputes${query ? `?${query}` : ''}`);
  },
  
  resolveDispute: (disputeId: string, resolution: string) =>
    apiClient.post(`/admin/disputes/${disputeId}/resolve`, { resolution }),
};

// ============================================
// Dispute API (FR11.2)
// ============================================

export const disputeApi = {
  getAll: (params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return apiClient.get<Dispute[]>(`/disputes${query ? `?${query}` : ''}`);
  },
  
  getById: (id: string) =>
    apiClient.get<Dispute>(`/disputes/${id}`),
  
  create: (data: { orderId: string; type: string; description: string; evidence?: string[] }) =>
    apiClient.post<Dispute>('/disputes', data),
};

// ============================================
// Upload API
// ============================================

export const uploadApi = {
  uploadImage: (file: File, folder?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);
    return apiClient.upload<{ url: string; publicId: string; filename: string; size: number }>('/v1/upload/image', formData);
  },
  
  uploadMultiple: (files: File[], folder?: string) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    if (folder) formData.append('folder', folder);
    return apiClient.upload<Array<{ url: string; publicId: string; filename: string; size: number }>>('/v1/upload/multiple', formData);
  },
};
export const sellerApi = {
  // Get top customers (limit optional)
  getTopCustomers: (params?: { limit?: number }) => {
    const query = params?.limit ? `?limit=${params.limit}` : '';
    return apiClient.get(`/seller/top-customers${query}`);
  },
 getOrders: (params?: { page?: number; limit?: number; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.status) query.append('status', params.status);
    const qs = query.toString();
    return apiClient.get(`/seller/orders${qs ? `?${qs}` : ''}`);
  },

getVideos: () => apiClient.get('/seller/videos'),
getVideoStats: () => apiClient.get('/seller/video-stats'),
// For upload – you need to implement the backend endpoint first
uploadVideo: (data: { title: string; description?: string; videoUrl: string; thumbnailUrl?: string }) =>
  apiClient.post('/seller/videos', data),
deleteVideo: (videoId: string) => apiClient.delete(`/seller/videos/${videoId}`),



  // Get category distribution (list of categories with product counts)
  getCategoryDistribution: () => apiClient.get('/seller/category-distribution'),

  // Get customer insights (returning %, avg order value, lifetime)
  getCustomerInsights: () => apiClient.get('/seller/customer-insights'),

  // Get monthly revenue (for chart)
  getRevenueMonthly: () => apiClient.get('/seller/revenue/monthly'),

  // Get monthly orders count (for chart)
  getMonthlyOrders: () => apiClient.get('/seller/orders/monthly'),
};



// ============================================
// Seller Cashier API (for seller dashboard to manage cashiers)
// ============================================

export const sellerCashierApi = {
  getCashiers: () => apiClient.get('/seller/cashiers'),
  createCashier: (data: { storeId: number; phone: string; fullName: string; password?: string }) =>
    apiClient.post('/seller/cashiers', data),
  removeCashier: (cashierId: string) => apiClient.delete(`/seller/cashiers/${cashierId}`),
};

// ============================================
// Export all APIs
// ============================================

export const api = {
  auth: authApi,
  stores: storesApi,
  products: productsApi,
  orders: ordersApi,
  qr: qrApi,
  delivery: deliveryApi,
  lkridi: lkridiApi,
  worker: workerApi,
  chat: chatApi,
  notifications: notificationsApi,
  ratings: ratingsApi,
  video: videoApi,
  analytics: analyticsApi,
  admin: adminApi,
  dispute: disputeApi,
  upload: uploadApi,
};