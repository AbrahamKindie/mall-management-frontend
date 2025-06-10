import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Tag, message, Space, Collapse, Checkbox, Select } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import roleService from '../../services/roleService';
import permissionService from '../../services/permissionService';

const { Search } = Input;

const CRUD_ACTIONS = ['CREATE', 'READ', 'UPDATE', 'DELETE'];

const ROLE_STATUS = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
];

const RoleList: React.FC = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<any | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<number[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewRole, setViewRole] = useState<any | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewEditMode, setViewEditMode] = useState(false);
  const [viewForm] = Form.useForm();

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await roleService.getAll();
      setRoles(data);
    } catch {
      setRoles([]);
      message.error('Failed to fetch roles');
    }
    setLoading(false);
  };

  const fetchPermissions = async () => {
    try {
      const data = await permissionService.getAll();
      console.log('Fetched permissions:', data);
      setPermissions(data);
    } catch {
      message.error('Failed to fetch permissions');
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const openModal = (role?: any) => {
    setEditingRole(role || null);
    form.resetFields();
    let permIds: number[] = [];
    if (role) {
      permIds = role.permissions?.map((p: any) => p.id || p.permission?.id) || [];
      form.setFieldsValue({
        name: role.name,
        status: role.status || 'ACTIVE',
        permissions: permIds,
      });
    }
    setSelectedPerms(permIds);
    setModalVisible(true);
    setViewModalVisible(false);
  };

  const handleSubmit = async (values: any) => {
    setSubmitLoading(true);
    try {
      if (editingRole) {
        await roleService.update(editingRole.id, {
          name: values.name,
          status: values.status,
          permissions: selectedPerms.map((id: number) => ({ id })),
        });
        message.success('Role updated');
      } else {
        await roleService.create({
          name: values.name,
          status: values.status,
          permissions: selectedPerms.map((id: number) => ({ id })),
        });
        message.success('Role created');
      }
      setModalVisible(false);
      fetchRoles();
    } catch (err: any) {
      if (err?.response?.data?.message?.includes('Unique constraint failed') || err?.response?.data?.message?.includes('unique') || err?.response?.data?.message?.includes('already exists')) {
        message.error('A role with this name already exists.');
      } else {
        message.error('Failed to save role');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(search.toLowerCase())
  );

  // Group permissions by module for modal
  const groupedByModule = React.useMemo(() => {
    const groups: Record<string, any[]> = {};
    permissions.forEach((perm) => {
      if (!groups[perm.module]) groups[perm.module] = [];
      groups[perm.module].push(perm);
    });
    return groups;
  }, [permissions]);

  // Helper to check if all CRUDs in a module are selected
  const isModuleChecked = (module: string) => {
    const perms = groupedByModule[module] || [];
    return perms.every((p) => selectedPerms.includes(p.id));
  };
  // Helper to check if some CRUDs in a module are selected
  const isModuleIndeterminate = (module: string) => {
    const perms = groupedByModule[module] || [];
    return perms.some((p) => selectedPerms.includes(p.id)) && !isModuleChecked(module);
  };
  // Handler for module checkbox
  const handleModuleCheck = (module: string, checked: boolean) => {
    const perms = groupedByModule[module] || [];
    const permIds = perms.map((p) => p.id);
    setSelectedPerms((prev) => {
      if (checked) {
        // Add all perms for this module
        return Array.from(new Set([...prev, ...permIds]));
      } else {
        // Remove all perms for this module
        return prev.filter((id) => !permIds.includes(id));
      }
    });
  };

  // Whenever selectedPerms changes, update the hidden field:
  useEffect(() => {
    form.setFieldsValue({ permissions: selectedPerms });
  }, [selectedPerms, form]);

  // View role handler
  const handleViewRole = async (roleId: number) => {
    setViewLoading(true);
    setViewEditMode(false);
    try {
      const data = await roleService.getById(roleId);
      setViewRole(data);
      setViewModalVisible(true);
      viewForm.setFieldsValue({
        name: data.name,
        status: data.status || 'ACTIVE',
        permissions: data.permissions?.map((p: any) => p.id) || [],
      });
    } catch {
      message.error('Failed to fetch role details');
    } finally {
      setViewLoading(false);
    }
  };

  const columns = [
    {
      title: 'N/A',
      dataIndex: 'id',
      key: 'id',
      render: (_: any, __: any, idx: number) => idx + 1,
      width: 60,
    },
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: any[]) => (
        <Space wrap>
          {permissions && permissions.length > 0 && permissions.map((p: any) => (
            <Tag
              key={p.id || p.permission?.id}
              style={{ background: '#F4F8FB', color: '#3B4A54', border: 'none', fontWeight: 500, fontSize: 14, padding: '6px 16px', borderRadius: 8 }}
            >
              {p.name || p.permission?.name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button
          icon={<EditOutlined />}
          style={{ borderRadius: 8, background: '#F4F8FB', color: '#3B4A54', border: 'none', fontWeight: 500 }}
          onClick={e => { e.stopPropagation(); openModal(record); }}
        >
          Edit
        </Button>
      ),
      width: 100,
    },
  ];

  return (
    <div style={{ padding: 32, background: '#fff', borderRadius: 16, minHeight: 600 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: 28, margin: 0 }}>Role and Permissions</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ borderRadius: 8, fontWeight: 500, fontSize: 16, padding: '0 24px', height: 48 }}
          onClick={() => openModal()}
        >
          Add Role
        </Button>
      </div>
      <div style={{ marginBottom: 24, maxWidth: 320 }}>
        <Search
          placeholder="Search Roles"
          allowClear
          onChange={e => setSearch(e.target.value)}
          style={{ borderRadius: 8, height: 40 }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={Array.isArray(filteredRoles) ? filteredRoles : []}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5, showSizeChanger: false }}
        style={{ background: 'transparent' }}
        onRow={(record) => ({
          onClick: () => handleViewRole(record.id),
          style: { cursor: 'pointer' },
        })}
      />
      {/* View Role Modal with Edit Mode */}
      <Modal
        title="View Role"
        open={viewModalVisible}
        onCancel={() => { setViewModalVisible(false); setViewEditMode(false); }}
        footer={null}
        width={650}
        centered
        destroyOnClose
      >
        {viewLoading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <span>Loading...</span>
          </div>
        ) : viewRole ? (
          <>
            <Form
              form={viewForm}
              layout="vertical"
              initialValues={{
                name: viewRole.name,
                status: viewRole.status || 'ACTIVE',
                permissions: viewRole.permissions?.map((p: any) => p.id) || [],
              }}
              disabled={!viewEditMode}
            >
              <Form.Item label="Role Name" name="name" rules={[{ required: true, message: 'Role name is required' }]}> 
                <Input autoComplete="off" disabled={!viewEditMode} />
              </Form.Item>
              <Form.Item label="Status" name="status" rules={[{ required: true }]}> 
                <Select options={ROLE_STATUS} disabled={!viewEditMode} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label="Permissions"
                name="permissions"
                rules={[{ validator: (_, value) => (value && value.length > 0 ? Promise.resolve() : Promise.reject(new Error('Role must have at least one permission.'))) }]}
              >
                <div style={{ maxHeight: 300, overflowY: 'auto', paddingRight: 8, border: '1px solid #f0f0f0', borderRadius: 8, padding: 8 }}>
                  <Collapse
                    bordered={false}
                    defaultActiveKey={Object.keys(groupedByModule)}
                    expandIconPosition="end"
                    items={Object.entries(groupedByModule).map(([module, perms]) => ({
                      key: module,
                      label: (
                        <span style={{ fontWeight: 600, fontSize: 16 }}>{module.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Management Permissions</span>
                      ),
                      children: (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                          {CRUD_ACTIONS.map((action) => {
                            const perm = perms.find((p) => p.name === action);
                            return perm ? (
                              <Checkbox
                                key={perm.id}
                                value={perm.id}
                                checked={viewForm.getFieldValue('permissions')?.includes(perm.id)}
                                disabled={!viewEditMode}
                                onChange={e => {
                                  if (!viewEditMode) return;
                                  const checked = e.target.checked;
                                  const prev = viewForm.getFieldValue('permissions') || [];
                                  viewForm.setFieldsValue({
                                    permissions: checked
                                      ? [...prev, perm.id]
                                      : prev.filter((id: number) => id !== perm.id),
                                  });
                                }}
                                style={{
                                  minWidth: 90,
                                  marginBottom: 8,
                                  borderRadius: 8,
                                  border: '1px solid #d9d9d9',
                                  background: viewForm.getFieldValue('permissions')?.includes(perm.id) ? '#1677ff' : '#f4f8fb',
                                  color: viewForm.getFieldValue('permissions')?.includes(perm.id) ? '#fff' : '#3B4A54',
                                  fontWeight: 500,
                                  fontSize: 15,
                                  padding: '8px 18px',
                                  transition: 'all 0.2s',
                                  boxShadow: viewForm.getFieldValue('permissions')?.includes(perm.id) ? '0 2px 8px rgba(22,119,255,0.08)' : undefined,
                                  borderColor: viewForm.getFieldValue('permissions')?.includes(perm.id) ? '#1677ff' : '#d9d9d9',
                                  cursor: viewEditMode ? 'pointer' : 'not-allowed',
                                }}
                              >
                                {action.charAt(0) + action.slice(1).toLowerCase()}
                              </Checkbox>
                            ) : (
                              <span key={action} style={{ minWidth: 90, marginBottom: 8, opacity: 0.3 }}>{action.charAt(0) + action.slice(1).toLowerCase()}</span>
                            );
                          })}
                        </div>
                      ),
                    }))}
                  />
                </div>
              </Form.Item>
            </Form>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32 }}>
              <Button onClick={() => setViewModalVisible(false)} style={{ minWidth: 120, height: 48, fontWeight: 500, fontSize: 16 }} disabled={false}>Close</Button>
              <Button type="primary" onClick={() => {
                setViewModalVisible(false);
                openModal(viewRole);
              }} style={{ minWidth: 120, height: 48, fontWeight: 500, fontSize: 16 }} disabled={false}>Edit</Button>
            </div>
          </>
        ) : null}
      </Modal>
      {/* Edit/Create Role Modal */}
      <Modal
        title={editingRole ? 'Edit Role' : 'Create Role'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnHidden
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            name: editingRole?.name || '',
            status: editingRole?.status || 'ACTIVE',
            permissions: selectedPerms,
          }}
        >
          <Form.Item name="name" label="Role Name" rules={[{ required: true, message: 'Role name is required' }]}> 
            <Input autoComplete="off" onChange={() => form.validateFields(['name'])} />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}> 
            <Select options={ROLE_STATUS} />
          </Form.Item>
          <Form.Item name="permissions" noStyle rules={[{ validator: (_, value) => (value && value.length > 0 ? Promise.resolve() : Promise.reject(new Error('Role must have at least one permission.'))) }]}> 
            <Input type="hidden" />
          </Form.Item>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>Permissions</div>
            {/* Permission validation error display */}
            <Form.Item shouldUpdate noStyle>
              {() => {
                const errors = form.getFieldError('permissions');
                return errors.length ? (
                  <div style={{ color: 'red', marginBottom: 8 }}>{errors[0]}</div>
                ) : null;
              }}
            </Form.Item>
            <div style={{ maxHeight: 300, overflowY: 'auto', paddingRight: 8, border: '1px solid #f0f0f0', borderRadius: 8, padding: 8 }}>
              <Collapse
                bordered={false}
                defaultActiveKey={Object.keys(groupedByModule)}
                expandIconPosition="end"
                items={Object.entries(groupedByModule).map(([module, perms]) => ({
                  key: module,
                  label: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Checkbox
                        checked={isModuleChecked(module)}
                        indeterminate={isModuleIndeterminate(module)}
                        onChange={e => handleModuleCheck(module, e.target.checked)}
                      >
                        <span style={{ fontWeight: 600, fontSize: 16 }}>{module.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Management</span>
                      </Checkbox>
                    </div>
                  ),
                  children: (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                      {CRUD_ACTIONS.map((action) => {
                        const perm = perms.find((p) => p.name === action);
                        return perm ? (
                          <Checkbox
                            key={perm.id}
                            value={perm.id}
                            checked={selectedPerms.includes(perm.id)}
                            onChange={e => {
                              const checked = e.target.checked;
                              setSelectedPerms(prev =>
                                checked
                                  ? [...prev, perm.id]
                                  : prev.filter(id => id !== perm.id)
                              );
                            }}
                            style={{
                              minWidth: 90,
                              marginBottom: 8,
                              borderRadius: 8,
                              border: '1px solid #d9d9d9',
                              background: selectedPerms.includes(perm.id) ? '#1677ff' : '#f4f8fb',
                              color: selectedPerms.includes(perm.id) ? '#fff' : '#3B4A54',
                              fontWeight: 500,
                              fontSize: 15,
                              padding: '8px 18px',
                              transition: 'all 0.2s',
                              boxShadow: selectedPerms.includes(perm.id) ? '0 2px 8px rgba(22,119,255,0.08)' : undefined,
                              borderColor: selectedPerms.includes(perm.id) ? '#1677ff' : '#d9d9d9',
                              cursor: 'pointer',
                            }}
                          >
                            {action.charAt(0) + action.slice(1).toLowerCase()}
                          </Checkbox>
                        ) : (
                          <span key={action} style={{ minWidth: 90, marginBottom: 8, opacity: 0.3 }}>{action.charAt(0) + action.slice(1).toLowerCase()}</span>
                        );
                      })}
                    </div>
                  ),
                }))}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 24 }}>
            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={submitLoading}>{editingRole ? 'Update' : 'Create'} Role</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleList; 