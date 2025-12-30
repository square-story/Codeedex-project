import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { AppError } from '../middleware/errorHandler';

export class AuthController {
    private static instance: AuthController;

    private constructor() { }

    public static getInstance(): AuthController {
        if (!AuthController.instance) {
            AuthController.instance = new AuthController();
        }
        return AuthController.instance;
    }

    public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw new AppError('Please provide email and password', 400);
            }

            const { token, user } = await authService.login(email, password);

            // Send token in cookie (optional but good for security)
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            });

            res.status(200).json({
                success: true,
                token,
                data: {
                    user,
                },
            });
        } catch (err) {
            next(err);
        }
    };

    public me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // req.user is set by requireAuth middleware
            if (!req.user) {
                throw new AppError('User not found in request', 401);
            }

            res.status(200).json({
                success: true,
                data: {
                    user: req.user,
                },
            });
        } catch (err) {
            next(err);
        }
    };
}

export const authController = AuthController.getInstance();
