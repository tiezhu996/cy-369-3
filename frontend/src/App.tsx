import { useEffect, useState } from "react";
import { Button, ConfigProvider, Layout, Typography, theme, Menu } from "antd";
import { ApiOutlined, DashboardOutlined, CalendarOutlined } from "@ant-design/icons";
import { fetchOverview } from "./api/client";
import { APP_CODE, APP_NAME, APP_THEME } from "./constants/app";
import { REQUEST_MESSAGES } from "./constants/messages";
import { createFallbackOverview } from "./state/dashboard";
import type { OverviewResponse } from "./types";
import { FeatureStrip } from "./components/FeatureStrip";
import { MetricGrid } from "./components/MetricGrid";
import { OperationsTable } from "./components/OperationsTable";
import { ActivityManagement } from "./components/ActivityManagement";
import { routes } from "./routes";

const { Header, Content, Sider } = Layout;

const menuItems = [
  { key: "/", icon: <DashboardOutlined />, label: "运营总览" },
  { key: "/activities", icon: <CalendarOutlined />, label: "活动管理" },
];

export default function App() {
  const [overview, setOverview] = useState<OverviewResponse>(createFallbackOverview());
  const [notice, setNotice] = useState(REQUEST_MESSAGES.overviewFallback);
  const [currentPage, setCurrentPage] = useState("/");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || "/";
      const validRoute = routes.find((r) => r.path === hash);
      if (validRoute) {
        setCurrentPage(hash);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (currentPage === "/") {
      fetchOverview()
        .then((payload) => {
          setOverview(payload);
          setNotice("后端服务已联通，当前展示实时接口数据。");
        })
        .catch(() => setNotice(REQUEST_MESSAGES.overviewFallback));
    }
  }, [currentPage]);

  const handleMenuClick = ({ key }: { key: string }) => {
    window.location.hash = key;
  };

  const renderPage = () => {
    switch (currentPage) {
      case "/activities":
        return <ActivityManagement />;
      default:
        return (
          <>
            <section className="lead-grid">
              <article className="hero-panel">
                <span className="pill">{notice}</span>
                <Typography.Title level={2}>{overview.appName}</Typography.Title>
                <p>{overview.description}</p>
              </article>
              <MetricGrid items={overview.kpis} />
            </section>
            <FeatureStrip items={overview.features} />
            <section className="work-panel">
              <Typography.Title level={3}>运营任务流</Typography.Title>
              <OperationsTable records={overview.records} />
            </section>
          </>
        );
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: APP_THEME.accent,
          colorText: APP_THEME.ink,
          colorBgBase: APP_THEME.paper,
          borderRadius: 8,
        },
      }}
    >
      <Layout className="app-shell" style={{ minHeight: "100vh" }}>
        <Header className="topbar">
          <div className="brand-block">
            <span className="brand-code">{APP_CODE}</span>
            <h1 className="brand-title">{APP_NAME}</h1>
          </div>
          <Button type="primary" icon={<ApiOutlined />} href={REQUEST_MESSAGES.healthPath}>
            API Health
          </Button>
        </Header>
        <Layout>
          <Sider
            width={200}
            style={{ background: APP_THEME.surface, borderRight: `1px solid ${APP_THEME.accent}20` }}
          >
            <Menu
              mode="inline"
              selectedKeys={[currentPage]}
              items={menuItems}
              onClick={handleMenuClick}
              style={{ height: "100%", borderRight: 0, background: "transparent" }}
            />
          </Sider>
          <Content className="workspace">{renderPage()}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
