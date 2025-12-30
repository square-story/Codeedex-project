export interface User {
    id: string;
    email: string;
    name: string;
    role: "user" | "admin";
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export interface LoginCredentials {
    email: string;
    password?: string; // Optional if using social login
}

export interface RegisterData extends LoginCredentials {
    name: string;
}
