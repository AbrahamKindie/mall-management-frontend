import React, { useEffect, useState } from 'react';
import mallService from '../../services/mall.service';
import type { Mall } from '../../services/mall.service';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const MallList: React.FC = () => {
  const [malls, setMalls] = useState<Mall[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMall, setEditingMall] = useState<Mall | null>(null);
  const [form] = Form.useForm();

  const fetchMalls = async () => {
    try {
      setLoading(true);
      const data = await mallService.getAll();
      setMalls(data);
    } catch (error) {
      setMalls([]);
      message.error('Failed to fetch malls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMalls();
  }, []);

  const handleCreate = () => {
    setEditingMall(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (mall: Mall) => {
    setEditingMall(mall);
    form.setFieldsValue(mall);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await mallService.remove(id);
      message.success('Mall deleted successfully');
      fetchMalls();
    } catch (error) {
      message.error('Failed to delete mall');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingMall) {
        await mallService.update(editingMall.id, values);
        message.success('Mall updated successfully');
      } else {
        await mallService.create(values);
        message.success('Mall created successfully');
      }
      setModalVisible(false);
      fetchMalls();
    } catch (error) {
      message.error('Failed to save mall');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Floors',
      dataIndex: 'floors',
      key: 'floors',
      render: (floors: any[]) => floors.length,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Mall) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this mall?"
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
          Add Mall
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(malls) ? malls : []}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingMall ? 'Edit Mall' : 'Create Mall'}
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
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter mall name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please enter mall address' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingMall ? 'Update' : 'Create'}
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

export default MallList; 