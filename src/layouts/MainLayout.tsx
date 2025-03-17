import {
  BulbFilled,
  BulbOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  ShoppingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons"
import logo from "@assets/logo.svg"
import { useAuthStore } from "@store/auth"
import { useThemeStore } from "@store/theme"
import { Avatar, Button, Dropdown, Layout, Menu } from "antd"
import { useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import styles from "./MainLayout.module.css"

const { Header, Sider, Content } = Layout

const MainLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuthStore()
  const { isDarkMode, toggleTheme } = useThemeStore()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "products",
      icon: <ShoppingOutlined />,
      label: "Ürünler",
    },
    {
      key: "users",
      icon: <TeamOutlined />,
      label: "Kullanıcılar",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Ayarlar",
    },
  ]

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profil",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Çıkış Yap",
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      handleLogout()
    } else {
      navigate(key)
    }
  }

  return (
    <Layout className={styles.layout}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme={isDarkMode ? "dark" : "light"}
        className={styles.sider}>
        <div
          className={`${styles.logo} ${collapsed ? styles.logoCollapsed : ""}`}>
          <img
            src={logo}
            alt='Logo'
          />
        </div>
        <Menu
          theme={isDarkMode ? "dark" : "light"}
          mode='inline'
          defaultSelectedKeys={[location.pathname.slice(1)]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout
        style={{ marginLeft: collapsed ? 80 : 200, transition: "all 0.2s" }}>
        <Header
          className={styles.header}
          style={{
            background: isDarkMode ? "#141414" : "#fff",
          }}>
          <div className={styles.headerContent}>
            <Button
              type='text'
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className={styles.toggleButton}
            />
            <div className={styles.headerRight}>
              <Button
                type='text'
                icon={isDarkMode ? <BulbFilled /> : <BulbOutlined />}
                onClick={toggleTheme}
                className={styles.themeButton}
              />

              <Dropdown
                menu={{
                  items: userMenuItems,
                  onClick: handleMenuClick,
                }}
                placement='bottomRight'>
                <div className={styles.userDropdown}>
                  <Avatar icon={<UserOutlined />} />
                  <span className={styles.userName}>{user?.fullName}</span>
                </div>
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content
          className={styles.content}
          style={{
            background: isDarkMode ? "#141414" : "#fff",
          }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
