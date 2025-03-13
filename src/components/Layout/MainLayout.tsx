import {
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { Button, Layout, Menu } from "antd"
import React, { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import styles from "./MainLayout.module.css"

const { Header, Sider, Content } = Layout

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/dashboard"),
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: "Kullanıcılar",
      onClick: () => navigate("/users"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Ayarlar",
      onClick: () => navigate("/settings"),
    },
  ]

  return (
    <Layout className={styles.layout}>
      {/* Mobile Drawer */}
      <div className={styles.mobileDrawer}>
        <Button
          type='text'
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setMobileOpen(!mobileOpen)}
          className={styles.trigger}
        />
      </div>

      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={`${styles.sidebar} ${mobileOpen ? styles.mobileOpen : ""}`}
        breakpoint='lg'
        onBreakpoint={(broken) => {
          setCollapsed(broken)
        }}>
        <div className={styles.logo}>
          <h1>{collapsed ? "LYS" : "Lojistik YS"}</h1>
        </div>
        <Menu
          theme='dark'
          mode='inline'
          defaultSelectedKeys={["dashboard"]}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header className={styles.header}>
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className={styles.trigger}
          />
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
