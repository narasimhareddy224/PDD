import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { User } from '../models/User';
import { UserProfile } from '../models/UserProfile';
import { UserPreference } from '../models/UserPreference';
import { sendSuccess, sendError } from '../utils/response';
import { logger } from '../utils/logger';

export class UserController {
  public static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const firebaseUid = req.firebaseUid!;
      const profile = await UserProfile.findOne({ firebaseUid });
      const preference = await UserPreference.findOne({ firebaseUid });

      sendSuccess(
        res,
        {
          user: req.user,
          profile,
          preference,
        },
        'User profile retrieved successfully'
      );
    } catch (error: any) {
      logger.error('Get Profile Error:', error);
      sendError(res, 'Failed to fetch user profile', 500, 'PROFILE_FETCH_ERROR');
    }
  }

  public static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const firebaseUid = req.firebaseUid!;
      const updateData = req.body;

      // Update User details
      if (updateData.name || updateData.phone || updateData.profileImage) {
        await User.findOneAndUpdate(
          { firebaseUid },
          {
            ...(updateData.name ? { name: updateData.name } : {}),
            ...(updateData.phone ? { phone: updateData.phone } : {}),
            ...(updateData.profileImage ? { profileImage: updateData.profileImage } : {}),
          }
        );
      }

      // Update or create UserProfile
      const profile = await UserProfile.findOneAndUpdate(
        { firebaseUid },
        { ...updateData, updatedAt: new Date() },
        { new: true, upsert: true }
      );

      // Sync preference defaults
      if (updateData.preferredColors || updateData.preferredStyles || updateData.budget) {
        await UserPreference.findOneAndUpdate(
          { firebaseUid },
          {
            userId: req.user?._id,
            firebaseUid,
            ...(updateData.preferredColors ? { colors: updateData.preferredColors } : {}),
            ...(updateData.preferredStyles ? { styles: updateData.preferredStyles } : {}),
            ...(updateData.preferredBrands ? { brands: updateData.preferredBrands } : {}),
            ...(updateData.budget ? { budgetCategory: updateData.budget } : {}),
          },
          { upsert: true }
        );
      }

      sendSuccess(res, profile, 'User profile updated successfully');
    } catch (error: any) {
      logger.error('Update Profile Error:', error);
      sendError(res, 'Failed to update profile', 500, 'PROFILE_UPDATE_ERROR');
    }
  }

  public static async deleteAccount(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const firebaseUid = req.firebaseUid!;
      await User.deleteOne({ firebaseUid });
      await UserProfile.deleteOne({ firebaseUid });
      await UserPreference.deleteOne({ firebaseUid });

      sendSuccess(res, { deleted: true }, 'User account deleted successfully');
    } catch (error: any) {
      logger.error('Delete Account Error:', error);
      sendError(res, 'Failed to delete account', 500, 'ACCOUNT_DELETE_ERROR');
    }
  }
}
