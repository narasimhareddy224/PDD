import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ChatHistory } from '../models/ChatHistory';
import { UserProfile } from '../models/UserProfile';
import { UserAnalysis } from '../models/UserAnalysis';
import { AIService } from '../integrations/ai/ai.service';
import { WeatherService } from '../integrations/weather/weather.service';
import { sendSuccess, sendError } from '../utils/response';
import { logger } from '../utils/logger';

export class AssistantController {
  public static async sendMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { message, context } = req.body;
      const firebaseUid = req.firebaseUid!;

      let profile: any = null;
      let analysis: any = null;

      if (require('mongoose').connection.readyState === 1) {
        profile = await UserProfile.findOne({ firebaseUid });
        analysis = await UserAnalysis.findOne({ firebaseUid });
      }

      // Weather data
      let weatherCond = context?.weather;
      let temp = context?.temperature;
      if (!weatherCond) {
        const liveWeather = await WeatherService.getCurrentWeather();
        weatherCond = liveWeather.condition;
        temp = liveWeather.temperature;
      }

      // Generate Stylist response
      const stylistResponse = await AIService.generateStylistResponse(message, {
        userName: profile?.name,
        skinTone: analysis?.skinTone,
        bodyType: analysis?.bodyType,
        preferredColors: profile?.preferredColors,
        weather: weatherCond,
        temperature: temp,
        occasion: context?.occasion,
      });

      // Update or create chat history if database connected
      let messagesList: any[] = [];
      if (require('mongoose').connection.readyState === 1) {
        const history = await ChatHistory.findOneAndUpdate(
          { firebaseUid },
          {
            userId: req.user?._id,
            firebaseUid,
            $push: {
              messages: [
                {
                  sender: 'user',
                  text: message,
                  timestamp: new Date(),
                },
                {
                  sender: 'assistant',
                  text: stylistResponse.reply,
                  timestamp: new Date(),
                  outfitSuggestions: stylistResponse.suggestedOutfits,
                  productSuggestions: stylistResponse.suggestedProducts,
                  weatherSnapshot: `${weatherCond} (${temp || 26}°C)`,
                },
              ],
            },
          },
          { upsert: true, new: true }
        );
        messagesList = history?.messages || [];
      } else {
        messagesList = [
          { sender: 'user', text: message, timestamp: new Date() },
          {
            sender: 'assistant',
            text: stylistResponse.reply,
            timestamp: new Date(),
            outfitSuggestions: stylistResponse.suggestedOutfits,
            productSuggestions: stylistResponse.suggestedProducts,
          },
        ];
      }

      sendSuccess(
        res,
        {
          reply: stylistResponse.reply,
          suggestedOutfits: stylistResponse.suggestedOutfits,
          suggestedProducts: stylistResponse.suggestedProducts,
          chatHistory: messagesList,
        },
        'AI stylist response generated successfully'
      );
    } catch (error: any) {
      logger.error('Assistant Chat Error:', error);
      sendError(res, 'Failed to process AI chat message', 500, 'ASSISTANT_ERROR');
    }
  }

  public static async getChatHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const firebaseUid = req.firebaseUid!;
      const history = await ChatHistory.findOne({ firebaseUid });

      sendSuccess(
        res,
        history ? history.messages : [],
        'Chat history retrieved successfully'
      );
    } catch (error: any) {
      logger.error('Get Chat History Error:', error);
      sendError(res, 'Failed to fetch chat history', 500, 'HISTORY_FETCH_ERROR');
    }
  }
}
