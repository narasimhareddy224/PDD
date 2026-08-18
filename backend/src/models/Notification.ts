import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  firebaseUid: string;
  scheduleId?: mongoose.Types.ObjectId;
  title: string;
  body: string;
  type: 'outfit_reminder' | 'weather_alert' | 'style_tip' | 'general';
  isRead: boolean;
  status: 'pending' | 'sent' | 'failed';
  scheduledFor?: Date;
  sentAt?: Date;
  fcmMessageId?: string;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    firebaseUid: { type: String, required: true, index: true },
    scheduleId: { type: Schema.Types.ObjectId, ref: 'Schedule' },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: {
      type: String,
      enum: ['outfit_reminder', 'weather_alert', 'style_tip', 'general'],
      default: 'outfit_reminder',
    },
    isRead: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    scheduledFor: { type: Date },
    sentAt: { type: Date },
    fcmMessageId: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

NotificationSchema.index({ userId: 1, isRead: 1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
