export interface User {
  _id?: string;
  firebaseUid: string;
  email: string;
  name: string;
  phone?: string;
  profileImage?: string;
  fcmToken?: string;
}

export interface UserProfile {
  _id?: string;
  userId?: string;
  firebaseUid: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  gender: 'male' | 'female' | 'non-binary' | 'other' | 'prefer-not-to-say';
  age?: number;
  height?: number;
  weight?: number;
  preferredColors: string[];
  preferredStyles: string[];
  preferredBrands: string[];
  budget: 'Under ₹1,000' | 'Under ₹2,000' | 'Under ₹5,000' | '₹5,000+' | 'Custom';
  customBudget?: number;
  preferredOccasions: string[];
  clothingPreferences?: {
    fitPreference?: 'slim' | 'regular' | 'relaxed' | 'oversized';
    modestyPreference?: 'standard' | 'high' | 'flexible';
    materialPreferences?: string[];
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
  meta?: Record<string, any>;
}
