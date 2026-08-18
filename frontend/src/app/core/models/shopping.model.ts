export type ShoppingPlatform = 'Amazon' | 'Flipkart' | 'Myntra' | 'Ajio';
export type ProductCategory = 'Top' | 'Bottom' | 'Footwear' | 'Accessories' | 'Full Set';

export interface VerifiedPlatformPrice {
  platform: ShoppingPlatform;
  available: boolean;
  price?: number;
  originalPrice?: number;
  currency: string;
  productUrl?: string;
  productName?: string;
  brand?: string;
  imageUrl?: string;
  inStock?: boolean;
  rating?: number;
  reviewsCount?: number;
  statusMessage: string;
  lastChecked: Date;
}

export interface ProductComparisonResult {
  productTitle: string;
  category: ProductCategory;
  targetColor: string;
  lowestVerifiedPrice?: {
    platform: ShoppingPlatform;
    price: number;
    currency: string;
    productUrl: string;
    productName: string;
  };
  platformPrices: Record<ShoppingPlatform, VerifiedPlatformPrice>;
  matchScore: number;
  matchReason: string;
}

export interface ShoppingProduct {
  productId: string;
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
  availability: string;
  color: string;
  rating?: number;
  reviewsCount?: number;
  isVerifiedPrice: boolean;
  statusMessage: string;
}
