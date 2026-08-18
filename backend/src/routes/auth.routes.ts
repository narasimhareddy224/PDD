import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/sync', authenticate, AuthController.syncUser);
router.post('/fcm-token', authenticate, AuthController.updateFcmToken);

export default router;
