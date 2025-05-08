'use client';

import { Form, Input, Button, Typography, Card, Divider, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const { register, loading, error } = useAuth();
  const [form] = Form.useForm();

  const onFinish = (values: { firstName: string; lastName: string; email: string; password: string }) => {
    register(values.firstName, values.lastName, values.email, values.password);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      padding: '20px 0'
    }}>
      <Card style={{
        width: '100%',
        maxWidth: '400px',
        padding: '20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
      }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>Регистрация</Title>
        
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '24px' }} />}
        
        <Form
          form={form}
          name="register"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="firstName"
            rules={[{ required: true, message: 'Пожалуйста, введите ваше имя!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Имя" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            name="lastName"
            rules={[{ required: true, message: 'Пожалуйста, введите вашу фамилию!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Фамилия" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Пожалуйста, введите ваш email!' },
              { type: 'email', message: 'Введите корректный email!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Пожалуйста, введите пароль!' },
              { min: 6, message: 'Пароль должен содержать минимум 6 символов!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Пароль" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Подтвердите пароль!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароли не совпадают!'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Подтвердите пароль" 
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
              Зарегистрироваться
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>Или</Divider>
        
        <Text>
          Уже есть аккаунт? <Link href="/login">Войти</Link>
        </Text>
      </Card>
    </div>
  );
}