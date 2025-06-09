import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  ShopOutlined,
  BankOutlined,
  HomeOutlined,
  TeamOutlined,
  LogoutOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import MallList from './components/mall/MallList';
import FloorList from './components/floor/FloorList';
import UnitList from './components/unit/UnitList';
import TenantList from './components/tenant/TenantList';
import BasicReports from './components/reports/BasicReports';
import Sidebar from './components/Sidebar';
import RoleAndPermission from './components/role/RoleAndPermission';
import StickyHeader from './components/StickyHeader';

const { Header, Content, Sider } = Layout;

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppLayout: React.FC = () => {
  const { logout } = useAuth();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <StickyHeader />
      <Layout>
        <Sider width={200} style={{ background: '#fff', marginTop: 80 }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['dashboard']}
            style={{ height: '100%', borderRight: 0 }}
            items={[
              {
                key: 'dashboard',
                icon: <AppstoreOutlined />,
                label: <Link to="/dashboard">Dashboard</Link>,
              },
              {
                key: 'roles',
                icon: <TeamOutlined />,
                label: <Link to="/roles">Role and Permissions</Link>,
              },
              {
                key: 'malls',
                icon: <ShopOutlined />,
                label: <Link to="/malls">Mall Management</Link>,
              },
              {
                key: 'floors',
                icon: <BankOutlined />,
                label: <Link to="/floors">Floor Management</Link>,
              },
              {
                key: 'units',
                icon: <HomeOutlined />,
                label: <Link to="/units">Unit Management</Link>,
              },
              {
                key: 'tenants',
                icon: <TeamOutlined />,
                label: <Link to="/tenants">Tenants</Link>,
              },
              {
                key: 'reports',
                icon: <HomeOutlined />,
                label: <Link to="/reports">Reports</Link>,
              },
            ]}
          />
        </Sider>
        <Layout style={{ padding: '24px', paddingTop: 104 }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff',
            }}
          >
            <Routes>
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <div style={{ fontSize: 32, fontWeight: 700 }}>Welcome to the Dashboard</div>
                </ProtectedRoute>
              } />
              <Route path="/malls" element={
                <ProtectedRoute>
                  <MallList />
                </ProtectedRoute>
              } />
              <Route path="/floors" element={
                <ProtectedRoute>
                  <FloorList />
                </ProtectedRoute>
              } />
              <Route path="/units" element={
                <ProtectedRoute>
                  <UnitList />
                </ProtectedRoute>
              } />
              <Route path="/tenants" element={
                <ProtectedRoute>
                  <TenantList />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <BasicReports />
                </ProtectedRoute>
              } />
              <Route path="/roles" element={
                <ProtectedRoute>
                  <RoleAndPermission />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
