import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { resolveUserPermissions } from '../permissions/permission.service';

export const requirePermission = (permissionKey: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user || !req.user.userId) {
                return next(new AppError('User not authenticated', 401));
            }

            const permissions = await resolveUserPermissions(req.user.userId);
            console.log(permissions)
            const matchedPermission = permissions.find((p) => p.key === permissionKey);

            if (!matchedPermission) {
                return next(new AppError('You do not have permission to perform this action', 403));
            }

            req.permissionScope = matchedPermission.scope;
            next();
        } catch (err) {
            next(err);
        }
    };
};
