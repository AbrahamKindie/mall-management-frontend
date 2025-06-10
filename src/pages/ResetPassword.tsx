import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title, Text } = Typography;

const ResetPassword: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      // Replace with your API endpoint for sending reset link
      await api.post('/auth/forgot-password', { email: values.email });
      setSuccess('If this email is registered, a reset link has been sent.');
      form.resetFields();
    } catch (err: any) {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
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
        <Title level={2} style={{ textAlign: 'center', marginBottom: '16px' }}>
          Forgot Password
        </Title>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
          Enter your registered email address, and we'll send you a link to create a new password.
        </Text>
        {success && <Alert type="success" message={success} showIcon style={{ marginBottom: 16 }} />}
        {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
        <Form
          form={form}
          name="reset-password"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input placeholder="Email Address" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Send Reset Link
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Remember your password? <b>Sign in</b></a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPassword; 