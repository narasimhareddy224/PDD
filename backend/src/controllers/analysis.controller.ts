import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { UserAnalysis } from '../models/UserAnalysis';
import { UserProfile } from '../models/UserProfile';
import { AIService } from '../integrations/ai/ai.service';
import { sendSuccess, sendError } from '../utils/response';
import { logger } from '../utils/logger';

export class AnalysisController {
  public static async analyzeUserPhoto(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { photoUrl } = req.body;
      if (!photoUrl) {
        sendError(res, 'Photo URL or base64 image data is required', 400, 'MISSING_PHOTO_URL');
        return;
      }

      const firebaseUid = req.firebaseUid!;
      const profile = await UserProfile.findOne({ firebaseUid });

      // Run AI Vision Engine
      const aiResult = await AIService.analyzeImage(photoUrl, {
        gender: profile?.gender,
        height: profile?.height,
        weight: profile?.weight,
      });

      // Save analysis record in MongoDB
      const analysisRecord = await UserAnalysis.findOneAndUpdate(
        { firebaseUid },
        {
          userId: req.user?._id,
          firebaseUid,
          photoUrl,
          skinTone: aiResult.skinTone,
          bodyType: aiResult.bodyType,
          fitnessLevel: aiResult.fitnessLevel,
          style: aiResult.style,
          confidence: aiResult.confidence,
          undertone: aiResult.undertone,
          recommendedColorPalette: aiResult.recommendedColorPalette,
          contrastRecommendation: aiResult.contrastRecommendation,
          bodyTypeStylingTips: aiResult.bodyTypeStylingTips,
          userEdits: false,
          originalAiPrediction: {
            skinTone: aiResult.skinTone,
            bodyType: aiResult.bodyType,
            fitnessLevel: aiResult.fitnessLevel,
            style: aiResult.style,
            confidence: aiResult.confidence,
          },
          disclaimer: 'AI visual analysis provides approximate stylistic suggestions and is not a medical or scientifically definitive conclusion.',
          analyzedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      sendSuccess(res, analysisRecord, 'Photo analyzed successfully by AI engine', 201);
    } catch (error: any) {
      logger.error('Analysis Error:', error);
      sendError(res, 'Failed to analyze photo', 500, 'ANALYSIS_ERROR');
    }
  }

  public static async getLatestAnalysis(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const firebaseUid = req.firebaseUid!;
      const analysis = await UserAnalysis.findOne({ firebaseUid }).sort({ createdAt: -1 });

      if (!analysis) {
        sendSuccess(res, null, 'No photo analysis found for user');
        return;
      }

      sendSuccess(res, analysis, 'Analysis record retrieved successfully');
    } catch (error: any) {
      logger.error('Get Analysis Error:', error);
      sendError(res, 'Failed to retrieve analysis', 500, 'ANALYSIS_FETCH_ERROR');
    }
  }

  public static async updateAnalysisCorrections(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const firebaseUid = req.firebaseUid!;
      const { skinTone, bodyType, fitnessLevel, style, undertone } = req.body;

      const analysis = await UserAnalysis.findOneAndUpdate(
        { firebaseUid },
        {
          ...(skinTone ? { skinTone } : {}),
          ...(bodyType ? { bodyType } : {}),
          ...(fitnessLevel ? { fitnessLevel } : {}),
          ...(style ? { style } : {}),
          ...(undertone ? { undertone } : {}),
          userEdits: true,
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (!analysis) {
        sendError(res, 'No existing analysis to update', 404, 'NOT_FOUND');
        return;
      }

      sendSuccess(res, analysis, 'Analysis preferences updated successfully');
    } catch (error: any) {
      logger.error('Update Analysis Error:', error);
      sendError(res, 'Failed to update analysis', 500, 'ANALYSIS_UPDATE_ERROR');
    }
  }
}
