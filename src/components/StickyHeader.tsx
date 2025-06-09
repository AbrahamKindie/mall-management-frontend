import React from 'react';
import { Input, Avatar, Badge, Dropdown, Menu } from 'antd';
import { BellOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const StickyHeader: React.FC = () => {
  const navigate = useNavigate();

  const menu = (
    <Menu style={{ minWidth: 200, borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 12 }}>
      <Menu.Item key="account" style={{ padding: '16px 24px', fontSize: 16, display: 'flex', alignItems: 'center', gap: 12 }} onClick={() => navigate('/settings')}>
        <SettingOutlined style={{ fontSize: 18 }} />
        Account Settings
      </Menu.Item>
      <Menu.Item key="logout" style={{ padding: '16px 24px', fontSize: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <LogoutOutlined style={{ fontSize: 18 }} />
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 80,
      }}
    >
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <Input.Search
          placeholder="Search"
          style={{ width: 400, borderRadius: 8, height: 48 }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Badge count={0} size="small">
          <BellOutlined style={{ fontSize: 24, color: '#888' }} />
        </Badge>
        <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight" overlayStyle={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', background: '#fff', borderRadius: 16, padding: '6px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Avatar src="/avatar.png" icon={<UserOutlined />} size={48} />
            <div style={{ marginLeft: 12, textAlign: 'left' }}>
              <div style={{ fontWeight: 600, fontSize: 16 }}>User</div>
              <div style={{ fontSize: 13, color: '#888' }}>admin@gmail.com</div>
            </div>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default StickyHeader; 