import React, { createContext, useState, useEffect, type ReactNode } from "react";
import type { IUser, IResolvedPermission } from "../api/types";
import { authApi } from "../api/auth.api";

interface AuthContextType {
    user: IUser | null;
    permissions: IResolvedPermission[];
    loading: boolean;
    login: (token: string, user: IUser, permissions: IResolvedPermission[]) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [permissions, setPermissions] = useState<IResolvedPermission[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const login = (token: string, newUser: IUser, newPermissions: IResolvedPermission[]) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
        setPermissions(newPermissions);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setPermissions([]);
        window.location.href = "/login";
    };

    const refreshUser = async () => {
        try {
            const { data } = await authApi.getCurrentUser();
            setUser(data.user);
            setPermissions(data.permissions);
        } catch (error) {
            console.error("Failed to refresh user", error);
            // If 401, interceptor will handle logout
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                // Try to load from API to get fresh permissions
                try {
                    await refreshUser();
                } catch (error) {
                    // Fallback/Logout handled by interceptor or errors
                    setLoading(false);
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, permissions, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};
