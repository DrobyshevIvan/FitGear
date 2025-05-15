"use client";

import { useState, useEffect } from "react";
import { Menu, Button } from "antd";
import { Header } from "antd/es/layout/layout";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

export function AppHeader() {
  const { isAuthenticated, user, logout, loading, hasRole } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const baseItems = [
      { key: "home", label: <Link href={"/"}>Home</Link> },
      {
        key: "announcements",
        label: <Link href={"/announcements"}>Announcements</Link>,
      },
    ];

    if (!loading) {
      if (isAuthenticated) {
        const userMenuItems = [
          ...baseItems,
          // Додаємо пункти меню для модераторів
          ...(hasRole("Moderator")
            ? [
                {
                  key: "create-announcement",
                  label: (
                    <Link href={"/announcements/create"}>
                      Create Announcement
                    </Link>
                  ),
                },
              ]
            : []),
          // Додаємо пункти меню для адміністраторів
          ...(hasRole("Administrator")
            ? [
                {
                  key: "admin-panel",
                  label: <Link href={"/admin"}>Admin Panel</Link>,
                },
              ]
            : []),
          // Додаємо пункти меню для всіх авторизованих користувачів
          {
            key: "profile",
            label: <Link href={"/profile"}>Profile</Link>,
          },
          {
            key: "user",
            label: (
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "10px" }}>{user?.email}</span>
                <Button type="link" onClick={logout} danger>
                  Выйти
                </Button>
              </div>
            ),
          },
        ];

        setItems(userMenuItems);
      } else {
        setItems([
          ...baseItems,
          { key: "login", label: <Link href={"/login"}>Login</Link> },
        ]);
      }
    }
  }, [isAuthenticated, loading, user, logout, hasRole]);

  return (
    <Header>
      <Menu
        theme="dark"
        mode="horizontal"
        items={items}
        style={{ flex: 1, minWidth: 0 }}
      />
    </Header>
  );
}

export default { AppHeader };
