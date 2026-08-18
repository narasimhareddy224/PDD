import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Schedule } from '../models/Schedule';
import { Outfit } from '../models/Outfit';
import { sendSuccess, sendError } from '../utils/response';
import { logger } from '../utils/logger';

export class ScheduleController {
  public static async getSchedules(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const firebaseUid = req.firebaseUid!;
      const { upcoming } = req.query;

      const filter: any = { firebaseUid };
      if (upcoming === 'true') {
        filter.scheduleDate = { $gte: new Date(new Date().setHours(0, 0, 0, 0)) };
      }

      const schedules = await Schedule.find(filter)
        .populate('outfit')
        .sort({ scheduleDate: 1 });

      sendSuccess(res, schedules, 'Schedules retrieved successfully', 200, {
        total: schedules.length,
      });
    } catch (error: any) {
      logger.error('Get Schedules Error:', error);
      sendError(res, 'Failed to fetch schedules', 500, 'SCHEDULE_FETCH_ERROR');
    }
  }

  public static async getScheduleById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const schedule = await Schedule.findOne({
        _id: id,
        firebaseUid: req.firebaseUid,
      }).populate('outfit');

      if (!schedule) {
        sendError(res, 'Schedule not found', 404, 'NOT_FOUND');
        return;
      }

      sendSuccess(res, schedule, 'Schedule retrieved successfully');
    } catch (error: any) {
      logger.error('Get Schedule Error:', error);
      sendError(res, 'Failed to fetch schedule', 500, 'FETCH_ERROR');
    }
  }

  public static async createSchedule(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { outfitId, occasion, scheduleDate, scheduleTime, notes, reminderInterval } = req.body;
      const firebaseUid = req.firebaseUid!;

      const outfit = await Outfit.findOne({
        $or: [{ outfitId }, { _id: outfitId.match(/^[0-9a-fA-F]{24}$/) ? outfitId : null }],
      });

      if (!outfit) {
        sendError(res, 'Outfit not found', 404, 'NOT_FOUND');
        return;
      }

      const targetDate = new Date(scheduleDate);
      let reminderDate = new Date(targetDate);

      if (reminderInterval === '1 day before') {
        reminderDate.setDate(reminderDate.getDate() - 1);
      } else if (reminderInterval === '12 hours before') {
        reminderDate.setHours(reminderDate.getHours() - 12);
      } else if (reminderInterval === '2 hours before') {
        reminderDate.setHours(reminderDate.getHours() - 2);
      }

      const newSchedule = await Schedule.create({
        userId: req.user?._id,
        firebaseUid,
        outfit: outfit._id,
        occasion,
        scheduleDate: targetDate,
        scheduleTime: scheduleTime || '09:00 AM',
        notes: notes || '',
        reminderInterval: reminderInterval || '1 day before',
        reminderDate,
        notificationSent: false,
      });

      const populated = await newSchedule.populate('outfit');
      sendSuccess(res, populated, 'Outfit scheduled successfully', 201);
    } catch (error: any) {
      logger.error('Create Schedule Error:', error);
      sendError(res, 'Failed to schedule outfit', 500, 'SCHEDULE_CREATE_ERROR');
    }
  }

  public static async updateSchedule(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updated = await Schedule.findOneAndUpdate(
        { _id: id, firebaseUid: req.firebaseUid },
        updateData,
        { new: true }
      ).populate('outfit');

      if (!updated) {
        sendError(res, 'Schedule not found', 404, 'NOT_FOUND');
        return;
      }

      sendSuccess(res, updated, 'Schedule updated successfully');
    } catch (error: any) {
      logger.error('Update Schedule Error:', error);
      sendError(res, 'Failed to update schedule', 500, 'UPDATE_ERROR');
    }
  }

  public static async deleteSchedule(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await Schedule.deleteOne({ _id: id, firebaseUid: req.firebaseUid });
      sendSuccess(res, { deleted: true, id }, 'Schedule deleted successfully');
    } catch (error: any) {
      logger.error('Delete Schedule Error:', error);
      sendError(res, 'Failed to delete schedule', 500, 'DELETE_ERROR');
    }
  }
}
