import { Router } from 'express';
import { roleController } from './role.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requirePermission } from '../middleware/requirePermission';
import { PERMISSIONS } from '../permissions/constants';

const router = Router();

// Protect all routes
router.use(requireAuth);

router.post(
    '/',
    requirePermission(PERMISSIONS.ROLES_CREATE),
    roleController.createRole
);

router.get(
    '/',
    requirePermission(PERMISSIONS.ROLES_READ),
    roleController.getAllRoles
);

export default router;
