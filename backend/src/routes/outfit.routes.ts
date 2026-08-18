import { Router } from 'express';
import { OutfitController } from '../controllers/outfit.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', OutfitController.getAllOutfits);
router.get('/:id', OutfitController.getOutfitById);
router.post('/', authenticate, OutfitController.createOutfit);
router.put('/:id', authenticate, OutfitController.updateOutfit);
router.delete('/:id', authenticate, OutfitController.deleteOutfit);

export default router;
