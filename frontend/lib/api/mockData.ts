import type { 
  User, 
  Store, 
  Product, 
  Order, 
  LkridiMembership, 
  ApiResponse,
  AuthResponse,
  Worker,
  WorkerPermissions,
  WorkerInvitation,
  QRCode,
  PaymentTransaction,
  LkridiRecord,
  Delivery,
  Rating,
  ChatMessage,
  Conversation,
  VideoAd,
  Dispute,
  BankCard,
  Document,
  Notification,
} from '../types/api.types';

// ============================================
// Mock Users
// ============================================

export const mockUsers: Record<string, User> = {
  buyer: {
    id: 'buyer-1',
    email: 'buyer@example.com',
    name: 'John Buyer',
    phone: '+1234567890',
    role: 'buyer',
    avatar: 'https://via.placeholder.com/150',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  worker: {
    id: 'worker-1',
    email: 'worker@example.com',
    name: 'Bob Worker',
    phone: '+1234567892',
    role: 'worker',
    avatar: 'https://ui-avatars.com/api/?name=Bob+Worker&background=F59E0B&color=fff',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  worker2: {
    id: 'worker-2',
    email: 'worker2@example.com',
    name: 'Alice Assistant',
    phone: '+1234567893',
    role: 'worker',
    avatar: 'https://ui-avatars.com/api/?name=Alice+Assistant&background=F59E0B&color=fff',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  seller: {
    id: 'seller-1',
    email: 'seller@example.com',
    name: 'Jane Seller',
    phone: '+1234567891',
    role: 'seller',
    avatar: 'https://via.placeholder.com/150',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  delivery: {
    id: 'delivery-1',
    email: 'delivery@example.com',
    name: 'Mike Delivery',
    phone: '+1234567894',
    role: 'delivery',
    avatar: 'https://via.placeholder.com/150',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  admin: {
    id: 'admin-1',
    email: 'admin@example.com',
    name: 'Admin User',
    phone: '+1234567895',
    role: 'admin',
    avatar: 'https://via.placeholder.com/150',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

// ============================================
// Mock Worker Permissions
// ============================================

export const mockWorkerPermissions: WorkerPermissions = {
  canManageProducts: true,
  canDeleteProducts: false,
  canManageOrders: true,
  canViewEarnings: false,
  canManageWorkers: false,
  canEditStore: false,
};

export const mockWorkerPermissionsFull: WorkerPermissions = {
  canManageProducts: true,
  canDeleteProducts: true,
  canManageOrders: true,
  canViewEarnings: true,
  canManageWorkers: true,
  canEditStore: true,
};

// ============================================
// Mock Workers
// ============================================

export const mockWorkers: Worker[] = [
  {
    id: 'worker-1',
    userId: 'worker-1',
    storeId: 'store-1',
    role: 'worker',
    permissions: mockWorkerPermissions,
    status: 'active',
    invitedBy: 'seller-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: mockUsers.worker
  },
  {
    id: 'worker-2',
    userId: 'worker-2',
    storeId: 'store-2',
    role: 'worker',
    permissions: mockWorkerPermissionsFull,
    status: 'active',
    invitedBy: 'seller-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: mockUsers.worker2
  }
];

// ============================================
// Mock Stores
// ============================================

export const mockStores: Store[] = [
  {
    id: 'store-1',
    name: 'Fresh Market',
    description: 'Your local fresh grocery store',
    ownerId: 'seller-1',
    address: '123 Market Street, City',
    location: {
      type: 'Point',
      coordinates: [-73.935242, 40.730610]
    },
    workerIds: ['worker-1'],
    phone: '+1234567890',
    email: 'fresh@market.com',
    logo: 'https://via.placeholder.com/150',
    coverImage: 'https://via.placeholder.com/800x200',
    categories: ['Groceries', 'Fresh Food'],
    isOpen: true,
    operatingHours: {
      monday: { isOpen: true, open: '09:00', close: '18:00' },
      tuesday: { isOpen: true, open: '09:00', close: '18:00' },
      wednesday: { isOpen: true, open: '09:00', close: '18:00' },
      thursday: { isOpen: true, open: '09:00', close: '18:00' },
      friday: { isOpen: true, open: '09:00', close: '18:00' },
      saturday: { isOpen: true, open: '10:00', close: '16:00' },
      sunday: { isOpen: false, open: '00:00', close: '00:00' }
    },
    rating: 4.5,
    reviewCount: 128,
    deliveryEnabled: true,
    deliveryFee: 2.99,
    lkridiEnabled: true,
    liveTrackingEnabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'store-2',
    name: 'Tech Haven',
    description: 'Your one-stop shop for electronics',
    ownerId: 'seller-1',
    address: '456 Tech Avenue, City',
    location: {
      type: 'Point',
      coordinates: [-73.945242, 40.740610]
    },
    workerIds: ['worker-2'],
    phone: '+1234567891',
    email: 'tech@haven.com',
    logo: 'https://via.placeholder.com/150',
    categories: ['Electronics', 'Gadgets'],
    isOpen: true,
    operatingHours: {
      monday: { isOpen: true, open: '10:00', close: '20:00' },
      tuesday: { isOpen: true, open: '10:00', close: '20:00' },
      wednesday: { isOpen: true, open: '10:00', close: '20:00' },
      thursday: { isOpen: true, open: '10:00', close: '20:00' },
      friday: { isOpen: true, open: '10:00', close: '20:00' },
      saturday: { isOpen: true, open: '10:00', close: '18:00' },
      sunday: { isOpen: false, open: '00:00', close: '00:00' }
    },
    rating: 4.8,
    reviewCount: 256,
    deliveryEnabled: true,
    deliveryFee: 0,
    lkridiEnabled: false,
    liveTrackingEnabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'store-3',
    name: 'Fashion Hub',
    description: 'Trendy clothing and accessories',
    ownerId: 'seller-1',
    address: '789 Style Blvd, City',
    location: {
      type: 'Point',
      coordinates: [-73.955242, 40.720610]
    },
    workerIds: [],
    phone: '+1234567892',
    email: 'style@fashionhub.com',
    logo: 'https://via.placeholder.com/150/EC4899/ffffff?text=FH',
    categories: ['Clothing', 'Accessories'],
    isOpen: true,
    operatingHours: {
      monday: { isOpen: true, open: '10:00', close: '19:00' },
      tuesday: { isOpen: true, open: '10:00', close: '19:00' },
      wednesday: { isOpen: true, open: '10:00', close: '19:00' },
      thursday: { isOpen: true, open: '10:00', close: '19:00' },
      friday: { isOpen: true, open: '10:00', close: '20:00' },
      saturday: { isOpen: true, open: '11:00', close: '20:00' },
      sunday: { isOpen: false, open: '00:00', close: '00:00' }
    },
    rating: 4.2,
    reviewCount: 89,
    deliveryEnabled: false,
    deliveryFee: undefined,
    lkridiEnabled: true,
    liveTrackingEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ============================================
// Mock Products
// ============================================

export const mockProducts: Product[] = [
  {
    id: 'product-1',
    storeId: 'store-1',
    name: 'Organic Apples',
    description: 'Fresh organic apples from local farms',
    price: 4.99,
    discountPrice: 3.99,
    images: ['https://via.placeholder.com/300'],
    category: 'Fruits',
    subcategory: 'Apples',
    inStock: true,
    quantity: 50,
    attributes: [
      { name: 'Origin', value: 'Local Farm' },
      { name: 'Organic', value: 'Yes' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'product-2',
    storeId: 'store-1',
    name: 'Whole Wheat Bread',
    description: 'Freshly baked whole wheat bread',
    price: 3.49,
    images: ['https://via.placeholder.com/300'],
    category: 'Bakery',
    inStock: true,
    quantity: 30,
    attributes: [
      { name: 'Baked', value: 'Daily' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'product-3',
    storeId: 'store-1',
    name: 'Organic Milk',
    description: 'Farm fresh organic milk',
    price: 5.99,
    discountPrice: 4.99,
    images: ['https://via.placeholder.com/300'],
    category: 'Dairy',
    inStock: true,
    quantity: 25,
    attributes: [
      { name: 'Organic', value: 'Yes' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'product-4',
    storeId: 'store-2',
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling headphones',
    price: 199.99,
    discountPrice: 149.99,
    images: ['https://via.placeholder.com/300'],
    category: 'Electronics',
    subcategory: 'Audio',
    inStock: true,
    quantity: 15,
    attributes: [
      { name: 'Brand', value: 'SoundPro' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ============================================
// Mock Orders
// ============================================

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    orderNumber: 'ORD-2024-001',
    buyerId: 'buyer-1',
    storeId: 'store-1',
    items: [
      {
        productId: 'product-1',
        name: 'Organic Apples',
        quantity: 2,
        price: 4.99,
        total: 9.98,
      },
    ],
    status: 'delivered',
    totalAmount: 9.98,
    deliveryFee: 2.99,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    deliveryAddress: {
      street: '789 Home Street',
      city: 'City',
      state: 'State',
      zipCode: '12345',
      country: 'Country',
      coordinates: [-73.935242, 40.730610],
    },
    isDelivery: false,
    qrCode: undefined,
    cancelReason: undefined,
    cancelledBy: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDeliveryTime: undefined,
  },
  {
    id: 'order-2',
    orderNumber: 'ORD-2024-002',
    buyerId: 'buyer-1',
    storeId: 'store-2',
    items: [
      {
        productId: 'product-4',
        name: 'Wireless Headphones',
        quantity: 1,
        price: 199.99,
        total: 199.99,
      },
    ],
    status: 'out_for_delivery',
    totalAmount: 199.99,
    deliveryFee: 0,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    deliveryAddress: {
      street: '789 Home Street',
      city: 'City',
      state: 'State',
      zipCode: '12345',
      country: 'Country',
      coordinates: [-73.935242, 40.730610],
    },
    isDelivery: true,
    qrCode: 'QR-DELIVERY-002',
    cancelReason: undefined,
    cancelledBy: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDeliveryTime: new Date(Date.now() + 3600000).toISOString(),
  },
  {
    id: 'order-3',
    orderNumber: 'ORD-2024-003',
    buyerId: 'buyer-1',
    storeId: 'store-1',
    items: [
      {
        productId: 'product-3',
        name: 'Organic Milk',
        quantity: 2,
        price: 5.99,
        total: 11.98,
      },
    ],
    status: 'pending',
    totalAmount: 11.98,
    deliveryFee: 2.99,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    deliveryAddress: {
      street: '789 Home Street',
      city: 'City',
      state: 'State',
      zipCode: '12345',
      country: 'Country',
      coordinates: [-73.935242, 40.730610],
    },
    isDelivery: false,
    qrCode: undefined,
    cancelReason: undefined,
    cancelledBy: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDeliveryTime: undefined,
  },
  {
    id: 'order-4',
    orderNumber: 'ORD-2024-004',
    buyerId: 'buyer-1',
    storeId: 'store-1',
    items: [
      {
        productId: 'product-1',
        name: 'Organic Apples',
        quantity: 3,
        price: 4.99,
        total: 14.97,
      },
    ],
    status: 'confirmed',
    totalAmount: 14.97,
    deliveryFee: 2.99,
    paymentMethod: 'wallet',
    paymentStatus: 'paid',
    deliveryAddress: null,
    isDelivery: false,
    qrCode: 'QR-ONLINE-004',
    cancelReason: undefined,
    cancelledBy: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDeliveryTime: undefined,
  },
  {
    id: 'order-5',
    orderNumber: 'ORD-2024-005',
    buyerId: 'buyer-1',
    storeId: 'store-1',
    items: [
      {
        productId: 'product-2',
        name: 'Whole Wheat Bread',
        quantity: 1,
        price: 3.49,
        total: 3.49,
      },
    ],
    status: 'cancelled',
    totalAmount: 3.49,
    deliveryFee: 2.99,
    paymentMethod: 'card',
    paymentStatus: 'refunded',
    deliveryAddress: {
      street: '789 Home Street',
      city: 'City',
      state: 'State',
      zipCode: '12345',
      country: 'Country',
      coordinates: [-73.935242, 40.730610],
    },
    isDelivery: false,
    qrCode: undefined,
    cancelReason: 'Changed my mind',
    cancelledBy: 'buyer-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDeliveryTime: undefined,
  },
  {
    id: 'order-6',
    orderNumber: 'ORD-2024-006',
    buyerId: 'buyer-1',
    storeId: 'store-1',
    items: [
      {
        productId: 'product-2',
        name: 'Whole Wheat Bread',
        quantity: 2,
        price: 3.49,
        total: 6.98,
      },
    ],
    status: 'preparing',
    totalAmount: 6.98,
    deliveryFee: 2.99,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    deliveryAddress: null,
    isDelivery: false,
    qrCode: 'QR-ONLINE-006',
    cancelReason: undefined,
    cancelledBy: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDeliveryTime: undefined,
  },
  {
    id: 'order-7',
    orderNumber: 'ORD-2024-007',
    buyerId: 'buyer-1',
    storeId: 'store-3',
    items: [
      {
        productId: 'product-1',
        name: 'Organic Apples',
        quantity: 1,
        price: 4.99,
        total: 4.99,
      },
    ],
    status: 'ready_for_pickup',
    totalAmount: 4.99,
    deliveryFee: 0,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    deliveryAddress: null,
    isDelivery: false,
    qrCode: 'QR-OFFLINE-007',
    cancelReason: undefined,
    cancelledBy: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDeliveryTime: undefined,
  },
];

// ============================================
// Mock LKRIDI Memberships
// ============================================

export const mockLkridiMemberships: LkridiMembership[] = [
  {
    id: 'lkridi-1',
    userId: 'buyer-1',
    storeId: 'store-1',
    type: 'customer',
    status: 'active',
    creditLimit: 1000,
    currentBalance: 250,
    paymentDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lkridi-2',
    userId: 'seller-1',
    storeId: 'store-1',
    type: 'store',
    status: 'active',
    creditLimit: 5000,
    currentBalance: 1250.75,
    paymentDueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ============================================
// Mock QR Codes
// ============================================

export const mockQRCodes: QRCode[] = [
  {
    id: 'qr-1',
    code: 'QR-ONLINE-004',
    orderId: 'order-4',
    storeId: 'store-1',
    buyerId: 'buyer-1',
    type: 'online',
    status: 'active',
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    isUsed: false,
    scannedAt: undefined,
    scannedBy: undefined,
    accomplishedBy: [],
    completedAt: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'qr-2',
    code: 'QR-DELIVERY-002',
    orderId: 'order-2',
    storeId: 'store-2',
    buyerId: 'buyer-1',
    type: 'delivery',
    status: 'active',
    expiresAt: null,
    isUsed: false,
    scannedAt: undefined,
    scannedBy: undefined,
    accomplishedBy: [],
    completedAt: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'qr-3',
    code: 'QR-OFFLINE-007',
    orderId: 'order-7',
    storeId: 'store-3',
    buyerId: 'buyer-1',
    type: 'offline',
    status: 'active',
    expiresAt: null,
    isUsed: false,
    scannedAt: undefined,
    scannedBy: undefined,
    accomplishedBy: [],
    completedAt: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// ============================================
// Mock Ratings
// ============================================

export const mockRatings: Rating[] = [
  {
    id: 'rating-1',
    buyerId: 'buyer-1',
    storeId: 'store-1',
    orderId: 'order-1',
    rating: 5,
    comment: 'Great service and fresh products!',
    images: [],
    isAnonymous: false,
    sellerReply: 'Thank you for your support!',
    sellerRepliedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rating-2',
    buyerId: 'buyer-1',
    storeId: 'store-2',
    orderId: 'order-2',
    rating: 4,
    comment: 'Good products, fast delivery',
    images: [],
    isAnonymous: true,
    sellerReply: undefined,
    sellerRepliedAt: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// ============================================
// Mock Chat Messages
// ============================================

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: ['buyer-1', 'seller-1'],
    unreadCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'buyer-1',
    receiverId: 'seller-1',
    orderId: 'order-1',
    message: 'Hi, is this product still available?',
    type: 'text',
    readAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'seller-1',
    receiverId: 'buyer-1',
    message: 'Yes, it is! How many would you like?',
    type: 'text',
    readAt: undefined,
    createdAt: new Date().toISOString(),
  }
];

// ============================================
// Mock Notifications
// ============================================

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'buyer-1',
    type: 'order_status',
    title: 'Order Confirmed',
    body: 'Your order #ORD-2024-004 has been confirmed!',
    data: { orderId: 'order-4' },
    readAt: undefined,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif-2',
    userId: 'buyer-1',
    type: 'lkridi_reminder',
    title: 'Payment Reminder',
    body: 'Your LKRIDI payment of 250 MAD is due in 5 days',
    data: { membershipId: 'lkridi-1' },
    readAt: undefined,
    createdAt: new Date().toISOString(),
  }
];

// ============================================
// Type for mock response functions
// ============================================

type MockResponseFunction<T = unknown> = (data?: Record<string, unknown>) => ApiResponse<T>;

// ============================================
// Mock API Responses - 100% COMPLETE
// ============================================

export const mockResponses: Record<string, ApiResponse<unknown> | MockResponseFunction> = {
  
  // ==========================================
  // Health Check
  // ==========================================
  'GET /health': {
    success: true,
    message: 'Mock API is running',
    data: {
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  } as ApiResponse<{ timestamp: string; version: string }>,

  // ==========================================
  // Auth Endpoints
  // ==========================================
  'POST /v1/auth/login': ((data?: Record<string, unknown>) => {
    const email = (data?.email as string) || '';
    let user: User;
    
    if (email.includes('seller')) user = mockUsers.seller;
    else if (email.includes('worker2')) user = mockUsers.worker2;
    else if (email.includes('worker')) user = mockUsers.worker;
    else if (email.includes('delivery')) user = mockUsers.delivery;
    else if (email.includes('admin')) user = mockUsers.admin;
    else user = mockUsers.buyer;
    
    return {
      success: true,
      data: {
        user,
        token: `mock-token-${user.role}-${Date.now()}`,
        refreshToken: `mock-refresh-${Date.now()}`
      }
    } as AuthResponse;
  }) as MockResponseFunction,

  'POST /v1/auth/register': ((data?: Record<string, unknown>) => ({
    success: true,
    data: {
      user: {
        ...mockUsers.buyer,
        email: data?.email as string,
        name: data?.name as string,
        role: data?.role as User['role']
      },
      token: `mock-token-${Date.now()}`
    }
  })) as MockResponseFunction,

  'POST /v1/auth/verify-otp': {
    success: true,
    data: { verified: true }
  } as ApiResponse<{ verified: boolean }>,

  'POST /v1/auth/resend-otp': {
    success: true,
    data: { sent: true },
    message: 'OTP sent successfully'
  } as ApiResponse<{ sent: boolean }>,

  'GET /v1/auth/me': ((data?: Record<string, unknown>) => ({
    success: true,
    data: mockUsers.buyer
  })) as MockResponseFunction<User>,

  'POST /v1/auth/logout': {
    success: true,
    message: 'Logged out successfully'
  } as ApiResponse<never>,

  'POST /v1/auth/refresh': {
    success: true,
    data: { token: `mock-token-${Date.now()}` }
  } as ApiResponse<{ token: string }>,

  'POST /v1/auth/forgot-password': {
    success: true,
    data: { sent: true },
    message: 'Password reset email sent'
  } as ApiResponse<{ sent: boolean }>,

  'POST /v1/auth/reset-password': {
    success: true,
    data: { success: true },
    message: 'Password reset successful'
  } as ApiResponse<{ success: boolean }>,

  'PUT /v1/auth/profile': ((data?: Record<string, unknown>) => ({
    success: true,
    data: { ...mockUsers.buyer, ...data }
  })) as MockResponseFunction<User>,

  'POST /v1/auth/change-password': {
    success: true,
    data: { changed: true },
    message: 'Password changed successfully'
  } as ApiResponse<{ changed: boolean }>,

  // ==========================================
  // Store Endpoints
  // ==========================================
  'GET /v1/stores': ((data?: Record<string, unknown>) => ({
    success: true,
    data: mockStores,
    pagination: {
      page: (data?.page as number) || 1,
      limit: (data?.limit as number) || 10,
      total: mockStores.length,
      totalPages: Math.ceil(mockStores.length / ((data?.limit as number) || 10))
    }
  })) as MockResponseFunction<Store[]>,

  'GET /v1/stores/:id': ((data?: Record<string, unknown>) => {
    const store = mockStores.find(s => s.id === data?.id);
    return {
      success: true,
      data: store || null
    };
  }) as MockResponseFunction<Store | null>,

  'GET /v1/stores/nearby': ((data?: Record<string, unknown>) => ({
    success: true,
    data: mockStores,
    pagination: {
      page: 1,
      limit: 10,
      total: mockStores.length,
      totalPages: 1
    }
  })) as MockResponseFunction<Store[]>,

  'POST /v1/stores': ((data?: Record<string, unknown>) => ({
    success: true,
    data: {
      ...data,
      id: `store-${Date.now()}`,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  })) as MockResponseFunction<Store>,

  'PUT /v1/stores/:id': ((data?: Record<string, unknown>) => ({
    success: true,
    data: {
      ...mockStores[0],
      ...data,
      updatedAt: new Date().toISOString()
    }
  })) as MockResponseFunction<Store>,

  'DELETE /v1/stores/:id': {
    success: true,
    message: 'Store deleted successfully'
  } as ApiResponse<never>,

  'GET /v1/stores/my-stores': {
    success: true,
    data: [mockStores[0], mockStores[1]]
  } as ApiResponse<Store[]>,

  'GET /v1/stores/:id/stats': {
    success: true,
    data: {
      totalOrders: 150,
      totalRevenue: 12500.50,
      averageRating: 4.5,
      pendingOrders: 3,
      readyOrders: 2,
      outForDeliveryOrders: 1,
      deliveredOrders: 140,
      cancelledOrders: 4,
      totalProducts: 45,
      reviewCount: 128
    }
  } as ApiResponse<unknown>,

  // ==========================================
  // Product Endpoints
  // ==========================================
  'GET /v1/products': ((data?: Record<string, unknown>) => ({
    success: true,
    data: mockProducts.filter(p => !data?.storeId || p.storeId === data.storeId),
    pagination: {
      page: (data?.page as number) || 1,
      limit: (data?.limit as number) || 20,
      total: mockProducts.length,
      totalPages: Math.ceil(mockProducts.length / ((data?.limit as number) || 20))
    }
  })) as MockResponseFunction<Product[]>,

  'GET /v1/products/:id': ((data?: Record<string, unknown>) => {
    const product = mockProducts.find(p => p.id === data?.id);
    return {
      success: true,
      data: product || null
    };
  }) as MockResponseFunction<Product | null>,

  'GET /v1/products/categories': {
    success: true,
    data: ['Fruits', 'Bakery', 'Dairy', 'Electronics']
  } as ApiResponse<string[]>,

  'POST /v1/products': ((data?: Record<string, unknown>) => ({
    success: true,
    data: {
      ...data,
      id: `product-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  })) as MockResponseFunction<Product>,

  'PUT /v1/products/:id': ((data?: Record<string, unknown>) => ({
    success: true,
    data: {
      ...mockProducts[0],
      ...data,
      updatedAt: new Date().toISOString()
    }
  })) as MockResponseFunction<Product>,

  'DELETE /v1/products/:id': {
    success: true,
    message: 'Product deleted successfully'
  } as ApiResponse<never>,

  // ==========================================
  // Order Endpoints
  // ==========================================
  'GET /v1/orders': ((data?: Record<string, unknown>) => ({
    success: true,
    data: mockOrders,
    pagination: {
      page: (data?.page as number) || 1,
      limit: (data?.limit as number) || 10,
      total: mockOrders.length,
      totalPages: Math.ceil(mockOrders.length / ((data?.limit as number) || 10))
    }
  })) as MockResponseFunction<Order[]>,

  'GET /v1/orders/my-orders': ((data?: Record<string, unknown>) => ({
    success: true,
    data: mockOrders.filter(o => o.buyerId === 'buyer-1'),
    pagination: {
      page: (data?.page as number) || 1,
      limit: (data?.limit as number) || 10,
      total: mockOrders.filter(o => o.buyerId === 'buyer-1').length,
      totalPages: 1
    }
  })) as MockResponseFunction<Order[]>,

  'GET /v1/orders/:id': ((data?: Record<string, unknown>) => {
    const order = mockOrders.find(o => o.id === data?.id);
    return {
      success: true,
      data: order || null
    };
  }) as MockResponseFunction<Order | null>,

  'POST /v1/orders': ((data?: Record<string, unknown>) => ({
    success: true,
    data: {
      ...data,
      id: `order-${Date.now()}`,
      orderNumber: `ORD-${Date.now()}`,
      status: 'pending',
      paymentStatus: 'pending',
      isDelivery: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  })) as MockResponseFunction<Order>,

  'PATCH /v1/orders/:id/status': ((data?: Record<string, unknown>) => ({
    success: true,
    data: {
      ...mockOrders[0],
      status: data?.status,
      updatedAt: new Date().toISOString()
    }
  })) as MockResponseFunction<Order>,

  'POST /v1/orders/:id/cancel': ((data?: Record<string, unknown>) => ({
    success: true,
    data: {
      ...mockOrders[0],
      status: 'cancelled',
      cancelReason: data?.reason,
      cancelledBy: 'buyer-1',
      updatedAt: new Date().toISOString()
    }
  })) as MockResponseFunction<Order>,

  // ==========================================
  // QR Code Endpoints
  // ==========================================
  'POST /v1/qr/generate': ((data?: Record<string, unknown>) => ({
    success: true,
    data: {
      qrCode: `QR-${Date.now()}`,
      expiresAt: data?.type === 'online' ? new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() : null,
      orderId: data?.orderId,
      storeName: mockStores[0].name
    }
  })) as MockResponseFunction<{ qrCode: string; expiresAt: string | null; orderId: string; storeName: string }>,

  'GET /v1/qr/:code': ((data?: Record<string, unknown>) => {
    const qrCode = mockQRCodes.find(q => q.code === data?.code);
    return {
      success: true,
      data: {
        valid: true,
        order: mockOrders.find(o => o.id === qrCode?.orderId),
        store: mockStores.find(s => s.id === qrCode?.storeId),
        paymentStatus: 'paid',
        type: qrCode?.type || 'online'
      }
    };
  }) as MockResponseFunction<unknown>,

  'POST /v1/qr/:code/scan': {
    success: true,
    data: {
      scanned: true,
      order: mockOrders[0],
      items: mockOrders[0].items,
      paymentStatus: mockOrders[0].paymentStatus,
      totalAmount: mockOrders[0].totalAmount
    }
  } as ApiResponse<unknown>,

  'POST /v1/qr/:code/accomplish': {
    success: true,
    data: {
      accomplished: true,
      bothAccomplished: true,
      message: 'Transaction completed successfully'
    }
  } as ApiResponse<{ accomplished: boolean; bothAccomplished: boolean; message: string }>,

  'GET /v1/qr/store/:storeId': {
    success: true,
    data: mockQRCodes
  } as ApiResponse<QRCode[]>,

  'POST /v1/qr/:codeId/deactivate': {
    success: true,
    data: { deactivated: true },
    message: 'QR code deactivated successfully'
  } as ApiResponse<{ deactivated: boolean }>,

  // ==========================================
  // Worker Endpoints
  // ==========================================
  'GET /v1/workers/my-stores': {
    success: true,
    data: [mockStores[0]],
  } as ApiResponse<Store[]>,

  'GET /v1/workers/invitations': {
    success: true,
    data: [
      {
        workerId: 'worker-3',
        store: {
          id: 'store-3',
          name: 'Fashion Hub',
          logo: 'https://via.placeholder.com/150/EC4899/ffffff?text=FH',
        },
        invitedBy: {
          id: 'seller-1',
          name: 'Jane Seller',
        },
        permissions: mockWorkerPermissions,
        createdAt: new Date().toISOString(),
      },
    ],
  } as ApiResponse<WorkerInvitation[]>,

  'POST /v1/workers/invitations/:workerId/accept': ((data?: Record<string, unknown>) => ({
    success: true,
    data: { accepted: true },
    message: 'Invitation accepted successfully',
  })) as MockResponseFunction<{ accepted: boolean }>,

  'POST /v1/workers/invitations/:workerId/decline': {
    success: true,
    data: { declined: true },
    message: 'Invitation declined',
  } as ApiResponse<{ declined: boolean }>,

  'GET /v1/workers/stores/:storeId/workers': ((params?: Record<string, unknown>) => ({
    success: true,
    data: mockWorkers.filter((w: Worker) => w.storeId === params?.storeId),
  })) as MockResponseFunction<Worker[]>,

  'POST /v1/workers/stores/:storeId/workers': ((data?: Record<string, unknown>) => {
    const newWorker: Worker = {
      id: `worker-${Date.now()}`,
      userId: `user-${Date.now()}`,
      storeId: data?.storeId as string,
      role: 'worker',
      permissions: (data?.permissions as WorkerPermissions) || mockWorkerPermissions,
      status: 'pending',
      invitedBy: 'seller-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return {
      success: true,
      data: newWorker,
      message: 'Worker invited successfully',
    };
  }) as MockResponseFunction<Worker>,

  'PUT /v1/workers/stores/:storeId/workers/:workerId': ((data?: Record<string, unknown>) => {
    const updatedWorker: Worker = {
      ...mockWorkers[0],
      permissions: { 
        ...mockWorkers[0].permissions, 
        ...(data?.permissions as Partial<WorkerPermissions>) 
      },
      updatedAt: new Date().toISOString(),
    };
    return {
      success: true,
      data: updatedWorker,
      message: 'Permissions updated successfully',
    };
  }) as MockResponseFunction<Worker>,

  'DELETE /v1/workers/stores/:storeId/workers/:workerId': ((params?: Record<string, unknown>) => ({
    success: true,
    data: { removed: true, workerId: params?.workerId as string },
    message: 'Worker removed successfully',
  })) as MockResponseFunction<{ removed: boolean; workerId: string }>,

  'GET /v1/workers/stores/:storeId/check-permission': ((params?: Record<string, unknown>) => {
    const permission = params?.permission as keyof WorkerPermissions;
    return {
      success: true,
      data: { hasPermission: mockWorkerPermissions[permission] || false },
    };
  }) as MockResponseFunction<{ hasPermission: boolean }>,

  // ==========================================
  // LKRIDI Endpoints
  // ==========================================
  'GET /v1/lkridi/membership': {
    success: true,
    data: mockLkridiMemberships[0]
  } as ApiResponse<LkridiMembership>,

  'POST /v1/lkridi/request': {
    success: true,
    data: {
      requestId: `lkridi-req-${Date.now()}`,
      status: 'pending'
    }
  } as ApiResponse<{ requestId: string; status: string }>,

  'GET /v1/lkridi/balance': {
    success: true,
    data: {
      balance: 250,
      creditLimit: 1000,
      availableCredit: 750
    }
  } as ApiResponse<{ balance: number; creditLimit: number; availableCredit: number }>,

  'GET /v1/lkridi/transactions': {
    success: true,
    data: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
  } as ApiResponse<unknown[]>,

  'POST /v1/lkridi/pay': ((data?: Record<string, unknown>) => ({
    success: true,
    data: {
      paymentId: `pay-${Date.now()}`,
      amount: data?.amount,
      newBalance: 250 - (data?.amount as number || 0)
    },
    message: 'Payment successful'
  })) as MockResponseFunction<{ paymentId: string; amount: number; newBalance: number }>,

  // ==========================================
  // Rating Endpoints
  // ==========================================
  'GET /v1/ratings/store/:storeId': {
    success: true,
    data: mockRatings,
    pagination: { page: 1, limit: 10, total: mockRatings.length, totalPages: 1 }
  } as ApiResponse<Rating[]>,

  'POST /v1/ratings': ((data?: Record<string, unknown>) => ({
    success: true,
    data: {
      id: `rating-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  })) as MockResponseFunction<Rating>,

  // ==========================================
  // Chat Endpoints
  // ==========================================
  'GET /v1/chat/conversations': {
    success: true,
    data: mockConversations
  } as ApiResponse<Conversation[]>,

  'GET /v1/chat/:conversationId': {
    success: true,
    data: mockChatMessages
  } as ApiResponse<ChatMessage[]>,

  'POST /v1/chat/:conversationId': ((data?: Record<string, unknown>) => ({
    success: true,
    data: {
      id: `msg-${Date.now()}`,
      conversationId: data?.conversationId,
      senderId: 'buyer-1',
      message: data?.message,
      type: 'text',
      createdAt: new Date().toISOString()
    }
  })) as MockResponseFunction<ChatMessage>,

  'POST /v1/chat/:conversationId/read': {
    success: true,
    message: 'Marked as read'
  } as ApiResponse<never>,

  // ==========================================
  // Notification Endpoints
  // ==========================================
  'GET /v1/notifications': {
    success: true,
    data: mockNotifications
  } as ApiResponse<Notification[]>,

  'PATCH /v1/notifications/:id/read': {
    success: true,
    message: 'Marked as read'
  } as ApiResponse<never>,

  'PATCH /v1/notifications/read-all': {
    success: true,
    message: 'All notifications marked as read'
  } as ApiResponse<never>,

  // ==========================================
  // Delivery Endpoints
  // ==========================================
  'GET /v1/delivery/available-orders': {
    success: true,
    data: [mockOrders[2]],
    pagination: { page: 1, limit: 10, total: 1, totalPages: 1 }
  } as ApiResponse<Order[]>,

  'POST /v1/delivery/orders/:orderId/accept': {
    success: true,
    message: 'Order accepted for delivery'
  } as ApiResponse<never>,

  'POST /v1/delivery/orders/:orderId/location': {
    success: true,
    message: 'Location updated'
  } as ApiResponse<never>,

  'POST /v1/delivery/orders/:orderId/picked-up': {
    success: true,
    message: 'Order marked as picked up'
  } as ApiResponse<never>,

  'POST /v1/delivery/orders/:orderId/delivered': {
    success: true,
    message: 'Order delivered successfully'
  } as ApiResponse<never>,

  'GET /v1/delivery/my-deliveries': {
    success: true,
    data: [mockOrders[2]],
    pagination: { page: 1, limit: 10, total: 1, totalPages: 1 }
  } as ApiResponse<Order[]>,

  // ==========================================
  // Admin Endpoints
  // ==========================================
  'GET /v1/admin/stats': {
    success: true,
    data: {
      totalUsers: 156,
      totalStores: 23,
      totalOrders: 1247,
      totalRevenue: 156789.50,
      pendingApprovals: 5,
      activeDisputes: 3
    }
  } as ApiResponse<unknown>,

  'GET /v1/admin/users': {
    success: true,
    data: Object.values(mockUsers),
    pagination: { page: 1, limit: 10, total: 6, totalPages: 1 }
  } as ApiResponse<User[]>,

  'GET /v1/admin/sellers/pending': {
    success: true,
    data: []
  } as ApiResponse<unknown[]>,

  'POST /v1/admin/sellers/:sellerId/approve': {
    success: true,
    message: 'Seller approved successfully'
  } as ApiResponse<never>,

  'POST /v1/admin/sellers/:sellerId/reject': {
    success: true,
    message: 'Seller rejected'
  } as ApiResponse<never>,

  'GET /v1/admin/disputes': {
    success: true,
    data: []
  } as ApiResponse<unknown[]>,

  'POST /v1/admin/disputes/:disputeId/resolve': {
    success: true,
    message: 'Dispute resolved'
  } as ApiResponse<never>,

  // ==========================================
  // Upload Endpoints
  // ==========================================
  'POST /v1/upload/image': {
    success: true,
    data: {
      url: 'https://via.placeholder.com/300',
      publicId: `upload-${Date.now()}`,
      filename: 'image.jpg',
      size: 102400
    }
  } as ApiResponse<{ url: string; publicId: string; filename: string; size: number }>,

  'POST /v1/upload/multiple': {
    success: true,
    data: [
      { url: 'https://via.placeholder.com/300', publicId: 'upload-1', filename: 'image1.jpg', size: 102400 },
      { url: 'https://via.placeholder.com/300', publicId: 'upload-2', filename: 'image2.jpg', size: 204800 }
    ]
  } as ApiResponse<Array<{ url: string; publicId: string; filename: string; size: number }>>,

  // ==========================================
  // Video Endpoints
  // ==========================================
  'GET /v1/videos': {
    success: true,
    data: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
  } as ApiResponse<unknown[]>,

  'POST /v1/videos': {
    success: true,
    data: {
      id: `video-${Date.now()}`,
      status: 'pending',
      message: 'Video uploaded, waiting for approval'
    }
  } as ApiResponse<unknown>,

  'GET /v1/videos/:id': {
    success: true,
    data: null
  } as ApiResponse<unknown>,

  'DELETE /v1/videos/:id': {
    success: true,
    message: 'Video deleted successfully'
  } as ApiResponse<never>,

  'POST /v1/videos/:id/like': {
    success: true,
    message: 'Video liked'
  } as ApiResponse<never>,

  // ==========================================
  // Analytics Endpoints
  // ==========================================
  'GET /v1/analytics/buyer/:buyerId': {
    success: true,
    data: {
      totalSpent: 1247.50,
      ordersCount: 23,
      categories: [
        { name: 'Groceries', spent: 450.00, percentage: 36 },
        { name: 'Electronics', spent: 500.00, percentage: 40 },
        { name: 'Bakery', spent: 297.50, percentage: 24 }
      ],
      lkridiOwed: 250
    }
  } as ApiResponse<unknown>,

  'GET /v1/analytics/seller/:sellerId': {
    success: true,
    data: {
      totalEarnings: 45678.90,
      ordersCount: 567,
      averageRating: 4.5,
      popularProducts: [
        { id: 'product-1', name: 'Organic Apples', sold: 234, revenue: 1167.66 },
        { id: 'product-2', name: 'Whole Wheat Bread', sold: 189, revenue: 659.61 }
      ],
      deliveryStats: {
        total: 234,
        completed: 220,
        cancelled: 14
      }
    }
  } as ApiResponse<unknown>,

  // ==========================================
  // Dispute Endpoints
  // ==========================================
  'GET /v1/disputes': {
    success: true,
    data: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
  } as ApiResponse<unknown[]>,

  'POST /v1/disputes': ((data?: Record<string, unknown>) => ({
    success: true,
    data: {
      id: `dispute-${Date.now()}`,
      ...data,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  })) as MockResponseFunction<Dispute>,

  'GET /v1/disputes/:id': ((data?: Record<string, unknown>) => ({
    success: true,
    data: {
      id: data?.id,
      orderId: 'order-1',
      raisedBy: 'buyer-1',
      raisedByRole: 'buyer',
      type: 'refund',
      description: 'Item not as described',
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  })) as MockResponseFunction<Dispute>,
};