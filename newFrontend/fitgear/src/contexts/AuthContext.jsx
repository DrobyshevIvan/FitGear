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

    const API_BASE = "http://localhost:5209";

    const getProfile = async () => {
        try {
            const response = await api.get("/api/UserProfile/profile");
            setUser(response.data);
        } catch (e) {
            setError("Помилка при завантаженні профілю:");
            setUser(null);
        }
    };

    const login = async (email, password) => {
        setError(null);
        try {
            const response = await api.post("/api/User/login", { email, password });

            const token = response.data.userId;
            if (token) {
                localStorage.setItem("accessToken", token);
            } else {
                console.warn("Сервер не повернув accessToken");
            }

            getProfile();
            navigate("/");
        } catch (e) {
            setError("Неправильний логін або пароль");
            console.log(e);
        }
        
    };

    const register = async (email, password, firstName, lastName ) => {
        setError(null);
        try {
            await api.post("/api/User/register", { email, password, firstName, lastName});
            await login(email, password);
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

    const refreshToken = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            console.log(token);
            await api.post("/api/User/refreshtoken", {
                userId: token
            });
            getProfile();
        } catch (e) {
            setUser(null);
        }
    }

    const logout = async () => {
        try {
            localStorage.removeItem("accessToken");
            setUser(null);
            navigate("/login");
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        refreshToken();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            refreshToken();
        }, 10 * 60 * 1000); // 10 хв
        return () => clearInterval(interval);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, error, setError }}>
            {children}
        </AuthContext.Provider>
    );
}