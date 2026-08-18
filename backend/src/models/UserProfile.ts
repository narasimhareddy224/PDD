import mongoose, { Document, Schema } from 'mongoose';

export interface IUserProfile extends Document {
  userId: mongoose.Types.ObjectId;
  firebaseUid: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  gender: 'male' | 'female' | 'non-binary' | 'other' | 'prefer-not-to-say';
  age?: number;
  height?: number; // in cm
  weight?: number; // in kg
  preferredColors: string[];
  preferredStyles: string[];
  preferredBrands: string[];
  budget: 'Under ₹1,000' | 'Under ₹2,000' | 'Under ₹5,000' | '₹5,000+' | 'Custom';
  customBudget?: number;
  preferredOccasions: string[];
  clothingPreferences: {
    fitPreference: 'slim' | 'regular' | 'relaxed' | 'oversized';
    modestyPreference: 'standard' | 'high' | 'flexible';
    materialPreferences: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserProfileSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    firebaseUid: { type: String, required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary', 'other', 'prefer-not-to-say'],
      default: 'prefer-not-to-say',
    },
    age: { type: Number, min: 10, max: 120 },
    height: { type: Number, min: 50, max: 250 },
    weight: { type: Number, min: 20, max: 300 },
    preferredColors: { type: [String], default: ['Black', 'Navy Blue', 'White', 'Olive', 'Beige'] },
    preferredStyles: { type: [String], default: ['Smart Casual', 'Casual', 'Streetwear'] },
    preferredBrands: { type: [String], default: ['Zara', 'H&M', 'Nike', 'Levi\'s', 'Uniqlo'] },
    budget: {
      type: String,
      enum: ['Under ₹1,000', 'Under ₹2,000', 'Under ₹5,000', '₹5,000+', 'Custom'],
      default: 'Under ₹5,000',
    },
    customBudget: { type: Number, default: 5000 },
    preferredOccasions: {
      type: [String],
      default: ['Casual outings', 'College', 'Office', 'Parties', 'Weddings', 'Dates'],
    },
    clothingPreferences: {
      fitPreference: { type: String, enum: ['slim', 'regular', 'relaxed', 'oversized'], default: 'regular' },
      modestyPreference: { type: String, enum: ['standard', 'high', 'flexible'], default: 'standard' },
      materialPreferences: { type: [String], default: ['Cotton', 'Linen', 'Denim'] },
    },
  },
  { timestamps: true }
);

export const UserProfile = mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);
