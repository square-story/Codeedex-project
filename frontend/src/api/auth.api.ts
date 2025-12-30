import apiClient from "./client";
import type { IAuthResponse, IUser, IResolvedPermission } from "./types";

export const authApi = {
    login: async (email: string, password: string): Promise<IAuthResponse> => {
        const response = await apiClient.post<IAuthResponse>("/auth/login", { email, password });
        return response.data;
    },

    getCurrentUser: async (): Promise<{ data: { user: IUser; permissions: IResolvedPermission[] } }> => {
        const response = await apiClient.get<{ data: { user: IUser; permissions: IResolvedPermission[] } }>("/auth/me");
        return response.data;
    },
};
