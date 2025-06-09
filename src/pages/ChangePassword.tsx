import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title, Text } = Typography;

const ChangePassword: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: any) => {
    setAlert(null);
    setLoading(true);
    try {
      await api.patch('/admin-user/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setAlert({ type: 'success', message: 'Password changed successfully.' });
      setTimeout(() => setAlert(null), 4000);
      form.resetFields();
    } catch (error: any) {
      let msg = 'Failed to change password';
      if (error?.response?.data?.message) {
        msg = typeof error.response.data.message === 'string'
          ? error.response.data.message
          : JSON.stringify(error.response.data.message);
      } else if (typeof error?.response?.data === 'string') {
        msg = error.response.data;
      }
      setAlert({ type: 'error', message: msg });
      setTimeout(() => setAlert(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', background: 'transparent', padding: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined style={{ fontSize: 28 }} />}
          style={{ marginRight: 12, color: '#222', fontSize: 24 }}
          onClick={() => navigate('/settings')}
        />
        <div>
          <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Change Password</Title>
          <Text type="secondary">Here you can change your password</Text>
        </div>
      </div>
      {alert && (
        <Alert
          style={{ marginBottom: 24 }}
          message={alert.message}
          type={alert.type}
          showIcon
          closable
          onClose={() => setAlert(null)}
        />
      )}
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 48 }}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[{ required: true, message: 'Please enter your current password' }]}
        >
          <Input.Password size="large" placeholder="current password" />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: 'Please enter a new password' },
            { min: 8, message: 'Password must be at least 8 characters' },
          ]}
        >
          <Input.Password size="large" placeholder="new password" />
        </Form.Item>
        <Form.Item
          label="Confirm New Password"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: 'Please confirm your new password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password size="large" placeholder="confirm new password" />
        </Form.Item>
        <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
          <Button
            size="large"
            style={{ background: '#F5F5F5', borderRadius: 12, minWidth: 120, fontWeight: 500 }}
            onClick={() => navigate('/settings')}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            style={{ borderRadius: 12, minWidth: 180, fontWeight: 500 }}
            loading={loading}
          >
            Change Password
          </Button>
        </div>
      </Form>
      <div style={{ marginTop: 64, color: '#888', fontSize: 15, maxWidth: 500 }}>
        <b>Tip</b><br />
        To create a strong password, include at least 8 characters with a mix of uppercase and lowercase letters, numbers, and special symbols (e.g., @, #, $, !). Avoid using easily guessed words like your name or 'password123'.
      </div>
    </div>
  );
};

export default ChangePassword; 