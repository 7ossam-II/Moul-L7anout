import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  phone: string;
  name: string;
  email?: string;
  role: 'buyer' | 'seller' | 'delivery' | 'admin' | 'worker';
  isVerified: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'delivery', 'admin', 'worker'],
      default: 'buyer',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', userSchema);
