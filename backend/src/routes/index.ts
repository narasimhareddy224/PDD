import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import imageRoutes from './image.routes';
import analysisRoutes from './analysis.routes';
import recommendationRoutes from './recommendation.routes';
import outfitRoutes from './outfit.routes';
import favoriteRoutes from './favorite.routes';
import scheduleRoutes from './schedule.routes';
import shoppingRoutes from './shopping.routes';
import assistantRoutes from './assistant.routes';
import weatherRoutes from './weather.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/images', imageRoutes);
router.use('/analysis', analysisRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/outfits', outfitRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/shopping', shoppingRoutes);
router.use('/assistant', assistantRoutes);
router.use('/weather', weatherRoutes);

export default router;
