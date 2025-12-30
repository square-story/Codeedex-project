import { Schema } from 'mongoose';
import { ALL_PERMISSIONS, SCOPES, PermissionScope, PermissionKey } from '../permissions/constants';

export interface IPermission {
    permissionKey: PermissionKey;
    scope: PermissionScope;
    validFrom?: Date;
    validTill?: Date;
}

export const PermissionSchema = new Schema<IPermission>(
    {
        permissionKey: {
            type: String,
            required: true,
            enum: ALL_PERMISSIONS
        },
        scope: {
            type: String,
            default: SCOPES.GLOBAL,
            enum: Object.values(SCOPES)
        },
        validFrom: { type: Date },
        validTill: { type: Date },
    },
    { _id: false }
);
