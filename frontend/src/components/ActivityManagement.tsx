import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Table,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Space,
  Typography,
  Progress,
  Popconfirm,
  message,
  Descriptions,
  List,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  StopOutlined,
  EyeOutlined,
  TeamOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  fetchActivities,
  fetchActivityStats,
  fetchActivityDetail,
  createActivity,
  updateActivity,
  publishActivity,
  endActivity,
  deleteActivity as deleteActivityApi,
  fetchRegistrations,
} from "../api/client";
import type { Activity, ActivityDetail, ActivityStats, ActivityRegistration } from "../types";
import { REQUEST_MESSAGES } from "../constants/messages";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const statusMap: Record<string, { color: string; text: string }> = {
  draft: { color: "default", text: "草稿" },
  published: { color: "green", text: "已发布" },
  ended: { color: "gray", text: "已结束" },
};

const regStatusMap: Record<string, { color: string; text: string }> = {
  pending: { color: "warning", text: "待确认" },
  confirmed: { color: "green", text: "已确认" },
  cancelled: { color: "red", text: "已取消" },
};

export function ActivityManagement() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [currentDetail, setCurrentDetail] = useState<ActivityDetail | null>(null);
  const [registrations, setRegistrations] = useState<ActivityRegistration[]>([]);
  const [form] = Form.useForm();
  const [notice, setNotice] = useState(REQUEST_MESSAGES.overviewFallback);

  const loadData = async () => {
    setLoading(true);
    try {
      const [activitiesData, statsData] = await Promise.all([
        fetchActivities(),
        fetchActivityStats(),
      ]);
      setActivities(activitiesData);
      setStats(statsData);
      setNotice("后端服务已联通，当前展示实时接口数据。");
    } catch {
      setNotice(REQUEST_MESSAGES.overviewFallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = () => {
    setEditingActivity(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    form.setFieldsValue({
      name: activity.name,
      description: activity.description,
      timeRange: [dayjs(activity.startTime), dayjs(activity.endTime)],
      location: activity.location,
      maxParticipants: activity.maxParticipants,
      fee: activity.fee,
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const [startTime, endTime] = values.timeRange;
      const data = {
        name: values.name,
        description: values.description,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        location: values.location,
        maxParticipants: values.maxParticipants,
        fee: values.fee,
      };

      if (editingActivity) {
        await updateActivity(editingActivity.id, data);
        message.success("活动更新成功");
      } else {
        await createActivity(data);
        message.success("活动创建成功");
      }

      setModalVisible(false);
      loadData();
    } catch {
      message.error("操作失败，请重试");
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await publishActivity(id);
      message.success("活动已发布");
      loadData();
    } catch {
      message.error("发布失败，请重试");
    }
  };

  const handleEnd = async (id: string) => {
    try {
      await endActivity(id);
      message.success("活动已结束");
      loadData();
    } catch {
      message.error("操作失败，请重试");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteActivityApi(id);
      message.success("活动已删除");
      loadData();
    } catch {
      message.error("删除失败，请重试");
    }
  };

  const handleViewDetail = async (activity: Activity) => {
    try {
      const [detail, regs] = await Promise.all([
        fetchActivityDetail(activity.id),
        fetchRegistrations(activity.id),
      ]);
      setCurrentDetail(detail);
      setRegistrations(regs);
      setDetailVisible(true);
    } catch {
      message.error("获取详情失败，请重试");
    }
  };

  const columns: ColumnsType<Activity> = [
    {
      title: "活动名称",
      dataIndex: "name",
      key: "name",
      width: 180,
      render: (text, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
            {text}
          </Button>
        </Space>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => {
        const cfg = statusMap[status];
        return <Tag color={cfg.color}>{cfg.text}</Tag>;
      },
    },
    {
      title: "时间",
      key: "time",
      width: 300,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>
            <CalendarOutlined /> {dayjs(record.startTime).format("YYYY-MM-DD HH:mm")}
          </Text>
          <Text type="secondary">至 {dayjs(record.endTime).format("YYYY-MM-DD HH:mm")}</Text>
        </Space>
      ),
    },
    {
      title: "地点",
      dataIndex: "location",
      key: "location",
      width: 140,
      render: (text) => (
        <Text>
          <EnvironmentOutlined /> {text}
        </Text>
      ),
    },
    {
      title: "费用",
      dataIndex: "fee",
      key: "fee",
      width: 100,
      render: (fee) => (
        <Text strong>
          <DollarOutlined /> ¥{fee}
        </Text>
      ),
    },
    {
      title: "报名进度",
      key: "progress",
      width: 180,
      render: (_, record) => {
        const percent = Math.round((record.currentParticipants / record.maxParticipants) * 100);
        const isFull = record.currentParticipants >= record.maxParticipants;
        return (
          <Space direction="vertical" size={0} style={{ width: "100%" }}>
            <Progress
              percent={percent}
              size="small"
              status={isFull ? "exception" : "active"}
              strokeColor={isFull ? "#b14f3b" : "#3d6b72"}
            />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              <TeamOutlined /> {record.currentParticipants}/{record.maxParticipants} 人
              {isFull && <Tag color="red" style={{ marginLeft: 8 }}>已满员</Tag>}
            </Text>
          </Space>
        );
      },
    },
    {
      title: "操作",
      key: "actions",
      width: 280,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={record.status === "ended"}
          >
            编辑
          </Button>
          {record.status === "draft" && (
            <Button
              type="link"
              icon={<PlayCircleOutlined />}
              onClick={() => handlePublish(record.id)}
            >
              发布
            </Button>
          )}
          {record.status === "published" && (
            <Button type="link" icon={<StopOutlined />} onClick={() => handleEnd(record.id)}>
              结束
            </Button>
          )}
          <Popconfirm
            title="确定要删除这个活动吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="activity-management">
      <div className="lead-grid">
        <div className="hero-panel">
          <span className="pill">{notice}</span>
          <Title level={2}>活动管理</Title>
          <p>管理营地各类活动的发布、报名和进度跟踪。</p>
        </div>
        <section className="metric-grid" aria-label="活动统计">
          <article className="metric-card">
            <span>活动总数</span>
            <strong className="metric-value">{stats?.total ?? 0}</strong>
            <small>个活动</small>
          </article>
          <article className="metric-card">
            <span>已发布</span>
            <strong className="metric-value" style={{ color: "#52c41a" }}>
              {stats?.published ?? 0}
            </strong>
            <small>个进行中</small>
          </article>
          <article className="metric-card">
            <span>草稿</span>
            <strong className="metric-value" style={{ color: "#faad14" }}>
              {stats?.draft ?? 0}
            </strong>
            <small>个待发布</small>
          </article>
          <article className="metric-card">
            <span>报名总数</span>
            <strong className="metric-value" style={{ color: "#3d6b72" }}>
              {stats?.totalRegistrations ?? 0}
            </strong>
            <small>人次报名</small>
          </article>
        </section>
      </div>

      <Card
        className="work-panel"
        title={
          <Space>
            <Title level={3} style={{ margin: 0 }}>
              活动列表
            </Title>
          </Space>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建活动
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={activities}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingActivity ? "编辑活动" : "新建活动"}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="保存"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="活动名称"
            rules={[{ required: true, message: "请输入活动名称" }]}
          >
            <Input placeholder="例如：篝火晚会" />
          </Form.Item>
          <Form.Item
            name="description"
            label="活动描述"
            rules={[{ required: true, message: "请输入活动描述" }]}
          >
            <TextArea rows={3} placeholder="请详细描述活动内容和注意事项" />
          </Form.Item>
          <Form.Item
            name="timeRange"
            label="活动时间"
            rules={[{ required: true, message: "请选择活动时间" }]}
          >
            <RangePicker showTime style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="location"
            label="活动地点"
            rules={[{ required: true, message: "请输入活动地点" }]}
          >
            <Input placeholder="例如：中央篝火广场" />
          </Form.Item>
          <Space style={{ width: "100%" }}>
            <Form.Item
              name="maxParticipants"
              label="人数上限"
              rules={[{ required: true, message: "请输入人数上限" }]}
              style={{ flex: 1, marginBottom: 0 }}
            >
              <InputNumber min={1} style={{ width: "100%" }} placeholder="50" />
            </Form.Item>
            <Form.Item
              name="fee"
              label="费用(元/人)"
              rules={[{ required: true, message: "请输入费用" }]}
              style={{ flex: 1, marginBottom: 0 }}
            >
              <InputNumber min={0} style={{ width: "100%" }} placeholder="68" />
            </Form.Item>
          </Space>
        </Form>
      </Modal>

      <Modal
        title="活动详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={800}
      >
        {currentDetail && (
          <div>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="活动名称" span={2}>
                {currentDetail.name}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusMap[currentDetail.status].color}>
                  {statusMap[currentDetail.status].text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="费用">¥{currentDetail.fee}/人</Descriptions.Item>
              <Descriptions.Item label="开始时间" span={2}>
                {dayjs(currentDetail.startTime).format("YYYY-MM-DD HH:mm")}
              </Descriptions.Item>
              <Descriptions.Item label="结束时间" span={2}>
                {dayjs(currentDetail.endTime).format("YYYY-MM-DD HH:mm")}
              </Descriptions.Item>
              <Descriptions.Item label="地点" span={2}>
                {currentDetail.location}
              </Descriptions.Item>
              <Descriptions.Item label="报名进度" span={2}>
                <Progress
                  percent={Math.round(
                    (currentDetail.currentParticipants / currentDetail.maxParticipants) * 100
                  )}
                  strokeColor="#3d6b72"
                />
                <Text type="secondary">
                  {currentDetail.currentParticipants}/{currentDetail.maxParticipants} 人
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="活动描述" span={2}>
                {currentDetail.description}
              </Descriptions.Item>
            </Descriptions>

            <Title level={4} style={{ marginTop: 24, marginBottom: 16 }}>
              报名列表
            </Title>
            {registrations.length > 0 ? (
              <List
                dataSource={registrations}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Tag color={regStatusMap[item.status].color}>
                        {regStatusMap[item.status].text}
                      </Tag>,
                    ]}
                  >
                    <List.Item.Meta
                      title={item.name}
                      description={
                        <Space>
                          <Text type="secondary">{item.phone}</Text>
                          <Text type="secondary">|</Text>
                          <Text type="secondary">{item.participants}人报名</Text>
                          <Text type="secondary">|</Text>
                          <Text type="secondary">
                            {dayjs(item.registeredAt).format("YYYY-MM-DD HH:mm")}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Text type="secondary">暂无报名记录</Text>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
