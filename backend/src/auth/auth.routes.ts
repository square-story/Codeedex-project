import { Router } from 'express';
import { authController } from './auth.controller';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.post('/login', authController.login);
router.get('/me', requireAuth, authController.me);

export default router;
