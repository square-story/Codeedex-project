import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { config } from '../config/env';

export class AuthService {
    private static instance: AuthService;

    private constructor() { }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    public async login(email: string, password: string): Promise<{ token: string; user: IUser }> {
        const user = await User.findOne({ email }).select('+passwordHash');

        if (!user || !(await user.comparePassword(password))) {
            throw new AppError('Invalid email or password', 401);
        }

        const token = this.signToken(user._id.toString(), user.roles.map(String), user.teamId ? user.teamId.toString() : null);

        // Remove password from output
        user.passwordHash = undefined as any;

        return { token, user };
    }

    private signToken(userId: string, roles: string[], teamId: string | null): string {
        return jwt.sign({ userId, roles, teamId }, config.JWT_SECRET, {
            expiresIn: '1d',
        });
    }
}

export const authService = AuthService.getInstance();
