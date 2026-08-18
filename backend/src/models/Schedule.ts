import mongoose, { Document, Schema } from 'mongoose';

export type ReminderInterval = '1 day before' | '12 hours before' | '2 hours before' | 'At event time' | 'None';

export interface ISchedule extends Document {
  userId: mongoose.Types.ObjectId;
  firebaseUid: string;
  outfit: mongoose.Types.ObjectId;
  occasion: string;
  scheduleDate: Date;
  scheduleTime: string;
  notes?: string;
  reminderInterval: ReminderInterval;
  reminderDate?: Date;
  notificationSent: boolean;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ScheduleSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    firebaseUid: { type: String, required: true, index: true },
    outfit: { type: Schema.Types.ObjectId, ref: 'Outfit', required: true },
    occasion: { type: String, required: true, index: true },
    scheduleDate: { type: Date, required: true, index: true },
    scheduleTime: { type: String, default: '09:00 AM' },
    notes: { type: String, default: '' },
    reminderInterval: {
      type: String,
      enum: ['1 day before', '12 hours before', '2 hours before', 'At event time', 'None'],
      default: '1 day before',
    },
    reminderDate: { type: Date },
    notificationSent: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ScheduleSchema.index({ userId: 1, scheduleDate: 1 });

export const Schedule = mongoose.model<ISchedule>('Schedule', ScheduleSchema);
