import { Request, Response, NextFunction } from 'express';
import { userService } from './user.service';
import { AppError } from '../middleware/errorHandler';

export class UserController {
    private static instance: UserController;

    private constructor() { }

    public static getInstance(): UserController {
        if (!UserController.instance) {
            UserController.instance = new UserController();
        }
        return UserController.instance;
    }

    public getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user || !req.user.userId) {
                throw new AppError('User not authenticated', 401);
            }

            if (!req.permissionScope) {
                throw new AppError('Permission scope not determined', 403);
            }

            const users = await userService.findAll(
                { userId: req.user.userId, teamId: req.user.teamId },
                req.permissionScope
            );

            res.status(200).json({
                success: true,
                count: users.length,
                data: {
                    users,
                },
            });
        } catch (err) {
            next(err);
        }
    };

    public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user || !req.user.userId) {
                throw new AppError('User not authenticated', 401);
            }
            const user = await userService.createUser(req.body, req.user.userId);

            res.status(201).json({
                success: true,
                data: { user }
            });
        } catch (err) {
            next(err);
        }
    };

    public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user || !req.user.userId) {
                throw new AppError('User not authenticated', 401);
            }
            const user = await userService.updateUser(req.params.id, req.body, req.user.userId);

            if (!user) {
                return next(new AppError('No user found with that ID', 404));
            }

            res.status(200).json({
                success: true,
                data: { user }
            });
        } catch (err) {
            next(err);
        }
    };
}

export const userController = UserController.getInstance();
