import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Alert, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title, Text } = Typography;

function maskEmail(email: string) {
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;
  return name[0] + '*'.repeat(Math.max(0, name.length - 2)) + name.slice(-1) + '@' + domain;
}

const RESEND_TIMEOUT = 600; // seconds

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/forgot-password', { email: values.email });
      setSubmittedEmail(values.email);
      setResendTimer(RESEND_TIMEOUT);
      message.success('Reset password link sent to your email');
      form.resetFields();
    } catch (err: any) {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!submittedEmail || resendTimer > 0) return;
    setResending(true);
    setError(null);
    try {
      await api.post('/auth/forgot-password', { email: submittedEmail });
      setResendTimer(RESEND_TIMEOUT);
      message.success('Reset password link resent to your email');
    } catch (err: any) {
      setError('Failed to resend reset link. Please try again.');
    } finally {
      setResending(false);
    }
  };

  if (submittedEmail) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
      }}>
        <div style={{ width: 400, maxWidth: '90%', margin: '0 auto' }}>
          <Title level={2} style={{ fontWeight: 700, marginBottom: 0 }}>Reset Password</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 8, marginTop: 4 }}>
            Reset your password here
          </Text>
          <div style={{ marginBottom: 18, color: '#222', fontSize: 15 }}>
            A reset link has been sent to your email address <b>{maskEmail(submittedEmail)}</b>.
          </div>
          <div style={{ marginBottom: 18 }}>
            Didn't receive link?{' '}
            <a
              onClick={handleResend}
              style={{ cursor: resendTimer > 0 ? 'not-allowed' : 'pointer', fontWeight: 500, color: resendTimer > 0 ? '#aaa' : '#1677ff' }}
            >
              {resending ? 'Resending...' : resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend'}
            </a>
          </div>
          {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff',
    }}>
      <div style={{ width: 400, maxWidth: '90%', margin: '0 auto' }}>
        <Title level={2} style={{ fontWeight: 700, marginBottom: 0 }}>Forgot Password</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8, marginTop: 4 }}>
          Reset your password here
        </Text>
        <div style={{ marginBottom: 18, color: '#222', fontSize: 15 }}>
          Enter your registered email address, and we'll send you a link to create a new password. Check your inbox and follow the instructions in the email.
        </div>
        {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
        <Form
          form={form}
          name="forgot-password"
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
            <Input placeholder="Email Address" size="large" style={{ borderRadius: 10 }} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 12 }}>
            <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ borderRadius: 12, background: '#003e6b', border: 'none', fontWeight: 500, fontSize: 16 }}>
              Send Reset Link
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <a onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: '#222' }}>Remember your password? <b>Sign in</b></a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword; 