import React, { useEffect, useState } from 'react';
import floorService from '../../services/floor.service';
import type { Floor } from '../../services/floor.service';
import mallService from '../../services/mall.service';
import type { Mall } from '../../services/mall.service';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  InputNumber,
  Select,
  message,
  Popconfirm,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const FloorList: React.FC = () => {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [malls, setMalls] = useState<Mall[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFloor, setEditingFloor] = useState<Floor | null>(null);
  const [form] = Form.useForm();

  const fetchFloors = async () => {
    try {
      setLoading(true);
      const data = await floorService.getAll();
      setFloors(data);
    } catch (error) {
      setFloors([]);
      message.error('Failed to fetch floors');
    } finally {
      setLoading(false);
    }
  };

  const fetchMalls = async () => {
    try {
      const data = await mallService.getAll();
      setMalls(data);
    } catch (error) {
      message.error('Failed to fetch malls');
    }
  };

  useEffect(() => {
    fetchFloors();
    fetchMalls();
  }, []);

  const handleCreate = () => {
    setEditingFloor(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (floor: Floor) => {
    setEditingFloor(floor);
    form.setFieldsValue(floor);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await floorService.remove(id);
      message.success('Floor deleted successfully');
      fetchFloors();
    } catch (error) {
      message.error('Failed to delete floor');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingFloor) {
        await floorService.update(editingFloor.id, values);
        message.success('Floor updated successfully');
      } else {
        await floorService.create(values);
        message.success('Floor created successfully');
      }
      setModalVisible(false);
      fetchFloors();
    } catch (error) {
      message.error('Failed to save floor');
    }
  };

  const columns = [
    {
      title: 'Number',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Mall',
      dataIndex: ['mall', 'name'],
      key: 'mall',
    },
    {
      title: 'Units',
      dataIndex: 'units',
      key: 'units',
      render: (units: any[]) => units.length,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Floor) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this floor?"
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
          Add Floor
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(floors) ? floors : []}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingFloor ? 'Edit Floor' : 'Create Floor'}
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
            label="Floor Number"
            rules={[{ required: true, message: 'Please enter floor number' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="mallId"
            label="Mall"
            rules={[{ required: true, message: 'Please select a mall' }]}
          >
            <Select>
              {malls.map(mall => (
                <Select.Option key={mall.id} value={mall.id}>
                  {mall.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingFloor ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FloorList; 