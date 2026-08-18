import { Request, Response } from 'express';
import { ShoppingService } from '../integrations/shopping/shopping.service';
import { ProductCategory, ShoppingPlatform } from '../models/ShoppingProduct';
import { sendSuccess, sendError } from '../utils/response';
import { logger } from '../utils/logger';

export class ShoppingController {
  public static async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const { query, category, platform, maxPrice } = req.query;

      const products = await ShoppingService.searchProducts({
        searchTerm: query as string,
        category: category as ProductCategory,
        platform: platform as ShoppingPlatform,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      });

      sendSuccess(res, products, 'Matching products retrieved from verified feeds', 200, {
        total: products.length,
      });
    } catch (error: any) {
      logger.error('Shopping Search Error:', error);
      sendError(res, 'Failed to search products', 500, 'SEARCH_ERROR');
    }
  }

  public static async comparePrices(req: Request, res: Response): Promise<void> {
    try {
      const { title, category } = req.query;
      if (!title) {
        sendError(res, 'Product title or query is required for price comparison', 400, 'MISSING_TITLE');
        return;
      }

      const comparison = await ShoppingService.compareProductPrices(
        title as string,
        category as ProductCategory
      );

      sendSuccess(res, comparison, 'Multi-platform price comparison computed successfully');
    } catch (error: any) {
      logger.error('Shopping Comparison Error:', error);
      sendError(res, 'Failed to compare platform prices', 500, 'COMPARISON_ERROR');
    }
  }

  public static async getBestPrice(req: Request, res: Response): Promise<void> {
    try {
      const { title, category } = req.query;
      if (!title) {
        sendError(res, 'Product title is required', 400, 'MISSING_TITLE');
        return;
      }

      const comparison = await ShoppingService.compareProductPrices(
        title as string,
        category as ProductCategory
      );

      if (!comparison.lowestVerifiedPrice) {
        sendSuccess(res, {
          available: false,
          message: 'Exact match price unavailable across connected platforms.',
        });
        return;
      }

      sendSuccess(
        res,
        {
          productTitle: comparison.productTitle,
          bestPrice: comparison.lowestVerifiedPrice,
          allPlatforms: comparison.platformPrices,
        },
        'Lowest verified price found'
      );
    } catch (error: any) {
      logger.error('Best Price Error:', error);
      sendError(res, 'Failed to retrieve best price', 500, 'BEST_PRICE_ERROR');
    }
  }
}
