import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import * as recordingController from '../controllers/recordingController';

const router = Router();

router.use(authenticate);

router.get('/', recordingController.getRecordings);

router.post(
  '/',
  [
    body('streamId').notEmpty().withMessage('Stream ID é obrigatório'),
  ],
  validate,
  recordingController.createRecording
);

router.post('/:id/stop', recordingController.stopRecording);
router.delete('/:id', recordingController.deleteRecording);

export default router;
