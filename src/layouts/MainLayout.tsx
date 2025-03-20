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
import { PageBreadcrumb } from "@components/PageBreadcrumb/PageBreadcrumb"
import { useAuthStore } from "@store/auth"
import { useThemeStore } from "@store/theme"
import { Avatar, Button, Dropdown, Layout, Menu } from "antd"
import { useEffect, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import styles from "./MainLayout.module.css"

const { Header, Sider, Content } = Layout

const MainLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuthStore()
  const { isDarkMode, toggleTheme } = useThemeStore()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (!mobile && collapsed) {
        setCollapsed(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [collapsed])

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
      if (isMobile) {
        setCollapsed(true)
      }
    }
  }

  return (
    <Layout className={styles.layout}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={`${styles.sider} ${!collapsed && styles.siderVisible}`}>
        <div
          className={`${styles.logo} ${collapsed ? styles.logoCollapsed : ""}`}>
          <img
            src={logo}
            alt='Logo'
          />
        </div>
        <Menu
          mode='inline'
          defaultSelectedKeys={[location.pathname.slice(1)]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 80 : 200,
          transition: "all 0.2s",
        }}>
        <Header className={styles.header}>
          <div className={styles.headerContent}>
            <Button
              type='text'
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <div className={styles.headerRight}>
              <Button
                type='text'
                icon={isDarkMode ? <BulbFilled /> : <BulbOutlined />}
                onClick={toggleTheme}
              />
              <Dropdown
                menu={{
                  items: userMenuItems,
                  onClick: handleMenuClick,
                }}
                placement='bottomRight'>
                <div className={styles.userDropdown}>
                  <Avatar
                    src={user?.avatar}
                    icon={<UserOutlined />}
                  />
                  <span className={styles.userName}>{user?.fullName}</span>
                </div>
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content className={styles.content}>
          <PageBreadcrumb />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
