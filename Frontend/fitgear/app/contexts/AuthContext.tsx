"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = "http://localhost:5209"; // URL вашего бэкенда
axios.defaults.withCredentials = true;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Получение информации о пользователе
  const fetchUserInfo = async () => {
    try {
      const rolesResponse = await axios.get<string[]>(
        `${API_BASE_URL}/api/User/roles`
      );
      console.log("ROLES FROM BACKEND:", rolesResponse.data);
      let roles: string[] = [];
      if (Array.isArray(rolesResponse.data)) {
        roles = rolesResponse.data;
      } else if (rolesResponse.data?.$values) {
        roles = rolesResponse.data.$values;
      } else if (typeof rolesResponse.data === "string") {
        roles = [rolesResponse.data];
      }
      setUser({
        id: "",
        email: "",
        firstName: "",
        lastName: "",
        roles,
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    // eslint-disable-next-line
  }, []);

  // Interceptors для обработки 401 и refresh
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await axios.post(
              `${API_BASE_URL}/api/User/refreshtoken`,
              {},
              { withCredentials: true }
            );
            // После refresh повторяем оригинальный запрос
            return axios(originalRequest);
          } catch (refreshError) {
            await logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        `${API_BASE_URL}/api/User/login`,
        { email, password },
        { withCredentials: true }
      );
      await fetchUserInfo();
      router.push("/announcements"); // Змінюємо перенаправлення на сторінку оголошень
    } catch (error: any) {
      setError(
        error.response?.data?.message || `Помилка входу: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        `${API_BASE_URL}/api/User/register`,
        { firstName, lastName, email, password },
        { withCredentials: true }
      );
      await login(email, password);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Ошибка регистрации. Пожалуйста, попробуйте еще раз."
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/User/logout`,
        {},
        { withCredentials: true }
      );
    } catch {}
    setUser(null);
    router.push("/login");
  };

  // Функція для перевірки ролі користувача
  const hasRole = (role: string): boolean => {
    return Array.isArray(user?.roles) && user?.roles.includes(role);
  };

  console.log("USER:", user);
  console.log("USER IN PAGE:", user);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        register,
        logout,
        loading,
        error,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
