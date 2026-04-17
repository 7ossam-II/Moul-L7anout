import mongoose, { Schema, Document } from 'mongoose';

export interface ILkridiRecord extends Document {
  buyerId: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  amount: number;
  repaymentDeadline?: Date;
  isPaid: boolean;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const lkridiRecordSchema = new Schema<ILkridiRecord>(
  {
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
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    repaymentDeadline: {
      type: Date,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const LkridiRecord = mongoose.model<ILkridiRecord>('LkridiRecord', lkridiRecordSchema);
