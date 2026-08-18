import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { RecommendationService } from '../services/recommendation.service';
import { WeatherService } from '../integrations/weather/weather.service';
import { sendSuccess, sendError } from '../utils/response';
import { logger } from '../utils/logger';

export class RecommendationController {
  public static async getRecommendations(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { occasion, style, budget, weather, temperature, gender, limit } = req.query;

      let weatherCondition = (weather as string) || undefined;
      let temp = temperature ? parseFloat(temperature as string) : undefined;

      // Auto-fetch weather if not provided
      if (!weatherCondition) {
        const liveWeather = await WeatherService.getCurrentWeather();
        weatherCondition = liveWeather.condition;
        temp = liveWeather.temperature;
      }

      const result = await RecommendationService.getRecommendations({
        userId: req.user?._id?.toString(),
        firebaseUid: req.firebaseUid,
        occasion: occasion as string,
        style: style as string,
        budgetCategory: budget as string,
        weatherCondition,
        temperature: temp,
        gender: gender as string,
        limit: limit ? parseInt(limit as string, 10) : 12,
      });

      sendSuccess(
        res,
        result.recommendations,
        'Personalized outfit recommendations retrieved successfully',
        200,
        {
          userAnalysis: result.userAnalysisSummary,
          weatherSnapshot: result.weatherSnapshot,
          total: result.recommendations.length,
        }
      );
    } catch (error: any) {
      logger.error('Get Recommendations Error:', error);
      sendError(res, 'Failed to generate recommendations', 500, 'RECOMMENDATION_ERROR');
    }
  }

  public static async getRecommendationById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await RecommendationService.getRecommendations({
        firebaseUid: req.firebaseUid,
        limit: 20,
      });

      const outfit = result.recommendations.find((r) => r.outfitId === id || r._id.toString() === id);
      if (!outfit) {
        sendError(res, 'Outfit recommendation not found', 404, 'NOT_FOUND');
        return;
      }

      sendSuccess(res, outfit, 'Outfit recommendation retrieved successfully');
    } catch (error: any) {
      logger.error('Get Recommendation By ID Error:', error);
      sendError(res, 'Failed to fetch recommendation', 500, 'FETCH_ERROR');
    }
  }
}
