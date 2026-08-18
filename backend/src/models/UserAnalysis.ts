import mongoose, { Document, Schema } from 'mongoose';

export type SkinTone = 'Very Fair' | 'Fair' | 'Medium' | 'Olive' | 'Brown' | 'Deep';
export type BodyType = 'Rectangle' | 'Triangle' | 'Inverted Triangle' | 'Oval' | 'Hourglass';
export type FitnessLevel = 'Lean' | 'Average' | 'Athletic' | 'Muscular' | 'Plus-size';
export type FashionStyle = 'Casual' | 'Formal' | 'Smart Casual' | 'Streetwear' | 'Traditional' | 'Sporty' | 'Minimalist' | 'Trendy';

export interface IUserAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  firebaseUid: string;
  photoUrl: string;
  skinTone: SkinTone;
  bodyType: BodyType;
  fitnessLevel: FitnessLevel;
  style: FashionStyle;
  confidence: number;
  undertone?: 'Warm' | 'Cool' | 'Neutral';
  recommendedColorPalette: string[];
  contrastRecommendation: string;
  bodyTypeStylingTips: string[];
  userEdits: boolean;
  originalAiPrediction?: {
    skinTone: string;
    bodyType: string;
    fitnessLevel: string;
    style: string;
    confidence: number;
  };
  disclaimer: string;
  analyzedAt: Date;
  updatedAt: Date;
}

const UserAnalysisSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    firebaseUid: { type: String, required: true, index: true },
    photoUrl: { type: String, required: true },
    skinTone: {
      type: String,
      enum: ['Very Fair', 'Fair', 'Medium', 'Olive', 'Brown', 'Deep'],
      required: true,
      default: 'Medium',
    },
    bodyType: {
      type: String,
      enum: ['Rectangle', 'Triangle', 'Inverted Triangle', 'Oval', 'Hourglass'],
      required: true,
      default: 'Rectangle',
    },
    fitnessLevel: {
      type: String,
      enum: ['Lean', 'Average', 'Athletic', 'Muscular', 'Plus-size'],
      required: true,
      default: 'Average',
    },
    style: {
      type: String,
      enum: ['Casual', 'Formal', 'Smart Casual', 'Streetwear', 'Traditional', 'Sporty', 'Minimalist', 'Trendy'],
      required: true,
      default: 'Smart Casual',
    },
    confidence: { type: Number, required: true, default: 0.88 },
    undertone: { type: String, enum: ['Warm', 'Cool', 'Neutral'], default: 'Neutral' },
    recommendedColorPalette: { type: [String], default: ['Navy', 'Burgundy', 'Emerald Green', 'Charcoal', 'White'] },
    contrastRecommendation: { type: String, default: 'Medium to high contrast pairings enhance silhouette definition.' },
    bodyTypeStylingTips: { type: [String], default: ['Structured shoulders balance lower proportions', 'Vertical lines elongate frame'] },
    userEdits: { type: Boolean, default: false },
    originalAiPrediction: {
      skinTone: String,
      bodyType: String,
      fitnessLevel: String,
      style: String,
      confidence: Number,
    },
    disclaimer: {
      type: String,
      default: 'AI visual analysis provides approximate stylistic suggestions and is not a medical or scientifically definitive conclusion.',
    },
    analyzedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const UserAnalysis = mongoose.model<IUserAnalysis>('UserAnalysis', UserAnalysisSchema);
