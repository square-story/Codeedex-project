import { Router } from 'express';
import { userController } from './user.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requirePermission } from '../middleware/requirePermission';
import { PERMISSIONS } from '../permissions/constants';

const router = Router();

// Protect all routes
router.use(requireAuth);

router.get(
    '/',
    requirePermission(PERMISSIONS.USERS_READ),
    userController.getAllUsers
);

export default router;
