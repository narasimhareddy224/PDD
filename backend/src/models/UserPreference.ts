import mongoose, { Document, Schema } from 'mongoose';

export interface IUserPreference extends Document {
  userId: mongoose.Types.ObjectId;
  firebaseUid: string;
  colors: string[];
  styles: string[];
  brands: string[];
  maxBudget: number;
  budgetCategory: string;
  occasionPreferences: string[];
  weatherAware: boolean;
  colorContrastPreference: 'high' | 'subtle' | 'monochrome';
  createdAt: Date;
  updatedAt: Date;
}

const UserPreferenceSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    firebaseUid: { type: String, required: true, index: true },
    colors: { type: [String], default: ['Navy', 'Black', 'Olive', 'Charcoal', 'White'] },
    styles: { type: [String], default: ['Smart Casual', 'Minimalist', 'Casual'] },
    brands: { type: [String], default: ['Zara', 'H&M', 'Nike', 'Levi\'s'] },
    maxBudget: { type: Number, default: 5000 },
    budgetCategory: { type: String, default: 'Under ₹5,000' },
    occasionPreferences: { type: [String], default: ['Office', 'Casual outings', 'Parties'] },
    weatherAware: { type: Boolean, default: true },
    colorContrastPreference: { type: String, enum: ['high', 'subtle', 'monochrome'], default: 'subtle' },
  },
  { timestamps: true }
);

export const UserPreference = mongoose.model<IUserPreference>('UserPreference', UserPreferenceSchema);
