import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api, setAccessToken } from "../api/api.js";

export const AuthContext = createContext(null);
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const API_BASE = "http://localhost:5209";

    const refreshToken = async () => {
        try {
            const response = await api.post("/api/User/refreshtoken", 
                { userId: user ? user.id : "" }
            );
            console.log(response.data);
            setAccessToken(response.data.title);
            const profileRes = await api.get("/api/UserProfile/profile");
            setUser(profileRes.data);
        } catch (e) {
            console.log(e);
            setUser(null);
            setAccessToken(null);
        }
    }

    useEffect(() => {
        refreshToken();
    }, []);

    const login = async (email, password) => {
        try {
            await api.post("/api/User/login", { email, password });
            await refreshToken();
            navigate("/");
        } catch (e) {
            console.log(e);
        }
        
    };

    const register = async (email, password, firstName, lastName ) => {
        try {
            await api.post("/api/User/register", { email, password, firstName, lastName});
            await login(email, password);
        } catch (e) {
            console.log(e);
        }
    };

    const logout = async () => {
        try {
            setUser(null);
            setAccessToken(null);
            navigate("/login");
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}