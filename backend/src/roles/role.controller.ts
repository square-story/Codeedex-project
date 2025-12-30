import { Request, Response, NextFunction } from 'express';
import { roleService } from './role.service';

export class RoleController {
    private static instance: RoleController;

    private constructor() { }

    public static getInstance(): RoleController {
        if (!RoleController.instance) {
            RoleController.instance = new RoleController();
        }
        return RoleController.instance;
    }

    public createRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const role = await roleService.createRole(req.body);

            res.status(201).json({
                success: true,
                data: { role },
            });
        } catch (err) {
            next(err);
        }
    };

    public getAllRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const roles = await roleService.findAll();
            res.status(200).json({
                success: true,
                data: { roles }
            });
        } catch (err) {
            next(err);
        }
    }
}

export const roleController = RoleController.getInstance();
