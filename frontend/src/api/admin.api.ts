import apiClient from "./client";
import type { IRole } from "./types";

export const adminApi = {
    // Roles
    getRoles: async (): Promise<{ data: { roles: IRole[] } }> => {
        const response = await apiClient.get<{ data: { roles: IRole[] } }>("/roles");
        return response.data;
    },

    createRole: async (roleData: Partial<IRole>): Promise<{ data: { role: IRole } }> => {
        const response = await apiClient.post<{ data: { role: IRole } }>("/roles", roleData);
        return response.data;
    },

    // Audit Logs
    getAuditLogs: async (params?: { limit?: number; page?: number }): Promise<any> => {
        const response = await apiClient.get("/audit-logs", { params });
        return response.data;
    },

    // Teams
    getTeams: async (): Promise<{ data: { teams: any[] } }> => {
        const response = await apiClient.get("/teams");
        return response.data;
    },

    createTeam: async (name: string): Promise<{ data: { team: any } }> => {
        const response = await apiClient.post("/teams", { name });
        return response.data;
    }
};
