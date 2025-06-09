import React from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import type { RegisterData } from '../services/auth.service';

const { Title } = Typography;

const Register: React.FC = () => {
  const { register } = useAuth();

  const onFinish = async (values: RegisterData) => {
    try {
      await register(values);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 400, padding: '24px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
          Register
        </Title>
        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="firstName"
            rules={[{ required: true, message: 'Please input your first name!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="First Name" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="lastName"
            rules={[{ required: true, message: 'Please input your last name!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Last Name" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Email" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="Phone Number" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="address"
            rules={[{ required: true, message: 'Please input your address!' }]}
          >
            <Input 
              prefix={<HomeOutlined />} 
              placeholder="Address" 
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register; 