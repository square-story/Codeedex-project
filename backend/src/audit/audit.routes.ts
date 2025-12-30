import { Router } from 'express';
import { auditController } from './audit.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requirePermission } from '../middleware/requirePermission';
import { PERMISSIONS } from '../permissions/constants';

const router = Router();

router.use(requireAuth);

router.get(
    '/',
    requirePermission(PERMISSIONS.AUDIT_READ),
    auditController.getLogs
);

export default router;
