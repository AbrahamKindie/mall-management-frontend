import React from 'react';
import { Layout, Menu } from 'antd';
import {
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
  ApartmentOutlined,
  HomeOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <Sider
      width={240}
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
      }}
    >
      <div style={{ padding: 24, textAlign: 'center' }}>
        <img src="/logo192.png" alt="Logo" style={{ width: 60, marginBottom: 8 }} />
        <div style={{ fontWeight: 700, fontSize: 20 }}>MedQuizet</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ height: '100%', borderRight: 0, fontSize: 16 }}
          items={[
            {
              key: '/dashboard',
              icon: <AppstoreOutlined />,
              label: <Link to="/dashboard">Dashboard</Link>,
            },
            {
              key: '/roles',
              icon: <TeamOutlined />,
              label: <Link to="/roles">Role and Permissions</Link>,
            },
            {
              key: '/malls',
              icon: <ShopOutlined />,
              label: <Link to="/malls">Mall Management</Link>,
            },
            {
              key: '/floors',
              icon: <ApartmentOutlined />,
              label: <Link to="/floors">Floor Management</Link>,
            },
            {
              key: '/units',
              icon: <HomeOutlined />,
              label: <Link to="/units">Unit Management</Link>,
            },
            {
              key: '/tenants',
              icon: <TeamOutlined />,
              label: <Link to="/tenants">Tenants</Link>,
            },
            {
              key: '/reports',
              icon: <FileTextOutlined />,
              label: <Link to="/reports">Reports</Link>,
            },
          ]}
        />
      </div>
    </Sider>
  );
};

export default Sidebar; 