import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

const TeamSchema: Schema = new Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
    },
    { timestamps: true }
);

export const Team = mongoose.model<ITeam>('Team', TeamSchema);
