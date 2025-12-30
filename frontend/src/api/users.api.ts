import apiClient from "./client";
import type { IUser } from "./types";

export const usersApi = {
    getUsers: async (params?: { limit?: number; page?: number }): Promise<{ data: { users: IUser[] } }> => {
        const response = await apiClient.get<{ data: { users: IUser[] } }>("/users", { params });
        return response.data;
    },

    // Admin only
    createUser: async (userData: Partial<IUser> & { password?: string }): Promise<{ data: { user: IUser } }> => {
        const response = await apiClient.post<{ data: { user: IUser } }>("/users", userData);
        return response.data;
    },

    updateUser: async (id: string, userData: Partial<IUser>): Promise<{ data: { user: IUser } }> => {
        const response = await apiClient.put<{ data: { user: IUser } }>(`/users/${id}`, userData);
        return response.data;
    }
};
