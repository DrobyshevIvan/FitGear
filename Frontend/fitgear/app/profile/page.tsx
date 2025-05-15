"use client";

import { useEffect, useState } from "react";
import { Card, Spin, Tag, Typography, message } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:5209";

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/UserProfile/profile`,
          { withCredentials: true }
        );
        let roles: string[] = [];
        if (Array.isArray(response.data.roles)) {
          roles = response.data.roles;
        } else if (response.data.roles?.$values) {
          roles = response.data.roles.$values;
        }
        setProfile({
          id: response.data.id,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          roles,
        });
      } catch (error: unknown) {
        message.error("Не удалось загрузить профиль пользователя");
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!profile) {
    return <Typography.Text type="danger">Профиль не найден</Typography.Text>;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <Card
        title={<span style={{ fontSize: 24 }}>Профиль пользователя</span>}
        style={{ width: 400, boxShadow: "0 2px 8px #f0f1f2" }}
      >
        <p>
          <b>Имя:</b> {profile.firstName}
        </p>
        <p>
          <b>Фамилия:</b> {profile.lastName}
        </p>
        <p>
          <b>Email:</b> {profile.email}
        </p>
        <p>
          <b>Роли:</b>{" "}
          {profile.roles.map((role) => (
            <Tag color="blue" key={role}>
              {role}
            </Tag>
          ))}
        </p>
        <p style={{ color: "#888", fontSize: 12 }}>ID: {profile.id}</p>
      </Card>
    </div>
  );
}
