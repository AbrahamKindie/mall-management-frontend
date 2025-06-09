import React from 'react';
import { Input, Avatar, Badge, Dropdown, Menu } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';

const StickyHeader: React.FC = () => {
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
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="profile">Profile</Menu.Item>
              <Menu.Item key="logout">Logout</Menu.Item>
            </Menu>
          }
        >
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <Avatar src="/avatar.png" icon={<UserOutlined />} />
            <div style={{ marginLeft: 8, textAlign: 'left' }}>
              <div style={{ fontWeight: 600 }}>User</div>
              <div style={{ fontSize: 12, color: '#888' }}>admin@gmail.com</div>
            </div>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default StickyHeader; 