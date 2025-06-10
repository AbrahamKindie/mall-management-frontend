import React from 'react';
import { Layout, Menu } from 'antd';
import {
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
  ApartmentOutlined,
  HomeOutlined,
  FileTextOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { rowGap } from '@mui/system';

const { Sider } = Layout;

const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '18px 10px 18px 20px',
  borderRadius: 12,
  fontWeight: 500,
  fontFamily: 'sans-serif',
};

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <Sider
      width={280}
      className="site-layout-background"
      style={{
        minHeight: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'sans-serif',
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
        boxShadow: '2px 0 8px rgba(0,0,0,0.03)',
        padding: '20px 0 24px 0',
        marginRight: '32px',
      }}
    >
      <div style={{ padding: '32px 0 24px 0', textAlign: 'center' }}>
        <img src="/logo192.png" alt="Logo" style={{ width: 60, marginBottom: 8 }} />
        <div style={{ fontWeight: 700, fontSize: 20, fontFamily: 'sans-serif' }}>MedQuizet</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: '20px 12px' }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ 
            height: '100%', 
            borderRight: 0, 
            fontSize: 16,
            background: 'transparent',
            fontFamily: 'sans-serif',
            fontWeight: 500,
          }}
          items={[
            {
              key: '/dashboard',
              icon: <AppstoreOutlined />,
              label: <Link to="/dashboard" style={menuItemStyle}>Dashboard</Link>,
              style: location.pathname === '/dashboard' ? { background: '#003e6b', color: '#fff', borderRadius: 12 } : {},
            },
            {
              key: '/roles',
              icon: <TeamOutlined />,
              label: <Link to="/roles" style={menuItemStyle}>Role and Permissions</Link>,
              style: location.pathname === '/roles' ? { background: '#003e6b', color: '#fff', borderRadius: 12 } : {},
            },
            {
              key: '/users',
              icon: <UserOutlined />,
              label: <Link to="/users" style={menuItemStyle}>User Management</Link>,
              style: location.pathname === '/users' ? { background: '#003e6b', color: '#fff', borderRadius: 12 } : {},
            },
            {
              key: '/malls',
              icon: <ShopOutlined />,
              label: <Link to="/malls" style={menuItemStyle}>Mall Management</Link>,
              style: location.pathname === '/malls' ? { background: '#003e6b', color: '#fff', borderRadius: 12 } : {},
            },
            {
              key: '/floors',
              icon: <ApartmentOutlined />,
              label: <Link to="/floors" style={menuItemStyle}>Floor Management</Link>,
              style: location.pathname === '/floors' ? { background: '#003e6b', color: '#fff', borderRadius: 12 } : {},
            },
            {
              key: '/units',
              icon: <HomeOutlined />,
              label: <Link to="/units" style={menuItemStyle}>Unit Management</Link>,
              style: location.pathname === '/units' ? { background: '#003e6b', color: '#fff', borderRadius: 12 } : {},
            },
            {
              key: '/tenants',
              icon: <TeamOutlined />,
              label: <Link to="/tenants" style={menuItemStyle}>Tenants</Link>,
              style: location.pathname === '/tenants' ? { background: '#003e6b', color: '#fff', borderRadius: 12 } : {},
            },
            {
              key: '/reports',
              icon: <FileTextOutlined />,
              label: <Link to="/reports" style={menuItemStyle}>Reports</Link>,
              style: location.pathname === '/reports' ? { background: '#003e6b', color: '#fff', borderRadius: 12 } : {},
            },
          ]}
        />
      </div>
    </Sider>
  );
};

export default Sidebar; 