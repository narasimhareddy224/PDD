import mongoose, { Document, Schema } from 'mongoose';

export type ShoppingPlatform = 'Amazon' | 'Flipkart' | 'Myntra' | 'Ajio';
export type ProductCategory = 'Top' | 'Bottom' | 'Footwear' | 'Accessories' | 'Full Set';
export type ProductAvailability = 'In Stock' | 'Out of Stock' | 'Limited Stock' | 'Unavailable';

export interface IShoppingProduct extends Document {
  productId: string;
  outfitId?: string;
  platform: ShoppingPlatform;
  productName: string;
  category: ProductCategory;
  brand: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  currency: string;
  imageUrl: string;
  productUrl: string;
  matchScore: number;
  availability: ProductAvailability;
  size?: string[];
  color: string;
  rating?: number;
  reviewsCount?: number;
  isVerifiedPrice: boolean;
  matchReason?: string;
  lastChecked: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ShoppingProductSchema: Schema = new Schema(
  {
    productId: { type: String, required: true, unique: true, index: true },
    outfitId: { type: String, index: true },
    platform: {
      type: String,
      enum: ['Amazon', 'Flipkart', 'Myntra', 'Ajio'],
      required: true,
      index: true,
    },
    productName: { type: String, required: true },
    category: {
      type: String,
      enum: ['Top', 'Bottom', 'Footwear', 'Accessories', 'Full Set'],
      required: true,
      index: true,
    },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discountPercent: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    imageUrl: { type: String, required: true },
    productUrl: { type: String, required: true },
    matchScore: { type: Number, required: true, min: 0, max: 100 },
    availability: {
      type: String,
      enum: ['In Stock', 'Out of Stock', 'Limited Stock', 'Unavailable'],
      default: 'In Stock',
    },
    size: { type: [String], default: ['S', 'M', 'L', 'XL'] },
    color: { type: String, required: true },
    rating: { type: Number, default: 4.3 },
    reviewsCount: { type: Number, default: 120 },
    isVerifiedPrice: { type: Boolean, default: true },
    matchReason: { type: String, default: 'Matches user color tone and requested styling.' },
    lastChecked: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ShoppingProductSchema.index({ outfitId: 1, category: 1, platform: 1 });

export const ShoppingProduct = mongoose.model<IShoppingProduct>('ShoppingProduct', ShoppingProductSchema);
