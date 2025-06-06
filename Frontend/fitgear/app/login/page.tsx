"use client";

import { useState } from "react";
import { Form, Input, Button, Typography, Card, Divider, Alert } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import Link from "next/link";
import axios from "axios";

const { Title, Text } = Typography;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5209";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_BASE_URL}/api/User/login`, values, {
        withCredentials: true,
      });
      window.location.href = "/announcements";
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Ошибка входа. Проверьте данные."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const returnUrl = window.location.origin + "/announcements";
    window.location.href = `${API_BASE_URL}/api/User/login/google?returnUrl=${encodeURIComponent(
      returnUrl
    )}`;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
          Вход в аккаунт
        </Title>
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: "24px" }}
          />
        )}
        <Form
          form={form}
          name="login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Пожалуйста, введите ваш email!" },
              { type: "email", message: "Введите корректный email!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Пожалуйста, введите ваш пароль!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Пароль"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Войти
            </Button>
          </Form.Item>
        </Form>
        <Divider plain>Или</Divider>
        <Button
          icon={<GoogleOutlined />}
          onClick={handleGoogleLogin}
          block
          size="large"
          style={{ marginBottom: "16px" }}
        >
          Войти через Google
        </Button>
        <Text style={{ textAlign: "center", display: "block" }}>
          Нет аккаунта? <Link href="/register">Зарегистрироваться</Link>
        </Text>
      </Card>
    </div>
  );
}
