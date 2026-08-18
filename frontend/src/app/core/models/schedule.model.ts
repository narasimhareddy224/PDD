import { Outfit } from './outfit.model';

export type ReminderInterval = '1 day before' | '12 hours before' | '2 hours before' | 'At event time' | 'None';

export interface ScheduleEvent {
  _id?: string;
  userId?: string;
  firebaseUid?: string;
  outfit: Outfit;
  occasion: string;
  scheduleDate: string;
  scheduleTime: string;
  notes?: string;
  reminderInterval: ReminderInterval;
  notificationSent?: boolean;
  isCompleted?: boolean;
  createdAt?: string;
}
