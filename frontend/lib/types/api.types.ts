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
  role: 'buyer' | 'seller' | 'worker' | 'delivery' | 'admin';  // ← Added 'worker'
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Worker Types (← NEW SECTION)
// ============================================

export interface Worker {
  id: string;
  userId: string;
  storeId: string;
  role: 'worker';
  permissions: WorkerPermissions;
  status: 'active' | 'inactive' | 'pending';
  invitedBy: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface WorkerPermissions {
  canManageProducts: boolean;
  canDeleteProducts: boolean;
  canManageOrders: boolean;
  canViewEarnings: boolean;
  canManageWorkers: boolean;
  canEditStore: boolean;
}

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

// ============================================
// Store Types
// ============================================

export interface Store {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  workerIds?: string[];  // ← Added
  address: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
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
  open: string;
  close: string;
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
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cash' | 'card' | 'wallet';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';


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
  coordinates: [number, number];
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
  role?: 'buyer' | 'seller' | 'worker' | 'delivery';  // ← Added 'worker'
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
// QR Code Types (FR4)
// ============================================

export interface QRCode {
  id: string;
  code: string;
  orderId: string;
  storeId: string;
  buyerId: string;
  type: 'online' | 'offline' | 'lkridi' | 'delivery';
  status: 'active' | 'expired' | 'completed' | 'cancelled';
  expiresAt: string | null;
  isUsed: boolean;
  scannedAt?: string;
  scannedBy?: string;
  accomplishedBy: string[];
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Payment Transaction Types (FR3.3 - Escrow)
// ============================================

export interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  gatewayReference?: string;
  status: 'pending' | 'processing' | 'held_in_escrow' | 'released' | 'refunded' | 'failed';
  escrowReleasedAt?: string;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// LKRIDI Record Types (FR6.3)
// ============================================

export interface LkridiRecord {
  id: string;
  membershipId: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  storeId: string;
  amount: number;
  status: 'active' | 'paid' | 'overdue';
  dueDate?: string;
  paidAt?: string;
  reminderSentAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Delivery Types (FR5)
// ============================================

export type DeliveryStatus = 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';

export interface Delivery {
  id: string;
  orderId: string;
  deliveryPersonId?: string;
  status: DeliveryStatus;
  pickupTime?: string;
  deliveryTime?: string;
  deliveryFee: number;
  qrCode?: string;
  currentLocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
  locationUpdatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Rating Types (FR10.3)
// ============================================

export interface Rating {
  id: string;
  buyerId: string;
  storeId: string;
  orderId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  images?: string[];
  isAnonymous: boolean;
  sellerReply?: string;
  sellerRepliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Chat Message Types (FR8.1)
// ============================================

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  orderId?: string;
  productId?: string;
  message: string;
  type: 'text' | 'image' | 'product_link' | 'order_link';
  readAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Video Ad Types (FR9)
// ============================================

export interface VideoAd {
  id: string;
  sellerId: string;
  storeId: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'archived';
  approvedBy?: string;
  approvedAt?: string;
  views: number;
  likes: number;
  shares: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Dispute Types (FR11.2)
// ============================================

export interface Dispute {
  id: string;
  orderId: string;
  raisedBy: string;
  raisedByRole: 'buyer' | 'seller';
  type: 'refund' | 'quality' | 'delivery' | 'other';
  description: string;
  evidence?: string[];
  status: 'open' | 'under_review' | 'resolved' | 'closed';
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Bank Card Types (FR1.3)
// ============================================

export interface BankCard {
  id: string;
  userId: string;
  cardholderName: string;
  last4: string;
  brand: 'visa' | 'mastercard' | 'cmr';
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  gatewayToken: string;
  createdAt: string;
}

// ============================================
// Document Types (FR1.2 - Seller Verification)
// ============================================

export interface Document {
  id: string;
  userId: string;
  type: 'id_card' | 'passport' | 'bank_card';
  fileUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Notification Types (FR8.2)
// ============================================

export interface Notification {
  id: string;
  userId: string;
  type: 'order_status' | 'lkridi_reminder' | 'delivery_update' | 'promotion' | 'system';
  title: string;
  body: string;
  data?: Record<string, unknown>;
  readAt?: string;
  createdAt: string;
}

// ============================================
// Update Order Type (Add missing fields)
// ============================================

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
  deliveryAddress: Address | null;  // ← Can be null for pickup
  isDelivery: boolean;              // ← ADD THIS
  qrCode?: string;                  // ← ADD THIS
  cancelReason?: string;            // ← ADD THIS
  cancelledBy?: string;             // ← ADD THIS
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryTime?: string;
}

// ============================================
// Update Store Type (Add delivery/LKRIDI flags)
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
    coordinates: [number, number];
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
  deliveryEnabled: boolean;          // ← ADD THIS (FR5)
  deliveryFee?: number;              // ← ADD THIS (FR5.2)
  lkridiEnabled: boolean;            // ← ADD THIS (FR1.5)
  liveTrackingEnabled: boolean;      // ← ADD THIS (FR2.3)
  createdAt: string;
  updatedAt: string;
}