import mongoose, { Document, Schema } from 'mongoose';

export interface IOutfitComponent {
  name: string;
  category: string;
  color: string;
  material?: string;
  searchQuery: string;
}

export interface IOutfit extends Document {
  outfitId: string;
  title: string;
  description: string;
  occasion: string;
  style: string;
  colors: string[];
  top: IOutfitComponent;
  bottom: IOutfitComponent;
  footwear: IOutfitComponent;
  accessories: IOutfitComponent;
  image: string;
  matchScore: number;
  reason: string;
  gender: 'male' | 'female' | 'unisex';
  season: 'Summer' | 'Monsoon' | 'Winter' | 'Spring' | 'All Season';
  skinToneSuitability: string[];
  bodyTypeSuitability: string[];
  estimatedTotalPrice: number;
  currency: string;
  isAIGenerated: boolean;
  isIllustrativeImage: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const OutfitComponentSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    color: { type: String, required: true },
    material: { type: String, default: '' },
    searchQuery: { type: String, required: true },
  },
  { _id: false }
);

const OutfitSchema: Schema = new Schema(
  {
    outfitId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    occasion: { type: String, required: true, index: true },
    style: { type: String, required: true, index: true },
    colors: { type: [String], default: [] },
    top: { type: OutfitComponentSchema, required: true },
    bottom: { type: OutfitComponentSchema, required: true },
    footwear: { type: OutfitComponentSchema, required: true },
    accessories: { type: OutfitComponentSchema, required: true },
    image: { type: String, required: true },
    matchScore: { type: Number, default: 90 },
    reason: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female', 'unisex'], default: 'unisex' },
    season: { type: String, enum: ['Summer', 'Monsoon', 'Winter', 'Spring', 'All Season'], default: 'All Season' },
    skinToneSuitability: { type: [String], default: [] },
    bodyTypeSuitability: { type: [String], default: [] },
    estimatedTotalPrice: { type: Number, default: 2999 },
    currency: { type: String, default: 'INR' },
    isAIGenerated: { type: Boolean, default: true },
    isIllustrativeImage: { type: Boolean, default: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Outfit = mongoose.model<IOutfit>('Outfit', OutfitSchema);
