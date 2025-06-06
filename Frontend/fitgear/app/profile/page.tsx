"use client";

import { useEffect, useState } from "react";
import { Card, Spin, Tag, Typography } from "antd";
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
  const [fetchTried, setFetchTried] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let didCancel = false;
    const fetchProfile = async () => {
      setLoading(true);
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
        if (!didCancel) {
          setProfile({
            id: response.data.id,
            email: response.data.email,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            roles,
          });
        }
      } catch {
        if (!didCancel) {
          setProfile(null);
        }
      } finally {
        if (!didCancel) {
          setLoading(false);
          setFetchTried(true);
        }
      }
    };
    fetchProfile();
    return () => {
      didCancel = true;
    };
  }, [router]);

  useEffect(() => {
    if (!loading && fetchTried && !profile) {
      router.push("/login");
    }
  }, [loading, fetchTried, profile, router]);

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
