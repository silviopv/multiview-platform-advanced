import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import * as streamController from '../controllers/streamController';

const router = Router();

router.use(authenticate);

router.get('/', streamController.getStreams);
router.get('/:id', streamController.getStream);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('url').notEmpty().withMessage('URL é obrigatória'),
    body('protocol').isIn(['SRT', 'RTMP', 'RTMPS', 'RTSP', 'HLS']).withMessage('Protocolo inválido'),
  ],
  validate,
  streamController.createStream
);

router.put('/:id', streamController.updateStream);
router.delete('/:id', streamController.deleteStream);
router.post('/reorder', streamController.reorderStreams);

export default router;
