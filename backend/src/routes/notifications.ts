import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as notificationController from '../controllers/notificationController';

const router = Router();

router.use(authenticate);

router.get('/', notificationController.getNotifications);
router.post('/read', notificationController.markAsRead);
router.post('/delete', notificationController.deleteNotifications);

export default router;
