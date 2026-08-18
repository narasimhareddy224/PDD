import mongoose, { Document, Schema } from 'mongoose';

export interface IRecommendation extends Document {
  userId: mongoose.Types.ObjectId;
  firebaseUid: string;
  outfit: mongoose.Types.ObjectId;
  occasion: string;
  weatherCondition?: string;
  temperature?: number;
  matchScore: number;
  reason: string;
  isDailyPick: boolean;
  viewed: boolean;
  liked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RecommendationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    firebaseUid: { type: String, required: true, index: true },
    outfit: { type: Schema.Types.ObjectId, ref: 'Outfit', required: true },
    occasion: { type: String, required: true, index: true },
    weatherCondition: { type: String, default: 'Clear' },
    temperature: { type: Number },
    matchScore: { type: Number, required: true, min: 0, max: 100 },
    reason: { type: String, required: true },
    isDailyPick: { type: Boolean, default: false },
    viewed: { type: Boolean, default: false },
    liked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Recommendation = mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);
