export type PermissionScope = 'self' | 'team' | 'global';

export const SCOPES: { [key: string]: PermissionScope } = {
    SELF: 'self',
    TEAM: 'team',
    GLOBAL: 'global',
};

export const PERMISSIONS = {
    // User Management
    USERS_READ: 'users:read',
    USERS_CREATE: 'users:create',
    USERS_UPDATE: 'users:update',
    USERS_DELETE: 'users:delete',

    // Role Management
    ROLES_READ: 'roles:read',
    ROLES_CREATE: 'roles:create',
    ROLES_UPDATE: 'roles:update',
    ROLES_DELETE: 'roles:delete',

    // Team Management
    TEAMS_READ: 'teams:read',
    TEAMS_CREATE: 'teams:create',
    TEAMS_UPDATE: 'teams:update',
    TEAMS_DELETE: 'teams:delete',

    // Audit Logs
    AUDIT_READ: 'audit:read',
} as const;

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);
