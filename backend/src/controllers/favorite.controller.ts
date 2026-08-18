import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Favorite } from '../models/Favorite';
import { Outfit } from '../models/Outfit';
import { sendSuccess, sendError } from '../utils/response';
import { logger } from '../utils/logger';

export class FavoriteController {
  public static async getFavorites(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const firebaseUid = req.firebaseUid!;
      const favorites = await Favorite.find({ firebaseUid })
        .populate('outfit')
        .sort({ createdAt: -1 });

      sendSuccess(res, favorites, 'Favorites retrieved successfully', 200, {
        total: favorites.length,
      });
    } catch (error: any) {
      logger.error('Get Favorites Error:', error);
      sendError(res, 'Failed to fetch favorites', 500, 'FAVORITES_FETCH_ERROR');
    }
  }

  public static async addFavorite(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { outfitId } = req.params;
      const { notes, tags } = req.body;
      const firebaseUid = req.firebaseUid!;

      const outfit = await Outfit.findOne({
        $or: [{ outfitId }, { _id: outfitId.match(/^[0-9a-fA-F]{24}$/) ? outfitId : null }],
      });

      if (!outfit) {
        sendError(res, 'Outfit not found', 404, 'NOT_FOUND');
        return;
      }

      const favorite = await Favorite.findOneAndUpdate(
        { firebaseUid, outfit: outfit._id },
        {
          userId: req.user?._id,
          firebaseUid,
          outfit: outfit._id,
          notes: notes || '',
          tags: tags || [],
        },
        { upsert: true, new: true }
      ).populate('outfit');

      sendSuccess(res, favorite, 'Outfit added to favorites', 201);
    } catch (error: any) {
      logger.error('Add Favorite Error:', error);
      sendError(res, 'Failed to favorite outfit', 500, 'FAVORITE_ERROR');
    }
  }

  public static async removeFavorite(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { outfitId } = req.params;
      const firebaseUid = req.firebaseUid!;

      const outfit = await Outfit.findOne({
        $or: [{ outfitId }, { _id: outfitId.match(/^[0-9a-fA-F]{24}$/) ? outfitId : null }],
      });

      await Favorite.deleteOne({
        firebaseUid,
        ...(outfit ? { outfit: outfit._id } : { _id: outfitId }),
      });

      sendSuccess(res, { removed: true, outfitId }, 'Outfit removed from favorites');
    } catch (error: any) {
      logger.error('Remove Favorite Error:', error);
      sendError(res, 'Failed to remove favorite', 500, 'REMOVE_FAVORITE_ERROR');
    }
  }
}
