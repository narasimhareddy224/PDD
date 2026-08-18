export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'NextFit AI - Fashion Recommendation REST API',
    version: '1.0.0',
    description: 'API documentation for NextFit AI - AI-Powered Personal Fashion Recommendation Application',
    contact: {
      name: 'NextFit AI Team',
      email: 'support@nextfit.ai',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT / Firebase ID Token',
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'object' },
          errorCode: { type: 'string' },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          firebaseUid: { type: 'string' },
          email: { type: 'string' },
          name: { type: 'string' },
          profileImage: { type: 'string' },
        },
      },
      Outfit: {
        type: 'object',
        properties: {
          outfitId: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          occasion: { type: 'string' },
          style: { type: 'string' },
          matchScore: { type: 'number' },
          image: { type: 'string' },
          top: { type: 'object' },
          bottom: { type: 'object' },
          footwear: { type: 'object' },
          accessories: { type: 'object' },
        },
      },
    },
  },
  security: [{ BearerAuth: [] }],
  paths: {
    '/users/me': {
      get: {
        summary: 'Get current user profile and preferences',
        responses: { 200: { description: 'Profile details retrieved' } },
      },
      put: {
        summary: 'Update current user profile and preferences',
        responses: { 200: { description: 'Profile updated successfully' } },
      },
    },
    '/images/upload': {
      post: {
        summary: 'Upload user photo to Firebase Storage',
        responses: { 201: { description: 'Photo uploaded successfully' } },
      },
    },
    '/analysis': {
      post: {
        summary: 'Analyze uploaded photo using AI Vision engine',
        responses: { 201: { description: 'Analysis completed' } },
      },
      get: {
        summary: 'Get latest photo analysis',
        responses: { 200: { description: 'Analysis record' } },
      },
      put: {
        summary: 'Manually edit/correct AI analysis results',
        responses: { 200: { description: 'Analysis updated' } },
      },
    },
    '/recommendations': {
      get: {
        summary: 'Get personalized outfit recommendations with filters',
        parameters: [
          { name: 'occasion', in: 'query', schema: { type: 'string' } },
          { name: 'budget', in: 'query', schema: { type: 'string' } },
          { name: 'weather', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'List of scored outfit recommendations' } },
      },
    },
    '/shopping/search': {
      get: {
        summary: 'Search products across Amazon, Flipkart, Myntra, and Ajio feeds',
        responses: { 200: { description: 'Verified products list' } },
      },
    },
    '/shopping/compare': {
      get: {
        summary: 'Compare multi-platform verified prices and lowest price tag',
        responses: { 200: { description: 'Price comparison breakdown' } },
      },
    },
    '/schedules': {
      get: { summary: 'Get scheduled outfits', responses: { 200: { description: 'Scheduled events' } } },
      post: { summary: 'Schedule outfit with reminders', responses: { 201: { description: 'Schedule created' } } },
    },
    '/favorites': {
      get: { summary: 'Get saved favorite outfits', responses: { 200: { description: 'Favorites list' } } },
    },
    '/assistant/chat': {
      post: {
        summary: 'Chat with AI Fashion Stylist assistant',
        responses: { 200: { description: 'AI conversational stylist response' } },
      },
    },
    '/weather': {
      get: {
        summary: 'Get current weather and fabric styling advice',
        responses: { 200: { description: 'Weather and recommendations' } },
      },
    },
  },
};
