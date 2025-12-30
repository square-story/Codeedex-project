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
}

export const userService = UserService.getInstance();
