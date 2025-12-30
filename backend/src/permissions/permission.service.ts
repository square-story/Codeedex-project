import { User } from '../models/User';
import { IPermission } from '../models/common';
import { Role, IRole } from '../models/Role';

export interface IResolvedPermission {
    key: string;
    scope: string;
}

const isPermissionValid = (permission: IPermission): boolean => {
    const now = new Date();
    if (permission.validFrom && now < permission.validFrom) return false;
    if (permission.validTill && now > permission.validTill) return false;
    return true;
};

export const resolveUserPermissions = async (userId: string): Promise<IResolvedPermission[]> => {
    const user = await User.findById(userId).populate<{ roles: IRole[] }>('roles');

    if (!user) {
        return [];
    }

    const allPermissions: IPermission[] = [];

    // 1. Add permissions from roles
    if (user.roles && user.roles.length > 0) {
        user.roles.forEach((role) => {
            allPermissions.push(...role.permissions);
        });
    }

    // 2. Add direct permissions
    if (user.directPermissions && user.directPermissions.length > 0) {
        allPermissions.push(...user.directPermissions);
    }

    // 3. Filter invalid permissions and normalize
    const validPermissions: IResolvedPermission[] = [];
    const startSet = new Set<string>();

    for (const perm of allPermissions) {
        if (isPermissionValid(perm)) {
            const uniqueKey = `${perm.permissionKey}:${perm.scope}`;
            if (!startSet.has(uniqueKey)) {
                startSet.add(uniqueKey);
                validPermissions.push({
                    key: perm.permissionKey,
                    scope: perm.scope,
                });
            }
        }
    }

    return validPermissions;
};
