import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from 'react';

interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
}

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    authenticated: boolean | null;
    userProfile: UserProfile | null;
}

interface AuthContextType {
    authState: AuthState;
    onRegister: (email: string, password: string) => Promise<any>;
    onLogin: (email: string, password: string) => Promise<any>;
    onLogout: () => Promise<any>;
    onRefreshToken: () => Promise<any>;
    getUserProfile: () => Promise<UserProfile>;
    isLoadingProfile: boolean;
}

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
export const API_URL = "http://10.0.2.2:5209/api";

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export const refreshToken = async () => {
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

    if (!refreshToken || !accessToken) {
        throw new Error("No tokens found");
    }

    const result = await axios.post(
        `${API_URL}/User/refreshtoken`,
        {
            accessToken: accessToken,
            refreshToken: refreshToken,
        },
        {
            headers: { "X-Mobile-Client": "true" },
        }
    );

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        result.data as {
            accessToken: string;
            refreshToken: string;
        };

    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, String(newAccessToken));
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, String(newRefreshToken));
    axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    console.log("AuthProvider: Initializing...");

    const [authState, setAuthState] = useState<AuthState>({
        accessToken: null,
        authenticated: false,
        refreshToken: null,
        userProfile: null,
    });
    const [loading, setLoading] = useState(true);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);

    useEffect(() => {
        console.log("AuthProvider: Starting token load...");
        const loadTokens = async () => {
            try {
                const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
                const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
                console.log("AuthProvider: Tokens loaded", {
                    hasAccessToken: !!accessToken,
                    hasRefreshToken: !!refreshToken,
                });

                if (accessToken && refreshToken) {
                    try {
                        console.log("AuthProvider: Validating token...");
                        await axios.get(`${API_URL}/User/validate-token`, {
                            headers: { Authorization: `Bearer ${accessToken}` },
                        });
                        console.log("AuthProvider: Token validation successful");

                        setAuthState({
                            accessToken: accessToken,
                            authenticated: true,
                            refreshToken: refreshToken,
                            userProfile: null,
                        });
                    } catch (error) {
                        console.log("AuthProvider: Token validation failed", error);
                        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
                        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
                        setAuthState({
                            accessToken: null,
                            authenticated: false,
                            refreshToken: null,
                            userProfile: null,
                        });
                    }
                } else {
                    console.log("AuthProvider: No tokens found");
                    setAuthState({
                        accessToken: null,
                        authenticated: false,
                        refreshToken: null,
                        userProfile: null,
                    });
                }
            } catch (error) {
                console.error("AuthProvider: Error loading tokens:", error);
                setAuthState({
                    accessToken: null,
                    authenticated: false,
                    refreshToken: null,
                    userProfile: null,
                });
            } finally {
                console.log("AuthProvider: Finished loading tokens");
                setLoading(false);
            }
        };
        loadTokens();
    }, []);

    if (loading) {
        return null;
    }

    const register = async (email: string, password: string) => {
        console.log("AuthProvider: Starting registration...");
        try {
            const response = await axios.post(`${API_URL}/User/register`, {
                email,
                password,
            });
            console.log("AuthProvider: Registration successful");
            return response.data;
        } catch (error) {
            console.error("AuthProvider: Registration failed:", error);
            throw error;
        }
    };

    const login = async (email: string, password: string) => {
        console.log("AuthProvider: Starting login...");
        try {
            const response = await axios.post(
                `${API_URL}/User/login`,
                { email, password },
                { headers: { "X-Mobile-Client": "true" } }
            );
            console.log("AuthProvider: Login successful");

            const { accessToken, refreshToken } = response.data as {
                accessToken: string;
                refreshToken: string;
            };

            console.log("accessToken:", accessToken, typeof accessToken);
            console.log("refreshToken:", refreshToken, typeof refreshToken);

            setAuthState({
                accessToken,
                authenticated: true,
                refreshToken,
                userProfile: null,
            });

            axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

            await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, String(accessToken));
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, String(refreshToken));
            console.log("AuthProvider: Tokens saved");

            return response.data;
        } catch (error) {
            console.error("AuthProvider: Login failed:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Просто очищаем локальное состояние и токены
            await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
            await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);

            // Очищаем заголовок Authorization
            delete axios.defaults.headers.common["Authorization"];

            // Обновляем состояние
            setAuthState({
                accessToken: null,
                authenticated: false,
                refreshToken: null,
                userProfile: null,
            });
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    const getUserProfile = async (): Promise<UserProfile> => {
        console.log("AuthProvider: Getting user profile...");
        setIsLoadingProfile(true);

        try{
            if (!authState.accessToken) {
                throw new Error("No access token available");
            }

            const response = await axios.get(`${API_URL}/UserProfile/Profile`, {
                headers: {
                    Authorization: `Bearer ${authState.accessToken}`,
                    "X-Mobile-Client": true
                },
            });

            console.log("AuthProvider: Profile loaded successfully");
            const profile = response.data as UserProfile;

            setAuthState(prevState => ({
                ...prevState,
                userProfile: profile,
            }));
            return profile;
        } catch (error: any){
            console.log("AuthProvider: Failed to get user profile:", error);

            if (error.response?.status === 401){
                try {
                    console.log("AuthProvider: Token might be expired, trying to refresh...");
                    await refreshToken();

                    const retryResponse = await axios.get(`${API_URL}/UserProfile/profile`, {
                        headers: {
                            Authorization: `Bearer ${authState.accessToken}`,
                            "X-Mobile-Client": true
                        },
                    });
                    const profile = retryResponse.data as UserProfile;
                    setAuthState(prevState => ({
                        ...prevState,
                        userProfile: profile,
                    }));
                    return profile;
                } catch (refreshError){
                    console.error("AuthProvider: Token refresh failed:", refreshError);
                    await logout();
                    throw new Error("Session expired. Please login again.");
                }
            }
            throw error;
        } finally {
            setIsLoadingProfile(false);
        }
    };

    

    const value: AuthContextType = {
        authState,
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        onRefreshToken: refreshToken,
        getUserProfile,
        isLoadingProfile,
    };

    console.log("AuthProvider: Current state:", {
        loading,
        authenticated: authState.authenticated,
        hasAccessToken: !!authState.accessToken,
        hasRefreshToken: !!authState.refreshToken,
        hasUserProfile: !!authState.userProfile,
    });

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};