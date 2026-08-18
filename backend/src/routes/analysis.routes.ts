import { Router } from 'express';
import { AnalysisController } from '../controllers/analysis.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validator.middleware';
import { UserAnalysisEditSchema } from '../validators/schemas';

const router = Router();

router.post('/', authenticate, AnalysisController.analyzeUserPhoto);
router.get('/', authenticate, AnalysisController.getLatestAnalysis);
router.put('/', authenticate, validateBody(UserAnalysisEditSchema.partial()), AnalysisController.updateAnalysisCorrections);

export default router;
