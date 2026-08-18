import { sendFCMNotification } from '../config/firebase';
import { Schedule, ISchedule } from '../models/Schedule';
import { Notification } from '../models/Notification';
import { User } from '../models/User';
import { logger } from '../utils/logger';

export class NotificationService {
  /**
   * Process pending scheduled outfit reminders and trigger FCM push alerts
   */
  public static async processScheduledReminders(): Promise<{ processedCount: number }> {
    const now = new Date();
    // Find upcoming schedules within 24 hours that haven't had notifications sent
    const upcomingSchedules = await Schedule.find({
      notificationSent: false,
      scheduleDate: { $gte: now, $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000) },
    }).populate('outfit');

    let processedCount = 0;

    for (const item of upcomingSchedules) {
      try {
        const user = await User.findOne({ firebaseUid: item.firebaseUid });
        const outfitTitle = (item.outfit as any)?.title || 'Your scheduled outfit';
        const formattedDate = new Date(item.scheduleDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });

        const title = `👗 Outfit Ready for ${item.occasion}!`;
        const body = `Your "${outfitTitle}" is scheduled for ${formattedDate} at ${item.scheduleTime || '09:00 AM'}.`;

        const fcmResult = await sendFCMNotification(
          user?.fcmToken || '',
          title,
          body,
          {
            scheduleId: item._id.toString(),
            occasion: item.occasion,
          }
        );

        await Notification.create({
          userId: item.userId,
          firebaseUid: item.firebaseUid,
          scheduleId: item._id,
          title,
          body,
          type: 'outfit_reminder',
          status: fcmResult.success ? 'sent' : 'failed',
          sentAt: new Date(),
          fcmMessageId: fcmResult.messageId,
        });

        item.notificationSent = true;
        await item.save();
        processedCount++;
      } catch (err) {
        logger.error(`Failed to process schedule reminder for schedule ID ${item._id}:`, err);
      }
    }

    return { processedCount };
  }
}
