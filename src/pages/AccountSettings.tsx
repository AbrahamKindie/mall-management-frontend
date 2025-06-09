import React, { useEffect, useState } from 'react';
import { Tabs, Form, Input, Button, Avatar, Upload, message, Alert } from 'antd';
import { UserOutlined, CameraOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { TabPane } = Tabs;

const AccountSettings: React.FC = () => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('/avatar.png');
  const [alert, setAlert] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  const isAdminUser = user && 'fullName' in user;
  const defaultFullName = isAdminUser
    ? (user as any)?.fullName || ''
    : user?.profile
    ? `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim()
    : user?.email?.split('@')[0] || '';

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: defaultFullName,
        email: user.email,
        phone: isAdminUser ? (user as any)?.phoneNumber || '' : user.profile?.phone || '',
        username: isAdminUser ? (user as any)?.username || '' : user.email?.split('@')[0] || '',
      });

      const profileImg = isAdminUser ? (user as any).profileImage : undefined;
      setAvatarUrl(profileImg ? (profileImg.startsWith('/api/') ? profileImg : `/api${profileImg}`) : '/avatar.png');
    }
  }, [user]);

  const handleAvatarChange = async (info: any) => {
    const file = info.file.originFileObj || info.file;
    if (!file || !file.type.startsWith('image/')) {
      setAlert({ type: 'error', message: 'Only image files (jpg, png, etc.) are allowed' });
      setTimeout(() => setAlert(null), 4000);
      return;
    }
    // Show image preview instantly
    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);
    const formData = new FormData();
    formData.append('profileImage', file);
    try {
      const res = await api.patch('/admin-user/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const serverImg = res.data.user?.profileImage || res.data.profileImage;
      if (serverImg) {
        const imgPath = serverImg.startsWith('/api/') ? serverImg : `/api${serverImg}`;
        setAvatarUrl(imgPath);
      }
      setAlert({ type: 'success', message: 'Profile image updated successfully.' });
      setTimeout(() => setAlert(null), 4000);
    } catch {
      setAlert({ type: 'error', message: 'Failed to upload avatar' });
      setTimeout(() => setAlert(null), 4000);
    }
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    const changed: Record<string, any> = {};
    if (values.fullName !== defaultFullName) changed.fullName = values.fullName;
    if (values.email !== user?.email) changed.email = values.email;
    const oldPhone = isAdminUser ? (user as any)?.phoneNumber || '' : user?.profile?.phone || '';
    const oldUsername = isAdminUser ? (user as any)?.username || '' : user?.email?.split('@')[0] || '';
    if (values.phone !== oldPhone) changed.phoneNumber = values.phone;
    if (values.username !== oldUsername) changed.username = values.username;
    if (Object.keys(changed).length === 0) {
      setAlert({ type: 'info', message: 'No changes detected.' });
      setTimeout(() => setAlert(null), 4000);
      return;
    }
    setSaving(true);
    try {
      await api.patch('/admin-user/me', changed);
      setAlert({ type: 'success', message: 'Profile updated successfully.' });
      setTimeout(() => setAlert(null), 4000);
    } catch {
      setAlert({ type: 'error', message: 'Failed to update account info' });
      setTimeout(() => setAlert(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', padding: 0 }}>
      <h2 style={{ fontWeight: 700, fontSize: 32 }}>Settings</h2>
      <div style={{ color: '#A0A0A0', fontSize: 17, marginBottom: 32 }}>
        Manage your Account settings and preference
      </div>

      <Tabs defaultActiveKey="account" style={{ marginBottom: 32 }}>
        <TabPane tab={<span><UserOutlined /> Account Setting</span>} key="account" />
        <TabPane tab={<span><CameraOutlined /> Notification Setting</span>} key="notification" />
      </Tabs>

      <div style={{ padding: 0 }}>
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
        <h3 style={{ fontSize: 20, marginBottom: 4 }}>Account Information</h3>
        <p style={{ color: '#A0A0A0', fontSize: 15, marginBottom: 32 }}>
          Here you can edit information about yourself
        </p>

        <Form form={form} layout="vertical" style={{ display: 'flex', gap: 40 }}>
          {/* Avatar Section */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', marginBottom: 24 }}>
              <Avatar
                src={avatarUrl}
                size={250}
                style={{ borderRadius: 24, objectFit: 'cover' }}
              />
              <Upload
                showUploadList={false}
                customRequest={({ file, onSuccess, onError }) => {
                  handleAvatarChange({ file }).then(() => onSuccess?.({}, file)).catch(onError);
                }}
              >
                <Button
                  icon={<CameraOutlined />}
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    right: 12,
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                />
              </Upload>
            </div>
          </div>

          {/* Form Section */}
          <div style={{ flex: 2 }}>
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[{ required: true, message: 'Full name is required' }]}
            >
              <Input size="large" />
            </Form.Item>

            <div style={{ display: 'flex', gap: 16 }}>
              <Form.Item
                label="Email Address"
                name="email"
                style={{ flex: 1 }}
                rules={[{ required: true, type: 'email', message: 'Valid email required' }]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phone"
                style={{ flex: 1 }}
              >
                <Input size="large" />
              </Form.Item>
            </div>

            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Username is required' }]}
            >
              <Input size="large" />
            </Form.Item>
          </div>
        </Form>

        <h3 style={{ fontSize: 18, marginTop: 40 }}>Security</h3>

        <Button
          type="text"
          onClick={() => navigate('/settings/change-password')}
          style={{
            width: '100%',
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            padding: '24px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 18,
            fontWeight: 500,
            margin: '16px 0 32px 0',
            color: '#222',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#f5f5f5')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#fff')}
        >
          <span>Change Password</span>
          <span style={{ fontSize: 22, color: '#bbb' }}>&#8250;</span>
        </Button>

        <p style={{ color: '#B0B0B0', fontSize: 14, marginBottom: 32 }}>
          Keep your account secure by regularly updating your password
        </p>

        <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
          <Button
            size="large"
            style={{
              background: '#F5F5F5',
              borderRadius: 12,
              minWidth: 120,
              fontWeight: 500,
            }}
            onClick={() => form.resetFields()}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            loading={saving}
            onClick={handleSave}
            style={{
              borderRadius: 12,
              minWidth: 160,
              fontWeight: 500,
            }}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
