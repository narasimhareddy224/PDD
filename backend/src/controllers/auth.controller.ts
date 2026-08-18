import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { User } from '../models/User';
import { UserProfile } from '../models/UserProfile';
import { sendSuccess, sendError } from '../utils/response';
import { logger } from '../utils/logger';

export class AuthController {
  public static async syncUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { user, firebaseUid } = req;
      if (!user) {
        sendError(res, 'User not authenticated', 401, 'UNAUTHORIZED');
        return;
      }

      let profile = null;
      if (require('mongoose').connection.readyState === 1) {
        profile = await UserProfile.findOne({ firebaseUid });
      } else {
        profile = {
          name: user.name,
          email: user.email,
          gender: 'prefer-not-to-say',
          preferredStyles: ['Smart Casual'],
          preferredColors: ['Navy Blue', 'Black', 'White'],
        };
      }

      sendSuccess(res, {
        user,
        profile,
      }, 'User session verified successfully');
    } catch (error: any) {
      logger.error('Sync User Error:', error);
      sendError(res, 'Failed to synchronize user session', 500, 'AUTH_SYNC_ERROR');
    }
  }

  public static async updateFcmToken(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { fcmToken } = req.body;
      if (!fcmToken) {
        sendError(res, 'FCM token is required', 400, 'MISSING_FCM_TOKEN');
        return;
      }

      await User.findOneAndUpdate({ firebaseUid: req.firebaseUid }, { fcmToken });
      sendSuccess(res, { updated: true }, 'FCM token registered successfully');
    } catch (error: any) {
      logger.error('Update FCM Token Error:', error);
      sendError(res, 'Failed to update push token', 500, 'FCM_UPDATE_ERROR');
    }
  }
}
