import { User, IUser } from '../models/User';
import { SCOPES } from '../permissions/constants';
import { AppError } from '../middleware/errorHandler';

export class UserService {
    private static instance: UserService;

    private constructor() { }

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    public async findAll(
        requester: { userId: string; teamId: string | null },
        scope: string
    ): Promise<IUser[]> {
        let query = {};

        switch (scope) {
            case SCOPES.GLOBAL:
                // Return all users
                query = {};
                break;

            case SCOPES.TEAM:
                // Return users in the same team
                if (!requester.teamId) {
                    throw new AppError('You are not part of any team', 400);
                }
                query = { teamId: requester.teamId };
                break;

            case SCOPES.SELF:
                // Return only the requester
                query = { _id: requester.userId };
                break;

            default:
                // Default to safe option: self
                query = { _id: requester.userId };
                console.warn(`Unknown scope '${scope}' encountered in UserService. Defaulting to SELF.`);
                break;
        }

        // Exclude passwordHash from results
        return User.find(query).select('-passwordHash');
    }

    public async createUser(data: any): Promise<IUser> {
        // Handle password mapping
        if (data.password) {
            data.passwordHash = data.password;
            delete data.password;
        }

        const user = await User.create(data);
        user.passwordHash = undefined as any; // Don't return password
        return user;
    }

    public async updateUser(userId: string, data: Partial<IUser>): Promise<IUser | null> {
        // If updating password, we rely on the pre-save hook, so we need to retrieve, modify, and save.
        // However, for simple updates like roles/teams, findOneAndUpdate is more efficient if not touching password.
        // But since we might update roles/teams which are sensitive, let's treat it standard.
        // For now, let's use findOneAndUpdate for non-password fields for simplicity,
        // assuming password updates go through a specific 'change-password' flow or similar,
        // BUT common admin update might not include password.

        // Actually, to be safe and leverage validation, let's use find -> save pattern if strictly needed,
        // but for administrative updates (roles, teams), findOneAndUpdate is fine.

        // IMPORTANT: If we want to support password update here, we must use save().
        // Let's stick to findByIdAndUpdate for now as it returns the new doc suitable for response.
        // Note: The pre-save hook for password hash ONLY works on save(), not update.

        const user = await User.findByIdAndUpdate(userId, data, {
            new: true,
            runValidators: true,
        }).select('-passwordHash');

        return user;
    }
}

export const userService = UserService.getInstance();
