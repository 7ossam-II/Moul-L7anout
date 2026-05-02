import mongoose, { Schema, Document } from 'mongoose';

export interface IQRCode extends Document {
  code: string;
  orderId: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  buyerId: mongoose.Types.ObjectId;
  type: 'online' | 'offline' | 'lkridi' | 'delivery';
  expiresAt?: Date;
  isUsed: boolean;
  usedAt?: Date;
  buyerAccomplished: boolean;
  sellerAccomplished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const qrCodeSchema = new Schema<IQRCode>(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['online', 'offline', 'lkridi', 'delivery'],
      required: true,
    },
    expiresAt: {
      type: Date,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    usedAt: {
      type: Date,
    },
    buyerAccomplished: {
      type: Boolean,
      default: false,
    },
    sellerAccomplished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const QRCode = mongoose.model<IQRCode>('QRCode', qrCodeSchema);
