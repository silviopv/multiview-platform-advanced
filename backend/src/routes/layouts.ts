import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import * as layoutController from '../controllers/layoutController';

const router = Router();

router.use(authenticate);

router.get('/', layoutController.getLayouts);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('grid').notEmpty().withMessage('Grid é obrigatório'),
  ],
  validate,
  layoutController.createLayout
);

router.put('/:id', layoutController.updateLayout);
router.delete('/:id', layoutController.deleteLayout);

export default router;
