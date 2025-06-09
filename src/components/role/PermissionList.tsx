import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import permissionService from '../../services/permissionService';

const PermissionList: React.FC = () => {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const data = await permissionService.getAll();
      setPermissions(data);
    } catch {
      setPermissions([]);
      // Optionally handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => `${text} (${record.module})`,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', borderRadius: 16, minHeight: 400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontWeight: 700, fontSize: 22, margin: 0 }}>Permissions</h2>
      </div>
      <Table
        columns={columns}
        dataSource={Array.isArray(permissions) ? permissions : []}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default PermissionList; 