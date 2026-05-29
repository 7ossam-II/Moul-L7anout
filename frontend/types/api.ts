// Contract-aligned types matching docs/Api_contract.md v1.0

export type Role = 'BUYER' | 'SELLER' | 'ADMIN' | 'DELIVERY_PERSON' | 'CASHIER';
export type PaymentMethod = 'ONLINE' | 'OFFLINE' | 'LKRIDI';
export type OrderStatus = 'PENDING' | 'QR_GENERATED' | 'ACCOMPLISHED' | 'REFUNDED';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'DENIED';
export type RepaymentStatus = 'UNPAID' | 'PAID';

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface ApiUser {
  id: number;
  phone: string;
  fullName: string;
  role: Role;
  verified?: boolean;
}

export interface ApiError {
  success: false;
  error: string;
  details: unknown[];
}

// ── Stores ───────────────────────────────────────────────────────────────────

export interface ApiStoreListItem {
  id: number;
  name: string;
  storeType: string;
  openStatus: boolean;
  deliveryFlatFee: number;
  ratingAvg: number;
  distance: number;
  location: { lat: number; lng: number };
}

export interface ApiStoreDetail {
  id: number;
  name: string;
  storeType: string;
  openStatus: boolean;
  address: string;
  location: { lat: number; lng: number };
  deliveryFlatFee: number;
  ratingAvg: number;
  lkridiEnabled: boolean;
}

// ── Products ─────────────────────────────────────────────────────────────────

export interface ApiProduct {
  id: number;
  name: string;
  price: number;
  photoUrl: string | null;
  deliveryAvailable: boolean;
  maxPerDelivery: number;
  availableStatus: boolean;
  expectedAvailabilityDate: string | null;
}

// ── Orders ───────────────────────────────────────────────────────────────────

export interface ApiOrderItem {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface ApiOrder {
  id: number;
  buyerId: number;
  storeId: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  orderStatus: OrderStatus;
  createdAt: string;
  items: ApiOrderItem[];
  qrCode?: string;
  expiresAt?: string;
}

// ── LKRIDI ───────────────────────────────────────────────────────────────────

export interface ApiMembershipRequest {
  membershipId: number;
  approvalStatus: ApprovalStatus;
}

export interface ApiLkridiOrder {
  orderId: number;
  amountOwed: number;
  orderStatus: string;
  qrCode: string;
}

// ── Ratings ──────────────────────────────────────────────────────────────────

export interface ApiRating {
  id: number;
  buyerId: number;
  storeId: number;
  orderId: number;
  score: number;
  comment?: string;
  createdAt?: string;
}

// ── Workers (placeholder — not in contract v1.0) ─────────────────────────────

export interface ApiWorker {
  id: number;
  storeId: number;
  name: string;
  phone: string;
  status: 'Active' | 'Inactive';
}
