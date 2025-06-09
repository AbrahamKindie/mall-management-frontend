import React, { useEffect, useState } from 'react';
import floorService from '../../services/floor.service';
import { unitService } from '../../services/unit.service';
import type { Unit, UnitStatus } from '../../types/unit';
import type { Floor } from '../../types/floor';
import tenantService from '../../services/tenant.service';
import type { Tenant } from '../../types/tenant';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Popconfirm,
  Tag,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';

const UnitList: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [form] = Form.useForm();
  const [assignForm] = Form.useForm();

  const fetchUnits = async () => {
    try {
      const data = await unitService.findAll();
      setUnits(data);
    } catch (error) {
      setUnits([]);
      message.error('Failed to fetch units');
    }
  };

  const fetchFloors = async () => {
    try {
      const data = await floorService.getAll();
      setFloors(data);
    } catch (error) {
      message.error('Failed to fetch floors');
    }
  };

  const fetchTenants = async () => {
    try {
      const data = await tenantService.getAll();
      setTenants(data);
    } catch (error) {
      message.error('Failed to fetch tenants');
    }
  };

  useEffect(() => {
    fetchUnits();
    fetchFloors();
    fetchTenants();
  }, []);

  const handleCreate = () => {
    setEditingUnit(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (unit: Unit) => {
    setEditingUnit(unit);
    form.setFieldsValue(unit);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await unitService.remove(id);
      message.success('Unit deleted successfully');
      fetchUnits();
    } catch (error) {
      message.error('Failed to delete unit');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingUnit) {
        await unitService.update(editingUnit.id, values);
        message.success('Unit updated successfully');
      } else {
        await unitService.create(values);
        message.success('Unit created successfully');
      }
      setModalVisible(false);
      fetchUnits();
    } catch (error) {
      message.error('Failed to save unit');
    }
  };

  const handleAssignTenant = (unit: Unit) => {
    setSelectedUnit(unit);
    assignForm.resetFields();
    setAssignModalVisible(true);
  };

  const handleRemoveTenant = async (unit: Unit) => {
    try {
      await unitService.removeTenant(unit.id);
      message.success('Tenant removed successfully');
      fetchUnits();
    } catch (error) {
      message.error('Failed to remove tenant');
    }
  };

  const handleAssignSubmit = async (values: any) => {
    if (!selectedUnit) return;
    try {
      await unitService.assignTenant(selectedUnit.id, { tenantId: values.tenantId });
      message.success('Tenant assigned successfully');
      setAssignModalVisible(false);
      fetchUnits();
    } catch (error) {
      message.error('Failed to assign tenant');
    }
  };

  const getStatusColor = (status: UnitStatus) => {
    switch (status) {
      case 'VACANT':
        return 'green';
      case 'OCCUPIED':
        return 'blue';
      case 'MAINTENANCE':
        return 'orange';
      case 'RESERVED':
        return 'purple';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Number',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Floor',
      dataIndex: ['floor', 'number'],
      key: 'floor',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => `${size} sq ft`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: UnitStatus) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Tenant',
      dataIndex: ['tenant', 'name'],
      key: 'tenant',
      render: (name: string, record: Unit) => (
        name || 'No tenant'
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Unit) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          {record.status === 'VACANT' ? (
            <Button
              icon={<UserAddOutlined />}
              onClick={() => handleAssignTenant(record)}
            >
              Assign Tenant
            </Button>
          ) : record.tenantId ? (
            <Button
              icon={<UserDeleteOutlined />}
              onClick={() => handleRemoveTenant(record)}
            >
              Remove Tenant
            </Button>
          ) : null}
          <Popconfirm
            title="Are you sure you want to delete this unit?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          Add Unit
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(units) ? units : []}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingUnit ? 'Edit Unit' : 'Create Unit'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="number"
            label="Unit Number"
            rules={[{ required: true, message: 'Please enter unit number' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="floorId"
            label="Floor"
            rules={[{ required: true, message: 'Please select a floor' }]}
          >
            <Select>
              {floors.map(floor => (
                <Select.Option key={floor.id} value={floor.id}>
                  Floor {floor.number} - {floor.mall?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="size"
            label="Size (sq ft)"
            rules={[{ required: true, message: 'Please enter unit size' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            initialValue="VACANT"
          >
            <Select>
              <Select.Option value="VACANT">Vacant</Select.Option>
              <Select.Option value="OCCUPIED">Occupied</Select.Option>
              <Select.Option value="MAINTENANCE">Maintenance</Select.Option>
              <Select.Option value="RESERVED">Reserved</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingUnit ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Assign Tenant"
        open={assignModalVisible}
        onCancel={() => setAssignModalVisible(false)}
        footer={null}
      >
        <Form
          form={assignForm}
          layout="vertical"
          onFinish={handleAssignSubmit}
        >
          <Form.Item
            name="tenantId"
            label="Tenant"
            rules={[{ required: true, message: 'Please select a tenant' }]}
          >
            <Select>
              {tenants.map(tenant => (
                <Select.Option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Assign
              </Button>
              <Button onClick={() => setAssignModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UnitList; 