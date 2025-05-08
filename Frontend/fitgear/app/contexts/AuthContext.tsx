'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:5209'; // URL вашего бэкенда

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Проверяем наличие токена при загрузке
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // Декодируем JWT для получения данных пользователя
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(window.atob(base64));
          setUser({
            email: payload.email,
            uid: payload.uid,
            roles: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
          });
        } catch (e) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    }
  }, []);

  // Настройка axios для добавления токена к запросам
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Interceptor для автоматического добавления токена к запросам
      const requestInterceptor = axios.interceptors.request.use(
        (config) => {
          const token = localStorage.getItem('accessToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );

      // Interceptor для обработки 401 ошибок (истекший токен)
      const responseInterceptor = axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;
          
          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
              const refreshToken = localStorage.getItem('refreshToken');
              if (!refreshToken) {
                throw new Error("No refresh token available");
              }
              
              const response = await axios.post(`${API_BASE_URL}/api/User/refreshtoken`, { refreshToken });
              
              localStorage.setItem('accessToken', response.data.token);
              localStorage.setItem('refreshToken', response.data.refreshToken);
              
              // Обновляем заголовок и повторяем запрос
              originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
              return axios(originalRequest);
            } catch (refreshError) {
              // Если не удалось обновить токен, выходим из системы
              logout();
              return Promise.reject(refreshError);
            }
          }
          
          return Promise.reject(error);
        }
      );

      // Очищаем interceptors при размонтировании
      return () => {
        axios.interceptors.request.eject(requestInterceptor);
        axios.interceptors.response.eject(responseInterceptor);
      };
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Отправка запроса на ${API_BASE_URL}/api/User/login`);
      const response = await axios.post(`${API_BASE_URL}/api/User/login`, { email, password });
      console.log('Ответ от сервера:', response.data);
      
      localStorage.setItem('accessToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      // Декодируем JWT для получения данных пользователя
      const base64Url = response.data.token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      setUser({
        email: payload.email,
        uid: payload.uid,
        roles: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      });
      
      router.push('/'); // Перенаправление на главную после входа
    } catch (error: any) {
      console.error('Ошибка при входе:', error);
      console.error('Ответ сервера:', error.response?.data);
      setError(error.response?.data?.message || `Ошибка входа: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await axios.post(`${API_BASE_URL}/api/User/register`, { firstName, lastName, email, password });
      
      // После успешной регистрации выполняем вход
      await login(email, password);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Ошибка регистрации. Пожалуйста, попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}