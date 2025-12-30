import { Request, Response, NextFunction } from 'express';
import { auditService } from './audit.service';

export class AuditController {
    private static instance: AuditController;

    private constructor() { }

    public static getInstance(): AuditController {
        if (!AuditController.instance) {
            AuditController.instance = new AuditController();
        }
        return AuditController.instance;
    }

    public getLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const logs = await auditService.getLogs();

            res.status(200).json({
                success: true,
                count: logs.length,
                data: {
                    logs,
                },
            });
        } catch (err) {
            next(err);
        }
    };
}

export const auditController = AuditController.getInstance();
