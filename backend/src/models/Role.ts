import mongoose, { Schema, Document } from 'mongoose';
import { IPermission, PermissionSchema } from './common';

export interface IRole extends Document {
    name: string;
    permissions: IPermission[];
    createdAt: Date;
    updatedAt: Date;
}

const RoleSchema: Schema = new Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        permissions: [PermissionSchema],
    },
    { timestamps: true }
);

export const Role = mongoose.model<IRole>('Role', RoleSchema);
