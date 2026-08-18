import { Request, Response } from 'express';
import { Outfit } from '../models/Outfit';
import { sendSuccess, sendError } from '../utils/response';
import { logger } from '../utils/logger';

export class OutfitController {
  public static async getAllOutfits(req: Request, res: Response): Promise<void> {
    try {
      const { occasion, style, search, gender } = req.query;
      const query: any = {};

      if (occasion && occasion !== 'all') {
        query.occasion = { $regex: new RegExp(occasion as string, 'i') };
      }
      if (style && style !== 'all') {
        query.style = { $regex: new RegExp(style as string, 'i') };
      }
      if (gender && gender !== 'all') {
        query.gender = gender;
      }
      if (search) {
        query.$or = [
          { title: { $regex: new RegExp(search as string, 'i') } },
          { description: { $regex: new RegExp(search as string, 'i') } },
          { tags: { $in: [new RegExp(search as string, 'i')] } },
        ];
      }

      const outfits = await Outfit.find(query).sort({ createdAt: -1 });
      sendSuccess(res, outfits, 'Outfits retrieved successfully', 200, { count: outfits.length });
    } catch (error: any) {
      logger.error('Get Outfits Error:', error);
      sendError(res, 'Failed to fetch outfits', 500, 'OUTFIT_FETCH_ERROR');
    }
  }

  public static async getOutfitById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const outfit = await Outfit.findOne({
        $or: [{ outfitId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
      });

      if (!outfit) {
        sendError(res, 'Outfit not found', 404, 'OUTFIT_NOT_FOUND');
        return;
      }

      sendSuccess(res, outfit, 'Outfit retrieved successfully');
    } catch (error: any) {
      logger.error('Get Outfit By ID Error:', error);
      sendError(res, 'Failed to retrieve outfit', 500, 'FETCH_ERROR');
    }
  }

  public static async createOutfit(req: Request, res: Response): Promise<void> {
    try {
      const newOutfit = await Outfit.create(req.body);
      sendSuccess(res, newOutfit, 'Outfit created successfully', 201);
    } catch (error: any) {
      logger.error('Create Outfit Error:', error);
      sendError(res, 'Failed to create outfit', 400, 'CREATION_ERROR');
    }
  }

  public static async updateOutfit(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await Outfit.findOneAndUpdate(
        { $or: [{ outfitId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        req.body,
        { new: true }
      );

      if (!updated) {
        sendError(res, 'Outfit not found', 404, 'NOT_FOUND');
        return;
      }

      sendSuccess(res, updated, 'Outfit updated successfully');
    } catch (error: any) {
      logger.error('Update Outfit Error:', error);
      sendError(res, 'Failed to update outfit', 500, 'UPDATE_ERROR');
    }
  }

  public static async deleteOutfit(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await Outfit.deleteOne({
        $or: [{ outfitId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
      });
      sendSuccess(res, { deleted: true }, 'Outfit deleted successfully');
    } catch (error: any) {
      logger.error('Delete Outfit Error:', error);
      sendError(res, 'Failed to delete outfit', 500, 'DELETE_ERROR');
    }
  }
}
