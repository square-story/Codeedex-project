import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/";

const apiClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor: Attach JWT token from localStorage
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: Handle 401 Unauthorized (Global Logout)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            // Clear storage and redirect to login/reload
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        } else if (status === 403) {
            console.error("Access Forbidden: You do not have permission for this action.");
            // window.location.href = "/access-denied";
        }

        return Promise.reject(error);
    }
);

export default apiClient;
