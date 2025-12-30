export interface IUser {
    _id: string;
    email: string;
    roles: string[]; // Role IDs
    teamId: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ITeam {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface IRole {
    _id: string;
    name: string;
    permissions: IPermission[];
    createdAt: string;
    updatedAt: string;
}

export interface IPermission {
    permissionKey: string;
    scope: 'self' | 'team' | 'global';
    validFrom?: string;
    validTill?: string;
}

export interface IResolvedPermission {
    key: string;
    scope: string;
}

export interface IAuthResponse {
    token: string;
    data: {
        user: IUser;
        permissions: IResolvedPermission[];
    };
}
