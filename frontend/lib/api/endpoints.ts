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
    apiClient.post<AuthResponse>('/v1/auth/login', credentials as unknown as Record<string, unknown>),
  
  register: (data: RegisterData) => 
    apiClient.post<AuthResponse>('/v1/auth/register', data as unknown as Record<string, unknown>),
  
  verifyOtp: (phone: string, otp: string) => 
    apiClient.post<{ verified: boolean }>('/v1/auth/verify-otp', { phone, otp }),
  
  resendOtp: (phone: string) =>
    apiClient.post<{ sent: boolean }>('/v1/auth/resend-otp', { phone }),
  
  getCurrentUser: () => 
    apiClient.get<User>('/v1/auth/me'),
  
  logout: () => 
    apiClient.post('/v1/auth/logout'),
  
  refreshToken: (refreshToken: string) =>
    apiClient.post<{ token: string }>('/v1/auth/refresh', { refreshToken }),
  
  forgotPassword: (email: string) =>
    apiClient.post<{ sent: boolean }>('/v1/auth/forgot-password', { email }),
  
  resetPassword: (token: string, newPassword: string) =>
    apiClient.post<{ success: boolean }>('/v1/auth/reset-password', { token, newPassword }),
  
  updateProfile: (data: Partial<User>) =>
    apiClient.put<User>('/v1/auth/profile', data as unknown as Record<string, unknown>),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post<{ changed: boolean }>('/v1/auth/change-password', { currentPassword, newPassword }),
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
};

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
    apiClient.get<QRCode[]>(`/v1/qr/store/${storeId}`),
  
  deactivate: (codeId: string) =>
    apiClient.post<{ deactivated: boolean }>(`/v1/qr/${codeId}/deactivate`, {}),
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
    return apiClient.get<Order[]>(`/v1/delivery/available-orders${query ? `?${query}` : ''}`);
  },
  
  acceptOrder: (orderId: string) =>
    apiClient.post<{ success: boolean }>(`/v1/delivery/orders/${orderId}/accept`, {}),
  
  updateLocation: (orderId: string, lat: number, lng: number) =>
    apiClient.post<{ success: boolean }>(`/v1/delivery/orders/${orderId}/location`, { lat, lng }),
  
  markPickedUp: (orderId: string) =>
    apiClient.post<{ success: boolean }>(`/v1/delivery/orders/${orderId}/picked-up`, {}),
  
  markDelivered: (orderId: string) =>
    apiClient.post<{ success: boolean }>(`/v1/delivery/orders/${orderId}/delivered`, {}),
  
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
    return apiClient.get<Order[]>(`/v1/delivery/my-deliveries${query ? `?${query}` : ''}`);
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

// ============================================
// Worker API (FR7.6)
// ============================================

export const workerApi = {
  getMyWorkerStores: () => 
    apiClient.get<Store[]>('/v1/workers/my-stores'),
  
  getMyPendingInvitations: () =>
    apiClient.get<WorkerInvitation[]>('/v1/workers/invitations'),
  
  acceptInvitation: (workerId: string, password: string) =>
    apiClient.post<{ accepted: boolean }>(`/v1/workers/invitations/${workerId}/accept`, { password }),
  
  declineInvitation: (workerId: string) =>
    apiClient.post<{ declined: boolean }>(`/v1/workers/invitations/${workerId}/decline`, {}),
  
  getStoreWorkers: (storeId: string) =>
    apiClient.get<Worker[]>(`/stores/${storeId}/workers`),

  inviteWorker: (storeId: string, data: { email: string; name: string; phone?: string; permissions: Partial<WorkerPermissions> }) =>
    apiClient.post<Worker>(`/stores/${storeId}/workers`, data as unknown as Record<string, unknown>),

  updateWorkerPermissions: (storeId: string, workerId: string, permissions: Partial<WorkerPermissions>) =>
    apiClient.put<Worker>(`/stores/${storeId}/workers/${workerId}`, { permissions }),

  removeWorker: (storeId: string, workerId: string) =>
    apiClient.delete<{ removed: boolean; workerId: string }>(`/stores/${storeId}/workers/${workerId}`),
  
  checkPermission: (storeId: string, permission: keyof WorkerPermissions) =>
    apiClient.get<{ hasPermission: boolean }>(`/v1/workers/stores/${storeId}/check-permission?permission=${permission}`),
};

// ============================================
// Chat API (FR8.1)
// ============================================

export const chatApi = {
  getConversations: () =>
    apiClient.get<Conversation[]>('/v1/chat/conversations'),
  
  getMessages: (conversationId: string) =>
    apiClient.get<ChatMessage[]>(`/v1/chat/${conversationId}`),
  
  sendMessage: (conversationId: string, message: string, type: 'text' | 'image' = 'text') =>
    apiClient.post<ChatMessage>(`/v1/chat/${conversationId}`, { message, type }),
  
  markAsRead: (conversationId: string) =>
    apiClient.post(`/v1/chat/${conversationId}/read`, {}),
};

// ============================================
// Notifications API (FR8.2)
// ============================================

export const notificationsApi = {
  getAll: () =>
    apiClient.get<Notification[]>('/v1/notifications'),
  
  markAsRead: (id: string) =>
    apiClient.patch(`/v1/notifications/${id}/read`, {}),
  
  markAllAsRead: () =>
    apiClient.patch('/v1/notifications/read-all', {}),
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
    return apiClient.get(`/v1/videos${query ? `?${query}` : ''}`);
  },
  
  getById: (id: string) =>
    apiClient.get(`/v1/videos/${id}`),
  
  upload: (data: { title: string; description?: string; videoUrl: string; thumbnailUrl: string; storeId: string }) =>
    apiClient.post('/v1/videos', data),
  
  delete: (id: string) =>
    apiClient.delete(`/v1/videos/${id}`),
  
  like: (id: string) =>
    apiClient.post(`/v1/videos/${id}/like`, {}),
};

// ============================================
// Analytics API (FR10)
// ============================================

export const analyticsApi = {
  getBuyerStats: (buyerId: string) =>
    apiClient.get(`/v1/analytics/buyer/${buyerId}`),
  
  getSellerStats: (sellerId: string) =>
    apiClient.get(`/v1/analytics/seller/${sellerId}`),
};

// ============================================
// Admin API (FR11)
// ============================================

export const adminApi = {
  getStats: () =>
    apiClient.get('/v1/admin/stats'),
  
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
    return apiClient.get(`/v1/admin/users${query ? `?${query}` : ''}`);
  },
  
  getPendingSellers: () =>
    apiClient.get('/v1/admin/sellers/pending'),
  
  approveSeller: (sellerId: string) =>
    apiClient.post(`/v1/admin/sellers/${sellerId}/approve`, {}),
  
  rejectSeller: (sellerId: string, reason?: string) =>
    apiClient.post(`/v1/admin/sellers/${sellerId}/reject`, { reason }),
  
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
    return apiClient.get(`/v1/admin/disputes${query ? `?${query}` : ''}`);
  },
  
  resolveDispute: (disputeId: string, resolution: string) =>
    apiClient.post(`/v1/admin/disputes/${disputeId}/resolve`, { resolution }),
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
    return apiClient.get<Dispute[]>(`/v1/disputes${query ? `?${query}` : ''}`);
  },
  
  getById: (id: string) =>
    apiClient.get<Dispute>(`/v1/disputes/${id}`),
  
  create: (data: { orderId: string; type: string; description: string; evidence?: string[] }) =>
    apiClient.post<Dispute>('/v1/disputes', data),
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