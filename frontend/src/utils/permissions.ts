import type { IResolvedPermission } from "../api/types";

/**
 * Checks if the user has a specific permission.
 * This is for UI logic only (hiding buttons, etc). Security is enforced by backend.
 */
export const hasPermission = (
    userPermissions: IResolvedPermission[] | undefined,
    permissionKey: string
): boolean => {
    if (!userPermissions) return false;
    return userPermissions.some((p) => p.key === permissionKey);
};

/**
 * Gets the scope of a specific permission for the user.
 * Returns 'self', 'team', 'global', or null if not found.
 */
export const getPermissionScope = (
    userPermissions: IResolvedPermission[] | undefined,
    permissionKey: string
): string | null => {
    if (!userPermissions) return null;
    const permission = userPermissions.find((p) => p.key === permissionKey);
    return permission ? permission.scope : null;
};
