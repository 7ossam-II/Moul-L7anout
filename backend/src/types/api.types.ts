// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'buyer' | 'seller' | 'worker' | 'delivery' | 'admin';
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Worker Types
// ============================================

export interface Worker {
  id: string;
  userId: string;
  storeId: string;
  role: 'worker';
  permissions: WorkerPermissions;
  status: 'active' | 'inactive' | 'pending';
  invitedBy: string;  // seller owner ID
  createdAt: string;
  updatedAt: string;
  user?: User;  // Populated when fetching
}

export interface WorkerPermissions {
  canManageProducts: boolean;     // Add/edit products
  canDeleteProducts: boolean;     // Delete products
  canManageOrders: boolean;       // Update order status
  canViewEarnings: boolean;       // View financial data
  canManageWorkers: boolean;      // Invite/remove workers
  canEditStore: boolean;          // Edit store details
}

// ============================================
// Store Types
// ============================================

export interface Store {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  workerIds?: string[];
  address: string;
  location: {
    type: 'Point';
    coordinates: [number, number];  // [longitude, latitude]
  };
  phone: string;
  email: string;
  logo?: string;
  coverImage?: string;
  categories: string[];
  isOpen: boolean;
  operatingHours: OperatingHours;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OperatingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  isOpen: boolean;
  open: string;   // Format: "HH:MM"
  close: string;  // Format: "HH:MM"
}

// ============================================
// Product Types
// ============================================

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  inStock: boolean;
  quantity: number;
  attributes: ProductAttribute[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

// ============================================
// Order Types
// ============================================

export type OrderStatus = 
  | 'pending'           // Order placed, waiting for store confirmation
  | 'confirmed'         // Store confirmed the order
  | 'preparing'         // Store is preparing the order
  | 'ready_for_pickup'  // Ready for delivery pickup
  | 'out_for_delivery'  // Delivery person picked up
  | 'delivered'         // Delivered to customer
  | 'cancelled';        // Order cancelled

export type PaymentMethod = 'cash' | 'card' | 'wallet';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  storeId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  deliveryFee: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryAddress: Address | null;
  isDelivery: boolean;           // ← Add this
  qrCode?: string;               // ← Add this
  cancelReason?: string;         // ← Add this
  cancelledBy?: string;          // ← Add this
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryTime?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates: [number, number];  // [longitude, latitude]
}

// ============================================
// LKRIDI Types
// ============================================

export interface LkridiMembership {
  id: string;
  userId: string;
  storeId?: string;
  type: 'customer' | 'store';
  status: 'active' | 'inactive' | 'pending';
  creditLimit: number;
  currentBalance: number;
  paymentDueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LkridiRecord {
  id: string;
  membershipId: string;
  amount: number;
  type: 'purchase' | 'payment' | 'refund';
  description: string;
  createdAt: string;
}

// ============================================
// QR Code Types
// ============================================

export interface QRCode {
  id: string;
  code: string;
  storeId: string;
  tableNumber?: string;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

// ============================================
// Delivery Types
// ============================================

export type DeliveryStatus = 'assigned' | 'picked_up' | 'in_transit' | 'delivered';

export interface Delivery {
  id: string;
  orderId: string;
  deliveryPersonId: string;
  status: DeliveryStatus;
  pickupTime?: string;
  deliveryTime?: string;
  currentLocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Chat Types
// ============================================

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  orderId?: string;
  message: string;
  readAt?: string;
  createdAt: string;
}

// ============================================
// Rating Types
// ============================================

export interface Rating {
  id: string;
  userId: string;
  storeId?: string;
  productId?: string;
  orderId: string;
  rating: number;  // 1-5
  review?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Admin Types
// ============================================

export interface AdminStats {
  totalUsers: number;
  totalStores: number;
  totalOrders: number;
  totalRevenue: number;
  pendingApprovals: number;
  activeDisputes: number;
}

// ============================================
// Auth Types
// ============================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: 'buyer' | 'seller' | 'worker' | 'delivery';
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    refreshToken?: string;
  };
  message?: string;
}

// ============================================
// Upload Types
// ============================================

export interface UploadResponse {
  success: boolean;
  data: {
    url: string;
    publicId: string;
    filename: string;
    size: number;
  };
}

// ============================================
// Store Stats Types
// ============================================

export interface StoreStats {
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  pendingOrders: number;
  readyOrders: number;
  outForDeliveryOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalProducts: number;
  reviewCount: number;
}

// ============================================
// Invitation Types
// ============================================

export interface WorkerInvitation {
  workerId: string;
  store: {
    id: string;
    name: string;
    logo?: string;
  };
  invitedBy: {
    id: string;
    name: string;
  };
  permissions: WorkerPermissions;
  createdAt: string;
}