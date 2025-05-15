// pages/login.tsx
import { Form, Input, Button, Typography, Card, Divider, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";
import styles from "../styles/Login.module.css"; // Создайте этот файл для стилей

const { Title, Text } = Typography;

export default function Login() {
  const { login, loading, error } = useAuth();
  const [form] = Form.useForm();

  const onFinish = (values: { email: string; password: string }) => {
    login(values.email, values.password);
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Title level={2} className={styles.title}>
          Вход в аккаунт
        </Title>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className={styles.alert}
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

        <Text>
          Нет аккаунта? <Link href="/register">Зарегистрироваться</Link>
        </Text>
      </Card>
    </div>
  );
}
