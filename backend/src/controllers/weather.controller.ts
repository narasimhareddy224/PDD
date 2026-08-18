import { Request, Response } from 'express';
import { WeatherService } from '../integrations/weather/weather.service';
import { sendSuccess, sendError } from '../utils/response';
import { logger } from '../utils/logger';

export class WeatherController {
  public static async getWeather(req: Request, res: Response): Promise<void> {
    try {
      const { lat, lon, city } = req.query;

      const latitude = lat ? parseFloat(lat as string) : 28.6139;
      const longitude = lon ? parseFloat(lon as string) : 77.2090;
      const cityName = (city as string) || 'New Delhi';

      const weather = await WeatherService.getCurrentWeather(latitude, longitude, cityName);
      sendSuccess(res, weather, 'Live weather and styling advice retrieved successfully');
    } catch (error: any) {
      logger.error('Weather Controller Error:', error);
      sendError(res, 'Failed to fetch weather information', 500, 'WEATHER_ERROR');
    }
  }
}
