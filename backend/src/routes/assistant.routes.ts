import { Router } from 'express';
import { AssistantController } from '../controllers/assistant.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validator.middleware';
import { ChatMessageSchema } from '../validators/schemas';

const router = Router();

router.post('/chat', authenticate, validateBody(ChatMessageSchema), AssistantController.sendMessage);
router.get('/history', authenticate, AssistantController.getChatHistory);

export default router;
