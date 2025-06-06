// app/announcements/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Spin, Alert, Button } from "antd";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { getAllAnnouncements } from "../services/announcements";
import type { Announcement } from "../Models/Announcement";

const { Title } = Typography;

export default function AnnouncementsPage() {
  const { isAuthenticated, user, loading: authLoading, hasRole } = useAuth();
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ВРЕМЕННЫЕ ЛОГИ:
  console.log("isAuthenticated:", isAuthenticated);
  console.log("user:", user);
  console.log("hasRole('User'):", hasRole("User"));

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!hasRole("User")) {
      router.push("/unauthorized");
      return;
    }

    const fetchData = async () => {
      setLoadingData(true);
      setError(null);
      try {
        const data = await getAllAnnouncements();
        setAnnouncements(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Ошибка при загрузке объявлений");
        } else {
          setError("Ошибка при загрузке объявлений");
        }
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [isAuthenticated, authLoading, user, router, hasRole]);

  if (
    authLoading ||
    (!isAuthenticated && !authLoading) ||
    (isAuthenticated && !hasRole("User") && !authLoading)
  ) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated || !hasRole("User")) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Alert
          message="Доступ запрещен. Вы будете перенаправлены."
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (loadingData && isAuthenticated && hasRole("User")) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert message={error} type="error" showIcon style={{ margin: 32 }} />
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Объявления
      </Title>
      <Row gutter={[24, 24]}>
        {announcements.map((a) => (
          <Col xs={24} sm={12} md={8} lg={6} key={a.id}>
            <Card
              title={<span style={{ fontWeight: 600 }}>{a.title}</span>}
              bordered={false}
              style={{ minHeight: 220 }}
              extra={
                <span style={{ fontWeight: 500 }}>{a.pricePerDay}₴/день</span>
              }
            >
              <div style={{ marginBottom: 12 }}>{a.description}</div>
              <Button type="link">Подробнее</Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
