import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validator.middleware';
import { UserProfileSchema } from '../validators/schemas';

const router = Router();

router.get('/me', authenticate, UserController.getProfile);
router.put('/me', authenticate, validateBody(UserProfileSchema.partial()), UserController.updateProfile);
router.delete('/me', authenticate, UserController.deleteAccount);

export default router;
