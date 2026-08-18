import { Router } from 'express';
import { FavoriteController } from '../controllers/favorite.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, FavoriteController.getFavorites);
router.post('/:outfitId', authenticate, FavoriteController.addFavorite);
router.delete('/:outfitId', authenticate, FavoriteController.removeFavorite);

export default router;
