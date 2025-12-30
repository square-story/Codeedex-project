import mongoose, { Schema, Document } from 'mongoose';
import { IPermission, PermissionSchema } from './common';

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    roles: mongoose.Types.ObjectId[];
    teamId: mongoose.Types.ObjectId | null;
    directPermissions: IPermission[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        passwordHash: { type: String, required: true, select: false },
        roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
        teamId: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
        directPermissions: [PermissionSchema],
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
