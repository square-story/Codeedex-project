import { Router } from 'express';
import { teamController } from './team.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requirePermission } from '../middleware/requirePermission';
import { PERMISSIONS } from '../permissions/constants';

const router = Router();

router.use(requireAuth);

router.get(
    '/',
    requirePermission(PERMISSIONS.TEAMS_READ),
    teamController.getAllTeams
);

router.post(
    '/',
    requirePermission(PERMISSIONS.TEAMS_CREATE),
    teamController.createTeam
);

export default router;
