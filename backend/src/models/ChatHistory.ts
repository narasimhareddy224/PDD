import mongoose, { Document, Schema } from 'mongoose';

export interface IChatMessage {
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: Date;
  outfitSuggestions?: string[];
  productSuggestions?: string[];
  weatherSnapshot?: string;
}

export interface IChatHistory extends Document {
  userId: mongoose.Types.ObjectId;
  firebaseUid: string;
  conversationTitle: string;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema(
  {
    sender: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    outfitSuggestions: { type: [String], default: [] },
    productSuggestions: { type: [String], default: [] },
    weatherSnapshot: { type: String, default: '' },
  },
  { _id: false }
);

const ChatHistorySchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    firebaseUid: { type: String, required: true, index: true },
    conversationTitle: { type: String, default: 'Fashion Consultation' },
    messages: { type: [ChatMessageSchema], default: [] },
  },
  { timestamps: true }
);

export const ChatHistory = mongoose.model<IChatHistory>('ChatHistory', ChatHistorySchema);
