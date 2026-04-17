import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  buyerId: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  paymentMethod: 'online' | 'offline' | 'lkridi';
  status: 'pending' | 'qr_generated' | 'accomplished' | 'cancelled' | 'refunded';
  deliveryEnabled: boolean;
  deliveryFee?: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
});

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['online', 'offline', 'lkridi'],
      default: 'offline',
    },
    status: {
      type: String,
      enum: ['pending', 'qr_generated', 'accomplished', 'cancelled', 'refunded'],
      default: 'pending',
    },
    deliveryEnabled: {
      type: Boolean,
      default: false,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model<IOrder>('Order', orderSchema);
