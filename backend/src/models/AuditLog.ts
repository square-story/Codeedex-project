import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
    action: string;
    performedBy: mongoose.Types.ObjectId;
    targetResource?: string;
    details?: any;
    timestamp: Date;
}

const AuditLogSchema: Schema = new Schema(
    {
        action: { type: String, required: true },
        performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        targetResource: { type: String },
        details: { type: Schema.Types.Mixed },
        timestamp: { type: Date, default: Date.now, immutable: true },
    },
    {
        versionKey: false, // Audit logs shouldn't be versioned often
    }
);

// Prevent updates and deletes on AuditLog
(AuditLogSchema as any).pre('save', function (this: any) {
    if (!this.isNew) {
        throw new Error('Audit logs are immutable.');
    }
});

const preventUpdate = function (this: any, next: (err?: Error) => void) {
    const error = new Error('Audit logs cannot be updated or deleted.');
    next(error);
};

// Explicitly casting to any to avoid TypeScript overload issues with Mongoose middleware types
(AuditLogSchema as any).pre('updateOne', preventUpdate);
(AuditLogSchema as any).pre('findOneAndUpdate', preventUpdate);
(AuditLogSchema as any).pre('deleteOne', preventUpdate);
(AuditLogSchema as any).pre('findOneAndDelete', preventUpdate);
(AuditLogSchema as any).pre('deleteMany', preventUpdate);
(AuditLogSchema as any).pre('updateMany', preventUpdate);


export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
