import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendation.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateQuery } from '../middleware/validator.middleware';
import { RecommendationQuerySchema } from '../validators/schemas';

const router = Router();

router.get('/', authenticate, validateQuery(RecommendationQuerySchema), RecommendationController.getRecommendations);
router.post('/', authenticate, RecommendationController.getRecommendations);
router.get('/:id', authenticate, RecommendationController.getRecommendationById);

export default router;
