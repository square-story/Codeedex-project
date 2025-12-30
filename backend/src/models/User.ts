import mongoose, { Schema, Document } from 'mongoose';
import { IPermission, PermissionSchema } from './common';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    roles: mongoose.Types.ObjectId[];
    teamId: mongoose.Types.ObjectId | null;
    directPermissions: IPermission[];
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
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

// Explicitly casting to any to avoid TypeScript overload issues
(UserSchema as any).pre('save', async function (this: any) {
    if (!this.isModified('passwordHash')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    } catch (err: any) {
        throw err;
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = mongoose.model<IUser>('User', UserSchema);
