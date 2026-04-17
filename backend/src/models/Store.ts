import mongoose, { Schema, Document } from 'mongoose';

export interface IStore extends Document {
  name: string;
  description?: string;
  ownerId: mongoose.Types.ObjectId;
  address: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  phone: string;
  email?: string;
  logo?: string;
  coverImage?: string;
  categories: string[];
  isOpen: boolean;
  rating: number;
  reviewCount: number;
  deliveryEnabled: boolean;
  deliveryFee?: number;
  lkridiEnabled: boolean;
  liveTrackingEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new Schema<IStore>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    logo: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    categories: {
      type: [String],
      default: [],
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    deliveryEnabled: {
      type: Boolean,
      default: false,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    lkridiEnabled: {
      type: Boolean,
      default: false,
    },
    liveTrackingEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

storeSchema.index({ location: '2dsphere' });

export const Store = mongoose.model<IStore>('Store', storeSchema);
