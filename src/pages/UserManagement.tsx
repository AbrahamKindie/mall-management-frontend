import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Modal, Form, Input, Select, Space, Avatar, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FilterOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { AdminUser } from '../types/adminUser';
import { adminUserService } from '../services/adminUser.service';

const statusColors: Record<string, string> = {
  Active: 'green',
  InActive: 'red',
};

const initialForm: Partial<AdminUser> = {
  fullName: '',
  email: '',
  username: '',
  phoneNumber: '',
  role: '',
  status: 'Active',
  password: '',
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [viewUser, setViewUser] = useState<AdminUser | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await adminUserService.getAll();
    setUsers(data);
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (user: AdminUser) => {
    setEditingId(user.id);
    form.setFieldsValue({ ...user, password: '' });
    setModalVisible(true);
    setViewUser(null);
  };

  const handleDelete = async (id: number) => {
    await adminUserService.delete(id);
    fetchUsers();
  };

  const handleModalOk = async () => {
    const values = await form.validateFields();
    if (editingId) {
      await adminUserService.update(editingId, values);
    } else {
      await adminUserService.create(values);
    }
    setModalVisible(false);
    fetchUsers();
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingId(null);
    form.resetFields();
  };

  // Fetch latest admin info when opening view modal
  const handleViewUser = async (user: AdminUser) => {
    if (!user.id) return setViewUser(user);
    setViewLoading(true);
    try {
      const fresh = await adminUserService.getById(user.id);
      setViewUser(fresh);
    } catch {
      setViewUser(user);
    }
    setViewLoading(false);
  };

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status] || 'default'} style={{ minWidth: 70, textAlign: 'center', borderRadius: 16, padding: '0 16px', fontWeight: 500, fontSize: 15 }}>{status}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: AdminUser) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small" style={{ borderRadius: 16, fontWeight: 500 }}>Edit</Button>
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} size="small" danger style={{ borderRadius: 16, fontWeight: 500 }}>Delete</Button>
        </Space>
      ),
    },
  ];

  // View modal fields
  const viewFields = [
    { label: 'Name', value: viewUser?.fullName },
    { label: 'Email', value: viewUser?.email },
    { label: 'Username', value: viewUser?.username },
    { label: 'Phone number', value: viewUser?.phoneNumber },
    { label: 'Role', value: viewUser?.role },
    { label: 'Status', value: viewUser?.status },
  ];

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '32px 32px 16px 32px', minHeight: 600 }}>
      <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 0 }}>User Management</h2>
      <div style={{ marginTop: 24, marginBottom: 8 }}>
        <div style={{ fontWeight: 600, fontSize: 18 }}>List of admins</div>
        <div style={{ color: '#888', fontSize: 14, marginBottom: 18 }}>Manage admin from here</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#bdbdbd', fontSize: 18 }} />}
            placeholder="Search by name"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: 400,
              borderRadius: 24,
              background: '#f7f8fa',
              border: 'none',
              fontSize: 16,
              height: 44,
            }}
            allowClear
          />
          <Button icon={<FilterOutlined />} style={{
            borderRadius: 16,
            height: 44,
            background: '#f7f8fa',
            border: 'none',
            fontWeight: 500,
            fontSize: 16,
            color: '#222',
          }}>Filter</Button>
          <div style={{ flex: 1 }} />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{
            borderRadius: 16,
            height: 44,
            background: '#003e6b',
            fontWeight: 600,
            fontSize: 16,
            padding: '0 32px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: 'none',
          }}>Add User</Button>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 16 }}>
        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 7 }}
          bordered={false}
          style={{ background: 'transparent' }}
          onRow={record => ({
            onClick: () => handleViewUser(record),
            style: { cursor: 'pointer' },
          })}
        />
      </div>
      {/* View Admin Modal */}
      <Modal
        open={!!viewUser}
        onCancel={() => setViewUser(null)}
        footer={null}
        width={600}
        centered
        bodyStyle={{ padding: 40, borderRadius: 32, background: '#fff' }}
        style={{ borderRadius: 32 }}
        title={<div style={{ textAlign: 'center', fontWeight: 700, fontSize: 28 }}>Admin User Information</div>}
        closeIcon={<span style={{ fontSize: 24, color: '#888' }}>×</span>}
      >
        {viewLoading ? (
          <div style={{ textAlign: 'center', margin: 40 }}><Spin size="large" /></div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
              <Avatar
                src={viewUser?.profileImage ? viewUser.profileImage : undefined}
                size={96}
                icon={<UserOutlined />}
                style={{ marginBottom: 24, background: '#e6f7ff', fontSize: 48 }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
              {viewFields.map(f => (
                <div key={f.label} style={{ display: 'flex', flexDirection: 'column', marginBottom: 8 }}>
                  <span style={{ color: '#888', fontSize: 15, marginBottom: 4 }}>{f.label}</span>
                  <Input value={f.value || ''} readOnly style={{ borderRadius: 12, background: '#f7f8fa', fontSize: 16, fontWeight: 500, color: '#222' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <Button onClick={() => setViewUser(null)} style={{ borderRadius: 12, height: 44, minWidth: 120, fontWeight: 600, fontSize: 16 }}>Close</Button>
              <Button type="primary" onClick={() => { setViewUser(null); handleEdit(viewUser!); }} style={{ borderRadius: 12, height: 44, minWidth: 120, fontWeight: 600, fontSize: 16, background: '#003e6b', border: 'none' }}>Edit</Button>
            </div>
          </>
        )}
      </Modal>
      {/* Add/Edit Modal */}
      <Modal
        title={editingId ? 'Edit User' : 'Add User'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingId ? 'Update' : 'Add'}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={initialForm} preserve={false}>
          <Form.Item name="fullName" label="Full Name" rules={[{ required: true, message: 'Please enter full name' }]}> <Input /> </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter email' }]}> <Input /> </Form.Item>
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please enter username' }]}> <Input /> </Form.Item>
          <Form.Item name="phoneNumber" label="Phone Number" rules={[{ required: true, message: 'Please enter phone number' }]}> <Input /> </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Please enter role' }]}> <Input /> </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}> <Select> <Select.Option value="Active">Active</Select.Option> <Select.Option value="InActive">InActive</Select.Option> </Select> </Form.Item>
          {!editingId && (
            <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter password' }]}> <Input.Password /> </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement; 