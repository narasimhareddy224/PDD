import mongoose, { Document, Schema } from 'mongoose';

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  firebaseUid: string;
  outfit: mongoose.Types.ObjectId;
  notes?: string;
  tags: string[];
  createdAt: Date;
}

const FavoriteSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    firebaseUid: { type: String, required: true, index: true },
    outfit: { type: Schema.Types.ObjectId, ref: 'Outfit', required: true },
    notes: { type: String, default: '' },
    tags: { type: [String], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

FavoriteSchema.index({ userId: 1, outfit: 1 }, { unique: true });

export const Favorite = mongoose.model<IFavorite>('Favorite', FavoriteSchema);
