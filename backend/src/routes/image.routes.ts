import { Router } from 'express';
import { ImageController, uploadMiddleware } from '../controllers/image.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/upload', authenticate, uploadMiddleware.single('image'), ImageController.uploadPhoto);
router.delete('/:imageId', authenticate, ImageController.deletePhoto);

export default router;
