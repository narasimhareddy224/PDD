import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import apiRoutes from './routes';
import { swaggerDocument } from './config/swagger';
import { errorHandler } from './middleware/error.middleware';
import { sendSuccess, sendError } from './utils/response';

const app: Application = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200', '*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  })
);

// HTTP request logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsers with payload limits
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    errorCode: 'RATE_LIMIT_EXCEEDED',
  },
});
app.use('/api', limiter);

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root health check endpoint
app.get('/', (_req: Request, res: Response) => {
  sendSuccess(res, {
    status: 'ONLINE',
    service: 'NextFit AI Backend REST API',
    version: '1.0.0',
    documentation: '/api-docs',
    timestamp: new Date(),
  }, 'Welcome to NextFit AI API');
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  sendSuccess(res, { status: 'healthy', uptime: process.uptime() }, 'Service is operational');
});

// Mount modular API Routes
app.use('/api', apiRoutes);

// Catch-all 404 Route
app.use('*', (req: Request, res: Response) => {
  sendError(res, `Route ${req.originalUrl} not found on this server`, 404, 'NOT_FOUND');
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
