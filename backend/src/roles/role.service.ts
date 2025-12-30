import { Role, IRole } from '../models/Role';
import { auditService } from '../audit/audit.service';

export class RoleService {
    private static instance: RoleService;

    private constructor() { }

    public static getInstance(): RoleService {
        if (!RoleService.instance) {
            RoleService.instance = new RoleService();
        }
        return RoleService.instance;
    }

    public async createRole(data: Partial<IRole>, performedBy: string): Promise<IRole> {
        const role = await Role.create(data);
        await auditService.recordAudit(performedBy, 'ROLE_CREATED', `Role:${role._id}`, { name: role.name });
        return role;
    }

    public async findAll(): Promise<IRole[]> {
        return Role.find();
    }
}

export const roleService = RoleService.getInstance();
