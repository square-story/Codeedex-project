import { AuditLog, IAuditLog } from '../models/AuditLog';

export class AuditService {
    private static instance: AuditService;

    private constructor() { }

    public static getInstance(): AuditService {
        if (!AuditService.instance) {
            AuditService.instance = new AuditService();
        }
        return AuditService.instance;
    }

    public async recordAudit(
        actorId: string,
        action: string,
        targetResource: string,
        details?: any
    ): Promise<void> {
        try {
            await AuditLog.create({
                performedBy: actorId,
                action,
                targetResource,
                details,
            });
        } catch (error) {
            // Audit logging should essentially be fire-and-forget or at least non-blocking for the main flow,
            // but we should log the error if it fails.
            console.error('FAILED TO RECORD AUDIT LOG:', error);
        }
    }

    public async getLogs(): Promise<IAuditLog[]> {
        return AuditLog.find().sort({ timestamp: -1 }).populate('performedBy', 'email');
    }
}

export const auditService = AuditService.getInstance();
