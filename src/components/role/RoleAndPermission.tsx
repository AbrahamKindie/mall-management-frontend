import React from 'react';
import { Tabs } from 'antd';
import RoleList from './RoleList';
import PermissionList from './PermissionList';

const RoleAndPermission: React.FC = () => {
  return (
    <div style={{ background: 'transparent', minHeight: 600 }}>
      <Tabs
        defaultActiveKey="roles"
        items={[
          {
            key: 'roles',
            label: 'Roles',
            children: <RoleList />,
          },
          {
            key: 'permissions',
            label: 'Permissions',
            children: <PermissionList />,
          },
        ]}
        style={{ background: 'transparent' }}
      />
    </div>
  );
};

export default RoleAndPermission; 