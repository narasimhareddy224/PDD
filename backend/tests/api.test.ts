import request from 'supertest';
import app from '../src/app';
import { AIService } from '../src/integrations/ai/ai.service';
import { ShoppingService } from '../src/integrations/shopping/shopping.service';
import { WeatherService } from '../src/integrations/weather/weather.service';

describe('NextFit AI Backend REST API Test Suite', () => {
  const mockToken = 'mock-token-test-user-999';

  describe('1. System & Health Check Endpoints', () => {
    it('GET / should return 200 and API metadata', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.service).toContain('NextFit AI');
    });

    it('GET /health should return 200 and operational status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('healthy');
    });
  });

  describe('2. AI Vision & Stylist Service Tests', () => {
    it('should analyze image characteristics and return valid skin tone and body type', async () => {
      const analysis = await AIService.analyzeImage('https://example.com/test-photo.jpg');
      expect(analysis).toHaveProperty('skinTone');
      expect(analysis).toHaveProperty('bodyType');
      expect(analysis).toHaveProperty('fitnessLevel');
      expect(analysis).toHaveProperty('style');
      expect(analysis.confidence).toBeGreaterThanOrEqual(0.8);
      expect(analysis.recommendedColorPalette.length).toBeGreaterThan(0);
    });

    it('should generate personalized fashion stylist chat responses for interview', async () => {
      const response = await AIService.generateStylistResponse('What should I wear for an interview?', {
        userName: 'Alex',
        skinTone: 'Medium',
      });
      expect(response.reply).toContain('interview');
      expect(response.suggestedProducts.length).toBeGreaterThan(0);
    });
  });

  describe('3. Multi-Platform Shopping & Price Comparison Tests', () => {
    it('should search products from verified feeds without fabricating data', async () => {
      const products = await ShoppingService.searchProducts({ searchTerm: 'Oxford' });
      expect(Array.isArray(products)).toBe(true);
      if (products.length > 0) {
        expect(products[0]).toHaveProperty('platform');
        expect(products[0]).toHaveProperty('price');
        expect(products[0]).toHaveProperty('productUrl');
        expect(products[0].isVerifiedPrice).toBe(true);
      }
    });

    it('should calculate lowest verified price among Amazon, Flipkart, Myntra, Ajio', async () => {
      const comparison = await ShoppingService.compareProductPrices('Oxford Shirt', 'Top');
      expect(comparison).toHaveProperty('platformPrices');
      expect(comparison.platformPrices).toHaveProperty('Amazon');
      expect(comparison.platformPrices).toHaveProperty('Flipkart');
      expect(comparison.platformPrices).toHaveProperty('Myntra');
      expect(comparison.platformPrices).toHaveProperty('Ajio');
      if (comparison.lowestVerifiedPrice) {
        expect(comparison.lowestVerifiedPrice.price).toBeLessThanOrEqual(
          comparison.platformPrices.Amazon.price || Infinity
        );
      }
    });

    it('GET /api/shopping/compare should return comparison result', async () => {
      const res = await request(app).get('/api/shopping/compare?title=Oxford%20Shirt');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.platformPrices).toBeDefined();
    });
  });

  describe('4. Weather Integration Tests', () => {
    it('GET /api/weather should return weather condition and styling advice', async () => {
      const res = await request(app).get('/api/weather?city=Mumbai');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('temperature');
      expect(res.body.data).toHaveProperty('stylingAdvice');
      expect(res.body.data.recommendedFabrics.length).toBeGreaterThan(0);
    });
  });

  describe('5. Auth & User Profile Protected Endpoints', () => {
    it('GET /api/users/me should reject unauthenticated requests', async () => {
      const res = await request(app).get('/api/users/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('UNAUTHORIZED');
    });

    it('POST /api/auth/sync should succeed with bearer token', async () => {
      const res = await request(app)
        .post('/api/auth/sync')
        .set('Authorization', `Bearer ${mockToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('user');
    });
  });

  describe('6. Assistant Chat Endpoint', () => {
    it('POST /api/assistant/chat should respond with fashion recommendations', async () => {
      const res = await request(app)
        .post('/api/assistant/chat')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          message: 'What should I wear to a wedding tomorrow?',
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('reply');
      expect(res.body.data.suggestedOutfits.length).toBeGreaterThan(0);
    });
  });
});
