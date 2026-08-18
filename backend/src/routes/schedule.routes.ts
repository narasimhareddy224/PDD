import { Router } from 'express';
import { ScheduleController } from '../controllers/schedule.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validator.middleware';
import { CreateScheduleSchema } from '../validators/schemas';

const router = Router();

router.get('/', authenticate, ScheduleController.getSchedules);
router.post('/', authenticate, validateBody(CreateScheduleSchema), ScheduleController.createSchedule);
router.get('/:id', authenticate, ScheduleController.getScheduleById);
router.put('/:id', authenticate, ScheduleController.updateSchedule);
router.delete('/:id', authenticate, ScheduleController.deleteSchedule);

export default router;
