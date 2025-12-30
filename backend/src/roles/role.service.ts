import { Role, IRole } from '../models/Role';

export class RoleService {
    private static instance: RoleService;

    private constructor() { }

    public static getInstance(): RoleService {
        if (!RoleService.instance) {
            RoleService.instance = new RoleService();
        }
        return RoleService.instance;
    }

    public async createRole(data: Partial<IRole>): Promise<IRole> {
        const role = await Role.create(data);
        return role;
    }

    public async findAll(): Promise<IRole[]> {
        return Role.find();
    }
}

export const roleService = RoleService.getInstance();
