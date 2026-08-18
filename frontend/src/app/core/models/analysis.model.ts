export type SkinTone = 'Very Fair' | 'Fair' | 'Medium' | 'Olive' | 'Brown' | 'Deep';
export type BodyType = 'Rectangle' | 'Triangle' | 'Inverted Triangle' | 'Oval' | 'Hourglass';
export type FitnessLevel = 'Lean' | 'Average' | 'Athletic' | 'Muscular' | 'Plus-size';
export type FashionStyle = 'Casual' | 'Formal' | 'Smart Casual' | 'Streetwear' | 'Traditional' | 'Sporty' | 'Minimalist' | 'Trendy';

export interface UserAnalysis {
  _id?: string;
  userId?: string;
  firebaseUid?: string;
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
  disclaimer: string;
  analyzedAt?: Date;
}
