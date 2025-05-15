'use client';

import { useState, useEffect } from 'react';
import { Menu, Button } from 'antd';
import { Header } from 'antd/es/layout/layout';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export function AppHeader() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const baseItems = [
      {key: "home", label: <Link href={"/"}>Home</Link>},
      {key: "announcements", label: <Link href={"/announcements"}>Announcements</Link>}
    ];

    if (!loading) {
      if (isAuthenticated) {
        setItems([
          ...baseItems,
          {
            key: "user", 
            label: (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '10px' }}>{user?.email}</span>
                <Button type="link" onClick={logout} danger>Выйти</Button>
              </div>
            )
          }
        ]);
      } else {
        setItems([
          ...baseItems,
          {key: "login", label: <Link href={"/login"}>Login</Link>}
        ]);
      }
    }
  }, [isAuthenticated, loading, user, logout]);

  return (
    <Header>
      <Menu 
        theme="dark"
        mode="horizontal" 
        items={items} 
        style={{flex:1, minWidth: 0}}
      />
    </Header>
  );
}

export default { AppHeader };