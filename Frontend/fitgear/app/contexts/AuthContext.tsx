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

  // Функция выхода должна быть объявлена до использования в useEffect
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

  useEffect(() => {
    // Интервал в миллисекундах (например, 2 минуты)
    const interval = setInterval(async () => {
      try {
        await axios.post(
          `${API_BASE_URL}/api/User/refreshtoken`,
          { userId: user?.id },
          { withCredentials: true }
        );
      } catch {
        // Не вызываем logout сразу, пусть этим займётся interceptor
      }
    }, 110 * 1000); // 1 минута 50 секунд

    return () => clearInterval(interval);
  }, [user]);

  // Получение информации о пользователе
  const fetchUserInfo = async () => {
    try {
      const profileResponse = await axios.get(
        `${API_BASE_URL}/api/UserProfile/profile`
      );
      const rolesResponse = await axios.get(`${API_BASE_URL}/api/User/roles`);
      let roles: string[] = [];
      if (Array.isArray(rolesResponse.data)) {
        roles = rolesResponse.data;
      } else if (rolesResponse.data?.$values) {
        roles = rolesResponse.data.$values;
      } else if (typeof rolesResponse.data === "string") {
        roles = [rolesResponse.data];
      }
      setUser({
        id: profileResponse.data.id,
        email: profileResponse.data.email,
        firstName: profileResponse.data.firstName,
        lastName: profileResponse.data.lastName,
        roles,
      });
    } catch (error: unknown) {
      if ((error as any)?.response?.status !== 401) {
        setUser(null);
      }
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
              { userId: user?.id },
              { withCredentials: true }
            );
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
  }, [logout, user]);

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

export const getAllAnnouncements = async (): Promise<Announcement[]> => {
  const response = await axios.get("http://localhost:5209/api/Announcements", {
    withCredentials: true,
  });
  // Если сервер возвращает .data.$values
  return response.data.$values || [];
};
