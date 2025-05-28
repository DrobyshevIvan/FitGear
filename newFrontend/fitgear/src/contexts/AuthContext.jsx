import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api.js";

export const AuthContext = createContext(null);
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const hasRole = (role) => Array.isArray(user?.roles) && user.roles.includes(role);

    const getProfile = async () => {
        setLoading(true);
        try {
            const response = await api.get("/api/UserProfile/profile");
            const rolesResponse = await api.get("/api/User/roles");

            let roles = [];
            if (Array.isArray(rolesResponse.data)) {
                roles = rolesResponse.data;
            } else if (rolesResponse.data?.$values) {
                roles = rolesResponse.data.$values;
            } else if (typeof rolesResponse.data === "string") {
                roles = [rolesResponse.data];
            }

            const userData = { ...response.data, roles };
            setUser(userData);
        } catch (e) {
            console.error("[getProfile] error:", e);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        if (user) {
            setError("Ви вже залогінені");
            return; 
        }
        setError(null);
        try {
            const response = await api.post("/api/User/login", { email, password });
            await getProfile();
            setError(null);
            navigate("/");
        } catch (e) {
            setError("Неправильний логін або пароль");
            console.log(e);
        } 
    };

    const register = async (email, password) => {
        setError(null);
        try {
            await api.post("/api/User/register", { email, password});
            await login(email, password);
            setError(null);
        } catch (e) {
            if (e.response && e.response.status === 400) {
                let messages = [];

                if (e.response.data.title === "One or more validation errors occurred.") {
                    const errors = e.response.data.errors;

                    for (const field in errors) {
                        if (Array.isArray(errors[field])) {
                            errors[field].forEach((msg) => {
                                messages.push(`${field}: ${msg}`);
                            });
                        }
                    }
                    setError(messages[0]);
                } else {
                    const errors = e.response.data;
                    for (const key in errors) {
                        if (Array.isArray(errors[key])) {
                            messages = messages.concat(errors[key]);
                        }
                    }
                    setError(messages[0]);
                }
            } else {
                setError("Error! Try again later");
            }
            console.log(e);
        }
    };

    const googleAuth = () => {
        window.location.href = "http://localhost:5209/api/User/login/google?returnUrl=http://localhost:5173/";
    };

    const refreshToken = async () => {
        try {
            await api.post("/api/User/refreshtoken", { userId: user?.id}, { withCredentials: true });            
            await getProfile();
        } catch (e) {
            setUser(null);
            navigate("/login");
            console.log(e);
        }
    }

    const logout = async () => {
        try {
            setUser(null);
            navigate("/");
        } catch (e) {
            console.log(e);
        }
    }
    
    useEffect(() => {
        const fetchUser = async () => {
            await getProfile();
        }
        fetchUser();
    }, []);

    useEffect(() => {
        const responseInterceptor = api.interceptors.response.use(
            response => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        await refreshToken();
                        return api(originalRequest);
                    } catch (refreshError) {
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );
        const interval = setInterval(refreshToken, 10 * 30 * 1000);

        return () => {
            api.interceptors.response.eject(responseInterceptor);
            clearInterval(interval);
        };
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, error, setError, hasRole, googleAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};