import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AccountSettings from './pages/AccountSettings';
import ChangePassword from './pages/ChangePassword';
import MallManagement from './pages/MallManagement';
import FloorManagement from './pages/FloorManagement';
import UnitManagement from './pages/UnitManagement';
import TenantManagement from './pages/TenantManagement';
import ReportManagement from './pages/ReportManagement';
import UserManagement from './pages/UserManagement';
import RoleManagement from './pages/RoleManagement';
import Sidebar from './components/Sidebar';
import StickyHeader from './components/StickyHeader';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';

const { Content } = Layout;

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    // Don't render anything for protected routes if not authenticated
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <StickyHeader />
      <Sidebar />
      <div
        style={{
          marginLeft: 240, // width of the fixed sidebar
          height: '100vh',
          overflowY: 'auto',
          width: 'calc(100% - 240px)',
          background: '#fff',
        }}
      >
        <div style={{ padding: '24px', paddingTop: 104 }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff',
            }}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<AccountSettings />} />
              <Route path="/settings/change-password" element={<ChangePassword />} />
              <Route path="/malls" element={<MallManagement />} />
              <Route path="/floors" element={<FloorManagement />} />
              <Route path="/units" element={<UnitManagement />} />
              <Route path="/tenants" element={<TenantManagement />} />
              <Route path="/reports" element={<ReportManagement />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/roles" element={<RoleManagement />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </Content>
        </div>
      </div>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Protected routes */}
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
