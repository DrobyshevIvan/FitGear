// app/components/ProtectedRoute.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Spin } from 'antd';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }

    if (!loading && isAuthenticated && requiredRoles) {
      const hasRequiredRole = requiredRoles.some(role => 
        user?.roles?.includes(role)
      );

      if (!hasRequiredRole) {
        router.push('/unauthorized');
      }
    }
  }, [isAuthenticated, loading, requiredRoles, router, user]);

  if (loading || !isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (requiredRoles) {
    const hasRequiredRole = requiredRoles.some(role => 
      user?.roles?.includes(role)
    );

    if (!hasRequiredRole) return null;
  }

  return <>{children}</>;
}